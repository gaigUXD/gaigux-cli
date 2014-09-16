'use strict';

var fs = require('fs');
var constants = require('./constants');

module.exports = function ensureExists(path, mask, cb) {
  if (typeof mask == 'function') { // allow the `mask` parameter to be optional
    cb = mask;
    mask = 484;
  }
  fs.mkdir(path, mask, function (err) {
    if (err) {
      if (err.code == 'EEXIST') { // folder already exists
        cb(constants.folderExists);
      } else { // something else went wrong
        cb(err);
      }
    } else { // successfully created folder
      cb(null);
    }
  });
};