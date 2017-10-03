var resultDatatype;
var operatorMap;
var unaryOperator;
var binaryOperator;
var ternaryOperator;

var savedResult;
var literalLang;

var mapCreator;

var pendingQuery;

var changedFocus;
var onFocus;

var isComplete;

//OperatorManager is a singleton
var OperatorManager = function () {
	if(OperatorManager.prototype._singletonInstance){
		return OperatorManager.prototype._singletonInstance;
	}

	isComplete = false;

	resultDatatype = {};
	savedResult = {};
	literalLang = {};
	pendingQuery = [];
	mapCreator = new MapCreator();

	changedFocus = false;
	onFocus = null;

	unaryOperator = ['and', 'or', 'not', 'min', 'max', 'average'];
	binaryOperator = ['<', '<=', '>', '>=', '=', 'is', 'starts with', 'ends with', 'contains', 'lang'];
	ternaryOperator = ['range'];

	operatorMap = {
		'number' : ['<', '<=', '>', '>=', '=', 'min', 'max', 'average', 'range', 'not'],

		'string' : ['is_string', 'starts with', 'ends with', 'contains', 'not'],

		'literal' : ['is_string', 'starts with', 'ends with', 'contains', 'not', 'lang'],

		'date' : ['is_string', '<', '>', 'range'],

		'uri' : ['is_url'],

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

	console.log(resultDatatype);

	if(changedFocus)
		manageUpdateOperatorViewer();
	

	saveResults(select, keySelect, results);

	//renderResult(select, labelSelect, results);
}

OperatorManager.prototype.selectedReusableResult = function(result){
	pendingQuery.push(result);
	var operator = pendingQuery[0];

	var index = $.inArray(operator, binaryOperator);
	if(index >= 0 && pendingQuery.length == 2){
		mapCreator.selectedOperator(pendingQuery);
		isComplete = true;
	}else{
		index = $.inArray(operator, ternaryOperator);
		if(index >= 0 && pendingQuery.length == 3){
			mapCreator.selectedOperator(pendingQuery);
			isComplete = true;
		}
	}

}

OperatorManager.prototype.selectedOperator = function(operator){
	pendingQuery.push(operator);

	var index = $.inArray(operator, unaryOperator);
	if(index >= 0 ){
		mapCreator.selectedOperator(pendingQuery);
		isComplete = true;
	}

}

OperatorManager.prototype.isComplete = function(){
	return isComplete;
}

OperatorManager.prototype.getResultToCompleteOperator = function(){
	var results;
	var blankNode;

	if(resultDatatype[onFocus].datatype=='literal' && pendingQuery[0] == 'lang'){
		results = literalLang[onFocus];
	}
	else{
		results = savedResult[onFocus];
	}

	if(resultDatatype[onFocus].datatype=='literal' || resultDatatype[onFocus].datatype=='string'){
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

			var type = element[field].type;
			if(type == 'literal'){
				if($.inArray((element[field])['xml:lang'], literalLang[keySelect[index]])<0){
					literalLang[keySelect[index]].push((element[field])['xml:lang']);
				}
			}

		}

	});

	console.log(literalLang);
	
}

OperatorManager.prototype.changedFocus = function(onFocus, userChangeFocus){
	changedFocus = true;
	this.onFocus = onFocus;

	if(onFocus!=null){
		if(userChangeFocus){
			manageUpdateOperatorViewer();
		}
	}else{
		renderOperatorList([]);
	}
}

function manageUpdateOperatorViewer(){
	
	if(onFocus in operatorMap){
		renderOperatorList(operatorMap[onFocus]);
	}else if(resultDatatype[onFocus].datatype in operatorMap){
		renderOperatorList(operatorMap[resultDatatype[onFocus].datatype]);
	}else{
		renderOperatorList([]);
	}
	
	changedFocus = false;
}