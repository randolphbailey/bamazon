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

//Print table of items and info
con.connect(function(err) {
    if (err) throw err;
    var query = "SELECT * FROM products";
    con.query(query, function (err, result) {
        if (err) throw err;
        var data = [["Item ID", "Product Name", "Department", "Price", "Stock Quantity"]];
        for (let i=0; i < result.length; i++) {
            let itemRow = [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity];
            data.push(itemRow);
        }
        console.log(table.table(data));
        purchase();
    });
});

//Takes input of item and quantity customer wants to purchase
function purchase() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'id',
            message: 'What is the ID of the product you would like to buy?'
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to buy?'
        }
    ])
    .then(answers => {
        var id = parseInt(answers.id);
        var quantity = parseInt(answers.quantity);
        var query = `SELECT stock_quantity, price FROM products WHERE item_id = ${id}`;
        con.query(query, function(err, result) {
            if (err) throw err;
            updateDB(id, quantity, result[0].stock_quantity, result[0].price);
        });
    });
}

//Updates the database based on customer input
function updateDB(id, quantity, stock_quantity, price) {
    if (stock_quantity < quantity) {
        console.log("Insufficient Stock");
    }
    else {
        var total = quantity * price;
        var newStock = stock_quantity - quantity;
        var query = `UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${id}`;
        con.query(query, function(err, result) {
            if (err) throw err;
        });
        var output = "Thank you for your purchase of $" + total;
        console.log(output);
    }
}