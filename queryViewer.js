var languageManager;
var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;
var queryString;

var mapCreator;

var onFocus;

var addBarred;

function initQueryViewer(){}

var QueryViewer= function () {
	if(QueryViewer.prototype._singletonInstance){
		return QueryViewer.prototype._singletonInstance;
	}

	mapCreator = new MapCreator();
	languageManager = new LanguageManager();
	queryLogicStructure = {}; 
	visitStack = [];

	addBarred = false;

	QueryViewer.prototype._singletonInstance = this;
};

QueryViewer.prototype.updateQuery = function(queryRoot, queryMap, focus){
	visitStack = [];
	queryLogicStructureRoot = queryRoot;
	queryLogicStructure = queryMap;
	onFocus = focus;
	queryString = languageManager.getQueryInitialVerbalization();
	addBarred = false;
	renderQuery();
}

function renderQuery(){
	if(queryLogicStructureRoot != null){

		queryString = languageManager.getQueryStartVerbalization();
		queryString += "<span id='limit' meta-focusReference='limit' meta-removeReference='limit' class='focusable operator'>every </span>";

		queryString += visitRenderer(queryLogicStructureRoot);

	}

	$('#queryNaturalLanguage')[0].innerHTML = queryString;
	removeFocusable();

	//update box with focus from user
	attachEvents();

	//update box with focus from map
	renderFocus();
}

