var IMO={};
IMO.HTTP_SERVER_IP="https://api2-"+(Math.random()+"").substring(2)+".imoapi.com";
IMO.WS_SERVER_IP="wss://api2-"+(Math.random()+"").substring(2)+".imoapi.com/websocket";
(function(){if(!IMO.miniY){IMO.miniY={};
}var a=IMO.miniY;
a.later=function(b,c,i,g,e){b=b||0;
var d=function(){i.call(c,g);
};
var h=(e)?setInterval(d,b):setTimeout(d,b);
return{id:h,interval:e,cancel:function(){if(this.interval){clearInterval(h);
}else{clearTimeout(h);
}}};
};
a.mix=function(e,d,b){for(var c in d){if(d.hasOwnProperty(c)&&(b||!e.hasOwnProperty(c))){e[c]=d[c];
}}};
}());
(function(){if(!IMO.miniY){IMO.miniY={};
}var a=IMO.Utils,b=IMO.miniY;
b.mix(b,{addEventListener:function(c,d,e){if(c.attachEvent){c.attachEvent("on"+d,e);
return true;
}if(c.addEventListener){c.addEventListener(d,e,false);
return true;
}return false;
},removeEventListener:function(c,d,e){if(c.detachEvent){c.detachEvent("on"+d,e);
return true;
}else{if(c.removeEventListener){c.removeEventListener(d,e,false);
return true;
}}return false;
},addWindowEventListener:function(c,d){return b.addEventListener(window,c,d);
},removeWindowEventListener:function(c,d){return b.removeEventListener(window,c,d);
}});
}());
(function(){function c(e){var f=0;
return parseFloat(e.replace(/\./g,function(){++f;
return(f===1)?"":".";
}));
}if(!IMO.miniY){IMO.miniY={};
}var d=IMO.miniY,b=navigator.userAgent,a=b&&b.match(/MSIE\s([^;]*)/);
d.UA={is_ie:((+"\v1")!==1),ie:a&&c(a[0])};
}());
if(!IMO.config){IMO.config={};
}IMO.config.debug=false;
(function(){function b(d,c){return function(e){d[c].call(d,e);
};
}var a=(function(){if(typeof Y!=="undefined"&&Y.log){return b(Y,"log");
}if(typeof console!=="undefined"){return b(console,"log");
}if(typeof opera!=="undefined"&&opera.postError){return b(opera,"postError");
}return function(){};
}());
IMO.log=function(c){if(!IMO.config||!IMO.config.debug){return;
}a(c);
};
}());
if(!IMO.Utils){IMO.Utils={};
}(function(){var a=IMO.Utils;
a.mix=((typeof Y!=="undefined")&&Y.mix)||IMO.miniY.mix;
a.later=((typeof Y!=="undefined")&&Y.later)||IMO.miniY.later;
a.dfl=function(c,b){return c===undefined?b:c;
};
a.trim=function(b){return b.replace(/^\s+|\s+$/g,"");
};
a.forprop=function(d,b,c){for(var e in d){if(d.hasOwnProperty(e)){b.call(c,e,d[e]);
}}};
}());
(function(){if(!IMO.Utils){IMO.Utils={};
}IMO.Utils.Queue=function(){var a=[];
var b=0;
this.get_length=function(){return(a.length-b);
};
this.is_empty=function(){return(a.length===0);
};
this.enqueue=function(c){a.push(c);
};
this.dequeue=function(){if(a.length===0){return undefined;
}var c=a[b];
a[b]=null;
++b;
if(b*2>=a.length){a=a.slice(b);
b=0;
}return c;
};
this.peek=function(){return(a.length>0?a[b]:undefined);
};
};
}());
(function(){var a=IMO.Utils;
var e=function(f){return Math.floor((f-1)/2);
};
var c=function(f){return 2*f+1;
};
var d=function(f){return 2*f+2;
};
IMO.Utils.BinHeap=function b(f){if(!f){f=function(g){return g;
};
}this.key_fn=f;
this.arr=[];
};
a.mix(IMO.Utils.BinHeap.prototype,{push:function(g){var f=this.arr.length;
var j=this.key_fn(g);
var h=e(f);
while((f>0)&&(j<this.heap_val(h))){this.arr[f]=this.arr[h];
f=h;
h=e(f);
}this.arr[f]=g;
},pop:function(){if(this.arr.length===0){return null;
}var f=this.arr[0];
this.arr[0]=this.arr[this.arr.length-1];
this.arr.length--;
this.heapify(0);
return f;
},is_empty:function(){return this.arr.length===0;
},root:function(){if(this.arr.length===0){return null;
}return this.arr[0];
},heapify:function(j){var f=c(j);
var k=d(j);
var m=this.arr.length;
var h;
if((f<m)&&(this.heap_val(f)<this.heap_val(j))){h=f;
}else{h=j;
}if((k<m)&&(this.heap_val(k)<this.heap_val(h))){h=k;
}if(h!==j){var g=this.arr[j];
this.arr[j]=this.arr[h];
this.arr[h]=g;
this.heapify(h);
}},heap_val:function(f){return this.key_fn(this.arr[f]);
}});
}());
(function(){var b=IMO.Utils;
var a=2*60*1000;
b.ExpBackoff=function(d,f,g,e){this.context=d;
this.func=f;
this.data=g;
this.backoff=0;
this.max_backoff=e||a;
this.state=b.ExpBackoff.IDLE_STATE;
this.connect_later=null;
};
var c=b.ExpBackoff;
b.mix(c,{IDLE_STATE:"idle",CONNECTING_STATE:"connecting",GAVE_UP_STATE:"gave_up",WAITING_STATE:"waiting",ABANDONED_STATE:"abandoned"});
b.mix(IMO.Utils.ExpBackoff.prototype,{connect:function(){if(this.state!==c.IDLE_STATE){return;
}this.state=c.WAITING_STATE;
this.connect_later=b.later(this.backoff,this,this.do_connect,null,false);
},abandon:function(){if(this.state===c.ABANDONED_STATE){return;
}if(this.connect_later){this.connect_later.cancel();
this.connect_later=null;
}this.state=c.ABANDONED_STATE;
},on_success:function(){if(this.state!==c.CONNECTING_STATE){return;
}this.backoff=0;
this.state=c.IDLE_STATE;
},on_give_up:function(){if(this.state!==c.CONNECTING_STATE){return;
}this.state=c.GAVE_UP_STATE;
},on_failure:function(){if(this.state!==c.CONNECTING_STATE){return;
}this.backoff=this.backoff===0?1000:this.backoff*2;
if(this.backoff>this.max_backoff){this.backoff=this.max_backoff;
}this.state=c.IDLE_STATE;
this.connect();
},do_connect:function(){this.connect_later=null;
this.state=c.CONNECTING_STATE;
this.func.call(this.context,this.data);
}});
}());
(function(){if(!IMO.Transport){IMO.Transport={};
}var b=IMO.Transport,d,h=0,i=false,a=false,c=[],f=[],e=function(j){setTimeout(function(){j[0].call(j[1],(d));
},0);
},g=function(){for(var j=0;
j<f.length;
++j){e(f[j]);
}f=[];
};
b.add_transport=function(k,j){c.push([k,j]);
};
b.select=function(j,k){f.push([j,k]);
if(i){h++;
g();
return;
}if(a){return;
}a=true;
c.sort(function(o,n){return n[0]-o[0];
});
var m=0;
var l=c[m][1];
l(function(n){d=n;
i=true;
h++;
g();
});
};
b.on_channel_object_destroy=function(){h--;
if(h===0){i=false;
a=false;
d=null;
}};
}());
(function(){if(!IMO.Transport){IMO.Transport={};
}var a=IMO.Utils,d=a.ExpBackoff,b=IMO.Transport;
function f(g){var h=g.code;
if(h<300){return"ok";
}else{if(h>=500){return"fail";
}else{return"fatal";
}}}var e=function(j,g,i,h){a.mix(this,{eb:new a.ExpBackoff(this,this.do_request,null),xdr_obj:j,cb_obj:h,call_param:{url:g,data:i,context:this,cb:this.request_cb}});
};
a.mix(e.prototype,{connect:function(){this.eb.connect();
},do_request:function(){this.xdr_obj.make_request(this.call_param);
},request_cb:function(g){var h=f(g);
if(h==="ok"){this.eb.on_success();
this.cb_obj.success.call(this.cb_obj.context,g.result);
return;
}if(h==="fail"){this.eb.on_failure();
return;
}this.eb.on_give_up();
this.cb_obj.fatal.call(this.cb_obj.context);
}});
var c=function(g){this.xdr_obj=g;
this._create_poll_request();
};
a.mix(c.prototype,{init:function(g){g.context=g.context||g;
this.cb_obj=g;
},destroy:function(){this.cb_obj=null;
this.poll_eb.abandon();
this.xdr_obj.destroy();
this.xdr_obj=null;
},rpc:function(i,h,g){new e(this.xdr_obj,"/a/"+i+"/"+escape(h.cid),h,g).connect();
},flush:function(){if(this.poll_eb.state===d.CONNECTING_STATE){this.poll_eb.abandon();
this._create_poll_request();
}this.poll_eb.connect();
},_create_poll_request:function(){this.poll_eb=new d(this,this._send_poll_request);
},_send_poll_request:function(){var h=this.cb_obj.object_to_send.call(this.cb_obj.context);
var g=this.poll_eb;
this.xdr_obj.make_request({url:"/a/poll/"+escape(h.cid),data:h,context:this,cb:function(j){var i=f(j);
if(i==="ok"){g.on_success();
this.cb_obj.connection_status.call(this.cb_obj.context,IMO.Channel.CONNECTED);
this.cb_obj.recv.call(this.cb_obj.context,j.result);
g.connect();
}else{if(i==="fail"){this.cb_obj.connection_status.call(this.cb_obj.context,IMO.Channel.NETWORK_PROBLEMS);
this.poll_eb.on_failure();
}else{this.poll_eb.on_give_up();
this.cb_obj.fatal.call(this.cb_obj.context);
}}}});
}});
b.create_from_xdr=function(j,g,h){var i=j&&new c(j);
setTimeout(function(){g.call(h,i);
},0);
};
}());
(function(){var a=IMO.Utils,b=IMO.Transport,c=IMO.miniY,d=0;
b.persistent_iframe=function(){};
b.persistent_iframe.create=function(g,e,f){new b.persistent_iframe().init(g,e,f);
};
a.mix(b.persistent_iframe.prototype,{init:function(i,e,g){if(!window||!window.postMessage||(c.UA.ie&&c.UA.ie<8)){e.call(g,null);
return;
}this._host=i;
this._callbacks={};
var h=document.createElement("iframe");
h.setAttribute("name","IMO.Transport.persistent_iframe");
h.setAttribute("style","display:none;width:0px;height:0px");
h.setAttribute("src",i+"/IMO_persistent_iframe.html");
var f=this;
h.onload=function(){e.call(g,f);
};
h.onreadystatechange=function(){if(this.readyState==="complete"||this.readyState==="loaded"){e.call(g,f);
}};
document.body.appendChild(h);
this._iframe_object=h;
this._event_listener=function(j){f._iframe_response(j);
};
c.addWindowEventListener("message",this._event_listener);
},make_request:function(g){++d;
var f="id"+d,e={url:g.url,data:g.data,req_id:f},h=JSON.stringify(e);
IMO.log("Main window requested: "+h);
this._callbacks[f]=[g.cb,g.context];
this._iframe_object.contentWindow.postMessage(h,"*");
},destroy:function(){document.body.removeChild(this._iframe_object);
},_iframe_response:function(g){IMO.log("Received response from iFrame: "+g.data);
var h=g.data?JSON.parse(g.data):null;
var f=h&&h.req_id;
if(!f||!(f in this._callbacks)){IMO.log(g);
a.forprop(this._callbacks,function(j,i){i[0].call(i[1],{code:500});
},this);
this._callbacks={};
return;
}var e=this._callbacks[f];
e[0].call(e[1],h.result);
delete this._callbacks[f];
},_remove_event_listeners:function(){c.removeWindowEventListener("message",this.event_listener);
}});
b.add_transport(80,function(e){IMO.log("Trying to initialize persistent iframe transport");
b.persistent_iframe.create(IMO.HTTP_SERVER_IP,function(f){b.create_from_xdr(f,e);
});
});
}());
(function(){var a=IMO.Utils,b=IMO.Transport;
IMO.Channel=function(k){this.USING_WEBSOCKETS=(typeof(WebSocket)!=="undefined");
this.id=null;
this.public_client_id=null;
this.client_token=null;
this.ssid=null;
this._debug_mode=document.location.protocol=="file:";
this.error_dict={};
window.location.hash=window.location.hash;
var l=location.hash;
if(l.length>1){this.client_token=l.substr(1);
}var c=document.location.href;
var m=c.substring(c.indexOf("?")+1);
var o=c.substr(0,c.indexOf("?"));
if(m.length>0){var e=m.replace("#","&").split("&");
for(var g=0;
g<e.length;
g++){var f=e[g].split("=");
if(f.length===2){if(this.id===null&&f[0]==="ch_id"){this.id=unescape(f[1]);
}}}}if(this.id===null){var d=""+(Math.floor(Math.random()*(1<<31)));
d+=(new Date().getTime());
var n=o+"?ch_id="+d;
if(this.client_token!==null){n+="#"+this.client_token;
}document.location.href=n;
}this.seq=0;
this.ack=0;
this.outgoing_queue=new IMO.Utils.Queue();
this.incoming_queue={members:{},heap:new IMO.Utils.BinHeap(function(h){return h.seq;
})};
this.callback_context=k;
this.websocket_connection=null;
this._connect_to_server();
this.connected=false;
this.disconnected=false;
this._connection_status=IMO.Channel.NOT_CONNECTED;
this.websocket_initial_exp_backoff=250;
this.websocket_exp_backoff=this.websocket_initial_exp_backoff;
this.dos_min_how_much_time=120;
this.dos_increment=100;
this.dos_per_how_many_msg=10000;
this.dos_channel_disabled=false;
this.dos_msg_count=0;
this.dos_time_register=[];
for(var j=0;
j<this.dos_increment-1;
j++){this.dos_time_register.push(0);
}this.dos_time_register.push(new Date().getTime());
this.server_time_offset=100000000000000000000;
};
a.mix(IMO.Channel.prototype,{get_channel_id:function(){return this.id;
},get_public_client_id:function(){return this.public_client_id;
},debug_mode:function(c){this._debug_mode=c;
},server_time_to_local_time:function(c){return c+this.server_time_offset;
},_update_server_time_offset:function(d){var c=new Date();
var e=c.getTime()-d;
if(e<this.server_time_offset){this.server_time_offset=e;
}},get_status:function(){return this._connection_status;
},error_message:function(e){if(!this._debug_mode){return;
}var d;
if(this.error_dict.hasOwnProperty(e)){d=this.error_dict[e][0];
this.error_dict[e][1]++;
var f=this.error_dict[e][1];
d.removeChild(d.firstChild);
d.appendChild(document.createTextNode(e+" (x"+f+")"));
}else{d=document.createElement("div");
d.style.position="relative";
d.style.zIndex="100";
d.style.textAlign="center";
d.style.margin="3px";
d.style.border="thin solid #000000";
d.style.backgroundColor="#ffff88";
d.appendChild(document.createTextNode(e));
if(document.body.firstChild){document.body.insertBefore(d,document.body.firstChild);
}else{document.body.appendChild(d);
}this.error_dict[e]=[d,1];
}},dos_test:function(){if(this.dos_channel_disabled){return false;
}this.dos_msg_count++;
if(this.dos_msg_count%(this.dos_per_how_many_msg/this.dos_increment)===0){var d=new Date().getTime();
var e=Math.ceil((d-this.dos_time_register[0])/1000);
if(e<this.dos_min_how_much_time){this.dos_channel_disabled=true;
var c="Warning: This page sent "+this.dos_per_how_many_msg+" messages to the imo API within "+e+" second"+(e==1?"":"s")+". There might be an infinite loop. The imo API has been disabled for this client.";
this.error_message(c);
return false;
}this.dos_time_register=this.dos_time_register.slice(1);
this.dos_time_register.push(new Date().getTime());
return true;
}return true;
},event_stream:function(c,d){this.api_call("event_stream",{name:c,event:d});
},event_queue:function(c,d){this.api_call("event_queue",{name:c,event:d});
},random_permutation_event_queue:function(c,d){this.api_call("random_permutation_event_queue",{name:c,event:d});
},random_number_event_queue:function(c,d){this.api_call("random_number_event_queue",{name:c,event:d});
},subscribe:function(c,d){this.api_call("subscribe",{queues:c,min_stamp:(d===undefined)?-1:d});
},unsubscribe:function(c){this.api_call("unsubscribe",{queues:c});
},update_game_state:function(c){this.api_call("update_game_state",{state_info:c});
},api_call:function(c,f){if(!this.dos_test()){return;
}var e={type:c,seq:this.seq};
for(var d in f){if(f.hasOwnProperty(d)){e[d]=f[d];
}}++this.seq;
this.outgoing_queue.enqueue({to_send:e});
if(this.USING_WEBSOCKETS){var g={messages:[e]};
this.websocket_connection.my_send(g);
}else{if(this.outgoing_queue.is_empty()){return;
}this.transport.flush();
}},on_server_message:function(c){var e,f;
if(c=="session_expired"){if(this.callback_context.on_session_expired){this.callback_context.on_session_expired();
}else{document.location.reload();
}}if(c.timestamp){this._update_server_time_offset(c.timestamp);
}while(!this.outgoing_queue.is_empty()){e=this.outgoing_queue.peek();
f=e.to_send;
if(f.seq<c.ack){this.outgoing_queue.dequeue();
if(e.callback){e.callback.call(e.context);
}}else{break;
}}if(c.hasOwnProperty("messages")){for(var d=0;
d<c.messages.length;
++d){f=c.messages[d];
this.queue_reliable_message(f);
}}},queue_reliable_message:function(f){var c=f.seq;
if(c<this.ack){return;
}if(c in this.incoming_queue.members){return;
}this.incoming_queue.members[c]=1;
this.incoming_queue.heap.push(f);
while(!this.incoming_queue.heap.is_empty()&&this.incoming_queue.heap.root().seq===this.ack){delete this.incoming_queue.members[this.ack];
var e=this.incoming_queue.heap.pop();
++this.ack;
this.handle_message(e);
}if(this.USING_WEBSOCKETS){var d={ack:c+1};
this.websocket_connection.my_send(d);
}},handle_message:function(i){if(i.seq!==null&&i.seq!==undefined){this.ack=i.seq+1;
}var e=i.type;
var g,f;
var j,d;
var c=i.seq;
switch(e){case"error":this.error_message(i.error);
break;
case"event_stream":case"event_queue":case"random_permutation_event_queue":case"random_number_event_queue":if(this.callback_context.hasOwnProperty(e)){for(g=0;
g<i.data.length;
g++){this.callback_context[e](i.name,i.data[g]);
}}break;
case"subscribe":for(var h in i.data){g=i.data[h];
j=g.type;
delete g.type;
d=g.name;
delete g.name;
switch(j){case"event_queue":case"random_permutation_event_queue":case"random_number_event_queue":if(this.callback_context.hasOwnProperty(j)){this.callback_context[j](d,g);
}break;
}}if(this.callback_context.subscribe_done){this.callback_context.subscribe_done();
}break;
default:break;
}},_get_object_to_send:function(){var c=[];
var d=new a.Queue();
while(!this.outgoing_queue.is_empty()){var e=this.outgoing_queue.dequeue();
c.push(e.to_send);
if(e.to_send.seq!==undefined){d.enqueue(e);
}}this.outgoing_queue=d;
return{cid:this.id,client_token:this.client_token,ack:this.ack,messages:c,ssid:this.ssid};
},_connect_to_server:function(){if(this.USING_WEBSOCKETS){this.websocket_connection=new WebSocket(IMO.WS_SERVER_IP,["imoapi"]);
var c=this;
c.websocket_connection.my_send=function(d){if(c.websocket_connection.readyState===c.websocket_connection.OPEN){c.websocket_connection.send(JSON.stringify(d));
}};
c.websocket_connection.onopen=function(){c.websocket_exp_backoff=c.websocket_initial_exp_backoff;
if(c.ssid==null){var g={connect:true,cid:c.id};
if(c.client_token!=null){g.client_token=c.client_token;
}c.websocket_connection.my_send(g);
}else{var d={reconnect:true,ssid:c.ssid,cid:c.id};
if(c.client_token!=null){d.client_token=c.client_token;
}c.websocket_connection.my_send(d);
if(!c.outgoing_queue.is_empty()){var f=new a.Queue();
var e={messages:[]};
while(!c.outgoing_queue.is_empty()){var h=c.outgoing_queue.dequeue();
e.messages.push(h.to_send);
f.enqueue(h);
}c.outgoing_queue=f;
c.websocket_connection.my_send(e);
}}};
c.websocket_connection.onmessage=function(g){var f=g.data;
if(f===null||f===undefined){return;
}try{f=JSON.parse(f);
}catch(d){return;
}if(f.timestamp){c._update_server_time_offset(f.timestamp);
}if(f.ssid){if(f.cid){c.id=f.cid;
}if(f.public_client_id){c.public_client_id=f.public_client_id;
}if(f.client_token&&f.client_token!=c.client_token){c.client_token=f.client_token;
window.location.hash=f.client_token;
}if(f.ssid){c.ssid=f.ssid;
}c.connected=true;
c.callback_context.connect();
}else{c.on_server_message(f);
}};
c.websocket_connection.onclose=function(){c.connected=false;
setTimeout(function(){c._connect_to_server();
},c.websocket_exp_backoff);
c.retry_scheduled=true;
c.websocket_exp_backoff=Math.min(Math.sqrt(2)*c.websocket_exp_backoff,8000);
};
c.websocket_connection.onerror=function(d){};
return;
}b.select(function(e){e.init({context:this,object_to_send:this._get_object_to_send,recv:this.on_server_message,connection_status:this._update_connection_status,fatal:function(){}});
var d={url:document.location.origin+document.location.pathname};
if(this.id){d.cid=this.id;
}if(this.client_token){d.client_token=this.client_token;
}this.transport=e;
this._update_connection_status(IMO.Channel.CONNECTING);
this.transport.rpc("connect",d,{context:this,success:function(f){this.id=f.cid;
this.public_client_id=f.public_client_id;
this.client_token=f.client_token;
window.location.hash=this.client_token;
this.ssid=f.ssid;
this.connected=true;
this.transport.flush();
if(this.callback_context.connect){this._update_connection_status(IMO.Channel.CONNECTED);
this.callback_context.connect();
}},fatal:function(){if(this.callback_context.connect){this.callback_context.connect();
}}});
},this);
},_update_connection_status:function(c){if(c===this._connection_status){return;
}this._connection_status=c;
if(this.callback_context.connection_status_changed){this.callback_context.connection_status_changed(c);
}},_destroy:function(){delete this.id;
delete this.seq;
delete this.ack;
while(!this.outgoing_queue.is_empty()){this.outgoing_queue.dequeue();
}delete this.outgoing_queue;
delete this.incoming_queue.members;
while(!this.incoming_queue.heap.is_empty()){this.incoming_queue.heap.pop();
}delete this.incoming_queue.heap;
delete this.incoming_queue;
delete this.callback_context;
this.transport.destroy();
delete this.transport;
delete this.connected;
this.disconnected=true;
delete this.ssid;
b.on_channel_object_destroy();
}});
a.mix(IMO.Channel,{NOT_CONNECTED:-1,CONNECTING:0,CONNECTED:1,NETWORK_PROBLEMS:2},true);
}());
(function(){IMO.UserList=function(e){this.users={};
this.userList=[];
if(e.hasOwnProperty("title")){this.title=e.title;
}else{this.title="Users";
}if(e.hasOwnProperty("public_client_id")){this.public_client_id=e.public_client_id;
}else{this.public_client_id=null;
}if(e.hasOwnProperty("comparator")){this.comparator=e.comparator;
}else{this.comparator=this.compare_by_timestamp;
}if(e.hasOwnProperty("list_style")){this.list_style=e.list_style;
}else{this.list_style="column";
}if(e.hasOwnProperty("device")){this.device=e.device;
}else{this.device="web";
}if(e.hasOwnProperty("user_style")){this.user_style=e.user_style;
}else{if(this.device=="mobile"){this.user_style=this.standard_mobile_user_style;
}else{this.user_style=this.standard_user_style;
}}var c=document.getElementsByTagName("head")[0];
var h="StandardUserListCSS";
if(!document.getElementById(h)){var b=document.createElement("link");
b.id=h;
b.rel="stylesheet";
b.type="text/css";
b.href="https://apps.imoapi.com/imo.im/api/2/utils/UserList.css";
b.media="all";
c.appendChild(b);
}if(e.hasOwnProperty("css_url")){h="CustomUserListCSS";
if(!document.getElementById(h)){var a=document.createElement("link");
a.id=h;
a.rel="stylesheet";
a.type="text/css";
a.href=e.css_url;
a.media="all";
c.appendChild(a);
}}this.div=document.createElement("div");
if(this.device=="mobile"){this.div.className="UL_mobile_list";
}else{this.div.className="UL_list";
}var d=document.createElement("div");
if(this.device=="mobile"){d.className="UL_mobile_title";
}else{d.className="UL_title";
}d.appendChild(document.createTextNode(this.title));
this.div.appendChild(d);
if(this.list_style=="row"){var g=document.createElement("div");
this.div.appendChild(g);
var f=document.createElement("div");
f.style.clear="both";
this.div.appendChild(f);
}};
IMO.UserList.prototype.add_user=function(b){var a;
var c=b.object.action;
if(c=="leave"){if(this.users.hasOwnProperty(b.setter)){this.div.removeChild(this.users[b.setter].div);
delete this.users[b.setter];
a=0;
while(this.userList[a]!=b.setter){a+=1;
}this.userList.splice(a,1);
}}else{if(!this.users[b.setter]){this.users[b.setter]={};
c="join";
}else{c="rejoin";
}this.users[b.setter].first_name=b.object.first_name;
this.users[b.setter].last_name=b.object.last_name;
this.users[b.setter].icon_url=b.object.icon_url;
this.users[b.setter].div=this.user_style(b.setter);
if(c=="join"){this.users[b.setter].timestamp=b.timestamp;
this.users[b.setter].data=null;
a=this.userList.length;
while((a>0)&&(this.comparator(this.users[this.userList[a-1]],this.users[b.setter])>0)){a-=1;
}if(a==this.userList.length){this.userList.push(b.setter);
if(this.list_style=="row"){this.div.insertBefore(this.users[b.setter].div,this.div.lastChild);
}else{this.div.appendChild(this.users[b.setter].div);
}}else{this.userList.splice(a,0,b.setter);
this.div.insertBefore(this.users[b.setter].div,this.users[this.userList[a+1]].div);
}}else{this.update_order();
}}return(c);
};
IMO.UserList.prototype.update_order=function(){var c=this.userList;
this.userList=[];
for(var b in c){var a=this.userList.length;
while((a>0)&&(this.comparator(this.users[this.userList[a-1]],this.users[c[b]])>0)){a-=1;
}if(a==this.userList.length){this.userList.push(c[b]);
}else{this.userList.splice(a,0,c[b]);
}}while(this.div.childNodes.length>1){this.div.removeChild(this.div.lastChild);
}if(this.list_style=="row"){var e=document.createElement("div");
this.div.appendChild(e);
}for(b in this.userList){this.div.appendChild(this.users[this.userList[b]].div);
}if(this.list_style=="row"){var d=document.createElement("div");
d.style.clear="both";
this.div.appendChild(d);
}};
IMO.UserList.prototype.set_comparator=function(a){this.comparator=a;
this.update_order();
};
IMO.UserList.prototype.set_data=function(a,b,c){if(this.users[a].data==null){this.users[a].data={};
}if(typeof c=="undefined"){c=null;
}this.users[a].data[b]=c;
this.users[a].div=this.user_style(a);
this.update_order();
};
IMO.UserList.prototype.get_data=function(a,b){if(this.users[a].data.hasOwnProperty(b)){return(this.users[a].data[b]);
}return(null);
};
IMO.UserList.prototype.clear_data=function(){for(var a in this.userList){if(this.users[this.userList[a]].data!=null){this.users[this.userList[a]].data=null;
this.users[this.userList[a]].div=this.user_style(this.userList[a]);
}}this.update_order();
};
IMO.UserList.prototype.standard_user_style=function(e){var b=document.createElement("div");
b.className="UL_user";
if(e==this.public_client_id){b.className+=" UL_self_user";
}if(this.list_style=="row"){b.style.cssFloat="left";
}var i=document.createElement("div");
i.className="UL_left_column";
var h=document.createElement("div");
h.className="UL_icon";
h.style.backgroundImage="url('"+this.users[e].icon_url+"')";
var c=document.createElement("div");
c.className="UL_username";
c.appendChild(document.createTextNode(this.users[e].first_name));
c.appendChild(document.createElement("br"));
if(this.users[e].last_name.length===0){c.appendChild(document.createElement("br"));
}else{c.appendChild(document.createTextNode(this.users[e].last_name));
}i.appendChild(h);
i.appendChild(c);
b.appendChild(i);
var g=document.createElement("div");
g.className="UL_right_column";
for(var d in this.users[e].data){if(this.users[e].data.hasOwnProperty(d)){var j=document.createElement("div");
var f=d;
if(this.users[e].data[d]!=null){f+=": "+this.users[e].data[d];
}var a=document.createTextNode(f);
j.appendChild(a);
g.appendChild(j);
}}b.appendChild(g);
return(b);
};
IMO.UserList.prototype.standard_mobile_user_style=function(e){var b=document.createElement("div");
b.className="UL_mobile_user";
if(e==this.public_client_id){b.className+=" UL_mobile_self_user";
}if(this.list_style=="row"){b.style.cssFloat="left";
b.style.border="1px solid black";
}var j=document.createElement("div");
j.className="UL_mobile_left_column";
var i=document.createElement("div");
i.className="UL_mobile_icon";
i.style.backgroundImage="url('"+this.users[e].icon_url+"')";
j.appendChild(i);
b.appendChild(j);
var h=document.createElement("div");
h.className="UL_mobile_username";
var g=this.users[e].first_name;
if(this.users[e].last_name.length>0){g+=" "+this.users[e].last_name;
}var c=document.createTextNode(g);
h.appendChild(c);
b.appendChild(h);
var f=document.createElement("div");
f.className="UL_mobile_right_column";
for(var d in this.users[e].data){if(this.users[e].data.hasOwnProperty(d)){var l=document.createElement("div");
g=d;
if(this.users[e].data[d]!=null){g+=": "+this.users[e].data[d];
}var a=document.createTextNode(g);
l.appendChild(a);
f.appendChild(l);
}}b.appendChild(f);
return(b);
};
IMO.UserList.prototype.compare_by_timestamp=function(b,a){return(b.timestamp>a.timestamp);
};
}());
(function(){IMO.SelectionDisabler=function(){};
IMO.SelectionDisabler.prototype.stop_event=function(a){if(!a){if(window.event){a=window.event;
}else{return;
}}if(a.preventDefault){a.preventDefault();
}if(window.event){a.returnValue=false;
}};
IMO.SelectionDisabler.prototype.disable_selection=function(a){if(a.tagName===undefined){return;
}if(typeof a.onselectstart!="undefined"){a.onselectstart=function(){return false;
};
}else{if(typeof a.style.MozUserSelect!="undefined"){a.style.MozUserSelect="none";
}}if(!a.addEventListener){a.attachEvent("onmousedown",this.stop_event);
}else{a.addEventListener("mousedown",this.stop_event,false);
}a.style.cursor="default";
};
IMO.SelectionDisabler.prototype._recursively_disable_selection=function(c,d){var b;
for(b=0;
b<d.length;
b++){if(d[b]===c.id){return(false);
}}var a=true;
for(b=0;
b<c.childNodes.length;
b++){a&=this._recursively_disable_selection(c.childNodes.item(b),d);
}if(a){this.disable_selection(c);
}return(a);
};
IMO.SelectionDisabler.prototype.recursively_disable_selection=function(a,b){this._recursively_disable_selection(a,b);
};
}());
(function(){IMO.Sound=function(j,k,d){if(d=="video"){this.sound=document.createElement("video");
}else{this.sound=document.createElement("audio");
}if(typeof this.sound.canPlayType!=="function"){return;
}var c=!!(this.sound.canPlayType("audio/mpeg;").replace(/no/,""));
var f=!!(this.sound.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/,""));
var h=!!(this.sound.canPlayType('audio/wav; codecs="1"').replace(/no/,""));
if(typeof k==="function"){if(!this.sound.addEventListener){this.sound.attachEvent("oncanplaythrough",k);
}else{this.sound.addEventListener("canplaythrough",k,false);
}}this.sound.preload="auto";
for(var g in j){var b=j[g];
if(b.length>4){var e=b.substr(b.length-3);
if((c)&&(e=="mp3")||(f)&&((e=="ogg")||(e=="oga"))||(h)&&(e=="wav")){var a=document.createElement("source");
a.src=b;
this.sound.appendChild(a);
}}}};
IMO.Sound.prototype.play=function(a){try{this.sound.loop=a;
this.sound.currentTime=0;
this.sound.play();
}catch(b){}};
IMO.Sound.prototype.stop=function(){try{this.sound.pause();
}catch(a){}};
IMO.Sound.prototype.set_volume=function(a){try{this.sound.volume=Math.min(1,Math.max(0,a));
}catch(b){}};
IMO.Sound.prototype.get_volume=function(){try{return(this.sound.volume);
}catch(a){return(0);
}};
}());