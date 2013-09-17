Cucumber = require("cucumber");

module.exports=function(args){
  var argParser = Cucumber.Cli.ArgumentParser();
  argParser.parse(args);
  var dirs=argParser.getFeatureDirectoryPaths();
  var cfg=Cucumber.Cli.Configuration(args);
  var makeRelative=function(absolute){
    var relative=absolute;
    dirs.some(function(dir){
      if(absolute.substr(0,dir.length)==dir){
        relative=absolute.substr(dir.length+1);
        return true;
      }
    });
    return relative;
  }

  return {
    supportCode:argParser.getSupportCodeFilePaths().map(function(path){
      return {
        name:makeRelative(path),
        path:path
      };
    }),
    features: cfg.getFeatureSources().map(function(feso){
      return {
        name:makeRelative(feso[0]),
        src:feso[1].toString()
      };
    })
  }
}
