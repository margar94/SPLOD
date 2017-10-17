var resultDatatype;
var operatorMap;
var parameterNumberOperator;

var savedResult;
var literalLang;
var resultLiteralLang;
var cachedResult;

var mapCreator;

var pendingQuery;

var changedFocus;
var onFocus;

//OperatorManager is a singleton
var OperatorManager = function () {
	if(OperatorManager.prototype._singletonInstance){
		return OperatorManager.prototype._singletonInstance;
	}

	mapCreator = new MapCreator();

	changedFocus = false;
	onFocus = null;
	inizializeMaps();

	parameterNumberOperator = {
		'and' : 1, 
		'or' : 1,
		'xor' : 1,
		'not' : 1,
		'min' : 1,
		'max' : 1,
		'average' : 1,
		
		'limit' :2,
		'<' : 2,
		'<=' : 2,
		'>' : 2,
		'>=' : 2,
		'=' : 2,
		'is url' : 2,
		'is string' : 2,
		'starts with' : 2,
		'ends with' : 2,
		'contains' : 2,
		'lang' : 2,
		'is date' : 2,
		'before' : 2,
		'after' : 2,

		'range' : 3,
		'range date' : 3
	};					
						
	operatorMap = {
		'number' : ['<', '<=', '>', '>=', '=', 'range'],

		'string' : ['is string', 'starts with', 'ends with', 'contains'],

		'literal' : ['is string', 'starts with', 'ends with', 'contains', 'lang'],

		'date' : ['is date', 'before', 'after', 'range date'],
		'time' : ['is date', 'before', 'after', 'range date'],
		'dateTime' : ['is date', 'before', 'after', 'range date'],
		'gday' : ['is date', 'before', 'after', 'range date'],
		'gMonth' : ['is date', 'before', 'after', 'range date'],
		'gMonthDay' : ['is date', 'before', 'after', 'range date'],
		'gYear' : ['is date', 'before', 'after', 'range date'],
		'gYearMonth' : ['is date', 'before', 'after', 'range date'],

		'uri' : ['is url'],

		'boolean' : ['is string'],

		'img' : [],

		'and' : ['or', 'xor'],
		'or' : ['and', 'xor'],
		'xor' : ['and', 'or'],

		'<' : ['not'],
		'<=' : ['not'],
		'>' : ['not'],
		'>=' : ['not'],
		'=' : ['not'],
		'range' : ['not'],

		'starts with': ['not'],
		'ends with': ['not'],
		'contains': ['not'],
		'is string': ['not'],
		'is url': ['not'],
		'lang': ['not'],
		'is date': ['not'],
		'before': ['not'],
		'after': ['not'],
		'range date': ['not'],

		'limit': ['limit']

	};

	OperatorManager.prototype._singletonInstance = this;
};

