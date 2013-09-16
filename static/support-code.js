////////////////////////////////////////////
// THIS IS A GENERATED FILE, DO NOT EDIT! //
////////////////////////////////////////////
var features=[{"name":"example.feature","src":"# language: de\nFunktionalität: Beispiel für einen End-To-End-Test\n\nSzenario: Zum Beispiel\nAngenommen die Datenbank enthält folgendes Dokument:\n\"\"\"\n{\n  \"_id\":\"test_08154711\",\n  \"foo\":\"bar\"\n}\n\"\"\"\nWenn ich die Testansicht dieses Dokuments lade\nDann sehe ich \"test_08154711\"\n"},{"name":"test.feature","src":"# language: de\nFunktionalität: Beispielfunktion\n\nBlabla, ablablabla\n\n\nSzenario: gamulen\n\n  Angenommen ich bin toll\n  Dann ich bin toll\n"}];
function SupportCode() {
  var requires=["step_definitions/example.js","step_definitions/test.js","support/browser.js","support/database.js","support/step_wrapper.js","support/world.js"];
  var self=this;
  requires.forEach(function(r){
    var f=require(r);
    if(typeof f == 'function') {
      f.apply(self);       
    }
  });
}
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"zt4dax":[function(require,module,exports){
module.exports = function () {

  var World  = require('../support/world').World;
  this.World = World;
  Angenommen=Wenn=Dann=require("../support/step_wrapper")(this.defineStep);

	Angenommen(/^die Datenbank enthält folgendes Dokument:$/, function(txt) {
    this.document=JSON.parse(txt)
    this.database.upload(this.document);
  });

  Wenn(/^ich die Testansicht dieses Dokuments lade$/, function() {
    this.browser.show('test',this.document._id);
  });

  Dann(/^sehe ich "([^"]*)"$/, function(text, callback) {
    this.browser.expectText(text);
  });


};

},{"../support/step_wrapper":"GYpob8","../support/world":"2nFcoN"}],"bqRn5O":[function(require,module,exports){
var myStepDefinitionsWrapper = function () {
	var domain= require("explore-domain");

	this.Given(/^ich bin toll$/, function(callback) {
	  if("ne, doch nicht." != domain.ja()){
      callback.fail("aaAAAAAAAAAaaaaaaAAAAAAAaaaaaAAAAAAA!");
	  }
	  callback();
	});



};
module.exports = myStepDefinitionsWrapper;

},{"explore-domain":8}],"fMRZek":[function(require,module,exports){
var Browser = function(){
  return {
    show:function(showName,docId){
      },
    expectText:function(text){
      throw "not visible: "+text;
    }
  };
}


module.exports=Browser;

},{}],"jwWIuh":[function(require,module,exports){
var Database = function(){
  return {
    upload:function(){}
  };
}


module.exports=Database;

},{}],"GYpob8":[function(require,module,exports){
/*
 * ##Construct a function that can be used instead of defineStep.
 *
 * The idea is to make step definitions more concise. The wrapper
 * function behaves just like the normal defineStep, but in addition it
 * checks whether the block calls the callback during its execution.
 * If it is not, the wrapper takes care of this.
 *
 * ###Example
 * First do something like this:
 * ``` javascript
 * Given=require("../support/step_wrapper")(this.defineStep);
 * ```
 *
 * After this you can write steps like this:
 * ``` javascript
 * Given( /^I have (\d+) cukes in my belly$/, function(numCukes){
 *    this.belly.addCukes(numCukes);
 * });
 * ```
 * and it will be exactly the same as
 * ``` javascript
 * this.Given( /^I have (\d+) cukes in my belly$/, function(numCukes,callback){
 *    this.belly.addCukes(numCukes);
 *    callback();
 * });
 * ```
 */
function Wrapper(defineStep0) {


  var defineStep = function(regexp,block0){
  // We create a wrapper for the block that will take care of the callback
  // if the original block does not.
  var block = function(){
      // Replace the callback (last argument) with a decorated one
      var args=Array.prototype.slice.call(arguments);
      var callback =CallbackDecorator(args.pop());
      args.push(callback);

      // call the original block
      block0.apply(this,args);

      // if no callback was called,
      // do it now.
      if(! callback.done){
        callback.call(this);
      }
    };
    defineStep0.call(this,regexp,block);
  };
  return defineStep;
};

/*
 * Creates a decorator that intercepts all
 * callbacks and sets property `done` to true on
 * the returned decorator when any callback is called.
 */
function CallbackDecorator(callback0){

  //intercept calls to `callback()`
  var callback = function callback(){
    callback.done=true;
    callback0.apply(this,arguments);
  };

  callback.done=false; //the callback has not been called so far

  //intercept calls to `callback.fail()`, `callback.pending()` and the like.
  for(key in callback0){
    if(typeof callback0[key] === "function"){
      callback[key] = ( function(name){
        return function(){
          callback.done=true;
          callback0[name].apply(this,arguments);
        };
      })(key);
    }
  }

  return callback;
}

module.exports =  Wrapper;

},{}],"2nFcoN":[function(require,module,exports){

var Database = require('./database');
var Browser = require('./browser');

var World = function(callback) {
  var world = {
    here:"bla",
    database: Database(),
    browser: Browser()
  };
  console.log("world constructed");
  callback(world);
};

exports.World = World;

},{"./browser":"fMRZek","./database":"jwWIuh"}],"step_definitions/example.js":[function(require,module,exports){
module.exports=require('zt4dax');
},{}],8:[function(require,module,exports){
exports.ja=module.exports.ja=function(){
  return "ne, doch nicht.";
};

},{}],"support/browser.js":[function(require,module,exports){
module.exports=require('fMRZek');
},{}],"support/database.js":[function(require,module,exports){
module.exports=require('jwWIuh');
},{}],"step_definitions/test.js":[function(require,module,exports){
module.exports=require('bqRn5O');
},{}],"support/step_wrapper.js":[function(require,module,exports){
module.exports=require('GYpob8');
},{}],"support/world.js":[function(require,module,exports){
module.exports=require('2nFcoN');
},{}]},{},[])
;