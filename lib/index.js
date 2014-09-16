#!/usr/bin/env node
'use strict';

var pkg = require('../package');
var constants = require('./constants');
var reporter = require('./reporter');
var init = require('./init');
var newModule = require('./new-module');
var prompt = require('prompt');
var argv = require('optimist').argv;

var command = argv._.shift();

if (argv.version) {
  reporter.success('GAIGUX Command Line Interface ' + pkg.version);
  return;
}

switch(command) {
  case constants.commands.init:
    init(argv);
    break;

  case constants.commands.module:
    newModule(argv);
    break;

  default:
    reporter.error("Invalid command");
}




//prompt.start();
//prompt.get({
//  properties: {
//    name: {
//      description: "What is your name?".blue
//    }
//  }
//}, function (err, result) {
//  console.log(result.name.red);
//});

//console.log('Hello ' + (argv.name || 'World') + '!');