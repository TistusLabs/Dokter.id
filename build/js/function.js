$(document).ready(function(){
	//open & close dropdwon
	if($('.Input--clickable').html()){
		$('.Input--clickable').click(function(){
			$('.Input--clickable').removeClass('Input--focus');
			if($(this).siblings('.InputSelect').is(':hidden')){
				$('.InputSelect').removeClass('InputSelect--open');
				$(this).addClass('Input--focus');
				$(this).siblings('.InputSelect').addClass('InputSelect--open');
			}else{
				$('.InputSelect').removeClass('InputSelect--open');
				$(this).siblings('.InputSelect').removeClass('InputSelect--open');
			}
		});
		//set dropdown text & value
		$('.InputSelect__option').click(function(){
			var value = $(this).attr('value');
			var text = $(this).html();
			$(this).parent().siblings('input[type=hidden]').attr('value',value);
			$(this).parent().siblings('.Input--clickable').html(text);
		});
	    //set input file
	    $('.Input--hidden').change(function(){
	    	var name = $(this).attr('placeholder');
	    	try{
	    		name = $(this)[0].files[0].name;
	    	}catch(e){}
	    	$(this).siblings('.Input--clickable').html(name);
	    });
	}
	//trigger dropdown if icon clicked
	if($('.InputIcon__container').html()){
		$('.InputIcon__container').click(function(){
			$(this).siblings('.Input--clickable').click();
		});
	}
	//close dropdown & remove focus;
	$('body').on('click', function (e) {
        if (!$('.Input--clickable').is(e.target) && !$('.InputIcon__container').is(e.target) 
        	&& $('.Input--clickable').has(e.target).length === 0 && $('.InputIcon__container').has(e.target).length === 0) {
            $('.InputSelect').removeClass('InputSelect--open');
			$('.Input--clickable').removeClass('Input--focus');
        }
        if (!$('.CardProfile__avaibility').is(e.target) && $('.CardProfile__avaibility').has(e.target).length === 0) {
            $('.Dropdown').removeClass('Dropdown--open');
        }
    });
    //navbar halaman profile
	if($('.ProfileNav').html()){
		$('.ProfileNav__nav').click(function(){
			if(!$(this).hasClass('ProfileNav__nav--active'))
			{
				$('.ProfileNav__nav').toggleClass('ProfileNav__nav--active');
				$('.ProfileNav__nav-content').toggleClass('ProfileNav__nav-content--active');
			}
		});
	}
	//avaibility change halaman dashboard doctor
	if($('.CardProfile__avaibility').html()){
		$('.CardProfile__avaibility').click(function(){
			$('.Dropdown').toggleClass('Dropdown--open');
		});
		$('.Dropdown__option').click(function(){
			var value = $(this).attr('data-value');
			var icon = $(this).attr('data-icon');
			$('.Dropdown').toggleClass('Dropdown--open');
			if(value)
			{
				$('.CardProfile__avaibility-text').html(value);
				$('.CardProfile__status').attr('src',icon);
			}
		});
	}
});