Browserify=require "browserify"
beautify = require('js-beautify').js_beautify

Bundler = require("../lib/c2g-bundler")

describe "bundle support code", ->
  bfy = createSpyObj('bfy', ['require','bundle'])
  bfy.bundle.andReturn 
    on:(ev,cb) -> 
      if(ev=="data") 
        cb("all ok")
      if(ev=="end") 
        cb()

  bundler=Bundler(bfy)
  it "does bundle my support code modules", (done) ->
    modules=[
      name:"foo"
      path:"path/to/foo"
    ]
    bundler.bundleSupportCode(modules).then (data)->
      expect(bfy.require).toHaveBeenCalledWith( "path/to/foo",{ expose:"foo"})
      expect(bfy.bundle).toHaveBeenCalled()
      requires = beautify(
        """
        function SupportCode() {
          var requires=["foo"];
          var self=this;
          requires.forEach(function(r){
            var f=require(r);
            if(typeof f == 'function') {
              f.apply(self);
            }
          });
        }
        """
      )
      expect(data).toEqual(requires+"\nall ok"  )
      done()
