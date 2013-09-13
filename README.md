cuke2go
=======

Bundles up your Cucumber-JS test suite, so you can run it in a browser.


## Why?
- smoke test when rolling out to production
- showing off ;-)
- if you *have* to test UI stuff: don't bother with Selenium & Co. 


## Tools involved
- Cucumber-JS (currently we use a patched version)
- uitest
- browserify

## How it is supposed to work

On the command line, instead of `cucumber-js`, run
``` bash
cuke2go [<args>]
```
cuke2go accepts the same arguments as cucumber-js does. In fact it *uses* the argument parser of cucumber-js.
But instead of running your tests, it will output (currently to stdout) an HTML document that includes
- all the features that would have been run by cucumber
    - TODO: @tags ar ignored right now. 
- all your support code files and their dependencies 
- some boilerplate to make uitest work (so you can load your app in an iframe)
    - TODO: this is not finished.
- boiler plate for running the scenarios and report the results.
    - This code is based on examples from the cucumber-js distribution, only including a few tweaks.

## Limitations
Of course there are conceptual limitations to this approach
- some dependencies may be difficult to browserify 
- You can only interact with your app through the dom or ajax requests. This is no 
  problem for unit tests, but may be a problem with integration tests. Depends on your architecture.
  
## Status: w.i.p.

