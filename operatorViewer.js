
var operatorManager;
var languageManager;

function initOperatorViewer(){
	operatorManager = new OperatorManager;
	languageManager = new LanguageManager;
}

function renderResult(select, labelSelect, results){

	//fill result box & result table
	//console.log(results);
	createTable(select, labelSelect, results);

}

function renderOperatorList(operators){

	$('#pendingQuerySpan').empty();
	var operatorList = $('#operatorList');
	operatorList.empty();
	$('#operatorList').show();
	$('#reusableResultList').hide();

	$.each(operators, function(index){
		var element = operators[index];

		var li = $("<li/>")
		.attr('class', 'collection-item')
		.attr('meta-value', element);

		if(element == 'is string' || element == "is url")
			li.text('is');
		else
			li.text(element);

		li.appendTo(operatorList)
			.on('click', function(){
				if(!operatorManager.selectedOperator($(this).attr('meta-value'))){
					var reusableResults = operatorManager.getResultToCompleteOperator();
					renderReusableResultList(reusableResults);
				}
			});
	});

}

function renderReusableResultList(reusableResults){

	var operatorList = $('#operatorList').hide();

	var reusableResultList = $('#reusableResultList');
	reusableResultList.empty();
	reusableResultList.show();

	renderPendingQuery();

	//reusableResults.blankNode is the type of reusable result
	if(reusableResults.type != null){
		var userInput = $("<li/>")
			.attr('class', 'collection-item');

		var input = $("<input/>")
			.attr('type', reusableResults.type)
			.on('keyup', function(){
				operatorManager.selectedReusableResult(this.value);
			})
			.appendTo(userInput);

		userInput.appendTo(reusableResultList);
	}
	
	$.each(reusableResults.results, function(index){
		var element = reusableResults.results[index];

		var li = $("<li/>")
		.attr('class', 'collection-item')
		.attr('meta-label', element.value)
		.attr('meta-value', element.value)
		.text(element.value);


		if('url' in element){
			li.attr('meta-url', element.url)
				.attr('meta-value', element.url)
				.attr('title', element.url);
		}

		var badge = $("<span/>")
			.attr('class', 'new badge')
			.attr('data-badge-caption', '')
			.text(element.occurrences)
			.appendTo(li);

		li.appendTo(reusableResultList)
			.on('click', function(){
				if(operatorManager.selectedReusableResult($(this).attr('meta-value'))){
					$('#reusableResultList').hide();
					$('#operatorList').show();
					$('#pendingQuerySpan').empty();
				}else{
					console.log('not complete');
					renderPendingQuery();
				}
			});
	});

}


function renderPendingQuery(){
	$('#pendingQuerySpan').empty();

	var pendingQueryFields = operatorManager.getPendingQueryFields();

	var pendingQuery = $("<span/>");

	pendingQueryFields[1] = languageManager.getOperatorStandardVerbalization(pendingQueryFields[1])[0];
	console.log(pendingQueryFields);
	for(var i = 0; i<pendingQueryFields.length; i++){
		if(pendingQueryFields[i] != ' ')
			pendingQuery.html(pendingQuery.html()+pendingQueryFields[i]+' ');
		else{
			var toComplete = $("<span/>")
				.text('_____________')
				.attr('class', 'fieldToComplete');
			toComplete.appendTo(pendingQuery);
		}
	}

	pendingQuery.appendTo($('#pendingQuerySpan'));

	var toHightlight = $('#pendingQuerySpan .fieldToComplete:first');
	toHightlight.attr('class', toHightlight.attr('class') + ' active');


	var discardButton = $('<i/>')
		.attr('class', 'small material-icons blue-text')
		.attr('id', 'discardButton')
		.attr('title', 'Discard operator')
		.text('highlight_off')
		.on('click', function(){
			operatorManager.discardOperator();
			$('#pendingQuerySpan').empty();
			$('#operatorList').show();
			$('#reusableResultList').hide();
		});

	discardButton.appendTo($('#pendingQuerySpan'));
}