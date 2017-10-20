
var operatorManager;
var languageManager;

function initOperatorViewer(){
	operatorManager = new OperatorManager;
	languageManager = new LanguageManager;
}

function renderResult(select, labelSelect, results){
	createTable(select, labelSelect, results);
}

function renderOperatorList(operators){

	//$('#operatorsBox .card-title').text(languageManager.getBoxTitle('operator'));

	$('#pendingQuerySpan').empty();
	var operatorList = $('#operatorList');
	operatorList.empty();
	$('#operatorList').show();
	$('#reusableResultList').hide();

	for(var i = 0; i<operators.length; i++){
		var datatypeOperators = operators[i];
		var datatype = datatypeOperators.datatype;
		var datatypeOperatorList = datatypeOperators.list;

		for(var j = 0; j<datatypeOperatorList.length;j++){
			var li = $("<li/>")
			.attr('class', 'collection-item addToQuery')
			.attr('meta-value', datatypeOperatorList[j])
			.attr('meta-datatype', datatype)
			.text(languageManager.getOperatorLabelVerbalization(datatypeOperatorList[j]));

			li.appendTo(operatorList)
				.on('click', function(){
					if(!operatorManager.selectedOperator($(this).attr('meta-value'), $(this).attr('meta-datatype'))){
						$('#operatorsSpinner').show();
						var reusableResults = operatorManager.getResultToCompleteOperator();
						renderReusableResultListFromOperator(reusableResults);
					}
					else{
						$('#tableResultSpinner').show();
					}
				});
		}
		if(i != operators.length)
			$("<hr/>").appendTo(operatorList);
	}

	/*$.each(operators, function(index){
		var element = operators[index];

		var li = $("<li/>")
		.attr('class', 'collection-item addToQuery')
		.attr('meta-value', element)
		.text(languageManager.getOperatorLabelVerbalization(element));

		li.appendTo(operatorList)
			.on('click', function(){
				if(!operatorManager.selectedOperator($(this).attr('meta-value'))){
					$('#operatorsSpinner').show();
					var reusableResults = operatorManager.getResultToCompleteOperator();
					renderReusableResultListFromOperator(reusableResults);
				}
				else{
					$('#tableResultSpinner').show();
				}
			});
	});*/

	$('#operatorsSpinner').hide();

}

function renderReusableResultListFromOperator(reusableResults){
	var onClickButtonFunction = function(){
					var values = [];
					values.push($('#userValue_0')[0].value);
					if($('#userValue_1')[0] != undefined)
						values.push($('#userValue_1')[0].value);

					if(operatorManager.selectedReusableResult(values, true)){
						$('#reusableResultList').hide();
						$('#operatorList').show();
						$('#pendingQuerySpan').empty();
						$('#tableResultSpinner').show();
					}else{
						renderPendingQuery();
					}

				}


	var onClickLiFunction = function(){
					if(operatorManager.selectedReusableResult([$(this).attr('meta-value')], false)){
						$('#reusableResultList').hide();
						$('#operatorList').show();
						$('#pendingQuerySpan').empty();
						$('#tableResultSpinner').show();
					}else{
						renderPendingQuery();
					}
				}

	renderPendingQuery();
	renderReusableResultList(reusableResults, onClickButtonFunction, onClickLiFunction);
}

function renderReusableResultListFromResult(reusableResults){
	var onClickButtonFunction = function(){
					var values = [];
					values.push($('#userValue_0')[0].value);
					if($('#userValue_1')[0] != undefined)
						values.push($('#userValue_1')[0].value);

					$('#tableResultSpinner').show();
					operatorManager.changedReusableResult(values, true);
				}


	var onClickLiFunction = function(){
					$('#tableResultSpinner').show();
					operatorManager.changedReusableResult([$(this).attr('meta-value')], false);
				}

	renderReusableResultList(reusableResults, onClickButtonFunction, onClickLiFunction);
}

function renderReusableResultList(reusableResults, onClickButtonFunction, onClickLiFunction){

	var operatorList = $('#operatorList').hide();

	//change box title
	$('#operatorsBox .card-title')
		.text(languageManager.getBoxTitle('result'));

	var iconWarning = $('<i/>')
		.attr('class', 'small material-icons') 
		.text('warning')
		.attr('title', languageManager.getReusableResultWarning())
		.appendTo($('#operatorsBox .card-title'));

	var reusableResultList = $('#reusableResultList');
	reusableResultList.empty();
	reusableResultList.show();

	//renderPendingQuery();

	//user value
	var type = reusableResults.type;

	if(type != null){

		var userInput = $("<li/>")
			.attr('class', 'collection-item');

		var userInputDiv = $("<div/>")
			.attr('class', 'row')
			.attr('id', 'rowUserValue');
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

		for(var i = 0; i<inputClass.length; i++){

			var div = $('<div/>')
				.attr('class', 'input-field userValueDiv col s10 m10 l10');

			var input = $("<input/>")
				.attr('type', 'text')
				.attr('class', inputClass[i]+' userValue')
				.attr('id', 'userValue_'+[i]);

			var label = $('<label/>')
				.attr('for', 'userValue_'+[i])
				.text(languageManager.getUserInputHint());

			
			input.appendTo(div);
			label.appendTo(div);

			div.appendTo(userInputDiv);
		}

		var button = $('<i/>')
			.attr('class', 'small material-icons blue-text')
			.attr('id', 'userValueButton')
			.attr('title', languageManager.getButtonLabel('confirmUserInput'))
			.text('check_circle')
			.on('click', onClickButtonFunction);

		button.appendTo(userInputDiv);
		userInputDiv.appendTo(userInput);
		userInput.appendTo(reusableResultList);

		$('input.number').on('keypress', function(evt){
			var charCode = (evt.which) ? evt.which : event.keyCode;
		    if (charCode > 31 && (charCode < 48 || charCode > 57))
		        return false;
		    return true;
		});

		$('.datepicker').pickadate({
			selectMonths: true,
			selectYears: 100,
			max: 'Today',
			today: 'Today',
			clear: 'Clear',
			close: 'OK',
			closeOnSelect: true,
			format: 'yyyy-mm-dd'
		});

		$('.timepicker').pickatime({
		    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
		    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
		    twelvehour: true, // Use AM/PM or 24-hour format
		    donetext: 'OK', // text for done-button
		    cleartext: 'Clear', // text for clear-button
		    canceltext: 'Cancel', // Text for cancel-button
		    autoclose: true, // automatic close timepicker
		    ampmclickable: true, // make AM PM clickable
		  });

	}

	$.each(reusableResults.results, function(index){
		var element = reusableResults.results[index];

		var li = $("<li/>")
		.attr('class', 'collection-item addToQuery')
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
			.on('click', onClickLiFunction);
	});

	$('#operatorsSpinner').hide();

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
		.attr('title', languageManager.getButtonLabel('discardButton'))
		.text('highlight_off')
		.on('click', function(){
			operatorManager.discardOperator();
			$('#pendingQuerySpan').empty();
			$('#operatorList').show();
			$('#reusableResultList').hide();
		});

	discardButton.appendTo($('#pendingQuerySpan'));
}