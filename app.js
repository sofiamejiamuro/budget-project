// BUDGET CONTROLLER
var budgetController = (function() {
  // How to store data

  // Make a function constructor to create different instances of the same eobject, for Expenses and for Incomes
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  }

  // Create a method through prototype that allows the method do not be attached to each individual object instead ibjects will inherit the method
  
  // How to store all the data?
  /* var allExpenses = [];
  var allIncomes = [];
  var totalExpenses = 0; */
  
  // Instead of store one by one, it is better to make a object

  var data = {
    allItems :{
      allExpenses : [],
      allIncomes : [],
    },
    totals : {
      exp: 0,
      inc: 0
    }
  }

  return  {
    addItem :function(type, des, val){
      var newItem;

      // the id to be equal last id + 1 
      ID = 0;
      

      if(type === 'exp'){
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);

      return newItem;
    }
  }
})();

// UI CONTROLLER
var UIController = (function () {
  var DOMstrings = {
    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    inputBtn: '.add__btn'

  }
  return {
    // Method to read the input and must be public and retunr a object to acces them together
    getInput: function(){
      return {
        // select element
        type : document.querySelector(DOMstrings.inputType).value, // either inc or exp
        // input element
        description : document.querySelector(DOMstrings.inputDescription).value,
        // input element
        value : document.querySelector(DOMstrings.inputValue).value
      }
    },
    getDOMstrings: function(){
      return DOMstrings;
    }
  }

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl){
  // Create two private functions that do two main different thigns, one for the event listeners and one for adding a element

  // setting all the event listeners
  var setUpEventListeners = function (){

    var DOM = UIController.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
  
    document.addEventListener('keypress', function(e){
      // chose the exact key, this fucntion can receive the event aargument
      //console.log(e);
      if(e.keyCode === 13 || e.which === 13){
        //console.log('ENTER was pressed');
        ctrlAddItem()
      }
    });
  };


  var ctrlAddItem = function(){
    // 1. Get the input data
    var input = UIController.getInput();
    // console.log(input);

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI
    console.log('it works!');

  };

  // Lets make a init pucblic function in order to execute the function serUpEventListeners
  return {
    init: function(){
      console.log('Application has started');
      setUpEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();