'use strict';

var fs = require('fs');
var S = require('string');
var constants = require('./constants');
var reporter = require('./reporter');

module.exports = function newFile(path, name, scaffold, replacements) {
  var i;
  var replacementsLength;
  var scaffoldPath = '../scaffolds/' + scaffold;

  name = S(name).dasherize().s;

  fs.readFile(scaffoldPath, 'utf8', function(err, scaffoldContents) {
    if (err) {
      reporter.error(err);
    } else {
      if (replacements) {
        replacementsLength = replacements.length;

        for (i = 0; i < replacementsLength; i++) {
          scaffoldContents = scaffoldContents.replace(replacements[i].pattern,
            replacements[i].replacement);
        }
      }
    }

    fs.writeFile(path + '/' + name, scaffoldContents, function(err) {
      if (err) {
        reporter.error(err);
      } else {
        reporter.success('New file `' + path + '/' + name + '` created')
      }
    });
  });
};