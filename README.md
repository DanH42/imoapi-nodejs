*Note: The original imo.im API is no longer functional. This was only a client-side library, which means that without a server instance to connect to it's rendered fairly useless. The source is being left here in case anyone finds it interesting.*

imoapi-nodejs
=============

Usage of this library is kept as similar as possible to the browser-based API, so this document assumes you already have familiarity with it. If not, check out [the official documentation](https://imo.im/developers/).

Example
-------

The `IMO.Channel` constructor takes two extra parameters: the `ch_id` of the channel you're connecting to, and optionally the token (the part that comes after the `#`). The token can include or omit the `#` symbol, and if you don't provide a token, one will be created for you. Other than that, nothing major changes:

```javascript
var IMO = require('imoapi');

var channel = null;

function connect(){
	var client = {
		connect: function(){
			console.log("Connected! :)");
			channel.subscribe([{type: "event_queue", name: "message"}], 0);
		},
		event_queue: function(name, event){
			console.log(name, event);
		}
	};
	return new IMO.Channel(client, "12345678901234567890", "#qwertyuiopzxcvbnm");
};

channel = connect();
```

Caveats / To Do
---------------

- The server message `session_expired` is not handled.
