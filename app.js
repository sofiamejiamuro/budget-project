/////////// BUDGET CONTROLLER ///////////
var budgetController = (function() {
  // How to store data

  // Make a function constructor to create different instances of the same eobject, for Expenses and for Incomes
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    if(data.totals.inc > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);

    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };
  // Create a method through prototype that allows the method do not be attached to each individual object instead ibjects will inherit the method
  
  // How to store all the data?
  /* var allExpenses = [];
  var allIncomes = [];
  var totalExpenses = 0; */
  
  // Instead of store one by one, it is better to make a object

  var calculateTotal = function(type){
    // We need to use the data stored in exp or inc array, then loop over the correspondant array and then take out the value needed from the object of each element
    var sum = 0;

    data.allItems[type].forEach(function (current, index, array){
      sum += current.value;
    })

    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    // -1 means does not exist
    percentage: -1
  };

  return  {
    addItem: function(type, des, val){
      
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
    deleteItem: function(type, id){
      var ids, index;
      // The differences between forEach and map is that map returns a complete new array
      ids = data.allItems[type].map(function(current, index, array){
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1){
        // remove elements
        data.allItems[type].splice(index, 1);
      }

    },
    calculateBudget: function(){
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the buget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Percentage of Income wasted
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      };

    },
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(current, index, array){
        current.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function(){
      var allPerc = data.allItems.exp.map(function(current, index, array){
        return current.getPercentage();
      });
      return allPerc;
    },
    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    // This method exposes the data structure of this module
    testing: function(){
      console.log('data',data);
    }
  };

})();


////////// UI CONTROLLER  ///////////
var UIController = (function () {

  var DOMstrings = {
    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel:'.budget__value',
    incomeLabel:'.budget__income--value',
    expensesLabel:'.budget__expenses--value',
    percentageLabel:'.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber =  function(num, type){
    var numSplit, int, dec;
    // + or - before a number
    // exactly 2 decimal points
    // comma separating thousands

    // Maath.abs() return the absolute vaue of a number
    num = Math.abs(num);

    // to fix a method of the number protoype that only allows the numbers passed as a parameter in decimals if there is no decimal 2 zeros appear
    num = num.toFixed(2); // 2000.58

    // comma separating thousands
    // .split willl return an array with thw ingers and the decilam part
    numSplit = num.split('.'); // [2000,58]
    
    int = numSplit[0];
    if(int.length > 3){
      // subtrings, tkaaes only a part of the string, the fist argument is where we want to start aand the seconf is how many places we want to read
      //int = int.substr(0, 3) + ',' +  int.substr(1, 3);
      int = int.substr(0, int.length-3) + ',' +  int.substr(int.length-3, 3);
    };

    dec = numSplit[1];

    return (type === 'exp' ?  '-':  '+') + ' ' + int + '.' + dec;

  }

  // Instead of hack the node list we can create a forEach function alike
  var nodeListForEach = function(list, callback){
    for (var i = 0; i < list.length; i++){
      callback(list[i],i);
    }
  } 

  return {
    // Stablish selector option by default
    addElementOption: function(){
      var val, select;
      val = 'inc';
      select = document.querySelector(DOMstrings.inputType)
      //console.log(document.querySelector(DOMstrings.inputType).val(val));

      for(var i, j = 0; i = select.options[j]; j++) {
        if(i.value == 'inc') {
            select.selectedIndex = j;
            break;
        }
      }
    },
    // Method to read the input and must be public and retunr a object to acces them together
    getInput: function(){
      return {
        // select element
        type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
        // input element
        description: document.querySelector(DOMstrings.inputDescription).value,
        // input element
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },
    addListItem: function(obj, type){
      var html, newHtml, element;
      // 1. Create HTML string with place holder text
      if ( type === 'inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
      }
      
      // 2. Reeplace the placeholder text with come actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
    },
    deleteListItem: function(selectorID){
      var el;
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el)

    },
    clearFields: function(){
      var fields, fieldsArray;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
      // console.log(fields);
      // a NodeList input description + input value

      fieldsArray = Array.prototype.slice.call(fields);
      // console.log(fieldsArray);
      // Array [input description , input value]

      fieldsArray.forEach(function (current, index, array){
        current.value = "";
      });

      fieldsArray[0].focus();
    },
    displayBudget: function (obj){
      var type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '----';
      }
    },
    displayPercentages: function(percentages){
      var fields;
      fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index){
        if(percentages[index] > 0){
          current.textContent = percentages[index] + '%'; 
        } else {
          current.textContent = '---'; 
        }
        
      })

    },
    displayMonth: function(){
      var now, year, month, months;
      
      now = new Date();
      months = [ 'January' , 'February', 'March' , 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      // In the object new Date () months are 0 based  
      month = now.getMonth()
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

    },
    changedType: function (){

      // querySelector all returns a NodeList of html elements
      var fields = document.querySelectorAll(
        DOMstrings.inputType +  ',' + 
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function(cur){
        cur.classList.toggle('red-focus')
      })

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },
    getDOMstrings: function(){
      return DOMstrings;
    }
  };

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

    // Event delegation
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    // Onchange
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

  };

  var updateBudget = function(){
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget =  budgetCtrl.getBudget();

    // 3 . Display the budget on the UI
    UICtrl.displayBudget(budget);
    
  };

  var updatePercentages = function(){
    // 1. Calculate percentages
      budgetCtrl.calculatePercentages();
    // 2. Read percentages from the buget controller
      var percentages = budgetCtrl.getPercentages();
    // 3. Update UI
      UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function(){
    // Declare all variables
    var input, newItem;
    // 1. Get the input data
    input = UIController.getInput();
    // console.log(input);

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. Add the item to the budget controller
      newItem = budgetController.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UIController.addListItem(newItem, input.type)

      // 4. Clear the fields
      UIController.clearFields()

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    } 

  };

  var ctrlDeleteItem = function(e){
    var itemID, splitID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      // inc-1
      splitID = itemID.split('-'); // ['inc','1']
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from the data tructure
      budgetCtrl.deleteItem(type, ID)

      // 2. Delete the item from UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
    

  };

  // Lets make a init pucblic function in order to execute the function serUpEventListeners
  return {
    init: function(){
      console.log('Application has started');
      UICtrl.addElementOption();
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0,
      });
      setUpEventListeners();
      
    }
  };

})(budgetController, UIController);

controller.init(); 