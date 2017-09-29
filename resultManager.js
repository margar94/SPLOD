var resultDatatype;
var ResultManager = function () {
	if(ResultManager.prototype._singletonInstance){
		return ResultManager.prototype._singletonInstance;
	}

	resultDatatype = {};

	ResultManager.prototype._singletonInstance = this;
};

ResultManager.prototype.queryResult = function(select, labelSelect, keySelect, results){

	//console.log(results);
	$.each(results, function(index){

		var element = results[index];

		for(field in element){

			var type = element[field].type;
			// from uri to label for better user experience
			if(type == 'uri'){
				element[field].url = element[field].value;
				element[field].value = createLabel(element[field].value);
			}

		}

	});

	var result = results[0];
		//console.log(result);

	for(field in result){
		//console.log('?'+field);
		//console.log(select);
		//console.log(keySelect);
		var type = result[field].type;

		switch(type){
			case 'uri' : 
				var url = result[field].url;
				if(url.match(/^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)/)!=null){
					var index = $.inArray('?'+field, select);
					resultDatatype[keySelect[index]] = {datatype : 'img'};
				}
				else{
					var index = $.inArray('?'+field, select);
					resultDatatype[keySelect[index]] = {datatype : 'uri'};	
				}
				break;
			
			case 'typed-literal' : 
				var datatype = createLabel(result[field].datatype);

				switch(datatype){
					case 'integer':
					case 'nonNegativeInteger':
					case 'positiveInteger':
					case 'year':
						var index = $.inArray('?'+field, select);
						resultDatatype[keySelect[index]] = {datatype : 'number'};
						break;			
					case 'date':
						var index = $.inArray('?'+field, select);
						resultDatatype[keySelect[index]] = {datatype : 'date'};
						break;
					case 'langString':
						var index = $.inArray('?'+field, select);
						resultDatatype[keySelect[index]] = {datatype : 'string'};
						break;
					default : console.log(datatype);
				}

				break;

			case 'literal':
				var index = $.inArray('?'+field, select);
				resultDatatype[keySelect[index]] = {datatype : 'string'};
				break;

			default : console.log(type);

		}

	}

	console.log(resultDatatype);

	renderResult(select, labelSelect, results);
}