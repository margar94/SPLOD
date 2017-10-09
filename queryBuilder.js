
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
			for(var i=1; i<node.children.length; i+2){ //only 'and' and 'or' nodes
				child = queryLogicStructure[node.children[i]];
				if(child.type=='operator' && child.label=='and'){
					nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
				}else if(child.type=='operator' && child.label=='or'){//or exclusive
					nodeWhere = nodeWhere.concat(['{'], childWhere[i-1],['} UNION {'], childWhere[i+1],['}']);
				}
				//manage or inclusive
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

				nodeSelect = nodeSelect.concat(childQuery.select);
				nodeLabelSelect = nodeLabelSelect.concat(childQuery.labelSelect);
				nodeKeySelect = nodeKeySelect.concat(childQuery.keySelect);

				childWhere.push(childQuery.where);
			}

			if(node.children.length==1){
				nodeWhere = nodeWhere.concat(childWhere[0]);
			}

			var child;
			for(var i=1; i<node.children.length; i+2){ //only 'and' and 'or' nodes
				child = queryLogicStructure[node.children[i]];
				if(child.type=='operator' && child.label=='and'){
					nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
				}else if(child.type=='operator' && child.label=='or'){//or exclusive
					nodeWhere = nodeWhere.concat(['{'], childWhere[i-1],['} UNION {'], childWhere[i+1],['}']);
				}
				//manage or inclusive
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
					for(var i=1; i<node.children.length; i+2){ //only 'and' and 'or' nodes
						child = queryLogicStructure[node.children[i]];
						if(child.type=='operator' && child.label=='and'){
							nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
						}else if(child.type=='operator' && child.label=='or'){//or exclusive
							nodeWhere = nodeWhere.concat(['{'], childWhere[i-1],['} UNION {'], childWhere[i+1],['}']);
						}
						//manage or inclusive
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
				for(var i=1; i<node.children.length; i+2){ //only 'and' and 'or' nodes
					child = queryLogicStructure[node.children[i]];
					if(child.type=='operator' && child.label=='and'){
						nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
					}else if(child.type=='operator' && child.label=='or'){//or exclusive
						nodeWhere = nodeWhere.concat(['{'], childWhere[i-1],['} UNION {'], childWhere[i+1],['}']);
					}
					//manage or inclusive
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
			for(var i=1; i<node.children.length; i+2){ //only 'and' and 'or' nodes
				child = queryLogicStructure[node.children[i]];
				if(child.type=='operator' && child.label=='and'){
					nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
				}else if(child.type=='operator' && child.label=='or'){//or exclusive
					nodeWhere = nodeWhere.concat(['{'], childWhere[i-1],['} UNION {'], childWhere[i+1],['}']);
				}
				//manage or inclusive
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

			switch(operatorLabel){
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
					//se padre not operatorLabel = '>='; 
				case '<=':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = ">";
					//se padre not operatorLabel = '>'; 
				case '>':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = "<=";
					//se padre not operatorLabel = '<='; 
				case '>=':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = "<";
					//se padre not operatorLabel = '<'; 
				case '=':
					if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
						operatorLabel = "!=";
					//se padre not operatorLabel = '!='; 
					nodeWhere.push('FILTER(');
					nodeWhere.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
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

				case 'or':
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
					for(var i=1; i<node.children.length; i+2){ //only 'and' and 'or' nodes
						child = queryLogicStructure[node.children[i]];
						if(child.type=='operator' && child.label=='and'){
							nodeWhere = nodeWhere.concat(childWhere[i-1], childWhere[i+1]);
						}else if(child.type=='operator' && child.label=='or'){//or exclusive
							nodeWhere = nodeWhere.concat(['{'], childWhere[i-1],['} UNION {'], childWhere[i+1],['}']);
						}
						//manage or inclusive
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

function oldbuildQuery(){
	//visit query implicit tree 
	if(queryLogicStructureRoot != null){
		
		queryLogicStructure[queryLogicStructureRoot].variable = "?"+createVariableFromLabel(queryLogicStructure[queryLogicStructureRoot].label, queryLogicStructure[queryLogicStructureRoot].index);
		visitStack.push(queryLogicStructure[queryLogicStructureRoot]);

		while(visitStack.length != 0){
			var currentNode = visitStack.pop();

			if(currentNode.type=='operator' || 
				   currentNode.parent==null || 
						!(queryLogicStructure[currentNode.parent].type=='operator' 
								&& queryLogicStructure[currentNode.parent].label=='not')){

				for(var i = currentNode.children.length-1; i>=0; i--){

					if(i>0 && ((i%2)==0)){
						if(queryLogicStructure[currentNode.children[i-1]].type=='operator' &&
							queryLogicStructure[currentNode.children[i-1]].label=='or')
								visitStack.push({type:'closeOr', parent:currentNode.key, children:[]});
					}

					if(!(currentNode.type == 'predicate' && currentNode.direction == 'reverse')
						&& queryLogicStructure[currentNode.children[i]].type=='concept')
							queryLogicStructure[currentNode.children[i]].variable = currentNode.variable;
					else
						queryLogicStructure[currentNode.children[i]].variable = "?"+createVariableFromLabel(queryLogicStructure[currentNode.children[i]].label, queryLogicStructure[currentNode.children[i]].index);

					visitStack.push(queryLogicStructure[currentNode.children[i]]);

				}

				if(currentNode.type == 'predicate' && currentNode.direction == 'reverse') // i have only a child
					currentNode.variable = queryLogicStructure[currentNode.children[0]].variable;
			}

			visitSPARQL(currentNode);
		}
		//querySPARQL.limit = false;
	}

	executor.executeUserQuery(querySPARQL);

	console.log(querySPARQL);
}

function oldvisitSPARQL(node){

	//it is used only by predicates
	var parentVariable;

	// select management
	if(!(node.type == 'predicate' && node.direction == 'reverse')){
		if(node.type != 'operator' && node.type != 'result' && node.type != 'closeOr'){

			if(($.inArray(node.variable, querySPARQL.select))<0){
				querySPARQL.select.push(node.variable);
				querySPARQL.labelSelect.push(node.label);
				querySPARQL.keySelect.push(node.key);
			}

			if(node.parent==null)
				parentVariable = "?_";
			else
				parentVariable = queryLogicStructure[node.parent].variable;
		}

	}else{ // node is a reverse predicate
		if(node.parent == null){
			parentVariable = "?"+createVariableFromLabel(node.label, node.index);
			querySPARQL.select.push(parentVariable);
			querySPARQL.labelSelect.push(node.label);
			querySPARQL.keySelect.push(node.key);
		}
		else{
			parentVariable = queryLogicStructure[node.parent].variable;
		}
	}
	
	// where management
	var claus = [];
	if(node.type == 'something'){
		//...
	}else if(node.type == 'concept'){
		claus.push(node.variable);
		claus.push(' a');
		claus.push(' <' + node.url + '>.');
	}else if(node.type == 'predicate'){
		
		var addNot = false;
		if(node.parent!=null && queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
			addNot = true;

		if(addNot){
			claus.push('FILTER(!EXISTS{');
		}

		if(node.direction == 'direct'){
			claus.push(parentVariable);
			claus.push(' <' + node.url + '>');
			claus.push(' '+node.variable+'.');
		}
		else{
			claus.push(node.variable);
			claus.push(' <' + node.url + '>');
			claus.push(' '+parentVariable+'.');
		}

		if(addNot){
			claus.push('})');
		}

	}else if(node.type == 'operator'){

		parentVariable = queryLogicStructure[node.parent].variable;

		var notLabel = "";
		if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
			notLabel = "!";

		var operatorLabel = node.label;

		switch(node.label){
			case 'is url': 
				claus.push('FILTER(');
				claus.push(parentVariable);
				claus.push(notLabel);
				claus.push('=');
				claus.push('<'+queryLogicStructure[node.children[0]].label+'>');
				claus.push(')');
				break;
			
			case 'is string': 
				claus.push('FILTER(');
				claus.push(parentVariable);
				claus.push(notLabel);
				claus.push('=');
				claus.push('"'+queryLogicStructure[node.children[0]].label+'"');
				claus.push(')');
				break;

			case 'contains': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('contains(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")');
				claus.push(')');
				break;

			case 'starts with': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('strStarts(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")');
				claus.push(')');
				break;

			case 'ends with': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('strEnds(xsd:string('+parentVariable+'),"'+queryLogicStructure[node.children[0]].label+'")');
				claus.push(')');
				break;

			case 'lang': 
				claus.push('FILTER(');
				claus.push(notLabel);
				claus.push('LANG('+parentVariable+')="'+queryLogicStructure[node.children[0]].label+'"');
				claus.push(')');
				break;
			
			case '<': 
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = ">=";
				//se padre not operatorLabel = '>='; 
			case '<=':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = ">";
				//se padre not operatorLabel = '>'; 
			case '>':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = "<=";
				//se padre not operatorLabel = '<='; 
			case '>=':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = "<";
				//se padre not operatorLabel = '<'; 
			case '=':
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not')
					operatorLabel = "!=";
				//se padre not operatorLabel = '!='; 
				claus.push('FILTER(');
				claus.push(parentVariable+' '+operatorLabel+' '+queryLogicStructure[node.children[0]].label);
				claus.push(')');
				break;
			case 'range':
				//se padre not riscriviamo query else
				if(queryLogicStructure[node.parent].type == 'operator' && queryLogicStructure[node.parent].label == 'not'){
					claus.push('FILTER(');
					claus.push(parentVariable+' < '+queryLogicStructure[node.children[0]].label+' || '+parentVariable+' > '+queryLogicStructure[node.children[1]].label);
					claus.push(')');
				}else{
					claus.push('FILTER(');
					claus.push(parentVariable+' >= '+queryLogicStructure[node.children[0]].label+' && '+parentVariable+' <= '+queryLogicStructure[node.children[1]].label);
					claus.push(')');
				}	
				break;

			case 'or':
				var lastClaus = querySPARQL.where.pop();
				querySPARQL.where.push(['{']);
				querySPARQL.where.push(lastClaus);
				claus.push('}UNION{');
				break;
			case 'and':
				break;

			case 'not':
				break;

		}

	}else if(node.type == 'closeOr'){
		claus = querySPARQL.where.pop();
		claus.push('}');
	}else{
		//other node
	}		

	querySPARQL.where.push(claus);

}

function createVariableFromLabel(label, index){
	return label.replace( /[\s - \' \\ \/ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] \! \@ \# \% \^ \& \= \; \: \" \, \< \> ]/g, "") + "_" + index;
}



