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

		if(precLogicElement.children.length>0){
			var andOperator = 'and';
			var andVerbalization = languageManager.verbalizeOperator(andOperator);

			if(!(andOperator in indexMap)){
				indexMap[andOperator] = 1;
			}
			else{
				indexMap[andOperator] += 1;
			}

			var andIndex = indexMap[andOperator];
			var andKey = andOperator + "_" + andIndex;

			var andLogicElement = {key: andKey, index: andIndex,
								   url: andOperator, label: andOperator, 
								   type:'operator', direction: false, 
								   verbalization: andVerbalization, 
								   parent:precLogicElement.key, children: []};
			queryLogicMap[andKey] = andLogicElement;

			precLogicElement.children.push(andKey);
		}

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

		}else{
			//...
		}

	} 
	
	updateAndNotifyFocus(key);	

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
			//set root
			rootQueryLogicMap = key;

	}else{ //there's a prec 

		var precLogicElement = queryLogicMap[elementOnFocus];

		//if i have sibling i put and before me
		if(precLogicElement.children.length>0){
			var andOperator = 'and';
			var andVerbalization = languageManager.verbalizeOperator(andOperator);

			if(!(andOperator in indexMap)){
				indexMap[andOperator] = 1;
			}
			else{
				indexMap[andOperator] += 1;
			}

			var andIndex = indexMap[andOperator];
			var andKey = andOperator + "_" + andIndex;

			var andLogicElement = {key: andKey, index: andIndex,
								   url: andOperator, label: andOperator, 
								   type:'operator', direction: false, 
								   verbalization: andVerbalization, 
								   parent:precLogicElement.key, children: []};
			queryLogicMap[andKey] = andLogicElement;

			precLogicElement.children.push(andKey);
		}

		// add me to parent's children list
		precLogicElement.children.push(key);
		newLogicElement.parent = precLogicElement.key;

		if(predicateDirection == 'direct' && precLogicElement.type == 'everything')
			precLogicElement.counterDirectPredicatesChildren++;
	}
		
	if(predicateDirection=='reverse'){

		// add something node to complete myself
		var verbalization = languageManager.verbalizeSomething();

		if(!indexMap.hasOwnProperty('something')){
			indexMap['something'] = 1;
		}
		else{
			indexMap['something'] += 1;
		}
		var somethingKey = 'something' + "_" + indexMap['something'];
		var somethingIndex = indexMap['something'];

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
	
	updateAndNotifyFocus(elementOnFocus);
	
	if(queryVerbalizator == null)
		queryVerbalizator = new QueryVerbalizator;
	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

	if(queryBuilder == null)
		queryBuilder = new QueryBuilder;
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);

	//console.log(queryLogicMap);

}

//update focus and notify operatorManager when USER change focus
MapCreator.prototype.changeFocus = function(newElementOnFocus){
	elementOnFocus = newElementOnFocus;

	if(operatorManager == null)
		operatorManager = new OperatorManager;
	operatorManager.changedFocus(elementOnFocus, true);

}

MapCreator.prototype.getNodeByKey = function(key){
	return queryLogicMap[key];
}

MapCreator.prototype.isRefinement = function(key){
	var node = queryLogicMap[key];
	if(node.parent == null)
		return false;

	var parent = queryLogicMap[node.parent];

	if(node.type == 'concept' && (parent.type == 'concept' || (parent.type == 'predicate' && parent.direction == 'direct'))){
		return true;
	}

	return false;
}

MapCreator.prototype.getTopElement = function(key){
	var node = queryLogicMap[key];
	var parent = queryLogicMap[node.parent];

	while(node.type == 'concept' && (parent != undefined && (parent.type == 'concept' || (parent.type == 'predicate' && parent.direction == 'direct')))){
		node = parent;
		parent = queryLogicMap[node.parent];
	}

	return node.key;
}

function updateAndNotifyFocus(key){
	elementOnFocus = key;

	if(operatorManager == null)
		operatorManager = new OperatorManager;
	operatorManager.changedFocus(elementOnFocus, false);
}

