var resultDatatype;
var savedResult;
var operatorMap;
var mapCreator;

var pendingQuery;

var changedFocus = null;

//OperatorManager is a singleton
var OperatorManager = function () {
	if(OperatorManager.prototype._singletonInstance){
		return OperatorManager.prototype._singletonInstance;
	}

	resultDatatype = {};
	savedResult = {};
	pendingQuery = [];
	mapCreator = new MapCreator();
	operatorMap = {
		'number' : ['<', '<=', '>', '>=', '=', 'min', 'max', 'average', 'range', 'not'],

		'string' : ['is', 'starts with', 'ends with', 'contains', 'not'],

		'and' : ['or'],
		'or' : ['and'],

		'<' : ['not'],
		'<=' : ['not'],
		'>' : ['not'],
		'>=' : ['not'],
		'=' : ['not'],
		//not min, max, avg...
		'min' : ['not'],
		'max' : ['not'],
		'average' : ['not'],
		'range' : ['not']


	};

	OperatorManager.prototype._singletonInstance = this;
};

OperatorManager.prototype.queryResult = function(select, labelSelect, keySelect, results){

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

	for(field in result){

		var type = result[field].type;

		switch(type){
			case 'uri' : 
			case 'anyURI':
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
					/*case 'integer':
					case 'nonNegativeInteger':
					case 'negativeInteger':
					case 'nonPositiveInteger':
					case 'positiveInteger':
					case 'year':
					case 'gYear':
					case 'gMonth':
					case 'gDay':
					case 'gMonthDay':
					case 'gYearMonth':
					case 'kilometre':
					case 'kilogramPerCubicMetre':
					case 'klometrePerSecond':
					case 'day':
					case 'double':
					case 'float':
						var index = $.inArray('?'+field, select);
						resultDatatype[keySelect[index]] = {datatype : 'number'};
						break;			
					*/
					case 'date':
					case 'dateTime':
					case 'time':
						var index = $.inArray('?'+field, select);
						resultDatatype[keySelect[index]] = {datatype : 'date'};
						break;
					case 'langString':
						var index = $.inArray('?'+field, select);
						resultDatatype[keySelect[index]] = {datatype : 'string'};
						break;
					default : 
						if($.isNumeric(result[field].value)){
							var index = $.inArray('?'+field, select);
							resultDatatype[keySelect[index]] = {datatype : 'number'};
						}
						else{
							var index = $.inArray('?'+field, select);
							resultDatatype[keySelect[index]] = {datatype : 'string'};
						}
						//console.log('type : typed-literal, datatype:' +datatype);
						break;
				}

				break;

			case 'literal':
				var index = $.inArray('?'+field, select);
				resultDatatype[keySelect[index]] = {datatype : 'string'};
				//we have access to string language
				break;

			case 'boolean': 
				var index = $.inArray('?'+field, select);
				resultDatatype[keySelect[index]] = {datatype : 'string'};
				break;

			default : 
				if($.isNumeric(result[field].value)){
					var index = $.inArray('?'+field, select);
					resultDatatype[keySelect[index]] = {datatype : 'number'};
				}
				else{
					var index = $.inArray('?'+field, select);
					resultDatatype[keySelect[index]] = {datatype : 'string'};
				}
				//console.log('type:' +type);
				break;

		}

	}

	console.log(resultDatatype);

	if(changedFocus!=null)
		manageUpdateOperatorViewer();
	

	saveResults(select, keySelect, results);

	//renderResult(select, labelSelect, results);
}

function ready(){
	//update map
}

OperatorManager.prototype.selectedOperator = function(operator){
	console.log('operator');
	pendingQuery.push(operator);

	//eventuale comunicazione con mapcreator
	//isCompleted = true;
}

OperatorManager.prototype.isCompleted = function(){
	return isCompleted;
}

OperatorManager.prototype.getResultToCompleteOperator = function(){

}

function saveResults(select, keySelect, results){

	for(var i=0; i<keySelect.length; i++){
		savedResult[keySelect[i]] = [];
	}

	$.each(results, function(index){

		var element = results[index];

		for(field in element){
			var cachedResult = {};
			cachedResult.value = element[field].value;

			var type = element[field].type;
			if(type == 'uri')
				cachedResult.url = element[field].url;

			var index = $.inArray('?'+field, select);
			savedResult[keySelect[index]].push(cachedResult);

		}

	});

	console.log(savedResult);
	
}

OperatorManager.prototype.changedFocus = function(onFocus, userChangeFocus){
	changedFocus = onFocus;
	if(userChangeFocus){
		manageUpdateOperatorViewer();
	}
}

function manageUpdateOperatorViewer(){
	//console.log(resultDatatype[changedFocus]);

	if(changedFocus in operatorMap){
		renderOperatorList(operatorMap[changedFocus]);
	}else if(resultDatatype[changedFocus] in operatorMap){
		renderOperatorList(operatorMap[resultDatatype[changedFocus]]);
	}else{
		renderOperatorList([]);
	}
	
	changedFocus = null;
}