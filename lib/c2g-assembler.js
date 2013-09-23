module.exports = function(dom){

  function withScript(code,contentType){
    var scriptBlock=dom.createElement("script");
    var text = dom.createTextNode(code);
    scriptBlock.setAttribute("type",contentType || "text/javascript");
    scriptBlock.setAttribute("charset","UTF-8");
    scriptBlock.appendChild(text);
    dom.head.appendChild(scriptBlock);
    process.stderr.write(code.length+"\n");
    process.stderr.write(scriptBlock.innerHTML.length+"\n");
    return this;
  }

  var assembler = {
    withScript:function(code,contentType){
      return withScript(code,contentType);
    },
    withFeature:function(feature){
      return this.withScript(feature.src,"application/gherkin");
    }
  };

  return assembler;
}
