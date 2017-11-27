var systemLang = 'it';

var LanguageManager = function () {
	if(LanguageManager.prototype._singletonInstance){
		return LanguageManager.prototype._singletonInstance;
	}

	//systemLang = 'en';
	LanguageManager.prototype._singletonInstance = new (eval(systemLang+'LanguageManager'))();
};
