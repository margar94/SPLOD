var enLanguageManager = function () {
	if(enLanguageManager.prototype._singletonInstance){
		return enLanguageManager.prototype._singletonInstance;
	}

	enLanguageManager.prototype._singletonInstance = this;
};

//Return a or an according to how noun starts
enLanguageManager.prototype.getArticle = function(noun){
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
enLanguageManager.prototype.verbalizeConcept = function(conceptLabel){
	verbalization = {
		standard: [],
		modified: [],
		negated: [],
		optional: [],
		truncated: [],
		first: [],
		focus: [conceptLabel],
		current: []};

	verbalization.standard.push(enLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.standard.push(conceptLabel + ' ');
	verbalization.standard.push('');

	verbalization.modified.push('that is ' + enLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.modified.push(conceptLabel + ' ');
	verbalization.modified.push('');

	verbalization.negated.push('that is ');
	verbalization.negated.push('not ');
	verbalization.negated.push(enLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.negated.push(conceptLabel + ' ');
	verbalization.negated.push('');	

	verbalization.optional.push('that is ');
	verbalization.optional.push('optional ');
	verbalization.optional.push(enLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.optional.push(conceptLabel + ' ');
	verbalization.optional.push('');

	verbalization.truncated.push('is ' + enLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.truncated.push(conceptLabel + ' ');
	verbalization.truncated.push('');

	verbalization.first.push(' ');
	verbalization.first.push(conceptLabel + ' ');
	verbalization.first.push('');

	verbalization.current = verbalization.standard;

	return verbalization;

}

enLanguageManager.prototype.verbalizePredicate = function(predicateLabel, predicateDirection){
	verbalization = {
		standard: [],
		modified: [],
		truncated: [],
		negated: [],
		optional: [],
		first: [],
		focus: [predicateLabel],
		current: []};


	if(predicateDirection == 'direct'){

		if(enLanguageManager.prototype.startsWithVerb(predicateLabel)){
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
			verbalization.first.push(' that ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push('');
		}else{
			verbalization.standard.push('that has ' + enLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push('');

			verbalization.modified.push('whose ');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push('');

			verbalization.negated.push('that has ');
			verbalization.negated.push('not ');
			verbalization.negated.push(enLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push('');

			verbalization.optional.push('that has ');
			verbalization.optional.push('optionally ');
			verbalization.optional.push(enLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push('');

			verbalization.truncated.push('has ' + enLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push('');

			//direct predicate should not be the first node
			verbalization.first.push(' that has ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push('');
		}

	}else if(predicateDirection == 'reverse'){
		var postLabel = 'of ';
		if(enLanguageManager.prototype.endsWithPreposition(predicateLabel))
			postLabel = ' ';

		if(enLanguageManager.prototype.startsWithVerb(predicateLabel)){

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
			verbalization.negated.push(postLabel);

			verbalization.optional.push('that ');
			verbalization.optional.push('optionally ');
			verbalization.optional.push('');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push(postLabel);

			verbalization.truncated.push('');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push(postLabel);

			verbalization.first.push(' that ');
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

			verbalization.first.push(' that is the ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push(postLabel);
		}
	}
	
	verbalization.current = verbalization.standard;

	return verbalization;

}

enLanguageManager.prototype.verbalizeSomething = function(){

	verbalization = {
		standard: ['something '],
		focus: ['something'],
		current: ['something ']};

	return verbalization;

}

enLanguageManager.prototype.verbalizeEverything = function(){

	verbalization = {
		standard: ['thing '],
		first: [' thing '],
		focus: ['thing'],
		current: ['thing ']};

	return verbalization;

}

enLanguageManager.prototype.getOrdinalNumber = function(cardinalNumber){
	var ordinalNumber = '';
	
	switch(cardinalNumber){
		case 1 : ordinalNumber = '1st'; break;
		case 2 : ordinalNumber = '2nd'; break;
		case 3 : ordinalNumber = '3rd'; break;
		default : ordinalNumber = cardinalNumber+'th'; break;
	}

	return ordinalNumber;
}

enLanguageManager.prototype.endsWithPreposition = function(label){
	var preposition = ["On", "For", "From", "A", "Of", "As", "By", 
		" by", " on", " for", "\sfrom", "\sa", "\sof", "\sas"]; 
	for(var i=0; i<preposition.length; i++){
		if(label.endsWith(preposition[i]))
			return true;
	}
	return false;
}

enLanguageManager.prototype.verbalizeOperator = function(operator){

	var verbalization = {
		standard: ['that ', operator+' ', ''],
		truncated: ['', operator+' ', ''],
		negated: ['that is ', 'not ', '', operator+' ', ''],
		optional : ['that is ', 'optionally ','', operator+' ', ''],
		focus: [operator]};

	verbalization.current = verbalization.standard;

	switch(operator){
		case '<':
			verbalization.standard = ['that is ','less ','than '];
			verbalization.truncated = ['','less ','than '];
			verbalization.negated = ['that is ', 'not ', '', 'less ','than '];
			verbalization.optional = ['that is ', 'optionally ', '', 'less ','than '];
			verbalization.focus = ['less'];
			verbalization.current = verbalization.standard;
			break;
		case '<=':
			verbalization.standard = ['that is ','less or equals ','than '];
			verbalization.truncated = ['','less or equals ','than '];
			verbalization.negated = ['that is ', 'not ', '','less or equals ','than '];
			verbalization.optional = ['that is ', 'optionally ', '','less or equals ','than '];
			verbalization.focus = ['less or equals'];
			verbalization.current = verbalization.standard;
			break;
		case '>':
			verbalization.standard = ['that is ','more ','than '];
			verbalization.truncated = ['','more ','than '];
			verbalization.negated = ['that is ', 'not ', '','more ','than '];
			verbalization.optional = ['that is ', 'optionally ', '', 'more ','than '];
			verbalization.focus = ['more'];
			verbalization.current = verbalization.standard;
			break;
		case '>=':
			verbalization.standard = ['that is ','more or equals ','than '];
			verbalization.truncated = ['','more or equals ','than '];
			verbalization.negated = ['that is ', 'not ', '', 'more or equals ','than '];
			verbalization.optional = ['that is ', 'optionally ', '', 'more or equals ','than '];
			verbalization.focus = ['more or equals'];
			verbalization.current = verbalization.standard;
			break;
		case '=':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','equals ','to '];
			verbalization.negated = ['that is ', 'not ', '', 'equals ','to '];
			verbalization.optional = ['that is ', 'optionally ', '', 'equals ','to '];
			verbalization.focus = ['equals'];
			verbalization.current = verbalization.standard;
			break;
		case 'is string':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','',''];
			verbalization.negated = ['that is ', 'not ', '', 'equals ', 'to '];
			verbalization.optional = ['that is ', 'optionally ', '', 'equals ', 'to '];
			verbalization.focus = ['equals'];
			verbalization.current = verbalization.standard;
			break;
		case 'is url':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','',''];
			verbalization.negated = ['that is ', 'not ', '', 'equals ', 'to '];
			verbalization.optional = ['that is ', 'optionally ', '', 'equals ', 'to '];
			verbalization.focus = ['equals'];
			verbalization.current = verbalization.standard;
			break;
		case 'is date':
			verbalization.standard = ['that is ','equals ','to '];
			verbalization.truncated = ['','',''];
			verbalization.negated = ['that is ', 'not ', '', 'equals ', 'to '];
			verbalization.optional = ['that is ', 'optionally ', '', 'equals ', 'to '];
			verbalization.focus = ['equals'];
			verbalization.current = verbalization.standard;
			break;
		case 'range':
			verbalization.standard = ['that is ','between ',''];
			verbalization.truncated = ['','between ',''];
			verbalization.negated = ['that is ', 'not ', '', 'between ',''];
			verbalization.optional = ['that is ', 'optionally ', '', 'between ',''];
			verbalization.focus = ['between'];
			verbalization.current = verbalization.standard;
			break;
		case 'range date':
			verbalization.standard = ['that is ','between ',''];
			verbalization.truncated = ['','between ',''];
			verbalization.negated = ['that is ', 'not ', '', 'between ',''];
			verbalization.optional = ['that is ', 'optionally ', '', 'between ',''];
			verbalization.focus = ['between'];
			verbalization.current = verbalization.standard;
			break;
		case 'and':	
			verbalization.standard = ['and '];
			verbalization.focus = ['and'];
			verbalization.current = verbalization.standard;
			break;
		case 'or':	
			verbalization.standard = ['or '];
			verbalization.focus = ['or'];
			verbalization.current = verbalization.standard;
			break;
		case 'xor':	
			verbalization.standard = ['xor '];
			verbalization.focus = ['xor'];
			verbalization.current = verbalization.standard;
			break;
		case 'not':
			verbalization.standard = ['not '];
			verbalization.focus = ['not'];
			verbalization.current = verbalization.standard;
			break;
		case 'optional':
			verbalization.standard = ['optionally '];
			verbalization.focus = ['optionally'];
			verbalization.current = verbalization.standard;
			break;
		case 'lang':
			verbalization.standard = ['that has ','lang ',''];
			verbalization.negated = ['that has ', 'not ', '', 'lang ',''];
			verbalization.optional = ['that has ','optionally ', '', 'lang ',''];
			verbalization.focus = ['lang'];
			verbalization.current = verbalization.standard;
			break;
		case 'before':
			verbalization.standard = ['that is ','before ',''];
			verbalization.truncated = ['','before ',''];
			verbalization.negated = ['that is ', 'not ', '', 'before ',''];
			verbalization.optional = ['that is ', 'optionally ', '', 'before ',''];
			verbalization.focus = ['before'];
			verbalization.current = verbalization.standard;
			break;
		case 'after':
			verbalization.standard = ['that is ','after ',''];
			verbalization.truncated = ['','after ',''];
			verbalization.negated = ['that is ', 'not ', '', 'after ',''];
			verbalization.optional = ['that is ', 'optionally ', '', 'before ',''];
			verbalization.focus = ['after'];
			verbalization.current = verbalization.standard;
			break;
	}

	return verbalization;

}

enLanguageManager.prototype.getDefaultConjunction = function(){
	return 'and ';
}

enLanguageManager.prototype.verbalizeResult = function(result){

	var verbalization = {
		standard: [result+' '],
		focus: [result],
		current: [result+' ']};

	return verbalization;

}

//First part of query verbalization
enLanguageManager.prototype.getQueryStartVerbalization = function(){
	return 'Give me ';
}

//Initialization of query
enLanguageManager.prototype.getQueryInitialVerbalization = function(){
	return 'Give me...';
}

enLanguageManager.prototype.getFocusLabel = function(){
	return 'Focus: ';
}

enLanguageManager.prototype.getFocusInitialVerbalization = function(){
	return '-';
}

enLanguageManager.prototype.getTabTitle = function(tabType){
	var title = '';
	switch(tabType){
		case 'concept' : title = 'Concepts'; break;
		case 'predicate' : title = 'Predicates'; break;
		case 'operator' : title = 'Operators'; break;
		case 'table result' : title = 'Table result'; break;
		case 'settings' : title = 'Settings'; break;
		case 'direct predicate' : title = 'Direct'; break;
		case 'reverse predicate' : title = 'Reverse'; break;
		case 'help' : title = 'Help'; break;
	}
	return title;
}

enLanguageManager.prototype.getBoxTitle = function(boxType){
	var title = '';
	switch(boxType){
		case 'result' : title = 'Substitute result on focus'; break;
	}
	return title;
}

enLanguageManager.prototype.getInputPlaceholder = function(inputType){
	var placeholder;

	switch(inputType){
		case 'concept' : placeholder = "Search for a concept"; break;
		case 'predicate' : placeholder = "Search for a predicate"; break;
		case 'result' : placeholder = "Search for a result"; break;
	}

	return placeholder;
}

enLanguageManager.prototype.getOperatorLabelVerbalization = function(operator){	
	var label;	

	switch(operator){
		
		case '<': 
			label = 'less than ';
			break;
		case '<=': 
			label = 'less or equals than ';
			break;
		case '>': 
			label = 'more than ';
			break;
		case '>=': 
			label = 'more or equals than ';
			break;
		case '=': 
			label = 'equals ';
			break;
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

enLanguageManager.prototype.getUserInputHint = function(){	
	return 'Insert your value: ';
}

enLanguageManager.prototype.getButtonLabel = function(button){
	var label;

	switch(button){
		case 'confirm' : 
			label = 'Confirm';
			break;
		case 'remove':
			label = 'Remove';
			break;
		case 'close':
			label = 'Close';
			break;
		case 'removeFocus': //remove higlighted part of query
			label = 'Remove all the strikethrough words';
			break;
		case 'confirmUserInput': //confirm user value to complete operator
			label = 'Add your value';
			break;
		case 'discardButton':
			label = 'Discard operator';
			break;
		case 'visibleFields':
			label = 'Visible fields';
			break;
		case 'sparqlQuery':
			label = 'Compare query in natural language with SPARQL query';
			break;
		case 'saveTable':
			label = 'Save result table';
			break;
	}

	return label;
}


enLanguageManager.prototype.startsWithVerb = function(predicateLabel, direction){
	return predicateLabel.startsWith('has')||predicateLabel.startsWith('is');
}


enLanguageManager.prototype.getPredicateVerbalization = function(predicateLabel, direction){
	var label;

	if(enLanguageManager.prototype.startsWithVerb(predicateLabel, direction))
		label = 'that '+ predicateLabel;
	else if(direction == 'direct')
		label =	'that has '+ enLanguageManager.prototype.getArticle(predicateLabel) + ' ' + predicateLabel; 
	else
		label =	'that is the ' + predicateLabel; 
	
	return label; 
}

enLanguageManager.prototype.getHintOperatorManager = function(about){
	var hint;

	switch(about){
		case 'reusableResult': 
			hint = 'These results are related to the following query: '; break;
	}

	return hint;
}

enLanguageManager.prototype.getSelectTitle = function(select){
 var label; 

 switch(select){
  case 'label lang': label = 'Select label language'; break;
  case 'system lang': label = 'Select system language'; break;
  case 'num concepts': label = 'Change concept\'s number'; break;
  case 'num predicates': label = 'Change predicate\'s number'; break;
 }

 return label;
}

enLanguageManager.prototype.getHelpGuide = function(){
	var headers = [];

	var overviewObj = {title : 'Overview', content : []};
	overviewObj.content.push('<b>spLOD</b> will help you to use LOD (linked open data) and create a table that you can use in next steps.<br>You can see some example explained step by step to create your first request.INSERT EXAMPLE');
	headers.push(overviewObj);

	var boxesObj = {title : 'Boxes content : concepts, predicates, operators, table result, settings', content : []};
	boxesObj.content.push('<b>Tab of concepts</b> contains all concepts <i>declared</i> in the endpoint that you selected in the first step. Concepts are <i>subject</i> or <i>object</i> in RDF data.IMG');
	boxesObj.content.push('<b>Tab of predicates</b> contains all predicates <i>used</i> in the endpoint that you selected in the first step.IMG with direct and reverse predicate');
	boxesObj.content.push('<b>Tab of operators</b> gives you the possibility to filter data or apply some operation to query structure such as change of retrieved results number.');
	boxesObj.content.push('<b>Tab of table result</b> shows you query result. You can hide some fields. You can see results preview in the tab.');
	boxesObj.content.push('<b>Tab of settings</b> gives you the possibility to <ul><li>change how many concepts do you want to see,</li><li>change how many predicates do you want to see,</li><li>change system\'s language,</li><li>change retrieved data language (not only results data, but also boxes content, if data labels are available in your language).</li></ul>');
	headers.push(boxesObj);

	var queryNLObj = {title : 'Query Natural Language', content : []};
	queryNLObj.content.push('<b>spLOD</b> tries to verbalize your interactions creating the same request that hopefully you would ask to another person.<br>The colors will guide you to a friendly understanding of the request.<br>IMG EXAMPLE<br>Be careful with the barred words!<br>IMG EXAMPLE<br>');
	headers.push(queryNLObj);

	var focusObj = {title : 'Focus : how it works', content : []};
	focusObj.content.push('According to the element on focus <b>spLOD</b> will fill all boxes and build your request.<br>By your interaction the focus will be updated.<br>But you can still change it whenever you want.');
	headers.push(focusObj);

	var querySPARQLObj = {title : 'Query SPARQL', content : []};
	querySPARQLObj.content.push('<b>SPARQL</b> is the standard semantic query language used to retrieve LOD.<br>According to your interactions <b>spLOD</b> will automatically build the query.<br>You can learn about SPARQL thanks to the side by side boxes.<br>By changing the focus the system will highlight the related section in the query.');
	headers.push(querySPARQLObj);

	return headers;

}

enLanguageManager.prototype.getOperatorFieldVerbalization = function(cardinalNumber){
	return enLanguageManager.prototype.getOrdinalNumber(cardinalNumber) + ' field';
}