function visitRenderer(key){
	var node = queryLogicStructure[key];
	var nodeQueryString = '';

	switch(node.type){

		case 'concept':
			var verbalizationIndex = 0;

			//pre label
			nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+node.key+"'>";
			nodeQueryString += node.verbalization.current[verbalizationIndex++];

			//eventually not or optional
			var parentNode = queryLogicStructure[node.parent];
			if(parentNode != undefined && parentNode.type == 'operator' && (parentNode.label == 'not' || parentNode.label == 'optional')){
				nodeQueryString += "<span id='"+parentNode.key+"' class='focusable operator' meta-removeReference='"+parentNode.key+"' meta-focusReference='"+parentNode.key+"'>";
				nodeQueryString += node.verbalization.current[verbalizationIndex++];
				nodeQueryString += "</span>";

				//article
				nodeQueryString += node.verbalization.current[verbalizationIndex++];
			}

			//content
			nodeQueryString += "<span id='"+node.key+"' title='"+node.url+"' class='focusable concept' meta-removeReference='"+node.key+"' meta-focusReference='"+node.key+"'>";
			nodeQueryString += node.verbalization.current[verbalizationIndex++];
			nodeQueryString += "</span>";

			//post label
			nodeQueryString += node.verbalization.current[verbalizationIndex++];

			if(addBarred)
				nodeQueryString += "<span class='barred'>";

			var addUl;
			(node.children.length >= 2)?addUl = true : addUl = false;


			//children
			if(addUl)
				nodeQueryString += "<ul>"; 

			for(var i=0; i<node.children.length;i++){
				if(addUl){
					if(i==0 || (i%2)==1)
						nodeQueryString += '<li>';
				}

				nodeQueryString += visitRenderer(node.children[i]);

				if(addUl){
					if(i==node.children.length-1 || (i%2)==0)
						nodeQueryString += '</li>';
				}
			}

			if(addUl)
				nodeQueryString += "</ul>"; 

			if(addBarred){
				nodeQueryString += "</span>";
				addBarred = false;
			}

			nodeQueryString += "</span>";
			break;

		case 'result':
			var verbalizationIndex = 0;

			//pre label
			nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+node.parent+"'>";

			//content
			nodeQueryString += "<span id='"+node.key+"' class='focusable reusableResult' meta-removeReference='"+node.parent+"' meta-focusReference='"+node.key+"'>";
			nodeQueryString += node.verbalization.current[verbalizationIndex++];
			nodeQueryString += "</span>";

			if(addBarred)
				nodeQueryString += "<span class='barred'>";

			var addUl;
			(node.children.length >= 2)?addUl = true : addUl = false;

			//children
			if(addUl)
				nodeQueryString += "<ul>"; 

			for(var i=0; i<node.children.length;i++){
				if(addUl){
					if(i==0 || (i%2)==1)
						nodeQueryString += '<li>';
				}

				nodeQueryString += visitRenderer(node.children[i]);

				if(addUl){
					if(i==node.children.length-1 || (i%2)==0)
						nodeQueryString += '</li>';
				}
			}

			if(addUl)
				nodeQueryString += "</ul>"; 

			if(addBarred){
				nodeQueryString += "</span>";
				addBarred = false;
			}

			nodeQueryString += "</span>";
			break;

		case 'everything':
		case 'something':
			var verbalizationIndex = 0;
			var metaRemoveReference;
			if(node.type == 'everything')
				metaRemoveReference = node.key;
			else if(node.type == 'something')
				metaRemoveReference = node.parent;
			

			nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+metaRemoveReference+"'>";

			//content
			nodeQueryString += "<span id='"+node.key+"' class='focusable specialNode' meta-removeReference='"+metaRemoveReference+"' meta-focusReference='"+node.key+"'>";
			nodeQueryString += node.verbalization.current[verbalizationIndex++];
			nodeQueryString += "</span>";

			if(addBarred)
				nodeQueryString += "<span class='barred'>";

			var addUl;
			(node.children.length >= 2)?addUl = true : addUl = false;

			//children
			if(addUl)
				nodeQueryString += "<ul>"; 

			for(var i=0; i<node.children.length;i++){
				if(addUl){
					if(i==0 || (i%2)==1)
						nodeQueryString += '<li>';
				}

				nodeQueryString += visitRenderer(node.children[i]);

				if(addUl){
					if(i==node.children.length-1 || (i%2)==0)
						nodeQueryString += '</li>';
				}
			}

			if(addUl)
				nodeQueryString += "</ul>"; 

			if(addBarred){
				nodeQueryString += "</span>";
				addBarred = false;
			}

			nodeQueryString += "</span>";
			break;

		case 'predicate':
			if(node.direction == 'direct'){

				var verbalizationIndex = 0;

				//pre label
				nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+node.key+"'>";
				nodeQueryString += node.verbalization.current[verbalizationIndex++];

				//eventually not or optional
				var parentNode = queryLogicStructure[node.parent];
				if(parentNode != undefined && parentNode.type == 'operator' && (parentNode.label == 'not' || parentNode.label == 'optional')){
					nodeQueryString += "<span id='"+parentNode.key+"' class='focusable operator' meta-removeReference='"+parentNode.key+"' meta-focusReference='"+parentNode.key+"'>";
					nodeQueryString += node.verbalization.current[verbalizationIndex++];
					nodeQueryString += "</span>";

					//article
					nodeQueryString += node.verbalization.current[verbalizationIndex++];
				}

				//content
				nodeQueryString += "<span id='"+node.key+"' title='"+node.url+"' class='focusable predicate' meta-removeReference='"+node.key+"' meta-focusReference='"+node.key+"'>";
				nodeQueryString += node.verbalization.current[verbalizationIndex++];
				nodeQueryString += "</span>";

				//post label
				nodeQueryString += node.verbalization.current[verbalizationIndex++];

				if(addBarred)
					nodeQueryString += "<span class='barred'>";

				var addUl;
				(node.children.length >= 2)?addUl = true : addUl = false;


				//children
				if(addUl)
					nodeQueryString += "<ul>"; 

				for(var i=0; i<node.children.length;i++){
					if(addUl){
						if(i==0 || (i%2)==1)
							nodeQueryString += '<li>';
					}

					nodeQueryString += visitRenderer(node.children[i]);

					if(addUl){
						if(i==node.children.length-1 || (i%2)==0)
							nodeQueryString += '</li>';
					}
				}

				if(addUl)
					nodeQueryString += "</ul>"; 

				if(addBarred){
					nodeQueryString += "</span>";
					addBarred = false;
				}

				nodeQueryString += "</span>";

			}else if(node.direction == 'reverse'){
				var verbalizationIndex = 0;

				//pre label
				nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+node.key+"'>";
				nodeQueryString += node.verbalization.current[verbalizationIndex++];

				//eventually not or optional
				var parentNode = queryLogicStructure[node.parent];
				if(parentNode != undefined && parentNode.type == 'operator' && (parentNode.label == 'not' || parentNode.label == 'optional')){
					nodeQueryString += "<span id='"+parentNode.key+"' class='focusable operator' meta-removeReference='"+parentNode.key+"' meta-focusReference='"+parentNode.key+"'>";
					nodeQueryString += node.verbalization.current[verbalizationIndex++];
					nodeQueryString += "</span>";

					//article
					nodeQueryString += node.verbalization.current[verbalizationIndex++];
				}

				//content
				nodeQueryString += "<span id='"+node.key+"' title='"+node.url+"' class='focusable predicate' meta-removeReference='"+node.key+"' meta-focusReference='"+node.key+"'>";
				nodeQueryString += node.verbalization.current[verbalizationIndex++];
				nodeQueryString += "</span>";

				//post label
				nodeQueryString += node.verbalization.current[verbalizationIndex++];

				//it has only a something child
				nodeQueryString += visitRenderer(node.children[0]);

				nodeQueryString += "</span>";
			}
			break;
		
		case 'operator':
			switch(node.label){
				case 'and' :
				case 'or' : 
				case 'xor' : 
					var verbalizationIndex = 0;
					nodeQueryString += "<span id='"+node.key+"' meta-focusReference='"+node.key+"' meta-removeReference='"+node.key+"' class='focusable operator'>" + node.verbalization.current[verbalizationIndex++] + "</span>";
					break;

				case 'not' :
					addBarred = true;
					nodeQueryString += visitRenderer(node.children[0]);
					break;
				case 'optional' :
					nodeQueryString += "<span class='optionalBlock'>";
					nodeQueryString += visitRenderer(node.children[0]);
					nodeQueryString += "</span>";
					break;
		
				case '<' :
				case '<=' : 
				case '>' : 
				case '>=' : 
				case '=' : 
				case 'is url' : 
				case 'is string' : 
				case 'starts with' : 
				case 'ends with' : 
				case 'contains' : 
				case 'lang' : 
				case 'is date' : 
				case 'before' : 
				case 'after' : 
					var verbalizationIndex = 0;
					//pre label
					nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+node.key+"'>";
					nodeQueryString += node.verbalization.current[verbalizationIndex++];

					//eventually not or optional
					var parentNode = queryLogicStructure[node.parent];
					if(parentNode != undefined && parentNode.type == 'operator' && (parentNode.label == 'not' || parentNode.label == 'optional')){
						nodeQueryString += "<span id='"+parentNode.key+"' class='focusable operator' meta-removeReference='"+parentNode.key+"' meta-focusReference='"+parentNode.key+"'>";
						nodeQueryString += node.verbalization.current[verbalizationIndex++];
						nodeQueryString += "</span>";
					}

					//content
					nodeQueryString += "<span id='"+node.key+"' class='focusable operator' meta-removeReference='"+node.key+"' meta-focusReference='"+node.key+"'>";
					nodeQueryString += node.verbalization.current[verbalizationIndex++];
					nodeQueryString += "</span>";

					//post label
					nodeQueryString += node.verbalization.current[verbalizationIndex++];

					//they have only a child
					nodeQueryString += visitRenderer(node.children[0]);

					nodeQueryString += "</span>";
					break;

				case 'range' : 
				case 'range date' : 
					//due figli senza ul e con and in mezzo
					//pre label
					nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+node.key+"'>";
					nodeQueryString += node.verbalization.current[verbalizationIndex++];

					//eventually not or optional
					var parentNode = queryLogicStructure[node.parent];
					if(parentNode != undefined && parentNode.type == 'operator' && (parentNode.label == 'not' || parentNode.label == 'optional')){
						nodeQueryString += "<span id='"+parentNode.key+"' class='focusable operator' meta-removeReference='"+parentNode.key+"' meta-focusReference='"+parentNode.key+"'>";
						nodeQueryString += node.verbalization.current[verbalizationIndex++];
						nodeQueryString += "</span>";
					}

					//content
					nodeQueryString += "<span id='"+node.key+"' class='focusable operator' meta-removeReference='"+node.key+"' meta-focusReference='"+node.key+"'>";
					nodeQueryString += node.verbalization.current[verbalizationIndex++];
					nodeQueryString += "</span>";

					//post label
					nodeQueryString += node.verbalization.current[verbalizationIndex++];

					//they have only a child
					nodeQueryString += visitRenderer(node.children[0]);

					nodeQueryString += "and ";

					nodeQueryString += visitRenderer(node.children[1]);

					nodeQueryString += "</span>";
					break;
			}
			break;
	}

	return nodeQueryString;
}

