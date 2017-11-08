
var boxFiller;
var languageManager;
var mapCreator;

var hierarchyOnFlag;

var lastMap;
var lastRootMap;

/*
	To get all label's lang : 

	prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
	SELECT DISTINCT ?lang
	WHERE {
	?s rdfs:label ?label. 
	BIND (lang(?label) AS ?lang)
	}ORDER BY ?lang
*/
var labelLangList = [{langCode : 'ar'}, 
					 {langCode : 'be'},
					 {langCode : 'bg'},
					 {langCode : 'bn'},
					 {langCode : 'ca'},
					 {langCode : 'cs'},
					 {langCode : 'de'},
					 {langCode : 'el'},
					 {langCode : 'en'},
					 {langCode : 'es'},
					 {langCode : 'eu'},
					 {langCode : 'fr'},
					 {langCode : 'ga'},
					 {langCode : 'gl'},
					 {langCode : 'hi'},
					 {langCode : 'hy'},
					 {langCode : 'in'},
					 {langCode : 'it'},
					 {langCode : 'ja'},
					 {langCode : 'ko'},
					 {langCode : 'kr'},
					 {langCode : 'lv'},
					 {langCode : 'nl'},
					 {langCode : 'pl'},
					 {langCode : 'pt'},
					 {langCode : 'ro'},
					 {langCode : 'ru'},
					 {langCode : 'sk'},
					 {langCode : 'sl'},
					 {langCode : 'sr'},
					 {langCode : 'tr'},
					 {langCode : 'zh'}];

var systemLangList = [{langCode : 'en'}];

var conceptsLimit;
var predicatesLimit;

function initBoxViewer(){
	boxFiller = new BoxFiller();
	languageManager = new LanguageManager();
	mapCreator = new MapCreator();

	$('#operatorsSpinner').hide();

	hierarchyOnFlag = true;
	$("#hierarchySpan").html('<i class="small material-icons white-text right" style="margin:0" onClick="hierarchyOff();">format_list_bulleted</i>');

	$("#conceptsTabTitle").html(languageManager.getTabTitle('concept'));
	$("#predicatesTabTitle").html(languageManager.getTabTitle('predicate'));
	$("#operatorsTabTitle").html(languageManager.getTabTitle('operator'));
	$("#tableResultTabTitle").html(languageManager.getTabTitle('table result'));
	$("#settingsTabTitle").html(languageManager.getTabTitle('settings'));
	$("#helpTabTitle").html(languageManager.getTabTitle('help'));
	$("#directPredicateTabTitle").html(languageManager.getTabTitle('direct predicate'));
	$("#reversePredicateTabTitle").html(languageManager.getTabTitle('reverse predicate'));

	$("#conceptsBoxTitle").html(languageManager.getBoxTitle('concept'));
	$("#predicatesBoxTitle").html(languageManager.getBoxTitle('predicate'));
	$("#operatorsBoxTitle").html(languageManager.getBoxTitle('operator'));
	$("#tableResultBoxTitle").html(languageManager.getBoxTitle('table result'));
	$("#settingsBoxTitle").html(languageManager.getBoxTitle('settings'));
	$("#helpBoxTitle").html(languageManager.getTabTitle('help'));

	$("#hintBox").hide();

	$("#labelLangSelectLabel").html(languageManager.getSelectTitle('label lang'));
	$("#systemLangSelectLabel").html(languageManager.getSelectTitle('system lang'));
	$("#numConceptsLabel").html(languageManager.getSelectTitle('num concepts'));
	$("#numPredicatesLabel").html(languageManager.getSelectTitle('num predicates'));

	placeholder="Search for a concept..."
	$("#searchConceptsBox").attr("placeholder", languageManager.getInputPlaceholder('concept'));
	$("#searchPredicatesBox").attr("placeholder", languageManager.getInputPlaceholder('predicate'));
	$("#searchReusableResultsBox").attr("placeholder", languageManager.getInputPlaceholder('result'));
	$("#searchReusableResultCard").hide();

	conceptsLimit = 500;
	predicatesLimit = 100;

	fillConcepts();
	fillPredicates();
	fillSettings();
	fillHelp();
}

//get and render concepts
function fillConcepts(){
	$('#conceptsSpinner').show();
	boxFiller.retrieveConcepts(conceptsLimit, function (rootMap, map){
		lastMap = map;
		lastRootMap = rootMap;
		renderConcept(rootMap, map);
	});
}