// remove element in map
MapCreator.prototype.removeElement = function(key){
console.log(key);
	if(key=='limit'){
		resultLimit = false;

		if(operatorManager == null)
			operatorManager = new OperatorManager;
		operatorManager.changedFocus(elementOnFocus, false);

		if(queryVerbalizator == null)
			queryVerbalizator = new QueryVerbalizator;
		queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

		if(queryBuilder == null)
			queryBuilder = new QueryBuilder;
		queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);
	}else{
	
		var node = queryLogicMap[key];

		if(node.type=='operator')
			removeOperator(node);
		else if(iReplaceASomethingNode(key)){// check if concept replaced something
			var somethingKey = substituteMeWithSomethingNode(key);
			elementOnFocus = somethingKey;
		}
		else{

			elementOnFocus = node.parent;
			removeMeAndMyDescendents(node);

			// update parent's children list
			if(node.parent!=null){

				cleanMyParentList(node);
				
				//removed node is query's subject
				if(queryLogicMap[node.parent].type == 'everything'){

					var everythingNode = queryLogicMap[node.parent];

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

						queryLogicMap[everythingNode.children[0]].parent = null;
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
				cleanMyParentList(node);
				delete queryLogicMap[node.key];

				elementOnFocus = node.parent;
			}

		}

		if(rootQueryLogicMap == key){
			rootQueryLogicMap = null;
		}

		updateAndNotifyFocus(elementOnFocus);

		if(elementOnFocus == null)
			indexMap = {};

		if(queryVerbalizator == null)
			queryVerbalizator = new QueryVerbalizator;
		queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

		if(queryBuilder == null)
			queryBuilder = new QueryBuilder;
		queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);
	}

//console.log(queryLogicMap);
}

function iReplaceASomethingNode(key){
	var node = queryLogicMap[key];
	return node.type == 'concept' && 
		node.parent!=null && 
		queryLogicMap[node.parent].type == 'predicate' && 
			queryLogicMap[node.parent].direction == 'reverse';
}

function substituteMeWithSomethingNode(key){
	var node = queryLogicMap[key];

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

	return somethingKey;
}

function removeMeAndMyDescendents(node){
	// remove node and his children 
	var visitStack = [];
	visitStack.push(node);

	while(visitStack.length != 0){
		var currentNode = visitStack.pop();

		for(var i = currentNode.children.length-1; i>=0; i--){
			visitStack.push(queryLogicMap[currentNode.children[i]]);
		}

		delete queryLogicMap[currentNode.key];

	}
}

//remove me and related conjunctions and/or from my parent's list
function cleanMyParentList(node){
	var childrenList = queryLogicMap[node.parent].children;
	var index = $.inArray(node.key, childrenList);
	if(childrenList.length>1){
		if(index==0){
			delete queryLogicMap[childrenList[index+1]];
			childrenList.splice(index, 2);//removed me and 'and' after me
		}
		else{
			delete queryLogicMap[childrenList[index-1]];
			queryLogicMap[node.parent].children.splice(index-1, 2);//removed me and 'and' before me
		}
	}else{
		queryLogicMap[node.parent].children.splice(index, 1);
	}
}

function removeOperator(node){
	var operator = node.label;

	switch(operator){
		case 'is string':
		case 'is url':
		case 'is date':
		case 'starts with':
		case 'ends with':
		case 'contains':
		case 'lang':
		case '<':
		case '<=':
		case '>':
		case '>=':
		case '=':
		case 'before':
		case 'after':

		case 'range date':
		case 'range':

		case 'min':
		case 'max':
		case 'average':

			removeMeAndMyDescendents(node);	

			var index = $.inArray(node.key, queryLogicMap[node.parent].children);
			queryLogicMap[node.parent].children.splice(index, 1);

			updateAndNotifyFocus(node.parent);

			break;

		case 'not':

			var child = queryLogicMap[node.children[0]];
			
			child.parent = node.parent;	

			var index = $.inArray(node.key, queryLogicMap[node.parent].children);
			queryLogicMap[node.parent].children[index] = child.key;
			
			delete queryLogicMap[node.key];

			updateAndNotifyFocus(child.key);
			
			break;

		case 'and': //focus su or
		case 'or': //focus su and
			operator = (operator == 'and' ? 'or' : 'and');
			var conjunctionVerbalization = languageManager.verbalizeOperator(operator);

			if(!(operator in indexMap)){
				indexMap[operator] = 1;
			}
			else{
				indexMap[operator] += 1;
			}

			var conjunctionIndex = indexMap[operator];
			var conjunctionKey = operator + "_" + conjunctionIndex;

			var conjunctionLogicElement = {key: conjunctionKey, index: conjunctionIndex,
								   url: operator, label: operator, 
								   type:'operator', direction: false, 
								   verbalization: conjunctionVerbalization, 
								   parent:node.parent, children: []};
			queryLogicMap[conjunctionKey] = conjunctionLogicElement;

			var index = $.inArray(node.key, queryLogicMap[node.parent].children);
			queryLogicMap[node.parent].children[index] = conjunctionKey;
			
			delete queryLogicMap[node.key];

			updateAndNotifyFocus(conjunctionKey);

			break;

	}
	//console.log(queryLogicMap);
}

