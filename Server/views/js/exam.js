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