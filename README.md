imoapi-nodejs
=============

Usage of this library is kept as similar as possible to the browser-based API, so this README assumes you already have familiarity with it. If not, check out [the official documentation](https://imo.im/developers/).

Example
-------

The `IMO.Channel` constructor takes one extra parameter: the `ch_id` of the channel you're connecting to. Other than that, nothing major changes:

    var IMO = require('imoapi');
    
    var channel = null;
    
    function connect(){
    	var client = {
    		connect: function(){
    			console.log("Connected! :)");
    			channel.subscribe([{type: "event_queue", name: "message"},], 0);
    		},
    		event_queue: function(name, event){
    			console.log(name, event);
    		}
    	};
    	return new IMO.Channel(client, "12345678901234567890");
    };
    
    channel = connect();

Caveats / To Do
---------------

- Currently you will be assigned a random token each time you connect to a channel, and can not set your own.
- The server message `session_expired` is not handled.
