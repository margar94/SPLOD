	
	var queryLogicStructure;
	var queryLogicStructureRoot;
	var visitStack;

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
			visitStack.push(queryLogicStructure[queryLogicStructureRoot]);
			while(visitStack.length != 0){
				var currentNode = visitStack.pop();
				visit(currentNode);

				for(var i = currentNode.children.length-1; i>=0; i--){
					visitStack.push(queryLogicStructure[currentNode.children[i]]);
					if(i != 0)
						visitStack.push({type: 'newLine', verbalization:{current: ['<br>&emsp;']}, children:[] });
				}

			}
			//$.isEmptyObject(queryLogicStructure[queryLogicStructureRoot].children)
		}
	}

	function visit(node){
		//return current node
		$('#queryNaturalLanguage')[0].innerHTML += node.verbalization.current.join('');

	}


	var QueryViewer= function () {
		queryLogicStructure = {}; 
		visitStack = [];
	};

	QueryViewer.prototype.updateQuery = function(queryRoot, queryMap){
		visitStack = [];
		queryLogicStructureRoot = queryRoot;
		queryLogicStructure = queryMap;
		$('#queryNaturalLanguage')[0].innerHTML = 'Give me ';
		renderQuery();
	}
	