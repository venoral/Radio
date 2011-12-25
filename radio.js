/** 
 * Author: Scott Murphy twitter: @hellocreation, github: uxder
 * radio.js - The Chainable, Dependency Free Publish/Subscribe for Javascript
 */

(function(global) {
	"use strict";
	
	radio._ = {
		version: '0.0.1',
		channelName: "",
		channels: [],
		/**
		 * Broadcast (publish)
		 * Based on the current channelname set by the user, iterate through all listeners and send messages
		 * Messages are the arguments of the message can send unlimited parameters
		 * @return [this] this returns self for chaining
		 * @example
		 * 	  basic usage 
		 *        radio('channel1').broadcast('my message'); //will immediately run myFunction
		 *    send an unlimited number of parameters
		 * 		  radio('channel2').broadcast(param1, param2, param3 ... ); 		  
		 */
		broadcast: function() {
			var		i,
					c = this.channels[this.channelName],
					l = c.length,
					listener,
					callback,
					context;
			//iterate through this channel and run each listener
			for(i=0; i<l;i++) {
				//save the current listener into local var for performance
				listener = c[i];
				
				//if listener was an array, set the callback and context.
				if( (typeof(listener) === 'object') && (listener.length) ) {
					callback = listener[0];
					//if user sent it without a context, set the context to the function
					context = (listener[1]) ? listener[1] : listener[0];
				}
				//if listener was a function, just set the callback and context to that function
				if(typeof(listener) == "function") callback = context = listener;
				
				//run the listener
				callback.apply(context, [arguments].splice(i,1));
			}
			return this;
		},
		
		/**
		 * Set the current channel name
		 */
		channel: function(name) {
			this.channelName = name;
			return this;
		},
		
		/**
		 * Add Listener to channel (subscribe)
		 * Take the arguments and add it to the this.channels array.
		 * @param[callback|array] callback list of callbacks separated by commas
		 * @return [this] this returns self for chaining
		 * @example
		 *		//basic usage		
		 *		radio('channel1').add(callback); //will run callback on 
		 *		radio('channel1').add(callback, callback2, callback3 ...); //you can add an endless amount of callbacks
		 * 	    
		 *		//adding callbacks with context
		 *  	radio('channel1').add([callback, context],[callback1, context], callback3);
 		 */
		add: function() {
				var a = arguments,
					c = this.channels,
					cn = this.channelName,
					i, 
					l= a.length,
					channel;
				//grab the current channel or create and save a new one as an array
				channel = c[cn] || (c[cn] = []);
				//run through each arguments and add it to the channel
				for(i=0; i<l;i++) {
					channel.push(a[i]);
				}
				return this;
		},
		
		/**
		 * Remove Listeners from channel (unsubscribe)
		 */
		remove: function() {
			var a = arguments,
				i, 
				l= a.length;
			//run through the arguments 
			for(i=0; i<l;i++) {
				this._removeOne(a[i]);
			}
			return this;
		},
	
		/**
		 * Remove one listener from channel
		 */
		_removeOne: function(func) {
			var s = this.channels,
				sn = this.channelName,
				i, 
				l= s[sn].length;
			
			for(i=0; i<l;i++) {
				if(s[sn][i] === func) s[sn].splice(i,1);
			}
		},
		/**
		 * return Array of all channels and listeners
		 */
		all: function(){
			return this.channels;
		}
	};
	
	/**
	 * Main Wrapper for radio._ and create a function radio to accept the channelName
	 */
	function radio(channelName) {
		radio._.channel(channelName);
		return radio._;
	}
	
	//add radio to window object
	(global.radio) ? global.radio : global.radio = radio;
})(window);
