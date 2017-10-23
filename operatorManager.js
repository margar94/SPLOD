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
		'optional' : 1,
		
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

		'<' : ['not', 'optional'],
		'<=' : ['not', 'optional'],
		'>' : ['not', 'optional'],
		'>=' : ['not', 'optional'],
		'=' : ['not', 'optional'],
		'range' : ['not', 'optional'],

		'starts with': ['not', 'optional'],
		'ends with': ['not', 'optional'],
		'contains': ['not', 'optional'],
		'is string': ['not', 'optional'],
		'is url': ['not', 'optional'],
		'lang': ['not', 'optional'],
		'is date': ['not', 'optional'],
		'before': ['not', 'optional'],
		'after': ['not', 'optional'],
		'range date': ['not', 'optional'],

		'limit': ['limit'],

		'not' :[],
		'optional':[]

	};

	OperatorManager.prototype._singletonInstance = this;
};

OperatorManager.prototype.queryResult = function(select, labelSelect, keySelect, results){

	var result = results[0];

	for(var i=0; i<keySelect.length; i++){
		savedResult[keySelect[i]] = new Object();
		literalLang[keySelect[i]] = new Array();
	}

	for(var i=0; i<keySelect.length; i++){
		resultDatatype[keySelect[i]] = new Object(); 
		resultDatatype[keySelect[i]].datatype = new Array(); 
	}

	$.each(results, function(index){

		var result = results[index];

		for(field in result){

			var cachedResult = {};
			cachedResult.value = result[field].value;

			var type = result[field].type;
			// from uri to label for better user experience
			if(type == 'uri'){
				result[field].url = result[field].value;
				result[field].value = createLabel(result[field].value);

				cachedResult.url = result[field].url;
			}

			var currentResultDatatype = '';

			var arrayIndex = $.inArray('?'+field, select);
			switch(type){
				case 'uri' : 
				case 'anyURI':
					var url = result[field].url;
					if((url.toLowerCase()).match(/^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png|svg)/)!=null){
						currentResultDatatype = 'img';
					}
					else{
						currentResultDatatype = 'uri';
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
						case 'gMonth':
						case 'gDay':
						case 'gMonthDay':
						case 'gYearMonth':
						case 'date':
						case 'dateTime':
						case 'time':
						case 'boolean':
							currentResultDatatype = datatype;
							break;
						case 'langString':
							currentResultDatatype = 'string';
							break;
							
						default : 
							if($.isNumeric(result[field].value)){
								currentResultDatatype = 'number';
							}
							else{
								currentResultDatatype = 'string';
							}
							//console.log('type : typed-literal, datatype:' +datatype);
							break;
					}

					break;

				case 'literal':
				case 'boolean': 
					currentResultDatatype = type;
					break;

				default : 
					if($.isNumeric(result[field].value)){
						currentResultDatatype = 'number';
					}
					else{
						currentResultDatatype = 'string';	
					}
					//console.log('type:' +type);
					break;

			}

			if($.inArray(currentResultDatatype, resultDatatype[keySelect[arrayIndex]].datatype)<0)
				resultDatatype[keySelect[arrayIndex]].datatype.push(currentResultDatatype);

			if(!(currentResultDatatype in savedResult[keySelect[arrayIndex]]))
				savedResult[keySelect[arrayIndex]][currentResultDatatype] = [];
			savedResult[keySelect[arrayIndex]][currentResultDatatype].push(cachedResult);

			if(type == 'literal'){
				
				resultLiteralLang[result[field].value] = (result[field])['xml:lang']; //more equals save last

				var langIndex = valInArray((result[field])['xml:lang'], literalLang[keySelect[arrayIndex]]);
				if(langIndex<0){
					var newLang = {value:(result[field])['xml:lang'], occurrences:1};
					literalLang[keySelect[arrayIndex]].push(newLang);
				}
				else{
					literalLang[keySelect[arrayIndex]][langIndex].occurrences++;
				}
				
			}
		}

	});

	if(changedFocus)
		manageUpdateOperatorViewer();
	
	sortAndAggregateResults(select, keySelect, results);
}

