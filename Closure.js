// the ability of a function to "remember" its lexical scope when being called from another lexical scope.

{
  function foo() {
    var bar = 42;
    return function() {
      console.log(bar);
    };
  }

  foo()(); // 42
}

// closed over the same variable, doesnt 'snapshot' the value
{
  function foo() {
    var bar = 0;

    setTimeout(function() {
      console.log(bar++);
    }, 100);
    setTimeout(function() {
      console.log(bar++);
    }, 200);
  }

  foo(); // 0 1
}

// closure can be multiple scopes deep
// variables do not get garbage collected until ALL the closures over a scope are finished executed and no longer referenced
{
  function foo() {
    var bar = 'bar';

    setTimeout(function() {
      var bam = 'bam';
      console.log(bar);

      setTimeout(function() {
        console.log(`${bar} ${bam}`);
      }, 200);
    }, 100);
  }

  foo();
  // bar
  // bar bam
}

// i get hoisted to the block scope and thus the same `i` is used in the closures.  so the `i` is being modified be the for loop and finished at 6 by the time the function callback runs.  in order to get 1 2 3 4 5 you would need to close over a new variable each time.

{
  for (var i = 1; i <= 5; i++) {
    setTimeout(function() {
      console.log('i: ' + i);
    }, i * 100);
  }
  // 6 6 6 6 6

  for (var i = 1; i <= 5; i++) {
    let j = i; // closes over the let instead, which is inside the for loop scope, so it creates a new variable each block
    setTimeout(function() {
      console.log('j: ' + j);
    }, i * 100);
  }
  // 1 2 3 4 5

  for (let i = 1; i <= 5; i++) {
    // javascript allows shorthand of `let` in the for loop to create a new variable `i` per loop.
    setTimeout(function() {
      console.log('i: ' + i);
    }, i * 100);
  }
  // 1 2 3 4 5
}

// a closuse is a characteristic of a function, NOT the function itself
