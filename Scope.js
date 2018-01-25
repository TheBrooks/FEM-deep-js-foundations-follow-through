// scope = where to look for things

// 2 quetions come to mind
// what are we looking for? - any variable/ any identifier
// - show up retrieving or setting

// scope is a compile time process
// scope decisions happen at COMPILE time not runtime

// Syntax errors before it executes b/c its compiled

/* work through the various blocks*/
// assume NOT using strict
{
  var foo = 'bar';

  function bar() {
    var foo = 'baz';

    function baz(foo) {
      foo = 'bam';
      bam = 'yay';
    }
    baz();
  }

  bar();
  foo;
  bam;
  baz();
}

// if not in strict.  unforfilled LHS references create a global scope
// if `use strict` then unforfilled LHS reference throw ReferenceError
// if strict or not, unforfilled RHS always throw a ReferenceError

// babel defaults to strict

// undefined : been declared but does not current have any other value
// undeclared: never been declared in any known scope

// lexical scope is MOSTLY known at compile time
// if it does have to look up scope at runtime then the lexical scope is set and does not have to be figured out again

{
  var foo = function bar() {
    var foo = 'baz';

    function baz(foo) {
      foo = bar;
      foo; // function...
    }
    baz();
  };

  foo();
  bar(); // ERROR - named function expression vs function declaration.  name identifer added to its own scope, not outside its scope
}

{
  var foo;

  try {
    foo.length;
  } catch (err) {
    console.log(err); // TypeError
  }

  console.log(err); // ReferenceError
}

// named function expression
{
  var clickHandler = function() {
    // .. Annonymous function expression
  };

  var keyHandler = function keyHandler() {
    // .. named function expression
    // okay for the names to be the same or to be named different
  };
  /* 
    some prefer the named function expression over the anonymous function expression
    - handy function self-reference
    - more debuggable stack traces
    - more self-documenting code
  */
}

// function declaration vs function expression
// function declaration have to have names

// lexical scope is more optimizable at compile time

// immediately invoked function expression
{
  var foo = 'foo'(function IIFE(bam) {
    var foo = 'bar';
    console.log(foo); // bar
  })(foo);
  console.log(foo); // foo
}
// create a scope to not polute the outer scope and have it execute immediatly but only need it once

// es6 has lightweight blocks

// var hoists and assigns undefined
// let hoists but does not addign undefined
