/*
	To show QueryExecutor interface : QueryExecutor.prototype
*/

var url;
var graph;
var query; 
var queryUrl;

var QueryExecutor = function (endpoint, selectedGraph) {
	if(!endpoint && !graph){
		url = "http://dbpedia.org/sparql";
		graph = "<http://dbpedia.org>";
	}
	else{
		url = endpoint;
		graph = selectedGraph;
	}


	query = "";
	queryUrl = "";
	console.log('instance created for ' + url);
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
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
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
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
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
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
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
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
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
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));
        }
    });	
	
}

/*
	Tested query to get all Band's predicates.
	SELECT DISTINCT ?p WHERE  { ?s a dbo:Band. {?s1 ?p ?s} UNION {?s ?p ?s2} }

	This function get all entity's predicates.
*/

QueryExecutor.prototype.getSelectedEntityPredicates = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s a " + entity + " . " +
						" {?s1 ?url ?s} UNION {?s ?url ?s2} " +
						" ?url rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
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
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
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
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			callback(handleResponseUrlAndLabel(data));        
		}
    });	
}

/*
	Handle response of GetAllEntitis function: it creates an array with entities' url and label.
*/
function handleResponseUrlAndLabel(data) {
	
	var arrayData = data.results.bindings;
	var results = new Array();

	for(i=0; i<arrayData.length; i++){
		results.push({url:arrayData[i].url.value, label:arrayData[i].label.value});
	}
	
	//console.log(results);
	return results;
}


