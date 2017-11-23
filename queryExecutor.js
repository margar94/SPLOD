/*
	To show QueryExecutor interface : QueryExecutor.prototype
*/

var endpoint;
var graph;
var query, query2; 
var queryUrl, queryUrl2;

var labelLang = 'en';

var operatorManager;
var tableResultManager;
var queryViewer;

var language_classHierarchyMap;
var language_classHierarchyMapRoots;

//var directPredicateMap;

var activeAjaxRequest;
var userAjaxRequest;

var resultLimit;
var defaultResultLimit = 100;

var cachedUserQuery;

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
	query2 = '';
	queryUrl2 = '';

	cachedUserQuery = [];

	language_classHierarchyMap = {};
	language_classHierarchyMapRoots = [];

	directPredicateMap = {};

	activeAjaxRequest = [];
	userAjaxRequest = null;

	resultLimit = defaultResultLimit;

	operatorManager = new OperatorManager();
	tableResultManager = new TableResultManager();
	queryViewer = new QueryViewer();

	QueryExecutor.prototype._singletonInstance = this;
};

//concepts
QueryExecutor.prototype.getAllEntities = function(limit, callback) {
	if(labelLang in language_classHierarchyMap){
		if(!limit || Object.keys(language_classHierarchyMap[labelLang]).length<=limit){
			callback(language_classHierarchyMapRoots[labelLang], language_classHierarchyMap[labelLang]);
			return;
		}else{ // if(Object.keys(language_classHierarchyMap[labelLang]).length>limit)
			var map = cut(language_classHierarchyMap[labelLang], limit);
			var roots = getMapRoots(map);
			callback(roots, map);
			return;
		}
	} 

	language_classHierarchyMap[labelLang] = {};

	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT * " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" {?subclass a owl:Class} UNION {?subclass a rdfs:Class} " + 
						" OPTIONAL{?subclass rdfs:label ?label_subclass. " +
							" FILTER (lang(?label_subclass) = '" + labelLang + "')} " +
						" OPTIONAL{?subclass rdfs:subClassOf ?superclass. " +
							" OPTIONAL {?superclass rdfs:label ?label_superclass. " +
								" FILTER (lang(?label_superclass) = '" + labelLang + "')}}" +
					" } " +
				" } ";

	if(limit)
		query += "LIMIT " + limit;  

   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
        	//it builds initial concepts hierarchy
        	manageClassHierarchy(data);

			query2 = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT ?class (count(?instance) as ?numberOfInstances)  " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?instance a ?class . " +
						" {?class a owl:Class} UNION {?class a rdfs:Class} " +
					" } " +
				" } " +
				" group by ?class ";

	
		   	queryUrl2 = endpoint+"?query="+ encodeURIComponent(query2) +"&format=json";
		    $.ajax({
		        url: queryUrl2,
		        method:'post',
		        success: function( data ) {
		        	var arrayData = data.results.bindings;
		        	//it removes unused concepts
		        	language_classHierarchyMap[labelLang] = addInstancesOccurenceClassHierarchy(arrayData, language_classHierarchyMap[labelLang]);
		        	language_classHierarchyMap[labelLang] = cleanMap(language_classHierarchyMap[labelLang]);
		        	var mapRoots = getMapRoots(language_classHierarchyMap[labelLang]);
		        	language_classHierarchyMapRoots[labelLang] = mapRoots;
					callback(language_classHierarchyMapRoots[labelLang], language_classHierarchyMap[labelLang]);
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		        	console.log(textStatus);
		        	delete language_classHierarchyMapRoots[labelLang];
		        },
				complete: function(){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	
		},
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus);
        }
	});

	activeAjaxRequest.push(xhr);
}

