var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;

var queryViewer;

var predicatesCounter;

var keyElementOnFocus;

var QueryVerbalizator = function () {
	if(QueryVerbalizator.prototype._singletonInstance){
		return QueryVerbalizator.prototype._singletonInstance;
	}

	queryViewer = new QueryViewer();
	resetPredicatesCounter();

	QueryVerbalizator.prototype._singletonInstance = this;
};

QueryVerbalizator.prototype.updateQuery = function(queryRoot, queryMap, elementOnFocus){
	visitStack = [];
	queryLogicStructureRoot = queryRoot;
	queryLogicStructure = queryMap;
	keyElementOnFocus = elementOnFocus;
	verbalizeQuery();
}

function verbalizeQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot != null){

		// complete map's info with predicatesCounter
		if(queryLogicStructure[queryLogicStructureRoot].type=='concept')
			queryLogicStructure[queryLogicStructureRoot].predicatesCounter = 0;
		else
			queryLogicStructure[queryLogicStructureRoot].predicatesCounter = 1;
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();
			currentNode.verbalization.current = currentNode.verbalization.standard;
			visitVerbalizator(currentNode);

			for(var i = currentNode.children.length-1; i>=0; i--){
				//update predicatesCouter
				if(queryLogicStructure[currentNode.children[i]].type=='concept'){
					if(currentNode.type == 'predicate')
						queryLogicStructure[currentNode.children[i]].predicatesCounter = queryLogicStructure[currentNode.key].predicatesCounter+1;
					else
						queryLogicStructure[currentNode.children[i]].predicatesCounter = 0;
				}

				else if(queryLogicStructure[currentNode.children[i]].type=='something')
					queryLogicStructure[currentNode.children[i]].predicatesCounter = 0;
				else
					queryLogicStructure[currentNode.children[i]].predicatesCounter = queryLogicStructure[currentNode.key].predicatesCounter+1;
				visitStack.push(queryLogicStructure[currentNode.children[i]]);
			}

		}

	}

	queryViewer.updateQuery(queryLogicStructureRoot, queryLogicStructure, keyElementOnFocus);

}

function visitVerbalizator(node){
	if(node.parent == null) // root
		node.verbalization.current = node.verbalization.first;
	else if(node.type == 'concept'){
		if(queryLogicMap[node.parent].type == 'concept')
			node.verbalization.current = node.verbalization.modified;
		else if(queryLogicMap[node.parent].type == 'predicate' && queryLogicMap[node.parent].direction == 'direct'){ 
			node.verbalization.current = node.verbalization.truncated;
			if(node.predicatesCounter%2 == 0){
				queryLogicMap[node.parent].verbalization.current = queryLogicMap[node.parent].verbalization.modified;
			}
		}
	}
	else if(node.type == 'predicate'){
		if(queryLogicMap[node.parent].type == 'predicate' && queryLogicMap[node.parent].direction == 'direct'){
			if(node.predicatesCounter%2 == 0){
				queryLogicMap[node.parent].verbalization.current = queryLogicMap[node.parent].verbalization.modified;
				node.verbalization.current = node.verbalization.truncated;
			}
		}
	}
}		

function resetPredicatesCounter(){
	predicatesCounter = 0;
}
