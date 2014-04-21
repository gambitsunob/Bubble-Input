/*
	JQuery.Bubble-Input.js
	@author - Garrett Hoofman
	@date - 4/17/2014
	
	Todo
		* Modify width of text box appropriately (currently estimated)
 */
( function ( $ ) {
	
	$.fn.bubbleInput = function( options ) {
		if( !options ) {
			if(this[0].bubbleInput) {
				return this[0].bubbleInput;
			}
			options = {};
		}
		
		return this.each(function() {
			var elem = $( this );
			var settings = $.extend({ }, $.fn.bubbleInput.defaults, options );			
			
			var elementList = $('<ul></ul>');
			elementList.addClass('bubble-input');
			elem.append(elementList);
			var autocomplete = $('<div class="bubble-input-autocomplete"><ul></ul></div>');
			elem.append(autocomplete);
			$(autocomplete).bubbleAutoComplete($(this), settings.autocomplete);
			
			function allowDrop(e) {
				e.preventDefault();
			}
			
			function drop(e) {
				e.preventDefault();
				var offset = e.originalEvent.offsetX;
				console.log(offset);
				var text = e.originalEvent.dataTransfer.getData("Text");
				var clss = e.originalEvent.dataTransfer.getData("clss");
				elem[0].bubbleInput.add(text, clss, offset);
				
				elem.find('input').focus();
			}
			
			function AddInput(index) {
				// Remove the input if it's there
				elementList.find('li.input').remove();
				
				// Create the new input
				var ul = elem.find('ul.bubble-input');
				var li = $('<li class="input"></li>');
				var input = $('<input type="text" />');
				li.append(input);
				if(index !== undefined) {
					ul.find('li').eq(index).after(li);
				} else {
					ul.append(li);					
				}
				elementList.find('li.input input').focus();
				
				// Bind Events to the new input
				li.click(function() {
					input.focus();
					return false;
				});
				input.keydown(function(e){
					console.log(e);
					$el = $(this);
					$parent = $el.parent();
					
					$el.width(30 + $el.val().length * 8);
					$parent.width($el.width());
					
					if(e.keyCode === 37 && $el.val() === '') { // Arrow Key Left
						if ($parent.is(':first-child')) return;
						$parent.prev().before($parent);
						$el.focus();
						e.preventDefault();
						return false;
					} else if(e.keyCode === 39 && $el.val() === '') { // Arrow Key Right
						if ($parent.is(':last-child')) return;
						$parent.next().after($parent);
						$el.focus();
						e.preventDefault();
						return false;
					} else if(e.keyCode === 38) { // Arrow Key Up
						autocomplete[0].autocomplete.selectUp();
						e.preventDefault();
						return false;
					} else if(e.keyCode === 40) { // Arrow Key Down
						autocomplete[0].autocomplete.selectDown();
						e.preventDefault();
						return false;
					} else if(e.keyCode === 8 && $el.val() === '') { // Backspace
						var ind = elem.find('li').index($('li.input')) - 1;
						if(ind < 0) return;
						$(elementList.find('li.bubble')[ind]).remove();
						e.preventDefault();
						return false;
					} else if(e.keyCode === 46 && $el.val() === '') { // Delete
						var ind = elem.find('li').index($('li.input'));
						$(elementList.find('li.bubble')[ind]).remove();
						e.preventDefault();
						return false;
					} else if(e.keyCode === 13 && $el.val() !== '') { // Enter
						var ind = elem.find('li').index($('li.input'));
						
						var val = autocomplete[0].autocomplete.select($el.val());
						if(val == null) return false;
						autocomplete[0].autocomplete.clear();
						
						elem[0].bubbleInput.add(val.text, val.clss);
						AddInput(ind);
						$el.focus();
						
						e.preventDefault();
						return false;
					}
					
				});
				input.keyup(function(e) {
					$el = $(this);
					autocomplete[0].autocomplete.search($el.val());
				});
			}
			
			function IndexFromOffset(offset, callback) {
				if(offset === undefined || offset === null) {
					callback && callback();
					return;
				}
				
				var currWidth = 0;
				var currInd = -1;
				console.log(offset);
				if(offset < 10) {
					callback && callback(-1);
					return;
				}
				elem.find('li').each(function() {
					var elemOuterWidth = $(this).outerWidth();
					var elemWidth = $(this).width();
					var sides = elemOuterWidth - elemWidth;
					currWidth += elemOuterWidth;
					if(currWidth< offset) {
						currInd++;
					}
				});
				if(currInd === -1) {
					currInd = 0;
				}
				if(currInd >= elem.find('li').length) {
					currInd--;
				}
				
				callback && callback(currInd);
				
			}
			
			elem[0].bubbleInput = {
				add: function(text, clss, offset) {
					var ind = elem.find('li').index($('li.input')) - 1;
					
					IndexFromOffset(offset, function(off) {
						if(off !== undefined && off !== null) {
							ind = off;
						}						
						var bubble = $('<li class="bubble"><p>' + text + '</p></li>');
						bubble.click(function() {
							elem.find('li.bubble').removeClass('selected');
							$(this).addClass('selected');
							return false;
						});
						if(ind === -1) {
							elem.find('ul.bubble-input').prepend(bubble);
						}else {
							elem.find('ul li').eq(ind).after(bubble);
						}
						if(clss) {
							bubble.addClass(clss);
						}
						
						$('input').focus();
					});
				}
			};
			
			AddInput();
			
			elementList.on("drop", drop);
			elementList.on("dragover", allowDrop);
			
			elem.click(function() {
				AddInput();
			});
			
			return this;
		});
	};
	
	$.fn.bubbleAutoComplete = function( bubbleInput, options ) {
		if( !options ) {
			return this[0].autocomplete;
		}
		
		var settings = $.extend({ }, $.fn.bubbleAutoComplete.defaults, options );
		
		return this.each(function() {
			var elem = $( this );
			elem[0].autocomplete = {
				bubbleInput: bubbleInput,
				selected: -1,
				lastSearch: '',
				
				selectUp: function() {
					var elements = elem.find('ul li');
					if(elements.length == 0) return;
					selected--;
					if(selected < 0) {
						selected = 0;
					}
					
					elements.removeClass('selected');
					$(elements[selected]).addClass('selected');
				},
				selectDown: function() {
					var elements = elem.find('ul li');
					if(elements.length == 0) return;
					selected++;
					if(selected > elements.length - 1) {
						selected = elements.length - 1;
					}
					
					elements.removeClass('selected');
					$(elements[selected]).addClass('selected');					
				},
				search: function(term) {
					if(term === this.lastSearch) return;
					this.lastSearch = term;
					var results = settings.getData(term);
					var autocomplete = elem.find('ul');
					autocomplete.html('');
					selected = -1;
					if(results.length > 0) {
						for(var i = 0; i < results.length; i++) {
							var listing = $('<li>' + results[i].text + '</li>');
							listing.data('clss', results[i].clss);
							listing.click(function() {
								bubbleInput.bubbleInput().add($(this).text(), $(this).data('clss') );
								elem.hide();
							});
							autocomplete.append(listing);
						}
						elem.show();
					} else {
						elem.hide();
					}
				},
				select: function(term) {
					var results = settings.getData(term);
					if(results.length == 0) return null;
					elem.hide();
					if(selected > -1) {
						var result = results[selected];
						selected = -1;
						return result;
					}
					return results[0];
				},
				clear: function() {
					elem.hide();
					selected = -1;
					elem.find('ul').html('');
				}
			};			
			elem[0].autocomplete.clear();
		});
	};
	
	$.fn.bubbleInput.defaults = {
		autocomplete: {
			getData: function(search) {
				return [];
			}
		}
	};
	
	$.fn.bubbleAutoComplete.defaults = { };
} ( jQuery ));