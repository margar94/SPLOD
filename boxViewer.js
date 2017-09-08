
	var boxFiller;
	var queryVerbalizer;
	var languageManager;
	
	function initBoxViewer(){
		boxFiller = new BoxFiller();
		queryVerbalizator = new QueryVerbalizator();
		languageManager = new LanguageManager();
	}

	function fillConcepts(){
		boxFiller.retrieveConcepts(function (concepts){
			renderConcepts(concepts);
		});
	}
	
	function fillPredicates(){
		boxFiller.retrievePredicates(function (predicates){
			renderPredicates(predicates);
		});
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
					boxFiller.updateConcepts($(this).attr('meta-url'), $(this).attr('meta-label'), renderConcepts);
					boxFiller.updatePredicatesFromConcept($(this).attr('meta-url'), $(this).attr('meta-label'), false, renderPredicates);
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
					//disabilita i concetti

					boxFiller.updatePredicatesFromPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'), renderPredicates);
				});
		});
	}

	function renderReversePredicates(reverseArray){
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
					boxFiller.updateConceptsFromReversePredicate($(this).attr('meta-url'), $(this).attr('meta-label'), renderConcepts);
					boxFiller.updatePredicatesFromPredicate($(this).attr('meta-url'), $(this).attr('meta-label'), $(this).attr('meta-predicateDirection'), renderPredicates);
				});
		});
	}

	function renderAttributes(attributesArray){

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
					//disabilita i concetti
					console.log($(this).attr('meta-url'));
					boxFiller.selectedAttribute($(this).attr('meta-url'), $(this).attr('meta-label'));
				});
		});
	}



