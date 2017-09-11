//var LanguageManager = function (selectedEndpoint, selectedGraph) {
var LanguageManager = function () {
	
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

	//verbalization.truncated.push();

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
		first: [],
		current: []};


	if(predicateDirection == 'direct'){

		verbalization.standard.push('that has ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
		verbalization.standard.push(predicateLabel + ' ');

		verbalization.modified.push('whose ');
		verbalization.modified.push(predicateLabel + ' ');

		verbalization.truncated.push('has ' + LanguageManager.prototype.getArticle(predicateLabel) + ' ');
		verbalization.truncated.push(predicateLabel + ' ');

		verbalization.first.push('everything that has ');
		verbalization.first.push(predicateLabel + ' ');

	}else if(predicateDirection == 'reverse'){

		verbalization.standard.push('that is the ');
		verbalization.standard.push(predicateLabel + ' ');
		verbalization.standard.push('of ');

		verbalization.modified.push('');
		verbalization.modified.push('the ' + predicateLabel + ' ');
		verbalization.modified.push('of ');

		verbalization.truncated.push('is the ');
		verbalization.truncated.push(predicateLabel + ' ');
		verbalization.truncated.push('of ');

		verbalization.first.push('the ');
		verbalization.first.push(predicateLabel + ' ');
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
		current: ['something']};

	return verbalization;

}