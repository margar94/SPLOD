function highlightElementsToRemove(){
	var IDtoRemove = $('.highlighted').attr('meta-removereference');
	if(IDtoRemove != undefined){
		var spanToRemove = document.getElementById(IDtoRemove).parentNode.querySelectorAll('span');
		document.getElementById(IDtoRemove).parentNode.className += ' highlightRemove';

		$.each(spanToRemove, function(index){
			spanToRemove[index].className += ' highlightRemove';
		});
	}
}

function removeHighlightElementsToRemove(){
	var toRemoveHightlight = $('.highlightRemove');

	$.each(toRemoveHightlight, function(index){
		toRemoveHightlight[index].setAttribute('class', toRemoveHightlight[index].getAttribute('class').replace(' highlightRemove', ''));
	});
}

function filter(inputName, boxName) {
    var input, filter, box, li, text, i;
    input = document.getElementById(inputName);
    filter = input.value.toLowerCase();
   	box = document.getElementById(boxName);
    li = box.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        text = li[i].innerHTML;
        if (text.toLowerCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function isImage(url){
    return ((url.toLowerCase()).match(/^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png|svg)/)!=null);
}
