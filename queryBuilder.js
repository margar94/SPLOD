
var queryLogicStructure;
var queryLogicStructureRootList;
var visitStack;
var querySPARQL;

var executor;

var addNot;
var tempReverseWhere = {};

var QueryBuilder = function () {
	if(QueryBuilder.prototype._singletonInstance){
		return QueryBuilder.prototype._singletonInstance;
	}
	
	executor = new QueryExecutor();
	addNot = false;

	QueryBuilder.prototype._singletonInstance = this;
};

QueryBuilder.prototype.updateQuery = function(queryLogicRootList, queryLogicMap){
	queryLogicStructure = queryLogicMap;
	queryLogicStructureRootList = queryLogicRootList;
	visitStack = [];
	querySPARQL = {select:[], labelSelect:[], keySelect:[], where:[]}; //add other field
	buildQuery();
}

function buildQuery(){
	if(queryLogicStructureRootList.length != 0){
		createAllVariable();

		var nodeSelect = [];
		var nodeLabelSelect = [];
		var nodeKeySelect = [];
		var nodeWhere = [];

		var childWhere = [];	
		var childQuery = {};

		for(var rootListIndex = 0; rootListIndex<queryLogicStructureRootList.length; rootListIndex++){
			var queryLogicStructureRoot = queryLogicStructureRootList[rootListIndex];

			childQuery = visitSPARQL(queryLogicStructureRoot); 

			nodeSelect = nodeSelect.concat(childQuery.select);
			nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
			nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

			childWhere.push(childQuery.where);
		}
			
		var sameLevelOperator = null;
		if(queryLogicStructureRootList.length==1){

			for(var j=0; j<childWhere[0].length; j++)
				nodeWhere = nodeWhere.concat([{relatedTo: childWhere[0][j].relatedTo, 
					content: childWhere[0][j].content}]);

		}else if(queryLogicStructureRootList.length>1){
			sameLevelOperator = queryLogicStructure[queryLogicStructureRootList[1]].subtype;
		}

		switch(sameLevelOperator){
			case 'and':

				for(var i = 0; i < childWhere.length; i = i+2){
					for(var j=0; j<childWhere[i].length; j++)
						nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo, 
							content: childWhere[i][j].content}]);
				}
				break;
			case 'or':
				var block = [];
				for(var i=0; i<childWhere.length; i = i+2){
					block.push(childWhere[i]);
				}
				for(var z = 0; z < block.length; z++){

					var fixedBlock = block.splice(0,1)[0];
					nodeWhere = nodeWhere.concat([{relatedTo: [], content:['{']}]);

					for(var t=0; t<fixedBlock.length; t++)
						nodeWhere = nodeWhere.concat([{relatedTo: fixedBlock[t].relatedTo, 
							content:fixedBlock[t].content}]);

					block.splice(block.length,0,fixedBlock);

					for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
						var optionalBlock = block.splice(0,1)[0];
						nodeWhere = nodeWhere.concat([{relatedTo: [], content:['OPTIONAL{']}]);

						for(var t=0; t<optionalBlock.length; t++)
							nodeWhere = nodeWhere.concat([{relatedTo: optionalBlock[t].relatedTo,
								content:optionalBlock[t].content}]);

						nodeWhere = nodeWhere.concat([{relatedTo: [], content:['}']}]);

						block.splice(block.length, 0, optionalBlock);
					}

					block.splice(block.length,0,(block.splice(0,1)[0]));

					nodeWhere = nodeWhere.concat([{relatedTo: [], content:['}']}]);
					if(z != block.length-1)
						nodeWhere = nodeWhere.concat([{relatedTo: [], content:['UNION']}]);
				}

				break;
			case 'xor':
				for(var i = 0; i < childWhere.length; i = i+2){
					nodeWhere = nodeWhere.concat([{relatedTo: [], content:['{']}]);

					for(var j=0; j<childWhere[i].length; j++)
						nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo, 
							content:childWhere[i][j].content}]);

					if(i == childWhere.length-1)
						nodeWhere = nodeWhere.concat([{relatedTo: [], content:['}']}]);
					else
						nodeWhere = nodeWhere.concat([{relatedTo: [], content:['} UNION']}]);

				}
				break;
		}

		querySPARQL = {select:nodeSelect, labelSelect:nodeLabelSelect, keySelect:nodeKeySelect, where:nodeWhere};

	}
	executor.executeUserQuery(querySPARQL);
}

function createAllVariable(){
	for(key in queryLogicStructure){
		var node = queryLogicStructure[key];
		if('sameAs' in node) //sameAs variable 
			node.variable = queryLogicStructure[node.sameAs].variable;
		else
			node.variable = "?"+createVariableFromLabel(node.label, node.index);
	}
}

