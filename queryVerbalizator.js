// Object that keep info to build SPARQL query
var queryInfo;
// Query in natural language
var query;
// List of concepts in focus box
var concepts; 

var QueryVerbalizator = function () {
	query = ""; 
	concepts = "";
};

/*
	Notify to the queryVerbalizator the selected concept.
	url : concept's url
	label : concept's label
*/
QueryVerbalizator.prototype.selectedConcept = function(url, label) {
	//update focus
	//update query
}

/*
	Notify to the queryVerbalizator the selected predicate.
	url : predicate's url
	label : predicate's label
	predicateDirection : none if the selected predicate is a attribute,	
						 direct if the selected predicate is a direct relation,
						 reverse if the selected predicate is a reverse relation.
*/
QueryVerbalizator.prototype.selectedPredicate = function(url, label, predicateDirection) {
	//update focus
	//update query
}