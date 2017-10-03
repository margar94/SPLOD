
var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;
var querySPARQL;

var executor;

var QueryBuilder = function () {
	if(QueryBuilder.prototype._singletonInstance){
		return QueryBuilder.prototype._singletonInstance;
	}
	
	counter = 1;
	executor = new QueryExecutor();

	QueryBuilder.prototype._singletonInstance = this;
};

QueryBuilder.prototype.updateQuery = function(queryLogicRoot, queryLogicMap){
	queryLogicStructure = queryLogicMap;
	queryLogicStructureRoot = queryLogicRoot;
	visitStack = [];
	querySPARQL = {select:[], labelSelect:[], keySelect:[], where:''}; //add other field
	buildQuery();
}


function buildQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot != null){
		
		queryLogicStructure[queryLogicStructureRoot].variable = "?"+createVariableFromLabel(queryLogicStructure[queryLogicStructureRoot].label, queryLogicStructure[queryLogicStructureRoot].index);
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();

			for(var i = currentNode.children.length-1; i>=0; i--){
				if(!(currentNode.type == 'predicate' && currentNode.direction == 'reverse')
					&& queryLogicStructure[currentNode.children[i]].type=='concept')
						queryLogicStructure[currentNode.children[i]].variable = currentNode.variable;
				else
					queryLogicStructure[currentNode.children[i]].variable = "?"+createVariableFromLabel(queryLogicStructure[currentNode.children[i]].label, queryLogicStructure[currentNode.children[i]].index);

				visitStack.push(queryLogicStructure[currentNode.children[i]]);
			}

			if(currentNode.type == 'predicate' && currentNode.direction == 'reverse') // i have only a child
				currentNode.variable = queryLogicStructure[currentNode.children[0]].variable;

			visitSPARQL(currentNode);
		}
		querySPARQL.limit = 20;
	}

	executor.executeUserQuery(querySPARQL);

	console.log(querySPARQL);
}

function visitSPARQL(node){

	//it is used only by predicates
	var parentVariable;

	// select management
	if(!(node.type == 'predicate' && node.direction == 'reverse')){
		if(node.type != 'operator' && node.type != 'result'){

			if(($.inArray(node.variable, querySPARQL.select))<0){
				querySPARQL.select.push(node.variable);
				querySPARQL.labelSelect.push(node.label);
				querySPARQL.keySelect.push(node.key);
			}

			if(node.parent==null)
				parentVariable = "?_";
			else
				parentVariable = queryLogicStructure[node.parent].variable;
		}

	}else{ // node is a reverse predicate
		if(node.parent == null){
			parentVariable = "?"+createVariableFromLabel(node.label, node.index);
			querySPARQL.select.push(parentVariable);
			querySPARQL.labelSelect.push(node.label);
			querySPARQL.keySelect.push(node.key);
		}
		else{
			parentVariable = queryLogicStructure[node.parent].variable;
		}
	}
	
	// where management
	if(node.type == 'something'){
		//...
	}else if(node.type == 'concept'){
		querySPARQL.where += node.variable + " a <" + node.url + ">.\n";
	}else if(node.type == 'predicate'){
		if(node.direction == 'direct'){
			querySPARQL.where += parentVariable + " <" + node.url + "> " + node.variable + ".\n";
		}
		else{
			querySPARQL.where += node.variable + " <" + node.url + "> " + parentVariable + ".\n";
		}
	}else if(node.type == 'operator'){

		parentVariable = queryLogicStructure[node.parent].variable;

		switch(node.label){
			case 'is_url': querySPARQL.where += 'FILTER('+parentVariable+'=<'+queryLogicStructure[node.children[0]].label+'>)'; break;
			case 'is_string': querySPARQL.where += 'FILTER('+parentVariable+'="'+queryLogicStructure[node.children[0]].label+'")'; break;
			case 'contains': querySPARQL.where += 'FILTER(regex('+parentVariable+',"'+queryLogicStructure[node.children[0]].label+'","i"))'; break;
			case 'starts with': querySPARQL.where +='FILTER(regex('+parentVariable+',"^'+queryLogicStructure[node.children[0]].label+'","i"))'; break;
			case 'ends with': querySPARQL.where += 'FILTER(regex('+parentVariable+',"'+queryLogicStructure[node.children[0]].label+'$","i"))'; break;
			case 'lang': querySPARQL.where += 'FILTER(LANG('+parentVariable+')="'+queryLogicStructure[node.children[0]].label+'")'; break;
			case '<': 
			case '<=':
			case '>':
			case '>=':
			case '=':
				querySPARQL.where += 'FILTER('+parentVariable+' '+node.label+' '+queryLogicStructure[node.children[0]].label+')';
				break;
			case 'range':
				querySPARQL.where += 'FILTER('+parentVariable+' >= '+queryLogicStructure[node.children[0]].label+' && '+parentVariable+' <= '+queryLogicStructure[node.children[1]].label+')';
				break;

		}

	}else{
		// other node
	}		

}

function createVariableFromLabel(label, index){
	return label.replace( /[\s - \' \\ \/ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] \! \@ \# \% \^ \& \= \; \: \" \, \< \> ]/g, "") + "_" + index;
}



