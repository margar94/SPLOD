
var executor;
var directData;
var reverseData;
var stats;

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
	var limit = false;

	if($.isEmptyObject(directData) || $.isEmptyObject(reverseData) || $.isEmptyObject(stats)){

		var d1 = $.Deferred(executor.getAllDirectPredicates(limit, function(data){
			directData = data;
			d1.resolve();
		}));
		var d2 = $.Deferred(executor.getAllReversePredicates(limit, function(data){
			reverseData = data;
			d2.resolve();
		}));
		var d3 = $.Deferred(executor.getAllPredicatesStats(limit, function(data){
			stats = data;
			d3.resolve();
		}))

		$.when(d1, d2, d3).done(function(){

			addStatsToPredicate(directData, reverseData, stats);

			var resultObj = {
				directArray: directData,
				reverseArray: reverseData
			};

			callback(resultObj);
		});
	}else{
		var resultObj = {
			directArray: directData,
			reverseArray: reverseData
		};

		callback(resultObj);
	}
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
			directArray: directData,
			reverseArray: reverseData
		};

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
			directArray: directData,
			reverseArray: reverseData
		};

		callback(resultObj);
	});

}

function addStatsToPredicate(directData, reverseData, stats){
	
	for(key in directData){
		if(key in stats){
			directData[key].numberOfInstances = stats[key];
		}
	}
	for(key in reverseData){
		if(key in stats){
			reverseData[key].numberOfInstances = stats[key];
		}
	}
}