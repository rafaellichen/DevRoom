$('.placeholder').on('click', function (ev) {
  	$('.placeholder').css('opacity', '0');
//   var length = $('.list__ul').children('li').length;
//   $('.wrapper').css('height', 88*length+"px");
	if($(this).text()=="?")
		$('.list__ul').children('li').first().hide()
  	$('.list__ul').toggle();
  	$(this).text( $(this).text() ).css('opacity', '1');
});

 $('.list__ul a').on('click', function (ev) {
   ev.preventDefault();
   var index = $(this).parent().index();
//    $('.wrapper').css('height', '');
   $('.placeholder').text( $(this).text() ).css('opacity', '1');
//    console.log($('.list__ul').find('li').eq(index).html());
   $('.list__ul').find('li').eq(index).prependTo('.list__ul');
   $('.list__ul').toggle();   
 });

var allmultiple = document.querySelectorAll('select[name="mc"]')
allmultiple.forEach(function(e) {
	news = new TagSelector(e)
})

// $('textarea').each(function () {
//   this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
// }).on('input', function () {
//   this.style.height = 'auto';
//   this.style.height = (this.scrollHeight) + 'px';
// });

$('div[id="code"]').on('input', function () {
	// this.style.height = 'auto';
	// console.log("-------------")
	// console.log($(this).children(".CodeFlask__textarea").scrollTop())
	// console.log($(this).children(".CodeFlask__textarea").height())
	// if($(this).children(".CodeFlask__textarea").scrollTop())
	// 	this.style.height = $(this).children(".CodeFlask__textarea").scrollTop()*5 + $(this).children(".CodeFlask__textarea").height() + 'px';
});

// const inputElement = document.querySelectorAll('input[type="file"]');
// inputElement.forEach(function(e) {
// 	var pond = FilePond.create(e);
// })
// FilePond.setOptions({
// 	ignoredFiles: ['.ds_store', 'thumbs.db', 'desktop.ini'],
// 	labelIdle: 'Drop files or <span class="filepond--label-action">Browse</span>',
// })

/*
We want to preview images, so we need to register the Image Preview plugin
*/
FilePond.registerPlugin(
	
	// encodes the file as base64 data
  FilePondPluginFileEncode,
	
	// validates the size of the file
	FilePondPluginFileValidateSize,
	
	// corrects mobile image orientation
	FilePondPluginImageExifOrientation,
	
	// previews dropped images
  FilePondPluginImagePreview
);

// Select the file input and use create() to turn it into a pond
FilePond.create(
	document.querySelector('input')
);
FilePond.setOptions({
	ignoredFiles: ['.ds_store', 'thumbs.db', 'desktop.ini'],
	labelIdle: 'Drop files or <span class="filepond--label-action">Browse</span>',
})

$(document).ready(function() {

	var s_round = '.s_round';
  
	$(s_round).hover(function() {
	  $('.b_round').toggleClass('b_round_hover');
	  return false;
	});
  
	$(s_round).click(function() {
	  $('.flip_box').toggleClass('flipped');
	  $(this).addClass('s_round_click');
	  $('.s_arrow').toggleClass('s_arrow_rotate');
	  $('.b_round').toggleClass('b_round_back_hover');
	  return false;
	});
  
	$(s_round).on('transitionend', function() {
	  $(this).removeClass('s_round_click');
	  $(this).addClass('s_round_back');
	  return false;
	});
});

document.getElementById("submit").addEventListener("click", function(){
	console.log("this is submit")
	allresponses = document.querySelectorAll('aside[attribute="question"]')
	responsesubmit = []
	allresponses.forEach(function(curq) {
		if(curq.getAttribute("name")=="text input") {
			responsesubmit.push(curq.id)
			code = document.getElementById(curq.id).getElementsByClassName("CodeFlask__code")[0].innerHTML
			responsesubmit.push(code)
		}
		if(curq.getAttribute("name")=="multiple choice") {
			allchoices = document.getElementById(curq.id).getElementsByClassName("active")
			answer = []
			for(var i=0; i<allchoices.length; i++) {
				answer.push(allchoices[i].innerHTML)
			}
			responsesubmit.push(curq.id)
			responsesubmit.push(answer.join("<!>"))
		}
		if(curq.getAttribute("name")=="single choice") {
			responsesubmit.push(curq.id)
			responsesubmit.push(document.getElementById(curq.id).getElementsByClassName("placeholder")[0].innerHTML)
		}
		if(curq.getAttribute("name")=="file submission") {
			console.log(pond.files);
		}
	})
	console.log(responsesubmit)
});

document.getElementById("save").addEventListener("click", function(){
	console.log("this is save")
});