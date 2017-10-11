
var boxFiller;
var languageManager;
var mapCreator;

function initBoxViewer(){
	boxFiller = new BoxFiller();
	languageManager = new LanguageManager();
	mapCreator = new MapCreator();
}

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

function renderConceptsHierarchy(roots, concepts){
	var conceptsList = $("#conceptsList");
	conceptsList.empty();

	for(var i=0; i<roots.length; i++)
		iterativePreorderVisit(roots[i], concepts, conceptsList);

	$('.collapsible').collapsible();
}

function iterativePreorderVisit(concept, concepts, toAppend){
	
	var li = $("<li/>")
		.appendTo(toAppend);

	var collapsibleheader = $("<div/>")
		.attr('class', 'collapsible-header active')
		.appendTo(li);

	var headercontent = $("<span/>")
		.attr('class', 'addToQuery')
		.attr('title', concept)
		.attr('meta-url', concept)
		.attr('meta-label', concepts[concept].label)
		.text(concepts[concept].label)
		.appendTo(collapsibleheader)
		.on('click', function(){
			mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
		});
		
	var badge = $("<span/>")
		.attr('class', 'new badge')
		.attr('data-badge-caption', '')
		.text(concepts[concept].numberOfInstances)
		.appendTo(collapsibleheader);

	var children = concepts[concept].children;
	if(children.length!=0){
		var collapsiblebody = $("<div/>")
			.attr('class', 'collapsible-body')
			.appendTo(li);
		var ul = $("<ul/>")		
			.attr('class', 'collapsible')
			.attr('data-collapsible','expandable')
			.appendTo(collapsiblebody);
		for(var i=0; i<children.length; i++){
			iterativePreorderVisit(children[i], concepts, ul);
		}		
	}
}

function renderPredicates(predicates){
	/*var predicatesList = $("#predicatesList");
	predicatesList.empty();*/

	var directArray = predicates.directArray;
	var reverseArray = predicates.reverseArray;
	
	renderDirectPredicates(directArray);
	renderReversePredicates(reverseArray);
	
}

function renderDirectPredicates(directArray){

	var directPredicatesList = $("#directPredicatesList");
	directPredicatesList.empty();

	$.each(directArray, function(index){
		element = directArray[index];
		
		var li = $("<li/>")
			.attr('class', 'collection-item')
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-predicateDirection', 'direct') 
			.text(languageManager.getPredicateVerbalization(element.label, 'direct'))
			.appendTo(directPredicatesList)
			.on('click', function(){
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});
	});
}

function renderReversePredicates(reverseArray){

	var reversePredicatesList = $("#reversePredicatesList");
	reversePredicatesList.empty();

	$.each(reverseArray, function(index){
		element = reverseArray[index];

		var li = $("<li/>")
			.attr('class', 'collection-item')
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-predicateDirection', 'reverse')
			.text(languageManager.getPredicateVerbalization(element.label, 'reverse'))
			.appendTo(reversePredicatesList)
			.on('click', function(){
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});
	});
}

function updateBoxesFromOperator(operator){
	$("#conceptsList").empty();
	$("#directPredicatesList").empty();	
	$("#reversePredicatesList").empty();	
}