function renderFocus(){

	//kill all pending query
	var size = activeAjaxRequest.length;
	if(size != 0){
		for(var i=0; i<size;i++){
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

		$('#focus').text(languageManager.getFocusInitialVerbalization());

		return;
	}

	//onfocus != null
	document.getElementById(onFocus).className +=' highlighted';

	if(onFocus == 'limit'){
		$('#focus').text(' ' + $('#limit').text());
		updateBoxesFromOperator('limit');
	}else{//it's a node of the map
		//focus text
		var number = queryLogicStructure[onFocus].index; 
		var focusLabel = languageManager.getOrdinalNumber(number) + " " + queryLogicStructure[onFocus].label;
		$('#focus').text(' ' + focusLabel);

		updateBoxes(queryLogicStructure[onFocus]);	
	}
		
}

function updateBoxes(focusNode){

	switch(focusNode.type){
		case 'concept':
			updateBoxesFromConcept(focusNode.url, focusNode.label);
			break;
		case 'predicate':
			if(focusNode.direction == 'direct')
				updateBoxesFromDirectPredicate(focusNode.url, focusNode.label);
			else 
				updateBoxesFromReversePredicate(focusNode.url, focusNode.label);
			break;
		case 'something':
			var parent = queryLogicStructure[focusNode.parent];
			updateBoxesFromSomething(parent.url, parent.label);
			break;
		case 'everything':
			fillConcepts();
			fillPredicates();
			break;
		case 'operator':
			updateBoxesFromOperator();
			break;
		case 'result':
			updateBoxesFromResult();
			break;
	}
}

function attachEvents(){

	//all focusable except for limit
	$('.focusable:not(#limit)').click(function(e){
		e.stopPropagation();
		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');

		//changeFocus notification
		onFocus = $(this).attr('meta-focusReference');

		var number = queryLogicStructure[onFocus].index; 
		var focusLabel = languageManager.getOrdinalNumber(number) + " " + queryLogicStructure[onFocus].label;
		$('#focus').text(' ' + focusLabel);
		$('#operatorsSpinner').show();

		mapCreator.changeFocus(onFocus);

		var size = activeAjaxRequest.length;
		if(size != 0){
			for(var i=0; i<size;i++){
				activeAjaxRequest[i].abort();
			}
			activeAjaxRequest = [];
		}
		//don't kill user query

		updateBoxes(queryLogicStructure[onFocus]);	
	});

	$('#limit').click(function(e){
		e.stopPropagation();

		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');

		//changeFocus notification
		onFocus = $(this).attr('meta-focusReference');

		$('#focus').text($(this).text());

		mapCreator.changeFocus(onFocus);

		updateBoxesFromOperator(onFocus);
	});

	$('.barred').click(function(e){
		e.stopPropagation();
	});

}

function removeFocusable(){
	var focusable = $('.barred .focusable');
	
	$.each(focusable, function(index){
		focusable[index].classList.remove("focusable");
	});
}

function showUserQueryBox(){
	if($('#openSparqlQuery').text() == 'arrow_back'){

		$('#openSparqlQuery').text('arrow_forward');
		$('#querySparqlText').show();
		document.getElementById('querySparqlBox').className = document.getElementById('querySparqlBox').className.replace(/s1/, 's6');
		document.getElementById('queryBox').className = document.getElementById('queryBox').className.replace(/s11/, 's6');
		
	}else{

		$('#openSparqlQuery').text('arrow_back');
		$('#querySparqlText').hide();
		document.getElementById('querySparqlBox').className = document.getElementById('querySparqlBox').className.replace(/s6/, 's1');
		document.getElementById('queryBox').className = document.getElementById('queryBox').className.replace(/s6/, 's11');
	}
}

QueryViewer.prototype.renderUserQuery = function(sparqlQueryArray){
	var sparqlQuery = sparqlQueryArray.join('\n');
	$('#querySparqlText').text(sparqlQuery);
}