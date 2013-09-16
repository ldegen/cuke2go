Cuke2Go=require "../lib/cuke2go"
Browserify=require "browserify"
beautify = require('js-beautify').js_beautify
describe "scan test suite", ->
  it "knows what features I want to run", ->
    console.log "ok"

describe "bundle support code", ->
  bfy = createSpyObj('bfy', ['require','bundle'])
  bfy.bundle.andCallFake (cb) ->
    cb(null,"all ok")
  bundler=Cuke2Go.Bundler(bfy)
  it "does bundle my support code modules", (done) ->
    modules=[
      name:"foo"
      path:"path/to/foo"
    ]
    bundler.bundleSupportCode(modules).then (data)->
      expect(bfy.require).toHaveBeenCalledWith( "path/to/foo",{ expose:"foo"})
      expect(bfy.bundle).toHaveBeenCalledWith(any(Function))
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


