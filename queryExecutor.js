/*
	To show QueryExecutor interface : QueryExecutor.prototype
*/

var endpoint;
var graph;
var query, query2; 
var queryUrl, queryUrl2;

var language;

var operatorManager;
var tableResultManager;
var queryViewer;

var classHierarchyMap;
var classHierarchyMapRoots;

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

	language = 'en';

	classHierarchyMap = {};
	classHierarchyMapRoots = [];

	directPredicateMap = {};

	activeAjaxRequest = [];
	userAjaxRequest = null;

	resultLimit = defaultResultLimit;

	operatorManager = new OperatorManager();
	tableResultManager = new TableResultManager();
	queryViewer = new QueryViewer();

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
							" {?subclass a owl:Class} UNION {?subclass a rdfs:Class} " + 
							" OPTIONAL{?subclass rdfs:label ?label_subclass. " +
								" FILTER (lang(?label_subclass) = '" + language + "')} " +
							" OPTIONAL{?subclass rdfs:subClassOf ?superclass. " +
								" OPTIONAL {?superclass rdfs:label ?label_superclass. " +
									" FILTER (lang(?label_superclass) = '" + language + "')}}" +
						" } " +
					" } ";

	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	    $.ajax({
	        url: queryUrl,
	        method:'post',
	        success: function( data ) {
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
			        	classHierarchyMap = addInstancesOccurenceClassHierarchy(arrayData, classHierarchyMap);
			        	classHierarchyMap = cleanMap(classHierarchyMap);
			        	var mapRoots = getMapRoots(classHierarchyMap);
			        	classHierarchyMapRoots = mapRoots;
						callback(classHierarchyMapRoots, classHierarchyMap);
			        }
			    });	
			}
		});

	}
	else{
		callback(classHierarchyMapRoots, classHierarchyMap);
	}
}

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
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
					
		if(limit)
			query += "LIMIT " + limit;  
		
	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	    $.ajax({
	        url: queryUrl,
	     	method:'post',
	        success: function( data ) {
	        	var result = getUrlAndLabelFromResult(data);
	        	callback(managePredicateMap(result));
	        }
	    });	
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
					" FILTER (lang(?label) = '" + language + "')} " +
				" } " +
			" } ";
				
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data ) {
			var result = getUrlAndLabelFromResult(data);
	        callback(managePredicateMap(result));
        }
    });	
}

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
						" ?s ?url ?s2. " +
							"{ SELECT ?s {" +
								" ?s a <"+entity+">. " +
							" } LIMIT 20000 }" +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function( data, textStatus, jqXHR ) {
		        	var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
					callback(getUrlAndLabelFromResult(data));
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
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function( data, textStatus, jqXHR ) {
		        	var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
					callback(getUrlAndLabelFromResult(data));
		        }
		    });	

    activeAjaxRequest.push(xhr);
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
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
		        url: queryUrl,
		        method:'post',
		        success: function(data, textStatus, jqXHR ) {
		        	//remove this request from pending queries
		        	var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);

		        	var arrayData = data.results.bindings;
				    var subMap = getResultMap(arrayData);
					var mapRoots = getMapRoots(subMap);
				    callback(mapRoots, subMap);	
				      
		        }
		    });	

    activeAjaxRequest.push(xhr);
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
						" ?o a ?url. " +
						" ?s  <"+predicate+"> ?o. " +
						" OPTIONAL {?url rdfs:label ?label. " +
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
		        	var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);

					var arrayData = data.results.bindings;
				    var subMap = getResultMap(arrayData);
				    var mapRoots = getMapRoots(subMap);
				    callback(mapRoots, subMap);	
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
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
		        	var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
					callback(getUrlAndLabelFromResult(data));
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
						" FILTER (lang(?label) = '" + language + "')} " +
					" } " +
				" } ";
	if(limit)
		query += "LIMIT " + limit;  
	
   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
   var xhr = $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data, textStatus, jqXHR ) {
		        	var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);
					callback(getUrlAndLabelFromResult(data));
        }
    });	
   activeAjaxRequest.push(xhr);
}

