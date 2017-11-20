var languageManager;
var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;
var queryString;

var resultQuery;

var mapCreator;

var onFocus;

var addBarred;

function initQueryViewer(){
	$("#queryNaturalLanguage")[0].innerHTML = languageManager.getQueryInitialVerbalization();
	$("#focusLabel")[0].innerHTML = languageManager.getFocusLabel();
	$("#focus")[0].innerHTML = languageManager.getFocusInitialVerbalization();
	$("#querySparqlText").text('');
	$("#querySparqlText").hide();
}

var QueryViewer= function () {
	if(QueryViewer.prototype._singletonInstance){
		return QueryViewer.prototype._singletonInstance;
	}

	mapCreator = new MapCreator();
	languageManager = new LanguageManager();
	queryLogicStructure = {}; 
	visitStack = [];

	cachedResultQuery = {};
	resultQuery = '';

	addBarred = false;

	QueryViewer.prototype._singletonInstance = this;
};

QueryViewer.prototype.updateQuery = function(queryRoot, queryMap, focus){
	visitStack = [];
	queryLogicStructureRoot = queryRoot;
	queryLogicStructure = queryMap;
	onFocus = focus;
	queryString = languageManager.getQueryInitialVerbalization();
	resultQuery = languageManager.getQueryInitialVerbalization();
	addBarred = false;
	renderQuery();
}

function renderQuery(){ 
	if(queryLogicStructureRoot != null){

		queryString = languageManager.getQueryStartVerbalization();
		resultQuery = languageManager.getQueryStartVerbalization();
		queryString += '<span meta-focusReference="limit" meta-removeReference="limit" class="focusable">';
		queryString += '<span id="limit" min="0" meta-focusReference="limit" meta-removeReference="limit" class="focusable operator">';

		if(!resultLimit){
			 queryString += 'every ';
			 resultQuery += '<span>every </span>';
		}
		else{ 
			queryString += '<input id="limitInput" type="number" value="'+resultLimit+'"/>';
			resultQuery += '<span>'+resultLimit+' </span>';
		}
		queryString += '</span>';
		queryString += '</span>';

		var temp = visitRenderer(queryLogicStructureRoot);
		queryString += temp.queryString;
		resultQuery += temp.resultString;
	}

	$("#queryNaturalLanguage")[0].innerHTML = queryString;
	removeFocusable();

	//update box with focus from user
	attachEvents();

	//update box with focus from map
	renderFocus();
}