OperatorManager.prototype.selectedReusableResult = function(result, fromInput){
	var operator = pendingQuery[0];

	var type;
	if(operator.value == 'limit'){
		type = 'number';
	}else if(onFocus in resultDatatype){
		type = operator.datatype;
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

	var lang = null;
	if(value in resultLiteralLang)
		lang = resultLiteralLang[value];
	pendingQuery.push({value: value, datatype:type, lang:lang});

	var isComplete = parameterNumberOperator[operator.value]==pendingQuery.length;

	if(isComplete){
		var resultsKey = mapCreator.selectedOperator(pendingQuery);
		pendingQuery = [];
		cacheResultToChange(resultsKey);
	}

	return isComplete;

}

OperatorManager.prototype.selectedOperator = function(operator, datatype){
	pendingQuery = [];
	pendingQuery.push({value: operator, datatype: datatype});

	var isComplete = parameterNumberOperator[operator]==pendingQuery.length;

	if(isComplete){
		mapCreator.selectedOperator(pendingQuery);
		pendingQuery = [];
	}

	return isComplete;
}

OperatorManager.prototype.getResultToCompleteOperator = function(){
	var operator = pendingQuery[0];
	var operatorField = onFocus;
	if(operator == 'limit'){
		results = [];
	}else if(operatorField in resultDatatype){ 
		if(operator.datatype=='literal' && operator.value == 'lang')
			results = literalLang[operatorField];
		else 
			results = savedResult[operatorField][operator.datatype];
	}else{
		results = [];
	}
	var type = getTypeByOperator(operatorField, operator.value, operator.datatype);
	return {type:type, results: results};
}

function getTypeByOperator(operatorField, operator, datatype){

	var results;
	var type = '';

	if(operator == 'limit'){
		type = 'number';
	}
	
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

function sortAndAggregateResults(select, keySelect, results){

	for(field in savedResult){
		for(datatype in savedResult[field]){
			sort(savedResult[field][datatype], datatype);

			var originalArray = savedResult[field][datatype];
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

			savedResult[field][datatype]=newArray;
		}
	}
	
	for(var i=0; i<keySelect.length; i++){
		sort(literalLang[keySelect[i]], 'string');
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
		renderOperatorList([{list : [], datatype:null}]);
		return;
	}

	if(onFocus=='limit'){//focus on every or everything or number applied as resultLimit
		renderOperatorList([{list : operatorMap[onFocus], datatype:'number'}]);
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
		var type = getTypeByOperator(operatorField, operator, node.datatype);
		renderReusableResultListFromResult({type:type, results:results, cachedQuery: node.cachedQuery});
		return;
	}
	
	if(node.type == 'operator' && (node.label in operatorMap)){ //onFocus is an operator 
		renderOperatorList([{list : operatorMap[node.label], datatype:null}]);
		return;
	}
				
	//concept or predicate that fired operator
	if(node.type == 'predicate'){
		var parentNode = mapCreator.getNodeByKey(node.parent);
		operatorList.push({list:['optional'], datatype:null});
		if(parentNode.type!='everything'){
			operatorList.push({list:['not'], datatype:null});
		}else{
			for(var i=0; i<parentNode.children.length; i=i+2){
				var childNode = mapCreator.getNodeByKey(parentNode.children[i]);
				if(childNode.key!=node.key && !(childNode.type=='operator' && childNode.label =='not')){
					operatorList.push({list:['not'], datatype:null});
					break;
				}
			}
		}
	}

	if(mapCreator.isRefinement(onFocus)){
		operatorList.push({list:['not', 'optional'], datatype:null});
		onFocus = mapCreator.getTopElement(onFocus);
	}
	//from here onFocus could be the concept or his ancestor
	if(onFocus in resultDatatype){
		for(var i=0; i<resultDatatype[onFocus].datatype.length; i++){
			operatorList.push({list:operatorMap[resultDatatype[onFocus].datatype[i]], datatype:resultDatatype[onFocus].datatype[i]});
		}
	}	

	renderOperatorList(operatorList);
	return;
	
}

OperatorManager.prototype.changedReusableResult = function(result, fromInput){

	var onFocusNode = mapCreator.getNodeByKey(onFocus); 

	var type = onFocusNode.datatype;

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

	var lang = null;
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

		if(resultNode.datatype=='literal' && operatorNode.label == 'lang')
			cachedResult[resultNode.key] = literalLang[resultNode.relatedTo];
		else
			cachedResult[resultNode.key] = savedResult[resultNode.relatedTo][resultNode.datatype];
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