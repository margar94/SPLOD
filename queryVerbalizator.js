// Map that contains all the information to build query in natural language and in SPARQL
var queryLogicMap;
var somethingIndex;
var rootQueryLogicMap;
// List of elements in focus box
var elementsList; 
var elementOnFocus;

var languageManager;

var queryViewer;

var predicatesCounter;

var QueryVerbalizator = function () {
	queryLogicMap = {};
	rootQueryLogicMap = null;

	somethingIndex=1;

	elementsList = [];
	elementOnFocus = null;

	languageManager = new LanguageManager();

	queryViewer = new QueryViewer();

	resetPredicatesCounter();
};

/*
	Notify to the queryVerbalizator the selected concept.
	url : concept's url
	label : concept's label
*/
QueryVerbalizator.prototype.selectedConcept = function(selectedUrl, selectedLabel) {

	console.log(selectedUrl + " - CONCEPT selected");

	resetPredicatesCounter();

	var verbalization = languageManager.verbalizeConcept(selectedLabel);
	console.log(verbalization);

	// new element in concept box
	var newElement = {url: selectedUrl, label: selectedLabel, type: 'concept', direction: false};
	elementsList.push(newElement);

	// new element in logic map
	var newLogicElement = {url: selectedUrl, label: selectedLabel, 
						   type:'concept', direction: false, 
						   verbalization: verbalization, 
						   parent:null, children: []};
	queryLogicMap[selectedUrl] = newLogicElement;

	if(rootQueryLogicMap == null){ // selectedConcept is the query's subject 
		
		rootQueryLogicMap = selectedUrl;
		newLogicElement.verbalization.current = newLogicElement.verbalization.first;

	}else{

		var precLogicElement = queryLogicMap[elementOnFocus];

		if(precLogicElement.type=='something'){ // replace something
			
			//update newLogicElement
			newLogicElement.children = precLogicElement.children;
			newLogicElement.parent = precLogicElement.parent;

			//update map
			var indexSomething = $.inArray(precLogicElement.url, queryLogicMap[precLogicElement.parent].children);
			queryLogicMap[precLogicElement.parent].children[indexSomething] = newLogicElement.url;
			queryLogicMap.removeAttr(precLogicElement.url);

		}else if(precLogicElement.type=='concept'){ // concept refining

			newLogicElement.verbalization.current = newLogicElement.verbalization.modified;
			newLogicElement.parent = precLogicElement.url;
			precLogicElement.children.push(selectedUrl);

		}else if(queryLogicMap[elementOnFocus].type=='predicate'){
			//is it permitted??
		}else if(queryLogicMap[elementOnFocus].type=='operator'){
			//TODO
		}

	} 
		
	elementOnFocus = selectedUrl;

	queryViewer.updateQuery(rootQueryLogicMap, queryLogicMap);

	//notification to queryviewer

	//console.log(queryLogicMap);
	//console.log(elementsList);

}

/*
	Notify to the queryVerbalizator the selected predicate.
	url : predicate's url
	label : predicate's label
	predicateDirection : 'direct' if the selected predicate is a direct relation,
						 'reverse' if the selected predicate is a reverse relation.
*/
QueryVerbalizator.prototype.selectedPredicate = function(selectedUrl, selectedLabel, predicateDirection) {

	console.log(selectedUrl + " - PREDICATE selected - " + predicateDirection);

	predicatesCounter++;
	
	var verbalization = languageManager.verbalizePredicate(selectedLabel, predicateDirection);

	// new element in concept box
	var newElement = {url: selectedUrl, label: selectedLabel, type: 'predicate', direction: predicateDirection};
	elementsList.push(newElement);

	// new element in logic map
	var newLogicElement = {url: selectedUrl, label: selectedLabel, 
						   type:'predicate', direction: predicateDirection, odd: (predicatesCounter%2),
						   verbalization: verbalization, 
						   parent:null, children: [],};
	queryLogicMap[selectedUrl] = newLogicElement;

	var addSomething = false;
	if(predicateDirection=='reverse')
		addSomething = true;

	if(rootQueryLogicMap == null){ // first element selected

		rootQueryLogicMap = selectedUrl;
		newLogicElement.verbalization.current = newLogicElement.verbalization.first;

	}else{ //there's a prec 

		var precLogicElement = queryLogicMap[elementOnFocus];

		if(precLogicElement.type=='concept'){

			precLogicElement.children.push(selectedUrl);
			newLogicElement.parent = precLogicElement.url;

		}else if(precLogicElement.type=='something'){

			if(predicateDirection == 'direct'){

				precLogicElement.children.push(selectedUrl);
				newLogicElement.parent = precLogicElement.url;

			}
			else{

				newLogicElement.verbalization.current = newLogicElement.verbalization.modified;

				//update map, shift something
				var index = $.inArray(precLogicElement.url, queryLogicMap[precLogicElement.parent].children);
				queryLogicMap[precLogicElement.parent].children.splice(index, 0, newLogicElement.url);
				newLogicElement.parent = precLogicElement.parent;
				addSomething=false;

			}
		}else if(precLogicElement.direction=='direct'){
			
			precLogicElement.children.push(selectedUrl);
			newLogicElement.parent = precLogicElement.url;

			if(newLogicElement.odd==0){

				precLogicElement.verbalization.current = precLogicElement.verbalization.modified;
				newLogicElement.verbalization.current = newLogicElement.verbalization.truncated;

			}
		
		}else{
			console.log("Pozzo in selectedPredicate - queryVerbalizator");
		}

	}
		
	if(addSomething){

		var verbalization = languageManager.verbalizeSomething();

		// new element in concept box
		var something = {url:'something'+somethingIndex, label: 'thing'+somethingIndex, type:'something', direction:false};
		elementsList.push(something);

		// new element in logic map
		var somethingLogic = {url:'something'+somethingIndex, label:'thing'+somethingIndex, 
							  type:'something', direction:false,
							  verbalization:verbalization,
							  parent:null, children:[]};
		queryLogicMap['something'+somethingIndex] = somethingLogic;

		console.log(queryLogicMap[selectedUrl]);
		console.log(queryLogicMap[selectedUrl].parent);
		console.log(queryLogicMap[queryLogicMap[selectedUrl].parent].children);
		queryLogicMap[queryLogicMap[selectedUrl].parent].children.push('something'+somethingIndex);	
		somethingLogic.parent = selectedUrl;

		elementOnFocus = 'something'+somethingIndex;
		somethingIndex++;

		resetPredicatesCounter();

	}

	if(predicateDirection == 'direct'){
		elementOnFocus = selectedUrl;
	} 

	queryViewer.updateQuery(rootQueryLogicMap, queryLogicMap);

	//update query SPQRQL
	//notify viewer
	console.log(queryLogicMap);

}

function resetPredicatesCounter(){
	predicatesCounter = 0;
}
