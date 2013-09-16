var Deferred = require("promised-io/promise").Deferred;
var beautify = require('js-beautify').js_beautify;

var Bundler=function Bundler(bfy){
//  var Browserify = require("browserify");
//  var bfy=Browserify();

  var requiresHeader=function(requires){
    var s="";
    var writeln=function(line){
      s+=line;
      s+="\n";
    }
//    writeln("var features="+JSON.stringify(features)+";"  );
    writeln("function SupportCode() {"                    );
    writeln("  var requires="+JSON.stringify(requires)+";");
    writeln("  var self=this;"                            );
    writeln("  requires.forEach(function(r){"             );
    writeln("    var f=require(r);"                       );
    writeln("    if(typeof f == 'function') {"            );
    writeln("      f.apply(self);"                        );
    writeln("    }"                                       );
    writeln("  });"                                       );
    writeln("}"                                           );
    return beautify(s);
  }

  return{
    browserify:bfy,
    bundleSupportCode: function(modules){
      var deferred = new Deferred();
      var requires=[];

      modules.forEach(function(scf){
        bfy.require(scf.path, {expose:scf.name});
        requires.push(scf.name);
      });
      bfy.bundle(function(err,data){
	if(err){
          deferred.reject(err);
	} else {	
          deferred.resolve(requiresHeader(requires)+"\n"+data);
	}
      });
      return deferred.promise;
    }
  };
}
module.exports=Bundler;
