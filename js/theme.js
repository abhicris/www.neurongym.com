/****************************************************************
	Window load event
 ****************************************************************/
$(window).load(function() {

	//Hide loader
	$('#loader').fadeOut(500, function() {
		$('#loader').hide();

		// Start twitter feed plugin
		$("#twitter-ticker").tweet({
			
			// Twitter feed settings
			modpath      : "./twitter/",
			username     : "pixelstance",
			page         : 1,
			avatar_size  : 32,
			count        : 20,
			loading_text : "loading tweets..."
			
		}).bind("loaded", function() {
			var ul = $(this).find(".tweet_list");
			var ticker = function() {
				setTimeout(function() {
					var top = ul.position().top;
					var h = ul.height();
					var incr = (h / ul.children().length);
					var newTop = top - incr;
					if (h + newTop <= 0) newTop = 0;
					ul.animate( {top: newTop}, 500 );
					ticker();
				}, 5000);
			};
			ticker();
        });

 	});
 	
});

/****************************************************************
	Document ready event
 ****************************************************************/
$(document).ready(function(){

/****************************************************************
	Template variables 
 ****************************************************************/
/* Animation settings */
	var animation_show     = true,
		animation_init     = true,

/* Page scroll animation */
		scroll_animated    = true,
		scroll_easing      = 'easeOutQuint',
		scroll_duration    = 900,

/* Countdown settings */
		countdown_date     = new Date("July 10, 2014"),
		countdown_triforce = false,
		countdown_call     = function(){},
		
/* Overlay settings */		
		overlay_src        = 'images/overlays/14.png',
		overlay_imgopacity = '0.4',
		overlay_bgopacity  = '0.4',
		
/* Background settings */		
		vegas_backgrounds  = [
								{ src : 'images/backgrounds/abstract.jpg', fade : 2500 },
								{ src : 'images/backgrounds/winter-road.jpg', fade : 2500 }	
							 ],

/* Subscription form messages */							 
		form_msg           = {
			 normal        : 'Address ({EMAIL}) is added',
			 err_server    : 'Unexpected server error',
			 err_ajax      : 'Please try again later...',
			 err_incorrect : 'Please enter the correct address'
		},
		
/* Other settings */
		countdown_show     = true,
		navigation_show    = true,
		arrows_show        = true,
		height_care	       = false;
		
/****************************************************************
	Internal variables 
 ****************************************************************/
	var page_width         = $(window).width(), 
		page_height        = $(window).height(),
	
		full_height        = $('.full_height'),
		vcentred           = $('.vcentered'),
		formState          = $('#formstate'),
		
	    formNormal         = formState.html(),
	    
		section_list       = ['home', 'getintouch', 'subscribe'],
		
		countdown_sel      = '#countdown',
		countdown_txt      = '#counttype',
		countdown_parent   = '#timer-holder',
		
		content_wrap       = $('#content-wrap').css("background-color"),
		full_viewport      = $('html,body')
		unique_call        = false,
		is_mobile          = ($('#ismobile').css('display') == 'none') ? true : false;
		
/****************************************************************
	Internal functions 
 ****************************************************************/
	function validMail(email) {
  		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  		return regex.test(email);
	} // validMail
	
	function scut(sel) {return sel.substr(1)}
	
	function sorc(sel) {
  		return (sel.indexOf('#') === -1) ? 'class' : 'id'; 
	} // sorc

	function toggleCSS (sel, dir, up, invert) {
		dir = (invert) ? dir : !dir;
		
		if (up) {
			var show_t = 'showDown',
				hide_t = 'hideUp';
		} else {
			var show_t = 'showUp',
				hide_t = 'hideDown';			
		}

		if (dir) {
			sel.removeClass(show_t);
			sel.animate({ opacity: 0 }, 500);
			sel.addClass(hide_t);
		} else {
			sel.removeClass(hide_t);
			sel.animate({ opacity: 1 }, 500);
			sel.addClass(show_t);
		}
	} // toggleCSS

	function setupPage(sel) {
		$(sel).css("height", page_height);
		$(sel).find('.ancor-out').css('top', page_height / 2);
	} // setupPage
	
	function correctHeight() {
		full_height.each(function(k, sel) {
			if (height_care) {
				if ($(sel).height() < page_height) {
					setupPage(sel);
				}

			} else {
				setupPage(sel);
			} // if (height_care)
		});
	} // correctHeight

	function correctVCenter() {
		vcentred.each(function(k, sel) {
			$(sel).css('padding-top', ($(sel).parent().height() - $(sel).height()) / 2);
		});
	} // correctVCenter

	function formStateChange(msg, ms, selfc) {
		selfc = (selfc === undefined) ? false : true;
		formState.animate({ opacity: 0 },{
			duration: 100,
			complete: function(){
				formState.html(msg);
				formState.animate({ opacity: 1 }, {
					duration: 200,
					complete: function(){
						if (!selfc) {
							formStateChange(formNormal, 1, true);
						}
					}
				}).delay(ms);
     		}
		});
	} // formStateChange

/****************************************************************
	Event holders
 ****************************************************************/
	// Navigaton and arrow clicks
	if (scroll_animated) {
		$('a[href*=#]').click(function() {
			$.scrollTo($($(this).attr("href")), {
        		duration : scroll_duration,
        		easing   : scroll_easing,
        		axis     : 'y'
    		});
    		return false;
		})
	}

	// Ajax form submit
   	$("#sb-submit").click( function(e) {
		var sbemail = $("#sb-email").val();
		if (sbemail != unique_call ) {
			unique_call = sbemail;			
			if (validMail(sbemail)) {
				$.ajax({
					type: "POST",
					url: "subscribe.php",
					data: 'sbemail='+ sbemail,
					success: function(msg) {
						if(msg=='Added') {
							formStateChange(form_msg['normal'].replace('{EMAIL}', sbemail), 2000);
						} else {
							formStateChange(form_msg['err_server'], 2000);
						}
					},
					error: function() {
						formStateChange(form_msg['err_ajax'], 2000);
					}
				});
			} else {
				formStateChange(form_msg['err_incorrect'].replace('{EMAIL}', sbemail), 1000);
			}
		}
		return false;
	});
	
	// Resize event
	$(window).resize(function(){
		page_width = $(window).width();
		page_height = $(window).height();
  		correctHeight();
  		correctVCenter();
	});	
	
/****************************************************************
	Initialization
 ****************************************************************/
	// Let's disable animation for mobile devices 
	if (is_mobile) {
		animation_show = false;
		animation_init = false;
	}
	
	// Hide arrows
	if (!arrows_show) {
		$('.arrow-wrap').hide();
	}
	
	// Correct page background
	if (content_wrap.indexOf('rgba') !== -1) {
		$('#content-wrap').css("background-color", content_wrap.substring(0,(content_wrap.lastIndexOf(',')+1))+overlay_bgopacity+')');
	}

	// Create animation triggers
	$.each(section_list, function(i, sel){
		$('#'+sel).prepend('<div id="'+sel+'-in" class="ancor-in"></div>');  // reserved 
		$('#'+sel).append('<div id="'+sel+'-out" class="ancor-out"></div>'); // main triggers (#home-out, #getintouch-out, #subscribe-out)
	});
	
	// Create countdown
	if (countdown_show) {
		
		//Fix markup
		$(countdown_parent).append('<div '+sorc(countdown_sel)+'="'+scut(countdown_sel)+'" class="hidden-phone"></div>');
		$(countdown_parent).append('<div '+sorc(countdown_txt)+'="'+scut(countdown_txt)+'" class="hidden-phone"></div>');		

		//Start plugin
		$(countdown_sel).countdown({
			timestamp : countdown_date,
			callback  : countdown_call,
			triforce  : countdown_triforce,
			txt_sltr  : countdown_txt
		});
		
	} // if (countdown_show)
	
	// Height correction
	correctHeight();
	correctVCenter();

	if (animation_show || animation_init) {
		
		// Get animation selectors
		var	top_f1  = $('#home').find('.fade1'), 
			top_f2  = $('#home').find('.fade2'),
			top_f3  = $('#home').find('.logo'),
			git_f1  = $('#getintouch').find('.fade1'),
			git_f2  = $('#getintouch').find('.fade2'),
			sub_f1  = $('#subscribe').find('.fade1'),
			sub_f2  = $('#subscribe').find('.fade2');
			
		// Hide #geiintouch and #subscribe animated elements
		if (animation_show) {
			git_f1.css({ opacity: 0 });
			git_f2.css({ opacity: 0 });
			sub_f1.css({ opacity: 0 });
			sub_f2.css({ opacity: 0 });
		}
			
		if (animation_init) {
			
			// Hide #home animated elements
			top_f1.css({ opacity: 0 });
			top_f2.css({ opacity: 0 });
			top_f3.css({ opacity: 0 });
			
			// Initial #home animation			
			toggleCSS( top_f1, false, true,  true );
			toggleCSS( top_f2, false, false, true );
			top_f3.animate({ opacity: 1  }, 1500);
			
		} // if (animation_init)
		
	} // if (animation_show || animation_init)
	
	// Setup animation waypoints
	if (animation_show) {
		
		$('#home-out').waypoint(function(event, dir) {
			dir = (dir === 'down') ? true : false;
			toggleCSS( top_f1, dir, true,  true );
			toggleCSS( top_f2, dir, false, true );
			toggleCSS( git_f1, dir, true,  false );
			toggleCSS( git_f2, dir, false, false );
		});

		$('#getintouch-out').waypoint(function(event, dir) {
			dir = (dir === 'down') ? true : false;
			toggleCSS( git_f1, dir, true,  true );
			toggleCSS( git_f2, dir, false, true );
			toggleCSS( sub_f1, dir, true,  false );
			toggleCSS( sub_f2, dir, false, false );
		});
		
	} // if (animation_show)
	
	// Setup navigation waypoint
	if (navigation_show) {

		var top_nav = $('#top-header');
	
		$('#home-out').waypoint(function(event, dir) {
			dir = (dir === 'down') ? true : false;
			top_nav.animate({ top: ((dir) ? '0' : '-70px') }, 800);
			
		});
		
	} // if (navigation_show)
	
	// Start Vegas plugin
	$.vegas('slideshow', {
			backgrounds : vegas_backgrounds,
			loading     : false
		})('overlay', {
			src         : overlay_src,
			opacity     : overlay_imgopacity 
	});

});

