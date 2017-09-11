
var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;
var querySPARQL;
var counter;

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
	querySPARQL = {select:'', where:''}; //add other field
	buildQuery();
}


function buildQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot != null){
		
		queryLogicStructure[queryLogicStructureRoot].variable = "?"+queryLogicStructure[queryLogicStructureRoot].label.replace( /\s/g, "") + "_" + counter++;
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();
			visitSPARQL(currentNode);

			for(var i = currentNode.children.length-1; i>=0; i--){
				if(queryLogicStructure[currentNode.children[i]].type=='concept')
					queryLogicStructure[currentNode.children[i]].variable = "?"+currentNode.variable;
				else
					queryLogicStructure[currentNode.children[i]].variable = "?"+queryLogicStructure[currentNode.children[i]].label.replace( /\s/g, "") + "_" + counter++;

				visitStack.push(queryLogicStructure[currentNode.children[i]]);
			}
		}

		executor.executeUserQuery(querySPARQL);
	}

	console.log(querySPARQL);
}

function visitSPARQL(node){
	if(node.type == 'something'){
		// ...
	}else if(node.type == 'concept'){

		querySPARQL.select += node.variable + " ";
		querySPARQL.where += node.variable + " a " + node.url + ".\n";

	}else if(node.type == 'predicate'){
		if(node.direction == 'direct'){
			querySPARQL.where += queryLogicStructure[node.parent].variable + " " + node.url + " " + node.variable + ".\n";
		}
		else{
			querySPARQL.where += node.variable + " " + node.url + " " + queryLogicStructure[node.parent].variable + ".\n";
		}
	}else{
		// other node
	}		

}



