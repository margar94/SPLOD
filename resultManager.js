var ResultManager = function () {
	if(ResultManager.prototype._singletonInstance){
		return ResultManager.prototype._singletonInstance;
	}

	ResultManager.prototype._singletonInstance = this;
};

ResultManager.prototype.queryResult = function(select, labelSelect, results){

	/*var aggregatedResults = {};
	$.each(results, function(index){
		var element = results[index];

		for(field in element) {
			if(!aggregatedResults.hasOwnProperty(field))
				aggregatedResults[field] = [];
			aggregatedResults[field].push(element[field].value);
		}
	});

	renderResult(aggregatedResults);
*/
	renderResult(select, labelSelect, results);
}