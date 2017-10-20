var LanguageManager = function () {
	if(LanguageManager.prototype._singletonInstance){
		return LanguageManager.prototype._singletonInstance;
	}

	LanguageManager.prototype._singletonInstance = this;
};

//Return a or an according to how noun starts
LanguageManager.prototype.getArticle = function(noun){
	var article;
	if("aeiouAEIOU".indexOf(noun.charAt(0)) != -1)
		article = "an";
	else article = "a";
	return article;
}

/*
	Return verbalization object given a conceprLabel
	Verbalization object's structure : 
		verbalization = {
			standard: [], // standard one
			modified: [], // when specialize a prev noun (concept or predicate)
			negated: [], // when 'not' is its father
			optional: [], // when 'optional' is its father
			truncated: [],  
			first: [], // when concept is the query's subject
			current: []};
*/
LanguageManager.prototype.verbalizeConcept = function(conceptLabel){
	verbalization = {
		standard: [],
		modified: [],
		negated: [],
		optional: [],
		truncated: [],
		first: [],
		current: []};

	verbalization.standard.push(LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.standard.push(conceptLabel + ' ');
	verbalization.standard.push('');

	verbalization.modified.push('that is ' + LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.modified.push(conceptLabel + ' ');
	verbalization.modified.push('');

	verbalization.negated.push('that is ');
	verbalization.negated.push('not ');
	verbalization.negated.push(LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.negated.push(conceptLabel + ' ');
	verbalization.negated.push('');	

	verbalization.optional.push('that is ');
	verbalization.optional.push('optional ');
	verbalization.optional.push(LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.optional.push(conceptLabel + ' ');
	verbalization.optional.push('');

	verbalization.truncated.push('is ' + LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.truncated.push(conceptLabel + ' ');
	verbalization.truncated.push('');

	verbalization.first.push('');
	verbalization.first.push(conceptLabel + ' ');
	verbalization.first.push('');

	verbalization.current = verbalization.standard;

	return verbalization;

}

LanguageManager.prototype.verbalizePredicate = function(predicateLabel, predicateDirection){
	verbalization = {
		standard: [],
		modified: [],
		truncated: [],
		negated: [],
		optional: [],
		first: [],
		current: []};


	if(predicateDirection == 'direct'){

		if(LanguageManager.prototype.startsWithVerb(predicateLabel)){
			verbalization.standard.push('that ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push('');

			verbalization.modified.push('whose ');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push('');

			verbalization.negated.push('that ');
			verbalization.negated.push('not ');
			verbalization.negated.push('');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push('');

			verbalization.optional.push('that ');
			verbalization.optional.push('optionally ');
			verbalization.optional.push('');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push('');

			verbalization.truncated.push('');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push('');

			//direct predicate should not be the first node
			verbalization.first.push('that ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push('');
		}else{
			verbalization.standard.push('that has ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push('');

			verbalization.modified.push('whose ');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push('');

			verbalization.negated.push('that has ');
			verbalization.negated.push('not ');
			verbalization.negated.push(LanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push('');

			verbalization.optional.push('that has ');
			verbalization.optional.push('optionally ');
			verbalization.optional.push(LanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push('');

			verbalization.truncated.push('has ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push('');

			//direct predicate should not be the first node
			verbalization.first.push('that has ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push('');
		}

	}else if(predicateDirection == 'reverse'){
		var postLabel = 'of ';
		if(LanguageManager.prototype.endsWithPreposition(predicateLabel))
			postLabel = ' ';

		if(LanguageManager.prototype.startsWithVerb(predicateLabel)){

			verbalization.standard.push('that ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push(postLabel);

			verbalization.modified.push('');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push(postLabel);

			verbalization.negated.push('that ');
			verbalization.negated.push('not ');
			verbalization.negated.push('');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push('');

			verbalization.optional.push('that ');
			verbalization.optional.push('optionally ');
			verbalization.optional.push('');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push('');

			verbalization.truncated.push('');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push(postLabel);

			verbalization.first.push('that ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push(postLabel);

		}else{
			verbalization.standard.push('that is the ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push(postLabel);

			verbalization.modified.push('the ');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push(postLabel);

			verbalization.negated.push('that is ');
			verbalization.negated.push('not ');
			verbalization.negated.push('the ');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push(postLabel);

			verbalization.optional.push('that is ');
			verbalization.optional.push('optionally ');
			verbalization.optional.push('the ');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push(postLabel);

			verbalization.truncated.push('is the ');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push(postLabel);

			verbalization.first.push('that is the ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push(postLabel);
		}
	}
	
	verbalization.current = verbalization.standard;

	return verbalization;

}

LanguageManager.prototype.verbalizeSomething = function(){

	verbalization = {
		standard: ['something '],
		current: ['something ']};

	return verbalization;

}

LanguageManager.prototype.verbalizeEverything = function(){

	verbalization = {
		standard: ['thing '],
		first: ['thing '],
		current: ['thing ']};

	return verbalization;

}

LanguageManager.prototype.getOrdinalNumber = function(cardinalNumber){
	var ordinalNumber = '';
	
	switch(cardinalNumber){
		case 1 : ordinalNumber = '1st'; break;
		case 2 : ordinalNumber = '2nd'; break;
		case 3 : ordinalNumber = '3rd'; break;
		default : ordinalNumber = cardinalNumber+'th'; break;
	}

	return ordinalNumber;
}

LanguageManager.prototype.endsWithPreposition = function(label){
	var preposition = ["On", "For", "From", "A", "Of", "As", "By", 
		" by", " on", " for", "\sfrom", "\sa", "\sof", "\sas"]; 
	for(var i=0; i<preposition.length; i++){
		if(label.endsWith(preposition[i]))
			return true;
	}
	return false;
}

LanguageManager.prototype.verbalizeOperator = function(operator){

	verbalization = {
		standard: ['that ', operator+' ', ''],
		truncated: ['', operator+' ', ''],
		negated: ['that is ', 'not ', operator+' ', ''],
		optional : ['that is ', 'optionally ', operator+' ', '']};

	verbalization.current = verbalization.standard;

	switch(operator){
		case '<':
			verbalization.standard = ['that is ','less ','than '];
			verbalization.truncated = ['','less ','than '];
			verbalization.negated = ['that is ', 'not ', 'less ','than '];
			verbalization.optional = ['that is ', 'optionally ', 'less ','than '];
			verbalization.current = verbalization.standard;
			break;
		case '<=':
			verbalization.standard = ['that is ','less or equals ','than '];
			verbalization.truncated = ['','less or equals ','than '];
			verbalization.negated = ['that is ', 'not ', 'less or equals ','than '];
			verbalization.optional = ['that is ', 'optionally ', 'less or equals ','than '];
			verbalization.current = verbalization.standard;
			break;
		case '>':
			verbalization.standard = ['that is ','more ','than '];
			verbalization.truncated = ['','more ','than '];
			verbalization.negated = ['that is ', 'not ', 'more ','than '];
			verbalization.optional = ['that is ', 'optionally ', 'more ','than '];
			verbalization.current = verbalization.standard;
			break;
		case '>=':
			verbalization.standard = ['that is ','more or equals ','than '];
			verbalization.truncated = ['','more or equals ','than '];
			verbalization.negated = ['that is ', 'not ', 'more or equals ','than '];
			verbalization.optional = ['that is ', 'optionally ', 'more or equals ','than '];
			verbalization.current = verbalization.standard;
			break;
		case '=':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','equals ','to '];
			verbalization.negated = ['that is ', 'not ', 'equals ','to '];
			verbalization.optional = ['that is ', 'optionally ', 'equals ','to '];
			verbalization.current = verbalization.standard;
			break;
		case 'is string':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','',''];
			verbalization.negated = ['that is ', 'not ','equals ', 'to '];
			verbalization.optional = ['that is ', 'optionally ','equals ', 'to '];
			verbalization.current = verbalization.standard;
			break;
		case 'is url':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','',''];
			verbalization.negated = ['that is ', 'not ','equals ', 'to '];
			verbalization.optional = ['that is ', 'optionally ','equals ', 'to '];
			verbalization.current = verbalization.standard;
			break;
		case 'is date':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','',''];
			verbalization.negated = ['that is ', 'not ','equals ', 'to '];
			verbalization.optional = ['that is ', 'optionally ','equals ', 'to '];
			verbalization.current = verbalization.standard;
			break;
		case 'range':
			verbalization.standard = ['that is ','between ',''];
			verbalization.truncated = ['','between ',''];
			verbalization.negated = ['that is ', 'not ', 'between ',''];
			verbalization.optional = ['that is ', 'optionally ', 'between ',''];
			verbalization.current = verbalization.standard;
			break;
		case 'range date':
			verbalization.standard = ['that is ','between ',''];
			verbalization.truncated = ['','between ',''];
			verbalization.negated = ['that is ', 'not ', 'between ',''];
			verbalization.optional = ['that is ', 'optionally ', 'between ',''];
			verbalization.current = verbalization.standard;
			break;
		case 'and':	
			verbalization.standard = ['and '];
			verbalization.current = verbalization.standard;
			break;
		case 'or':	
			verbalization.standard = ['or '];
			verbalization.current = verbalization.standard;
			break;
		case 'xor':	
			verbalization.standard = ['xor '];
			verbalization.current = verbalization.standard;
			break;
		case 'not':
			verbalization.standard = ['not '];
			verbalization.current = verbalization.standard;
			break;
		case 'optional':
			verbalization.standard = ['optionally '];
			verbalization.current = verbalization.standard;
			break;
		case 'lang':
			verbalization.standard = ['that has ','lang ',''];
			verbalization.negated = ['that has ', 'not ','lang ',''];
			verbalization.optional = ['that has ','optionally ','lang ',''];
			verbalization.current = verbalization.standard;
			break;
		case 'before':
			verbalization.standard = ['that is ','before ',''];
			verbalization.truncated = ['','before ',''];
			verbalization.negated = ['that is ', 'not ', 'before ',''];
			verbalization.optional = ['that is ', 'optionally ', 'before ',''];
			verbalization.current = verbalization.standard;
			break;
		case 'after':
			verbalization.standard = ['that is ','after ',''];
			verbalization.truncated = ['','after ',''];
			verbalization.negated = ['that is ', 'not ', 'after ',''];
			verbalization.optional = ['that is ', 'optionally ', 'before ',''];
			verbalization.current = verbalization.standard;
			break;
	}

	return verbalization;

}

LanguageManager.prototype.verbalizeResult = function(result){

	verbalization = {
		standard: [result+' '],
		current: [result+' ']};

	return verbalization;

}

LanguageManager.prototype.getOperatorStandardVerbalization = function(operator){	
	var verbalization;	

	switch(operator){
		case 'before':
			verbalization = ['that is before '];
			break;
		case 'after':
			verbalization = ['that is after '];
			break;
		case '<':
			verbalization = ['that is less than '];
			break;
		case '<=':
			verbalization = ['that is less or equals than '];
			break;
		case '>':
			verbalization = ['that is more than '];
			break;
		case '>=':
			verbalization = ['that is more or equals than '];
			break;
		case 'is string':
			verbalization = ['that is '];
			break;
		case 'is url':
			verbalization = ['that is '];
			break;
		case 'is date':
			verbalization = ['that is '];
			break;
		case '=':
			verbalization = ['that is equals to '];
			break;
		case 'range':
			verbalization = ['that is between '];
			break;
		case 'and':	
			verbalization = ['and '];
			break;
		case 'or':	
			verbalization = ['or '];
			break;
		case 'or':	
			verbalization = ['xor '];
			break;
		case 'not':
			verbalization = ['that is not '];
			break;
		case 'optional':
			verbalization = ['that is optionally '];
			break;
		case 'lang':
			verbalization = ['whose lang is '];
			break;
		case 'range date':
			verbalization = ['that is between '];
			break;
		case 'limit':
			verbalization = ['Number of results: '];
			break;
		default:
			verbalization = ['that '+operator+' '];
			break;
	}

	return verbalization;

}

//First part of query verbalization
LanguageManager.prototype.getQueryStartVerbalization = function(){
	return 'Give me ';
}

//Initialization of query
LanguageManager.prototype.getQueryInitialVerbalization = function(){
	return 'Give me...';
}

LanguageManager.prototype.getFocusLabel = function(){
	return 'Focus: ';
}

//Initialization of focus
LanguageManager.prototype.getFocusInitialVerbalization = function(){
	return '-';
}

LanguageManager.prototype.getTabTitle = function(tabType){
	var title = '';
	switch(tabType){
		case 'concept' : title = 'Concepts'; break;
		case 'predicate' : title = 'Predicates'; break;
		case 'operator' : title = 'Operators'; break;
		case 'table result' : title = 'Table result'; break;
		case 'settings' : title = 'Settings'; break;
		case 'direct predicate' : title = 'Direct'; break;
		case 'reverse predicate' : title = 'Reverse'; break;
	}
	return title;
}

LanguageManager.prototype.getBoxTitle = function(boxType){
	var title = '';
	switch(boxType){
		case 'concept' : title = 'Concepts'; break;
		case 'predicate' : title = 'Predicates'; break;
		case 'operator' : title = 'Operators'; break;
		case 'table result' : title = 'Table result'; break;
		case 'settings' : title = 'Settings'; break;
		case 'result' : title = 'Reusable result'; break;
	}
	return title;
}

LanguageManager.prototype.getReusableResultWarning = function(){
	return 'WARNING';
}

LanguageManager.prototype.getOperatorLabelVerbalization = function(operator){	
	var label;	

	switch(operator){
		case 'is string':
		case 'is url':
		case 'is date':
			label = 'is';
			break;
		case 'range':
		case 'range date':
			label = 'range';
			break;
		default: 
			label = operator;
			break;
	}

	return label;

}

LanguageManager.prototype.getUserInputHint = function(){	
	return 'Insert your value: ';
}

LanguageManager.prototype.getButtonLabel = function(button){
	var label;

	switch(button){
		case 'confirm' : 
			label = 'Confirm';
			break;
		case 'remove':
			label = 'Remove';
			break;
		case 'removeFocus': //remove higlighted part of query
			label = 'Remove all the highlighted';
			break;
		case 'confirmUserInput': //confirm user value to complete operator
			label = 'Add your value';
			break;
		case 'discardButton':
			label = 'Discard operator';
			break;
	}

	return label;
}


LanguageManager.prototype.startsWithVerb = function(predicateLabel, direction){
	return predicateLabel.startsWith('has')||predicateLabel.startsWith('is');
}


LanguageManager.prototype.getPredicateVerbalization = function(predicateLabel, direction){
	var label;

	if(predicateLabel.startsWith('has')||predicateLabel.startsWith('is'))
		label = 'that '+ predicateLabel;
	else if(direction == 'direct')
		label =	'that has '+ LanguageManager.prototype.getArticle(predicateLabel) + ' ' + predicateLabel; 
	else
		label =	'that is the ' + predicateLabel; 
	
	return label; 
}


