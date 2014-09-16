'use strict';

var fs = require('fs');

module.exports = function(path, replacements) {

  fs.readFileSync(path, 'utf8', function(err, fileContents) {
    var i, replacementsLength;

    if (replacements) {
      replacementsLength = replacements.length;

      for (i = 0; i < replacementsLength; i++) {
        fileContents = fileContents.replace(replacements[i].pattern,
          replacements[i].replacement);
      }
    }

    fs.writeFileSync(path, fileContents, function(err) {
      if (err) {
        reporter.error(err);
      }
    });

  });

};