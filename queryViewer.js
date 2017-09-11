	
	var queryLogicStructure;
	var queryLogicStructureRoot;
	var visitStack;
	var queryString;

	var mapCreator;

	function initQueryViewer(){
		/*boxFiller = new BoxFiller();
		queryVerbalizator = new QueryVerbalizator();
		languageManager = new LanguageManager();*/
	}

	function renderQuery(){
		//visit query implicit tree 
		if(queryLogicStructureRoot == null){
			$('#queryNaturalLanguage').innerHTML = 'Give me...';
		}else{
			visitStack.push({type: 'endSpan', verbalization:{current: ['</span>']}, children:[] });
			visitStack.push(queryLogicStructure[queryLogicStructureRoot]);
			visitStack.push({type: 'startSpan', verbalization:{current: ['<span>']}, children:[] });

			while(visitStack.length != 0){
				var currentNode = visitStack.pop();
				visitRenderer(currentNode);

				for(var i = currentNode.children.length-1; i>=0; i--){
					visitStack.push(queryLogicStructure[currentNode.children[i]]);
					if(i != 0){
						visitStack.push({type: 'newLine', verbalization:{current: ['<br>']}, children:[] });
						//visitStack.push({type: 'newList', verbalization:{current: ['<ul>']}, children:[] });
					}
				}

			}

			$('#queryNaturalLanguage')[0].innerHTML = queryString;
		}
	}

	function visitRenderer(node){

		//span on click -> mapCreator.changeFocus(key)
		//render focus
		
		if(node.type == 'something'){

			queryString += '<span>' + node.verbalization.current[0] + '</span>';

		}else if(node.type == 'concept'){

			queryString += node.verbalization.current[0];
			queryString += '<span class="conceptURI">' + node.verbalization.current[1] + '</span>';

		}else if(node.type == 'predicate'){

			queryString += node.verbalization.current[0];
			queryString += '<span class="predicateURI">' + node.verbalization.current[1] + '</span>';
			if(node.direction == 'reverse')
				queryString += node.verbalization.current[2];

		}else{

			queryString += node.verbalization.current.join('');

		}		

	}


	var QueryViewer= function () {
		mapCreator = new MapCreator();
		queryLogicStructure = {}; 
		visitStack = [];
	};

	QueryViewer.prototype.updateQuery = function(queryRoot, queryMap){
		visitStack = [];
		queryLogicStructureRoot = queryRoot;
		queryLogicStructure = queryMap;
		queryString = 'Give me ';
		renderQuery();
	}

	QueryViewer.prototype.changeFocus = function(elementKey){

		//focus updated from mapCreator
		console.log("Focus on: " + elementKey);

	}
	