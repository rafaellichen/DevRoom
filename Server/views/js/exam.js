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

// FilePond.registerPlugin(
// 	FilePondPluginFileEncode,
// 	FilePondPluginFileValidateSize,
// 	FilePondPluginImageExifOrientation,
// 	FilePondPluginImagePreview
// );
// const inputElement = document.querySelectorAll('input[type="file"]');
// inputElement.forEach(function(e) {
// 	console.log(e.id)
// 	FilePond.create(
// 		document.querySelector(String(e.id))
// 	);
// 	console.log(e.id.split(" ").join(""))
// 	console.log(e)
// 	eval(e.id.split(" ").join("") + " = " + "FilePond.create(e)");
// 	eval(e.id.split(" ").join("")+`.setOptions({
// 		ignoredFiles: ['.ds_store', 'thumbs.db', 'desktop.ini'],
// 		labelIdle: 'Drop files or <span class="filepond--label-action">Browse</span>',
// 	})`);
// 	pond.setOptions({
// 		ignoredFiles: ['.ds_store', 'thumbs.db', 'desktop.ini'],
// 		labelIdle: 'Drop files or <span class="filepond--label-action">Browse</span>',
// 	})
// })

// Select the file input and use create() to turn it into a pond
// FilePond.create(
// 	document.querySelectorAll('input')
// );
// FilePond.setOptions({
// 	ignoredFiles: ['.ds_store', 'thumbs.db', 'desktop.ini'],
// 	labelIdle: 'Drop files or <span class="filepond--label-action">Browse</span>',
// })

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
			allfiles = document.getElementById(curq.id+" file").files
			var downf = []
			for(var i=0; i<allfiles.length; i++) {
				var file = allfiles[i]
				var storageRef = firebase.storage().ref().child(firebase.auth().currentUser.uid+"/"+
																												document.getElementById(curq.id+" file").getAttribute("examid")+
																												"/"+file.name);
				// downf.push(storageRef.put(file).then(function(snapshot) {
				// 	return snapshot.metadata.downloadURLs
				// })[0])
				storageRef.put(file)
				downf.push(firebase.auth().currentUser.uid+"/"+
									document.getElementById(curq.id+" file").getAttribute("examid")+
									"/"+file.name)
			}
			responsesubmit.push(curq.id)
			if(downf.length==0) responsesubmit.push("")
			else responsesubmit.push(downf.join("<!>"))
		}
	})
	console.log(responsesubmit)
	responsesubmit.push(firebase.auth().currentUser.uid)
	responsesubmit.push(document.getElementsByName("thiswillbeexamid")[0].getAttribute("id"))
	$.ajax({
		url: '/submitresponse',
		type: 'POST',
		data: {
				responsesubmit
		},
		success: function(data){
			Jackbox.success("Submission Successful");
		}
});
});