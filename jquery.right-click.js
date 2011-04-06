frame = null;

( function(){
	
	var methods = {
			
			setMenu : function(menu_list){
				var rClickList = $('<ul id="rightclick-list"></ul>');
				
				jQuery.each(menu_list, function(index, menuObj){
					var listItem = $('<li></li>').addClass('rightclick-list-item');
					var link = $('<a></a>').html(menuObj.text).attr('href', '#')
											.addClass('rightclick-list-item-label').click(function(event){
						event.preventDefault();
						$('#rightclick').hide('slow', function(){
							menuObj.callback();
						});
					});
					
					listItem.append(link);
					rClickList.append(listItem);
				});
				
				return rClickList;
			},
			
			init : function(menu_list){
				
				$(document).ready(function() {  
					  
				     //this one line will disable the right mouse click menu  
				     $(document)[0].oncontextmenu = function() {return false;}; 	  
				});  
				
				var rClickFrame = $('<div id="rightclick"></div>').hide();
				var rClickList = methods.setMenu(menu_list);
				
				rClickFrame.append(rClickList);
				$('body').append(rClickFrame);
				
				/* Bind right click to close the rightClick menu */
				$('body').mousedown(function(event){
					if(event.which == 1){
						var el = $('#rightclick');
						var menuOffsetX = el.offset().left;
						var menuOffsetY = el.offset().top;
						var menuWidth = el.width();
						var menuHeight = el.height();
						
						if(
								event.pageX < menuOffsetX ||
								event.pageX > (menuOffsetX + menuWidth) ||
								event.pageY < menuOffsetY ||
								event.pageY > (menuOffsetY + menuHeight)
						 ){
							$('#rightclick').hide('slow');
						}
					}
				});
				
				$('body').mousedown(function(event){
					
					if(event.which == 3){
						event.preventDefault();
						$('#rightclick').css('top', event.pageY-10 + 'px').css('left', event.pageX-10);
						$('#rightclick').show();
						$('#rightclick').css('position', 'absolute');
					}
					
				});
			}
	};
	
	var options = {
			'frame-class' : '.rightclick-frame',
			'list-class' : '.rightclick-list',
			'list-item-class' : '.rightclick-list-item',
			'list-item-label-class' : '.rightclick-list-label-item'
	};
	
	$.fn.rightClick = function(method){
		
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods[method].apply(this, arguments);
		}
		else {
			$.error('Method ' + method + 'does not exist on jQuery.rightClick');
		}
	};
	
})( jQuery );