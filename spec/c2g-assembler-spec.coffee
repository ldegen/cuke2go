Assembler = require("../lib/c2g-assembler")
jsdom = require("jsdom")
describe "assemble the HTML page", ->
  assembler=undefined
  dom=undefined
  beforeEach ->
    dom=jsdom.jsdom()
    assembler = Assembler(dom)

  it "can add javscript blocks", ->
    assembler.withScript('alert(42);')
    scriptBlock=dom.querySelector('script[type="text/javascript"]')
    expect(scriptBlock).toBeTruthy()
    expect(scriptBlock.innerHTML).toEqual("alert(42);")
    expect(scriptBlock.getAttribute("type")).toEqual("text/javascript")

  it "can add scripts with arbitrary content type", ->
    assembler.withScript('foo bar',"super/special")
    scriptBlock=dom.querySelector('script')
    expect(scriptBlock).toBeTruthy()
    expect(scriptBlock.innerHTML).toEqual("foo bar")
    expect(scriptBlock.getAttribute("type")).toEqual("super/special")

  it "can add features", ->
    spyOn(assembler,"withScript")
    assembler.withFeature({name:"foo.feature",src:"Funktionalität Foo"})
    expect(assembler.withScript).toHaveBeenCalledWith(
      "Funktionalität Foo",
      "application/gherkin"
    )

