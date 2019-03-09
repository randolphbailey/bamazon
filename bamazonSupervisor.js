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
            view();
            break;
        case 1:
            low();
            break;
      }
  });