function updateBoxesFromConcept(conceptUrl){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');
	
	$('#conceptsSpinner').show();
	$('#predicatesSpinner').show();

	boxFiller.updateConceptsFromConcept(conceptUrl, conceptsLimit, renderConcept);
	
	boxFiller.updatePredicatesFromConcept(conceptUrl, predicatesLimit, renderPredicates);
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
				.appendTo(conceptsList)		
				.on('click', function(){
					$('#operatorsSpinner').show();
					$('#tableResultSpinner').show();
					mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
				});

			var span = $('<span/>')
				.attr('class', 'liContent')
				.text(concept.label)
				.appendTo(li);

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
			.attr('class', 'liContent')
			.attr('title', concepts[concept].url)
			.attr('meta-url', concepts[concept].url)
			.attr('meta-label', concepts[concept].label)
			.text(concepts[concept].label)
			.css('margin-left', '0.5em')
			.appendTo(li)
			.on('click', function(){
				$('#operatorsSpinner').show();
				$('#tableResultSpinner').show();
				mapCreator.selectedConcept($(this).attr('meta-url'), $(this).attr('meta-label'));
			});
		
	var badge;
	if(concepts[concept].numberOfInstances == 0){
		//not the first interaction
		badge = $("<i/>")
			.attr('class', 'tiny material-icons right conceptInfo')
			.html('info')
			.attr('meta-url', concepts[concept].url)
			.appendTo(li)
			.on('click', function(evt){
				boxFiller.getConceptStats($(this).attr('meta-url'), function(numberOfInstances){
					var badge = $("<span/>")
						.attr('class', 'new badge')
						.attr('data-badge-caption', '')
						.text(numberOfInstances);

					$(evt.target).replaceWith(badge);
				});
			});
	}else{
		badge = $("<span/>")
		.attr('class', 'new badge')
		.attr('data-badge-caption', '')
		.text(concepts[concept].numberOfInstances)
		.appendTo(li);
	}
		
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

//get and render predicates
function fillPredicates(){
	$('#predicatesSpinner').show();
	boxFiller.retrievePredicates(predicatesLimit, function (predicates){
		renderPredicates(predicates);
	});
}

function updateBoxesFromDirectPredicate(predicateUrl){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');

	$('#conceptsSpinner').show();
	$('#predicatesSpinner').show();

	boxFiller.updateConceptsFromDirectPredicate(predicateUrl, conceptsLimit, renderConcept);
	boxFiller.updatePredicatesFromDirectPredicate(predicateUrl, predicatesLimit, renderPredicates);
}

function updateBoxesFromReversePredicate(){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');

	$("#conceptsList").empty();
	$("#directPredicatesList").empty();	
	$("#reversePredicatesList").empty();		
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
			.attr('class', 'addToQuery liContent')
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-predicateDirection', 'direct') 
			.text(languageManager.getPredicateVerbalization(element.label, 'direct'))
			.css('margin-left', '0.5em')
			.appendTo(li)
			.on('click', function(){
				$('#operatorsSpinner').show();
				$('#tableResultSpinner').show();
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});

		var info = $("<i/>")
			.attr('class', 'tiny material-icons right predicateInfo')
			.html('info')
			.attr('meta-url', element.url)
			.appendTo(li)
			.on('click', function(evt){
				boxFiller.getPredicateStats($(this).attr('meta-url'), function(numberOfInstances){
					console.log(numberOfInstances);
					var badge = $("<span/>")
						.attr('class', 'new badge')
						.attr('data-badge-caption', '')
						.text(numberOfInstances);

					$(evt.target).replaceWith(badge);
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
			.attr('class', 'collection-item addToQuery withMargin liContent')
			.attr('title', element.url)
			.attr('meta-url', element.url)
			.attr('meta-label', element.label)
			.attr('meta-predicateDirection', 'reverse')
			.text(languageManager.getPredicateVerbalization(element.label, 'reverse'))
			.appendTo(reversePredicatesList)
			.on('click', function(){
				$('#operatorsSpinner').show();
				$('#tableResultSpinner').show();
				mapCreator.selectedPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'));
			});

		/*var badge = $("<span/>")
			.attr('class', 'new badge')
			.attr('data-badge-caption', '')
			.text(element.numberOfInstances)
			.appendTo(li);*/
	});
}

//manage update boxes when focus is on 'something' node
function updateBoxesFromSomething(predicateUrl){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');

	$('#conceptsSpinner').show();
	$('#predicatesSpinner').show();

	boxFiller.updateConceptsFromSomething(predicateUrl, conceptsLimit, renderConcept);
	boxFiller.updatePredicatesFromSomething(predicateUrl, predicatesLimit, renderPredicates);	
}

//manage update boxes when focus is on an operator
function updateBoxesFromOperator(){
	$("#conceptsList").empty();
	$("#directPredicatesList").empty();	
	$("#reversePredicatesList").empty();	
}

//manage update boxes when focus is on an result
function updateBoxesFromResult(resultUrl, resultDatatype, resultLang){
	$("#searchConceptsBox").val('');
	$("#searchPredicatesBox").val('');

	$("#conceptsList").empty();
	
	$('#predicatesSpinner').show();	
	boxFiller.updatePredicatesFromResult(resultUrl, resultDatatype, resultLang, predicatesLimit, renderPredicates);
}

//manage settings
function fillSettings(){
	fillLabelLang();
	fillSystemLang();
	fillNumberOfConceptsAndPredicates();
}

function fillLabelLang(){
	var labelLangSelect = $('#labelLangSelect');

	$.each(labelLangList, function(langKey){
		var lang = labelLangList[langKey];
		var option = $("<option/>")
			.attr('value', lang.langCode)
			.text(lang.langCode)
			.appendTo(labelLangSelect);
	});

	$('#labelLangSelect option[value="'+labelLang+'"]').attr('selected', 'selected');

	$('#labelLangSelect').material_select();
}

function fillSystemLang(){
	var systemLangSelect = $('#systemLangSelect');

	$.each(systemLangList, function(langKey){
		var lang = systemLangList[langKey];
		var option = $("<option/>")
			.attr('value', lang.langCode)
			.text(lang.langCode)
			.appendTo(systemLangSelect);
	});

	$('#systemLangSelect option[value="'+systemLang+'"]').attr('selected', 'selected');

	$('#systemLangSelect').material_select();
}

function fillNumberOfConceptsAndPredicates(){
	if(conceptsLimit)
		$('#numConcepts').attr('placeholder', conceptsLimit);
	if(predicatesLimit)
		$('#numPredicates').attr('placeholder', predicatesLimit);
}

function changeLabelLanguage(){
	labelLang = $('#labelLangSelect').find(":selected").val();
	
	initBoxViewer();
	initQueryViewer();
	initOperatorViewer();
	initTableResultViewer();
}

function setLimit(type){
	if(type == 'concept')
		conceptsLimit = $('#numConcepts').val();
	else if(type == 'predicate')
		predicatesLimit = $('#numPredicates').val();
}

function changeSystemLanguage(){
	systemLang = $('#systemLangSelect').find(":selected").val();

	initBoxViewer();
	initQueryViewer();
	initOperatorViewer();
	initTableResultViewer();
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

function fillHelp(){
	var helpUl = $('#helpUl');
	var helpContent = languageManager.getHelpGuide();

	for(var i = 0; i<helpContent.length; i++){

		var li = $('<li/>');

		var titleDiv = $('<div/>')
			.attr('class', 'collapsible-header')
			.text(helpContent[i].title)
			.appendTo(li);

		var contentDiv = $('<div/>')
			.attr('class', 'collapsible-body')
			.appendTo(li);

		var carouselDiv = $('<div/>')
			.attr('class', 'carousel carousel-slider myCarousel-'+i)
			//.attr('data-indicators', 'true')
			.appendTo(contentDiv);

			

		for(var j = 0; j < helpContent[i].content.length; j++){
			var contentCarouselDiv = $('<div/>')
				.attr('class', 'carousel-item')
				.css('background-color', 'white')
				.html('<p>'+helpContent[i].content[j]+'</p>')
				//.css('display', 'none')
				.appendTo(carouselDiv);
		}

		if(helpContent[i].content.length != 1){

			var leftArrow = $('<div/>')
					.attr('class', 'carousel-fixed-item left-align ')
					.html('<i class="material-icons">chevron_left</i>')
					.attr('meta-carousel-index', i)
					.css('cursor', 'pointer')
					.css('top', '0')
					.on('click', function(e){
						$('.myCarousel-'+$(this).attr('meta-carousel-index')).carousel('prev');})
					.appendTo(carouselDiv);

			var rightArrow = $('<div/>')
					.attr('class', 'carousel-fixed-item right-align')
					.html('<i class="material-icons">chevron_right</i>')
					.attr('meta-carousel-index', i)
					.css('cursor', 'pointer')
					.css('top', '0')
					.css('margin-left', '50%')
					.on('click', function(e){
						$('.myCarousel-'+$(this).attr('meta-carousel-index')).carousel('next');})
					.appendTo(carouselDiv);	
		}
		/*if(helpContent[i].content.length != 1){

			var ulPag = $('<ul/>')
				.attr('class', 'pagination')
				//.html('<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>')
				.appendTo(contentDiv);

			for(var j = 0; j < helpContent[i].content.length; j++){
				var liPag = $('<li/>')
					.attr('class', 'waves-effect')
					.appendTo(ulPag);
				var a = $('<a/>')
					.text(j+1)
					.appendTo(liPag);

				if(j==0)
					liPag.attr('class', 'active')
			}
			
		}*/

		li.appendTo(helpUl);

	}

	$('.carousel.carousel-slider').carousel({fullWidth: true});
}

//delete highlighted element in natural language query
function removeHighlightElements(keyToRemove){
	$('#tableResultSpinner').show();
	if(keyToRemove != 'undefined')
		mapCreator.removeElement(keyToRemove);
}