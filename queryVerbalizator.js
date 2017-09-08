// Map that contains all the information to build query in natural language and in SPARQL
var queryLogicMap;
var somethingIndex;
var rootQueryLogicMap;
// List of elements in focus box
var elementsList; 
var elementOnFocus;

var languageManager;

var QueryVerbalizator = function () {
	queryLogicMap = {};
	rootQueryLogicMap = null;

	somethingIndex=1;

	elementsList = [];
	elementOnFocus = null;

	languageManager = new LanguageManager();
};

/*
	Notify to the queryVerbalizator the selected concept.
	url : concept's url
	label : concept's label
*/
QueryVerbalizator.prototype.selectedConcept = function(selectedUrl, selectedLabel) {

	var verbalization = languageManager.verbalizeConcept(selectedLabel);

	// new element in concept box
	var newElement = {url: selectedUrl, label: selectedLabel, type: 'concept', direction: false};
	elementsList.push(newElement);

	// new element in logic map
	var newLogicElement = {url: selectedUrl, label: selectedLabel, 
						   type:'concept', direction: false, 
						   verbalization: varbalization, 
						   parent:null, children: []};
	queryLogicMap[selectedUrl] = newLogicElement;

	if(rootQueryLogicMap == null){ // selectedConcept is the query's subject 
		
		rootQueryLogicMap = selectedUrl;
		newLogicElement.verbalization.current = newLogicElement.verbalization.first;

	}else{

		if(queryLogicMap[elementOnFocus].type=='something'){ // replace something
			
			var somethingLogicElement = queryLogicMap[elementOnFocus];
			
			//update newLogicElement
			newLogicElement.children = somethingLogicElement.children;
			newLogicElement.parent = somethingLogicElement.parent;

			//update map
			var indexSomething = $.inArray(somethingLogicElement.url, queryLogicMap[somethingLogicElement.parent].children);
			queryLogicMap[somethingLogicElement.parent].children[indexSomething] = newLogicElement.url;
			queryLogicMap.removeAttr(somethingLogicElement.url);

		}else if(queryLogicMap[elementOnFocus].type=='concept'){ // concept refining

			newLogicElement.verbalization.current = newLogicElement.verbalization.modified;

		}else if(queryLogicMap[elementOnFocus].type=='predicate'){
			//is it permitted??
		}else if(queryLogicMap[elementOnFocus].type=='operator'){
			//TODO
		}

	} 
		
	elementOnFocus = selectedUrl;

	//notification to queryviewer

	console.log(queryLogicMap);
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
	
	var verbalization = languageManager.verbalizePredicate(selectedLabel, predicateDirection);

	// new element in concept box
	var newElement = {url: selectedUrl, label: selectedLabel, type: 'predicate', direction: predicateDirection};
	elementsList.push(newElement);

	// new element in logic map
	var newLogicElement = {url: selectedUrl, label: selectedLabel, 
						   type:'predicate', direction: predicateDirection, 
						   verbalization: varbalization, 
						   parent:null, children: []};
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

		}else if(precLogicElement.type=='something'){

			if(predicateDirection == 'direct'){

				precLogicElement.children.push(selectedUrl);

			}
			else{

				newLogicElement.verbalization.current = newLogicElement.verbalization.modified;

				//update map, shift something
				var index = $.inArray(precLogicElement.url, precLogicElement.parent.children);
				precLogicElement.parent.children.splice(index, 0, newLogicElement.url);
				addSomething=false;

			}
		}else if(precLogicElement.direction=='direct'){
			
			precLogicElement.children.push(newLogicElement);
			var index = $.inArray(newLogicElement.url, precLogicElement.children);
			if((index%2)==0){

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

		queryLogicMap[selectedUrl].parent.children.push('something'+somethingIndex);	

		elementOnFocus = 'something'+somethingIndex;
		somethingIndex++;

	}

	if(predicateDirection == 'direct'){
		elementOnFocus = selectedUrl;
	} 

	//update query SPQRQL
	//notify viewer
	console.log(queryLogicMap);

}
