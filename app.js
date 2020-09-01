/////////// BUDGET CONTROLLER ///////////
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
      exp : [],
      inc : [],
    },
    totals : {
      exp: 0,
      inc: 0
    }
  }

  return  {
    addItem :function(type, des, val){
      
      var newItem, ID;

      // Create new ID
        // the id to be equal last id + 1 ,length 5 that is position 4 + 1
        // We will generate a id following the position
      if (data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      
      // Crete new item baased on 'inc' or 'exp' type
      if(type === 'exp'){
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it to data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },
    testing: function(){
      console.log('data',data);
    }
  }

})();

////////// UI CONTROLLER  ///////////
var UIController = (function () {
  var DOMstrings = {
    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
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
    addListItem : function(obj, type){
      var html, newHtml, element;
      // 1. Create HTML string with place holder text
      if ( type === 'inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
      }
      
      // 2. Reeplace the placeholder text with come actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
    },
    getDOMstrings: function(){
      return DOMstrings;
    }
  }

})();

//////// GLOBAL APP CONTROLLER ////////

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
    // Declare all variables
    var input, newItem;
    // 1. Get the input data
    input = UIController.getInput();
    // console.log(input);

    // 2. Add the item to the budget controller
    newItem = budgetController.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI
    UIController.addListItem(newItem, input.type)
    // 4. Calculate the budget

    // 5. Display the budget on the UI
    

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