//querySPARQL = {select:[], labelSelect:[], keySelect:[], where: [], limit}
QueryExecutor.prototype.executeUserQuery = function(querySPARQL){

	if(querySPARQL.select.length == 0)
		operatorManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, querySPARQL.keySelect, []);
	else{
		//console.log(querySPARQL.where);
		/*$.each(querySPARQL.where, function(index){
			querySPARQL.where[index] = querySPARQL.where[index].join(' ')
		});*/
		querySPARQL.where.join(' ');
		query = " SELECT " + querySPARQL.select.join(' ') +
					" WHERE { " + 
						" GRAPH " + graph + " { " +
							querySPARQL.where.join(' ') +
						" } " +
					" } ";
		
		query += "LIMIT " + resultLimit; 

		cachedUserQuery = [];
		cachedUserQuery.push("SELECT " + querySPARQL.select.join(' '));
		cachedUserQuery.push("WHERE { ");
		cachedUserQuery = cachedUserQuery.concat(querySPARQL.where);
		cachedUserQuery.push("} ");
		queryViewer.renderUserQuery(cachedUserQuery);
		console.log(query);
		
	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	    var xhr = $.ajax({
	        url: queryUrl,
	        method:'post',
	        success: function( data, textStatus, jqXHR ) {
		        	userAjaxRequest = null;

					operatorManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, querySPARQL.keySelect, data.results.bindings);
		        	tableResultManager.updateTable(querySPARQL.select, querySPARQL.labelSelect, data.results.bindings);
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

			classHierarchyMap[element.superclass.value] = {url:element.superclass.value, label: label, children : [], parent:[], numberOfInstances:0};
		}

		classHierarchyMap[element.superclass.value].children.push(element.subclass.value);

		if(!(element.subclass.value in classHierarchyMap)){

			var subclass_label = element.label_subclass;
			if(subclass_label == undefined)
				subclass_label = createLabel(element.subclass.value);
			else subclass_label = element.label_subclass.value;

			classHierarchyMap[element.subclass.value] = {url:element.subclass.value, label: subclass_label, children : [], numberOfInstances:0, parent: []};

		}
		classHierarchyMap[element.subclass.value].parent.push(element.superclass.value);

	});


}

function buildSubmapHierarchy(selectedClass){

	//ATTENZIONE controllare che sia nella mappa
	var elementStack = [];
	elementStack.push(selectedClass);

	var submap = {};
	var currentElement;
	var children;

	while(elementStack.length!=0){
		currentElement = elementStack.pop();
		submap[currentElement] = $.extend(true, {}, classHierarchyMap[currentElement]);

		children = classHierarchyMap[currentElement].children;

		for(var i=0; i<children.length; i++)
			elementStack.push(children[i]);
	}

	return submap;
}

function getResultMap(arrayData){
	var map = {};
	var label;

	$.each(arrayData, function(index){
		element = arrayData[index];

		label = element.label;
		if(label == undefined)
			label = createLabel(element.url.value);
		else label = element.url.value;

		if(element.url.value in classHierarchyMap){
			map = updateMap(element.url.value, label, map);

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

function updateMap(url, label, map){
	var elementStack = [];
	elementStack.push(url);

	var currentElement;
	var children;

	while(elementStack.length!=0){
		currentElement = elementStack.pop();
		map[currentElement] = $.extend(true, {}, classHierarchyMap[currentElement]);
		map[currentElement].numberOfInstances = 0;
		
		children = classHierarchyMap[currentElement].children;

		for(var i=0; i<children.length; i++)
			elementStack.push(children[i]);
	}
	//map[url].parent = [];
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
					console.log(element);
				}
			}
			for(var i=0; i<children.length; i++){
				if(map[children[i]]!=undefined){
					var index = $.inArray(element.url, map[children[i]].parent);
					map[children[i]].parent.splice(index, 1);
					map[children[i]].parent = map[children[i]].parent.concat(parents);
				}else{
					console.log(element);
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

function managePredicateMap(result){
	var predicateMap = {};
	for(var i=0; i< result.length; i++){
		predicateMap[result[i].url] = {url: result[i].url, label: result[i].label, numberOfInstances: 0};
	}	
	return predicateMap;
}
