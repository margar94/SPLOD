/*
	To show QueryExecutor interface : QueryExecutor.prototype
*/

var endpoint;
var graph;
var query; 
var queryUrl;

var language;

var resultManager;

var classHierarchyMap;
var classHierarchyMapRoots;

var QueryExecutor = function (selectedEndpoint, selectedGraph) {
	if(QueryExecutor.prototype._singletonInstance){
		return QueryExecutor.prototype._singletonInstance;
	}

	if(!endpoint && !graph){
		endpoint = "http://dbpedia.org/sparql";
		graph = "<http://dbpedia.org>";
	}
	else{
		endpoint = selectedEndpoint;
		graph = selectedGraph;
	}

	query = '';
	queryUrl = '';

	language = 'en';

	classHierarchyMap = {};
	classHierarchyMapRoots = [];

	resultManager = new ResultManager();

	QueryExecutor.prototype._singletonInstance = this;
	
};

/*
	Get classe's hierarchy. 
*/
QueryExecutor.prototype.getAllEntities = function(callback) {
	if($.isEmptyObject(classHierarchyMap)){
		query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
					" prefix owl: <http://www.w3.org/2002/07/owl#> " +
					" SELECT DISTINCT * " +
					" WHERE { " + 
						" GRAPH " + graph + " { " +
							" ?subclass a owl:Class ; rdfs:subClassOf ?superclass. " +
							" OPTIONAL {?superclass rdfs:label ?label_superclass. " +
							" ?subclass rdfs:label ?label_subclass. " +
							" FILTER ((lang(?label_superclass) = '" + language + "') &&  (lang(?label_subclass) = '" + language + "')) }" +
						" } " +
					" } ";
		
	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	    $.ajax({
	        url: queryUrl,
	        success: function( data ) {
	        	manageClassHierarchy(data);
	        	//console.log(classHierarchyMap);
	        	//console.log(classHierarchyMapRoots);
				callback(classHierarchyMapRoots, classHierarchyMap);
	        }
	    });	
	}
	else{
		callback(classHierarchyMapRoots, classHierarchyMap);
	}
}


/*
	TODO : entity that has subclasses
*/

/*
	TODO : get entity that has a word in url or in label
*/

/*
	TODO : Filter entities by label.
*/

/*
	Tested query : 
		prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		prefix owl: <http://www.w3.org/2002/07/owl#> 
		SELECT DISTINCT ?url ?label 
		WHERE { 
		GRAPH <http://dbpedia.org> { 
		?s a owl:Thing.
		?s ?url ?s2.
		?url rdfs:label ?label. 
		FILTER (lang(?label) = 'en') }  }
		LIMIT 100
*/

QueryExecutor.prototype.getAllDirectPredicates = function(limit, callback) {
	
	query = " prefix owl: <http://www.w3.org/2002/07/owl#> " +
			" SELECT DISTINCT ?url ?label " +
			" WHERE { " + 
				" GRAPH " + graph + " { " +
					" ?s a owl:Thing. " +
					" ?s ?url ?s2. " +
					" OPTIONAL {?url rdfs:label ?label. " +
					" FILTER (lang(?label) = '" + language + "')} " +
				" } " +
			" } ";
				
				
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
        	var result = getUrlAndLabelFromResult(data);
        	//console.log(result);
			callback(result);
        }
    });	
	
}

/*
	Tested query : 
		prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		prefix owl: <http://www.w3.org/2002/07/owl#> 
		SELECT DISTINCT ?url ?label 
		WHERE { 
		GRAPH <http://dbpedia.org> { 
		?s a owl:Thing.
		?s2 ?url ?s.
		?url rdfs:label ?label. 
		FILTER (lang(?label) = 'en') }  }
		LIMIT 100
*/

QueryExecutor.prototype.getAllReversePredicates = function(limit, callback) {
	query = " prefix owl: <http://www.w3.org/2002/07/owl#> " +
			" SELECT DISTINCT ?url ?label " +
			" WHERE { " + 
				" GRAPH " + graph + " { " +
					" ?s a owl:Thing. " +
					" ?s2 ?url ?s. " +
					" OPTIONAL {?url rdfs:label ?label. " +
					" FILTER (lang(?label) = '" + language + "')} " +
				" } " +
			" } ";
				
				
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(getUrlAndLabelFromResult(data));
        }
    });	
	
}


/*
	Get entity subclasses.
	@url : url of superclass  
*/
QueryExecutor.prototype.getEntitySubclasses = function(url, limit, callback) {
	var submap={};
	if(url in classHierarchyMap){
		submap = buildSubmapHierarchy(url);
	}
	callback([url], submap);
}

/*
	Get direct predicates from entity.
	@entity : url of Concept  
*/
QueryExecutor.prototype.getDirectPredicatesFromConcept = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s a <"+entity+">. " +
						" ?s ?url ?s2. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(getUrlAndLabelFromResult(data));
        }
    });	
}

