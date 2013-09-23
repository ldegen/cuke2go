var Assembler = require("./c2g-assembler");
var Config = require("./c2g-config");
var Bundler = require("./c2g-bundler");
var Deferred = require("promised-io/promise").Deferred;
var state=[];
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
//  var beautify = require('js-beautify').html;
//  return beautify(src,{indent_size:3, wrap_line_length:80});
  return src;
}

function store(name){
  return function(val){
    var d = new Deferred();
    d.resolve(state[name]=val);
    return d.promise;
  }
}

function loadAsset(name,path,charset){
  var fs = require("promised-io/fs");
  return function (){ 
    return fs.readFile(path, charset||"utf-8").then(store(name));
  };
}



function loadDom(){
  var d=new Deferred();
  var jsdom = require('jsdom').jsdom;
  jsdom.env({
    file: __dirname+"/../static/uitest.html",
    src:[state.cukes], 
    done:function(err,window){
      if(err){
        d.reject(err);
      }else{
        d.resolve(window.document);
      }
    }
  });
  return d.promise.then(store("dom"));
}

function bundleSupportCode() {
  var browserify = require('browserify')();
  var bundler = Bundler(browserify);
  var config = state.config;
  return bundler.bundleSupportCode(config.supportCode).then(store("supportCode"));
}
function assemble(){
  var assembler = Assembler(state.dom);
  assembler.withScript(state.supportCode);
  assembler.withScript(state.cukes);
  state.config.features.forEach(function(feature){
    assembler.withFeature(feature);
  });
  var output = getDocTypeAsString(state.dom) + state.dom.documentElement.outerHTML;
  process.stdout.write(postprocess(output));
  process.stdout.write("\n");
}

function bundle(argv){
  state.config = Config(argv);
  require("promised-io/promise").seq(
      [
          bundleSupportCode,
          loadDom,
          loadAsset("cukes",__dirname+"/../static/cukes.js"),
          assemble
      ], state).then(function(data){
        process.stderr.write("ok\n");
      },function(err){
        process.stderr.write("err: "+err+"\n");
      });
}

module.exports=bundle;










