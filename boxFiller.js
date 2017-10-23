
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

BoxFiller.prototype.retrieveConcepts = function(limit, callback) {
console.log(limit);
	executor.getAllEntities(limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.retrievePredicates = function(limit, callback) {
console.log(limit);

	//if($.isEmptyObject(directData) || $.isEmptyObject(reverseData) || $.isEmptyObject(stats)){

		var d1 = $.Deferred(executor.getAllDirectPredicates(limit, function(data){
			directData = data;
			d1.resolve();
		}));
		var d2 = $.Deferred(executor.getAllReversePredicates(limit, function(data){
			reverseData = data;
			d2.resolve();
		}));
		/*var d3 = $.Deferred(executor.getAllPredicatesStats(limit, function(data){
			stats = data;
			d3.resolve();
		}))*/

		$.when(d1, d2).done(function(){

			//addStatsToPredicate(directData, reverseData, stats);

			var resultObj = {
				directArray: directData,
				reverseArray: reverseData
			};

			callback(resultObj);
		});
	/*}else{
		var resultObj = {
			directArray: directData,
			reverseArray: reverseData
		};

		callback(resultObj);
	}*/
}



BoxFiller.prototype.updateConceptsFromConcept = function(entityUrl, entityLabel, limit, callback){
	executor.getEntitySubclasses(entityUrl, limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.updatePredicatesFromConcept = function(predUrl, predLabel, predicateDirection, limit, callback){
console.log(limit);
		
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

BoxFiller.prototype.updateConceptsFromDirectPredicate = function(predUrl, predLabel, limit, callback){
	console.log(limit);
	executor.getConceptsFromDirectPredicate(predUrl, limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.updateConceptsFromReversePredicate = function(predUrl, predLabel, limit, callback){
	console.log(limit);
	executor.getConceptsFromReversePredicate(predUrl, limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.updatePredicatesFromPredicate = function(predUrl, predLabel, predicateDirection, limit, callback){
console.log(limit);
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

BoxFiller.prototype.getPredicateStats = function(predicateUrl, callback){
	executor.getPredicateStats(predicateUrl, function(number){
		callback(number);
	});
}

BoxFiller.prototype.getConceptStats = function(conceptUrl, callback){
	executor.getConceptStats(conceptUrl, function(number){
		callback(number);
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