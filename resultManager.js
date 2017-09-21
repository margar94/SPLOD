var ResultManager = function () {
	if(ResultManager.prototype._singletonInstance){
		return ResultManager.prototype._singletonInstance;
	}

	ResultManager.prototype._singletonInstance = this;
};

ResultManager.prototype.queryResult = function(select, labelSelect, results){

	
	//console.log(results);
	$.each(results, function(index){

		var element = results[index];
		for(field in element){
			if(element[field].type == 'uri'){
				element[field].url = element[field].value;
				element[field].value = createLabel(element[field].value);
			}
		}

	});

	renderResult(select, labelSelect, results);
}