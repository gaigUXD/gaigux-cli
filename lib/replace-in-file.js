'use strict';

var fs = require('fs');
var reporter = require('./reporter');

module.exports = function(path, replacements) {
  var i, replacementsLength;
  var fileContents = fs.readFileSync(path, 'utf8');

  if (replacements) {
    i = 0;
    replacementsLength = replacements.length;

    for (i; i < replacementsLength; i++) {
      fileContents = fileContents.replace(replacements[i].pattern,
        replacements[i].replacement);
    }

    fs.writeFileSync(path, fileContents);
  }

//  function(err, fileContents) {
//    var i, replacementsLength;
//
//    if (replacements) {
//      replacementsLength = replacements.length;
//
//      for (i = 0; i < replacementsLength; i++) {
//        fileContents = fileContents.replace(replacements[i].pattern,
//          replacements[i].replacement);
//      }
//    }
//
//    fs.writeFile(path, fileContents, function(err) {
//      if (err) {
//        reporter.error(err);
//      }
//    });
//
//  }

};