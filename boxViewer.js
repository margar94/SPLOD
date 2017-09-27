
var boxFiller;
var languageManager;
var mapCreator;

function initBoxViewer(){
	boxFiller = new BoxFiller();
	languageManager = new LanguageManager();
	mapCreator = new MapCreator();
}

//first filling, map returned
function fillConcepts(){
	boxFiller.retrieveConcepts(function (rootMap, map){
		renderConceptsHierarchy(rootMap, map);
	});
}

function updateBoxesFromConcept(conceptUrl, conceptLabel){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');
	
	boxFiller.updateConceptsFromConcept(conceptUrl, conceptLabel, renderConceptsHierarchy);
	boxFiller.updatePredicatesFromConcept(conceptUrl, conceptLabel, false, renderPredicates);

}

function fillPredicates(){
	boxFiller.retrievePredicates(function (predicates){
		renderPredicates(predicates);
	});
}

function updateBoxesFromPredicate(predicateUrl, predicateLabel, predicateDirection){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');

	if(predicateDirection == 'direct'){
		boxFiller.updateConceptsFromDirectPredicate(predicateUrl, predicateLabel, renderConceptsHierarchy);
	}else{
		boxFiller.updateConceptsFromReversePredicate(predicateUrl, predicateLabel, renderConceptsHierarchy);
	}
	boxFiller.updatePredicatesFromPredicate(predicateUrl, predicateLabel, predicateDirection, renderPredicates);
}
/*
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
}*/
/*
function renderConceptsHierarchy(rootMap, concepts){
	var conceptsList = $("#conceptsList");
	conceptsList.empty();

	for(concept in concepts){
		//console.log(concept);
		var li = $("<li/>")
			.attr('title', concept)
			.attr('meta-url', concept)
			.attr('meta-label', concepts[concept].label)
			.text(concepts[concept].label)
			.appendTo(conceptsList)
			.on('click', function(){
				updateBoxesFromConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
				mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
			});
	}

	while(elementStack.length!=0){
		currentElement = elementStack.pop();
		submap[currentElement] = classHierarchyMap[currentElement];

		children = classHierarchyMap[currentElement].children;

		for(var i=0; i<children.length; i++)
			elementStack.push(children[i]);
	}

	
}*/
function renderConceptsHierarchy(roots, concepts){
	var conceptsList = $("#conceptsList");
	conceptsList.empty();
	for(var i=0; i<roots.length; i++)
		iterativePreorderVisit(roots[i], concepts, conceptsList);
}

function iterativePreorderVisit(concept, concepts, toAppend){
	var li = $("<li/>")
		.attr('class', 'collection-item')
		.attr('title', concept)
		.attr('meta-url', concept)
		.attr('meta-label', concepts[concept].label)
		.text(concepts[concept].label)
		.appendTo(toAppend)
		.on('click', function(){
			updateBoxesFromConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
			mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
		});

	var children = concepts[concept].children;
	if(children.length!=0){
		var ul = $("<ul/>")		
			//.attr('class', 'collection')
			.appendTo(li);
		for(var i=0; i<children.length; i++){
			iterativePreorderVisit(children[i], concepts, ul);
		}		
	}
}


function renderPredicates(predicates){
	var predicatesList = $("#predicatesList");
	predicatesList.empty();

	var directArray = predicates.directArray;
	var reverseArray = predicates.reverseArray;
	var attributesArray = predicates.attributesArray;
	
	//renderAttributes(attributesArray);
	renderDirectPredicates(directArray);
	renderReversePredicates(reverseArray);
	
}

function renderDirectPredicates(directArray){

	var li = $("<li/>")
		.css('backgroundColor', 'orange')
		.text('Direct predicates')
		.appendTo(predicatesList);

	$.each(directArray, function(index){
		element = directArray[index];
		article = languageManager.getArticle(element.label);
		
		var li = $("<li/>")
			.attr('class', 'collection-item')
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
		.css('backgroundColor', 'orange')
		.text('Reverse predicates')
		.appendTo(predicatesList);

	$.each(reverseArray, function(index){
		element = reverseArray[index];
		article = languageManager.getArticle(element.label);

		var li = $("<li/>")
			.attr('class', 'collection-item')
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
/*
function renderAttributes(attributesArray){

	var li = $("<li/>")
		.css('backgroundColor', 'orange')
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
}*/