/*
	Get entity subclasses.
	@url : url of superclass  
*/
QueryExecutor.prototype.getEntitySubclasses = function(url, limit, callback) {
	var submap={};
	if(url in language_classHierarchyMap[labelLang]){
		submap = buildSubmapHierarchy(url, limit);

		var childrenTemp = language_classHierarchyMap[labelLang][url].children;
		for(var i=0; i<childrenTemp.length; i++){
			submap[childrenTemp[i]].parent = [];
		}
		delete submap[url];
	}
	callback(getMapRoots(submap), submap);
}

/*
	This function get all subject of the selected predicate.
*/
QueryExecutor.prototype.getConceptsFromDirectPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +	
						" ?o a ?url. " +
						" ?s  <"+predicate+"> ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function(data, textStatus, jqXHR ) {
		        	var arrayData = data.results.bindings;
				    //var subMap = getResultMap(arrayData);
				    var subMap = manageResultMap(arrayData);
					var mapRoots = getMapRoots(subMap);
				    callback(mapRoots, subMap);	
				      
		        },
				error: function(jqXHR, textStatus, errorThrown){
					console.log(textStatus);
					//callback([], {});
				},
				complete: function(jqXHR){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	

    activeAjaxRequest.push(xhr);
}

/*
	This function get all object of the selected predicate.
*/
QueryExecutor.prototype.getConceptsFromSomething = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?o a ?url. " +
						" ?s  <"+predicate+"> ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
        	var arrayData = data.results.bindings;
		    //var subMap = getResultMap(arrayData);
		    var subMap = manageResultMap(arrayData);
		    var mapRoots = getMapRoots(subMap);
		    callback(mapRoots, subMap);	
        },
		error: function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
			//callback([], {});
		},
		complete: function(jqXHR){
			var index = $.inArray(jqXHR, activeAjaxRequest);
        	if(index != -1)
        		activeAjaxRequest.splice(index, 1);
		}
    });	
    activeAjaxRequest.push(xhr);
}

