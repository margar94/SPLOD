var languageManager;
var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;
var queryString;

var mapCreator;

var onFocus;

function initQueryViewer(){}

var QueryViewer= function () {
	if(QueryViewer.prototype._singletonInstance){
		return QueryViewer.prototype._singletonInstance;
	}

	mapCreator = new MapCreator();
	languageManager = new LanguageManager();
	queryLogicStructure = {}; 
	visitStack = [];

	QueryViewer.prototype._singletonInstance = this;
};

QueryViewer.prototype.updateQuery = function(queryRoot, queryMap, focus){
	visitStack = [];
	queryLogicStructureRoot = queryRoot;
	queryLogicStructure = queryMap;
	onFocus = focus;
	queryString = languageManager.getQueryStartVerbalization();
	renderQuery();
}

//ATTENZIONE
//focusReference: currentNode.key, removeReference: currentNode.children[i] negli span lista
function renderQuery(){
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

			var childrenNumber;
			(currentNode.children.length >= 2)?childrenNumber = true : childrenNumber = false;

			var notBarred = (currentNode.type == 'operator' || currentNode.parent == null || !(queryLogicStructure[currentNode.parent].type == 'operator' && queryLogicStructure[currentNode.parent].label == 'not'));

			if(!notBarred){
				visitStack.push({type: 'endBarred', verbalization:{current: ['</span>']}, children:[] });
			}

			if(currentNode.label != 'range' && currentNode.label != 'range date'){

				if(childrenNumber){
					//visitStack.push({type: 'endSpan', verbalization:{current: ['</span>']}, children:[] });
					visitStack.push({type: 'endul', verbalization:{current: ['</ul>']}, children:[] });
				}

				for(var i = currentNode.children.length-1; i>=0; i--){

					if(childrenNumber && (i==0 || ((i%2)==0)))
						visitStack.push({type: 'endli', verbalization:{current: ['</li>']}, children:[] });

					visitStack.push({type: 'endSpan', verbalization:{current: ['</span>']}, children:[] });
					visitStack.push(queryLogicStructure[currentNode.children[i]]);
					
					var startSpan = {type: 'startSpan', verbalization:{current: ['<span>']}, children:[], focusReference: currentNode.children[i]};
					if(currentNode.type == 'everything' && currentNode.children.length == 1 && i == 0 && queryLogicStructure[currentNode.children[i]].direction == 'direct'){
						startSpan['removeReference'] = currentNode.key;
					
					}else startSpan['removeReference'] = currentNode.children[i];
					
					visitStack.push(startSpan);
 
					if(childrenNumber && (i==0 || (((i%2)==1) && (i!=currentNode.children.length-1))))
						visitStack.push({type: 'startli', verbalization:{current: ['<li>']}, children:[] });
				}

				if(childrenNumber)
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

function visitRenderer(node){

	var utils = 'meta-removeReference="'+ node.key +'" meta-focusReference="'+node.key+'" id="'+node.key+'" title="'+node.url+'"';
	
	var parent = queryLogicStructure[node.parent];

	//two special cases: predicate and operations negated
	if(node.type == 'predicate' && node != queryLogicStructure[queryLogicStructureRoot] && parent.type == 'operator' && parent.label == 'not'){
		queryString += node.verbalization.current[0];
		queryString += '<span><span class="operator focusable" meta-removeReference="'+parent.key+'" meta-focusReference="'+parent.key+'" id="'+parent.key+'">'+node.verbalization.current[1]+'</span></span>';
		queryString += node.verbalization.current[2];
		queryString += '<span class="predicate focusable" '+utils+' >' + node.verbalization.current[3] + '</span>';
	}else if(node.type == 'operator' && node != queryLogicStructure[queryLogicStructureRoot] && parent.type == 'operator' && parent.label == 'not'){
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
			if(node.label != 'not')
				if(parent.label != 'not'){
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
	//add class to highlight the focus
	$('.highlighted').removeClass('highlighted');

	if(onFocus!=null){
		document.getElementById(onFocus).className +=' highlighted';

		var size = activeAjaxRequest.length;
		if(size != 0){
			for(var i=0; i<size;i++){
				activeAjaxRequest[i].abort();
			}
			activeAjaxRequest = [];
		}

		if(onFocus=='limit'){
			$('#focus').text(' ' + $('#limit').text());
			updateBoxesFromOperator('limit');
		}else{

			var number = queryLogicStructure[onFocus].index; 
			var label = languageManager.getOrdinalNumber(number) + " " + queryLogicStructure[onFocus].label;

			$('#focus').text(' ' + label);
			//mapCreator.changeFocus(onFocus);

			if(queryLogicStructure[onFocus].type == 'concept'){
				updateBoxesFromConcept(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label);
			}else if(queryLogicStructure[onFocus].type == 'predicate'){
				updateBoxesFromPredicate(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label, queryLogicStructure[onFocus].direction);
			}else if(queryLogicStructure[onFocus].type == 'something'){
				var parent = queryLogicStructure[queryLogicStructure[onFocus].parent];
				updateBoxesFromPredicate(parent.url, parent.label, parent.direction);
			}else if(queryLogicStructure[onFocus].type == 'everything'){
				fillConcepts();
				fillPredicates();
			}else if(queryLogicStructure[onFocus].type == 'operator'){
				updateBoxesFromOperator(queryLogicStructure[onFocus].label);
			}
		}
		
	}
	else{

		var size = activeAjaxRequest.length;
		if(size != 0){
			for(var i=0; i<size;i++){
				activeAjaxRequest[i].abort();
			}
			activeAjaxRequest = [];
		}

		fillConcepts();
		fillPredicates();

		$('#focus').text(' -');

	}

		
}

function attachEvents(){

	$('.focusable:not(#limit)').click(function(e){
		e.stopPropagation();
		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');

		//changeFocus notification
		onFocus = $(this).attr('meta-focusReference');

		var number = queryLogicStructure[onFocus].index; 
		var label = languageManager.getOrdinalNumber(number) + " " + queryLogicStructure[onFocus].label;

		$('#focus').text(' ' + label);
		mapCreator.changeFocus(onFocus);

		var size = activeAjaxRequest.length;
		if(size != 0){
			for(var i=0; i<size;i++){
				activeAjaxRequest[i].abort();
			}
			activeAjaxRequest = [];
		}

		if(queryLogicStructure[onFocus].type == 'concept'){

			updateBoxesFromConcept(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label);

		}else if(queryLogicStructure[onFocus].type == 'predicate'){

			updateBoxesFromPredicate(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label, queryLogicStructure[onFocus].direction);

		}else if(queryLogicStructure[onFocus].type == 'something'){

			updateBoxesFromPredicate(queryLogicStructure[queryLogicStructure[onFocus].parent].url, queryLogicStructure[queryLogicStructure[onFocus].parent].label, queryLogicStructure[queryLogicStructure[onFocus].parent].direction);

		}else if(queryLogicStructure[onFocus].type == 'everything'){
			
			fillConcepts();
			fillPredicates();
			
		}else if(queryLogicStructure[onFocus].type == 'operator'){
			
			updateBoxesFromOperator(queryLogicStructure[onFocus].label);

		}
		

	});

	$('#limit').click(function(e){
		e.stopPropagation();

		updateBoxesFromOperator('limit');

		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');

		//changeFocus notification
		onFocus = $(this).attr('meta-focusReference');

		$('#focus').text($(this).text());
		mapCreator.changeFocus('limit');

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