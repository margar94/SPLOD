// Object that keep info to build SPARQL query
var querySparqlStructure;
var anonymousIndexVariable;
// Query in natural language and related info
var queryLogicMap;
var indexUrlList;
var queryNaturalLanguage;
var somethingIndex;
// List of elements in focus box
var elementsList; 
var elementOnFocus;

var languageManager;

var QueryVerbalizator = function () {
	querySparqlStructure = {
		select : [], //select's field
		where : [], 
		limit : false,
		//distinct
		//langauge, default en
	}; 
	anonymousIndexVariable = 1;

	queryLogicMap = {};
	indexUrlList = [];

	queryNaturalLanguage = "Give me everything...";
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
	var newElement = {url: selectedUrl, label: selectedLabel, type: 'concept', direction: false};
	elementsList.push(newElement);

	var triple = {};

	var newLogicElement = {url: selectedUrl, label: selectedLabel, type:'concept', direction: false, cachedQuery: queryNaturalLanguage};
	queryLogicMap[selectedUrl] = newLogicElement;
	//change this push
	indexUrlList.push(selectedUrl);

	if(elementOnFocus==null){ // selectedConcept is the query's subject 
		
		newLogicElement.myVerbalization = "every " + selectedLabel;
		queryNaturalLanguage = "Give me " + newLogicElement.myVerbalization;

		triple = {s:'?s'+anonymousIndexVariable, p:'a', o:"<"+selectedUrl+">"};
		anonymousIndexVariable++;
		querySparqlStructure.where.push(triple);

	}else if(queryLogicMap[elementOnFocus].type=='something'){ // selectedConcept completes reverse relation (replace placeholder something)
		
		newLogicElement.myVerbalization = selectedLabel;
		queryNaturalLanguage = queryLogicMap[elementOnFocus].cachedQuery + newLogicElement.myVerbalization;
		
		queryLogicMap.removeAttr(elementOnFocus);
		
		triple = querySparqlStructure.where.pop();
		triple.o = "<"+selectedUrl+">";
		querySparqlStructure.where.push(triple);

	}else if(queryLogicMap[elementOnFocus].type=='concept'){ // before there is a concept, selected concecpt id a specialization of previous concept
		
		var article = languageManager.getArticle(selectedLabel);		
		newLogicElement.myVerbalization = " that is " + article + " " + selectedLabel;
		queryNaturalLanguage += newLogicElement.myVerbalization;

		triple = querySparqlStructure.where.pop();
		triple.o = "<"+selectedUrl+">";
		querySparqlStructure.where.push(triple);

	}else if(queryLogicMap[elementOnFocus].type=='predicate'){
		//is it permitted??
	}else if(queryLogicMap[elementOnFocus].type=='operator'){
		//TODO
	}

	elementOnFocus = selectedUrl;

	//notification to queryviewer

	console.log(queryLogicMap);
	console.log(querySparqlStructure);
	console.log(queryNaturalLanguage);
	console.log(elementsList);

}

/*
	Notify to the queryVerbalizator the selected predicate.
	url : predicate's url
	label : predicate's label
	predicateDirection : 'none' if the selected predicate is a attribute,	
						 'direct' if the selected predicate is a direct relation,
						 'reverse' if the selected predicate is a reverse relation.
*/
QueryVerbalizator.prototype.selectedPredicate = function(selectedUrl, selectedLabel, predicateDirection) {
	var newElement = {url: selectedUrl, label: selectedLabel, type: 'predicate', direction: predicateDirection};
	elementsList.push(newElement);

	var triple = {};

	var newLogicElement = {url: selectedUrl, label: selectedLabel, 
							type:'predicate', direction: predicateDirection,
							cachedQuery: queryNaturalLanguage};
	queryLogicMap[selectedUrl] = newLogicElement;
	//change this push
	indexUrlList.push(selectedUrl);

	var article = languageManager.getArticle(selectedLabel);
	if(predicateDirection == 'direct'){
		newLogicElement.myVerbalization = "that has " + article + " " + selectedLabel;
		newLogicElement.myModifiedVerbalization = " whose " + selectedLabel;
	}else if(predicateDirection == 'reverse'){
		newLogicElement.myVerbalization = "that is " + article + " " + selectedLabel + " of ";
		newLogicElement.myModifiedVerbalization = article + " " + selectedLabel + " of ";

		var something = {label: 'thing'+somethingIndex, type:'something', direction:false};
		elementsList.push(something);

		var somethingLogic = {url:'something'+somethingIndex, label:'thing'+somethingIndex, 
								type:'something', direction:false,
								cachedQuery:queryNaturalLanguage,
								myVerbalization:'something'};
		queryLogicMap[selectedUrl] = somethingLogic;
		//change this push
		indexUrlList.push('something');

		somethingIndex++;
	}


	if(elementOnFocus==null){ //debug
		if(predicateDirection=='direct'){
			queryNaturalLanguage = "Give me everything " + newLogicElement.myVerbalization;
		}else{
			queryNaturalLanguage = "Give me " + article + selectedLabel + " of something "; 	
		}

		newLogicElement.even=0;
	}else{
		var precLogicElement = queryLogicMap[elementOnFocus];

		if(precLogicElement.direction=='direct'){

			newLogicElement.even=((precLogicElement.even+1)%2);
			if(newLogicElement.even==1){
				//gestione verbalizzaione troncata??
				queryNaturalLanguage = precLogicElement.cachedQuery + precLogicElement.myModifiedVerbalization + "has " + article + " " + selectedLabel;
			}else{
				queryNaturalLanguage = newLogicElement.cachedQuery + newLogicElement.myVerbalization;
			}
		
		}else if(queryLogicMap[elementOnFocus].type=='concept'){

			queryNaturalLanguage = newLogicElement.cachedQuery + newLogicElement.myVerbalization;

		}else if(queryLogicMap[elementOnFocus].type=='something'){

			if(predicateDirection == 'direct'){
				queryNaturalLanguage = newLogicElement.cachedQuery + newLogicElement.myVerbalization;				
			}
			else{
				//shift smg
				queryNaturalLanguage = newLogicElement.cachedQuery + newLogicElement.myModifiedVerbalization;
			}

		}else{
			console.log("Pozzo in selectedPredicate - queryVerbalizator");
		}

	} 

	console.log(queryNaturalLanguage);

	//update query

	if(predicateDirection == 'direct'){
		elementOnFocus = selectedUrl;
	}else{
		elementOnFocus = 'something'+(somethingIndex-1);
	}
}