//predicates
/*
	SELECT DISTINCT ?property
	WHERE
	{ 
		?s ?property ?o. 
		?o a ?c.
		FILTER (?c = ?class){
			SELECT ?class{
				?class a owl:Class; rdfs:subClassOf ?super.
			}
			GROUP BY ?class
			LIMIT 1
		}
		OPTIONAL {?property rdfs:label ?label. 
		FILTER (lang(?label) = 'en')}
	}
*/
QueryExecutor.prototype.getAllDirectPredicates = function(limit, callback) {

		query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " + 
			" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s ?url ?o. " +
						" ?s a ?c. " +
						" FILTER (?c = ?class){ " +
							" SELECT ?class{ " +
								" {?class a owl:Class}UNION {?class a rdfs:Class} "+
								" ?class rdfs:subClassOf ?super. " +
							" } " +
							" GROUP BY ?class " +
							" LIMIT 1 " +
						" } " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
					
		if(limit)
			query += "LIMIT " + limit;  
		
	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	     var xhr = $.ajax({
	        url: queryUrl,
	     	method:'post',
	        success: function( data ) {
	        	//it builds map with url, label and stats
	        	var arrayData = data.results.bindings;
	        	callback(manageResultMap(arrayData));
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	console.log(textStatus);
	        	callback({});
	        },
	        complete: function(jqXHR){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	
	     
    activeAjaxRequest.push(xhr);
}

QueryExecutor.prototype.getAllReversePredicates = function(limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " + 
		" prefix owl: <http://www.w3.org/2002/07/owl#> " +
			" SELECT DISTINCT ?url ?label " +
			" WHERE { " + 
				" GRAPH " + graph + " { " +
					" ?s ?url ?o. " +
					" ?o a ?c. " +
					" FILTER (?c = ?class){ " +
						" SELECT ?class{ " +
							" {?class a owl:Class}UNION {?class a rdfs:Class} "+
							" ?class rdfs:subClassOf ?super. " +
						" } " +
						" GROUP BY ?class " +
						" LIMIT 1 " +
					" } " +
					" OPTIONAL {?url rdfs:label ?label. " +
					" FILTER (lang(?label) = '" + labelLang + "')} " +
				" } " +
			" } ";
				
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data ) {
        	//it builds map with url, label and stats
			var arrayData = data.results.bindings;
	        callback(manageResultMap(arrayData));
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus);
        	callback({});
        },
   		complete: function(jqXHR){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	

    activeAjaxRequest.push(xhr);	
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
						" ?s ?url ?s2. " +
							"{ SELECT ?s {" +
								" ?s a <"+entity+">. " +
							" } LIMIT 20000 }" +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function( data, textStatus, jqXHR ) {
		        	//it builds map with url, label and stats
					var arrayData = data.results.bindings;
			        callback(manageResultMap(arrayData));
		        },
				error: function(jqXHR, textStatus, errorThrown){
					console.log(textStatus);
					//callback([]);
				},
				complete: function(jqXHR){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	
    activeAjaxRequest.push(xhr);
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
						" ?s2 ?url ?s. " +
							"{ SELECT ?s {" +
								" ?s a <"+entity+">. " +
							" } LIMIT 20000 }" +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function( data, textStatus, jqXHR ) {
		        	//it builds map with url, label and stats
					var arrayData = data.results.bindings;
			        callback(manageResultMap(arrayData));
		        },
				error: function(jqXHR, textStatus, errorThrown){
					console.log(textStatus);
					//callback([]);
				},
				complete: function(jqXHR){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	

    activeAjaxRequest.push(xhr);
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
						" ?o ?url ?s2. " +
						" FILTER (?o = ?obj){ " +
							" SELECT ?obj{ " +
								" ?s <"+predicate+"> ?obj. " +
							" } " +
							" GROUP BY ?obj " +
							" LIMIT 1 " +
						" } " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
		    //it builds map with url, label and stats
			var arrayData = data.results.bindings;
	        callback(manageResultMap(arrayData));
        },
		error: function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
			//callback([]);
		},
		complete: function(jqXHR){
			var index = $.inArray(jqXHR, activeAjaxRequest);
        	if(index != -1)
        		activeAjaxRequest.splice(index, 1);
		}
    });	

    activeAjaxRequest.push(xhr);
}

QueryExecutor.prototype.getReversePredicatesFromPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?s2 ?url ?o. " +
						" FILTER (?o = ?obj){ " +
							" SELECT ?obj{ " +
								" ?s <"+predicate+"> ?obj. " +
							" } " +
							" GROUP BY ?obj " +
							" LIMIT 1 " +
						" } " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
		    //it builds map with url, label and stats
			var arrayData = data.results.bindings;
	        callback(manageResultMap(arrayData));
        },
		error: function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
			//callback([]);
		},
		complete: function(jqXHR){
			var index = $.inArray(jqXHR, activeAjaxRequest);
        	if(index != -1)
        		activeAjaxRequest.splice(index, 1);
		}
    });	
   activeAjaxRequest.push(xhr);
}

