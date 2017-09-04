var BoxFiller= function () {
	var executor = new QueryExecutor(); 
	
};

BoxFiller.prototype.retrieveConcepts = function(caller) {
	return executor.getAllEntities();
}
