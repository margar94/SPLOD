
	function initResultViewer(){
		/*boxFiller = new BoxFiller();
		queryVerbalizator = new QueryVerbalizator();
		languageManager = new LanguageManager();*/
	}
	
	function renderResult(results){

		//fill result box & result table
		console.log(results);
		createTable(results);

	}

	function createTable(results){

		var resultsTable = $('#resultsTable');
		resultsTable.empty();
/*
		//check if there are results
		var tr = $("<tr/>");
		for(field in results){
			var th = $("<th/>")
				.text(field)
				.appendTo(tr);
		}
		tr.appendTo(resultsTable);

		$.each(results, function(index){
			element = concepts[index];
			var tr = $("<tr/>");

			for(field in element){
				var td = $("<td/>")
					.text(field)
					.appendTo(tr);
			}
			tr.appendTo(resultsTable);
				//.text(element.label);

		});

*/
		var tr = $("<tr/>");
		for(field in results[0]){
			var th = $("<th/>")
				.text(field)
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
			}
			tr.appendTo(resultsTable);
		});
	}