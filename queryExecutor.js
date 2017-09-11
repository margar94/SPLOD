/*
	To show QueryExecutor interface : QueryExecutor.prototype
*/

var endpoint;
var graph;
var query; 
var queryUrl;

var resultManager;

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

	query = "";
	queryUrl = "";

	resultManager = new ResultManager();

	QueryExecutor.prototype._singletonInstance = this;
	
};

/*
	Get all top level classes. According to http://mappings.dbpedia.org/server/ontology/classes/ all top level classes are Thing's subclasses. 
*/
QueryExecutor.prototype.getAllEntities = function(callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?url rdfs:subClassOf owl:Thing. " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
}

/*
	Get entity subclasses.
	@url : url of superclass  
*/
QueryExecutor.prototype.getEntitySubclasses = function(url, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?url rdfs:subClassOf <" + url +"> . " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
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
		Get all Thing's predicates.
		1.  prefix owl: <http://www.w3.org/2002/07/owl#> 
			SELECT DISTINCT ?url ?label 
			WHERE { 
			GRAPH <http://dbpedia.org> { 
			?s a owl:Thing. {?s1 ?url ?s} UNION {?s ?url ?s2} ?url rdfs:label ?label. 
			FILTER (lang(?label) = 'en') }  }
			
		Get all Property.
		2.  prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
			prefix owl: <http://www.w3.org/2002/07/owl#> 
			SELECT DISTINCT ?url ?label 
			WHERE { 
			GRAPH <http://dbpedia.org> { 
			?url a rdf:Property. 
			?url rdfs:label ?label. 
			FILTER (lang(?label) = 'en') }  }
*/

QueryExecutor.prototype.getAllPredicates = function(limit, callback) {
	// Option 1
	/*
		query = " prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s a owl:Thing. " +
						" {?s1 ?url ?s} UNION {?s ?url ?s2} " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	*/
	// Option 2
	query = "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?url a rdf:Property. " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
				
				
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
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
					" ?url rdfs:label ?label. " +
					" FILTER (lang(?label) = 'en') " +
				" } " +
			" } ";
				
				
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
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
					" ?url rdfs:label ?label. " +
					" FILTER (lang(?label) = 'en') " +
				" } " +
			" } ";
				
				
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
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
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
}

/*
	This function get all reverse entity's predicates.
*/

QueryExecutor.prototype.getReversePredicatesFromPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s <"+predicate+"> ?o. " +
						" ?s2 ?url ?o. " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
}

QueryExecutor.prototype.getDirectPredicatesFromConcept = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s a <"+entity+">. " +
						" ?s ?url ?s2. " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
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
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
}

/*
	This function get all entity's direct predicates.
*/

QueryExecutor.prototype.getAllSelectedEntityDirectPredicates = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s a " + entity + " . " +
						" ?s ?url ?s2. " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
}

/*
	This function get all object of the selected predicate.
*/

QueryExecutor.prototype.getPredicateObject = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s <"+predicate+"> ?url. " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
}

/*
	This function get all entity's reverse predicates.
*/

QueryExecutor.prototype.getAllSelectedEntityReversePredicates = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s a " + entity + " . " +
						" ?s1 ?url ?s. " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));        
		}
    });	
}

//querySPARQL = {select:' ', where: ' ', limit}
QueryExecutor.prototype.executeUserQuery = function(querySPARQL){

	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT " + querySPARQL.select +
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
			resultManager.queryResult(data.results.bindings);
        }
    });
	
}

QueryExecutor.prototype.changeEndpoint = function (selectedEndpoint, selectedGraph) {
	endpoint = selectedEndpoint;
	graph = selectedGraph;
}

/*
	Handle response of GetAllEntitis function: it creates an array with entities' url and label.
*/
function handleResponseUrlAndLabel(data) {
	
	var arrayData = data.results.bindings;
	var result = new Array();

	for(i=0; i<arrayData.length; i++){
		result.push({url:arrayData[i].url.value, label:arrayData[i].label.value});
	}
	
	//console.log(result);
	return result;
}


