'use strict';

var fs = require('fs');
var S = require('string');
var ensureExists = require('./ensure-exists');
var newFileFromScaffold = require('./new-file-from-scaffold');
var constants = require('./constants');
var reporter = require('./reporter');

module.exports = function(args) {
  var moduleName = S(args._.shift()).camelize().s;
  var modulePath = './app/modules/' + S(moduleName).dasherize().s;
  var controllersPath = modulePath + '/controllers';
  var imagesPath = modulePath + '/images';
  var lessPath = modulePath + '/less';
  var servicesPath = modulePath + '/services';
  var templatesPath = modulePath + '/templates';
  var generateRoute = (args.route) ? true : false;
  var replacements = [
    {
      pattern: /\$\{moduleName\}/g,
      replacement: moduleName
    },
    {
      pattern: /\$\{controllerName\}/g,
      replacement: moduleName + 'Ctrl'
    },
    {
      pattern: /\$\{controllerFile\}/g,
      replacement: S(moduleName).dasherize().s + '.controller'
    },
    {
      pattern: /\$\{moduleTitleCase\}/g,
      replacement: S(S(moduleName).humanize().s).capitalize().s
    },
    {
      pattern: /\$\{moduleDashCase\}/g,
      replacement: S(moduleName).dasherize().s
    }
  ];

  ensureExists(modulePath, function(err) {
    if (err === constants.folderExists) {
      reporter.warn('module `' + modulePath + '` already exists. Aborting...');
    } else {

      if (generateRoute) {
        newFileFromScaffold(modulePath, moduleName + '.js', 'module-with-route.scaffold', replacements);
        newFileFromScaffold(templatesPath, moduleName + '.tpl', 'template.scaffold', replacements);
      } else {
        newFileFromScaffold(modulePath, moduleName + '.js', 'module.scaffold', replacements);
      }

      newFileFromScaffold(controllersPath, moduleName + '.controller.js', 'controller.scaffold',
        replacements);

      reporter.success('New module `' + modulePath + '` created.');
    }

    ensureExists(controllersPath, function(err) {
      if (!err) {
        reporter.success('New folder `' + controllersPath + '` created');
      }
    });
    ensureExists(imagesPath, function(err) {
      if (!err) {
        reporter.success('New folder `' + imagesPath + '` created');
      }
    });
    ensureExists(lessPath, function(err) {
      if (!err) {
        reporter.success('New folder `' + lessPath + '` created');
      }
    });
    ensureExists(servicesPath, function(err) {
      if (!err) {
        reporter.success('New folder `' + servicesPath + '` created');
      }
    });
    ensureExists(templatesPath, function(err) {
      if (!err) {
        reporter.success('New folder `' + templatesPath + '` created');
      }
    });
  });
};