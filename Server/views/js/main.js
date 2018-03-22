var config = {
    apiKey: "AIzaSyDRO_VABdZ977j8sGa0bgecv3tWiJb1AvI",
    authDomain: "c4q-grading-system.firebaseapp.com",
    databaseURL: "https://c4q-grading-system.firebaseio.com",
    projectId: "c4q-grading-system",
    storageBucket: "c4q-grading-system.appspot.com",
    messagingSenderId: "282583165744"
};
firebase.initializeApp(config);

jQuery(document).ready(function(){
	Jackbox.init()
	if( $('.cd-stretchy-nav').length > 0 ) {
		var stretchyNavs = $('.cd-stretchy-nav');
		stretchyNavs.each(function(){
			var stretchyNav = $(this),
				stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');
			stretchyNavTrigger.on('click', function(event){
				event.preventDefault();
				stretchyNav.toggleClass('nav-is-visible');
			});
		});
		$(document).on('click', function(event){
			( !$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span') ) && stretchyNavs.removeClass('nav-is-visible');
		});
	}
});
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

$('a[name="logout"]').on("click", function() {
	uid = firebase.auth().currentUser.uid
	Jackbox.information("Logging out. Energize!")
	setTimeout(function(){
		firebase.auth().signOut().then(function() {
			window.location.replace("/revoke/"+uid)
		})
	}, 2000);
})

$('a[name="home"]').on("click", function() {
	firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
		window.location.replace("/"+idToken)
	})
})

$('a[name="exam"]').on("click", function() {
	window.location.replace("/exam")
})

$('a[name="profile"]').on("click", function() {
	// window.location.replace("/profile")
})

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

var question3 = new TagSelector(document.getElementById('question3'));

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