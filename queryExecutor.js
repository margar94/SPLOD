/*
var systemEndpoint = 'http://live.dbpedia.org/sparql';
var systemGraph = null;
var systemQueryExecutor = 'livedbpediaLike';
*/

var systemEndpoint = 'http://dbpedia.org/sparql';
var systemGraph = '<http://dbpedia.org>';
var systemQueryExecutor = 'dbpediaLike';

var QueryExecutor = function () {	
	if(QueryExecutor.prototype._singletonInstance){
		return QueryExecutor.prototype._singletonInstance;
	}

	QueryExecutor.prototype._singletonInstance = new (eval(systemQueryExecutor+''))(systemEndpoint, systemGraph);
};