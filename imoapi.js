var WebSocket = require('ws');

exports.WS_SERVER_IP = "wss://api2-" + (Math.random() + "").substring(2) + ".imoapi.com/websocket";
(function(){
	if(!exports.miniY){
		exports.miniY = {};
	}
	var a = exports.miniY;
	a.later = function(b, c, i, g, e){
		b = b || 0;
		var d = function(){
			i.call(c, g);
		};
		var h = (e) ? setInterval(d, b) : setTimeout(d, b);
		return {
			id: h,
			interval: e,
			cancel: function(){
				if(this.interval){
					clearInterval(h);
				}else{
					clearTimeout(h);
				}
			}
		};
	};
	a.mix = function(e, d, b){
		for(var c in d){
			if(d.hasOwnProperty(c) && (b || !e.hasOwnProperty(c))){
				e[c] = d[c];
			}
		}
	};
}());
(function(){
	if(!exports.miniY){
		exports.miniY = {};
	}
	var a = exports.Utils,
		b = exports.miniY;
	b.mix(b, {
		addEventListener: function(c, d, e){
			if(c.attachEvent){
				c.attachEvent("on" + d, e);
				return true;
			}
			if(c.addEventListener){
				c.addEventListener(d, e, false);
				return true;
			}
			return false;
		},
		removeEventListener: function(c, d, e){
			if(c.detachEvent){
				c.detachEvent("on" + d, e);
				return true;
			}else{
				if(c.removeEventListener){
					c.removeEventListener(d, e, false);
					return true;
				}
			}
			return false;
		},
		addWindowEventListener: function(c, d){
			return b.addEventListener(window, c, d);
		},
		removeWindowEventListener: function(c, d){
			return b.removeEventListener(window, c, d);
		}
	});
}());
(function(){
	function c(e){
		var f = 0;
		return parseFloat(e.replace(/\./g, function(){
			++f;
			return(f === 1) ? "" : ".";
		}));
	}
	if(!exports.miniY){
		exports.miniY = {};
	}
	var d = exports.miniY,
		b = "",
		a = b && b.match(/MSIE\s([^;]*)/);
	d.UA = {
		is_ie: ((+"\v1") !== 1),
		ie: a && c(a[0])
	};
}());
if(!exports.config){
	exports.config = {};
}
exports.config.debug = true;
(function(){
	function b(d, c){
		return function(e){
			d[c].call(d, e);
		};
	}
	exports.log = function(c){
		if(!exports.config || !exports.config.debug){
			return;
		}
		console.log(c);
	};
}());
if(!exports.Utils){
	exports.Utils = {};
}(function(){
	var a = exports.Utils;
	a.mix = ((typeof Y !== "undefined") && Y.mix) || exports.miniY.mix;
	a.later = ((typeof Y !== "undefined") && Y.later) || exports.miniY.later;
	a.dfl = function(c, b){
		return c === undefined ? b : c;
	};
	a.trim = function(b){
		return b.replace(/^\s+|\s+$/g, "");
	};
	a.forprop = function(d, b, c){
		for(var e in d){
			if(d.hasOwnProperty(e)){
				b.call(c, e, d[e]);
			}
		}
	};
}());
(function(){
	if(!exports.Utils){
		exports.Utils = {};
	}
	exports.Utils.Queue = function(){
		var a = [];
		var b = 0;
		this.get_length = function(){
			return(a.length - b);
		};
		this.is_empty = function(){
			return(a.length === 0);
		};
		this.enqueue = function(c){
			a.push(c);
		};
		this.dequeue = function(){
			if(a.length === 0){
				return undefined;
			}
			var c = a[b];
			a[b] = null;
			++b;
			if(b * 2 >= a.length){
				a = a.slice(b);
				b = 0;
			}
			return c;
		};
		this.peek = function(){
			return(a.length > 0 ? a[b] : undefined);
		};
	};
}());
(function(){
	var a = exports.Utils;
	var e = function(f){
		return Math.floor((f - 1) / 2);
	};
	var c = function(f){
		return 2 * f + 1;
	};
	var d = function(f){
		return 2 * f + 2;
	};
	exports.Utils.BinHeap = function b(f){
		if(!f){
			f = function(g){
				return g;
			};
		}
		this.key_fn = f;
		this.arr = [];
	};
	a.mix(exports.Utils.BinHeap.prototype, {
		push: function(g){
			var f = this.arr.length;
			var j = this.key_fn(g);
			var h = e(f);
			while((f > 0) && (j < this.heap_val(h))){
				this.arr[f] = this.arr[h];
				f = h;
				h = e(f);
			}
			this.arr[f] = g;
		},
		pop: function(){
			if(this.arr.length === 0){
				return null;
			}
			var f = this.arr[0];
			this.arr[0] = this.arr[this.arr.length - 1];
			this.arr.length--;
			this.heapify(0);
			return f;
		},
		is_empty: function(){
			return this.arr.length === 0;
		},
		root: function(){
			if(this.arr.length === 0){
				return null;
			}
			return this.arr[0];
		},
		heapify: function(j){
			var f = c(j);
			var k = d(j);
			var m = this.arr.length;
			var h;
			if((f < m) && (this.heap_val(f) < this.heap_val(j))){
				h = f;
			}else{
				h = j;
			}if((k < m) && (this.heap_val(k) < this.heap_val(h))){
				h = k;
			}
			if(h !== j){
				var g = this.arr[j];
				this.arr[j] = this.arr[h];
				this.arr[h] = g;
				this.heapify(h);
			}
		},
		heap_val: function(f){
			return this.key_fn(this.arr[f]);
		}
	});
}());
(function(){
	var b = exports.Utils;
	var a = 2 * 60 * 1000;
	b.ExpBackoff = function(d, f, g, e){
		this.context = d;
		this.func = f;
		this.data = g;
		this.backoff = 0;
		this.max_backoff = e || a;
		this.state = b.ExpBackoff.IDLE_STATE;
		this.connect_later = null;
	};
	var c = b.ExpBackoff;
	b.mix(c, {
		IDLE_STATE: "idle",
		CONNECTING_STATE: "connecting",
		GAVE_UP_STATE: "gave_up",
		WAITING_STATE: "waiting",
		ABANDONED_STATE: "abandoned"
	});
	b.mix(exports.Utils.ExpBackoff.prototype, {
		connect: function(){
			if(this.state !== c.IDLE_STATE){
				return;
			}
			this.state = c.WAITING_STATE;
			this.connect_later = b.later(this.backoff, this, this.do_connect, null, false);
		},
		abandon: function(){
			if(this.state === c.ABANDONED_STATE){
				return;
			}
			if(this.connect_later){
				this.connect_later.cancel();
				this.connect_later = null;
			}
			this.state = c.ABANDONED_STATE;
		},
		on_success: function(){
			if(this.state !== c.CONNECTING_STATE){
				return;
			}
			this.backoff = 0;
			this.state = c.IDLE_STATE;
		},
		on_give_up: function(){
			if(this.state !== c.CONNECTING_STATE){
				return;
			}
			this.state = c.GAVE_UP_STATE;
		},
		on_failure: function(){
			if(this.state !== c.CONNECTING_STATE){
				return;
			}
			this.backoff = this.backoff === 0 ? 1000 : this.backoff * 2;
			if(this.backoff > this.max_backoff){
				this.backoff = this.max_backoff;
			}
			this.state = c.IDLE_STATE;
			this.connect();
		},
		do_connect: function(){
			this.connect_later = null;
			this.state = c.CONNECTING_STATE;
			this.func.call(this.context, this.data);
		}
	});
}());
(function(){
	if(!exports.Transport)
		exports.Transport = {};
	var d, h = 0,
		i = false,
		a = false,
		c = [],
		f = [],
		e = function(j){
			console.log(d);
			setTimeout(function(){
				j[0].call(j[1], (d));
			}, 0);
		}, g = function(){
			for(var j = 0; j < f.length; ++j){
				e(f[j]);
			}
			f = [];
		};
	exports.Transport.add_transport = function(k, j){
		c.push([k, j]);
	};
	exports.Transport.select = function(j, k){
		f.push([j, k]);
		if(i){
			h++;
			g();
			return;
		}
		if(a){
			return;
		}
		a = true;
		c.sort(function(o, n){
			return n[0] - o[0];
		});
		var m = 0;
		var l = c[m][1];
		l(function(n){
			d = n;
			i = true;
			h++;
			g();
		});
	};
	exports.Transport.on_channel_object_destroy = function(){
		h--;
		if(h === 0){
			i = false;
			a = false;
			d = null;
		}
	};
}());
(function(){
	if(!exports.Transport){
		exports.Transport = {};
	}
	var a = exports.Utils,
		d = a.ExpBackoff,
		b = exports.Transport;

	function f(g){
		var h = g.code;
		if(h < 300){
			return "ok";
		}else{
			if(h >= 500){
				return "fail";
			}else{
				return "fatal";
			}
		}
	}
	var e = function(j, g, i, h){
		a.mix(this, {
			eb: new a.ExpBackoff(this, this.do_request, null),
			xdr_obj: j,
			cb_obj: h,
			call_param: {
				url: g,
				data: i,
				context: this,
				cb: this.request_cb
			}
		});
	};
	a.mix(e.prototype, {
		connect: function(){
			this.eb.connect();
		},
		do_request: function(){
			this.xdr_obj.make_request(this.call_param);
		},
		request_cb: function(g){
			var h = f(g);
			if(h === "ok"){
				this.eb.on_success();
				this.cb_obj.success.call(this.cb_obj.context, g.result);
				return;
			}
			if(h === "fail"){
				this.eb.on_failure();
				return;
			}
			this.eb.on_give_up();
			this.cb_obj.fatal.call(this.cb_obj.context);
		}
	});
	var c = function(g){
		this.xdr_obj = g;
		this._create_poll_request();
	};
	a.mix(c.prototype, {
		init: function(g){
			g.context = g.context || g;
			this.cb_obj = g;
		},
		destroy: function(){
			this.cb_obj = null;
			this.poll_eb.abandon();
			this.xdr_obj.destroy();
			this.xdr_obj = null;
		},
		rpc: function(i, h, g){
			new e(this.xdr_obj, "/a/" + i + "/" + escape(h.cid), h, g).connect();
		},
		flush: function(){
			if(this.poll_eb.state === d.CONNECTING_STATE){
				this.poll_eb.abandon();
				this._create_poll_request();
			}
			this.poll_eb.connect();
		},
		_create_poll_request: function(){
			this.poll_eb = new d(this, this._send_poll_request);
		},
		_send_poll_request: function(){
			var h = this.cb_obj.object_to_send.call(this.cb_obj.context);
			var g = this.poll_eb;
			this.xdr_obj.make_request({
				url: "/a/poll/" + escape(h.cid),
				data: h,
				context: this,
				cb: function(j){
					var i = f(j);
					if(i === "ok"){
						g.on_success();
						this.cb_obj.connection_status.call(this.cb_obj.context, exports.Channel.CONNECTED);
						this.cb_obj.recv.call(this.cb_obj.context, j.result);
						g.connect();
					}else{
						if(i === "fail"){
							this.cb_obj.connection_status.call(this.cb_obj.context, exports.Channel.NETWORK_PROBLEMS);
							this.poll_eb.on_failure();
						}else{
							this.poll_eb.on_give_up();
							this.cb_obj.fatal.call(this.cb_obj.context);
						}
					}
				}
			});
		}
	});
	b.create_from_xdr = function(j, g, h){
		var i = j && new c(j);
		setTimeout(function(){
			g.call(h, i);
		}, 0);
	};
}());
(function(){
	var a = exports.Utils,
		b = exports.Transport;
	exports.Channel = function(k, ch_id){
		this.id = null;
		this.public_client_id = null;
		this.client_token = null;
		this.ssid = null;
		this._debug_mode = true;
		this.error_dict = {};
		var l = "#";
		if(l.length > 1){
			this.client_token = l.substr(1);
		}
		var c = "?ch_id=" + ch_id;
		var m = c.substring(c.indexOf("?") + 1);
		var o = c.substr(0, c.indexOf("?"));
		if(m.length > 0){
			var e = m.replace("#", "&").split("&");
			for(var g = 0; g < e.length; g++){
				var f = e[g].split("=");
				if(f.length === 2){
					if(this.id === null && f[0] === "ch_id"){
						this.id = unescape(f[1]);
					}
				}
			}
		}
		if(this.id === null){
			var d = "" + (Math.floor(Math.random() * (1 << 31)));
			d += (new Date().getTime());
			var n = o + "?ch_id=" + d;
			if(this.client_token !== null){
				n += "#" + this.client_token;
			}
			console.log("New URL: " + n);
		}
		this.seq = 0;
		this.ack = 0;
		this.outgoing_queue = new exports.Utils.Queue();
		this.incoming_queue = {
			members: {},
			heap: new exports.Utils.BinHeap(function(h){
				return h.seq;
			})
		};
		this.callback_context = k;
		this.websocket_connection = null;
		this._connect_to_server();
		this.connected = false;
		this.disconnected = false;
		this._connection_status = exports.Channel.NOT_CONNECTED;
		this.websocket_initial_exp_backoff = 250;
		this.websocket_exp_backoff = this.websocket_initial_exp_backoff;
		this.dos_min_how_much_time = 120;
		this.dos_increment = 100;
		this.dos_per_how_many_msg = 10000;
		this.dos_channel_disabled = false;
		this.dos_msg_count = 0;
		this.dos_time_register = [];
		for(var j = 0; j < this.dos_increment - 1; j++){
			this.dos_time_register.push(0);
		}
		this.dos_time_register.push(new Date().getTime());
		this.server_time_offset = 100000000000000000000;
	};
	a.mix(exports.Channel.prototype, {
		get_channel_id: function(){
			return this.id;
		},
		get_public_client_id: function(){
			return this.public_client_id;
		},
		debug_mode: function(c){
			this._debug_mode = c;
		},
		server_time_to_local_time: function(c){
			return c + this.server_time_offset;
		},
		_update_server_time_offset: function(d){
			var c = new Date();
			var e = c.getTime() - d;
			if(e < this.server_time_offset){
				this.server_time_offset = e;
			}
		},
		get_status: function(){
			return this._connection_status;
		},
		error_message: function(e){
			if(this._debug_mode)
				console.log("ERROR: " + e);
		},
		dos_test: function(){
			if(this.dos_channel_disabled){
				return false;
			}
			this.dos_msg_count++;
			if(this.dos_msg_count % (this.dos_per_how_many_msg / this.dos_increment) === 0){
				var d = new Date().getTime();
				var e = Math.ceil((d - this.dos_time_register[0]) / 1000);
				if(e < this.dos_min_how_much_time){
					this.dos_channel_disabled = true;
					var c = "Warning: This page sent " + this.dos_per_how_many_msg + " messages to the imo API within " + e + " second" + (e == 1 ? "" : "s") + ". There might be an infinite loop. The imo API has been disabled for this client.";
					this.error_message(c);
					return false;
				}
				this.dos_time_register = this.dos_time_register.slice(1);
				this.dos_time_register.push(new Date().getTime());
				return true;
			}
			return true;
		},
		event_stream: function(c, d){
			this.api_call("event_stream", {
				name: c,
				event: d
			});
		},
		event_queue: function(c, d){
			this.api_call("event_queue", {
				name: c,
				event: d
			});
		},
		random_permutation_event_queue: function(c, d){
			this.api_call("random_permutation_event_queue", {
				name: c,
				event: d
			});
		},
		random_number_event_queue: function(c, d){
			this.api_call("random_number_event_queue", {
				name: c,
				event: d
			});
		},
		subscribe: function(c, d){
			this.api_call("subscribe", {
				queues: c,
				min_stamp: (d === undefined) ? -1 : d
			});
		},
		unsubscribe: function(c){
			this.api_call("unsubscribe", {
				queues: c
			});
		},
		update_game_state: function(c){
			this.api_call("update_game_state", {
				state_info: c
			});
		},
		api_call: function(c, f){
			if(!this.dos_test()){
				return;
			}
			var e = {
				type: c,
				seq: this.seq
			};
			for(var d in f){
				if(f.hasOwnProperty(d)){
					e[d] = f[d];
				}
			}++this.seq;
			this.outgoing_queue.enqueue({
				to_send: e
			});
			var g = {
				messages: [e]
			};
			this.websocket_connection.my_send(g);
		},
		on_server_message: function(c){
			var e, f;
			if(c == "session_expired"){
				if(this.callback_context.on_session_expired){
					this.callback_context.on_session_expired();
				}else{
					console.log("Session expired!");
					//TODO
					//document.location.reload();
				}
			}
			if(c.timestamp){
				this._update_server_time_offset(c.timestamp);
			}
			while(!this.outgoing_queue.is_empty()){
				e = this.outgoing_queue.peek();
				f = e.to_send;
				if(f.seq < c.ack){
					this.outgoing_queue.dequeue();
					if(e.callback){
						e.callback.call(e.context);
					}
				}else{
					break;
				}
			}
			if(c.hasOwnProperty("messages")){
				for(var d = 0; d < c.messages.length;
					++d){
					f = c.messages[d];
					this.queue_reliable_message(f);
				}
			}
		},
		queue_reliable_message: function(f){
			var c = f.seq;
			if(c < this.ack){
				return;
			}
			if(c in this.incoming_queue.members){
				return;
			}
			this.incoming_queue.members[c] = 1;
			this.incoming_queue.heap.push(f);
			while(!this.incoming_queue.heap.is_empty() && this.incoming_queue.heap.root().seq === this.ack){
				delete this.incoming_queue.members[this.ack];
				var e = this.incoming_queue.heap.pop();
				++this.ack;
				this.handle_message(e);
			}
			var d = {
				ack: c + 1
			};
			this.websocket_connection.my_send(d);
		},
		handle_message: function(i){
			if(i.seq !== null && i.seq !== undefined){
				this.ack = i.seq + 1;
			}
			var e = i.type;
			var g, f;
			var j, d;
			var c = i.seq;
			switch(e){
				case "error":
					this.error_message(i.error);
					break;
				case "event_stream":
				case "event_queue":
				case "random_permutation_event_queue":
				case "random_number_event_queue":
					if(this.callback_context.hasOwnProperty(e)){
						for(g = 0; g < i.data.length; g++){
							this.callback_context[e](i.name, i.data[g]);
						}
					}
					break;
				case "subscribe":
					for(var h in i.data){
						g = i.data[h];
						j = g.type;
						delete g.type;
						d = g.name;
						delete g.name;
						switch(j){
							case "event_queue":
							case "random_permutation_event_queue":
							case "random_number_event_queue":
								if(this.callback_context.hasOwnProperty(j)){
									this.callback_context[j](d, g);
								}
								break;
						}
					}
					if(this.callback_context.subscribe_done){
						this.callback_context.subscribe_done();
					}
					break;
				default:
					break;
			}
		},
		_get_object_to_send: function(){
			var c = [];
			var d = new a.Queue();
			while(!this.outgoing_queue.is_empty()){
				var e = this.outgoing_queue.dequeue();
				c.push(e.to_send);
				if(e.to_send.seq !== undefined){
					d.enqueue(e);
				}
			}
			this.outgoing_queue = d;
			return {
				cid: this.id,
				client_token: this.client_token,
				ack: this.ack,
				messages: c,
				ssid: this.ssid
			};
		},
		_connect_to_server: function(){
			this.websocket_connection = new WebSocket(exports.WS_SERVER_IP, ["imoapi"]);
			var c = this;
			c.websocket_connection.my_send = function(d){
				if(c.websocket_connection.readyState === c.websocket_connection.OPEN){
					c.websocket_connection.send(JSON.stringify(d));
				}
			};
			c.websocket_connection.onopen = function(){
				c.websocket_exp_backoff = c.websocket_initial_exp_backoff;
				if(c.ssid == null){
					var g = {
						connect: true,
						cid: c.id
					};
					if(c.client_token != null){
						g.client_token = c.client_token;
					}
					c.websocket_connection.my_send(g);
				}else{
					var d = {
						reconnect: true,
						ssid: c.ssid,
						cid: c.id
					};
					if(c.client_token != null){
						d.client_token = c.client_token;
					}
					c.websocket_connection.my_send(d);
					if(!c.outgoing_queue.is_empty()){
						var f = new a.Queue();
						var e = {
							messages: []
						};
						while(!c.outgoing_queue.is_empty()){
							var h = c.outgoing_queue.dequeue();
							e.messages.push(h.to_send);
							f.enqueue(h);
						}
						c.outgoing_queue = f;
						c.websocket_connection.my_send(e);
					}
				}
			};
			c.websocket_connection.onmessage = function(g){
				var f = g.data;
				if(f === null || f === undefined){
					return;
				}
				try{
					f = JSON.parse(f);
				}catch(d){
					return;
				}
				if(f.timestamp){
					c._update_server_time_offset(f.timestamp);
				}
				if(f.ssid){
					if(f.cid){
						c.id = f.cid;
					}
					if(f.public_client_id){
						c.public_client_id = f.public_client_id;
					}
					if(f.client_token && f.client_token != c.client_token){
						c.client_token = f.client_token;
						console.log("Token: " + f.client_token);
					}
					if(f.ssid){
						c.ssid = f.ssid;
					}
					c.connected = true;
					c.callback_context.connect();
				}else{
					c.on_server_message(f);
				}
			};
			c.websocket_connection.onclose = function(){
				c.connected = false;
				setTimeout(function(){
					c._connect_to_server();
				}, c.websocket_exp_backoff);
				c.retry_scheduled = true;
				c.websocket_exp_backoff = Math.min(Math.sqrt(2) * c.websocket_exp_backoff, 8000);
			};
			c.websocket_connection.onerror = function(d){};
			return;
			b.select(function(e){
				e.init({
					context: this,
					object_to_send: this._get_object_to_send,
					recv: this.on_server_message,
					connection_status: this._update_connection_status,
					fatal: function(){}
				});
				var d = {
					url: "http://localhost/"
				};
				if(this.id){
					d.cid = this.id;
				}
				if(this.client_token){
					d.client_token = this.client_token;
				}
				this.transport = e;
				this._update_connection_status(exports.Channel.CONNECTING);
				this.transport.rpc("connect", d, {
					context: this,
					success: function(f){
						this.id = f.cid;
						this.public_client_id = f.public_client_id;
						this.client_token = f.client_token;
						console.log("Token: " + this.client_token);
						this.ssid = f.ssid;
						this.connected = true;
						this.transport.flush();
						if(this.callback_context.connect){
							this._update_connection_status(exports.Channel.CONNECTED);
							this.callback_context.connect();
						}
					},
					fatal: function(){
						if(this.callback_context.connect){
							this.callback_context.connect();
						}
					}
				});
			}, this);
		},
		_update_connection_status: function(c){
			if(c === this._connection_status){
				return;
			}
			this._connection_status = c;
			if(this.callback_context.connection_status_changed){
				this.callback_context.connection_status_changed(c);
			}
		},
		_destroy: function(){
			delete this.id;
			delete this.seq;
			delete this.ack;
			while(!this.outgoing_queue.is_empty()){
				this.outgoing_queue.dequeue();
			}
			delete this.outgoing_queue;
			delete this.incoming_queue.members;
			while(!this.incoming_queue.heap.is_empty()){
				this.incoming_queue.heap.pop();
			}
			delete this.incoming_queue.heap;
			delete this.incoming_queue;
			delete this.callback_context;
			this.transport.destroy();
			delete this.transport;
			delete this.connected;
			this.disconnected = true;
			delete this.ssid;
			b.on_channel_object_destroy();
		}
	});
	a.mix(exports.Channel, {
		NOT_CONNECTED: -1,
		CONNECTING: 0,
		CONNECTED: 1,
		NETWORK_PROBLEMS: 2
	}, true);
}());
