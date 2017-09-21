
var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;
var queryString;

var mapCreator;

var onFocus;

function initQueryViewer(){
	/*boxFiller = new BoxFiller();
	queryVerbalizator = new QueryVerbalizator();
	languageManager = new LanguageManager();*/
}

var QueryViewer= function () {
	if(QueryViewer.prototype._singletonInstance){
		return QueryViewer.prototype._singletonInstance;
	}

	mapCreator = new MapCreator();
	queryLogicStructure = {}; 
	visitStack = [];

	QueryViewer.prototype._singletonInstance = this;
};

QueryViewer.prototype.updateQuery = function(queryRoot, queryMap, focus){
	visitStack = [];
	queryLogicStructureRoot = queryRoot;
	queryLogicStructure = queryMap;
	onFocus = focus;
	queryString = 'Give me ';
	renderQuery();
}

//ATTENZIONE
//focusReference: currentNode.key, removeReference: currentNode.children[i] negli span lista
function renderQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot == null){
		queryString = "Give me..."
	}else{
		visitStack.push({type: 'firstEndSpan', verbalization:{current: ['</span>']}, children:[] });
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);
		visitStack.push({type: 'firstStartSpan', verbalization:{current: ['<span>']}, children:[], focusReference: queryLogicStructureRoot, removeReference: queryLogicStructureRoot});

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();
			visitRenderer(currentNode);

			var childrenNumber;
			(currentNode.children.length >= 2)?childrenNumber = true : childrenNumber = false;

			if(childrenNumber){
				visitStack.push({type: 'endSpan', verbalization:{current: ['</span>']}, children:[] });
				visitStack.push({type: 'endul', verbalization:{current: ['</ul>']}, children:[] });
			}

			for(var i = currentNode.children.length-1; i>=0; i--){

				if(childrenNumber)
					visitStack.push({type: 'endli', verbalization:{current: ['</li>']}, children:[] });

				visitStack.push({type: 'endSpan', verbalization:{current: ['</span>']}, children:[] });
				visitStack.push(queryLogicStructure[currentNode.children[i]]);
				visitStack.push({type: 'startSpan', verbalization:{current: ['<span>']}, children:[], focusReference: currentNode.key, removeReference: currentNode.children[i] });

				if(childrenNumber)
					visitStack.push({type: 'startli', verbalization:{current: ['<li>']}, children:[] });

				if(i != 0){
					visitStack.push({type: 'newLine', verbalization:{current: ['<br>']}, children:[] });
					//visitStack.push({type: 'newList', verbalization:{current: ['<ul>']}, children:[] });
				}
			}

			if(childrenNumber){
				visitStack.push({type: 'startul', verbalization:{current: ['<ul>']}, children:[] });
				visitStack.push({type: 'startSpan', verbalization:{current: ['<span>']}, children:[] });
			}
		}

	}
	$('#queryNaturalLanguage')[0].innerHTML = queryString;

	attachEvents();
	renderFocus();
}

function visitRenderer(node){

	var utils = 'meta-removeReference="'+ node.key +'" meta-focusReference="'+node.key+'" id="'+node.key+'" title="'+node.url+'"';

	if(node.type == 'something'){
		utils = 'meta-removeReference="'+ node.parent +'" meta-focusReference="'+node.key+'" id="'+node.key+'" title="'+node.url+'"';
		queryString += '<span class="focusable" '+utils+' >' + node.verbalization.current[0] + '</span>';

	}else if(node.type == 'everything'){

		queryString += '<span class="focusable" '+utils+' >' + node.verbalization.current[0] + '</span>';

	}else if(node.type == 'concept'){

		queryString += node.verbalization.current[0];
		queryString += '<span class="concept focusable" '+utils+' >' + node.verbalization.current[1] + '</span>';

	}else if(node.type == 'predicate'){
		
		queryString += node.verbalization.current[0];

		if(node.direction == 'reverse')
			utils = 'meta-removeReference="'+ node.key +'" meta-focusReference="'+node.children[0]+'" id="'+node.key+'" title="'+node.url+'"';
		queryString += '<span class="predicate focusable" '+utils+' >' + node.verbalization.current[1] + '</span>';
		if(node.direction == 'reverse')
			queryString += node.verbalization.current[2];

	}else if(node.type == 'startSpan'){

		queryString += '<span class="focusable" meta-removeReference="'+node.removeReference+'" meta-focusReference="'+node.focusReference+'">'; 

	}else if(node.type == 'firstStartSpan'){
 		// to manage menu
		queryString += '<span class="focusable" meta-removeReference="'+node.removeReference+'" meta-focusReference="'+node.focusReference+'">'; 

	}else if(node.type == 'newLine'){

	} else {
		queryString += node.verbalization.current.join('');
	}

}


function renderFocus(){
	//add class to highlight the focus
	$('.highlighted').removeClass('highlighted');

	if(onFocus!=null){
		document.getElementById(onFocus).className +=' highlighted';

		var number = queryLogicStructure[onFocus].index; 
		var label = languageManager.getOrdinalNumber(number) + " " + queryLogicStructure[onFocus].label;

		$('#focus').text('Element on focus: ' + label);
		//mapCreator.changeFocus(onFocus);

		if(queryLogicStructure[onFocus].type == 'concept'){
			updateBoxesFromConcept(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label);
		}else if(queryLogicStructure[onFocus].type == 'predicate'){
			updateBoxesFromPredicate(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label, queryLogicStructure[onFocus].direction);
		}else if(queryLogicStructure[onFocus].type == 'something'){
			var parent = queryLogicStructure[queryLogicStructure[onFocus].parent];
			updateBoxesFromPredicate(parent.url, parent.label, parent.direction);
		}
		
	}
	else{

		fillConcepts();
		fillPredicates();

		$('#focus').text('');

	}

		
}

function attachEvents(){

	$('.focusable').click(function(e){
		e.stopPropagation();
		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');

		//changeFocus notification
		onFocus = $(this).attr('meta-focusReference');

		var number = queryLogicStructure[onFocus].index; 
		var label = languageManager.getOrdinalNumber(number) + " " + queryLogicStructure[onFocus].label;

		$('#focus').text('Element on focus: ' + label);
		mapCreator.changeFocus(onFocus);

		if(queryLogicStructure[onFocus].type == 'concept'){

			updateBoxesFromConcept(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label);

		}else if(queryLogicStructure[onFocus].type == 'predicate'){

			updateBoxesFromPredicate(queryLogicStructure[onFocus].url, queryLogicStructure[onFocus].label, queryLogicStructure[onFocus].direction);

		}else if(queryLogicStructure[onFocus].type == 'something'){

			updateBoxesFromConcept(queryLogicStructure[queryLogicStructure[onFocus].parent].url, queryLogicStructure[queryLogicStructure[onFocus].parent].label);

		}
		

	});

}