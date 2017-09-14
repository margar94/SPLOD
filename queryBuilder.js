
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
	querySPARQL = {select:[], labelSelect:[], where:''}; //add other field
	buildQuery();
}


function buildQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot != null){
		
		queryLogicStructure[queryLogicStructureRoot].variable = "?"+queryLogicStructure[queryLogicStructureRoot].label.replace( /[\s -]/g, "") + "_" + queryLogicStructure[queryLogicStructureRoot].index;
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();

			for(var i = currentNode.children.length-1; i>=0; i--){
				if(queryLogicStructure[currentNode.children[i]].type=='concept')
					queryLogicStructure[currentNode.children[i]].variable = currentNode.variable;
				else
					queryLogicStructure[currentNode.children[i]].variable = "?"+queryLogicStructure[currentNode.children[i]].label.replace( /[\s -]/g, "") + "_" + queryLogicStructure[currentNode.children[i]].index;

				if(queryLogicStructure[currentNode.children[i]].type=='something')
					currentNode.variable = queryLogicStructure[currentNode.children[i]].variable;

				visitStack.push(queryLogicStructure[currentNode.children[i]]);
			}

			visitSPARQL(currentNode);
		}
		querySPARQL.limit = 20;
		executor.executeUserQuery(querySPARQL);
	}

	console.log(querySPARQL);
}

function visitSPARQL(node){
	// select management
	if(!(node.type == 'predicate' && node.direction == 'reverse')){

		if(($.inArray(node.variable, querySPARQL.select))<0){
			querySPARQL.select.push(node.variable);
			querySPARQL.labelSelect.push(node.label);
		}

	}
	
	// where management
	if(node.type == 'something'){
		//...
	}else if(node.type == 'concept'){
		querySPARQL.where += node.variable + " a <" + node.url + ">.\n";
	}else if(node.type == 'predicate'){
		var parentVariable;
		if(node.parent == null)
			parentVariable = '?_'; // useless variable
		else
			parentVariable = queryLogicStructure[node.parent].variable;
		if(node.direction == 'direct'){
			querySPARQL.where += parentVariable + " <" + node.url + "> " + node.variable + ".\n";
		}
		else{
			querySPARQL.where += node.variable + " <" + node.url + "> " + parentVariable + ".\n";
		}
	}else{
		// other node
	}		

}



