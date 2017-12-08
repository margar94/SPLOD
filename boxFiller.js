
var executor;
var directData;
var reverseData;
var stats;

var BoxFiller= function () {
	if(BoxFiller.prototype._singletonInstance){
		return BoxFiller.prototype._singletonInstance;
	}
	
	executor = new QueryExecutor(); 
	executor = executor._singletonInstance;

	BoxFiller.prototype._singletonInstance = this;
};

//concepts
BoxFiller.prototype.retrieveConcepts = function(limit, callback) {
	executor.getAllEntities(limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.updateConceptsFromConcept = function(entityUrl, limit, callback){
	executor.getEntitySubclasses(entityUrl, limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.updatePredicatesFromConcept = function(predUrl, limit, callback){
		
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getDirectPredicatesFromConcept(predUrl, limit, function(data){
		directData = data;
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

//predicates
BoxFiller.prototype.retrievePredicates = function(limit, callback) {
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
			directArray: directData,
			reverseArray: reverseData
		};

		callback(resultObj);
	});
}

BoxFiller.prototype.updateConceptsFromDirectPredicate = function(predUrl, limit, callback){
	executor.getConceptsFromDirectPredicate(predUrl, limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.updatePredicatesFromDirectPredicate = function(predUrl, limit, callback){
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getDirectPredicatesFromPredicate(predUrl, limit, function(data){
		directData = data;
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

//something
BoxFiller.prototype.updateConceptsFromSomething = function(predUrl, limit, callback){
	executor.getConceptsFromSomething(predUrl, limit, function(roots, map){
		callback(roots, map);
	});
}

BoxFiller.prototype.updatePredicatesFromSomething = function(predUrl, limit, callback){
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getDirectPredicatesFromPredicate(predUrl, limit, function(data){
		directData = data;
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

//result
BoxFiller.prototype.updatePredicatesFromResult = function(resultUrl, resultDatatype, resultLang, resultPenninculo, limit, callback){	
	var directData;
	var reverseData;

	var d1 = $.Deferred(executor.getDirectPredicatesFromResult(resultUrl, resultDatatype, resultLang, resultPenninculo, limit, function(data){
		directData = data;
		d1.resolve();
	}));
	var d2 = $.Deferred(executor.getReversePredicatesFromResult(resultUrl, resultDatatype, resultLang, resultPenninculo, limit, function(data){
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

//live stats
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