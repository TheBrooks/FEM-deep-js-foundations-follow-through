/*
  Every function(except arrow functoins) has a refernce to its current execution context called this
*/

// the this keyword depends SOLELY on 'how' the function was called.
// there are 4 ways for a function that can be called that affects how the this keyword is scoped
{
  function foo() {
    console.log(this.bar);
  }

  var bar = "bar1";
  var o2 = { bar: "bar2", foo: foo };
  var o3 = { bar: "bar3" };

  foo(); // bar1
  o2.foo(); // bar2
  foo.call(o3); // bar3
}

// default rule: if a function doesnt match other this` rules then default the 'this' keyword to the global object.  in strict mode the 'this' keyword stays undefined which throws an arror when calling this.

// if the function is called from a context object such as o2, this is implicitly binded to the context of the calling object.
// "call foo in the context of o2".

// explicit this binding:  the context can be explictly set with the .apply() .call() and .bind() function.  by explitily setting the this through explicit binding the flexibilty of the 'this' keyword is lost.  its a trade off, trading off flexibility of this for predictability of the calling context scope.

// Both flexibility of dynamic binding and predicatibilty of fixed context binding have benifits and neither is a 'bad' thing. The ability to choose between either and pick the more useful way in any given situation make javascript more powerful.

{
  function foo() {
    this.baz = "baz";
    console.log(this.bar + " " + baz);
  }

  var bar = "bar";
  var baz = new foo();
}

/* new this binding, makes a new thing to set the context as 'this'
  new keyword does 4 things:
  1. creates a brand new empty object out of thin air {}
  2. the newly created object gets linked to another object
  3. the newly create object gets passed in as the `this` of the function call
  4. if the function does not return its own object, the implied return is the new object ('implied return this')
*/

// the order of the precidence rules of 'this' context being set goes as follow (if multiple rules can be matched the higher precedence wins)
/*
  1. new binding (new)
  2. explicitly provided context (.apply(), .call(), .bind())
  3. implicitly provided context (obj.foo())
  4. default to global object (except strict mode)
*/
