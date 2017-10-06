
var operatorManager;

function initOperatorViewer(){
	operatorManager = new OperatorManager;
}

function renderResult(select, labelSelect, results){

	//fill result box & result table
	//console.log(results);
	createTable(select, labelSelect, results);

}

function renderOperatorList(operators){
	console.log(operators);

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
				operatorManager.selectedOperator($(this).attr('meta-value'));
				if(!operatorManager.isComplete()){
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

	if(reusableResults.blankNode != null){
		var blankNode = $("<li/>")
			.attr('class', 'collection-item');

		var input = $("<input/>")
			.attr('type', reusableResults.blankNode)
			.on('keyup', function(){
				operatorManager.selectedReusableResult(this.value);
			})
			.appendTo(blankNode);

		blankNode.appendTo(reusableResultList);
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
				operatorManager.selectedReusableResult($(this).attr('meta-value'));
				if(operatorManager.isComplete()){
					$('#reusableResultList').hide();
					$('#operatorList').show();
				}
				//range to manage
			});
	});

}