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

inquirer
  .prompt({
      type: 'list',
      name: 'command',
      choices: [
          {
              name: 'View Product Sales by Department',
              value: 0
          },
          {
              name: 'Create New Department',
              value: 1
          }
      ]
  })
  .then(answers => {
      switch(answers.command) {
        case 0:
            departmentSales();
            break;
        case 1:
            newDepartment();
            break;
      }
  });

  //View the sum of sales by department and show total profit.
  function departmentSales() {
    var query = "SELECT departments.`department_id`, products.`department_name`, departments.`over_head_costs`, SUM(products.`product_sales`) AS department_sales, (SUM(products.`product_sales`) - departments.`over_head_costs`) AS total_profit FROM products RIGHT JOIN departments ON products.`department_name` = departments.`department_name` GROUP BY departments.`department_id`";
    con.query(query, function (err, result) {
        if (err) throw err;
        var data = [["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"]];
        for (let i=0; i < result.length; i++) {
            let itemRow = [result[i].department_id, result[i].department_name, result[i].over_head_costs, result[i].department_sales, result[i].total_profit];
            data.push(itemRow);
        }
        console.log(table.table(data));
    });
  }

  //Create a new department
  function newDepartment() {
      inquirer
      .prompt([
          {
              type: 'input',
              name: 'name',
              message: 'Name of new department: '
          },
          {
              type: 'input',
              name: 'overhead',
              message: 'Overhead Costs: '
          }
      ])
      .then(answers => {
        var query = `INSERT INTO departments (department_name, over_head_costs) VALUES ('${answers.name}', '${answers.overhead}')`;
        con.query(query, function(err, result) {
            if (err) throw err;
        });
        var output = answers.name + " department added with overhead costs of $" + answers.overhead;
        console.log(output);
      })
  }