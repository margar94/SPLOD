// Map that contains all the information to build query in natural language and in SPARQL
var queryLogicMap;
var somethingIndex;
var rootQueryLogicMap;

var languageManager;

var queryBuilder;
var queryVerbalizator;

var MapCreator = function () {
	queryLogicMap = {};
	rootQueryLogicMap = null;
	somethingIndex = 1;

	languageManager = new LanguageManager();

	queryBuilder = new QueryBuilder();
	queryVerbalizator = new QueryVerbalizator();
};

/*
	Notify to the queryVerbalizator the selected concept.
	url : concept's url
	label : concept's label
*/
MapCreator.prototype.selectedConcept = function(selectedUrl, selectedLabel) {

	console.log(selectedUrl + " - CONCEPT selected");

	var verbalization = languageManager.verbalizeConcept(selectedLabel);

	// new element in logic map
	var newLogicElement = {url: selectedUrl, label: selectedLabel, 
						   type:'concept', direction: false, 
						   verbalization: verbalization, 
						   parent:null, children: []};
	queryLogicMap[selectedUrl] = newLogicElement;

	if(rootQueryLogicMap == null){ // selectedConcept is the query's subject 
		
		rootQueryLogicMap = selectedUrl;

	}else{

		var precLogicElement = queryLogicMap[elementOnFocus];

		if(precLogicElement.type=='something'){ // replace something
			
			//update newLogicElement
			newLogicElement.children = precLogicElement.children;
			newLogicElement.parent = precLogicElement.parent;

			//update map
			var indexSomething = $.inArray(precLogicElement.url, queryLogicMap[precLogicElement.parent].children);
			queryLogicMap[precLogicElement.parent].children[indexSomething] = newLogicElement.url;
			delete queryLogicMap[precLogicElement.url];
			

		}else if(precLogicElement.type=='concept'){ // concept refining

			newLogicElement.parent = precLogicElement.url;
			precLogicElement.children.push(selectedUrl);

		}else if(queryLogicMap[elementOnFocus].type=='predicate'){
			//is it permitted??
		}else if(queryLogicMap[elementOnFocus].type=='operator'){
			//TODO
		}

	} 
		
	elementOnFocus = selectedUrl;

	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap);
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);
	//updateFocus

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

	// new element in logic map
	var newLogicElement = {url: selectedUrl, label: selectedLabel, 
						   type:'predicate', direction: predicateDirection,
						   verbalization: verbalization, 
						   parent:null, children: [],};
	queryLogicMap[selectedUrl] = newLogicElement;

	if(rootQueryLogicMap == null){ // first element selected

		rootQueryLogicMap = selectedUrl;

	}else{ //there's a prec 

		var precLogicElement = queryLogicMap[elementOnFocus];

		precLogicElement.children.push(selectedUrl);
		newLogicElement.parent = precLogicElement.url;
	}
		
	if(predicateDirection=='reverse'){

		var verbalization = languageManager.verbalizeSomething();

		// new element in logic map
		var somethingLogic = {url:'something'+somethingIndex, label:'thing'+somethingIndex, 
							  type:'something', direction:false,
							  verbalization:verbalization,
							  parent:null, children:[]};
		queryLogicMap['something'+somethingIndex] = somethingLogic;

		queryLogicMap[selectedUrl].children.push(somethingLogic.url);	
		queryLogicMap[somethingLogic.url].parent = selectedUrl;

		elementOnFocus = 'something'+somethingIndex;
		somethingIndex++;

	}else{

		elementOnFocus = selectedUrl;

	} 

	queryVerbalizator.updateQuery(rootQueryLogicMap, queryLogicMap);
	queryBuilder.updateQuery(rootQueryLogicMap, queryLogicMap);
	//update focus

	//console.log(queryLogicMap);

}