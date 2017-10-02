// Map that contains all the information to build query in natural language and in SPARQL
var queryLogicMap;
var rootQueryLogicMap;

// Map that counts concepts and predicates occurences.
var indexMap;

var languageManager;

var queryBuilder = null;
var queryVerbalizator = null;
var operatorManager = null;

var elementOnFocus;
//var queryViewer = null;

var MapCreator = function () {
	if(MapCreator.prototype._singletonInstance){
		return MapCreator.prototype._singletonInstance;
	}
	queryLogicMap = {};
 	rootQueryLogicMap = null;

	indexMap = {};

	elementOnFocus = null;

 	languageManager = new LanguageManager();

	MapCreator.prototype._singletonInstance = this;
 };

/*
	Notify to the queryVerbalizator the selected concept.
	url : concept's url
	label : concept's label
*/
MapCreator.prototype.selectedConcept = function(selectedUrl, selectedLabel) {

	console.log(selectedUrl + " - CONCEPT selected");

	var verbalization = languageManager.verbalizeConcept(selectedLabel);

	if(!(selectedUrl in indexMap)){
		indexMap[selectedUrl] = 1;
	}
	else{
		indexMap[selectedUrl] += 1;
	}
	var key = selectedUrl + "_" + indexMap[selectedUrl];
	var index = indexMap[selectedUrl];

	// new element in logic map
	var newLogicElement = {key: key, index: index,
						   url: selectedUrl, label: selectedLabel, 
						   type:'concept', direction: false, 
						   verbalization: verbalization, 
						   parent:null, children: []};
	queryLogicMap[key] = newLogicElement;

	if(rootQueryLogicMap == null){ // selectedConcept is the query's subject 
		
		rootQueryLogicMap = key;

	}else{

		var precLogicElement = queryLogicMap[elementOnFocus];

		if(precLogicElement.type=='something'){ // replace something
			
			//update newLogicElement
			newLogicElement.children = precLogicElement.children;
			newLogicElement.parent = precLogicElement.parent;

			//update map
			var indexSomething = $.inArray(precLogicElement.key, queryLogicMap[precLogicElement.parent].children);
			queryLogicMap[precLogicElement.parent].children[indexSomething] = newLogicElement.key;
			delete queryLogicMap[precLogicElement.key];
			

		}else if(precLogicElement.type=='concept'){ // concept refining

			newLogicElement.parent = precLogicElement.key;
			precLogicElement.children.push(newLogicElement.key);

		}else if(precLogicElement.type=='predicate'){ // direct predicate

			newLogicElement.parent = precLogicElement.key;
			precLogicElement.children.push(newLogicElement.key);

		}else if(precLogicElement.type=='operator'){
			//TODO
		}

	} 
		
	elementOnFocus = key;
	/*
	if(queryViewer == null)
		queryViewer = new QueryViewer;
	queryViewer.changeFocus(elementOnFocus);
	*/

	if(operatorManager == null)
		operatorManager = new OperatorManager;
	operatorManager.changedFocus(elementOnFocus, false);

	if(queryVerbalizator == null)
		queryVerbalizator = new QueryVerbalizator;
	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

	if(queryBuilder == null)
		queryBuilder = new QueryBuilder;
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);

	//console.log(queryLogicMap);
	//console.log(elementsList);

}

/*
	Notify to the MapCreator the selected predicate.
	url : predicate's url
	label : predicate's label
	predicateDirection : 'direct' if the selected predicate is a direct relation,
						 'reverse' if the selected predicate is a reverse relation.
*/
MapCreator.prototype.selectedPredicate = function(selectedUrl, selectedLabel, predicateDirection) {
	console.log(selectedUrl + " - PREDICATE selected - " + predicateDirection);

	// new element in logic map
	var verbalization = languageManager.verbalizePredicate(selectedLabel, predicateDirection);

	if(!(selectedUrl in indexMap)){
		indexMap[selectedUrl] = 1;
	}
	else{
		indexMap[selectedUrl] += 1;
	}
	var key = selectedUrl + "_" + indexMap[selectedUrl];
	var index = indexMap[selectedUrl];

	var newLogicElement = {key: key, index: index,
						   url: selectedUrl, label: selectedLabel, 
						   type:'predicate', direction: predicateDirection,
						   verbalization: verbalization, 
						   parent:null, children: []};
	queryLogicMap[key] = newLogicElement;

	if(rootQueryLogicMap == null){ // first element selected

		if(predicateDirection == 'direct'){ 
			// add predicate's subject -> everything
			var verbalizationEverything = languageManager.verbalizeEverything();

			if(!indexMap.hasOwnProperty('everything')){
				indexMap['everything'] = 1;
			}
			else{
				indexMap['everything'] += 1;
			}
			var everythingKey = 'everything' + "_" + indexMap['everything'];
			var everythingIndex = indexMap['everything'];

			var everythingElement = {key: everythingKey, index: everythingIndex,
								  url: everythingKey, label:'thing', 
								  type:'everything', direction:false,
								  verbalization:verbalizationEverything,
								  parent:null, children:[key],
								  counterDirectPredicatesChildren: 1};
			queryLogicMap[everythingKey] = everythingElement;

			rootQueryLogicMap = everythingKey;
			newLogicElement.parent = everythingKey;
		}
		else
			rootQueryLogicMap = key;

	}else{ //there's a prec 

		var precLogicElement = queryLogicMap[elementOnFocus];

		precLogicElement.children.push(key);
		newLogicElement.parent = precLogicElement.key;

		if(predicateDirection == 'direct' && precLogicElement.type == 'everything')
			precLogicElement.counterDirectPredicatesChildren++;
	}
		
	if(predicateDirection=='reverse'){

		var verbalization = languageManager.verbalizeSomething();

		if(!indexMap.hasOwnProperty('something')){
			indexMap['something'] = 1;
		}
		else{
			indexMap['something'] += 1;
		}
		var somethingKey = 'something' + "_" + indexMap['something'];
		var somethingIndex = indexMap['something'];

		// new element in logic map
		var somethingLogic = {key: somethingKey, index: somethingIndex,
							  url: somethingKey, label:'thing', 
							  type:'something', direction:false,
							  verbalization:verbalization,
							  parent:null, children:[]};
		queryLogicMap[somethingKey] = somethingLogic;

		queryLogicMap[key].children.push(somethingKey);	
		queryLogicMap[somethingKey].parent = key;

		elementOnFocus = somethingKey;

	}else{
	
		elementOnFocus = key;

	} 
	/*
	if(queryViewer == null)
		queryViewer = new QueryViewer;
	queryViewer.changeFocus(elementOnFocus);
	*/
	if(operatorManager == null)
		operatorManager = new OperatorManager;
	operatorManager.changedFocus(elementOnFocus, false);

	if(queryVerbalizator == null)
		queryVerbalizator = new QueryVerbalizator;
	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

	if(queryBuilder == null)
		queryBuilder = new QueryBuilder;
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);

	//console.log(queryLogicMap);

}

