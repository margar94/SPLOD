
var queryLogicStructure;
var queryLogicStructureRoot;
var visitStack;
var querySPARQL;

var executor;

var addNot;

var QueryBuilder = function () {
	if(QueryBuilder.prototype._singletonInstance){
		return QueryBuilder.prototype._singletonInstance;
	}
	
	executor = new QueryExecutor();
	addNot = false;

	QueryBuilder.prototype._singletonInstance = this;
};

QueryBuilder.prototype.updateQuery = function(queryLogicRoot, queryLogicMap){
	queryLogicStructure = queryLogicMap;
	queryLogicStructureRoot = queryLogicRoot;
	visitStack = [];
	querySPARQL = {select:[], labelSelect:[], keySelect:[], where:[]}; //add other field
	buildQuery();
}

function buildQuery(){
	if(queryLogicStructureRoot != null){
		createAllVariable();
		querySPARQL = visitSPARQL(queryLogicStructureRoot);
		console.log(querySPARQL);
	}
	executor.executeUserQuery(querySPARQL);
}

function createAllVariable(){
	for(key in queryLogicStructure){
		var node = queryLogicStructure[key];
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

			var child;
			for(var i=1; i<node.children.length; i = i+2){ //only 'and' and 'or' nodes
				child = queryLogicStructure[node.children[i]];
				if(child.type=='operator' && child.label=='and'){
					if(i==1 || 
						(queryLogicStructure[node.children[i-2]].type=='operator' && queryLogicStructure[node.children[i-2]].label=='and') )
							nodeWhere = nodeWhere.concat(childWhere[i-1]);

						if(i==(node.children.length-2))
							nodeWhere = nodeWhere.concat(childWhere[i+1]);
				}else if(child.type=='operator' && child.label=='xor'){//or exclusive
					nodeWhere = nodeWhere.concat(
						[{relatedTo: [child.key], content:['{']}], 
						[{relatedTo: childWhere[i-1].relatedTo.push(child.key), content:childWhere[i-1].content}],
						[{relatedTo: [child.key], content:['} UNION {']}], 
						[{relatedTo: childWhere[i+1].relatedTo.push(child.key), content:childWhere[i+1].content}],
						[{relatedTo: [child.key], content:['}']}]
						);				
				}else if(child.type=='operator' && child.label=='or'){//or inclusive
					var j = i + 2;
					var block = [];
					block.push(childWhere[i-1]);
					block.push(childWhere[i+1]);

					while((j < node.children.length) && queryLogicStructure[node.children[j]].type == 'operator' && queryLogicStructure[node.children[j]].label == 'or'){
						block.push(childWhere[j+1]);
						j = j + 2;
					}
					i = j - 2;
					
					for(var z = 0; z < block.length; z++){

						var fixedBlock = block.splice(0,1)[0];
						nodeWhere = nodeWhere.concat(
							[{relatedTo: [child.key], content:['{']}],
							[{relatedTo: fixedBlock.relatedTo.push(child.key), content:fixedBlock.content}]
							);

						block.splice(block.length,0,fixedBlock);

						for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
							var optionalBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat(
								[{relatedTo: [child.key], content:['OPTIONAL{']}],
								[{relatedTo: optionalBlock.relatedTo.push(child.key), content:optionalBlock.content}], 
								[{relatedTo: [child.key], content:['}']}]
								);
							block.splice(block.length, 0, optionalBlock);
						}

						block.splice(block.length,0,(block.splice(0,1)[0]));

						nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['}']}]);
						if(z != block.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['UNION']}]);
					}
				}
			}

			break;
		case 'concept' :
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

			//where management
			nodeWhere.push({relatedTo:[node.key], content:[node.variable+' a'+' <'+node.url+'>.']});

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

			var child;
			for(var i=1; i<node.children.length; i = i+2){ //only 'and' and 'or' nodes
				child = queryLogicStructure[node.children[i]];

				if(child.type=='operator' && child.label=='and'){
					if(i==1 || 
						(queryLogicStructure[node.children[i-2]].type=='operator' && queryLogicStructure[node.children[i-2]].label=='and') )
							nodeWhere = nodeWhere.concat(childWhere[i-1]);

						if(i==(node.children.length-2))
							nodeWhere = nodeWhere.concat(childWhere[i+1]);
				}else if(child.type=='operator' && child.label=='xor'){//or exclusive
					nodeWhere = nodeWhere.concat(
						[{relatedTo: [child.key], content:['{']}], 
						[{relatedTo: childWhere[i-1].relatedTo.push(child.key), content:childWhere[i-1].content}],
						[{relatedTo: [child.key], content:['} UNION {']}], 
						[{relatedTo: childWhere[i+1].relatedTo.push(child.key), content:childWhere[i+1].content}],
						[{relatedTo: [child.key], content:['}']}]
						);
				}else if(child.type=='operator' && child.label=='or'){//or inclusive
					var j = i + 2;
					var block = [];
					block.push(childWhere[i-1]);
					block.push(childWhere[i+1]);

					while((j < node.children.length) && queryLogicStructure[node.children[j]].type == 'operator' && queryLogicStructure[node.children[j]].label == 'or'){
						block.push(childWhere[j+1]);
						j = j + 2;
					}
					i = j - 2;
					
					for(var z = 0; z < block.length; z++){

						var fixedBlock = block.splice(0,1)[0];
						nodeWhere = nodeWhere.concat(
							[{relatedTo: [child.key], content:['{']}],
							[{relatedTo: fixedBlock.relatedTo.push(child.key), content:fixedBlock.content}]
							);

						block.splice(block.length,0,fixedBlock);

						for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
							var optionalBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat(
								[{relatedTo: [child.key], content:['OPTIONAL{']}],
								[{relatedTo: optionalBlock.relatedTo.push(child.key), content:optionalBlock.content}], 
								[{relatedTo: [child.key], content:['}']}]
								);
							block.splice(block.length, 0, optionalBlock);
						}

						block.splice(block.length,0,(block.splice(0,1)[0]));

						nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['}']}]);
						if(z != block.length-1)
							nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['UNION']}]);
					}
				}
			}
			break;
		case 'predicate' :
			if(node.direction == 'direct'){
				if(!addNot){
					nodeSelect.push(node.variable);
					nodeLabelSelect.push(node.label);
					nodeKeySelect.push(node.key);
				}

				//where management
				var parentVariable = queryLogicStructure[node.parent].variable;

				var tempRelatedTo = [];
				tempRelatedTo.push(node.key);
				if(addNot){
					nodeWhere = nodeWhere.concat([{relatedTo: [node.parent], content:'FILTER(!EXISTS{'}]);	
					tempRelatedTo.push(node.parent);
				}
				nodeWhere = nodeWhere.concat([{relatedTo: tempRelatedTo, content:[parentVariable+ ' <'+node.url+'> '+ node.variable+'.']}]);

				if(!addNot){
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

					var child;
					for(var i=1; i<node.children.length; i = i+2){ //only 'and' and 'or' nodes
						child = queryLogicStructure[node.children[i]];
						if(child.type=='operator' && child.label=='and'){
							if(i==1 || 
								(queryLogicStructure[node.children[i-2]].type=='operator' && queryLogicStructure[node.children[i-2]].label=='and') )
								nodeWhere = nodeWhere.concat(childWhere[i-1]);

							if(i==(node.children.length-2))
								nodeWhere = nodeWhere.concat(childWhere[i+1]);
						}else if(child.type=='operator' && child.label=='xor'){//or exclusive
							nodeWhere = nodeWhere.concat(
								[{relatedTo: [child.key], content:['{']}], 
								[{relatedTo: childWhere[i-1].relatedTo.push(child.key), content:childWhere[i-1].content}],
								[{relatedTo: [child.key], content:['} UNION {']}], 
								[{relatedTo: childWhere[i+1].relatedTo.push(child.key), content:childWhere[i+1].content}],
								[{relatedTo: [child.key], content:['}']}]
							);						
						}else if(child.type=='operator' && child.label=='or'){//or inclusive
							var j = i + 2;
							var block = [];
							block.push(childWhere[i-1]);
							block.push(childWhere[i+1]);

							while((j < node.children.length) && queryLogicStructure[node.children[j]].type == 'operator' && queryLogicStructure[node.children[j]].label == 'or'){
								block.push(childWhere[j+1]);
								j = j + 2;
							}
							i = j - 2;
							
							for(var z = 0; z < block.length; z++){

								var fixedBlock = block.splice(0,1)[0];
								nodeWhere = nodeWhere.concat(
									[{relatedTo: [child.key], content:['{']}],
									[{relatedTo: fixedBlock.relatedTo.push(child.key), content:fixedBlock.content}]
									);

								block.splice(block.length,0,fixedBlock);

								for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
									var optionalBlock = block.splice(0,1)[0];
									nodeWhere = nodeWhere.concat(
										[{relatedTo: [child.key], content:['OPTIONAL{']}],
										[{relatedTo: optionalBlock.relatedTo.push(child.key), content:optionalBlock.content}], 
										[{relatedTo: [child.key], content:['}']}]
										);
									block.splice(block.length, 0, optionalBlock);
								}

								block.splice(block.length,0,(block.splice(0,1)[0]));

								nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['}']}]);
								if(z != block.length-1)
									nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['UNION']}]);
							}
						}
					}
				}   

				if(addNot){
					nodeWhere = nodeWhere.concat([{relatedTo: [node.parent], content:['})']}]);
					addNot = false;
				}

			}else if(node.direction == 'reverse'){

				var parentVariable = queryLogicStructure[node.parent].variable;
				node.variable = queryLogicStructure[node.children[0]].variable;

				var tempRelatedTo = [];
				tempRelatedTo.push(node.key);
				if(addNot){
					nodeWhere = nodeWhere.concat([{relatedTo: [node.parent], content:'FILTER(!EXISTS{'}]);
					tempRelatedTo.push(node.parent);	
				}
				nodeWhere = nodeWhere.concat([{relatedTo: tempRelatedTo, content:[node.variable+ ' <'+node.url+'> '+ parentVariable+'.']}]);

				//visit 'something' node
				childQuery = visitSPARQL(node.children[0]); 

				nodeSelect = nodeSelect.concat(childQuery.select);
				nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
				nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

				nodeWhere = nodeWhere.concat(childQuery.where);
				
				if(addNot){
					nodeWhere = nodeWhere.concat([{relatedTo: [node.parent], content:['})']}]);	
					addNot = false;
				}

			}
			break;
		case 'something' : 
			nodeSelect.push(node.variable);
			nodeLabelSelect.push(node.label);
			nodeKeySelect.push(node.key);

			if(!addNot){
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

				var child;
				for(var i=1; i<node.children.length; i = i+2){ //only 'and' and 'or' nodes
					child = queryLogicStructure[node.children[i]];
					if(child.type=='operator' && child.label=='and'){
						if(i==1 || 
							(queryLogicStructure[node.children[i-2]].type=='operator' && queryLogicStructure[node.children[i-2]].label=='and') )
									nodeWhere = nodeWhere.concat(childWhere[i-1]);

							if(i==(node.children.length-2))
								nodeWhere = nodeWhere.concat(childWhere[i+1]);
					}else if(child.type=='operator' && child.label=='xor'){//or exclusive
						nodeWhere = nodeWhere.concat(
							[{relatedTo: [child.key], content:['{']}], 
							[{relatedTo: childWhere[i-1].relatedTo.push(child.key), content:childWhere[i-1].content}],
							[{relatedTo: [child.key], content:['} UNION {']}], 
							[{relatedTo: childWhere[i+1].relatedTo.push(child.key), content:childWhere[i+1].content}],
							[{relatedTo: [child.key], content:['}']}]
						);
					}else if(child.type=='operator' && child.label=='or'){//or inclusive
						var j = i + 2;
						var block = [];
						block.push(childWhere[i-1]);
						block.push(childWhere[i+1]);

						while((j < node.children.length) && queryLogicStructure[node.children[j]].type == 'operator' && queryLogicStructure[node.children[j]].label == 'or'){
							block.push(childWhere[j+1]);
							j = j + 2;
						}
						i = j - 2;
						
						for(var z = 0; z < block.length; z++){
							var fixedBlock = block.splice(0,1)[0];
							nodeWhere = nodeWhere.concat(
								[{relatedTo: [child.key], content:['{']}],
								[{relatedTo: fixedBlock.relatedTo.push(child.key), content:fixedBlock.content}]
								);

							block.splice(block.length,0,fixedBlock);

							for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
								var optionalBlock = block.splice(0,1)[0];
								nodeWhere = nodeWhere.concat(
									[{relatedTo: [child.key], content:['OPTIONAL{']}],
									[{relatedTo: optionalBlock.relatedTo.push(child.key), content:optionalBlock.content}], 
									[{relatedTo: [child.key], content:['}']}]
									);
								block.splice(block.length, 0, optionalBlock);
							}

							block.splice(block.length,0,(block.splice(0,1)[0]));

							nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['}']}]);
							if(z != block.length-1)
								nodeWhere = nodeWhere.concat([{relatedTo: [child.key], content:['UNION']}]);
						}
					}
				}
			}

			break;
		case 'operator': 
			var parentVariable = queryLogicStructure[node.parent].variable;

			/*var notLabel = "";
			if(addNot){
				notLabel = "!";
				addNot=false;
			}*/

			var claus = [];
			var operatorLabel = node.label;
			var switchOperatorLabel = node.label;

			switch(switchOperatorLabel){
				case 'is url': 
					if(addNot){
						operatorLabel = '!=';
						addNot=false;
					}
					else{
						operatorLabel = '=';
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable + operatorLabel + '<'+queryLogicStructure[node.children[0]].label+'>' + ')'});
					break;
				
				case 'is string': 
					if(addNot){
						operatorLabel = '!=';
						addNot=false;
					}
					else{
						operatorLabel = '=';
					}

					if(queryLogicStructure[node.children[0]].lang != null)
						nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable + operatorLabel + '"'+queryLogicStructure[node.children[0]].label +'"@' + queryLogicStructure[node.children[0]].lang + ')'});
					else
						nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(str(' + parentVariable +')'+ operatorLabel + '"'+queryLogicStructure[node.children[0]].label + '")'});
					break;

				case 'contains': 
					if(addNot){
						operatorLabel = '!contains';
						addNot=false;
					}
				
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + operatorLabel + '(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")' + ')'});
					break;

				case 'starts with': 
					if(addNot){
						operatorLabel = '!strStarts';
						addNot=false;
					}
					else{
						operatorLabel = 'strStarts';
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + operatorLabel + '(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")' + ')'});
					break;

				case 'ends with': 
					if(addNot){
						operatorLabel = '!strEnds';
						addNot=false;
					}
					else{
						operatorLabel = 'strEnds';
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + operatorLabel + '(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")' + ')'});
					break;

				case 'lang': 
					if(addNot){
						operatorLabel = '!lang';
						addNot=false;
					}
					
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + operatorLabel + '('+parentVariable+')="'+queryLogicStructure[node.children[0]].label+'"' + ')'});
					break;
				
				case '<': 
					if(addNot){
						operatorLabel = '>=';
						addNot=false;
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')'});
					break;

				case '<=':
					if(addNot){
						operatorLabel = '>';
						addNot=false;
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')'});
					break;

				case '>':
					if(addNot){
						operatorLabel = '<=';
						addNot=false;
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')'});
					break;

				case '>=':
					if(addNot){
						operatorLabel = '<';
						addNot=false;
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')'});
					break;

				case '=':
					if(addNot){
						operatorLabel = '!=';
						addNot=false;
					}
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')'});
					break;

				case 'is date':
					if(addNot){
						operatorLabel = '!=';
						addNot=false;
					}else{
						operatorLabel = '=';
					}
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+ ' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")' + ')'});
					break;

				case 'range':
					//se padre not riscriviamo query else
					if(addNot){
						nodeWhere.push({relatedTo:[node.children[0],node.children[1], node.key], content:'FILTER('+ parentVariable+' < '+queryLogicStructure[node.children[0]].label+' || '+parentVariable+' > '+queryLogicStructure[node.children[1]].label +')'});
						addNot = false;
					}else{
						nodeWhere.push({relatedTo:[node.children[0],node.children[1], node.key], content:'FILTER(' + parentVariable+' >= '+queryLogicStructure[node.children[0]].label+' && '+parentVariable+' <= '+queryLogicStructure[node.children[1]].label + ')'});
					}	
					break;
				case 'before':
					if(addNot){
						operatorLabel = '>=';
						addNot=false;
					}else{
						operatorLabel = '<';
					}
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+ ' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")' + ')'});
					break;

				case 'after':
					if(addNot){
						operatorLabel = '<=';
						addNot=false;
					}else{
						operatorLabel = '>';
					}
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push({relatedTo:[node.children[0], node.key], content:'FILTER(' + parentVariable+ ' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")' + ')'});
					break;
				case 'range date':
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					if(addNot){
						nodeWhere.push({relatedTo:[node.children[0], node.children[1], node.key], content:'FILTER(' + parentVariable+' < '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'") || '+parentVariable+' > '+conversionFunction+'("'+queryLogicStructure[node.children[1]].label+'")' + ')'});
						addNot = false;
					}else{
						nodeWhere.push({relatedTo:[node.children[0], node.children[1], node.key], content:'FILTER(' + parentVariable+' >= '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'") && '+parentVariable+' <= '+conversionFunction+'("'+queryLogicStructure[node.children[1]].label+'")' + ')'});
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
					/*
					var child;
					for(var i=1; i<node.children.length; i = i+2){ //only 'and' and 'or' nodes
						child = queryLogicStructure[node.children[i]];
						if(child.type=='operator' && child.label=='and'){
							if(i==1 || 
								(queryLogicStructure[node.children[i-2]].type=='operator' && queryLogicStructure[node.children[i-2]].label=='and') )
								nodeWhere = nodeWhere.concat(childWhere[i-1]);

							if(i==(node.children.length-2))
								nodeWhere = nodeWhere.concat(childWhere[i+1]);
						}else if(child.type=='operator' && child.label=='xor'){//or exclusive
							nodeWhere = nodeWhere.concat(['{'], childWhere[i-1],['} UNION {'], childWhere[i+1],['}']);
						}else if(child.type=='operator' && child.label=='or'){//or inclusive
							var j = i + 2;
							var block = [];
							block.push(childWhere[i-1]);
							block.push(childWhere[i+1]);

							while((j < node.children.length) && queryLogicStructure[node.children[j]].type == 'operator' && queryLogicStructure[node.children[j]].label == 'or'){
								block.push(childWhere[j+1]);
								j = j + 2;
							}
							i = j - 2;
							
							for(var z = 0; z < block.length; z++){

								var fixedBlock = block.splice(0,1)[0];
								nodeWhere = nodeWhere.concat(['{'],fixedBlock);

								block.splice(block.length,0,fixedBlock);

								for(var numberOfOptional = 0; numberOfOptional < block.length-1; numberOfOptional++){
									var optionalBlock = block.splice(0,1)[0];
									nodeWhere = nodeWhere.concat(['OPTIONAL{'],optionalBlock, ['}']);
									block.splice(block.length, 0, optionalBlock);
								}

								block.splice(block.length,0,(block.splice(0,1)[0]));

								nodeWhere = nodeWhere.concat(['}']);
								if(z != block.length-1)
									nodeWhere = nodeWhere.concat(['UNION']);
							}
						}
					}*/
					break;

				case 'optional':
					node.variable = parentVariable; // ??? 

					nodeWhere.push({relatedTo:[node.key], content:'OPTIONAL{'});

					for(var i=0; i<node.children.length; i++){ 
						childQuery = visitSPARQL(node.children[i]); 

						nodeSelect = nodeSelect.concat(childQuery.select);
						nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
						nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

						childWhere.push(childQuery.where);
					}

					if(node.children.length==1){
						nodeWhere = nodeWhere.concat(childWhere[0]);
					}else{
						console.log('OPTIONAL - Are you sure that I can have more than one child or zero?');
					}

					nodeWhere.push({relatedTo:[node.key], content:'}'});
					
					break;

			}

			break;
		case 'result' : 
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



