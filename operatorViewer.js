
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
	var operatorList = $('#operatorList');
	operatorList.empty();
	$('#operatorList').show();
	$('#reusableResultList').hide();

	$.each(operators, function(index){
		var element = operators[index];

		var li = $("<li/>")
		.attr('class', 'collection-item')
		.attr('meta-value', element)
		.text(element)
		.appendTo(operatorList)
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

	$.each(reusableResults, function(index){
		var element = reusableResults[index];

		var li = $("<li/>")
		.attr('class', 'collection-item')
		.attr('meta-label', element.value)
		.text(element.value)
		.appendTo(reusableResultList)
		.on('click', function(){
			console.log("vmfdjbvjhfvb");
		});
	});

}