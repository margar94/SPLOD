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
	queryString = languageManager.getQueryStartVerbalization();
	addBarred = false;
	renderQuery();
}

QueryViewer.prototype.renderQuery = function(queryRoot, queryMap, focus){
	if(queryLogicStructureRoot != null){

		var queryString = "<span id='limit' meta-focusReference='limit' meta-removeReference='limit' class='focusable operator'>every </span>";

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
			

			nodeQueryString += "<span class='focusable' meta-focusReference='"+node.key+"' meta-removeReference='"+metaRemoveReference+"'">;

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
}







//ATTENZIONE
//focusReference: currentNode.key, removeReference: currentNode.children[i] negli span lista
function oldrenderQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot == null){
		queryString = languageManager.getQueryInizializationVerbalization();
	}else{
		visitStack.push({type: 'firstEndSpan', verbalization:{current: ['</span>']}, children:[] });
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);
		visitStack.push({type: 'firstStartSpan', verbalization:{current: ['<span>']}, children:[], focusReference: queryLogicStructureRoot, removeReference: queryLogicStructureRoot});

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();
			visitRenderer(currentNode);

			var addUl;
			(currentNode.children.length >= 2)?addUl = true : addUl = false;

			var notBarred = (currentNode.type == 'operator' || currentNode.parent == null || !(queryLogicStructure[currentNode.parent].type == 'operator' && queryLogicStructure[currentNode.parent].label == 'not'));

			if(!notBarred){
				visitStack.push({type: 'endBarred', verbalization:{current: ['</span>']}, children:[] });
			}

			if(currentNode.label != 'range' && currentNode.label != 'range date'){

				if(addUl){
					//visitStack.push({type: 'endSpan', verbalization:{current: ['</span>']}, children:[] });
					visitStack.push({type: 'endul', verbalization:{current: ['</ul>']}, children:[] });
				}

				for(var i = currentNode.children.length-1; i>=0; i--){

					if(addUl && (i==0 || ((i%2)==0)))
						visitStack.push({type: 'endli', verbalization:{current: ['</li>']}, children:[] });

					visitStack.push({type: 'endSpan', verbalization:{current: ['</span>']}, children:[] });
					visitStack.push(queryLogicStructure[currentNode.children[i]]);
					
					var startSpan = {type: 'startSpan', verbalization:{current: ['<span>']}, children:[], focusReference: currentNode.children[i]};
					if(currentNode.type == 'everything' && currentNode.children.length == 1 && i == 0 && queryLogicStructure[currentNode.children[i]].direction == 'direct'){
						startSpan['removeReference'] = currentNode.key;
					
					}else startSpan['removeReference'] = currentNode.children[i];
					
					visitStack.push(startSpan);
 
					if(addUl && (i==0 || (((i%2)==1) && (i!=currentNode.children.length-1))))
						visitStack.push({type: 'startli', verbalization:{current: ['<li>']}, children:[] });
				}

				if(addUl)
					visitStack.push({type: 'startul', verbalization:{current: ['<ul>']}, children:[] });
			}

			if(!notBarred){
				visitStack.push({type: 'startBarred', verbalization:{current: ['<span class="barred">']}, children:[] });
			}
		}

	}
	$('#queryNaturalLanguage')[0].innerHTML = queryString;
	removeFocusable();

	attachEvents();
	renderFocus();
}

