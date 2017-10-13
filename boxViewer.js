
var boxFiller;
var languageManager;
var mapCreator;

var hierarchyOnFlag;

var lastMap;
var lastRootMap;

function initBoxViewer(){
	boxFiller = new BoxFiller();
	languageManager = new LanguageManager();
	mapCreator = new MapCreator();

	hierarchyOnFlag = true;
	$("#hierarchySpan").html('<i class="small material-icons white-text right" style="margin:0" onClick="hierarchyOff();">format_list_bulleted</i>');
}

function fillConcepts(){
	boxFiller.retrieveConcepts(function (rootMap, map){
		lastMap = map;
		lastRootMap = rootMap;
		renderConcept(rootMap, map);
	});
}

function updateBoxesFromConcept(conceptUrl, conceptLabel){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');
	
	boxFiller.updateConceptsFromConcept(conceptUrl, conceptLabel, renderConcept);
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
		boxFiller.updateConceptsFromDirectPredicate(predicateUrl, predicateLabel, renderConcept);
	}else{
		boxFiller.updateConceptsFromReversePredicate(predicateUrl, predicateLabel, renderConcept);
	}
	boxFiller.updatePredicatesFromPredicate(predicateUrl, predicateLabel, predicateDirection, renderPredicates);
}

function renderConcept(rootMap, map){
	lastRootMap = rootMap;
	lastMap = map;
	if(hierarchyOnFlag)
		renderConceptsHierarchy(rootMap, map);
	else
		renderConceptsList(rootMap, map);
}

function renderConceptsList(roots, concepts){
	var conceptsList = $("#conceptsList");
	conceptsList.empty();
	conceptsList.attr('class', 'collection');

	var orderedKeys = Object.keys(concepts).sort(function(a,b){
		var x = concepts[a].label.toLowerCase();
	    var y = concepts[b].label.toLowerCase();
	    return x < y ? -1 : x > y ? 1 : 0;
	});

	for(var i=0; i<orderedKeys.length; i++){
		var concept = concepts[orderedKeys[i]];

		if(concept.numberOfInstances != 0){
			var li = $("<li/>")
				.attr('class', 'collection-item addToQuery')
				.attr('title', concept.url)
				.attr('meta-url', concept.url)
				.attr('meta-label', concept.label)
				.text(concept.label)
				.appendTo(conceptsList)		
				.on('click', function(){
					mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
				});
			
			var badge = $("<span/>")
				.attr('class', 'new badge')
				.attr('data-badge-caption', '')
				.text(concept.numberOfInstances)
				.appendTo(li);
		}
	}
}

function renderConceptsHierarchy(roots, concepts){
	var conceptsList = $("#conceptsList");
	conceptsList.empty();
	conceptsList.attr('class', 'collapsible');
	conceptsList.attr('data-collapsible', 'expandable');

	for(var i=0; i<roots.length; i++)
		iterativePreorderVisit(roots[i], concepts, conceptsList);

	$('.collapsible').collapsible();
}

function iterativePreorderVisit(concept, concepts, toAppend){
	if(concepts[concept].numberOfInstances != 0){
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
	}

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

function renderDirectPredicates(directMap){

	var directPredicatesList = $("#directPredicatesList");
	directPredicatesList.empty();

	for(key in directMap){
		element = directMap[key];
		
		var li = $("<li/>")
			.attr('class', 'collection-item addToQuery')
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-predicateDirection', 'direct') 
			.text(languageManager.getPredicateVerbalization(element.label, 'direct'))
			.appendTo(directPredicatesList)
			.on('click', function(){
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});

		/*var badge = $("<span/>")
			.attr('class', 'new badge')
			.attr('data-badge-caption', '')
			.text(element.numberOfInstances)
			.appendTo(li);*/
	}
}

function renderReversePredicates(reverseArray){

	var reversePredicatesList = $("#reversePredicatesList");
	reversePredicatesList.empty();

	$.each(reverseArray, function(index){
		element = reverseArray[index];

		var li = $("<li/>")
			.attr('class', 'collection-item addToQuery')
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-predicateDirection', 'reverse')
			.text(languageManager.getPredicateVerbalization(element.label, 'reverse'))
			.appendTo(reversePredicatesList)
			.on('click', function(){
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});

		/*var badge = $("<span/>")
			.attr('class', 'new badge')
			.attr('data-badge-caption', '')
			.text(element.numberOfInstances)
			.appendTo(li);*/
	});
}

function updateBoxesFromOperator(operator){
	$("#conceptsList").empty();
	$("#directPredicatesList").empty();	
	$("#reversePredicatesList").empty();	
}

function updateBoxesFromResult(){
	$("#conceptsList").empty();
	$("#directPredicatesList").empty();	
	$("#reversePredicatesList").empty();	
}

function hierarchyOff(){
	hierarchyOnFlag = false;
	$("#hierarchySpan").html('<i class="small material-icons white-text right" style="margin:0" onClick="hierarchyOn();">device_hub</i>');
	renderConcept(lastRootMap, lastMap);
}

function hierarchyOn(){
	hierarchyOnFlag = true;
	$("#hierarchySpan").html('<i class="small material-icons white-text right" style="margin:0" onClick="hierarchyOff();">format_list_bulleted</i>');
	renderConcept(lastRootMap, lastMap);
}