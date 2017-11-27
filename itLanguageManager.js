var itLanguageManager = function () {
	if(itLanguageManager.prototype._singletonInstance){
		return itLanguageManager.prototype._singletonInstance;
	}

	itLanguageManager.prototype._singletonInstance = this;
};

//Return a or an according to how noun starts
itLanguageManager.prototype.getArticle = function(noun){
	/*var article;
	if("aeiouAEIOU".indexOf(noun.charAt(0)) != -1)
		article = "an";
	else article = "a";
	return article;*/
	return '';
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
itLanguageManager.prototype.verbalizeConcept = function(conceptLabel){
	verbalization = {
		standard: [],
		modified: [],
		negated: [],
		optional: [],
		truncated: [],
		first: [],
		focus: [],
		current: []};

	verbalization.standard.push(itLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.standard.push(conceptLabel + ' ');
	verbalization.standard.push('');

	verbalization.modified.push('che &egrave; ' + itLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.modified.push(conceptLabel + ' ');
	verbalization.modified.push('');

	verbalization.negated.push('che ');
	verbalization.negated.push('non ');
	verbalization.negated.push('&egrave; ' + itLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.negated.push(conceptLabel + ' ');
	verbalization.negated.push('');	

	verbalization.optional.push('che &egrave; ');
	verbalization.optional.push('opzionalmente ');
	verbalization.optional.push(itLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.optional.push(conceptLabel + ' ');
	verbalization.optional.push('');

	verbalization.truncated.push('&egrave; ' + itLanguageManager.prototype.getArticle(conceptLabel) + ' ');
	verbalization.truncated.push(conceptLabel + ' ');
	verbalization.truncated.push('');

	verbalization.first.push(' ');
	verbalization.first.push(conceptLabel + ' ');
	verbalization.first.push('');

	verbalization.focus.push(conceptLabel);

	verbalization.current = verbalization.standard;

	return verbalization;

}

itLanguageManager.prototype.verbalizePredicate = function(predicateLabel, predicateDirection){
	verbalization = {
		standard: [],
		modified: [],
		truncated: [],
		negated: [],
		optional: [],
		first: [],
		focus: [],
		current: []};


	if(predicateDirection == 'direct'){

		if(itLanguageManager.prototype.startsWithVerb(predicateLabel)){
			verbalization.standard.push('che ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push('');

			verbalization.modified.push('il cui ');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push('');

			verbalization.negated.push('che ');
			verbalization.negated.push('non ');
			verbalization.negated.push('');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push('');

			verbalization.optional.push('che ');
			verbalization.optional.push('opzionalmente ');
			verbalization.optional.push('');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push('');

			verbalization.truncated.push('');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push('');

			//direct predicate should not be the first node
			verbalization.first.push(' che ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push('');

			verbalization.focus.push(predicateLabel);
		}else{
			verbalization.standard.push('che ha ' + itLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push('');
//MODIFICARE?
			verbalization.modified.push('il cui ');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push('');

			verbalization.negated.push('che ');
			verbalization.negated.push('non ');
			verbalization.negated.push('ha ' + itLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push('');

			verbalization.optional.push('che ha ');
			verbalization.optional.push('opzionalmente ');
			verbalization.optional.push(itLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push('');

			verbalization.truncated.push('ha ' + itLanguageManager.prototype.getArticle(predicateLabel) + ' ');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push('');

			//direct predicate should not be the first node
			verbalization.first.push(' che ha ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push('');

			verbalization.focus.push(predicateLabel);
		}

	}else if(predicateDirection == 'reverse'){
		var postLabel = 'di ';
		if(itLanguageManager.prototype.endsWithPreposition(predicateLabel))
			postLabel = ' ';

		if(itLanguageManager.prototype.startsWithVerb(predicateLabel)){

			verbalization.standard.push('che ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push(postLabel);

			verbalization.modified.push('');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push(postLabel);

			verbalization.negated.push('che ');
			verbalization.negated.push('non ');
			verbalization.negated.push('');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push(postLabel);

			verbalization.optional.push('che ');
			verbalization.optional.push('opzionalmente ');
			verbalization.optional.push('');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push(postLabel);

			verbalization.truncated.push('');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push(postLabel);

			verbalization.first.push(' che ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push(postLabel);

			verbalization.focus.push(predicateLabel);

		}else{
			verbalization.standard.push('che &egrave; ');
			verbalization.standard.push(predicateLabel + ' ');
			verbalization.standard.push(postLabel);

			verbalization.modified.push('');
			verbalization.modified.push(predicateLabel + ' ');
			verbalization.modified.push(postLabel);

			verbalization.negated.push('che ');
			verbalization.negated.push('non ');
			verbalization.negated.push('&egrave; ');
			verbalization.negated.push(predicateLabel + ' ');
			verbalization.negated.push(postLabel);

			verbalization.optional.push('che ');
			verbalization.optional.push('opzionalmente ');
			verbalization.optional.push('&egrave; ');
			verbalization.optional.push(predicateLabel + ' ');
			verbalization.optional.push(postLabel);

			verbalization.truncated.push('&egrave; ');
			verbalization.truncated.push(predicateLabel + ' ');
			verbalization.truncated.push(postLabel);

			verbalization.first.push(' che &egrave; ');
			verbalization.first.push(predicateLabel + ' ');
			verbalization.first.push(postLabel);

			verbalization.focus.push(predicateLabel);
		}
	}
	
	verbalization.current = verbalization.standard;

	return verbalization;

}

itLanguageManager.prototype.verbalizeSomething = function(){

	verbalization = {
		standard: ['qualcosa '],
		focus: ['qualcosa'],
		current: ['qualcosa ']};

	return verbalization;

}

itLanguageManager.prototype.verbalizeEverything = function(){

	verbalization = {
		standard: [' tutto ci&ograve; '],
		first: [' tutto ci&ograve; '],
		focus: [' tutto ci&ograve; '],
		current: [' tutto ci&ograve; ']};

	return verbalization;

}

itLanguageManager.prototype.getOrdinalNumber = function(cardinalNumber){
	var ordinalNumber = '';
	
	switch(cardinalNumber){
		/*case 1 : ordinalNumber = '1st'; break;
		case 2 : ordinalNumber = '2nd'; break;
		case 3 : ordinalNumber = '3rd'; break;*/
		default : ordinalNumber = cardinalNumber+'&ordm;'; break;
	}

	return ordinalNumber;
}

itLanguageManager.prototype.endsWithPreposition = function(label){
	/*var preposition = ["On", "For", "From", "A", "Of", "As", "By", 
		" by", " on", " for", "\sfrom", "\sa", "\sof", "\sas"]; 
	for(var i=0; i<preposition.length; i++){
		if(label.endsWith(preposition[i]))
			return true;
	}*/
	return false;
}

itLanguageManager.prototype.verbalizeOperator = function(operator){

	var verbalization = {
		standard: ['che ', operator+' ', ''],
		truncated: ['', operator+' ', ''],
		negated: ['che ', 'non ', '&egrave; ', operator+' ', ''],
		optional : ['che &egrave; ', 'opzionalmente ','', operator+' ', ''],
		focus: []};

	verbalization.current = verbalization.standard;

	switch(operator){
		case '<':
			verbalization.standard = ['che &egrave; ','minore ','di '];
			verbalization.truncated = ['','minore ','di '];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'minore ','di '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'minore ','di '];
			verbalization.focus = ['minore'];
			verbalization.current = verbalization.standard;
			break;
		case '<=':
			verbalization.standard = ['che &egrave; ','minore o uguale ','di '];
			verbalization.truncated = ['','minore o uguale ','di '];
			verbalization.negated = ['che ', 'non ', '&egrave; ','minore o uguale ','di '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '','minore o uguale ','di '];
			verbalization.focus = ['minore o uguale'];
			verbalization.current = verbalization.standard;
			break;
		case '>':
			verbalization.standard = ['che &egrave; ','maggiore ','di '];
			verbalization.truncated = ['','maggiore ','di '];
			verbalization.negated = ['che ', 'non ', '&egrave; ','maggiore ','di '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'maggiore ','di '];
			verbalization.focus = ['maggiore'];
			verbalization.current = verbalization.standard;
			break;
		case '>=':
			verbalization.standard = ['che &egrave; ','maggiore o uguale ','di '];
			verbalization.truncated = ['','maggiore o uguale ','di '];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'maggiore o uguale ','di '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'maggiore o uguale ','di '];
			verbalization.focus = ['maggiore o uguale'];
			verbalization.current = verbalization.standard;
			break;
		case '=':
			verbalization.standard = ['che &egrave; ','uguale ','a '];
			verbalization.truncated = ['','uguale ','a '];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'uguale ','a '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'uguale ','a '];
			verbalization.focus = ['uguale'];
			verbalization.current = verbalization.standard;
			break;
		case 'is string':
			verbalization.standard = ['che &egrave; ','uguale ','a '];
			verbalization.truncated = ['','uguale ','a '];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'uguale ','a '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'uguale ','a '];
			verbalization.focus = ['&egrave;'];
			verbalization.current = verbalization.standard;
			break;
		case 'is url':
			verbalization.standard = ['che &egrave; ','uguale ','a '];
			verbalization.truncated = ['','uguale ','a '];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'uguale ','a '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'uguale ','a '];
			verbalization.focus = ['&egrave;'];
			verbalization.current = verbalization.standard;
			break;
		case 'is date':
			verbalization.standard = ['che &egrave; ','uguale ','a '];
			verbalization.truncated = ['','',''];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'uguale ', 'a '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'uguale ', 'a '];
			verbalization.focus = ['&egrave;'];
			verbalization.current = verbalization.standard;
			break;
		case 'range':
			verbalization.standard = ['che &egrave; ','tra ',''];
			verbalization.truncated = ['','tra ',''];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'tra ',''];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'tra ',''];
			verbalization.focus = ['tra'];
			verbalization.current = verbalization.standard;
			break;
		case 'range date':
			verbalization.standard = ['che &egrave; ','tra ',''];
			verbalization.truncated = ['','tra ',''];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'tra ',''];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'tra ',''];
			verbalization.focus = ['tra'];
			verbalization.current = verbalization.standard;
			break;
		case 'and':	
			verbalization.standard = ['e '];
			verbalization.focus = ['e'];
			verbalization.current = verbalization.standard;
			break;
		case 'or':	
			verbalization.standard = ['o (inclusivo) '];
			verbalization.focus = ['o (inclusivo)'];
			verbalization.current = verbalization.standard;
			break;
		case 'xor':	
			verbalization.standard = ['o (esclusivo) '];
			verbalization.focus = ['o (esclusivo)'];
			verbalization.current = verbalization.standard;
			break;
		case 'not':
			verbalization.standard = ['non '];
			verbalization.focus = ['non'];
			verbalization.current = verbalization.standard;
			break;
		case 'optional':
			verbalization.standard = ['opzionalmente '];
			verbalization.focus = ['opzionalmente'];
			verbalization.current = verbalization.standard;
			break;
		case 'lang':
			verbalization.standard = ['che &egrave; ','in lingua ',''];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'in lingua ',''];
			verbalization.optional = ['che &egrave; ','opzionalmente ', '', 'in lingua ',''];
			verbalization.focus = ['in lingua'];
			verbalization.current = verbalization.standard;
			break;

		case 'before':
			verbalization.standard = ['che &egrave; ','precedente ','a '];
			verbalization.truncated = ['','precedente ','a '];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'precedente ','a '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'precedente ','a '];
			verbalization.focus = ['precedente'];
			verbalization.current = verbalization.standard;
			break;
		case 'after':
			verbalization.standard = ['che &egrave; ','successiva ','a '];
			verbalization.truncated = ['','successiva ','a '];
			verbalization.negated = ['che ', 'non ', '&egrave; ', 'successiva ','a '];
			verbalization.optional = ['che &egrave; ', 'opzionalmente ', '', 'suffessiva ','a '];
			verbalization.focus = ['successiva'];
			verbalization.current = verbalization.standard;
			break;
		case 'starts with':
			verbalization.focus = ['inizia'];
			break;
		case 'ends with':
			verbalization.focus = ['finisce'];
			break;
		case 'contains':
			verbalization.focus = ['contiene'];
			break;

	}

	return verbalization;

}

itLanguageManager.prototype.getDefaultConjunction = function(){
	return 'e ';
}

itLanguageManager.prototype.verbalizeResult = function(result){

	var verbalization = {
		standard: [result+' '],
		current: [result+' '],
		focus: [result]};

	return verbalization;

}

//First part of query verbalization
itLanguageManager.prototype.getQueryStartVerbalization = function(){
	return 'Dammi ';
}

//Initialization of query
itLanguageManager.prototype.getQueryInitialVerbalization = function(){
	return 'Dammi...';
}

itLanguageManager.prototype.getFocusLabel = function(){
	return 'Focus: ';
}

itLanguageManager.prototype.getFocusInitialVerbalization = function(){
	return '-';
}

itLanguageManager.prototype.getTabTitle = function(tabType){
	var title = '';
	switch(tabType){
		case 'concept' : title = 'Concetti'; break;
		case 'predicate' : title = 'Predicati'; break;
		case 'operator' : title = 'Operatori'; break;
		case 'table result' : title = 'Tabella dei risultati'; break;
		case 'settings' : title = 'Impostazioni'; break;
		case 'direct predicate' : title = 'Diretti'; break;
		case 'reverse predicate' : title = 'Inversi'; break;
		case 'help' : title = 'Guida'; break;
	}
	return title;
}

itLanguageManager.prototype.getBoxTitle = function(boxType){
	var title = '';
	switch(boxType){
		case 'result' : title = 'Sostituisci il risultato in focus'; break;
	}
	return title;
}

itLanguageManager.prototype.getInputPlaceholder = function(inputType){
	var placeholder;

	switch(inputType){
		case 'concept' : placeholder = "Cerca un concetto"; break;
		case 'predicate' : placeholder = "Cerca un predicato"; break;
		case 'result' : placeholder = "Cerca un risultato"; break;
	}

	return placeholder;
}

itLanguageManager.prototype.getOperatorLabelVerbalization = function(operator){	
	var label;	

	switch(operator){
		case 'and': 
			label = 'e ';
			break;
		case 'or': 
			label = 'o (inclusivo) ';
			break;
		case 'xor': 
			label = 'o (esclusivo) ';
			break;
		case 'not': 
			label = 'non ';
			break;
		case 'optional': 
			label = 'opzionalmente ';
			break;
		case 'limit': 
			label = '';
			break;
		case '<': 
			label = 'minore ';
			break;
		case '<=': 
			label = 'minore o uguale ';
			break;
		case '>': 
			label = 'maggiore ';
			break;
		case '>=': 
			label = 'maggiore o uguale ';
			break;
		case '=': 
			label = 'uguale ';
			break;
		case 'starts with': 
			label = 'inizia con ';
			break;
		case 'ends with': 
			label = 'finisce con ';
			break;
		case 'contains': 
			label = 'contiene ';
			break;
		case 'lang': 
			label = 'in lingua  ';
			break;
		case 'before': 
			label = 'precedente a ';
			break;
		case 'after': 
			label = 'successiva a ';
			break;
		case 'is string':
		case 'is url':
		case 'is date':
			label = '&egrave;';
			break;
		case 'range':
		case 'range date':
			label = 'tra';
			break;
		default: 
			label = operator;
			break;
	}

	return label;

}

itLanguageManager.prototype.getUserInputHint = function(){	
	return 'Inserisci il tuo valore: ';
}

itLanguageManager.prototype.getButtonLabel = function(button){
	var label;

	switch(button){
		case 'confirm' : 
			label = 'OK';
			break;
		case 'remove':
			label = 'Rimuovi';
			break;
		case 'close':
			label = 'Chiudi';
			break;
		case 'removeFocus': //remove higlighted part of query
			label = 'Rimuovi il focus e le parti relate';
			break;
		case 'confirmUserInput': //confirm user value to complete operator
			label = 'OK';
			break;
		case 'discardButton':
			label = "Cancella l'operatore";
			break;
		case 'visibleFields':
			label = 'Campi visibili';
			break;
		case 'sparqlQuery':
			label = 'Confronta la query in linguaggio naturale con la query SPARQL';
			break;
		case 'saveTable':
			label = 'Salva la tabella dei risultati';
			break;
	}

	return label;
}


itLanguageManager.prototype.startsWithVerb = function(predicateLabel, direction){
	return false;
}


itLanguageManager.prototype.getPredicateVerbalization = function(predicateLabel, direction){
	var label;

	if(itLanguageManager.prototype.startsWithVerb(predicateLabel, direction))
		label = 'che '+ predicateLabel;
	else if(direction == 'direct')
		label =	'che ha '+ itLanguageManager.prototype.getArticle(predicateLabel) + ' ' + predicateLabel; 
	else
		label =	'che &egrave; ' + predicateLabel; 
	
	return label; 
}
/*
itLanguageManager.prototype.getHintOperatorManager = function(about){
	var hint;

	switch(about){
		case 'reusableResult': 
			hint = 'These results are related to the following query: '; break;
	}

	return hint;
}
*/
itLanguageManager.prototype.getSelectTitle = function(select){
 var label; 

 switch(select){
  case 'label lang': label = 'Scegli la lingua delle label'; break;
  case 'system lang': label = 'Scegli la lingua del sistema'; break;
  case 'num concepts': label = 'Cambia il numero di concetti restituiti'; break;
  case 'num predicates': label = 'Cambia il numero di predicati restituiti'; break;
 }

 return label;
}

itLanguageManager.prototype.getHelpGuide = function(){
	var headers = [];

	var overviewObj = {title : 'Overview', content : []};
	overviewObj.content.push('<b>SPLOD</b> ti aiuter&agrave; a usare i LOD (Linked Open Data) e a creare una tabella che potrai usare nei passi successivi.<br>In questa guida troverai degli esempi mostrati passo passo pre creare la tua prima richiesta. EXAMPLE');
	headers.push(overviewObj);

	var boxesObj = {title : 'A cosa hai accesso premendo sui tab dei concetti, predicati, operatori, tabella dei risultati e impostazioni?', content : []};
	boxesObj.content.push('<b>Il tab dei concetti</b> contiene tutti i concetti <i>dichiarati</i> e accessibili dall\'endpoint che hai selezionato al primo passo. I concetti sono i <i>subject</i> o gli <i>object</i> nei dati in formato RDF. IMG');
	boxesObj.content.push('<b>Il tab dei predicati</b> contiene tutti i predicati <i>usati</i> e accessibilidall\'endpoint che hai selezionato al primo passo.IMG con dir e rev pred');
	boxesObj.content.push('<b>Il tab degli operatori</b> ti fornisce la possibilit&agrave; di filtrare i dati.');
	boxesObj.content.push('<b>Il tab della tabella dei risultati</b> ti mostra i risultati della query in formato tabellare e una piccola anteprima sorvolando il numero di righe ottenute. Puoi nascondere alcune colonne restituite per visualizzare al meglio solo i campi che ti interessano.');
	boxesObj.content.push('<b>Il tab delle impostazioni</b> ti fornisce la possibilit&agrave; di <ul><li>cambiare il numero di concetti mostrati,</li><li>cambiare il numero di predicati mostrati,</li><li>cambiare la lingua del sistema,</li><li>cambiare la lingua dei dati restituiti (non colo dei risultati della query, ma anche dei dati contenuti nel resto dell\'interfaccia, se le label sono disponibili nella lingua scelta).</li></ul>');
	headers.push(boxesObj);

	var queryNLObj = {title : 'Query in linguaggio naturale', content : []};
	queryNLObj.content.push('<b>spLOD</b> cerca di verbalizzare le tue interazioni creando la stessa richiesta che avresti posto tu ad un\'altra ppresona.<br>I colori ti guideranno a una piacevole comprensione della richiesta.<br>IMG EXAMPLE<br>ATTENZIONE: se vedi della parole barrate forse le tue interazioni non hanno prodotto una richiesta valida.<br>IMG EXAMPLE<br>');
	headers.push(queryNLObj);

	var focusObj = {title : 'Focus : come funziona', content : []};
	focusObj.content.push('In funzione dell\'elemento in focus <b>spLOD</b> riempir&agrave; tutti i campi e costruir&agrave; la tua richiesta.<br>In funzione delle tue interazioni il focus verr&agrave; aggiornato.<br>In qualsiasi momento potrai cambiare l\'elemento in focus.');
	headers.push(focusObj);

	var querySPARQLObj = {title : 'Query SPARQL', content : []};
	querySPARQLObj.content.push('<b>SPARQL</b> &egrave; il linguaggio standard per le query semantiche sui LOD.<br>In funzione delle tue interazioni <b>spLOD</b> costruir&agrave; automaticamente la query.<br>Puoi imparare qualcosa di pi&ugrave; su SPARQL aprendo la visualizzazione con query affiancate.<br>Cambiando il focus il sistema sottolineer&agrave; la corrispettiva parte nella query.');
	headers.push(querySPARQLObj);

	return headers;

}

itLanguageManager.prototype.getOperatorFieldVerbalization = function(cardinalNumber){
	return itLanguageManager.prototype.getOrdinalNumber(cardinalNumber) + ' operando';
}
