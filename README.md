# NgDiceCream

A simple dice roller, developed with Angular.

Note: Once you have build the application, you need a local server for running the java script app in the browser.

## How it works

The pool of dice is separated into heaps. Each heap is exactly for one kind of die. So you may have a heap for the d6, another one for the d10, and so on.

You can roll all dice in the entire pool at once, or roll the dice of one heap. The sum of all rolled dice is displayed, the sum for each rolled heap is displayed, and the outcome of each rolled die is shown, too.

## The interface

### Add heaps

A form for adding new heaps of dice to the pool is found in the beginning of the page. You can also add dice to an existing heap.

### General overview.

Next you find a general overview. You can roll all dice in the pool at once from here. A descriptor of the pool is shown here, saying something like 2d4+5d6+1d20+9d42. Finally, the result of the last roll is highlighted here. This line shows the results of both rolls of the pool and rolls of an individual heap.

The pool descriptor and the roll outcome are polite aria-live regions.

### Heaps

At last, the heaps are shown in ascending order by the number of facets. 

In each heap, a headline announces a heap descriptor, i.e. 2d8 and such. For each heap, you find
- a button for rolling the dice in the heap only. When you roll the eintire pool, each heap is rolled.
- the sum of the dice from the last roll of the heap
- a list of the individual roll results of each dice from the last roll of the heap
- a button for adding one die to the heap
- a button for removing one die from the heap. This works only if the heap contains more than one die.
- a button for removing the entire heap from the pool.

## Disclaimer

The PRNG skips some outputs based on the current timestamp. This adds some real randomness to the outcomes. However, the PRNG is not a crzptographically secure one. So don't expect too exquisite outcomes.