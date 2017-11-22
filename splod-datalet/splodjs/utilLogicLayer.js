function createLabel(url){
	var label = '';

	var splittedParts = url.split('/')
	label = splittedParts[splittedParts.length-1];

	splittedParts = label.split('#')
	label = splittedParts[splittedParts.length-1];	

	label = label.replace(/\_/g, " ");

	return label;
}