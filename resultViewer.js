
	function initResultViewer(){
		/*boxFiller = new BoxFiller();
		queryVerbalizator = new QueryVerbalizator();
		languageManager = new LanguageManager();*/
	}
	
	function renderResult(select, labelSelect, results){

		//fill result box & result table
		//console.log(results);
		createTable(select, labelSelect, results);

	}

	function createTable(select, labelSelect, results){

		var resultsTable = $('#resultsTable');
		resultsTable.empty();

		var tr = $("<tr/>");
		for(field in labelSelect){
			var th = $("<th/>")
				.text(labelSelect[field])
				.appendTo(tr);
		}
		tr.appendTo(resultsTable);


		$.each(results, function(index){
			var element = results[index];
			var tr = $("<tr/>");

			for(field in element) {
				var td = $("<td/>")
					.text(element[field].value)
					.appendTo(tr);
					
				if('url' in element[field])
					td.attr('title', element[field].url);
			}
			tr.appendTo(resultsTable);
		});
	}