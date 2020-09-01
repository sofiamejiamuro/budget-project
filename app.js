// BUDGET CONTROLLER
var budgetController = (function() {

})();

// UI CONTROLLER
var UIController = (function () {

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl){
  var ctrlAddItem = function(){
    // 1. Get the input data

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI
    console.log('it works!');

  }
  document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);
  
  document.addEventListener('keypress', function(e){
    // chose the exact key, this fucntion can receive the event aargument
    console.log(e);
    if(e.keyCode === 13 || e.which === 13){
      console.log('ENTER was pressed');
      ctrlAddItem()
    }

  });


})(budgetController, UIController);
