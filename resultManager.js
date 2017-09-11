var ResultManager = function () {
	if(ResultManager.prototype._singletonInstance){
		return ResultManager.prototype._singletonInstance;
	}

	ResultManager.prototype._singletonInstance = this;
};

ResultManager.prototype.queryResult = function(results){

	console.log(results);
	renderResult(results);

}