function visitSPARQL(key){
	var node = queryLogicStructure[key];

	var nodeSelect = [];
	var nodeLabelSelect = [];
	var nodeKeySelect = [];
	var nodeWhere = [];

	var childWhere = [];	

	var nodeQuery = {};
	var childQuery = {};

	//console.log(node);

	switch(node.type){
		case 'everything' : 
			var firstReverseChild = null;
			for(var i=0; i<node.children.length; i++){ 
				var child = queryLogicStructure[node.children[i]];
				if(child.type == 'predicate' && child.direction == 'reverse'){
					firstReverseChild = child;
					break;
				}
			}

			if(!('sameAs' in node)){
				if(firstReverseChild == null){
					nodeSelect.push(node.variable);
					nodeLabelSelect.push(node.label);
					nodeKeySelect.push(node.key);
				}
				else{	
					node.variable = firstReverseChild.variable;

					nodeSelect.push(firstReverseChild.variable);
					nodeLabelSelect.push(firstReverseChild.label);
					nodeKeySelect.push(firstReverseChild.key);
				}
			}

			//set variable 
			if('sameAs' in node){
				node.variable = queryLogicStructure[node.sameAs].variable;
			}

			if(!(node.children.length>1 && queryLogicStructure[node.children[1]].type=='operator' && queryLogicStructure[node.children[1]].subtype=='xor')){
				nodeWhere = nodeWhere.concat([{relatedTo: [node.key], content:[node.variable+ ' a ?_.']}]);
			}

			for(var i=0; i<node.children.length; i++){ 
				childQuery = visitSPARQL(node.children[i]); 

				nodeSelect = nodeSelect.concat(childQuery.select);
				nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
				nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

				childWhere.push(childQuery.where);
			}

			var sameLevelOperator = null;
			if(node.children.length==1){

				for(var j=0; j<childWhere[0].length; j++)
					nodeWhere = nodeWhere.concat([{relatedTo: childWhere[0][j].relatedTo.concat(node.key), 
						content: childWhere[0][j].content}]);

			}else if(node.children.length>1){
				sameLevelOperator = queryLogicStructure[node.children[1]].subtype;
			}

			var child = [node.key];
			for(var i = 1; i<node.children.length; i = i+2)
				child.push(node.children[i]);

			switch(sameLevelOperator){
				case 'and':

					for(var i = 0; i < childWhere.length; i = i+2){
						for(var j=0; j<childWhere[i].length; j++)
							nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(node.key), 
								content: childWhere[i][j].content}]);
					}
					break;
				case 'or':
					var block = [];
					for(var i=0; i<childWhere.length; i = i+2){
						block.push(childWhere[i]);
					}
					for(var z = 0; z < block.length; z++){

						var fixedBlock = block.splice(0,1)[0];
						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);

						for(var t=0; t<fixedBlock.length; t++)
							nodeWhere = nodeWhere.concat([{relatedTo: fixedBlock[t].relatedTo.concat(child), 
								content:fixedBlock[t].content}]);

						block.splice(block.length,0,fixedBlock);

						for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
							var optionalBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['OPTIONAL{']}]);

							for(var t=0; t<optionalBlock.length; t++)
								nodeWhere = nodeWhere.concat([{relatedTo: optionalBlock[t].relatedTo.concat(child),
									content:optionalBlock[t].content}]);

							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);

							block.splice(block.length, 0, optionalBlock);
						}

						block.splice(block.length,0,(block.splice(0,1)[0]));

						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
						if(z != block.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['UNION']}]);
					}

					break;
				case 'xor':
					for(var i = 0; i < node.children.length; i = i+2){
						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);
						nodeWhere = nodeWhere.concat([{relatedTo: [node.key], content:[node.variable+ ' a ?_.']}]);

						for(var j=0; j<childWhere[i].length; j++)
							nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(child), 
								content:childWhere[i][j].content}]);

						if(i == node.children.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
						else
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['} UNION']}]);

					}
					break;
			}

			break;
		case 'concept' :
			//set variable 
			if('sameAs' in node){
				node.variable = queryLogicStructure[node.sameAs].variable;
			}else{
				//eventually change of variable and select management
				var parentNode = queryLogicStructure[node.parent];
				if(parentNode!=undefined){
					switch(parentNode.type){
						case 'everything': 
						case 'concept' : 
								node.variable = parentNode.variable;
							break;
						case 'predicate':
							if(parentNode.direction == 'direct'){
								node.variable = parentNode.variable;
							}else if(parentNode.direction == 'reverse'){
								nodeSelect.push(node.variable);
								nodeLabelSelect.push(node.label);
								nodeKeySelect.push(node.key);
							}
							break; 
					} 
				}else{
					nodeSelect.push(node.variable);
					nodeLabelSelect.push(node.label);
					nodeKeySelect.push(node.key);
				}
			}

			//where management
			if(!(node.children.length>1 && queryLogicStructure[node.children[1]].type=='operator' && queryLogicStructure[node.children[1]].subtype=='xor')){
				nodeWhere.push({relatedTo:[node.key], content:[node.variable+' a'+' <'+node.url+'>.']});
			}

			for(var i=0; i<node.children.length; i++){ 
				childQuery = visitSPARQL(node.children[i]);

				nodeSelect = nodeSelect.concat(childQuery.select);
				nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
				nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

				childWhere.push(childQuery.where);
			}

			var sameLevelOperator = null;
			if(node.children.length==1){
				nodeWhere = nodeWhere.concat(childWhere[0]);
			}else if(node.children.length > 1){
				sameLevelOperator = queryLogicStructure[node.children[1]].subtype;
			}

			var child = [];
			for(var i = 1; i<node.children.length; i = i+2)
				child.push(node.children[i]);

			switch(sameLevelOperator){
				case 'and':
					for(var i = 0; i < node.children.length; i = i+2){
						nodeWhere = nodeWhere.concat(childWhere[i]);
					}
					break;
				case 'or':
					var block = [];
					for(var i=0; i<childWhere.length; i = i+2){
						block.push(childWhere[i]);
					}
					
					for(var z = 0; z < block.length; z++){

						var fixedBlock = block.splice(0,1)[0];
						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);

						for(var t=0; t<fixedBlock.length; t++)
							nodeWhere = nodeWhere.concat([{relatedTo: fixedBlock[t].relatedTo.concat(child), 
								content:fixedBlock[t].content}]);

						block.splice(block.length,0,fixedBlock);

						for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
							var optionalBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['OPTIONAL{']}]);

							for(var t=0; t<optionalBlock.length; t++)
								nodeWhere = nodeWhere.concat([{relatedTo: optionalBlock[t].relatedTo.concat(child),
									content:optionalBlock[t].content}]);

							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);

							block.splice(block.length, 0, optionalBlock);
						}

						block.splice(block.length,0,(block.splice(0,1)[0]));

						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
						if(z != block.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['UNION']}]);
					}

					break;
				case 'xor':
					for(var i = 0; i < node.children.length; i = i+2){
						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);
						nodeWhere.push({relatedTo:[node.key], content:[node.variable+' a'+' <'+node.url+'>.']});

						for(var j=0; j<childWhere[i].length; j++)
							nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(child), 
								content:childWhere[i][j].content}]);

						if(i == node.children.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
						else
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['} UNION']}]);

					}
					break;
			}
			break;
		case 'predicate' :
			if(node.direction == 'direct'){

				//set variable 
				if('sameAs' in node){
					node.variable = queryLogicStructure[node.sameAs].variable;
				}else{
					if(!addNot){
						nodeSelect.push(node.variable);
						nodeLabelSelect.push(node.label);
						nodeKeySelect.push(node.key);
					}
				}

				//where management
				var parentVariable = queryLogicStructure[node.parent].variable;

				if(addNot){
					nodeWhere = nodeWhere.concat([{relatedTo: [node.parent, node.key], content:['FILTER(!EXISTS{'+parentVariable+ ' <'+node.url+'> '+ node.variable+'.'+'})']}]);	
				}
				else{
					if(!(node.children.length>1 && queryLogicStructure[node.children[1]].type=='operator' && queryLogicStructure[node.children[1]].subtype=='xor')){
						nodeWhere = nodeWhere.concat([{relatedTo: [node.key], content:[parentVariable+ ' <'+node.url+'> '+ node.variable+'.']}]);
					}
				}

				if(!addNot){
					for(var i=0; i<node.children.length; i++){ 
						childQuery = visitSPARQL(node.children[i]); 

						nodeSelect = nodeSelect.concat(childQuery.select);
						nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
						nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

						childWhere.push(childQuery.where);
					}

					var sameLevelOperator = null;
					if(node.children.length==1){
						nodeWhere = nodeWhere.concat(childWhere[0]);
					}else if(node.children.length > 1){
						sameLevelOperator = queryLogicStructure[node.children[1]].subtype;
					}

					var child = [];
					for(var i = 1; i<node.children.length; i = i+2)
						child.push(node.children[i]);

					switch(sameLevelOperator){
						case 'and':
							for(var i = 0; i < node.children.length; i = i+2){
								nodeWhere = nodeWhere.concat(childWhere[i]);
							}
							break;
						case 'or':
							var block = [];
							for(var i=0; i<childWhere.length; i = i+2){
								block.push(childWhere[i]);
							}
							
							for(var z = 0; z < block.length; z++){

								var fixedBlock = block.splice(0,1)[0];
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);

								for(var t=0; t<fixedBlock.length; t++)
									nodeWhere = nodeWhere.concat([{relatedTo: fixedBlock[t].relatedTo.concat(child), 
										content:fixedBlock[t].content}]);

								block.splice(block.length,0,fixedBlock);

								for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
									var optionalBlock = block.splice(0,1)[0];
									nodeWhere = nodeWhere.concat([{relatedTo: child, content:['OPTIONAL{']}]);

									for(var t=0; t<optionalBlock.length; t++)
										nodeWhere = nodeWhere.concat([{relatedTo: optionalBlock[t].relatedTo.concat(child),
											content:optionalBlock[t].content}]);

									nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);

									block.splice(block.length, 0, optionalBlock);
								}

								block.splice(block.length,0,(block.splice(0,1)[0]));

								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
								if(z != block.length-1)
									nodeWhere = nodeWhere.concat([{relatedTo: child, content:['UNION']}]);
							}

							break;
						case 'xor':
							for(var i = 0; i < node.children.length; i = i+2){
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);
								nodeWhere = nodeWhere.concat([{relatedTo: [node.key], content:[parentVariable+ ' <'+node.url+'> '+ node.variable+'.']}]);

								for(var j=0; j<childWhere[i].length; j++)
									nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(child), 
										content:childWhere[i][j].content}]);

								if(i == node.children.length-1)
									nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
								else
									nodeWhere = nodeWhere.concat([{relatedTo: child, content:['} UNION']}]);

							}
							break;
					}
					
				}   

				if(addNot){
					addNot = false;
				}

			}else if(node.direction == 'reverse'){

				var parentVariable = queryLogicStructure[node.parent].variable;

				for(var i=0; i<node.children.length; i=i+2){
				
					node.variable = queryLogicStructure[node.children[i]].variable;

					if(addNot){
						nodeWhere = nodeWhere.concat([{relatedTo: [node.parent, node.key, node.children[i]], 
							content:['FILTER(!EXISTS{'+node.variable+ ' <'+node.url+'> '+ parentVariable+'.})']}]);
					}
					else{
						nodeWhere = nodeWhere.concat([{relatedTo: [node.key, node.children[i]], 
							content:[node.variable+ ' <'+node.url+'> '+ parentVariable+'.']}]);
						tempReverseWhere = {relatedTo: [node.key, node.children[i]], 
							content:[node.variable+ ' <'+node.url+'> '+ parentVariable+'.']};
					}
				}


				for(var i=0; i<node.children.length; i++){ 
					childQuery = visitSPARQL(node.children[i]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

					childWhere.push(childQuery.where);
				}

				var sameLevelOperator = null;
				if(node.children.length==1){
					nodeWhere = nodeWhere.concat(childWhere[0]);
				}else if(node.children.length > 1){
					sameLevelOperator = queryLogicStructure[node.children[1]].subtype;
				}

				var child = [];
				for(var i = 1; i<node.children.length; i = i+2)
					child.push(node.children[i]);

				switch(sameLevelOperator){
					case 'and':
						for(var i = 0; i < node.children.length; i = i+2){
							nodeWhere = nodeWhere.concat(childWhere[i]);
						}
						break;
					case 'or':
						var block = [];
						for(var i=0; i<childWhere.length; i = i+2){
							block.push(childWhere[i]);
						}
						
						for(var z = 0; z < block.length; z++){

							var fixedBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);

							for(var t=0; t<fixedBlock.length; t++)
								nodeWhere = nodeWhere.concat([{relatedTo: fixedBlock[t].relatedTo.concat(child), 
									content:fixedBlock[t].content}]);

							block.splice(block.length,0,fixedBlock);

							for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
								var optionalBlock = block.splice(0,1)[0];
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['OPTIONAL{']}]);

								for(var t=0; t<optionalBlock.length; t++)
									nodeWhere = nodeWhere.concat([{relatedTo: optionalBlock[t].relatedTo.concat(child),
										content:optionalBlock[t].content}]);

								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);

								block.splice(block.length, 0, optionalBlock);
							}

							block.splice(block.length,0,(block.splice(0,1)[0]));

							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
							if(z != block.length-1)
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['UNION']}]);
						}

						break;
					case 'xor':
						for(var i = 0; i < node.children.length; i = i+2){
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);
							//cosa fare??
							//nodeWhere = nodeWhere.concat([{relatedTo: [node.key], content:[parentVariable+ ' <'+node.url+'> '+ node.variable+'.']}]);

							for(var j=0; j<childWhere[i].length; j++)
								nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(child), 
									content:childWhere[i][j].content}]);

							if(i == node.children.length-1)
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
							else
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['} UNION']}]);

						}
						break;
					}
					
				}
				
				if(addNot){
					addNot = false;
				}
			
			break;
		case 'something' : 

			//set variable 
			if('sameAs' in node){
				node.variable = queryLogicStructure[node.sameAs].variable;
			}else{
				nodeSelect.push(node.variable);
				nodeLabelSelect.push(node.label);
				nodeKeySelect.push(node.key);
			}

			if(!addNot){
				for(var i=0; i<node.children.length; i++){ 
					childQuery = visitSPARQL(node.children[i]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

					childWhere.push(childQuery.where);
				}

				var sameLevelOperator = null;
				if(node.children.length==1){
					for(var j=0; j<childWhere[0].length; j++)
						nodeWhere = nodeWhere.concat([{relatedTo: childWhere[0][j].relatedTo.concat(node.key), 
							content: childWhere[0][j].content}]);				
				}else if(node.children.length > 1){
					sameLevelOperator = queryLogicStructure[node.children[1]].subtype;
				}

				var child = [node.key];
				for(var i = 1; i<node.children.length; i = i+2)
					child.push(node.children[i]);

				switch(sameLevelOperator){
					case 'and':
						for(var i = 0; i < node.children.length; i = i+2){
							for(var j=0; j<childWhere[i].length; j++)
								nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(node.key), 
									content: childWhere[i][j].content}]);
						}
						break;
					case 'or':
						var block = [];
						for(var i=0; i<childWhere.length; i = i+2){
							block.push(childWhere[i]);
						}
						
						for(var z = 0; z < block.length; z++){

							var fixedBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);

							for(var t=0; t<fixedBlock.length; t++)
								nodeWhere = nodeWhere.concat([{relatedTo: fixedBlock[t].relatedTo.concat(child), 
									content:fixedBlock[t].content}]);

							block.splice(block.length,0,fixedBlock);

							for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
								var optionalBlock = block.splice(0,1)[0];
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['OPTIONAL{']}]);

								for(var t=0; t<optionalBlock.length; t++)
									nodeWhere = nodeWhere.concat([{relatedTo: optionalBlock[t].relatedTo.concat(child),
										content:optionalBlock[t].content}]);

								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);

								block.splice(block.length, 0, optionalBlock);
							}

							block.splice(block.length,0,(block.splice(0,1)[0]));

							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
							if(z != block.length-1)
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['UNION']}]);
						}

						break;
					case 'xor':
						for(var i = 0; i < node.children.length; i = i+2){
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);
							nodeWhere = nodeWhere.concat([{relatedTo: tempReverseWhere.relatedTo.concat(child), 
								content:tempReverseWhere.content}]);

							for(var j=0; j<childWhere[i].length; j++)
								nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(child), 
									content:childWhere[i][j].content}]);

							if(i == node.children.length-1)
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
							else
								nodeWhere = nodeWhere.concat([{relatedTo: child, content:['} UNION']}]);

						}
						break;
				}
			}

			break;
		case 'operator': 
			var parentVariable = null;
			if(node.parent!=null)
				parentVariable = queryLogicStructure[node.parent].variable;

			/*var notLabel = "";
			if(addNot){
				notLabel = "!";
				addNot=false;
			}*/

			var claus = [];
			var operatorLabel = node.label;
			var switchOperatorLabel = node.subtype;

			switch(switchOperatorLabel){
				case 'is url': 
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]);
					if(addNot){
						operatorLabel = '!=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = '=';
					}
					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', parentVariable + operatorLabel + '<'+queryLogicStructure[node.children[0]].label+'>' , ')']});
					
					queryLogicStructure[node.children[0]].variable = '<'+queryLogicStructure[node.children[0]].label+'>';

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;
				
				case 'is string': 
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]);
					if(addNot){
						operatorLabel = '!=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = '=';
					}

					var tempLabel = queryLogicStructure[node.children[0]].label.replace(/\"/g, '\\\"');
					if(queryLogicStructure[node.children[0]].lang != null){
						nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', parentVariable + operatorLabel + '"'+tempLabel +'"@' + queryLogicStructure[node.children[0]].lang, ')']});
						queryLogicStructure[node.children[0]].variable = '"'+tempLabel+'"@'+ queryLogicStructure[node.children[0]].lang;
					}
					else{
						if(queryLogicStructure[node.children[0]].penninculo!=''){
							nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(',parentVariable +' '+ operatorLabel + '"'+tempLabel+ '"^^'+queryLogicStructure[node.children[0]].penninculo, ')']});
							queryLogicStructure[node.children[0]].variable = '"'+tempLabel+'"^^'+queryLogicStructure[node.children[0]].penninculo;
						}
						else{
							nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', 'str(' + parentVariable +')'+ operatorLabel + '"'+tempLabel+ '"', ')']});
							queryLogicStructure[node.children[0]].variable = '"'+tempLabel+'"';
						}
					}

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case 'contains': 
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]);
					if(addNot){
						operatorLabel = '!contains';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}else{
						operatorLabel = 'contains';
					}
				
					var tempLabel = queryLogicStructure[node.children[0]].label.replace(/\"/g, '\\\"');

					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', operatorLabel + '(xsd:string('+parentVariable+'),"'+tempLabel+'")', ')']});
					queryLogicStructure[node.children[0]].variable = '"'+tempLabel+'"';

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case 'starts with':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '!strStarts';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = 'strStarts';
					}

					var tempLabel = queryLogicStructure[node.children[0]].label.replace(/\"/g, '\\\"');

					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', operatorLabel + '(xsd:string('+parentVariable+'),"'+tempLabel+'")', ')']});
					queryLogicStructure[node.children[0]].variable = '"'+tempLabel+'"';

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case 'ends with': 
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '!strEnds';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = 'strEnds';
					}

					var tempLabel = queryLogicStructure[node.children[0]].label.replace(/\"/g, '\\\"');

					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', operatorLabel + '(xsd:string('+parentVariable+'),"'+tempLabel+'")', ')']});
					queryLogicStructure[node.children[0]].variable = '"'+tempLabel+'"';

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case 'lang': 
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '!lang';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = 'lang';
					}
					
					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', operatorLabel + '('+parentVariable+')="'+queryLogicStructure[node.children[0]].label+'"', ')']});
					queryLogicStructure[node.children[0]].variable = '"'+queryLogicStructure[node.children[0]].label+'"';

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;
				
				case '<': 
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '>=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = '<';
					}
					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', 'xsd:double('+parentVariable+') '+operatorLabel+' '+queryLogicStructure[node.children[0]].label, ')']});
					queryLogicStructure[node.children[0]].variable = queryLogicStructure[node.children[0]].label;

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case '<=':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '>';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = '<=';
					}
					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', 'xsd:double('+parentVariable+') '+operatorLabel+' '+queryLogicStructure[node.children[0]].label, ')']});
					queryLogicStructure[node.children[0]].variable = queryLogicStructure[node.children[0]].label;

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case '>':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '<=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = '>';
					}
					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', 'xsd:double('+parentVariable+') '+operatorLabel+' '+queryLogicStructure[node.children[0]].label, ')']});
					queryLogicStructure[node.children[0]].variable = queryLogicStructure[node.children[0]].label;

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case '>=':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '<';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = '>=';
					}
					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', 'xsd:double('+parentVariable+') '+operatorLabel+' '+queryLogicStructure[node.children[0]].label, ')']});
					queryLogicStructure[node.children[0]].variable = queryLogicStructure[node.children[0]].label;

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case '=':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '!=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}
					else{
						operatorLabel = '=';
					}
					nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', 'xsd:double('+parentVariable+') '+operatorLabel+' '+queryLogicStructure[node.children[0]].label, ')']});
					queryLogicStructure[node.children[0]].variable = queryLogicStructure[node.children[0]].label;

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case 'is date':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '!=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}else{
						operatorLabel = '=';
					}

					if(queryLogicStructure[node.children[0]].penninculo!=''){
						nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(',parentVariable+ ' '+operatorLabel +' "'+queryLogicStructure[node.children[0]].label+'"^^'+queryLogicStructure[node.children[0]].penninculo, ')']});
						queryLogicStructure[node.children[0]].variable = '"'+queryLogicStructure[node.children[0]].label+'"^^'+queryLogicStructure[node.children[0]].penninculo;
					}else{
						nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(','str(' + parentVariable+ ') '+operatorLabel +' "'+queryLogicStructure[node.children[0]].label+'"', ')']});
						queryLogicStructure[node.children[0]].variable = '"'+queryLogicStructure[node.children[0]].label+'"';
					}

					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case 'range':
					//se padre not riscriviamo query else
					if(addNot){
						nodeWhere.push({relatedTo:[node.children[0],node.children[1], node.key, node.parent], content:['FILTER(', '('+parentVariable+' < '+queryLogicStructure[node.children[0]].label+' || '+parentVariable+' > '+queryLogicStructure[node.children[1]].label+')',')']});
						addNot = false;
					}else{
						nodeWhere.push({relatedTo:[node.children[0],node.children[1], node.key], content:['FILTER(','(' + parentVariable+' >= '+queryLogicStructure[node.children[0]].label+' && '+parentVariable+' <= '+queryLogicStructure[node.children[1]].label+')' , ')']});
					}	
					
					for(var i=0; i<node.children.length; i++){
						queryLogicStructure[node.children[i]].variable = queryLogicStructure[node.children[i]].label;
						childQuery = visitSPARQL(node.children[i]); 

						nodeSelect = nodeSelect.concat(childQuery.select);
						nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
						nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
						nodeWhere = nodeWhere.concat(childQuery.where);
					}

					break;
				case 'before':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '>=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}else{
						operatorLabel = '<';
					}

					if(queryLogicStructure[node.children[0]].penninculo!=''){
						nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(', parentVariable+ ' '+operatorLabel +' "'+queryLogicStructure[node.children[0]].label+'"^^'+queryLogicStructure[node.children[0]].penninculo, ')']});
						queryLogicStructure[node.children[0]].variable = '"'+queryLogicStructure[node.children[0]].label+'"^^'+queryLogicStructure[node.children[0]].penninculo;
					}else{
						nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(','str(' + parentVariable+ ') '+operatorLabel +' "'+queryLogicStructure[node.children[0]].label+'"', ')']});
						queryLogicStructure[node.children[0]].variable = '"'+queryLogicStructure[node.children[0]].label+'"';
					}
					
					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;

				case 'after':
					var tempRelatedTo= [];
					tempRelatedTo = tempRelatedTo.concat([node.children[0], node.key]); 
					if(addNot){
						operatorLabel = '<=';
						tempRelatedTo.push(node.parent);
						addNot=false;
					}else{
						operatorLabel = '>';
					}

					if(queryLogicStructure[node.children[0]].penninculo!=''){
						nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(',parentVariable+ ' '+operatorLabel +' "'+queryLogicStructure[node.children[0]].label+'"^^'+queryLogicStructure[node.children[0]].penninculo, ')']});
						queryLogicStructure[node.children[0]].variable = '"'+queryLogicStructure[node.children[0]].label+'"^^'+queryLogicStructure[node.children[0]].penninculo;
					}else{
						nodeWhere.push({relatedTo:tempRelatedTo, content:['FILTER(','str(' + parentVariable+ ') '+operatorLabel +' "'+queryLogicStructure[node.children[0]].label+'"', ')']});
						queryLogicStructure[node.children[0]].variable = '"'+queryLogicStructure[node.children[0]].label+'"';
					}
					childQuery = visitSPARQL(node.children[0]); 

					nodeSelect = nodeSelect.concat(childQuery.select);
					nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
					nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
					nodeWhere = nodeWhere.concat(childQuery.where);

					break;
				case 'range date':
					var rangeChildren=[];
					if(queryLogicStructure[node.children[0]].penninculo != '')
						rangeChildren[0] = '"'+queryLogicStructure[node.children[0]].label+'"^^'+queryLogicStructure[node.children[0]].penninculo;
					else
						rangeChildren[0] = '"'+queryLogicStructure[node.children[0]].label+'"';

					if(queryLogicStructure[node.children[1]].penninculo != '')
						rangeChildren[1] = '"'+queryLogicStructure[node.children[1]].label+'"^^'+queryLogicStructure[node.children[1]].penninculo;
					else
						rangeChildren[1] = '"'+queryLogicStructure[node.children[1]].label+'"';

					if(addNot){
						nodeWhere.push({relatedTo:[node.children[0], node.children[1], node.key, node.parent], content:['FILTER(', '(' + parentVariable+' < '+rangeChildren[0]+') || ('+parentVariable+' > '+rangeChildren[1]+ ')', ')']});
						addNot = false;
					}else{
						nodeWhere.push({relatedTo:[node.children[0], node.children[1], node.key], content:['FILTER(', '(' + parentVariable+' >= '+rangeChildren[0]+') && ('+parentVariable+' <= '+rangeChildren[1]+ ')', ')']});
					}	

					for(var i=0; i<node.children.length; i++){
						queryLogicStructure[node.children[i]].variable = rangeChildren[i];
						childQuery = visitSPARQL(node.children[i]); 

						nodeSelect = nodeSelect.concat(childQuery.select);
						nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
						nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);
						nodeWhere = nodeWhere.concat(childQuery.where);
					}

					break;

				case 'or':
					break;
				case 'xor':
					break;
				case 'and':
					break;

				case 'not':
					addNot = true;
					node.variable = parentVariable;

					for(var i=0; i<node.children.length; i++){ 
						childQuery = visitSPARQL(node.children[i]); 

						nodeSelect = nodeSelect.concat(childQuery.select);
						nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
						nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

						childWhere.push(childQuery.where);
					}

					if(node.children.length==1){
						nodeWhere = nodeWhere.concat(childWhere[0]);
					}

					break;

				case 'optional':
					node.variable = parentVariable; // ??? 

					nodeWhere.push({relatedTo:[node.key], content:['OPTIONAL{']});

					for(var i=0; i<node.children.length; i++){ 
						childQuery = visitSPARQL(node.children[i]); 

						nodeSelect = nodeSelect.concat(childQuery.select);
						nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
						nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

						childWhere.push(childQuery.where);
					}

					if(node.children.length==1){
						nodeWhere = nodeWhere.concat([{relatedTo: childWhere[0][0].relatedTo.concat(node.key), content:childWhere[0][0].content}]);
					}else{
						console.log('OPTIONAL - Are you sure that I can have more than one child or zero?');
					}

					nodeWhere.push({relatedTo:[node.key], content:['}']});
					
					break;

			}

			break;
		case 'result' : 
			for(var i=0; i<node.children.length; i++){ 
				childQuery = visitSPARQL(node.children[i]);

				nodeSelect = nodeSelect.concat(childQuery.select);
				nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
				nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

				childWhere.push(childQuery.where);
			}

			var sameLevelOperator = null;
			if(node.children.length==1){
				nodeWhere = nodeWhere.concat(childWhere[0]);
			}else if(node.children.length > 1){
				sameLevelOperator = queryLogicStructure[node.children[1]].subtype;
			}

			var child = [];
			for(var i = 1; i<node.children.length; i = i+2)
				child.push(node.children[i]);

			switch(sameLevelOperator){
				case 'and':
					for(var i = 0; i < node.children.length; i = i+2){
						nodeWhere = nodeWhere.concat(childWhere[i]);
					}
					break;
				case 'or':
					var block = [];
					for(var i=0; i<childWhere.length; i = i+2){
						block.push(childWhere[i]);
					}
					
					for(var z = 0; z < block.length; z++){

						var fixedBlock = block.splice(0,1)[0];
						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);

						for(var t=0; t<fixedBlock.length; t++)
							nodeWhere = nodeWhere.concat([{relatedTo: fixedBlock[t].relatedTo.concat(child), 
								content:fixedBlock[t].content}]);

						block.splice(block.length,0,fixedBlock);

						for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
							var optionalBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['OPTIONAL{']}]);

							for(var t=0; t<optionalBlock.length; t++)
								nodeWhere = nodeWhere.concat([{relatedTo: optionalBlock[t].relatedTo.concat(child),
									content:optionalBlock[t].content}]);

							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);

							block.splice(block.length, 0, optionalBlock);
						}

						block.splice(block.length,0,(block.splice(0,1)[0]));

						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
						if(z != block.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['UNION']}]);
					}

					break;
				case 'xor':
					for(var i = 0; i < node.children.length; i = i+2){
						nodeWhere = nodeWhere.concat([{relatedTo: child, content:['{']}]);

						for(var j=0; j<childWhere[i].length; j++)
							nodeWhere = nodeWhere.concat([{relatedTo: childWhere[i][j].relatedTo.concat(child), 
								content:childWhere[i][j].content}]);

						if(i == node.children.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['}']}]);
						else
							nodeWhere = nodeWhere.concat([{relatedTo: child, content:['} UNION']}]);

					}
					break;
			}
			
			break;
	}

	nodeQuery.select = nodeSelect;
	nodeQuery.labelSelect = nodeLabelSelect;
	nodeQuery.keySelect = nodeKeySelect;
	nodeQuery.where = nodeWhere;

	//console.log(nodeQuery.where);

	return nodeQuery;

}

function createVariableFromLabel(label, index){
	return label.replace( /[\s \- \' \\ \/ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] \! \@ \# \% \^ \& \= \; \: \" \, \< \> ]/g, "") + "_" + index;
}



