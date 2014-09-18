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
        newFileFromScaffold(modulePath, moduleName + '.js', 'module-with-route', replacements);
      } else {
        newFileFromScaffold(modulePath, moduleName + '.js', 'module', replacements);
      }

      ensureExists(controllersPath, function(err) {
        if (!err) {
          reporter.success('New folder `' + controllersPath + '` created');

          newFileFromScaffold(controllersPath, moduleName + '.controller.js', 'controller',
            replacements);
        }
      });

      ensureExists(templatesPath, function(err) {
        if (!err) {
          reporter.success('New folder `' + templatesPath + '` created');

          if (generateRoute) {
            newFileFromScaffold(templatesPath, moduleName + '.tpl', 'template', replacements);
          }
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

      reporter.success('New module `' + modulePath + '` created.');
    }

  });
};