function visitRenderer(key){
	var node = queryLogicStructure[key];
	var nodeQueryString = "";
	var nodeResultQuery = "";

	switch(node.type){

		case "concept":
			var verbalizationIndex = 0;

			//pre label
			nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.key)+'">';
			nodeQueryString += node.verbalization.current[verbalizationIndex];
			nodeResultQuery += '<span>'+node.verbalization.current[verbalizationIndex++];

			//eventually not or optional
			var parentNode = queryLogicStructure[node.parent];
			if(parentNode != undefined && parentNode.type == "operator" && (parentNode.label == "not" || parentNode.label == "optional")){
				nodeQueryString += '<span class="focusable" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
				nodeQueryString += '<span id="'+encodeURIComponent(parentNode.key)+'" class="focusable operator" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += '<span> <span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span></span>';
				nodeQueryString += '</span>';
				nodeQueryString += '</span>';

				//article
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += node.verbalization.current[verbalizationIndex++]
			}

			//content
			nodeQueryString += '<span id="'+encodeURIComponent(node.key)+'" title="'+node.url+'" class="focusable concept" meta-removeReference="'+encodeURIComponent(node.key)+'" meta-focusReference="'+encodeURIComponent(node.key)+'">';
			nodeQueryString += node.verbalization.current[verbalizationIndex];
			nodeResultQuery += '<span class="concept">'+node.verbalization.current[verbalizationIndex++]+'</span>';
			nodeQueryString += '</span>';

			//post label
			nodeQueryString += node.verbalization.current[verbalizationIndex];
			nodeResultQuery += node.verbalization.current[verbalizationIndex++];

			if(addBarred){
				nodeQueryString += '<span class="barred">';
				nodeResultQuery += '<span class="barred">';
			}

			var addUl;
			(node.children.length >= 2)?addUl = true : addUl = false;


			//children
			if(addUl){
				nodeQueryString += '<ul>'; 
				nodeResultQuery += '<ul>'; 
			}

			for(var i=0; i<node.children.length;i++){
				if(addUl){
					if(i==0 || (i%2)==1){
						nodeQueryString += "<li>";
						nodeResultQuery += "<li>";
					}
				}

				var temp = visitRenderer(node.children[i]);
				nodeQueryString += temp.queryString;
				nodeResultQuery += temp.resultString;

				if(addUl){
					if(i==node.children.length-1 || (i%2)==0){
						nodeQueryString += "</li>";
						nodeResultQuery += "</li>";
					}
				}
			}

			if(addUl){
				nodeQueryString += '</ul>'; 
				nodeResultQuery += '</ul>';
			}

			if(addBarred){
				nodeQueryString += '</span>';
				nodeResultQuery += '</span>';
				addBarred = false;
			}

			nodeQueryString += '</span>';
			nodeResultQuery += '</span>';
			break;

		case "result":
			var verbalizationIndex = 0;

			//pre label
			nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.parent)+'">';
			nodeResultQuery += '<span>';

			//content
			nodeQueryString += '<span id="'+encodeURIComponent(node.key)+'" class="focusable reusableResult" meta-removeReference="'+encodeURIComponent(node.parent)+'" meta-focusReference="'+encodeURIComponent(node.key)+'">';
			nodeQueryString += node.verbalization.current[verbalizationIndex];
			nodeResultQuery += '<span class="reusableResult">'+node.verbalization.current[verbalizationIndex++]+'</span>';
			nodeQueryString += '</span>';

			if(addBarred){
				nodeQueryString += '<span class="barred">';
				nodeResultQuery += '<span class="barred">';
			}

			var addUl;
			(node.children.length >= 2)?addUl = true : addUl = false;

			//children
			if(addUl){
				nodeQueryString += '<ul>'; 
				nodeResultQuery += '<ul>'; 
			}

			for(var i=0; i<node.children.length;i++){
				if(addUl){
					if(i==0 || (i%2)==1){
						nodeQueryString += "<li>";
						nodeResultQuery += "<li>";
					}
				}

				var temp = visitRenderer(node.children[i]);
				nodeQueryString += temp.queryString;
				nodeResultQuery += temp.resultString;

				if(addUl){
					if(i==node.children.length-1 || (i%2)==0){
						nodeQueryString += "</li>";
						nodeResultQuery += "</li>";
					}
				}
			}

			if(addUl){
				nodeQueryString += '</ul>'; 
				nodeResultQuery += '</ul>'; 
			}

			if(addBarred){
				nodeQueryString += '</span>';
				nodeResultQuery += '</span>';
				addBarred = false;
			}

			nodeQueryString += '</span>';
			nodeResultQuery += '</span>';
			break;

		case "everything":
		case "something":
			var verbalizationIndex = 0;
			var metaRemoveReference;
			if(node.type == "everything")
				metaRemoveReference = encodeURIComponent(node.key);
			else if(node.type == "something")
				metaRemoveReference = encodeURIComponent(node.parent);
			

			nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+metaRemoveReference+'">';
			nodeResultQuery += '<span>';

			//content
			nodeQueryString += '<span id="'+encodeURIComponent(node.key)+'" class="focusable specialNode" meta-removeReference="'+metaRemoveReference+'" meta-focusReference="'+encodeURIComponent(node.key)+'">';
			nodeQueryString += node.verbalization.current[verbalizationIndex];
			nodeResultQuery += '<span class="specialNode">'+node.verbalization.current[verbalizationIndex++]+'</span>';
			nodeQueryString += '</span>';

			if(addBarred){
				nodeQueryString += '<span class="barred">';
				nodeResultQuery += '<span class="barred">';
			}

			var addUl;
			(node.children.length >= 2)?addUl = true : addUl = false;

			//children
			if(addUl){
				nodeQueryString += '<ul>';
				nodeResultQuery += '<ul>'; 
			}

			for(var i=0; i<node.children.length;i++){
				if(addUl){
					if(i==0 || (i%2)==1){
						nodeQueryString += "<li>";
						nodeResultQuery += "<li>";
					}
				}

				var temp = visitRenderer(node.children[i]);
				nodeQueryString += temp.queryString;
				nodeResultQuery += temp.resultString;

				if(addUl){
					if(i==node.children.length-1 || (i%2)==0){
						nodeQueryString += "</li>";
						nodeResultQuery += "</li>";
					}
				}
			}

			if(addUl){
				nodeQueryString += '</ul>'; 
				nodeResultQuery += '</ul>'; 
			}

			if(addBarred){
				nodeQueryString += '</span>';
				nodeResultQuery += '</span>';
				addBarred = false;
			}

			nodeQueryString += '</span>';
			nodeResultQuery += '</span>';
			break;

		case "predicate":
			if(node.direction == "direct"){

				var verbalizationIndex = 0;

				//pre label
				nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.key)+'">';
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += '<span>'+node.verbalization.current[verbalizationIndex++];

				//eventually not or optional
				var parentNode = queryLogicStructure[node.parent];
				if(parentNode != undefined && parentNode.type == "operator" && (parentNode.label == "not" || parentNode.label == "optional")){
					nodeQueryString += '<span class="focusable" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
					nodeQueryString += '<span id="'+encodeURIComponent(parentNode.key)+'" class="focusable operator" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += '<span><span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span></span>';
					nodeQueryString += '</span>';
					nodeQueryString += '</span>';

					//article
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += node.verbalization.current[verbalizationIndex++];
				}

				//content
				nodeQueryString += '<span id="'+encodeURIComponent(node.key)+'" title="'+node.url+'" class="focusable predicate" meta-removeReference="'+encodeURIComponent(node.key)+'" meta-focusReference="'+encodeURIComponent(node.key)+'">';
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += '<span class="predicate">'+node.verbalization.current[verbalizationIndex++]+'</span>';
				nodeQueryString += '</span>';

				//post label
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += node.verbalization.current[verbalizationIndex++];

				if(addBarred){
					nodeQueryString += '<span class="barred">';
					nodeResultQuery += '<span class="barred">';
				}

				var addUl;
				(node.children.length >= 2)?addUl = true : addUl = false;


				//children
				if(addUl){
					nodeQueryString += '<ul>'; 
					nodeResultQuery += '<ul>'; 
				}

				for(var i=0; i<node.children.length;i++){
					if(addUl){
						if(i==0 || (i%2)==1){
							nodeQueryString += "<li>";
							nodeResultQuery += "<li>";
						}
					}

					var temp = visitRenderer(node.children[i]);
					nodeQueryString += temp.queryString;
					nodeResultQuery += temp.resultString;

					if(addUl){
						if(i==node.children.length-1 || (i%2)==0){
							nodeQueryString += "</li>";
							nodeResultQuery += "</li>";
						}
					}
				}

				if(addUl){
					nodeQueryString += '</ul>'; 
					nodeResultQuery += '</ul>';
				}

				if(addBarred){
					nodeQueryString += '</span>';
					nodeResultQuery += '</span>';
					addBarred = false;
				}

				nodeQueryString += '</span>';
				nodeResultQuery += '</span>';

			}else if(node.direction == "reverse"){
				var verbalizationIndex = 0;

				//pre label
				nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.key)+'">';
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += '<span>'+node.verbalization.current[verbalizationIndex++];


				//eventually not or optional
				var parentNode = queryLogicStructure[node.parent];
				if(parentNode != undefined && parentNode.type == "operator" && (parentNode.label == "not" || parentNode.label == "optional")){
					nodeQueryString += '<span class="focusable" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
					nodeQueryString += '<span id="'+encodeURIComponent(parentNode.key)+'" class="focusable operator" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += '<span><span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span></span>';
					nodeQueryString += '</span>';
					nodeQueryString += '</span>';

					//article
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += node.verbalization.current[verbalizationIndex++]
				}

				//content
				nodeQueryString += '<span id="'+encodeURIComponent(node.key)+'" title="'+node.url+'" class="focusable predicate" meta-removeReference="'+encodeURIComponent(node.key)+'" meta-focusReference="'+encodeURIComponent(node.key)+'">';
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += '<span class="predicate">'+node.verbalization.current[verbalizationIndex++]+'</span>';
				nodeQueryString += '</span>';

				//post label
				nodeQueryString += node.verbalization.current[verbalizationIndex];
				nodeResultQuery += node.verbalization.current[verbalizationIndex++];

				//it has only a something child
				var temp = visitRenderer(node.children[0]);
				nodeQueryString += temp.queryString;
				nodeResultQuery += temp.resultString;

				nodeQueryString += '</span>';
				nodeResultQuery += '</span>';
			}
			break;
		
		case "operator":
			switch(node.label){
				case "and" :
				case "or" : 
				case "xor" : 
					var verbalizationIndex = 0;
					nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.key)+'"><span id="'+encodeURIComponent(node.key)+'" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.key)+'" class="focusable operator">' + node.verbalization.current[verbalizationIndex] + '</span></span>';
					nodeResultQuery += '<span><span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span></span>';
					break;

				case "not" :
					addBarred = true;
					var temp = visitRenderer(node.children[0]);
					nodeQueryString += temp.queryString;
					nodeResultQuery += temp.resultString;
					break;
				case "optional" :
					nodeQueryString += '<span class="optionalBlock">';
					var temp = visitRenderer(node.children[0]);
					nodeQueryString += temp.queryString;
					nodeResultQuery += '<span  class="optionalBlock">'+temp.resultString+'</span>';
					nodeQueryString += '</span>';
					break;
		
				case "<" :
				case "<=" : 
				case ">" : 
				case ">=" : 
				case "=" : 
				case "is url" : 
				case "is string" : 
				case "starts with" : 
				case "ends with" : 
				case "contains" : 
				case "lang" : 
				case "is date" : 
				case "before" : 
				case "after" : 
					var verbalizationIndex = 0;
					//pre label
					nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.key)+'">';
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += '<span>'+node.verbalization.current[verbalizationIndex++];

					//eventually not or optional
					var parentNode = queryLogicStructure[node.parent];
					if(parentNode != undefined && parentNode.type == "operator" && (parentNode.label == "not" || parentNode.label == "optional")){
						nodeQueryString += '<span class="focusable" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
						nodeQueryString += '<span id="'+encodeURIComponent(parentNode.key)+'" class="focusable operator" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
						nodeQueryString += node.verbalization.current[verbalizationIndex];
						nodeResultQuery += '<span><span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span></span>';
						nodeQueryString += '</span>';
						nodeQueryString += '</span>';

						//post Not/Optional
						nodeQueryString += node.verbalization.current[verbalizationIndex];
						nodeResultQuery += node.verbalization.current[verbalizationIndex++];
					}

					//content
					nodeQueryString += '<span id="'+encodeURIComponent(node.key)+'" class="focusable operator" meta-removeReference="'+encodeURIComponent(node.key)+'" meta-focusReference="'+encodeURIComponent(node.key)+'">';
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += '<span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span>';
					nodeQueryString += '</span>';

					//post label
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += node.verbalization.current[verbalizationIndex++];

					//they have only a child
					var temp = visitRenderer(node.children[0]);
					nodeQueryString += temp.queryString;
					nodeResultQuery += temp.resultString;

					nodeQueryString += '</span>';
					nodeResultQuery += '</span>';
					break;

				case "range" : 
				case "range date" : 
					var verbalizationIndex = 0;
					//due figli senza ul e con and in mezzo
					//pre label
					nodeQueryString += '<span class="focusable" meta-focusReference="'+encodeURIComponent(node.key)+'" meta-removeReference="'+encodeURIComponent(node.key)+'">';
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += '<span>'+node.verbalization.current[verbalizationIndex++];

					//eventually not or optional
					var parentNode = queryLogicStructure[node.parent];
					if(parentNode != undefined && parentNode.type == "operator" && (parentNode.label == "not" || parentNode.label == "optional")){
						nodeQueryString += '<span class="focusable" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';					
						nodeQueryString += '<span id="'+encodeURIComponent(parentNode.key)+'" class="focusable operator" meta-removeReference="'+encodeURIComponent(parentNode.key)+'" meta-focusReference="'+encodeURIComponent(parentNode.key)+'">';
						nodeQueryString += node.verbalization.current[verbalizationIndex];
						nodeResultQuery += '<span><span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span></span>';
						nodeQueryString += '</span>';
						nodeQueryString += '</span>';
					}

					//content
					nodeQueryString += '<span id="'+encodeURIComponent(node.key)+'" class="focusable operator" meta-removeReference="'+encodeURIComponent(node.key)+'" meta-focusReference="'+encodeURIComponent(node.key)+'">';
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += '<span class="operator">'+node.verbalization.current[verbalizationIndex++]+'</span>';
					nodeQueryString += '</span>';

					//post label
					nodeQueryString += node.verbalization.current[verbalizationIndex];
					nodeResultQuery += node.verbalization.current[verbalizationIndex++];

					//they have only a child
					var temp = visitRenderer(node.children[0]);
					nodeQueryString += temp.queryString;
					nodeResultQuery += temp.resultQuery;

					nodeQueryString += 'and ';
					nodeResultQuery += 'and ';

					var temp = visitRenderer(node.children[1]);
					nodeQueryString += temp.queryString;
					nodeResultQuery += temp.resultString;

					nodeQueryString += '</span>';
					nodeResultQuery += '</span>';
					break;
			}
			break;
	}

	return {queryString: nodeQueryString,
			resultString: nodeResultQuery};
}

