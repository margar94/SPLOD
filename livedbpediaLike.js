/*
	To show livedbpediaLike interface : livedbpediaLike.prototype
*/

var endpoint;
var graph;
var query, query2; 
var queryUrl, queryUrl2;

var labelLang = 'it';

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

var livedbpediaLike = function (selectedEndpoint, selectedGraph) {
	if(livedbpediaLike.prototype._singletonInstance){
		return livedbpediaLike.prototype._singletonInstance;
	}

	endpoint = selectedEndpoint;
	graph = selectedGraph;

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

	livedbpediaLike.prototype._singletonInstance = this;
};

//concepts
livedbpediaLike.prototype.getAllEntities = function(limit, callback) {
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
				" WHERE { ";
				if(graph) 
					query += " GRAPH " + graph + " { ";
						query += " {?subclass a owl:Class} UNION {?subclass a rdfs:Class} " + 
						" OPTIONAL{?subclass rdfs:label ?label_subclass. " +
							" FILTER (lang(?label_subclass) = '" + labelLang + "')} " +
						" OPTIONAL{?subclass rdfs:subClassOf ?superclass. " +
							" OPTIONAL {?superclass rdfs:label ?label_superclass. " +
								" FILTER (lang(?label_superclass) = '" + labelLang + "')}}";
					if(graph) 
						query += " } ";
				query += " } ";

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
				" WHERE { ";
				if(graph) 
					query2 += " GRAPH " + graph + " { ";
						query2 += " ?instance a ?class . " +
						" {?class a owl:Class} UNION {?class a rdfs:Class} " +
					" } ";
				if(graph)
					query2 += " } ";
				query2 += " group by ?class ";

	
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
livedbpediaLike.prototype.getEntitySubclasses = function(url, limit, callback) {
	var submap={};
	if(url in language_classHierarchyMap[labelLang]){
		submap = buildSubmapHierarchy(url, limit);

		/*var childrenTemp = language_classHierarchyMap[labelLang][url].children;
		for(var i=0; i<childrenTemp.length; i++){
			submap[childrenTemp[i]].parent = [];
		}
		delete submap[url];*/
	}
	callback(getMapRoots(submap), submap);
}

/*
	This function get all subject of the selected predicate.
*/
livedbpediaLike.prototype.getConceptsFromDirectPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
				if(graph) 
					query += " GRAPH " + graph + " { ";	
						query += " ?o a ?url. " +
						" ?s  <"+predicate+"> ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query += " } ";
				query += " } ";
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
livedbpediaLike.prototype.getConceptsFromSomething = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
				if(graph) 
					query += " GRAPH " + graph + " { ";
						query += " ?o a ?url. " +
						" ?s  <"+predicate+"> ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query += " } ";
				query += " } ";
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
livedbpediaLike.prototype.getAllDirectPredicates = function(limit, callback) {

		query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " + 
		" prefix owl: <http://www.w3.org/2002/07/owl#> " +
			" SELECT DISTINCT ?url ?label " +
			" WHERE { ";
				if(graph) 
				query += " GRAPH " + graph + " { ";
					query += " {?s ?url ?o. ?s a ?c. ?c a owl:Class} UNION {?s ?url ?o. ?s a ?c. ?c a rdfs:Class}  " +
					" OPTIONAL {?url rdfs:label ?label. " +
					" FILTER (lang(?label) = '" + labelLang + "')} ";
				if(graph) 
					query += " } ";
			query += " } ";
					
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

livedbpediaLike.prototype.getAllReversePredicates = function(limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " + 
		" prefix owl: <http://www.w3.org/2002/07/owl#> " +
			" SELECT DISTINCT ?url ?label " +
			" WHERE { ";
				if(graph) 
					query += " GRAPH " + graph + " { ";
					query += " {?s ?url ?o. ?o a ?c. ?c a owl:Class}UNION {?s ?url ?o. ?o a ?c. ?c a rdfs:Class} " +
					" OPTIONAL {?url rdfs:label ?label. " +
					" FILTER (lang(?label) = '" + labelLang + "')} ";
				if(graph) 
					query += " } ";
			query += " } ";
				
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
livedbpediaLike.prototype.getDirectPredicatesFromConcept = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
					if(graph) 
						query +=" GRAPH " + graph + " { ";
						query += " ?s ?url ?s2. " +
							"{ SELECT ?s {" +
								" ?s a <"+entity+">. " +
							" } LIMIT 20000 }" +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query +=" } ";
				query += " } ";
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
livedbpediaLike.prototype.getReversePredicatesFromConcept = function(entity, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
					if(graph) 
						query +=" GRAPH " + graph + " { ";
						query += " ?s2 ?url ?s. " +
							"{ SELECT ?s {" +
								" ?s a <"+entity+">. " +
							" } LIMIT 20000 }" +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query +=" } ";
				query += " } ";
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
livedbpediaLike.prototype.getDirectPredicatesFromPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
					if(graph) 
						query += " GRAPH " + graph + " { ";
						query += " ?o ?url ?s2. " +
						" FILTER (?o = ?obj){ " +
							" SELECT ?obj{ " +
								" ?s <"+predicate+"> ?obj. " +
							" } " +
							" GROUP BY ?obj " +
							" LIMIT 1 " +
						" } " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query +=" } ";
				query += " } ";
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

livedbpediaLike.prototype.getReversePredicatesFromPredicate = function(predicate, limit, callback) {
	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" prefix owl: <http://www.w3.org/2002/07/owl#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
					if(graph) 
						query += " GRAPH " + graph + " { ";
						query += " ?s2 ?url ?o. " +
						" FILTER (?o = ?obj){ " +
							" SELECT ?obj{ " +
								" ?s <"+predicate+"> ?obj. " +
							" } " +
							" GROUP BY ?obj " +
							" LIMIT 1 " +
						" } " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query += " } ";
				query += " } ";
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

livedbpediaLike.prototype.getDirectPredicatesFromResult = function(url, datatype, lang, penninculo, limit, callback) {
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
			if(penninculo!='')
				result = '"' + url.replace(/\"/g, '\\\"') + '"^^'+penninculo;
			else
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
			if(penninculo!='')
				result = '"'+url+'"^^'+penninculo;
			else
				result = '"'+url+'"';
			break;
	}

	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
					if(graph) 
						query +=" GRAPH " + graph + " { ";
						query +=  result +" ?url ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query +=" } ";
				query += " } ";
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

livedbpediaLike.prototype.getReversePredicatesFromResult = function(url, datatype, lang, penninculo, limit, callback) {
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
			if(penninculo!='')
				result = '"' + url.replace(/\"/g, '\\\"') + '"^^'+penninculo;
			else
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
			if(penninculo!='')
				result = '"'+url+'"^^'+penninculo;
			else
				result = '"'+url+'"';
			break;
	}

	query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
				" SELECT DISTINCT ?url ?label " +
				" WHERE { ";
					if(graph) 
						query +=" GRAPH " + graph + " { ";
						query += " ?o ?url "+result+". " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + labelLang + "')} ";
					if(graph) 
						query +=" } ";
				query += " } ";
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
livedbpediaLike.prototype.getPredicateStats = function(pred, callback){
	var query = " SELECT (COUNT(?o) AS ?number) " +
		" WHERE { ";
			if(graph) 
				query +=" GRAPH " + graph + " { ";
				query += " ?s <"+pred+"> ?o . ";
				if(graph) 
					query +="}";
			query += " } ";  

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
livedbpediaLike.prototype.getConceptStats = function(concept, callback){
	var query = " SELECT (COUNT(?s) AS ?number) " +
		" WHERE { ";
			if(graph) 
				query +=" GRAPH " + graph + " { ";
				query += " ?s a <"+concept+"> . ";
				if(graph) 
					query +="}";
			query += " } ";  

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
livedbpediaLike.prototype.executeUserQuery = function(querySPARQL){

	if(querySPARQL.select.length == 0)
		operatorManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, querySPARQL.keySelect, []);
	else{
		var where = '';
		$.each(querySPARQL.where, function(index){
			where += querySPARQL.where[index].content.join(' ')
		});

		query = " SELECT DISTINCT " + querySPARQL.select.join(' ') +
					" WHERE { "; 
						if(graph) 
							query +=" GRAPH " + graph + " { ";
						query += where;
						if(graph) 
							query +=" } ";
					query += " } ";
		
		query += "LIMIT " + resultLimit; 

		cachedUserQuery = [];
		cachedUserQuery.push("SELECT DISTINCT " + querySPARQL.select.join(' '));
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

livedbpediaLike.prototype.getUserQuery = function(){
	return cachedUserQuery;
}

livedbpediaLike.prototype.executeMapElementsLabelQuery = function(querySPARQL, callback){
	query = " SELECT DISTINCT " + querySPARQL.select.join(' ') +
				" WHERE { "; 
					if(graph) 
						query +=" GRAPH " + graph + " { ";
					query += querySPARQL.where.join(' ');
					if(graph) 
						query +=" } ";
				query += " } ";

	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
	        	userAjaxRequest = null;
	        	callback(data.results.bindings[0]);
        },
        error: function(jqXHR, textStatus, errorThrown) {
	        	userAjaxRequest = null;
	        	console.log(textStatus);
        }
    });
    langAjaxRequest=xhr;

}