//pendingQuery : array of elements to add to map
MapCreator.prototype.selectedOperator = function(pendingQuery){

	//console.log(pendingQuery);

	var operator = pendingQuery[0].value;

	switch(operator){
		case 'is string':
		case 'is url':
		case 'is date':
		case 'starts with':
		case 'ends with':
		case 'contains':
		case 'lang':
		case '<':
		case '<=':
		case '>':
		case '>=':
		case '=':
		case 'before':
		case 'after':

		case 'range date':
		case 'range':

		case 'min':
		case 'max':
		case 'average':

			var verbalization = languageManager.verbalizeOperator(operator);

			if(!(operator in indexMap)){
				indexMap[operator] = 1;
			}
			else{
				indexMap[operator] += 1;
			}
			var index = indexMap[operator];
			var key = operator + "_" + index;

			var newLogicElement = {key: key, index: index,
						   url: operator, label: operator, 
						   type:'operator', direction: false,
						   verbalization: verbalization, 
						   parent:elementOnFocus, children: []};
			queryLogicMap[key] = newLogicElement;	

			queryLogicMap[elementOnFocus].children.push(key);				

			for(var i=1; i<pendingQuery.length; i++){
				var resultValue = pendingQuery[i].value;
				var resultDatatype = pendingQuery[i].datatype;
				var verbalizationChildren = languageManager.verbalizeResult(resultValue);

				if(!(resultValue in indexMap)){
					indexMap[resultValue] = 1;
				}
				else{
					indexMap[resultValue] += 1;
				}

				var indexChildren = indexMap[resultValue];
				var keyChildren = resultValue + "_" + indexChildren;

				var newLogicChildren = {key: keyChildren, index: indexChildren,
							   url: resultValue, label: resultValue, 
							   type:'result', direction: false,
							   verbalization: verbalizationChildren, 
							   parent:key, children: [], datatype: resultDatatype};
				queryLogicMap[keyChildren] = newLogicChildren;

				newLogicElement.children.push(keyChildren);
			}	
			updateAndNotifyFocus(elementOnFocus);
			break;

		case 'not':

			var verbalization = languageManager.verbalizeOperator(operator);

			if(!(operator in indexMap)){
				indexMap[operator] = 1;
			}
			else{
				indexMap[operator] += 1;
			}

			var index = indexMap[operator];
			var key = operator + "_" + index;

			var parent = queryLogicMap[elementOnFocus].parent;

			var newLogicElement = {key: key, index: index,
						   url: operator, label: operator, 
						   type:'operator', direction: false,
						   verbalization: verbalization, 
						   parent:parent, children: [elementOnFocus]};
			queryLogicMap[key] = newLogicElement;

			var index = $.inArray(elementOnFocus, queryLogicMap[parent].children);
			queryLogicMap[parent].children[index] = key;

			queryLogicMap[elementOnFocus].parent = key;

			updateAndNotifyFocus(key);

			break;

		case 'and': //focus su or
		case 'or': //focus su and

			var elementOnFocusNode = queryLogicMap[elementOnFocus];
			var conjunctionVerbalization = languageManager.verbalizeOperator(operator);

			if(!(operator in indexMap)){
				indexMap[operator] = 1;
			}
			else{
				indexMap[operator] += 1;
			}

			var conjunctionIndex = indexMap[operator];
			var conjunctionKey = operator + "_" + conjunctionIndex;

			var conjunctionLogicElement = {key: conjunctionKey, index: conjunctionIndex,
								   url: operator, label: operator, 
								   type:'operator', direction: false, 
								   verbalization: conjunctionVerbalization, 
								   parent:elementOnFocusNode.parent, children: []};
			queryLogicMap[conjunctionKey] = conjunctionLogicElement;

			var index = $.inArray(elementOnFocus, queryLogicMap[elementOnFocusNode.parent].children);
			queryLogicMap[elementOnFocusNode.parent].children[index] = conjunctionKey;
			
			delete queryLogicMap[elementOnFocus];

			updateAndNotifyFocus(conjunctionKey);

			break;

		case 'limit':
			resultLimit = pendingQuery[1].value;

			if(operatorManager == null)
				operatorManager = new OperatorManager;
			operatorManager.changedFocus(elementOnFocus, false);

			if(queryVerbalizator == null)
				queryVerbalizator = new QueryVerbalizator;
			queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

			if(queryBuilder == null)
				queryBuilder = new QueryBuilder;
			queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);
			break;

	}

	//console.log(queryLogicMap);

	if(queryVerbalizator == null)
		queryVerbalizator = new QueryVerbalizator;
	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap, elementOnFocus);

	if(queryBuilder == null)
		queryBuilder = new QueryBuilder;
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);

	
		//console.log(queryLogicMap);

}
