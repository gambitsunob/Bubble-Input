Bubble-Input
============

## Include the bubble input script
```html
<script src="jquery.bubble-input.js"></script>
```

## Initialize the bubble input
```javascript
$('#bubbleInput').bubbleInput();
```

## Using auto-complete
```javascript
$('#bubbleInput').bubbleInput({
	autocomplete: {
		getData: function(search) {
			if(search === '') {
				return [];
			}
			var words = [
				{ text: 'hello', clss: 'variable' }, 
				{ text: 'help', clss: 'variable' }, 
				{ text: 'helpful', clss: 'variable' }, 
				{ text: '&&', clss: 'operation' }, 
				{ text: '||', clss: 'operation' }, 
				{ text: '<', clss: 'operation' }, 
				{ text: '>', clss: 'operation' }, 
				{ text: '==', clss: 'operation' }, 
				{ text: '!=', clss: 'operation' }, 
				{ text: '(', clss: 'operation' }, 
				{ text: ')', clss: 'operation' }, 
			];
			var results = [];
			for(var i = 0; i < words.length; i++) {
				if(words[i].text.indexOf(search) > -1) {
					results.push(words[i]);
				}
			}
			return results;
		}
	}
});
```