/*
	This function get all reverse entity's predicates.
*/
QueryExecutor.prototype.getReversePredicatesFromConcept = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s a <"+entity+">. " +
						" ?s2 ?url ?s. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(getUrlAndLabelFromResult(data));
        }
    });	
}

/*
	This function get all subject of the selected predicate.
*/
QueryExecutor.prototype.getConceptsFromDirectPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +	
						" ?subject <"+predicate+"> ?o. " +
						" ?subject a ?url. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(getUrlAndLabelFromResult(data));
        }
    });	
}

/*
	This function get all object of the selected predicate.
*/
QueryExecutor.prototype.getConceptsFromReversePredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s <"+predicate+"> ?o. " +
						" ?o a ?url. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(getUrlAndLabelFromResult(data));
        }
    });	
}
/*
	Tested query 
		prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
		prefix owl: <http://www.w3.org/2002/07/owl#> 
		SELECT DISTINCT ?url ?label
		WHERE { 
		GRAPH <http://dbpedia.org> { 
		?s <http://dbpedia.org/property/author> ?o  .
		?o ?url ?s2.
		?url rdfs:label ?label. 
		FILTER (lang(?label) = 'en') 
				
		}}LIMIT 100

	This function get all direct entity's predicates.
*/
QueryExecutor.prototype.getDirectPredicatesFromPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s <"+predicate+"> ?o. " +
						" ?o ?url ?s2. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(getUrlAndLabelFromResult(data));
        }
    });	
}

QueryExecutor.prototype.getReversePredicatesFromPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s <"+predicate+"> ?o. " +
						" ?s2 ?url ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(getUrlAndLabelFromResult(data));
        }
    });	
}

//querySPARQL = {select:[], where: ' ', limit}
QueryExecutor.prototype.executeUserQuery = function(querySPARQL){

	if(querySPARQL.select.length == 0)
		resultManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, []);
	else{
		query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
					" SELECT " + querySPARQL.select.join(' ') +
					" WHERE { " + 
						" GRAPH " + graph + " { " +
							querySPARQL.where +
						" } " +
					" } ";
		if(querySPARQL.limit)
			query += "LIMIT " + querySPARQL.limit;  
		
	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	    $.ajax({
	        url: queryUrl,
	        success: function( data ) {
				resultManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, data.results.bindings);
	        }
	    });
	}
	
}

QueryExecutor.prototype.changeEndpoint = function (selectedEndpoint, selectedGraph) {
	endpoint = selectedEndpoint;
	graph = selectedGraph;
}

QueryExecutor.prototype.changeLanguage = function (selectedLanguage) {
	language = selectedLanguage;
}

/*
	Handle response of GetAllEntitis function: it creates an array with entities' url and label.
*/
function getUrlAndLabelFromResult(data) {
	
	var arrayData = data.results.bindings;
	var result = new Array();
	var element;
	var label;
	
	for(i=0; i<arrayData.length; i++){
		element = arrayData[i];
		if(element.label == undefined){
			label = createLabel(element.url.value);
			element.label = {value:label};
		}
		result.push({url:element.url.value, label:element.label.value});
	}
	
	//console.log(result);
	return result;
}

function manageClassHierarchy(data){

	var arrayData = data.results.bindings;
	var element; 
	var label;

	$.each(arrayData, function(index){
		element = arrayData[index];

		if(!(element.superclass.value in classHierarchyMap)){
		
			label = element.label_superclass;
			if(label == undefined)
				label = createLabel(element.superclass.value);
			else label = element.label_superclass.value;

			classHierarchyMap[element.superclass.value] = {label: label, children : [], parent:null};
		}

		classHierarchyMap[element.superclass.value].children.push(element.subclass.value);

		if(!(element.subclass.value in classHierarchyMap)){

			var subclass_label = element.label_subclass;
			if(subclass_label == undefined)
				subclass_label = createLabel(element.subclass.value);
			else subclass_label = element.label_subclass.value;

			classHierarchyMap[element.subclass.value] = {label: subclass_label, children : []};

		}
		classHierarchyMap[element.subclass.value].parent = element.superclass.value;

	});

	for(element in classHierarchyMap){
		if(classHierarchyMap[element].parent==null){
			classHierarchyMapRoots.push(element);
		}
	}

}

function buildSubmapHierarchy(selectedClass){
	var elementStack = [];
	elementStack.push(selectedClass);

	var submap = {};
	var currentElement;
	var children;

	while(elementStack.length!=0){
		currentElement = elementStack.pop();
		submap[currentElement] = classHierarchyMap[currentElement];

		children = classHierarchyMap[currentElement].children;

		for(var i=0; i<children.length; i++)
			elementStack.push(children[i]);
	}

	return submap;
}