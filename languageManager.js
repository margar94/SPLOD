var LanguageManager = function (selectedEndpoint, selectedGraph) {
	
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

	verbalization.standard.push(getArticle(conceptLabel) + ' ');
	verbalization.standard.push(conceptLabel + ' ');

	verbalization.modiefied.push('that is ' + getArticle(conceptLabel) + ' ');
	verbalization.modiefied.push(conceptLabel + ' ');

	//verbalization.truncated.push();

	verbalization.first.push('every ');
	verbalization.first.push(conceptLabel + ' ');

	verbalization.current = verbalization.standard;

}

LanguageManager.prototype.verbalizePredicate = function(predicateLabel, predicateDirection){
	verbalization = {
		standard: [],
		modified: [],
		truncated: [],
		first: [],
		current: []};


	if(predicateDirection == 'direct'){

		verbalization.standard.push('that has ' + getArticle(predicateLabel) + ' ');
		verbalization.standard.push(predicateLabel + ' ');

		verbalization.modiefied.push('whose ');
		verbalization.modiefied.push(predicateLabel + ' ');

		verbalization.truncated.push('has ' + getArticle(predicateLabel) + ' ');
		verbalization.truncated.push(predicateLabel + ' ');

		verbalization.first.push('everything that has ');
		verbalization.first.push(conceptLabel + ' ');

	}else if(predicateDirection == 'reverse'){

		verbalization.standard.push('that is the ');
		verbalization.standard.push(predicateLabel + ' ');
		verbalization.standard.push('of ');

		verbalization.modiefied.push('the ' + predicateLabel + ' ');
		verbalization.modiefied.push('of ');

		verbalization.truncated.push('is the ');
		verbalization.truncated.push(predicateLabel + ' ');
		verbalization.truncated.push('of ');

		verbalization.first.push('the ');
		verbalization.first.push(conceptLabel + ' ');
		verbalization.first.push('of ');
	}
	
	verbalization.current = verbalization.standard;

	return verbalization;

}

LanguageManager.prototype.verbalizeSomething = function(){

	verbalization = {
		standard: ['something'],
		modified: [],
		truncated: [],
		first: [],
		current: standard};

	return verbalization;

}