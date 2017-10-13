/*
	To show QueryExecutor interface : QueryExecutor.prototype
*/

var endpoint;
var graph;
var query, query2; 
var queryUrl, queryUrl2;

var language;

var operatorManager;

var classHierarchyMap;
var classHierarchyMapRoots;

//var directPredicateMap;

var activeAjaxRequest;

var resultLimit;

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

	language = 'en';

	classHierarchyMap = {};
	classHierarchyMapRoots = [];

	directPredicateMap = {};

	activeAjaxRequest = [];

	resultLimit = false;

	operatorManager = new OperatorManager();

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
	        method:'post',
	        success: function( data ) {
	        	manageClassHierarchy(data);

				query2 = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
					" prefix owl: <http://www.w3.org/2002/07/owl#> " +
					" SELECT ?class (count(?class) as ?numberOfInstances)  " +
					" WHERE { " + 
						" GRAPH " + graph + " { " +
							" {?istance a ?class. "+
							" ?class a owl:Class. "+
							" FILTER(!EXISTS{?class rdfs:subClassOf ?superclass.}) } UNION" +
							" {?istance a ?subclass. "+
							" ?subclass a owl:Class ; rdfs:subClassOf ?class. }" +
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
								" ?class a owl:Class; rdfs:subClassOf ?super. " +
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
							" ?class a owl:Class; rdfs:subClassOf ?super. " +
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






QueryExecutor.prototype.getAllPredicatesStats = function(limit, callback){

	var query = " SELECT ?property (COUNT(?property) AS ?propTotal) " +
		" WHERE { " + 
			" GRAPH " + graph + " { " +
				" ?s ?property ?o . "+
				"}" +
			" } " +
		" GROUP BY ?property " ;
	if(limit)
		query += "LIMIT " + limit;  

   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
    $.ajax({
        url: queryUrl,
        method:'post',
        success: function( data ) {
        	var arrayData = data.results.bindings;
        	callback(managePropertyStats(arrayData));
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


		        	query2 = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
						" prefix owl: <http://www.w3.org/2002/07/owl#> " +
						" SELECT ?class (count(?class) as ?numberOfInstances)  " +
						" WHERE { " + 
							" GRAPH " + graph + " { " +
								" ?o a ?class. " +
								" ?s  <"+predicate+"> ?o. " +
								" OPTIONAL {?class rdfs:label ?label. " +
								" FILTER (lang(?label) = '" + language + "')} " +
							" } " +
						" } " +
						" group by ?class";
			
				   	queryUrl2 = endpoint+"?query="+ encodeURIComponent(query2) +"&format=json";
				    var xhr2 = $.ajax({
				        url: queryUrl2,
				        method:'post',
				        success: function( data, textStatus, jqXHR ) {
					        //remove this request from pending queries
			        		var index = $.inArray(jqXHR, activeAjaxRequest);
			        		if(index != -1)
			        			activeAjaxRequest.splice(index, 1);

				        	var arrayData = data.results.bindings;					
				        	subMap = addInstancesOccurenceClassHierarchy(arrayData, subMap);
				        	subMap = cleanMap(subMap);

				        	var mapRoots = getMapRoots(subMap);
				        	callback(mapRoots, subMap);	
				        }
				    });	
				    activeAjaxRequest.push(xhr2);
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

				    query2 = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
						" prefix owl: <http://www.w3.org/2002/07/owl#> " +
						" SELECT ?class (count(?class) as ?numberOfInstances)  " +
						" WHERE { " + 
							" GRAPH " + graph + " { " +
								" ?o a ?class. " +
								" ?s  <"+predicate+"> ?o. " +
								" OPTIONAL {?class rdfs:label ?label. " +
								" FILTER (lang(?label) = '" + language + "')} " +
							" } " +
						" } " +
						" group by ?class ";
			
				   	queryUrl2 = endpoint+"?query="+ encodeURIComponent(query2) +"&format=json";

				   	var xhr2 = $.ajax({
				        url: queryUrl2,
				        method:'post',
				        success: function( data, textStatus, jqXHR ) {
					        //remove this request from pending queries
			        		var index = $.inArray(jqXHR, activeAjaxRequest);
			        		if(index != -1)
			        			activeAjaxRequest.splice(index, 1);

				        	var arrayData = data.results.bindings;					
				        	subMap = addInstancesOccurenceClassHierarchy(arrayData, subMap);
				        	subMap = cleanMap(subMap);

				        	var mapRoots = getMapRoots(subMap);
				        	callback(mapRoots, subMap);	
				        }
				    });	
				    activeAjaxRequest.push(xhr2);
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
		query = " prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
					" SELECT " + querySPARQL.select.join(' ') +
					" WHERE { " + 
						" GRAPH " + graph + " { " +
							querySPARQL.where.join(' ') +
						" } " +
					" } ";
		if(resultLimit)
			query += "LIMIT " + resultLimit; 
		else{
			query += "LIMIT 100"; 
		} 

		console.log(query);
		
	   	queryUrl = endpoint+"?query="+ encodeURIComponent(query) +"&format=json";
	    var xhr = $.ajax({
	        url: queryUrl,
	        method:'post',
	        success: function( data, textStatus, jqXHR ) {
		        	var index = $.inArray(jqXHR, activeAjaxRequest);
		        	if(index != -1)
		        		activeAjaxRequest.splice(index, 1);

					operatorManager.queryResult(querySPARQL.select, querySPARQL.labelSelect, querySPARQL.keySelect, data.results.bindings);
		        	renderResultTable(querySPARQL.select, querySPARQL.labelSelect, data.results.bindings);
	        }
	    });
	    activeAjaxRequest.push(xhr);
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

function managePropertyStats(result){
	var map = {};
	for(var i = 0;i<result.length;i++){
		map[result[i].property.value] = result[i].propTotal.value;
	}
	return map;
}