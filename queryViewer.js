	
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
			$('queryNaturalLanguage').innerHtml = 'Give me...';
		}else{
			visitStack.push(queryLogicStructure[queryLogicStructureRoot]);
			while(visitStack.length != 0){
				var currentNode = visitStack.pop();
				visit(currentNode);

				for(var i = currentNode.children.length-1; i>=0; i--){
					visitStack.push(queryLogicStructure[currentNode.children[i]]);
					visitStack.push({type: 'newLine', verbalization:{current: ['\n']}, children:[] });
				}

			}
			//$.isEmptyObject(queryLogicStructure[queryLogicStructureRoot].children)
		}
	}

	function visit(node){
		//return current node
		$('#queryNaturalLanguage').text($('#queryNaturalLanguage').text() + node.verbalization.current.join(''));

	}


	var QueryViewer= function () {
		queryLogicStructure = {}; 
		visitStack = [];
	};

	QueryViewer.prototype.updateQuery = function(queryRoot, queryMap){
		visitStack = [];
		queryLogicStructureRoot = queryRoot;
		queryLogicStructure = queryMap;
		$('#queryNaturalLanguage').text('Give me ');
		renderQuery();
	}
	