OperatorManager.prototype.queryResult = function(select, labelSelect, keySelect, results){

	var result = results[0];

	for(field in result){
		var arrayIndex = $.inArray('?'+field, select);
		resultDatatype[keySelect[arrayIndex]] = {}; 
		resultDatatype[keySelect[arrayIndex]].datatype = []; 
	}

	$.each(results, function(index){

		var result = results[index];

		for(field in result){

			var type = result[field].type;
			// from uri to label for better user experience
			if(type == 'uri'){
				result[field].url = result[field].value;
				result[field].value = createLabel(result[field].value);
			}

			var arrayIndex = $.inArray('?'+field, select);
			switch(type){
				case 'uri' : 
				case 'anyURI':
					var url = result[field].url;
					if((url.toLowerCase()).match(/^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png|svg)/)!=null){
						if($.inArray('img', resultDatatype[keySelect[arrayIndex]].datatype)<0)
							resultDatatype[keySelect[arrayIndex]].datatype.push('img');
					}
					else{
						if($.inArray('uri', resultDatatype[keySelect[arrayIndex]].datatype)<0)
							resultDatatype[keySelect[arrayIndex]].datatype.push('uri');
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
						case 'kilometre':
						case 'kilogramPerCubicMetre':
						case 'klometrePerSecond':
						case 'double':
						case 'float':
							var index = $.inArray('?'+field, select);
							resultDatatype[keySelect[index]] = {datatype : 'number'};
							break;			
						*/
						case 'gYear':
							if($.inArray('gYear', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('gYear');
							break;
						case 'gMonth':
							if($.inArray('gMonth', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('gMonth');
							break;
						case 'gDay':
							if($.inArray('gDay', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('gDay');
							break;
						case 'gMonthDay':
							if($.inArray('gMonthDay', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('gMonthDay');
							break;
						case 'gYearMonth':
							if($.inArray('gYearMonth', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('gYearMonth');
							break;
						case 'date':
							if($.inArray('date', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('date');
							break;
						case 'dateTime':
							if($.inArray('dateTime', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('dateTime');
							break;
						case 'time':
							if($.inArray('time', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('time');
							break;
						case 'langString':
							if($.inArray('string', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('string');
							break;
						case 'boolean':
							if($.inArray('boolean', resultDatatype[keySelect[arrayIndex]].datatype)<0)
								resultDatatype[keySelect[arrayIndex]].datatype.push('boolean');
							break;
						default : 
							if($.isNumeric(result[field].value)){
								if($.inArray('number', resultDatatype[keySelect[arrayIndex]].datatype)<0)
									resultDatatype[keySelect[arrayIndex]].datatype.push('number');
							}
							else{
								if($.inArray('string', resultDatatype[keySelect[arrayIndex]].datatype)<0)
									resultDatatype[keySelect[arrayIndex]].datatype.push('string');
							}
							//console.log('type : typed-literal, datatype:' +datatype);
							break;
					}

					break;

				case 'literal':
					if($.inArray('literal', resultDatatype[keySelect[arrayIndex]].datatype)<0)
						resultDatatype[keySelect[arrayIndex]].datatype.push('literal');
					break;

				case 'boolean': 
					if($.inArray('boolean', resultDatatype[keySelect[arrayIndex]].datatype)<0)
						resultDatatype[keySelect[arrayIndex]].datatype.push('boolean');
					break;

				default : 
					if($.isNumeric(result[field].value)){
						if($.inArray('number', resultDatatype[keySelect[arrayIndex]].datatype)<0)
							resultDatatype[keySelect[arrayIndex]].datatype.push('number');
					}
					else{
						if($.inArray('string', resultDatatype[keySelect[arrayIndex]].datatype)<0)
							resultDatatype[keySelect[arrayIndex]].datatype.push('string');
					}
					//console.log('type:' +type);
					break;

			}

		}

	});

	//console.log(resultDatatype);

	if(changedFocus)
		manageUpdateOperatorViewer();
	
	saveResults(select, keySelect, results);
}

OperatorManager.prototype.selectedReusableResult = function(result, fromInput){
	var operator = pendingQuery[0].value;

	var type;
	if(operator == 'limit'){
		type = 'number';
	}else if(onFocus in resultDatatype){
		type = resultDatatype[onFocus].datatype;
		if(type.length > 1)
			type = 'string';
		else
			type = type[0];
	}else{
		type = null;
	}

	var value = result[0];

	if(fromInput){
		switch(type){
			case 'gYear':
				value = result[0].split('-')[0];
				break;
			case 'gMonth':
				value = result[0].split('-')[1];
				break;
			case 'gDay':
				value = result[0].split('-')[2];
				break;
			case 'gMonthDay':
				value = result[0].substring(5);
				break;
			case 'gYearMonth':
				value = result[0].substring(0, 7);
				break;
			case 'dateTime':
				value = result[0] + 'T' + result[1];
				break;
			case 'img':
			case 'uri':
			case 'time':
			case 'date':
			case 'string':
			case 'literal':
			case 'boolean':
			case 'number':
			default:
				value = result[0];
				break;
		}
	}

	var lang = 'en';
	if(value in resultLiteralLang)
		lang = resultLiteralLang[value];
	pendingQuery.push({value: value, datatype:type, lang:lang});

	var isComplete = parameterNumberOperator[operator]==pendingQuery.length;

	if(isComplete){
		var resultsKey = mapCreator.selectedOperator(pendingQuery);
		pendingQuery = [];
		cacheResultToChange(resultsKey);
	}

	return isComplete;

}

OperatorManager.prototype.selectedOperator = function(operator){
	pendingQuery = [];
	pendingQuery.push({value: operator});

	var isComplete = parameterNumberOperator[operator]==pendingQuery.length;

	if(isComplete){
		mapCreator.selectedOperator(pendingQuery);
		pendingQuery = [];
	}

	return isComplete;
}

OperatorManager.prototype.getResultToCompleteOperator = function(){
	var operator = pendingQuery[0].value;
	var operatorField = onFocus;
	if(operator == 'limit'){
		results = [];
	}else if(operatorField in resultDatatype){ 
		if(resultDatatype[operatorField].datatype=='literal' && operator == 'lang')
			results = literalLang[operatorField];
		else results = savedResult[operatorField];
	}else{
		results = [];
	}
	var type = getTypeByOperator(operatorField, operator);
	return {type:type, results: results};
}

function getTypeByOperator(operatorField, operator){

	var results;
	var type = '';

	if(operator == 'limit'){
		type = 'number';
	}
	else if(operatorField in resultDatatype){
		var datatype = resultDatatype[operatorField].datatype;
		console.log(datatype);

		if(datatype.length>1)
			datatype = 'string';
		else
			datatype = datatype[0];
		switch(datatype){
			case 'img':
			case 'uri':
				type = null;
				break;
			case 'gYear':
			case 'gMonth':
			case 'gDay':
			case 'gMonthDay':
			case 'gYearMonth':
			case 'date':
				type = 'date';
				break;
			case 'dateTime':
				type = 'dateTime';
				break;
			case 'time':
				type = 'time';
				break;
			case 'string':
			case 'literal':
			case 'boolean':
				type = 'text';
				break;
			case 'number':
				type = 'number';
				break;
		}
	}else{
		type = null;
	}
	return type;
}

OperatorManager.prototype.getPendingQueryFields = function(){
	var pendingQueryFields = [];

	if(onFocus=='limit'){
		pendingQueryFields.push('');
	}else{
		//concepts or predicates that fire operator's inserting
		var nodeOnFocus = mapCreator.getNodeByKey(onFocus);
		pendingQueryFields.push(nodeOnFocus.label);
	}

	//selected operator and, eventually, selected parameters
	for(var i=0; i<pendingQuery.length; i++){
		pendingQueryFields.push(pendingQuery[i].value);
	}

	//fields to fill
	var operator = pendingQuery[0].value;
	var numParameterOperator = parameterNumberOperator[operator];
	for(var i=pendingQuery.length; i<numParameterOperator; i++){
		pendingQueryFields.push(' ');	
	}

	if(numParameterOperator>1){
		for(var i=3; i<pendingQueryFields.length; i=i+2){
			pendingQueryFields.splice(i, 0, 'and');
		}
	}
	
	return pendingQueryFields;
}

OperatorManager.prototype.discardOperator = function(){
	pendingQuery = [];
}

function saveResults(select, keySelect, results){

	if(results.length == 0){
		return;
	}

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
				
				resultLiteralLang[element[field].value] = (element[field])['xml:lang']; //more equals save last

				var langIndex = valInArray((element[field])['xml:lang'], literalLang[keySelect[index]]);
				if(langIndex<0){
					var newLang = {value:(element[field])['xml:lang'], occurrences:1};
					literalLang[keySelect[index]].push(newLang);
				}
				else{
					literalLang[keySelect[index]][langIndex].occurrences++;
				}
				
			}



		}

	});

	for(var i=0; i<keySelect.length; i++){
		var datatype;
		if(resultDatatype[keySelect[i]].datatype.length>1)
			datatype = 'string';
		else
			datatype = resultDatatype[keySelect[i]].datatype[0];
		sort(savedResult[keySelect[i]], datatype);
		sort(literalLang[keySelect[i]], 'string');
	}

	for(var i=0; i<keySelect.length; i++){
		var originalArray = savedResult[keySelect[i]];
		var newArray = [];

		var current;
		var j=0;
		while(j<originalArray.length){
			current = originalArray[j];
			var k=j+1;
			var occurrences = 1;
			while(k<originalArray.length && 
					originalArray[k].value == current.value && originalArray[k].url == current.url){
				occurrences++;
				k++;
			}
			j=k;
			current.occurrences = occurrences;
			newArray.push(current);
		}

		savedResult[keySelect[i]]=newArray;

	}

}

function sort(arr, datatype){
	if(datatype == 'number')
		arr.sort(compareNumber);
	else
		arr.sort(compareString);
}

function compareString(a,b) {
	if (a.value < b.value)
		return -1;
	if (a.value > b.value)
	    return 1;
	return 0;
}

function compareNumber(a,b){
	if ((a.value - b.value)<0)
	    return -1;
	if ((a.value - b.value)>0)
		return 1;
	return 0;
}

function valInArray(val, arr){
	var currentObj;
	for(var i=0; i<arr.length; i++){
		currentObj = arr[i];
		if(currentObj.value == val)
			return i;
	}
	return -1;
}

OperatorManager.prototype.changedFocus = function(newOnFocus, userChangeFocus){
	changedFocus = true;
	onFocus = newOnFocus;

	if(onFocus!=null){
		if(userChangeFocus){
			manageUpdateOperatorViewer();
		}
	}else{
		inizializeMaps();
		renderOperatorList([]);
	}
}

function manageUpdateOperatorViewer(){

	changedFocus = false;
	var operatorList = [];

	if(onFocus==null){
		renderOperatorList([]);
		return;
	}

	if(onFocus=='limit'){//focus on every or everything or number applied as resultLimit
		renderOperatorList(operatorMap[onFocus]);
		return;
	}
	
	var node = mapCreator.getNodeByKey(onFocus);

	if(node.type=='result'){
		var operatorNode = mapCreator.getNodeByKey(node.parent);
		var operator = operatorNode.label;
		var operatorField = node.relatedTo;
		
		if(operatorField in resultDatatype){ 
			results = cachedResult[node.key];
		}else{
			results = [];
		} 
		var type = getTypeByOperator(operatorField, operator);
		renderReusableResultListFromResult({type:type, results:results});
		return;
	}
	
	if(node.type == 'operator' && (node.label in operatorMap)){ //onFocus is an operator 
		renderOperatorList(operatorMap[node.label]);
		return;
	}
				
	//concept or predicate that fired operator
	if(node.type == 'predicate' && node.direction == 'direct')
		operatorList.push('not');

	if(mapCreator.isRefinement(onFocus)){
		operatorList.push('not');
		onFocus = mapCreator.getTopElement(onFocus);
	}
	//from here onFocus could be the concept or his ancestor
	if(onFocus in resultDatatype){
		for(var i=0; i<resultDatatype[onFocus].datatype.length; i++){
			operatorList = operatorList.concat(operatorMap[resultDatatype[onFocus].datatype[i]]);
		}
		
		renderOperatorList(operatorList);
		return;
	}	
	else{
		console.log('PROBLEMA');
	}
	
}

function oldmanageUpdateOperatorViewer(){
	
	if(onFocus!=null){
		if(onFocus=='limit'){//focus on every or everything or number applied as resultLimit
			renderOperatorList(operatorMap[onFocus]);
		}
		else{
			var node = mapCreator.getNodeByKey(onFocus);

			if(node.type=='result'){
				var operatorNode = mapCreator.getNodeByKey(node.parent);
				var operator = operatorNode.label;
				var operatorField = node.relatedTo;
				
				if(operatorField in resultDatatype){ 
					results = cachedResult[node.key];
				}else{
					results = [];
				} 
				var type = getTypeByOperator(operatorField, operator);
				renderReusableResultListFromResult({type:type, results:results});
			}
			else{ 
				if(onFocus.split('_')[0] in operatorMap){ //onFocus is an operator 
					renderOperatorList(operatorMap[onFocus.split('_')[0]]);
				}else{ //concept or predicate that fired operator
					if(mapCreator.isRefinement(onFocus))
						//aggiungi not e optional ai miei operatori
						onFocus = mapCreator.getTopElement(onFocus);
					
					if(onFocus in resultDatatype){
						if(resultDatatype[onFocus].datatype.length>1)
							renderOperatorList(operatorMap['string']); 
						else if(resultDatatype[onFocus].datatype[0] != 'uri'){		
							renderOperatorList(operatorMap[resultDatatype[onFocus].datatype[0]]); 
						}else{
							var onFocusNode = mapCreator.getNodeByKey(onFocus);
							if(onFocusNode.parent == null 
								//|| onFocusNode.type == 'concept'
								|| mapCreator.getNodeByKey(onFocusNode.parent).type == 'everything')
									renderOperatorList(operatorMap['special uri']);
							else
								renderOperatorList(operatorMap[resultDatatype[onFocus].datatype[0]]);
						}
					}else{
						renderOperatorList([]);
					}
				}
			} 
		}

	}else{
		renderOperatorList([]);
	}
	
	changedFocus = false;
	
}

OperatorManager.prototype.changedReusableResult = function(result, fromInput){

	var onFocusNode = mapCreator.getNodeByKey(onFocus); 

	var type;
	if(onFocusNode.relatedTo in resultDatatype){
		type = resultDatatype[onFocusNode.relatedTo].datatype;
		if(type.length > 1)
			type = 'string';
		else
			type = type[0];
	}else{
		type = null;
	}

	var value = result[0];
	if(fromInput){
		switch(type){
			case 'gYear':
				value = result[0].split('-')[0];
				break;
			case 'gMonth':
				value = result[0].split('-')[1];
				break;
			case 'gDay':
				value = result[0].split('-')[2];
				break;
			case 'gMonthDay':
				value = result[0].substring(5);
				break;
			case 'gYearMonth':
				value = result[0].substring(0, 7);
				break;
			case 'dateTime':
				value = result[0] + 'T' + result[1];
				break;
			case 'img':
			case 'uri':
			case 'time':
			case 'date':
			case 'string':
			case 'literal':
			case 'boolean':
			case 'number':
			default:
				value = result[0];
				break;
		}
	}

	var cachedResultList = cachedResult[onFocus];
	delete cachedResult[onFocus];

	var lang = 'en';
	if(value in resultLiteralLang)
		lang = resultLiteralLang[value];
	var newKey = mapCreator.selectedResult({value: value, datatype:type, lang:lang});
	cachedResult[newKey] = cachedResultList;

}

/*
	Cache result list when a result is used to complete an operator for the first time
	resultsKey could be []
*/
function cacheResultToChange(resultsKey){
	for(var i=0; i<resultsKey.length; i++){
		var resultNode = mapCreator.getNodeByKey(resultsKey[i]);
		var operatorNode = mapCreator.getNodeByKey(resultNode.parent);

		if(resultDatatype[resultNode.relatedTo].datatype=='literal' && operatorNode.label == 'lang')
			cachedResult[resultNode.key] = literalLang[resultNode.relatedTo];
		else
			cachedResult[resultNode.key] = savedResult[resultNode.relatedTo];
	}
}

function inizializeMaps(){
	resultDatatype = {};
	savedResult = {};
	resultLiteralLang = {};
	literalLang = {};
	cachedResult = {};
	pendingQuery = [];
}