
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
			nodeSelect.push(node.variable);
			nodeLabelSelect.push(node.label);
			nodeKeySelect.push(node.key);

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
					nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
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
						}
						break; 

					default : //only reverse predicate is permitted
						nodeSelect.push(node.variable);
						nodeLabelSelect.push(node.label);
						nodeKeySelect.push(node.key);
						break;
				} 
			}else{
				nodeSelect.push(node.variable);
				nodeLabelSelect.push(node.label);
				nodeKeySelect.push(node.key);
			}

			//where management
			nodeWhere = nodeWhere.concat([node.variable, ' a', ' <'+node.url+'>.']);

			for(var i=0; i<node.children.length; i++){ 
				childQuery = visitSPARQL(node.children[i]);
				console.log(childQuery); 

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
			console.log(child);
				if(child.type=='operator' && child.label=='and'){
					nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
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

				if(addNot)
					nodeWhere = nodeWhere.concat('FILTER(!EXISTS{');	
				nodeWhere = nodeWhere.concat([parentVariable, ' <'+node.url+'> ', node.variable+'.']);

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
							nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
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
					}
				}   

				if(addNot){
					nodeWhere = nodeWhere.concat(['})']);
					addNot = false;
				}

			}else if(node.direction == 'reverse'){
				var parentVariable;

				if(node.parent == null){
					nodeSelect.push(node.variable);
					nodeLabelSelect.push(node.label);
					nodeKeySelect.push(node.key);

					parentVariable = node.variable;
				}else{
					node.variable = queryLogicStructure[node.children[0]].variable;

					parentVariable = queryLogicStructure[node.parent].variable;
				}

				nodeWhere = nodeWhere.concat([node.variable, ' <'+node.url+'> ', parentVariable+'.']);

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
						nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
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
				}

			}
			break;
		case 'something' : 
			nodeSelect.push(node.variable);
			nodeLabelSelect.push(node.label);
			nodeKeySelect.push(node.key);

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
					nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
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
			}

			break;
		case 'operator': 
			var parentVariable = queryLogicStructure[node.parent].variable;

			var notLabel = "";
			if(addNot){
				notLabel = "!";
				addNot=false;
			}

			var claus = [];
			var operatorLabel = node.label;
			var switchOperatorLabel = node.label;

			switch(switchOperatorLabel){
				case 'is url': 
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable);
					nodeWhere.push(notLabel);
					nodeWhere.push('=');
					nodeWhere.push('<'+queryLogicStructure[node.children[0]].label+'>');
					nodeWhere.push(')');

					break;
				
				case 'is string': 
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable);
					nodeWhere.push(notLabel);
					nodeWhere.push('=');
					nodeWhere.push('"'+queryLogicStructure[node.children[0]].label+'"');
					nodeWhere.push(')');
					break;

				case 'contains': 
					nodeWhere.push('FILTER(');
					nodeWhere.push(notLabel);
					nodeWhere.push('contains(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")');
					nodeWhere.push(')');
					break;

				case 'starts with': 
					nodeWhere.push('FILTER(');
					nodeWhere.push(notLabel);
					nodeWhere.push('strStarts(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")');
					nodeWhere.push(')');
					break;

				case 'ends with': 
					nodeWhere.push('FILTER(');
					nodeWhere.push(notLabel);
					nodeWhere.push('strEnds(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")');
					nodeWhere.push(')');
					break;

				case 'lang': 
					nodeWhere.push('FILTER(');
					nodeWhere.push(notLabel);
					nodeWhere.push('LANG('+parentVariable+')="'+queryLogicStructure[node.children[0]].label+'"');
					nodeWhere.push(')');
					break;
				
				case '<': 
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = ">=";
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
					nodeWhere.push(')');
					break;

				case '<=':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = ">";
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
					nodeWhere.push(')');
					break;

				case '>':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = "<=";
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
					nodeWhere.push(')');
					break;

				case '>=':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = "<";
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
					nodeWhere.push(')');
					break;

				case '=':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = "!=";
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
					nodeWhere.push(')');
					break;

				case 'is date':
					operatorLabel = '='; 
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = "!=";

					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+ ' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")');
					nodeWhere.push(')');
					break;

				case 'range':
					//se padre not riscriviamo query else
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not'){
						nodeWhere.push('FILTER(');
						nodeWhere.push(parentVariable+' < '+queryLogicStructure[node.children[0]].label+' || '+parentVariable+' > '+queryLogicStructure[node.children[1]].label);
						nodeWhere.push(')');
					}else{
						nodeWhere.push('FILTER(');
						nodeWhere.push(parentVariable+' >= '+queryLogicStructure[node.children[0]].label+' && '+parentVariable+' <= '+queryLogicStructure[node.children[1]].label);
						nodeWhere.push(')');
					}	
					break;
				case 'before':
					operatorLabel = '<';
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = '>=';

					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")');
					nodeWhere.push(')');
					break;

				case 'after':
					operatorLabel = '>';
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = '<=';

					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")');
					nodeWhere.push(')');
					break;
				case 'range date':
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not'){
						nodeWhere.push('FILTER(');
						nodeWhere.push(parentVariable+' < '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'") || '+parentVariable+' > '+conversionFunction+'("'+queryLogicStructure[node.children[1]].label+'")');
						nodeWhere.push(')');
					}else{
						nodeWhere.push('FILTER(');
						nodeWhere.push(parentVariable+' >= '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'") && '+parentVariable+' <= '+conversionFunction+'("'+queryLogicStructure[node.children[1]].label+'")');
						nodeWhere.push(')');
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

					var child;
					for(var i=1; i<node.children.length; i = i+2){ //only 'and' and 'or' nodes
						child = queryLogicStructure[node.children[i]];
						if(child.type=='operator' && child.label=='and'){
							nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
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
					}
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

	console.log(nodeQuery);

	return nodeQuery;

}

function createVariableFromLabel(label, index){
	return label.replace( /[\s \- \' \\ \/ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] \! \@ \# \% \^ \& \= \; \: \" \, \< \> ]/g, "") + "_" + index;
}



