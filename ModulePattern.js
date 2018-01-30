var foo = (function() {
  var o = { bar: 'bar' };

  return {
    bar: function() {
      console.log(o.bar);
    }
  };
})();

// this hides what needs to be hidden
foo.bar(); // "bar"

//object returned on line 5 is annonymouns
// no internal reference to its own api.
// foo has a reference.
// what if I want to call an internal method from inside the returned object or add/remove public api

var foo = (function() {
  var publicAPI = {
    bar: function() {
      publicAPI.baz();
    },
    baz: function() {
      console.log('baz');
    }
  };
})();

foo.bar();
// now with the publicAPI varaible the internal api can have interal references
// two characteristics present in this model. must be present
// 1. must be an outer enclosing scope(usually funciton) that is run at least once (if once, then its a singleton modules, if more then its kinda of a module factory)
// 2. at least one internal function in the publicAPI that has closure over the interal state that gets returned.

// as of es6 there is dedicated module syntax
// with explicit exports and explicit imports
// if its used as an import then only what is exported is publically allowed
// module by default has everything hidden. only what is added to the export list is public.
// entire content of the file is treated as the module.  file based modules
// impossible to package multiple modules into a single file