function oldvisitRenderer(node){

	var utils = 'meta-removeReference="'+ node.key +'" meta-focusReference="'+node.key+'" id="'+node.key+'" title="'+node.url+'"';
	
	var parent = queryLogicStructure[node.parent];

	//two special cases: predicate and operations negated
	if(node.type == 'predicate' && node != queryLogicStructure[queryLogicStructureRoot] && parent.type == 'operator' && (parent.label == 'not' || parent.label == 'optional')){
		queryString += node.verbalization.current[0];
		queryString += '<span><span class="operator focusable" meta-removeReference="'+parent.key+'" meta-focusReference="'+parent.key+'" id="'+parent.key+'">'+node.verbalization.current[1]+'</span></span>';
		queryString += node.verbalization.current[2];
		queryString += '<span class="predicate focusable" '+utils+' >' + node.verbalization.current[3] + '</span>';
	}else if(node.type == 'operator' && node != queryLogicStructure[queryLogicStructureRoot] && parent.type == 'operator' && (parent.label == 'not' || parent.label == 'optional')){
		queryString += '<span class="operator focusable" '+utils+' >' + node.verbalization.current[0];
		queryString += '<span><span class="operator focusable" meta-removeReference="'+parent.key+'" meta-focusReference="'+parent.key+'" id="'+parent.key+'">'+node.verbalization.current[1]+'</span></span>';
		if(node.verbalization.current[2] != undefined)
			queryString += node.verbalization.current[2]+' ';
		if(node.label == 'range' || node.label == 'range date'){
			firstChild = queryLogicStructure[node.children[0]];
			secondChild = queryLogicStructure[node.children[1]];
			queryString += '<span class="focusable reusableResult" id="'+firstChild.key+'" meta-removeReference="'+node.key+'" meta-focusReference="'+firstChild.key+'">' + firstChild.verbalization.current[0] + '</span>'; 
			queryString += 'and ';
			queryString += '<span class="focusable reusableResult" id="'+secondChild.key+'" meta-removeReference="'+node.key+'" meta-focusReference="'+secondChild.key+'">' + secondChild.verbalization.current[0] + '</span>'; 
		}
		queryString += '</span>';
	}else{
		if(node.type == 'something'){
			utils = 'meta-removeReference="'+ node.parent +'" meta-focusReference="'+node.key+'" id="'+node.key+'" title="'+node.url+'"';
			queryString += '<span class="focusable" '+utils+' >' + node.verbalization.current[0] + '</span>';

		}else if(node.type == 'everything'){

			if(resultLimit == false){
				queryString += '<span class="focusable operator" id="limit" meta-focusReference="limit" meta-removeReference="limit">every </span>';
				queryString += '<span class="focusable" '+utils+' >' + node.verbalization.current[0] + '</span>';
			}
			else {
				queryString += '<span class="focusable operator" id="limit" meta-focusReference="limit" meta-removeReference="limit">'+resultLimit+' </span>';
				queryString += '<span class="focusable" '+utils+' >things </span>';
			}
			

			

		}else if(node.type == 'concept'){

			if(node.parent == null){
				if(resultLimit == false)
					queryString += '<span class="focusable operator" id="limit" meta-focusReference="limit" meta-removeReference="limit">'+node.verbalization.current[0]+'</span>';
				else 
					queryString += '<span class="focusable operator" id="limit" meta-focusReference="limit" meta-removeReference="limit">'+resultLimit+' </span>';
			}else
				queryString += node.verbalization.current[0];
			
			queryString += '<span class="concept focusable" '+utils+' >' + node.verbalization.current[1] + '</span>';
			
		}else if(node.type == 'predicate'){
			
			if(node.parent == null){
				if(resultLimit == false)
					queryString += '<span class="focusable operator" id="limit" meta-focusReference="limit" meta-removeReference="limit">'+node.verbalization.current[0]+'</span>';
				else 
					queryString += '<span class="focusable operator" id="limit" meta-focusReference="limit" meta-removeReference="limit">'+resultLimit+' things </span>';
				
				queryString += node.verbalization.current[1];
				if(node.direction == 'reverse')
					utils = 'meta-removeReference="'+ node.key +'" meta-focusReference="'+node.children[0]+'" id="'+node.key+'" title="'+node.url+'"';
				
				queryString += '<span class="predicate focusable" '+utils+' >' + node.verbalization.current[2] + '</span>';
				if(node.direction == 'reverse')
					queryString += node.verbalization.current[3];
			}else{
				queryString += node.verbalization.current[0];

				if(node.direction == 'reverse'){
					utils = 'meta-removeReference="'+ node.key +'" meta-focusReference="'+node.children[0]+'" id="'+node.key+'" title="'+node.url+'"';
				}else if(node.direction == 'direct'){//every thing remotion 
					var parent = queryLogicStructure[node.parent];
					if(parent.type == 'everything' && parent.children.length == 1){
						utils = 'meta-removeReference="'+ parent.key +'" meta-focusReference="'+node.children[0]+'" id="'+node.key+'" title="'+node.url+'"';
					}

				}
				
				queryString += '<span class="predicate focusable" '+utils+' >' + node.verbalization.current[1] + '</span>';
				if(node.direction == 'reverse')
					queryString += node.verbalization.current[2];
			}

		}else if(node.type == 'startSpan'){

			queryString += '<span class="focusable" meta-removeReference="'+node.removeReference+'" meta-focusReference="'+node.focusReference+'">'; 

		}else if(node.type == 'firstStartSpan'){
	 		// to manage menu
			queryString += '<span class="focusable" meta-removeReference="'+node.removeReference+'" meta-focusReference="'+node.focusReference+'">'; 

		}else if(node.type == 'operator'){
			if(node.label != 'not' || node.label != 'optional')
				if(parent.label != 'not' || node.label != 'optional'){


					queryString += '<span class="focusable operator" id="'+node.key+'" meta-removeReference="'+node.key+'" meta-focusReference="'+node.key+'">' + node.verbalization.current[0]+' ';
					if(node.label == 'range' || node.label == 'range date'){
						firstChild = queryLogicStructure[node.children[0]];
						secondChild = queryLogicStructure[node.children[1]];
						queryString += '<span class="focusable reusableResult" id="'+firstChild.key+'" meta-removeReference="'+node.key+'" meta-focusReference="'+firstChild.key+'">' + firstChild.verbalization.current[0] + '</span>'; 
						queryString += 'and ';
						queryString += '<span class="focusable reusableResult" id="'+secondChild.key+'" meta-removeReference="'+node.key+'" meta-focusReference="'+secondChild.key+'">' + secondChild.verbalization.current[0] + '</span>'; 

					}
					queryString += '</span>'; 
				}
					
		}else if(node.type == 'result'){
			queryString += '<span class="focusable reusableResult" id="'+node.key+'" meta-removeReference="'+node.parent+'" meta-focusReference="'+node.key+'">' + node.verbalization.current[0] + '</span>'; 
		}else{
			queryString += node.verbalization.current.join('');
		}

	}

	
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
	userAjaxRequest.abort();


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
			updateBoxesFromPredicate(parent.url, parent.label, parent.direction);
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