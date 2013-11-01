imoapi-nodejs
=============

Usage of this library is kept as similar as possible to the browser-based API, so this document assumes you already have familiarity with it. If not, check out [the official documentation](https://imo.im/developers/).

Example
-------

The `IMO.Channel` constructor takes two extra parameters: the `ch_id` of the channel you're connecting to, and optionally the token (the part that comes after the `#`). The token can includde or omit the `#` symbol, and if you don't provide one, it will be created for you. Other than that, nothing major changes:

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

Caveats / To Do
---------------

- The server message `session_expired` is not handled.
