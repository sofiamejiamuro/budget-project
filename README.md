# BUDGET-PROJECT

## Planning
(aqui va imagen de ipad)

## Module pattern

Completely independent modules, that will never interact between them, stand alone.
```js
var budgetController = (function() {

  var x = 23;

  var add = function(a){
    return x + a;
  }

  return {
    publicTest: function(b){
      // console.log(add(b));
      // we have to return the value of add(b) in order to use this method result outside another module
      return add(b);
    }
  }

})();
```
```js
var UIController = (function () {

})();
```
```js
// This controller will take controll of the two above so can receive as a parameter both of them
var controller = (function (budgetCtrl, UICtrl){

  var z = budgetController.publicTest(10);
  return {
    anotherPublic: function(){
      console.log(z);
    }
  }
})(budgetController, UIController);
```
