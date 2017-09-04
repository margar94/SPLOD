
var executor;

var BoxFiller= function () {
	executor = new QueryExecutor(); 
	
};

BoxFiller.prototype.retrieveConcepts = function(caller) {
	executor.getAllEntities(this);
}


