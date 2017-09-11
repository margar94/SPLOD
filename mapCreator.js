// Map that contains all the information to build query in natural language and in SPARQL
var queryLogicMap;
var rootQueryLogicMap;

// Map that counts concepts and predicates occurences.
var indexMap;

var languageManager;

var queryBuilder;
var queryVerbalizator;

var elementOnFocus;
var queryViewer;

var MapCreator = function () {
	queryLogicMap = {};
	rootQueryLogicMap = null;

	indexMap = {};

	languageManager = new LanguageManager();

	queryBuilder = new QueryBuilder();
	queryVerbalizator = new QueryVerbalizator();

	elementOnFocus = null;
	queryViewer = new QueryViewer();
};

/*
	Notify to the queryVerbalizator the selected concept.
	url : concept's url
	label : concept's label
*/
MapCreator.prototype.selectedConcept = function(selectedUrl, selectedLabel) {

	console.log(selectedUrl + " - CONCEPT selected");

	var verbalization = languageManager.verbalizeConcept(selectedLabel);

	if(!indexMap.hasOwnProperty(selectedUrl)){
		indexMap.selectedUrl = 1;
	}
	else{
		indexMap.selectedUrl += 1;
	}
	var key = selectedUrl + "_" + indexMap.selectedUrl;
	var index = indexMap.selectedUrl;

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

		}else if(queryLogicMap[elementOnFocus].type=='predicate'){
			//is it permitted??
		}else if(queryLogicMap[elementOnFocus].type=='operator'){
			//TODO
		}

	} 
		
	elementOnFocus = key;
	queryViewer.changeFocus(elementOnFocus);

	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap);
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

	var verbalization = languageManager.verbalizePredicate(selectedLabel, predicateDirection);

	if(!indexMap.hasOwnProperty(selectedUrl)){
		indexMap.selectedUrl = 1;
	}
	else{
		indexMap.selectedUrl += 1;
	}
	var key = selectedUrl + "_" + indexMap.selectedUrl;
	var index = indexMap.selectedUrl;

	// new element in logic map
	var newLogicElement = {key: key, index: index,
						   url: selectedUrl, label: selectedLabel, 
						   type:'predicate', direction: predicateDirection,
						   verbalization: verbalization, 
						   parent:null, children: []};
	queryLogicMap[key] = newLogicElement;

	if(rootQueryLogicMap == null){ // first element selected

		rootQueryLogicMap = key;

	}else{ //there's a prec 

		var precLogicElement = queryLogicMap[elementOnFocus];

		precLogicElement.children.push(key);
		newLogicElement.parent = precLogicElement.key;
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

	queryViewer.changeFocus(elementOnFocus);

	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap);
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);

	//console.log(queryLogicMap);

}

MapCreator.prototype.changeFocus = function(keyElementOnFocus){
	elementOnFocus = keyElementOnFocus;
}