//update focus
MapCreator.prototype.changeFocus = function(keyElementOnFocus){
	elementOnFocus = keyElementOnFocus;

	if(operatorManager == null)
		operatorManager = new OperatorManager;
	operatorManager.changedFocus(elementOnFocus, true);

}

// remove element in map
MapCreator.prototype.removeElement = function(key){
	
	var node = queryLogicMap[key];

	// check if concept replaced something
	if(node.type == 'concept' && 
		node.parent!=null && 
		queryLogicStructure[node.parent].type == 'predicate' && queryLogicStructure[node.parent].direction == 'reverse'){
		
		var somethingVerbalization = languageManager.verbalizeSomething();

		if(!indexMap.hasOwnProperty('something')){
			indexMap['something'] = 1;
		}
		else{
			indexMap['something'] += 1;
		}
		var somethingKey = 'something' + "_" + indexMap['something'];
		var somethingIndex = indexMap['something'];

		/*
			To inherite node.children list and update child's parent

			// new element in logic map
			var somethingLogic = {key: somethingKey, index: somethingIndex,
								  url: somethingKey, label:'thing', 
								  type:'something', direction:false,
								  verbalization:somethingVerbalization,
								  parent:node.parent, children:node.children};
			queryLogicMap[somethingKey] = somethingLogic;

			for(var i=0; i<node.children.length; i++)
				queryLogicMap[node.children[i]].parent = somethingKey;
		*/

		// to remove all node.children element
		// new element in logic map
		var somethingLogic = {key: somethingKey, index: somethingIndex,
								  url: somethingKey, label:'thing', 
								  type:'something', direction:false,
								  verbalization:somethingVerbalization,
								  parent:node.parent, children:[]};
		queryLogicMap[somethingKey] = somethingLogic;

		for(var i=0; i<node.children.length; i++)
			delete queryLogicMap[node.children[i]];

		var index = $.inArray(node.key, queryLogicMap[node.parent].children);
		queryLogicMap[node.parent].children[index] = somethingKey;
		delete queryLogicMap[node.key];

		elementOnFocus = somethingKey;
	}
	else{

		elementOnFocus = node.parent;

		// remove node and his children 
		var visitStack = [];
		visitStack.push(node);

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();

			for(var i = currentNode.children.length-1; i>=0; i--){
				visitStack.push(queryLogicStructure[currentNode.children[i]]);
			}

			delete queryLogicMap[currentNode.key];

		}

		// update parent's children list
		if(node.parent!=null){
			var index = $.inArray(node.key, queryLogicMap[node.parent].children);
			queryLogicMap[node.parent].children.splice(index, 1);

			if(queryLogicStructure[node.parent].type == 'everything'){

				var everythingNode = queryLogicStructure[node.parent];

				//update counter direct predicates
				if(node.type == 'predicate' && node.direction == 'direct')
					everythingNode.counterDirectPredicatesChildren--;

				//if I have to remove everything node...
				if(everythingNode.children.length==0){
					delete queryLogicMap[everythingNode.key];

					rootQueryLogicMap = null;
					elementOnFocus = null;

				}else if(everythingNode.children.length==1 && everythingNode.counterDirectPredicatesChildren==0){
					delete queryLogicMap[everythingNode.key];

					queryLogicStructure[everythingNode.children[0]].parent = null;
					rootQueryLogicMap = everythingNode.children[0];
					elementOnFocus = everythingNode.children[0];
				}else{
					elementOnFocus = everythingNode.key;
				}
			}else{
				elementOnFocus = node.parent;
			}
		}

		if(node.type == 'something'){
			node = queryLogicMap[node.parent];
			var index = $.inArray(node.key, queryLogicMap[node.parent].children);
			queryLogicMap[node.parent].children.splice(index, 1);
			delete queryLogicMap[node.key];

			elementOnFocus = node.parent;
		}

	}

	if(rootQueryLogicMap == key){
		rootQueryLogicMap = null;
	}

	if(operatorManager == null)
			operatorManager = new OperatorManager;
	operatorManager.changedFocus(elementOnFocus, false);

	if(queryVerbalizator == null)
		queryVerbalizator = new QueryVerbalizator;
	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

	if(queryBuilder == null)
		queryBuilder = new QueryBuilder;
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);

}