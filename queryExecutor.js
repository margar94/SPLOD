
var url;
var query; 
var queryUrl;

var QueryExecutor = function () {
	url = "http://dbpedia.org/sparql";
	query = "";
	queryUrl = "";
	console.log('instance created');
};

/*
	Get all top level classes. According to http://mappings.dbpedia.org/server/ontology/classes/ all top level classes are Thing's subclasses. 
*/
QueryExecutor.prototype.getAllEntities = function() {
	 query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT ?cl ?label " +
				" WHERE { " + 
					" GRAPH <http://dbpedia.org> { " +
						" ?cl rdfs:subClassOf owl:Thing. " +
						" ?cl rdfs:label ?label. " +
						" FILTER (lang(?label) = 'en') " +
					" } " +
				" } ";
	
   	queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        success: function( data ) {
			handleResponse(data);
        }
    });	
}

function handleResponse(data) {
	var arrayData=data.results.bindings;
	var results = new Array();

	for(i=0; i<arrayData.length; i++){
		results.push({url:arrayData[i].cl.value, label:arrayData[i].label.value});
	}
	
	//console.log(results);

	//TODO: asynchronous way to notify upper level that data are ready
}
