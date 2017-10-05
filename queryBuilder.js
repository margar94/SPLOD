
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
	querySPARQL = {select:[], labelSelect:[], keySelect:[], where:[]}; //add other field
	buildQuery();
}


function buildQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot != null){
		
		queryLogicStructure[queryLogicStructureRoot].variable = "?"+createVariableFromLabel(queryLogicStructure[queryLogicStructureRoot].label, queryLogicStructure[queryLogicStructureRoot].index);
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();

			if(currentNode.type=='operator' || 
				   currentNode.parent==null || 
						!(queryLogicStructure[currentNode.parent].type=='operator' 
								&& queryLogicStructure[currentNode.parent].label=='not')){

				for(var i = currentNode.children.length-1; i>=0; i--){

					if(i>0 && ((i%2)==0)){
						if(queryLogicStructure[currentNode.children[i-1]].type=='operator' &&
							queryLogicStructure[currentNode.children[i-1]].label=='or')
								visitStack.push({type:'closeOr', parent:currentNode.key, children:[]});
					}

					if(!(currentNode.type == 'predicate' && currentNode.direction == 'reverse')
						&& queryLogicStructure[currentNode.children[i]].type=='concept')
							queryLogicStructure[currentNode.children[i]].variable = currentNode.variable;
					else
						queryLogicStructure[currentNode.children[i]].variable = "?"+createVariableFromLabel(queryLogicStructure[currentNode.children[i]].label, queryLogicStructure[currentNode.children[i]].index);

					visitStack.push(queryLogicStructure[currentNode.children[i]]);

				}

				if(currentNode.type == 'predicate' && currentNode.direction == 'reverse') // i have only a child
					currentNode.variable = queryLogicStructure[currentNode.children[0]].variable;
			}

			visitSPARQL(currentNode);
		}
		//querySPARQL.limit = false;
	}

	executor.executeUserQuery(querySPARQL);

	console.log(querySPARQL);
}

function visitSPARQL(node){

	//it is used only by predicates
	var parentVariable;

	// select management
	if(!(node.type == 'predicate' && node.direction == 'reverse')){
		if(node.type != 'operator' && node.type != 'result' && node.type != 'closeOr'){

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
	var claus = [];
	if(node.type == 'something'){
		//...
	}else if(node.type == 'concept'){
		claus.push(node.variable);
		claus.push(' a');
		claus.push(' <' + node.url + '>.');
	}else if(node.type == 'predicate'){
		
		var addNot = false;
		if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
			addNot = true;

		if(addNot){
			claus.push('FILTER(!EXISTS(');
		}

		if(node.direction == 'direct'){
			claus.push(parentVariable);
			claus.push(' <' + node.url + '>');
			claus.push(' '+node.variable+'.');
		}
		else{
			claus.push(node.variable);
			claus.push(' <' + node.url + '>');
			claus.push(' '+parentVariable+'.');
		}

		if(addNot){
			claus.push('))');
		}

	}else if(node.type == 'operator'){

		parentVariable = queryLogicStructure[node.parent].variable;

		var notLabel = "";
		if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
			notLabel = "!";

		var operatorLabel = node.label;

		switch(node.label){
			case 'is url': 
				claus.push('FILTER(');
				claus.push(parentVariable);
				claus.push(notLabel);
				claus.push('=');
				claus.push('<'+queryLogicStructure[node.children[0]].label+'>');
				claus.push(')');
				break;
			
			case 'is string': 
				claus.push('FILTER(');
				claus.push(parentVariable);
				claus.push(notLabel);
				claus.push('=');
				claus.push('"'+queryLogicStructure[node.children[0]].label+'"');
				claus.push(')');
				break;

			case 'contains': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('contains(lcase('+parentVariable+'),lcase("'+queryLogicStructure[node.children[0]].label+'"))');
				claus.push(')');
				break;

			case 'starts with': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('strStarts(lcase('+parentVariable+'),lcase("'+queryLogicStructure[node.children[0]].label+'"))');
				claus.push(')');
				break;

			case 'ends with': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('strEnds(lcase('+parentVariable+'),lcase("'+queryLogicStructure[node.children[0]].label+'"))');
				claus.push(')');
				break;

			case 'lang': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('LANG('+parentVariable+')="'+queryLogicStructure[node.children[0]].label+'"');
				claus.push(')');
				break;
			
			case '<': 
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = ">=";
				//se padre not operatorLabel = '>='; 
			case '<=':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = ">";
				//se padre not operatorLabel = '>'; 
			case '>':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = "<=";
				//se padre not operatorLabel = '<='; 
			case '>=':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = "<";
				//se padre not operatorLabel = '<'; 
			case '=':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = "!=";
				//se padre not operatorLabel = '!='; 
				claus.push('FILTER(');
				claus.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
				claus.push(')');
				break;
			case 'range':
				//se padre not riscriviamo query else
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not'){
					claus.push('FILTER(');
					claus.push(parentVariable+' < '+queryLogicStructure[node.children[0]].label+' || '+parentVariable+' > '+queryLogicStructure[node.children[1]].label);
					claus.push(')');
				}else{
					claus.push('FILTER(');
					claus.push(parentVariable+' >= '+queryLogicStructure[node.children[0]].label+' && '+parentVariable+' <= '+queryLogicStructure[node.children[1]].label);
					claus.push(')');
				}	
				break;

			case 'or':
				var lastClaus = querySPARQL.where.pop();
				querySPARQL.where.push(['{']);
				querySPARQL.where.push(lastClaus);
				claus.push('}UNION{');
				break;
			case 'and':
				break;

			case 'not':
				break;

		}

	}else if(node.type == 'closeOr'){
		claus = querySPARQL.where.pop();
		claus.push('}');
	}else{
		//other node
	}		

	querySPARQL.where.push(claus);

}

function createVariableFromLabel(label, index){
	return label.replace( /[\s - \' \\ \/ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] \! \@ \# \% \^ \& \= \; \: \" \, \< \> ]/g, "") + "_" + index;
}



