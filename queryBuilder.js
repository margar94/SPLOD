
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
			nodeWhere = nodeWhere.concat([node.variable+' a'+' <'+node.url+'>.']);

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
				nodeWhere = nodeWhere.concat([parentVariable+ ' <'+node.url+'> '+ node.variable+'.']);

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
					parentVariable = queryLogicStructure[node.parent].variable;
				}
				
				node.variable = queryLogicStructure[node.children[0]].variable;

				nodeWhere = nodeWhere.concat([node.variable+ ' <'+node.url+'> '+ parentVariable+'.']);

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
						//nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]); ERROR

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
					nodeWhere.push('FILTER(' + parentVariable + operatorLabel + '<'+queryLogicStructure[node.children[0]].label+'>' + ')');
					break;
				
				case 'is string': 
					if(addNot){
						operatorLabel = '!=';
						addNot=false;
					}
					else{
						operatorLabel = '=';
					}
					nodeWhere.push('FILTER(' + parentVariable + operatorLabel + '"'+queryLogicStructure[node.children[0]].label+'"@' + queryLogicStructure[node.children[0]].lang + ')');
					break;

				case 'contains': 
					if(addNot){
						operatorLabel = '!contains';
						addNot=false;
					}
				
					nodeWhere.push('FILTER(' + operatorLabel + '(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")' + ')');
					break;

				case 'starts with': 
					if(addNot){
						operatorLabel = '!strStarts';
						addNot=false;
					}
					else{
						operatorLabel = 'strStarts';
					}
					nodeWhere.push('FILTER(' + operatorLabel + '(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")' + ')');
					break;

				case 'ends with': 
					if(addNot){
						operatorLabel = '!strEnds';
						addNot=false;
					}
					else{
						operatorLabel = 'strEnds';
					}
					nodeWhere.push('FILTER(' + operatorLabel + '(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")' + ')');
					break;

				case 'lang': 
					if(addNot){
						operatorLabel = '!lang';
						addNot=false;
					}
					
					nodeWhere.push('FILTER(' + operatorLabel + '('+parentVariable+')="'+queryLogicStructure[node.children[0]].label+'"' + ')');
					break;
				
				case '<': 
					if(addNot){
						operatorLabel = '>=';
						addNot=false;
					}
					nodeWhere.push('FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')');
					break;

				case '<=':
					if(addNot){
						operatorLabel = '>';
						addNot=false;
					}
					nodeWhere.push('FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')');
					break;

				case '>':
					if(addNot){
						operatorLabel = '<=';
						addNot=false;
					}
					nodeWhere.push('FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')');
					break;

				case '>=':
					if(addNot){
						operatorLabel = '<';
						addNot=false;
					}
					nodeWhere.push('FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')');
					break;

				case '=':
					if(addNot){
						operatorLabel = '!=';
						addNot=false;
					}
					nodeWhere.push('FILTER(' + parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label + ')');
					break;

				case 'is date':
					if(addNot){
						operatorLabel = '!=';
						addNot=false;
					}else{
						operatorLabel = '=';
					}
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push('FILTER(' + parentVariable+ ' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")' + ')');
					break;

				case 'range':
					//se padre not riscriviamo query else
					if(addNot){
						nodeWhere.push('FILTER('+ parentVariable+' < '+queryLogicStructure[node.children[0]].label+' || '+parentVariable+' > '+queryLogicStructure[node.children[1]].label +')');
						addNot = false;
					}else{
						nodeWhere.push('FILTER(' + parentVariable+' >= '+queryLogicStructure[node.children[0]].label+' && '+parentVariable+' <= '+queryLogicStructure[node.children[1]].label + ')');
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
					nodeWhere.push('FILTER(' + parentVariable+ ' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")' + ')');
					break;

				case 'after':
					if(addNot){
						operatorLabel = '<=';
						addNot=false;
					}else{
						operatorLabel = '>';
					}
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					nodeWhere.push('FILTER(' + parentVariable+ ' '+operatorLabel +' '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'")' + ')');
					break;
				case 'range date':
					var conversionFunction = 'xsd:'+queryLogicStructure[node.children[0]].datatype;
					if(addNot){
						nodeWhere.push('FILTER(' + parentVariable+' < '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'") || '+parentVariable+' > '+conversionFunction+'("'+queryLogicStructure[node.children[1]].label+'")' + ')');
						addNot = false;
					}else{
						nodeWhere.push('FILTER(' + parentVariable+' >= '+conversionFunction+'("'+queryLogicStructure[node.children[0]].label+'") && '+parentVariable+' <= '+conversionFunction+'("'+queryLogicStructure[node.children[1]].label+'")' + ')');
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

					nodeWhere.push('OPTIONAL{');

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

					nodeWhere.push('}');
					
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



