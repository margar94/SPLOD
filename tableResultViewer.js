var languageManager;
var cachedFieldsToHide;

function initTableResultViewer(){
	cachedFieldsToHide = [];
	languageManager = new LanguageManager();

	$('#tableResultSpinner').hide();

	$('.dropdown-button').dropdown({
	      inDuration: 300,
	      outDuration: 225,
	      constrainWidth: false, // Does not change width of dropdown to that of the activator
	      hover: true, // Activate on hover
	      gutter: 0, // Spacing from edge
	      belowOrigin: true, // Displays dropdown below the button
	      alignment: 'left', // Displays dropdown with edge aligned to the left of button
	      stopPropagation: false, // Stops event propagation
	    }
	  );
}

function resetResultTable(){
	$('#resultsTable').empty();
	$('#previewTableResult').empty();
	$('#tableResultSpinner').hide();
}

function resetFieldsList(){
	$('#fieldsCollection').empty();
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

		var fieldCheck = $("<input/>")
			.attr('type', 'checkbox')
			.attr('id', labelSelect[field].className)
			.attr('name', 'visibleFields')
			.appendTo(li)
			.on('click', manageFields);

		if(($.inArray(labelSelect[field].className,cachedFieldsToHide))<0)
			fieldCheck.attr('checked', 'checked');

		var label = $("<label/>")
			.attr('for', labelSelect[field].className)
			.text(labelSelect[field].label)
			.appendTo(li);

	}

}

function manageFields(){
	cachedFieldsToHide = [];
	var fieldsToHide = $("input:checkbox[name=visibleFields]:not(:checked)");
	$.each(fieldsToHide, function(index){
		$('.'+fieldsToHide[index].id).hide();
		cachedFieldsToHide.push(fieldsToHide[index].id);
	});
	var fieldsToShow = $("input:checkbox[name=visibleFields]:checked");
	$.each(fieldsToShow, function(index){
		$('.'+fieldsToShow[index].id).show();
	});

}

function createTable(select, labelSelect, results){


	var previewTable = $("#previewTableResult")
	previewTable.empty();
	var previewThead = $("<thead/>");

	var resultsTable = $('#resultsTable');
	resultsTable.empty();
	var thead = $("<thead/>");

	var tr = $("<tr/>");
	var previewTr = $("<tr/>");	
	for(field in labelSelect){
		var th = $("<th/>")
			.attr('class', labelSelect[field].className)
			.text(labelSelect[field].label)
			.appendTo(tr);

		var previewTh = $("<th/>")
			.text('label')
			.appendTo(previewTr);
	}
	tr.appendTo(thead);
	thead.appendTo(resultsTable);

	previewTr.appendTo(previewThead);
	previewThead.appendTo(previewTable);

	var tbody = $("<tbody/>");
	var previewTbody = $("<tbody/>");
	
	$.each(results, function(index){
		var element = results[index];
		var tr = $("<tr/>");
		var previewTr = $("<tr/>");

		for(var i=0; i<select.length; i++) {
			var field = select[i].substring(1);
			
			if(field in element){
				var td = $("<td/>")
					.text(element[field].value)
					.attr('class', labelSelect[i].className)
					.appendTo(tr);

				var previewTd = $("<td/>")
					.html("<hr>")
					.appendTo(previewTr);
					
				if(element[field].type == 'uri'){
					td.attr('title', element[field].url);
					if(isImage(element[field].url)){
						td.text(' ');
						var img = $("<img/>")
							.attr('width', '200px')
							.attr('src', element[field].url)
							.appendTo(td);

						previewTd.css('background-color', '#2196F3');
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

				var previewTd = $("<td/>")
					.text("")
					.appendTo(previewTr);
			}
		}
		tr.appendTo(tbody);
		if(index < 100){
			previewTr.appendTo(previewTbody);
		}
	});

	tbody.appendTo(resultsTable);
	previewTbody.appendTo(previewTable);

	$.each(cachedFieldsToHide, function(index){
		$('.'+cachedFieldsToHide[index]).hide();
	});

	$('#tableResultSpinner').hide();

	//<link href='Materialize/css/materialize.min.css' rel='stylesheet'><link href='splod_style.css' rel='stylesheet'> table, tr,th {border: 1px black solid;}
	
	//"<html><head><link href='Materialize/css/materialize.min.css' rel='stylesheet'><style>hr{border-style: solid;border-width: 8px !important;}</style></head><body><div style='-webkit-transform:scale(1,0.05);-webkit-transform-origin:0 0'>"+previewTable[0].outerHTML+"</div></body></html>"
	//$('#previewTableResult').html(previewTable[0].outerHTML );
	//$('#previewTableResult').attr('src', '#resultsTable');
	//console.log($('#previewTableResult'));
}