QueryExecutor.prototype.getDirectPredicatesFromResult = function(url, datatype, lang, limit, callback) {
	var result;
	switch(datatype){
		case 'uri':
		case 'img':
			result = "<"+url+">";
			break;
		case 'number':
		case 'boolean': //?
			result = url;
			break;
		case 'string':
			result = '"' + url.replace(/\"/g, '\\\"') + '"';
			break;
		case 'literal':
			result = '"' + url.replace(/\"/g, '\\\"') + '"@'+lang;
			break;
		case 'gYear':
		case 'gMonth':
		case 'gDay':
		case 'gMonthDay':
		case 'gYearMonth':
		case 'date':
		case 'dateTime':
		case 'time': 
			result = 'xsd:'+datatype+'("'+url+'")';
			break;
	}

	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						  result +" ?url ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function( data, textStatus, jqXHR ) {
					//it builds map with url, label and stats
					var arrayData = data.results.bindings;
			        callback(manageResultMap(arrayData));
		        },
				error: function(jqXHR, textStatus, errorThrown){
					console.log(textStatus);
					//callback([]);
				},
				complete: function(jqXHR){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	
    activeAjaxRequest.push(xhr);
}

QueryExecutor.prototype.getReversePredicatesFromResult = function(url, datatype, lang, limit, callback) {
	var result;
	switch(datatype){
		case 'uri':
		case 'img':
			result = "<"+url+">";
			break;
		case 'number':
		case 'boolean': //?
			result = url;
			break;
		case 'string':
			result = '"' + url.replace(/\"/g, '\\\"') + '"';
			break;
		case 'literal':
			result = '"' + url.replace(/\"/g, '\\\"') + '"@'+lang;
			break;
		case 'gYear':
		case 'gMonth':
		case 'gDay':
		case 'gMonthDay':
		case 'gYearMonth':
		case 'date':
		case 'dateTime':
		case 'time': 
			result = 'xsd:'+datatype+'("'+url+'")';
			break;
	}

	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { " + 
					" GRAPH " + graph + " { " +
						" ?o ?url "+result+". " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function( data, textStatus, jqXHR ) {
		        	//it builds map with url, label and stats
					var arrayData = data.results.bindings;
			        callback(manageResultMap(arrayData));
		        },
				error: function(jqXHR, textStatus, errorThrown){
					console.log(textStatus);
					//callback([]);
				},
				complete: function(jqXHR){
					var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
				}
		    });	

    activeAjaxRequest.push(xhr);
}

//live stats
/*
	SELECT (COUNT(?o) AS ?totalNumberOfNames)
	WHERE { ?s dbp:name ?o }
*/
QueryExecutor.prototype.getPredicateStats = function(pred, callback){
	var query = " SELECT (COUNT(?o) AS ?number) " +
		" WHERE { " + 
			" GRAPH " + graph + " { " +
				" ?s <"+pred+"> ?o . "+
				"}" +
			" } ";  

   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data ) {
        	var arrayData = data.results.bindings;
        	callback(arrayData[0]['number'].value);
        },
		error: function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
			callback('');
		}
    });	
}

/*
	SELECT (COUNT(?s) AS ?totalNumberOfNames)
	WHERE { ?s a dbo:Activity. }
*/
QueryExecutor.prototype.getConceptStats = function(concept, callback){
	var query = " SELECT (COUNT(?s) AS ?number) " +
		" WHERE { " + 
			" GRAPH " + graph + " { " +
				" ?s a <"+concept+"> . "+
				"}" +
			" } ";  

   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data ) {
        	var arrayData = data.results.bindings;
        	callback(arrayData[0]['number'].value);
        },
		error: function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
			callback('');
		}
    });	
}

//querySPARQL = {select:[], labelSelect:[], keySelect:[], where: []}
QueryExecutor.prototype.executeUserQuery = function(querySPARQL){

	if(querySPARQL.select.length == 0)
		operatorManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, querySPARQL.keySelect, []);
	else{
		var where = '';
		$.each(querySPARQL.where, function(index){
			where += querySPARQL.where[index].content.join(' ')
		});

		query = " SELECT " + querySPARQL.select.join(' ') +
					" WHERE { " + 
						" GRAPH " + graph + " { " +
							where +
						" } " +
					" } ";
		
		query += "LIMIT " + resultLimit; 

		cachedUserQuery = [];
		cachedUserQuery.push("SELECT " + querySPARQL.select.join(' '));
		cachedUserQuery.push("WHERE { ");
		cachedUserQuery = cachedUserQuery.concat(querySPARQL.where);
		cachedUserQuery.push("} ");
		cachedUserQuery.push("LIMIT " + resultLimit);
		queryViewer.renderUserQuery(cachedUserQuery);
		
	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	    var xhr = $.ajax({
	        url: queryUrl,
	        method:'post',
	        success: function( data, textStatus, jqXHR ) {
		        	userAjaxRequest = null;

					operatorManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, querySPARQL.keySelect, data.results.bindings);
		        	tableResultManager.updateTable(querySPARQL.select, querySPARQL.labelSelect, data.results.bindings);
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
		        	userAjaxRequest = null;
		        	console.log(textStatus);

					operatorManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, querySPARQL.keySelect, []);
		        	tableResultManager.updateTable(querySPARQL.select, querySPARQL.labelSelect, []);
	        }
	    });
	    userAjaxRequest=xhr;
	}
	
}

