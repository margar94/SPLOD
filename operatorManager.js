var resultDatatype;
var operatorMap;
var parameterNumberOperator;

var savedResult;
var literalLang;

var mapCreator;

var pendingQuery;

var changedFocus;
var onFocus;

//OperatorManager is a singleton
var OperatorManager = function () {
	if(OperatorManager.prototype._singletonInstance){
		return OperatorManager.prototype._singletonInstance;
	}

	resultDatatype = {};
	savedResult = {};
	literalLang = {};
	pendingQuery = [];
	mapCreator = new MapCreator();

	changedFocus = false;
	onFocus = null;

	parameterNumberOperator = {
		'and' : 1, 
		'or' : 1,
		'not' : 1,
		'min' : 1,
		'max' : 1,
		'average' : 1,
		'limit' :1,

		'<' : 2,
		'<=' : 2,
		'>' : 2,
		'>=' : 2,
		'is url' : 2,
		'is string' : 2,
		'starts with' : 2,
		'ends with' : 2,
		'contains' : 2,
		'lang' : 2,

		'range' : 3,
	};

	operatorMap = {
		'number' : ['<', '<=', '>', '>=', '=', 'min', 'max', 'average', 'range', 'not'],

		'string' : ['is string', 'starts with', 'ends with', 'contains', 'not'],

		'literal' : ['is string', 'starts with', 'ends with', 'contains', 'not', 'lang'],

		'date' : ['is string', '<', '>', 'range'],

		'uri' : ['is url'],

		'img' : ['not'],

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
		'range' : ['not'],

		'starts with': ['not'],
		'ends with': ['not'],
		'contains': ['not'],
		'is string': ['not'],
		'is url': ['not'],
		'lang': ['not'],

		'every': ['limit']

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
				resultDatatype[keySelect[index]] = {datatype : 'literal'};
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

	//console.log(resultDatatype);

	if(changedFocus)
		manageUpdateOperatorViewer();
	

	saveResults(select, keySelect, results);

	//renderResult(select, labelSelect, results);
}

OperatorManager.prototype.selectedReusableResult = function(result){
	pendingQuery.push(result);

	if(OperatorManager.prototype.isComplete()){
		mapCreator.selectedOperator(pendingQuery);
		pendingQuery = [];
	}
}

OperatorManager.prototype.selectedOperator = function(operator){
	pendingQuery = [];
	pendingQuery.push(operator);

	if(OperatorManager.prototype.isComplete()){
		mapCreator.selectedOperator(pendingQuery);
		pendingQuery = [];
	}

}

OperatorManager.prototype.isComplete = function(){
	var operator = pendingQuery[0];
	return (parameterNumberOperator[operator]==pendingQuery.length);
}

OperatorManager.prototype.getResultToCompleteOperator = function(){
	var results;
	var blankNode;

	var operator = pendingQuery[0];

	if(operator == 'limit'){
		results = [];
	}
	else if(onFocus in resultDatatype && resultDatatype[onFocus].datatype=='literal' && operator == 'lang'){
		results = literalLang[onFocus];
	}
	else{
		results = savedResult[onFocus];
	}

	if(operator == 'limit'){
		blankNode = 'number';
	}
	else if(onFocus in resultDatatype &&  
		(resultDatatype[onFocus].datatype=='literal' || resultDatatype[onFocus].datatype=='string')){
			blankNode = 'text';
	}else{
			blankNode = resultDatatype[onFocus].datatype;
	}

	return {blankNode : blankNode, results: results};
	
	

}

function saveResults(select, keySelect, results){

	for(var i=0; i<keySelect.length; i++){
		savedResult[keySelect[i]] = [];
		literalLang[keySelect[i]] = [];
	}

	$.each(results, function(index){

		var element = results[index];

		for(field in element){
			var cachedResult = {};
			cachedResult.value = element[field].value;

			var type = element[field].type;
			if(type == 'uri'){
				cachedResult.url = element[field].url;
			}
				
			var index = $.inArray('?'+field, select);
			savedResult[keySelect[index]].push(cachedResult);

			if(type == 'literal'){
				var newLang = {value:(element[field])['xml:lang']};

				if(!objInArray(newLang, literalLang[keySelect[index]]))
					literalLang[keySelect[index]].push(newLang);
				
			}

		}

	});

	//console.log(literalLang);
	
}

function objInArray(obj, arr){

	if($.inArray(JSON.stringify(obj),$.map(arr, JSON.stringify))>=0)
		return true;

	return false;
}

OperatorManager.prototype.changedFocus = function(newOnFocus, userChangeFocus){
	changedFocus = true;
	onFocus = newOnFocus;

	if(onFocus!=null){
		if(userChangeFocus){
			manageUpdateOperatorViewer();
		}
	}else{
		renderOperatorList([]);
	}
}

function manageUpdateOperatorViewer(){
	
	if(onFocus!=null){
		if(onFocus.split('_')[0] in operatorMap){
			renderOperatorList(operatorMap[onFocus.split('_')[0]]);
		}else if((onFocus in resultDatatype) && (resultDatatype[onFocus].datatype in operatorMap)){
			renderOperatorList(operatorMap[resultDatatype[onFocus].datatype]);
		}else{
			renderOperatorList([]);
		}
	}else{
		renderOperatorList([]);
	}
	
	changedFocus = false;
}