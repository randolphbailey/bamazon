const mysql = require('mysql');
var inquirer = require('inquirer');
const table = require('table');

//MySQL connection configuration
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "bamazon",
    port: '8889'
  });

con.connect(function(err) { if (err) throw err; });

//Asks the manager what they would like to do
inquirer
  .prompt({
      type: 'list',
      name: 'command',
      choices: [
          {
              name: 'View Products for Sale',
              value: 0
          },
          {
              name: 'View Low Inventory',
              value: 1
          },
          {
              name: 'Add to Inventory',
              value: 2
          },
          {
              name: 'Add New Product',
              value: 3
          }
      ]
  })
  .then(answers => {
      switch(answers.command) {
        case 0:
            view();
            break;
        case 1:
            low();
            break;
        case 2:
            view("add");
            break;
        case 3:
            view("new");
            break;
      }
  });

  //Displays store items in table form
  function view(add) {
    var query = "SELECT * FROM products";
    con.query(query, function (err, result) {
        if (err) throw err;
        var data = [["Item ID", "Product Name", "Department", "Price", "Stock Quantity"]];
        for (let i=0; i < result.length; i++) {
            let itemRow = [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity];
            data.push(itemRow);
        }
        console.log(table.table(data));
        if (add == "add") { addInventory(); }
        if (add == "new") { newProduct(); }
    });
  }

  //Displays items which have low stock
  function low() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    con.query(query, function (err, result) {
        if (err) throw err;
        var data = [["Item ID", "Product Name", "Department", "Price", "Stock Quantity"]];
        for (let i=0; i < result.length; i++) {
            let itemRow = [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity];
            data.push(itemRow);
        }
        console.log(table.table(data));
    });
  }

  //Adds inventory to the database
  function addInventory() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Which product would you like to add inventory to? Enter ID:'
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many units should be added?'
        }
    ])
    .then(answers => {
        var query = `UPDATE products SET stock_quantity = stock_quantity + ${answers.quantity} WHERE item_id = ${answers.id}`;
        con.query(query, function(err, result) {
            if (err) throw err;
        });
        var output = answers.quantity + " units have been added to item " + answers.id;
        console.log(output);
    });
  }

  //Adds a new product to the database
  function newProduct() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Name of new product:'
        },
        {
            type: 'input',
            name: 'department',
            message: 'Department of new product:'
        },
        {
            type: 'input',
            name: 'price',
            message: 'Price of new product:'
        },
        {
            type: 'input',
            name: 'stock',
            message: 'Initial stock of new product:'
        }
    ])
    .then(answers => {
        var query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${answers.name}', '${answers.department}', ${answers.price}, ${answers.stock})`;
        con.query(query, function(err, result) {
            if (err) throw err;
        });
        var output = answers.stock + " units of " + answers.name + " have been added to department " + answers.department + " @ $" + answers.price;
        console.log(output);
    });
  }