
var executor;

var BoxFiller= function () {
	executor = new QueryExecutor(); 
	
};

BoxFiller.prototype.retrieveConcepts = function(callback) {
	executor.getAllEntities(function(data){
		callback(data);
	});
}

BoxFiller.prototype.retrievePredicates = function(callback) {
	executor.getAllPredicates(false, function(data){
		callback(data);
	});
}
