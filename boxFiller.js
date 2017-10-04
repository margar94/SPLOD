
var executor;

var BoxFiller= function () {
	if(BoxFiller.prototype._singletonInstance){
		return BoxFiller.prototype._singletonInstance;
	}
	
	executor = new QueryExecutor(); 

	BoxFiller.prototype._singletonInstance = this;
};

BoxFiller.prototype.retrieveConcepts = function(callback) {
	executor.getAllEntities(function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.retrievePredicates = function(callback) {
	var limit = 100;

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



BoxFiller.prototype.updateConceptsFromConcept = function(entityUrl, entityLabel, callback){
	
	var limit = false;

	executor.getEntitySubclasses(entityUrl, limit, function(roots, map){
		callback(roots, map);
	});
 
}

BoxFiller.prototype.updatePredicatesFromConcept = function(predUrl, predLabel, predicateDirection, callback){
	
	var limit = 100;
	
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
		//console.log(resultObj);
		callback(resultObj);
	});

}



BoxFiller.prototype.updateConceptsFromDirectPredicate = function(predUrl, predLabel, callback){

	var limit = false;
	executor.getConceptsFromDirectPredicate(predUrl, limit, function(roots, map){
		callback(roots, map);
	});

}

BoxFiller.prototype.updateConceptsFromReversePredicate = function(predUrl, predLabel, callback){
	var limit = false;
	executor.getConceptsFromReversePredicate(predUrl, limit, function(roots, map){
		callback(roots, map);
	});
}



BoxFiller.prototype.updatePredicatesFromPredicate = function(predUrl, predLabel, predicateDirection, callback){
	
	var limit = 100;
	
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getDirectPredicatesFromPredicate(predUrl, limit, function(data){
		directData = data;
		//console.log(data);
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
		//console.log(resultObj);
		callback(resultObj);
	});

	
}




BoxFiller.prototype.selectedAttribute = function(attributeUrl, attributeLabel){
	//mapCreator.selectedPredicate(attributeUrl, attributeLabel, 'none');
}




/*
	aggiungere operatori
*/