QueryExecutor.prototype.getUserQuery = function(){
	return cachedUserQuery;
}

QueryExecutor.prototype.changeEndpoint = function (selectedEndpoint, selectedGraph) {
	endpoint = selectedEndpoint;
	graph = selectedGraph;
}

/*QueryExecutor.prototype.changeLanguage = function (selectedLanguage) {
	labelLang = selectedLanguage;
}*/

function manageResultMap(arrayData){
	var resultMap = {};
	var element;
	var label;
	
	for(i=0; i<arrayData.length; i++){
		element = arrayData[i];
		if(element.label == undefined){
			label = createLabel(element.url.value);
			element.label = {value:label};
		}
		resultMap[element.url.value] = {url:element.url.value, label:element.label.value, numberOfInstances: 0, parent: [], children: []};
	}

	return resultMap;
}

function manageClassHierarchy(data){
	var arrayData = data.results.bindings;
	var element; 
	var label;

	$.each(arrayData, function(index){
		element = arrayData[index];

		if(!(element.superclass.value in language_classHierarchyMap[labelLang])){
		
			label = element.label_superclass;
			if(label == undefined)
				label = createLabel(element.superclass.value);
			else 
				label = element.label_superclass.value;

			language_classHierarchyMap[labelLang][element.superclass.value] = {url:element.superclass.value, label: label, children : [], parent:[], numberOfInstances:0};
		}

		language_classHierarchyMap[labelLang][element.superclass.value].children.push(element.subclass.value);

		if(!(element.subclass.value in language_classHierarchyMap[labelLang])){

			var subclass_label = element.label_subclass;
			if(subclass_label == undefined)
				subclass_label = createLabel(element.subclass.value);
			else 
				subclass_label = element.label_subclass.value;

			language_classHierarchyMap[labelLang][element.subclass.value] = {url:element.subclass.value, label: subclass_label, children : [], numberOfInstances:0, parent: []};

		}
		language_classHierarchyMap[labelLang][element.subclass.value].parent.push(element.superclass.value);

	});
}

function cut(originalMap, limit){
	var stack = $.extend(true, [], language_classHierarchyMapRoots[labelLang]); 

	var map = {};
	var current;

	var counter = 0;
	while(stack.length!=0){
		//limit could be false
		if(counter == limit)
			return map;

		current = stack.pop();
		if(!(current in map)){
			map[current] = $.extend(true, {}, originalMap[current]);
			map[current].children = [];

			counter++;

			stack = originalMap[current].children.concat(stack);
		}

		for(var i=0; i<map[current].parent.length; i++){
			if(map[current].parent[i] in map && $.inArray(current, map[map[current].parent[i]].children)<0)
				map[map[current].parent[i]].children.push(current);
		}
		
	}

	return map;
}

