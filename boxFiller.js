
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
	
	executor.getEntitySubclasses(entityUrl, function(data){
		callback(data);
	});
 
	queryVerbalizator.selectedConcept(entityUrl, entityLabel);
}


BoxFiller.prototype.updatePredicates = function(selectedConcept, predUrl, entityLabel, predVerb, predArticle, callback){
	
	var limit = false;
	executor.getSelectedEntityPredicates(predUrl, limit, function(data){
		callback(data);
	});

	if(!selectedConcept)
		queryVerbalizator.selectedPredicate(predUrl, predLabel, predVerb, predArticle);
}

/*
	aggiungere operatori
*/
BoxFiller.prototype.retrievePredicates = function(callback) {
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getAllDirectPredicates(20, function(data){
		directData = data;
		d1.resolve();
	}));
	var d2 = $.Deferred(executor.getAllReversePredicates(20, function(data){
		reverseData = data;
		d2.resolve();
	}));

	$.when(d1, d2).done(function(){

		var resultObj = {
			directArray,
			reverseArray,
			attributesArray = directData
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
