Config = require("../lib/c2g-config")
Cucumber = require("cucumber")
describe "mimic cucumbers CLI", ->
  
  cukeArgParser=undefined
  cukeConfig=undefined

  beforeEach ->
    #make sure we can hook into any calls to the cucumber APIs
    Cli=Cucumber.Cli
    cukeArgParser=Cli.ArgumentParser()
    cukeConfig=Cli.Configuration()
    spyOn(Cli,"ArgumentParser").andReturn cukeArgParser
    spyOn(Cli,"Configuration").andReturn cukeConfig
    spyOn(cukeArgParser,"parse")
    spyOn(cukeArgParser,"getSupportCodeFilePaths").andReturn [
      "path/to/foo.js",
      "other_path/to/bar.js"
    ]
    spyOn(cukeArgParser,"getFeatureDirectoryPaths").andReturn [
      "path",
      "other_path"
    ]
    spyOn(cukeConfig,"getFeatureSources").andReturn [
      ["path/foo.feature","Funktionalität: foo"],
      ["other_path/bar.feature","Funktionalität: bar"]
    ]

  
  it "uses cucumber's argument parser to find support code libs", ->
    config = Config(['a','b','c'])
    expect(cukeArgParser.parse).toHaveBeenCalledWith(any(Array))
    expect(config.supportCode).toEqual [
      name:"to/foo.js"
      path:"path/to/foo.js"
    ,
      name:"to/bar.js"
      path:"other_path/to/bar.js"
    ]

  it "knows which features need to be run", ->
    config = Config([])
    expect(config.features).toEqual [
      name:"foo.feature"
      src:"Funktionalität: foo"
    ,
      name:"bar.feature"
      src:"Funktionalität: bar"
    ]
