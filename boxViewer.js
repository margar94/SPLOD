
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

	$('#operatorsSpinner').hide();

	hierarchyOnFlag = true;
	$("#hierarchySpan").html('<i class="small material-icons white-text right" style="margin:0" onClick="hierarchyOff();">format_list_bulleted</i>');
}

function fillConcepts(){
	$('#conceptsSpinner').show();
	boxFiller.retrieveConcepts(function (rootMap, map){
		lastMap = map;
		lastRootMap = rootMap;
		renderConcept(rootMap, map);
	});
}

function updateBoxesFromConcept(conceptUrl, conceptLabel){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');
	
	$('#conceptsSpinner').show();
	$('#predicatesSpinner').show();
	$('#operatorsSpinner').show();

	boxFiller.updateConceptsFromConcept(conceptUrl, conceptLabel, renderConcept);
	
	boxFiller.updatePredicatesFromConcept(conceptUrl, conceptLabel, false, renderPredicates);
}

function fillPredicates(){
	$('#predicatesSpinner').show();
	boxFiller.retrievePredicates(function (predicates){
		renderPredicates(predicates);
	});
}

function updateBoxesFromPredicate(predicateUrl, predicateLabel, predicateDirection){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');

	$('#conceptsSpinner').show();
	$('#predicatesSpinner').show();
	$('#operatorsSpinner').show();

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

	$('#conceptsSpinner').hide();
}

function renderConceptsList(roots, concepts){
	var conceptsList = $("#conceptsList");
	conceptsList.empty();

	var orderedKeys = Object.keys(concepts).sort(function(a,b){
		var x = concepts[a].label.toLowerCase();
	    var y = concepts[b].label.toLowerCase();
	    return x < y ? -1 : x > y ? 1 : 0;
	});

	for(var i=0; i<orderedKeys.length; i++){
		var concept = concepts[orderedKeys[i]];

		if(concept.numberOfInstances != 0){
			var li = $("<li/>")
				.attr('class', 'collection-item addToQuery withMargin')
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

	for(var i=0; i<roots.length; i++)
		iterativePreorderVisit(roots[i], concepts, conceptsList, 0);
}

function iterativePreorderVisit(concept, concepts, toAppend, level){
	var children = concepts[concept].children;

	var childrenLevel=level+1;

	var li = $("<li/>")
		.attr('class', 'collection-item addToQuery withMargin')
		.css('margin-left', level*2+0.1+'em')
		.appendTo(toAppend);

	if(children.length>0){
		var expandableIcon = $("<i/>")
			.attr('class', 'tiny material-icons grey-text')
			.html('expand_less')
			.appendTo(li);
	}

	var span = $("<span/>")
			.attr('title', concepts[concept].url)
			.attr('meta-url', concepts[concept].url)
			.attr('meta-label', concepts[concept].label)
			.text(concepts[concept].label)
			.css('margin-left', '0.5em')
			.appendTo(li)
			.on('click', function(){
				mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
			});
		
	var badge = $("<span/>")
		.attr('class', 'new badge')
		.attr('data-badge-caption', '')
		.text(concepts[concept].numberOfInstances)
		.appendTo(li);
		
	if(children.length>0){
		var div = $("<div/>")
			.attr('class', 'myCollapsibleBody')
			.appendTo(toAppend);

		li.on('click', function(){
			if($(this).next().is(':visible')){
				$(this).next().hide();
				expandableIcon.html('expand_more');
			}
			else{
				$(this).next().show();
				expandableIcon.html('expand_less');
			}
		});

		for(var i=0; i<children.length; i++){
			iterativePreorderVisit(children[i], concepts, div, childrenLevel);
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

	$('#predicatesSpinner').hide();
	
}

function renderDirectPredicates(directMap){

	var directPredicatesList = $("#directPredicatesList");
	directPredicatesList.empty();

	for(key in directMap){
		element = directMap[key];
		
		var li = $("<li/>")
			.attr('class', 'collection-item withMargin')
			.attr('id', element.url + "item")
			.appendTo(directPredicatesList);

		var span = $("<span/>")
			.attr('title', element.url)
			.attr('class', 'addToQuery')
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-predicateDirection', 'direct') 
			.text(languageManager.getPredicateVerbalization(element.label, 'direct'))
			.css('margin-left', '0.5em')
			.appendTo(li)
			.on('click', function(){
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});

		var info = $("<i/>")
			.attr('class', 'tiny material-icons right predicateInfo')
			.html('info')
			.attr('meta-url', element.url)
			.appendTo(li)
			.on('click', function(){
				boxFiller.getPredicateStats($(this).attr('meta-url'), function(numberOfInstances){
					console.log(numberOfInstances);

					//manage stats
				});
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
			.attr('class', 'collection-item addToQuery withMargin')
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
	$('#conceptsSpinner').show();
	hierarchyOnFlag = false;
	$("#hierarchySpan").html('<i class="small material-icons white-text right" style="margin:0" onClick="hierarchyOn();">device_hub</i>');
	renderConcept(lastRootMap, lastMap);
}

function hierarchyOn(){
	$('#conceptsSpinner').show();
	hierarchyOnFlag = true;
	$("#hierarchySpan").html('<i class="small material-icons white-text right" style="margin:0" onClick="hierarchyOff();">format_list_bulleted</i>');
	renderConcept(lastRootMap, lastMap);
}