var visibleFields;

function initTableResultViewer(){
	visibleFields = [];
}

function resetResultTable(){
	$('#resultsTable').empty();
}

function resetFieldsList(){
	$('#resultsTable').empty();
}

function renderResultTable(select, labelSelect, results){

	var labels = createTableLabel(select, labelSelect);
	createFieldsSelectionList(labels);
	createTable(select, labels, results);

}

function createTableLabel(select, labelSelect){
	var labels = [];
	var stringSelect = select.join(' ');

console.log(stringSelect);

	for(var i=0; i<labelSelect.length; i++){
	console.log(labelSelect[i]);
		var re = new RegExp("\?"+labelSelect[i]+"_", "g");
	console.log(re);
		var matches = stringSelect.match(re);
		if(matches==null || matches.length==1){
			labels.push(labelSelect[i]);
		}
		else{
			labels.push(select[i].split('?')[1]);
		}
	}
	return labels;
}

function createFieldsSelectionList(labelSelect){
	var fieldsCollection = $('#fieldsCollection');
	fieldsCollection.empty();

	for(field in labelSelect){
		var li = $("<li/>")
			.attr('class', 'collection-item withMargin')
			.appendTo(fieldsCollection);

		var input = $("<input/>")
			.attr('type', 'checkbox')
			.attr('id', labelSelect[field])
			.attr('value', labelSelect[field])
			.attr('checked', 'checked')
			.attr('name', 'visibleFields')
			.appendTo(li)
			.on('click', manageFields);

		var label = $("<label/>")
			.attr('for', labelSelect[field])
			.text(labelSelect[field])
			.appendTo(li);

	}

}

function manageFields(){
	var fieldsToHide = $("input:checkbox[name=visibleFields]:not(:checked)");
	$.each(fieldsToHide, function(index){
		$('.'+fieldsToHide[index].id).hide();
	});
	var fieldsToShow = $("input:checkbox[name=visibleFields]:checked");
	$.each(fieldsToShow, function(index){
		$('.'+fieldsToShow[index].id).show();
	});
}

function createTable(select, labelSelect, results){
	//console.log(results);

	var resultsTable = $('#resultsTable');
	resultsTable.empty();
	var thead = $("<thead/>");

	var tr = $("<tr/>");
	for(field in labelSelect){
		var th = $("<th/>")
			.attr('class', labelSelect[field])
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
					//to change
					.attr('class', field.split('_')[0])
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