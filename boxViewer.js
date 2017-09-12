
var boxFiller;
var languageManager;
var mapCreator;

function initBoxViewer(){
	boxFiller = new BoxFiller();
	languageManager = new LanguageManager();
	mapCreator = new MapCreator();
}

function fillConcepts(){
	boxFiller.retrieveConcepts(function (concepts){
		renderConcepts(concepts);
	});
}

function updateBoxesFromConcept(conceptUrl, conceptLabel){
	
	boxFiller.updateConceptsFromConcept(conceptUrl, conceptLabel, renderConcepts);
	boxFiller.updatePredicatesFromConcept(conceptUrl, conceptLabel, false, renderPredicates);

}

function fillPredicates(){
	boxFiller.retrievePredicates(function (predicates){
		renderPredicates(predicates);
	});
}

function updateBoxesFromPredicate(predicateUrl, predicateLabel, predicateDirection){

	if(predicateDirection == 'direct'){
		boxFiller.updateConceptsFromDirectPredicate(predicateUrl, predicateLabel, renderConcepts);
	}else{
		boxFiller.updateConceptsFromReversePredicate(predicateUrl, predicateLabel, renderConcepts);
	}
	boxFiller.updatePredicatesFromPredicate(predicateUrl, predicateLabel, predicateDirection, renderPredicates);
}

function renderConcepts(concepts){
	var conceptsList = $("#conceptsList");
	conceptsList.empty();

	$.each(concepts, function(index){
		element = concepts[index];
		var li = $("<li/>")
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.text(element.label)
			.appendTo(conceptsList)
			.on('click', function(){
				updateBoxesFromConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
				mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
			});
	});
}

function renderPredicates(predicates){
	var predicatesList = $("#predicatesList");
	predicatesList.empty();

	var directArray = predicates.directArray;
	var reverseArray = predicates.reverseArray;
	var attributesArray = predicates.attributesArray;
	
	renderAttributes(attributesArray);
	renderDirectPredicates(directArray);
	renderReversePredicates(reverseArray);
	
}

function renderDirectPredicates(directArray){

	var li = $("<li/>")
		.css('backgroundColor', 'yellow')
		.text('Direct predicates')
		.appendTo(predicatesList);

	$.each(directArray, function(index){
		element = directArray[index];
		article = languageManager.getArticle(element.label);
		
		var li = $("<li/>")
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-verb', element.verb)
			.attr('meta-article', element.article)
			.attr('meta-predicateDirection', 'direct') 
			.text(element.verb +" "+ article +" "+ element.label)
			.appendTo(predicatesList)
			.on('click', function(){
				updateBoxesFromPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});
	});
}

function renderReversePredicates(reverseArray){

	var li = $("<li/>")
		.css('backgroundColor', 'yellow')
		.text('Reverse predicates')
		.appendTo(predicatesList);

	$.each(reverseArray, function(index){
		element = reverseArray[index];
		article = languageManager.getArticle(element.label);

		var li = $("<li/>")
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-verb', element.verb)
			.attr('meta-article', element.article)
			.attr('meta-predicateDirection', 'reverse')
			.text(element.verb +" "+ article +" "+ element.label)
			.appendTo(predicatesList)
			.on('click', function(){
				updateBoxesFromPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});
	});
}

function renderAttributes(attributesArray){

	var li = $("<li/>")
		.css('backgroundColor', 'yellow')
		.text('Attributes')
		.appendTo(predicatesList);

	$.each(attributesArray, function(index){
		element = attributesArray[index];
		article = "";
		article = languageManager.getArticle(element.label);

		var li = $("<li/>")
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.text(element.label)
			.appendTo(predicatesList)
			.on('click', function(){
				boxFiller.selectedAttribute($(this).attr('meta-url'), $(this).attr('meta-label'));
			});
	});
}



