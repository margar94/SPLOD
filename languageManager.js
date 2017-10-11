var LanguageManager = function () {
	if(LanguageManager.prototype._singletonInstance){
		return LanguageManager.prototype._singletonInstance;
	}

	LanguageManager.prototype._singletonInstance = this;
};

LanguageManager.prototype.getArticle = function(noun){
	var article;
	if("aeiouAEIOU".indexOf(noun.charAt(0)) != -1)
		article = "an";
	else article = "a";
	return article;
}

LanguageManager.prototype.verbalizeConcept = function(conceptLabel){
	verbalization = {
		standard: [],
		modified: [],
		truncated: [],
		first: [],
		current: []};

	verbalization.standard.push(LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.standard.push(conceptLabel + ' ');

	verbalization.modified.push('that is ' + LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.modified.push(conceptLabel + ' ');

	verbalization.truncated.push('is ' + LanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.truncated.push(conceptLabel + ' ');

	verbalization.first.push('every ');
	verbalization.first.push(conceptLabel + ' ');

	verbalization.current = verbalization.standard;

	return verbalization;

}

LanguageManager.prototype.verbalizePredicate = function(predicateLabel, predicateDirection){
	verbalization = {
		standard: [],
		modified: [],
		truncated: [],
		negated: [],
		first: [],
		current: []};


	if(predicateDirection == 'direct'){

		verbalization.standard.push('that has ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
		verbalization.standard.push(predicateLabel + ' ');

		verbalization.modified.push('whose ');
		verbalization.modified.push(predicateLabel + ' ');

		verbalization.negated.push('that has ');
		verbalization.negated.push('not ');
		verbalization.negated.push(LanguageManager.prototype.getArticle(predicateLabel) + ' ');
		verbalization.negated.push(predicateLabel + ' ');

		verbalization.truncated.push('has ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
		verbalization.truncated.push(predicateLabel + ' ');

		verbalization.first.push('every ');
		verbalization.first.push('thing that has ');
		verbalization.first.push(predicateLabel + ' ');

	}else if(predicateDirection == 'reverse'){
		var postLabel = 'of ';
		if(LanguageManager.prototype.endsWithPreposition(predicateLabel))
			postLabel = ' ';

		verbalization.standard.push('that is the ');
		verbalization.standard.push(predicateLabel + ' ');
		verbalization.standard.push(postLabel);

		verbalization.modified.push('');
		verbalization.modified.push('the ' + predicateLabel + ' ');
		verbalization.modified.push(postLabel);

		verbalization.truncated.push('is the ');
		verbalization.truncated.push(predicateLabel + ' ');
		verbalization.truncated.push(postLabel);

		verbalization.first.push('everything ');
		verbalization.first.push('that is the ');
		verbalization.first.push(predicateLabel + ' ');
		verbalization.first.push(postLabel);
	}
	
	verbalization.current = verbalization.standard;

	return verbalization;

}

LanguageManager.prototype.verbalizeSomething = function(){

	verbalization = {
		standard: ['something '],
		modified: [],
		truncated: [],
		first: [],
		current: ['something ']};

	return verbalization;

}

LanguageManager.prototype.verbalizeEverything = function(){

	verbalization = {
		standard: ['thing '],
		modified: [],
		truncated: [],
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
		standard: ['that '+operator+' '],
		truncated: [operator+' '],
		negated: ['that is ', 'not ', operator+' '],
		current: ['that '+operator+' ']};

	switch(operator){
		case '<':
			verbalization.standard = ['that is less than '];
			verbalization.truncated = ['less than '];
			verbalization.negated = ['that is ', 'not ', 'less than '];
			verbalization.current = verbalization.standard;
			break;
		case '<=':
			verbalization.standard = ['that is less or equals than '];
			verbalization.truncated = ['less or equals than '];
			verbalization.negated = ['that is ', 'not ', 'less or equals than '];
			verbalization.current = verbalization.standard;
			break;
		case '>':
			verbalization.standard = ['that is more than '];
			verbalization.truncated = ['more than '];
			verbalization.negated = ['that is ', 'not ', 'more than '];
			verbalization.current = verbalization.standard;
			break;
		case '>=':
			verbalization.standard = ['that is more or equals than '];
			verbalization.truncated = ['more or equals than '];
			verbalization.negated = ['that is ', 'not ', 'more or equals than '];
			verbalization.current = verbalization.standard;
			break;
		case '=':
			verbalization.standard = ['that is equals to '];
			verbalization.truncated = ['equals to '];
			verbalization.negated = ['that is ', 'not ', 'equals to '];
			verbalization.current = verbalization.standard;
			break;
		case 'is string':
			verbalization.standard = ['that is '];
			verbalization.truncated = [''];
			verbalization.negated = ['that is ', 'not '];
			verbalization.current = verbalization.standard;
			break;
		case 'is url':
			verbalization.standard = ['that is '];
			verbalization.truncated = [''];
			verbalization.negated = ['that is ', 'not '];
			verbalization.current = verbalization.standard;
			break;
		case 'is date':
			verbalization.standard = ['that is '];
			verbalization.truncated = [''];
			verbalization.negated = ['that is ', 'not '];
			verbalization.current = verbalization.standard;
			break;
		case 'range':
			verbalization.standard = ['that is between '];
			verbalization.truncated = ['between '];
			verbalization.negated = ['that is ', 'not ', 'between '];
			verbalization.current = verbalization.standard;
			break;
		case 'range date':
			verbalization.standard = ['that is between '];
			verbalization.truncated = ['between '];
			verbalization.negated = ['that is ', 'not ', 'between '];
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
		case 'not':
			verbalization.standard = ['that is not '];
			verbalization.current = verbalization.standard;
			break;
		case 'lang':
			verbalization.standard = ['whose lang is '];
			verbalization.negated = ['whose lang is ', 'not '];
			verbalization.current = verbalization.standard;
			break;
		case 'before':
			verbalization.standard = ['that is before '];
			verbalization.truncated = ['before '];
			verbalization.negated = ['that is ', 'not ', 'before '];
			verbalization.current = verbalization.standard;
			break;
		case 'after':
			verbalization.standard = ['that is after '];
			verbalization.truncated = ['after '];
			verbalization.negated = ['that is ', 'not ', 'after '];
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
		case 'not':
			verbalization = ['that is not '];
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

LanguageManager.prototype.getQueryStartVerbalization = function(){
	return 'Give me';
}

LanguageManager.prototype.getQueryInizializationVerbalization = function(){
	return 'Give me...';
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


