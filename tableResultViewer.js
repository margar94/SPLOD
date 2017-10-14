var visibleFields;
var languageManager;

function initTableResultViewer(){
	visibleFields = [];
	languageManager = new LanguageManager();
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
	var labelObj = {};

	for(var i=0; i<labelSelect.length; i++){
		var re = new RegExp("\\?"+labelSelect[i]+"_", "g");
		var matches = stringSelect.match(re);
		if(matches==null || matches.length==1){
			labelObj = {label : labelSelect[i], className : labelSelect[i].replace(/[ ]/g, "_")};
		}
		else{
			var splittedSelect = select[i].split('_');
			var cardinalNumber = parseInt(splittedSelect[splittedSelect.length-1]);
			labelObj = {label : languageManager.getOrdinalNumber(cardinalNumber) + " " +labelSelect[i], className : select[i].split('?')[1].replace(/[ ]/g, "_")};
		}
		labels.push(labelObj);
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
			.attr('id', labelSelect[field].className)
			.attr('checked', 'checked')
			.attr('name', 'visibleFields')
			.appendTo(li)
			.on('click', manageFields);

		var label = $("<label/>")
			.attr('for', labelSelect[field].className)
			.text(labelSelect[field].label)
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
			.attr('class', labelSelect[field].className)
			.text(labelSelect[field].label)
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
					.attr('class', labelSelect[i].className)
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

						var icon = $("<i class='material-icons tiny red-text'>")
							.text('open_in_new')
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