function renderFocus(){

	//kill all pending query
	var size = activeAjaxRequest.length;
	if(size != 0){
		for(var i=size-1; i>=0;i--){
			activeAjaxRequest[i].abort();
		}
		activeAjaxRequest = [];
	}
	//kill user query
	if(userAjaxRequest!=null){
		userAjaxRequest.abort();
		userAjaxRequest = null;
	}


	if(onFocus == null){

		fillConcepts();
		fillPredicates();

		$("#focus").text(languageManager.getFocusInitialVerbalization());
		$("#querySparqlText").text('');

		return;
	}

	//onfocus != null
	document.getElementById(encodeURIComponent(onFocus)).className +=" highlighted";

	if(onFocus == "limit"){
		$("#focus").text(" " + $("#limit").text());
		updateBoxesFromOperator();
	}else{//it"s a node of the map
		//focus text
		var number = queryLogicStructure[onFocus].index; 
		var focusLabel = languageManager.getOrdinalNumber(number) + ' ' + queryLogicStructure[onFocus].label;
		$("#focus").text(" " + focusLabel);

		updateBoxes(queryLogicStructure[onFocus]);	
	}
		
}

function updateBoxes(focusNode){

	switch(focusNode.type){
		case "concept":
			updateBoxesFromConcept(focusNode.url);
			break;
		case "predicate":
			if(focusNode.direction == "direct")
				updateBoxesFromDirectPredicate(focusNode.url);
			else 
				updateBoxesFromReversePredicate();
			break;
		case "something":
			var parent = queryLogicStructure[focusNode.parent];
			updateBoxesFromSomething(parent.url); //pred is reverse predicate
			break;
		case "everything":
			fillConcepts();
			fillPredicates();
			break;
		case "operator":
			updateBoxesFromOperator();
			break;
		case "result":
			updateBoxesFromResult(focusNode.url, focusNode.datatype, focusNode.lang);
			break;
	}
}

