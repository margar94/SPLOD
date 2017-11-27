var cachedFieldsToHide;

var resultsToConvert;
var labels;
var datatypeInfo;

function initTableResultViewer(){
	cachedFieldsToHide = [];

	resultsToConvert = {records:[], querySPARQL:""};

	$('#tableResultSpinner').hide();
	$('#resultsPreviewBadge').text('0');
	$('#resultsPreviewBadge').show();
	$('#tableResultsProgress').hide();
	$('#resultsTable').show();
	$("#saveTable").addClass('disabled');

	//$('#visibleFieldsButton').text(languageManager.getButtonLabel('visibleFields'));

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
	$('#resultsTable').show();
	$('#tableResultsProgress').hide();
	$('#resultsPreviewBadge').text('0');
	$('#resultsPreviewBadge').show();
	$("#saveTable").addClass('disabled');
}

function resetFieldsList(){
	$('#fieldsCollection').empty();
}

function renderResultTable(select, labelSelect, results){

	labels = createTableLabel(select, labelSelect);
	createFieldsSelectionList(labels);
	createTable(select, labels, results);

}

function createTableLabel(select, labelSelect){
	var labels = [];
	var stringSelect = select.join(' ');
	var labelObj = {};

	for(var i=0; i<labelSelect.length; i++){
		var splittedSelect = select[i].split('_');
		var cardinalNumber = parseInt(splittedSelect[splittedSelect.length-1]);
		labelObj = {label : languageManager.getOrdinalNumber(cardinalNumber) + " " +labelSelect[i], className : select[i].split('?')[1]};
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
			.html(labelSelect[field].label)
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
			.html(labelSelect[field].label)
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

	resultsToConvert = {};
	var recordsObj = [];
	
	$.each(results, function(index){
		var element = results[index];
		var tr = $("<tr/>");
		var previewTr = $("<tr/>");

		var newElement = {};

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

						previewTd.css('background-color', '#01579b');
					}
					else{
						var a = $("<a/>")
							.attr('href', element[field].url)
							.attr('target', '_blank')
							.appendTo(td);

						var icon = $("<i class='material-icons tiny red-text'>")
							.text('open_in_new')
							.appendTo(a);
					}
				}

				newElement[labels[i].label] = element[field].value;
				if('url' in element[field]){
					if(!isImage(element[field].url))
						newElement[labels[i].label+' url'] = element[field].url;
					else
						newElement[labels[i].label] = element[field].url;
				}
				if('xml:lang' in element[field]){
					newElement[labels[i].label+' lang'] = element[field]['xml:lang'];
				}


			}else{
				var td = $("<td/>")
					.text("")
					.appendTo(tr);

				var previewTd = $("<td/>")
					.text("")
					.appendTo(previewTr);

				newElement[labels[i].label] = null;
			}
		}

		tr.appendTo(tbody);
		if(index < 100){
			previewTr.appendTo(previewTbody);
		}

		recordsObj.push(newElement);
	});

	tbody.appendTo(resultsTable);
	previewTbody.appendTo(previewTable);

	resultsToConvert.records = recordsObj;
	addFieldsToJSON();

	$.each(cachedFieldsToHide, function(index){
		if($.inArray("?"+cachedFieldsToHide[index], select)<0)
			cachedFieldsToHide.splice(index, 1);
		else
			$('.'+cachedFieldsToHide[index]).hide();
	});

	$('#tableResultSpinner').hide();
	$('#tableResultsProgress').hide();
	$('#resultsTable').show();
	
	var resultPreviewNumber = results.length;
	/*if(resultPreviewNumber>=1000)
		resultPreviewNumber = '999+';
	*/
	if(resultPreviewNumber == 0)
		$("#saveTable").addClass('disabled');
	else $("#saveTable").removeClass('disabled');


	$('#resultsPreviewBadge').text(resultPreviewNumber);
	$('#resultsPreviewBadge').show();

	//<link href='Materialize/css/materialize.min.css' rel='stylesheet'><link href='splod_style.css' rel='stylesheet'> table, tr,th {border: 1px black solid;}
	
	//"<html><head><link href='Materialize/css/materialize.min.css' rel='stylesheet'><style>hr{border-style: solid;border-width: 8px !important;}</style></head><body><div style='-webkit-transform:scale(1,0.05);-webkit-transform-origin:0 0'>"+previewTable[0].outerHTML+"</div></body></html>"
	//$('#previewTableResult').html(previewTable[0].outerHTML );
	//$('#previewTableResult').attr('src', '#resultsTable');
	//console.log($('#previewTableResult'));
}

function saveDatatype(keySelect, datatype){
	datatypeInfo = {};
	datatypeInfo.keySelect = keySelect;
	datatypeInfo.datatype = datatype;
}

function addFieldsToJSON(){
	
	resultsToConvert.fields = [];
	for(field in resultsToConvert.records[0]){
		var tempField = {};
		tempField.id = field;

		var simpleLabels = [];
		for(var i = 0; i < labels.length; i++){
			simpleLabels.push(labels[i].label);
		}
		var index = $.inArray(field, simpleLabels);

		if(index < 0){
			tempField.type = "text";
		}else{
			if(datatypeInfo.datatype[datatypeInfo.keySelect[index]].length>1)
				tempField.type = "text";
			else{
				switch(datatypeInfo.datatype[datatypeInfo.keySelect[index]]){
					case 'img' : 
					case 'uri':
					case 'gMonth':
					case 'gDay':
					case 'gMonthDay':
					case 'gYearMonth':
					case 'date':
					case 'dateTime':
					case 'time':
					case 'boolean':
					case 'literal':
					case 'boolean': 
					case 'string':
						tempField.type = "text";
						break;
					
					case 'gYear':
					case 'number':
						tempField.type = "numeric";
						break;

					default : 
						//check if first is numeric (but if the other are string?)
						if($.isNumeric(resultsToConvert.records[0][field]))
							tempField.type = "numeric";
						else tempField.type = "text";
						break;
				}
			}
		}
		resultsToConvert.fields.push(tempField);
	}

	//console.log(resultsToConvert);
}


function createJson(){
	//add other fields
	var query = "";
	$.each(cachedUserQuery, function(index){
		if($.type(cachedUserQuery[index]) === 'object')
			query += cachedUserQuery[index].content.join(' ') + " ";
		else
			query += cachedUserQuery[index] + " ";
	});
	resultsToConvert.querySPARQL = query;

	
	var jsonObj = JSON.stringify(resultsToConvert);

	document.dispatchEvent(new CustomEvent("event_name", {"detail": jsonObj}));

	
	/* 
	$.ajax({
	   type: "POST",
	   url: "buildJson.php", 
	   data: jsonObj,      
	   success: function() {} 
	});*/
}