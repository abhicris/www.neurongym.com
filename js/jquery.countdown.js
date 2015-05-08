/*
 *
 * based on original tutorial by Martin Angelov http://tutorialzine.com/2011/12/countdown-jquery/ 
 *
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */

(function($){
	
	var days	 = 24*60*60,
		hours	 = 60*60,
		minutes	 = 60,
		
		triforce = false,
		iminor   = 0,
		imajor   = 0,
		shiftA   = 1,
		shiftB   = -1,
		
		typenum = ["days", "hours", "minutes", "seconds"],
		markup  = '<span class="position"><span class="digit static">0</span></span>';

	$.fn.countdown = function(prop){
		
		var options = $.extend({
			callback  : function(){},
			timestamp : 0,
			triforce  : false,
			shift     : 0,
			txt_sltr  : '#counttype'
		},prop);
		
		var left, d, h, m, s, positions;

		init(this, options);
		
		positions = this.find('.position');
		
		(function tick() {
			
			left = Math.floor((options.timestamp - (new Date())) / 1000);
			left = (left>0)?left:0;
			
			if(d+h+m+s == 0) {  // can't skip last second, so don't use 'left' variable here  
				options.callback();
			} else {
				imajor = (triforce)?1:0;
				iminor = (triforce)?2:1;

				d = Math.floor(left/days);
				updateDigit(d, true);
				left -= d*days;

				h = Math.floor(left/hours);
				updateDigit(h);
				left -= h*hours;

				m = Math.floor(left/minutes);
				updateDigit(m);
				left -= m*minutes;

				s = left;
				updateDigit(s);
			
				setTimeout(tick, 1000);
			}
		})(); //tick
		

		function updateDigit(value, isDays) {
	
			switchDigit(positions.eq(imajor), Math.floor(value/10)%10);
			switchDigit(positions.eq(iminor), value%10);
	
			if ((isDays)&&(triforce)) {
				switchDigit(positions.eq(0), Math.floor(value/100)%100);
			}
					
			imajor += 2;
			iminor = imajor + 1;		
		}
		return this;
	}; // countdown

	function init(elem, options){
		
		var ie8bug = [];
		shiftA = options.shift;
		shiftB = -shiftA;
		triforce = options.triforce;
		
		if ((Math.floor(((options.timestamp - (new Date())) / 1000) / days)) > 99) { triforce = true }
		
		elem.addClass('countdownHolder');
		
		$.each(typenum,function(i){
			ie8bug.push(((i==0)&&(triforce))?'<span class="count'+this+'">'+markup+markup+markup+'</span>':'<span class="count'+this+'">'+markup+markup+'</span>')
		});		
		
		elem.append(ie8bug.join('<span class="countdownSep"></span>'));

		if ($(options.txt_sltr).length) {
	    	$(options.txt_sltr).html('<p>'+typenum.join("</p><p>")+'</p>');
	    	if (triforce) {$(options.txt_sltr+' p:eq(0), '+options.txt_sltr+' p:eq(1)').css('padding-left', '30px')}
   		}
	} //init

	function switchDigit(position,number){
		
		var digit = position.find('.digit');
		
		if(digit.is(':animated')){return false}
		if(position.data('digit') == number){return false}
		
		position.data('digit', number);
		
		var replacement = $('<span>', {'class':'digit', css:{top: -shiftA+'px', opacity: 0}, html: number});
		
		digit.before(replacement).removeClass('static').animate({top: shiftB+'px',opacity:0},'fast',function(){digit.remove();})

		replacement.delay(100).animate({top:0,opacity:1},'fast',function(){replacement.addClass('static');});
	} //switchDigit
	
})(jQuery);