function attachEvents(){

	//all focusable except for limit
	$(".focusable:not(#limit)").click(function(e){
		e.stopPropagation();
		$(".highlighted").removeClass("highlighted");
		$(this).addClass("highlighted");

		//changeFocus notification
		onFocus = decodeURIComponent($(this).attr("meta-focusReference"));

		//highlight sparql query
		$("#querySparqlText .SPARQLhighlighted").removeClass("SPARQLhighlighted");
		$("#querySparqlText span[meta-relatedto~='"+$(this).attr("meta-focusReference")+"']").addClass("SPARQLhighlighted");

		var number = queryLogicStructure[onFocus].index; 
		var focusLabel = languageManager.getOrdinalNumber(number) + ' ' + queryLogicStructure[onFocus].label;
		$("#focus").text(" " + focusLabel);
		$("#operatorsSpinner").show();

		mapCreator.changeFocus(onFocus);

		var size = activeAjaxRequest.length;
		if(size != 0){
			for(var i=size-1; i>=0;i--){
				activeAjaxRequest[i].abort();
			}
			activeAjaxRequest = [];
		}
		//don"t kill user query
		updateBoxes(queryLogicStructure[onFocus]);	
	});

	$("#limit").click(function(e){
		e.stopPropagation();

		$(".highlighted").removeClass("highlighted");
		$(this).addClass("highlighted");

		//changeFocus notification
		onFocus = $(this).attr("meta-focusReference");

		//highlight sparql query
		$("#querySparqlText .SPARQLhighlighted").removeClass("SPARQLhighlighted");
		$("#querySparqlText span[meta-relatedto='"+onFocus+"']").addClass("SPARQLhighlighted");

		$("#focus").text($(this).text());

		mapCreator.changeFocus(onFocus);

		updateBoxesFromOperator();
	});

	$("#limitInput").keydown(function(e){
		e.stopPropagation();
		if(!((e.keyCode > 95 && e.keyCode < 106)
	      || (e.keyCode > 47 && e.keyCode < 58) 
	      || e.keyCode == 8)) {
	        return false;
	    }else if(!((e.which > 95 && e.which < 106)
	      || (e.which > 47 && e.which < 58) 
	      || e.which == 8)) {
	    	return false;
	    }
	});

	$("#limitInput").focusout(function(e){
		e.stopPropagation();
		mapCreator.changeResultLimit(e.target.value);
	});

	$("#limitInput").keydown(function(e){
		e.stopPropagation();
		if(e.which == 13 || e.keyCode == 13) {
	        mapCreator.changeResultLimit(e.target.value);
	    }
		
	});

	$(".barred").click(function(e){
		e.stopPropagation();
	});

}

