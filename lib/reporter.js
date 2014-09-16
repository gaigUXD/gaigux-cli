'use strict';

var chalk = require('chalk');

module.exports = {

  error: function (err) {
    console.log(chalk.red(err));
  },

  warn: function (warning) {
    console.log(chalk.yellow(warning));
  },

  log: function(msg) {
    console.log(chalk.blue(msg));
  },

  success: function(msg) {
    console.log(chalk.green(msg));
  }
};