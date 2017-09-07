
var executor;

var BoxFiller= function () {
	executor = new QueryExecutor(); 
};

BoxFiller.prototype.retrieveConcepts = function(callback) {
	executor.getAllEntities(function(data){
		callback(data);
	});
}

BoxFiller.prototype.updateConcepts = function(entityUrl, entityLabel, callback){
	console.log(entityUrl);
	executor.getEntitySubclasses(entityUrl, function(data){
		callback(data);
	});
 
	queryVerbalizator.selectedConcept(entityUrl, entityLabel);
}

BoxFiller.prototype.updatePredicatesFromConcept = function(predUrl, predLabel, predicateDirection, callback){
	
	var limit = 20;
	
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getDirectPredicatesFromConcept(predUrl, limit, function(data){
		directData = data;
		//console.log(data);
		d1.resolve();
	}));
	var d2 = $.Deferred(executor.getReversePredicatesFromConcept(predUrl, limit, function(data){
		reverseData = data;
		d2.resolve();
	}));

	$.when(d1, d2).done(function(){

		var resultObj = {
			directArray: [],
			reverseArray: [],
			attributesArray: directData
		};

		$.each(directData, function(index){

			directData[index].verb = "that has";
		});
		resultObj.directArray = directData;

		$.each(reverseData, function(index){
			reverseData[index].verb = "that is";
		});
		resultObj.reverseArray = reverseData;
		console.log(resultObj);
		callback(resultObj);
	});

}

BoxFiller.prototype.updatePredicatesFromPredicate = function(predUrl, predLabel, predicateDirection, callback){
	
	var limit = 20;
	
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getDirectPredicatesFromPredicate(predUrl, limit, function(data){
		directData = data;
		console.log(data);
		d1.resolve();
	}));
	var d2 = $.Deferred(executor.getReversePredicatesFromPredicate(predUrl, limit, function(data){
		reverseData = data;
		d2.resolve();
	}));

	$.when(d1, d2).done(function(){

		var resultObj = {
			directArray: [],
			reverseArray: [],
			attributesArray: directData
		};

		$.each(directData, function(index){

			directData[index].verb = "that has";
		});
		resultObj.directArray = directData;

		$.each(reverseData, function(index){
			reverseData[index].verb = "that is";
		});
		resultObj.reverseArray = reverseData;
		console.log(resultObj);
		callback(resultObj);
	});

	queryVerbalizator.selectedPredicate(predUrl, predLabel, predicateDirection);
}

BoxFiller.prototype.updateConceptsFromReversePredicate = function(predUrl, predLabel, callback){
	var limit = false;
	executor.getPredicateObject(predUrl, limit, function(data){
		callback(data);
	});
}

BoxFiller.prototype.selectedAttribute = function(attributeUrl, attributeLabel){
	queryVerbalizator.selectedPredicate(attributeUrl, attributeLabel, 'none');
}

BoxFiller.prototype.retrievePredicates = function(callback) {
	var limit = 20;

	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getAllDirectPredicates(limit, function(data){
		directData = data;
		d1.resolve();
	}));
	var d2 = $.Deferred(executor.getAllReversePredicates(limit, function(data){
		reverseData = data;
		d2.resolve();
	}));

	$.when(d1, d2).done(function(){

		var resultObj = {
			directArray: [],
			reverseArray: [],
			attributesArray: directData
		};

		$.each(directData, function(index){

			directData[index].verb = "that has";
		});
		resultObj.directArray = directData;

		$.each(reverseData, function(index){
			reverseData[index].verb = "that is";
		});
		resultObj.reverseArray = reverseData;

		callback(resultObj);
	});
}


/*
	aggiungere operatori
*/