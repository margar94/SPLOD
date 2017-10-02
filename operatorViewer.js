
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
		var operatorList = $.('#operatorList');
		operatorList.empty();

		$.each(operators, function(index){
			var element = operators[index];

			var li = $("<li/>")
			.attr('class', 'collection-item')
			.attr('meta-value', element)
			.text(element)
			.appendTo(operatorList)
			.on('click', function(){
				operatorManager.selectedOperator($(this).attr('meta-value'));
			});
		});

	}