function buildSubmapHierarchy(selectedClass, limit){
	var map = {};
	if(!(selectedClass in language_classHierarchyMap[labelLang])){
		map[selectedClass] = {url:selectedClass, label: createLabel(selectedClass), children : [], parent:[], numberOfInstances:0};
		return map;
	}

	map[selectedClass] = $.extend(true, {}, language_classHierarchyMap[labelLang][selectedClass]);
	map[selectedClass].children = [];
	map[selectedClass].parent = [];

	var counter=0;
		
	var stack = $.extend(true, [], language_classHierarchyMap[labelLang][selectedClass].children);
	
	var current;	
	while(stack.length!=0){

		//limit could be false
		if(counter == limit)
			return map;

		current = stack.pop();

		if(!(current in map)){
			map[current] = $.extend(true, {}, language_classHierarchyMap[labelLang][current]);
			map[current].children = [];
			
			counter++;
		
			stack = language_classHierarchyMap[labelLang][current].children.concat(stack);
		}

		for(var i=0; i<map[current].parent.length; i++){
			if(map[current].parent[i] in map && $.inArray(current, map[map[current].parent[i]].children)<0)
				map[map[current].parent[i]].children.push(current);
		}
	
	}
	return map;
}

//DELETE
function getResultMap(arrayData){
	var map = {};
	var label;

	$.each(arrayData, function(index){
		element = arrayData[index];

		label = element.label;
		if(label == undefined)
			label = createLabel(element.url.value);
		else 
			label = element.url.value;

		//it doesn't clone map entry, but it clone entry status
		if(element.url.value in language_classHierarchyMap[labelLang]){
			map[element.url.value] = $.extend(true, {}, language_classHierarchyMap[labelLang][element.url.value]);
			map[element.url.value].children = [];
			map[element.url.value].numberOfInstances = 0;
		}else{
			map[element.url.value] = {url: element.url.value, label: label, children: [], parent: [], numberOfInstances:0};
		}

	});

	for(key in map){
		var parents = map[key].parent;
		for(var i=0; i<parents.length; i++){
			if(!(parents[i] in map))
				map[key].parent.splice(i, 1);


		}
	}

	return map;
}

//data must contain class to identify url class and numberOfInstances
function addInstancesOccurenceClassHierarchy(arrayData, map){

	$.each(arrayData, function(index){
		element = arrayData[index];

		if(element.class.value in map){
			map[element.class.value].numberOfInstances = element.numberOfInstances.value;
		}
		/*else{
			console.log("QUERYEXECUTOR : " + element.class.value + " not in map");
		}*/
	});
	return map; 
}

function cleanMap(map){

/*	

	for(key in map){
		var element = map[key];

		if(element.numberOfInstances == 0){

			var parents = element.parent;
			var children = element.children;

			for(var i=0; i<children.length; i++){
				var index = $.inArray(key, map[children[i]].parent);
				map[children[i]].parent.splice(index, 1);
			}

			for(var i=0; i<parents.length; i++){
				var index = $.inArray(key, map[parents[i]].children);
				map[parents[i]].children.splice(index, 1);
			}

			for(var i=0; i<parents.length; i++){
				for(var j=0; j<children.length; j++){
					map[parents[i]].children.push(children[j]);
					map[children[j]].parent.push(parents[i]);
				}
			}

			delete map[key];
		}
	}
*/


	var element;
	var elementsToCheck = [];
	for(key in map){
		element = map[key];
		if(element.numberOfInstances == 0){
			var  parents = element.parent;
			var children = element.children;
			for(var i=0; i<parents.length; i++){
				if(map[parents[i]]!= undefined){
					var index = $.inArray(element.url, map[parents[i]].children);
					map[parents[i]].children.splice(index, 1);
					map[parents[i]].children = map[parents[i]].children.concat(children);
				}else{
					//console.log(element);
				}
			}
			for(var i=0; i<children.length; i++){
				if(map[children[i]]!=undefined){
					var index = $.inArray(element.url, map[children[i]].parent);
					map[children[i]].parent.splice(index, 1);
					map[children[i]].parent = map[children[i]].parent.concat(parents);
				}else{
					//console.log(element);
				}
			}
			delete map[key];
		}
	}
	return map;
}

function getMapRoots(map){
	var roots = [];
	for(element in map){
		if(map[element].parent.length==0){
			roots.push(element);
		}
	}
	return roots;
}