function removeFocusable(){
	var focusable = $(".barred .focusable");
	
	$.each(focusable, function(index){
		focusable[index].classList.remove('focusable');
	});
}

function showUserQueryBox(){
	if($("#openSparqlQuery").text() == "arrow_back"){

		$("#openSparqlQuery").text("arrow_forward");
		$("#querySparqlText").show();
		document.getElementById("querySparqlBox").className = document.getElementById("querySparqlBox").className.replace(/s1/, "s6");
		document.getElementById("queryBox").className = document.getElementById("queryBox").className.replace(/s11/, "s6");
		
	}else{

		$("#openSparqlQuery").text("arrow_back");
		$("#querySparqlText").hide();
		document.getElementById("querySparqlBox").className = document.getElementById("querySparqlBox").className.replace(/s6/, "s1");
		document.getElementById("queryBox").className = document.getElementById("queryBox").className.replace(/s6/, "s11");
	}
}

QueryViewer.prototype.renderUserQuery = function(sparqlQueryArray){
	var sparqlQuery = "";
	//sparqlQueryArray.join("\n");
	var obj;
	sparqlQuery += "<span>"+sparqlQueryArray[0]+"</span><br>";
	sparqlQuery += "<span>"+sparqlQueryArray[1]+"</span><br>";

	for(var i = 2; i<sparqlQueryArray.length-2; i++){
		obj = sparqlQueryArray[i];

		sparqlQuery += "<span meta-relatedTo='";
		for(var j = 0; j<obj.relatedTo.length; j++){
			sparqlQuery += encodeURIComponent(obj.relatedTo[j])+" ";
		}
		sparqlQuery += "'>";
		var text =  obj.content.join(' ').replace(/</g, '&lt').replace(/>/g, '&gt');
		sparqlQuery += text;
		sparqlQuery += "</span>";
		sparqlQuery += "<br>";
	}
	sparqlQuery += "<span>"+sparqlQueryArray[sparqlQueryArray.length-2]+"</span>";
	sparqlQuery += "<span meta-relatedTo='limit'>"+sparqlQueryArray[sparqlQueryArray.length-1]+"</span>";

	$("#querySparqlText").html(sparqlQuery);
	
	$('#querySparqlText span[meta-relatedto~="'+encodeURIComponent(onFocus)+'"]').addClass("SPARQLhighlighted");
}

QueryViewer.prototype.getCachedQuery = function(){
	return resultQuery;
}