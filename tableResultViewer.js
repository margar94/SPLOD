
function initTableResultViewer(){
}

function renderResultTable(select, labelSelect, results){

	createTable(select, labelSelect, results);

}

function createTable(select, labelSelect, results){
	//console.log(results);

	var resultsTable = $('#resultsTable');
	resultsTable.empty();
	var thead = $("<thead/>");

	var tr = $("<tr/>");
	for(field in labelSelect){
		var th = $("<th/>")
			//.css('text-align', 'center')
			.text(labelSelect[field])
			.appendTo(tr);
	}
	tr.appendTo(thead);
	thead.appendTo(resultsTable);

	var tbody = $("<tbody/>");
	
	$.each(results, function(index){
		var element = results[index];
		var tr = $("<tr/>");

		for(var i=0; i<select.length; i++) {
			var field = select[i].substring(1);
			
			if(field in element){
				var td = $("<td/>")
					.text(element[field].value)
					.appendTo(tr);
					
				if(element[field].type == 'uri'){
					td.attr('title', element[field].url);
					if(isImage(element[field].url)){
						td.text(' ');
						var img = $("<img/>")
							.attr('width', '200px')
							.attr('src', element[field].url)
							.appendTo(td);
					}
					else{
						var a = $("<a/>")
							.attr('href', element[field].url)
							.appendTo(td);

						/*var img = $("<img/>")
							.attr('src', 'img/ic_open_in_new_black_24dp_2x.png')
							.attr('class', 'imgResult')
							.appendTo(a);*/

						var icon = $("<i class='material-icons tiny red-text'>")
							.text('open_in_new')
							//.attr('class', 'imgResult')
							.appendTo(a);
					}
				}
			}else{
				var td = $("<td/>")
					.text("")
					.appendTo(tr);
			}
		}
		tr.appendTo(tbody);
	});
	tbody.appendTo(resultsTable);
}