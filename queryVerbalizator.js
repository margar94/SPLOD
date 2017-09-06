// Object that keep info to build SPARQL query
var querySparqlStructure;
var anonymousIndexVariable;
// Query in natural language and related info
var queryLogicMap;
var indexUrlList;
var queryNaturalLanguage;
// List of elements in focus box
var elementsList; 
var elementOnFocus;

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
	elementsList = [];
	elementOnFocus = null;
};

/*
	Notify to the queryVerbalizator the selected concept.
	url : concept's url
	label : concept's label
*/
QueryVerbalizator.prototype.selectedConcept = function(selectedUrl, selectedLabel) {
	var newElement = {url: selectedUrl, label: selectedLabel, type: 'concept'};
	elementsList.push(newElement);

	var triple = {};

	var newLogicElement = {url: selectedUrl, label: selectedLabel, type:'concept', direction: false, cachedQuery: queryNaturalLanguage};
	if(indexUrlList.length==0){ // selectedConcept is the query's subject 
		newLogicElement.myVerbalization = "every " + selectedLabel;
		queryNaturalLanguage = "Give me " + newLogicElement.myVerbalization;
		queryLogicMap[selectedUrl] = newLogicElement;
		indexUrlList.push(selectedUrl);
		triple = {s:'?s'+anonymousIndexVariable, p:'a', o:"<"+selectedUrl+">"};
		anonymousIndexVariable++;
		querySparqlStructure.where.push(triple);
	}else if(queryLogicMap[elementOnFocus].type=='something'){ // selectedConcept completes reverse relation (replace placeholder something)
		newLogicElement.myVerbalization = selectedLabel;
		queryNaturalLanguage = queryLogicMap[elementOnFocus].cachedQuery + newLogicElement.myVerbalization;
		queryLogicMap.removeAttr(elementOnFocus);
		queryLogicMap[selectedUrl] = newLogicElement;
		indexUrlList.push(selectedUrl);
		triple = querySparqlStructure.where.pop();
		triple.o = "<"+selectedUrl+">";
		querySparqlStructure.where.push(triple);
	}else if(queryLogicMap[elementOnFocus].type=='concept'){ // before there is a concept, selected concecpt id a specialization of previous concept
		//gestione articolo
		newLogicElement.myVerbalization = "  that is ???" + selectedLabel;
		queryNaturalLanguage += " " + newLogicElement.myVerbalization;
		queryLogicMap[selectedUrl] = newLogicElement;
		indexUrlList.push(selectedUrl);
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
QueryVerbalizator.prototype.selectedPredicate = function(url, label, predicateDirection) {
	//update focus
	//update query
}