'use strict';

var fs = require('fs');
var S = require('string');
var constants = require('./constants');
var reporter = require('./reporter');

module.exports = function newFile(path, name, scaffold, replacements) {
  var i;
  var replacementsLength;
  var scaffoldContents;

  switch(scaffold) {
    case 'controller':
      scaffoldContents = "'use strict';" +
        "\n\n" +
        "function ${controllerName}() {" +
        "\n\tvar vm = this;" +
        "\n\n\t(function init() {" +
        "\n\n\t\tvm.hello = 'Hello from ${moduleTitleCase}';" +
        "\n\n" +
        "\t})();" +
        "\n\n" +
        "}" +
        "\n\n" +
        "module.exports = ${controllerName};";
      break;

    case 'module':
      scaffoldContents = "'use strict'" +
        "\n\n" +
        "module.exports = angular.module('${moduleName}', [])" +
        "\n\n" +
        "\t.controller('${controllerName}', require('./controllers/${controllerFile}'));";
      break;

    case 'module-with-route':
      scaffoldContents = "'use strict'" +
        "\n\n" +
        "module.exports = angular.module('${moduleName}', [])" +
        "\n\n" +
        "\t.controller('${controllerName}', require('./controllers/${controllerFile}'))" +
        "\n\n" +
        "\t.config(function ${moduleName}Config($routeProvider) {" +
        "\n\n" +
        "\t\t$routeProvider" +
        "\n\t\t\t.when('/${moduleName}', {" +
        "\n\t\t\t\tcontroller: '${controllerName}'," +
        "\n\t\t\t\tcontrollerAs: '${moduleName}'," +
        "\n\t\t\t\ttemplateUrl: 'templates/${moduleDashCase}.html'," +
        "\n\t\t\t\tpageTitle: '${moduleTitleCase}'," +
        "\n\t\t\t\tpageIcon: null" +
        "\n\t\t\t});" +
        "\n\n" +
        "\t});"
      break;

    case 'template':
      scaffoldContents = '<div ng-include src="\'templates/navhelper.html\'"></div>' +
        '\n\n<div class="gaig-main container">' +
        '\n\t<div class="gaig-stage no-sidebar">' +
        '\n\t\t<div class="gaig-stage-inner">' +
        '\n\t\t\t<div class="container">' +
        '\n\t\t\t\t<div class="row">' +
        '\n\t\t\t\t\t<div class="span12">' +
        '\n\t\t\t\t\t\t<h1 class="text-center">{{${moduleName}.hello}}</h1>' +
        '\n\t\t\t\t\t</div>' +
        '\n\t\t\t\t</div>' +
        '\n\t\t\t</div>' +
        '\n\t\t</div>' +
        '\n\t</div>' +
        '\n</div>';
      break;
  }

  name = S(name).dasherize().s;

  if (replacements) {
    replacementsLength = replacements.length;

    for (i = 0; i < replacementsLength; i++) {
      scaffoldContents = scaffoldContents.replace(replacements[i].pattern,
        replacements[i].replacement);
    }
  }

  fs.writeFile(path + '/' + name, scaffoldContents, function(err) {
    if (err) {
      reporter.error(err);
    } else {
      reporter.success('New file `' + path + '/' + name + '` created')
    }
  });

};