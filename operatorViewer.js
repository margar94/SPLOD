
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


	//user value
	var type = reusableResults.type;

	if(type != null){

		var userInput = $("<li/>")
			.attr('class', 'collection-item');

		//retrieve the type
		var inputClass;
		switch(type){
			case 'date' :
				inputClass = ['datepicker'];
				break;
			case 'time' :
				inputClass = ['timepicker'];
				break;
			case 'dateTime' :
				inputClass = ['datepicker', 'timepicker'];
				break;
			case 'text' :
				inputClass = ['text'];
				break;
			case 'number' :
				inputClass = ['number'];
				break;
		}

		for(var i = 0; i<inputClass; i++){

			var div = $('<div/>')
				.attr('class', 'input-field');

			var input = $("<input/>")
				.attr('type', 'text')
				.attr('class', inputClass[i])
				.attr('id', 'userValue_'+[i]);

			var label = $('<label/>')
				.attr('for', 'userValue_'+[i])
				.text('Insert your value: ');

			
			input.appendTo(div);
			label.appendTo(div);

			div.appendTo(userInput);
		}

		var button = $('<i/>')
			.attr('class', 'small material-icons blue-text')
			.attr('id', 'userValueButton')
			.attr('title', 'Confirm value')
			.text('check_circle')
			.on('click', function(){
				operatorManager.selectedReusableResult(this.value);
			});

		button.appendTo(userInput);
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