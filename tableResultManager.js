
var TableResultManager = function () {
	if(TableResultManager.prototype._singletonInstance){
		return TableResultManager.prototype._singletonInstance;
	}
	TableResultManager.prototype._singletonInstance = this;
};

TableResultManager.prototype.updateTable = function(select, labelSelect, results){
	renderResultTable(select, labelSelect, results);
}

TableResultManager.prototype.resetTable = function(){
	resetResultTable();
}