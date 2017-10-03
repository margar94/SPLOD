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

		verbalization.negated.push('that has not ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
		verbalization.negated.push(predicateLabel + ' ');

		verbalization.truncated.push('has ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
		verbalization.truncated.push(predicateLabel + ' ');

		verbalization.first.push('everything that has ');
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

		verbalization.first.push('the ');
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
		standard: ['everything '],
		modified: [],
		truncated: [],
		first: ['everything '],
		current: ['everything ']};

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
	return label.match(/[On For From A Of As \son \sfor \sfrom \sa \sof \sas]$/);
}

LanguageManager.prototype.verbalizeOperator = function(operator){

	verbalization = {
		standard: ['that '+operator+' '],
		truncated: [operator+' '],
		current: ['that '+operator+' ']};

	switch(operator){
		case '<':
			verbalization.standard = ['that is less than '];
			verbalization.truncated = ['less than '];
			verbalization.current = verbalization.standard;
			break;
		case '<=':
			verbalization.standard = ['that is less or equals than '];
			verbalization.truncated = ['less or equals than '];
			verbalization.current = verbalization.standard;
			break;
		case '>':
			verbalization.standard = ['that is more than '];
			verbalization.truncated = ['more than '];
			verbalization.current = verbalization.standard;
			break;
		case '>=':
			verbalization.standard = ['that is more or equals than '];
			verbalization.truncated = ['more or equals than '];
			verbalization.current = verbalization.standard;
			break;
		case 'is_string':
			verbalization.standard = ['that is '];
			verbalization.truncated = [''];
			verbalization.current = verbalization.standard;
			break;
		case 'is_url':
			verbalization.standard = ['that is '];
			verbalization.truncated = [''];
			verbalization.current = verbalization.standard;
			break;
		case 'range':
			verbalization.standard = ['that is between '];
			verbalization.truncated = ['between '];
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
	}

	return verbalization;

}

LanguageManager.prototype.verbalizeResult = function(result){

	verbalization = {
		standard: [result+' '],
		current: [result+' ']};

	return verbalization;

}