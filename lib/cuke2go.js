
var Bundler = require("./c2g-bundler"); 
function Cuke2Go(args){
}

module.exports = Cuke2Go;
module.exports.Bundler=Bundler;
function getDocTypeAsString(document) {
  var node = document.doctype;
  return node ? "<!DOCTYPE "
         + node.name
         + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
         + (!node.publicId && node.systemId ? ' SYSTEM' : '')
         + (node.systemId ? ' "' + node.systemId + '"' : '')
         + '>\n' : '';
}




function postprocess(src){
  return beautify(src,{indent_size:3, wrap_line_length:80});
}

function Configuration(argv){
  var  makeRelative=function(absolute,dirs){
    var relative=absolute;
    dirs.some(function(dir){
      if(absolute.substr(0,dir.length)==dir){
        relative=path.substr(dir.length+1);
        return true;
      }
    });
    return relative;
  }

  var args = Cucumber.Cli.ArgumentParser();
  args.parse(argv);
  var dirs=args.getFeatureDirectoryPaths();
  var cfg=Cucumber.Cli.Configuration(argv);

  var features=cfg.getFeatureSources().map(function(feso){
    return {
      name:makeRelative(feso[0]),
      src:feso[1].toString()
    };
  });

  var supportCodeFiles=args.getSupportCodeFilePaths().map(function(path){
    return {
      name:makeRelative(path),
      path:path
    };
  });

  return {
    features:features,
    supportCodeFiles:supportCodeFiles
  };
}



function bundle(argv){
  var browserify = require('browserify');
  var fs = require('fs')
  var Cucumber = require("cucumber")
  var beautify = require('js-beautify').html;
  var jsdom = require('jsdom').jsdom;
  var jquery = require('jquery');

  var cukes = fs.readFileSync(__dirname+"/../static/cukes.js", "utf-8");
  var config = Configuration(argv);
  jsdom.env({
    file: __dirname+"/../static/uitest.html",
    src:[cukes],
    done: function (errors, window) {
      var $=jquery.create(window);

      addSupportCode($,config.supportCodeFiles);
      addFeatures($,config.features);

      var document = window.document;

      var output = getDocTypeAsString(document) + document.documentElement.outerHTML;

      process.stdout.write(postprocess(output));
    }
  });
}

function addSupportCode($,supportCodeFiles){
  var b = browserify();
  var requires=[];

  supportCodeFiles.forEach(function(scf){
    b.require(scf.path, {expose:scf.name});
    requires.push(scf.name);
  });

  return Q.nfbind(b.bundle)({debug:true});


}







