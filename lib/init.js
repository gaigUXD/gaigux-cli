'use strict';

var fs = require('fs');
var clui = require('clui');
var exec = require('child_process').exec
var githubDownload = require('github-download');
var prompt = require('prompt');
var S = require('string');
var reporter = require('./reporter');
var constants = require('./constants');
var replaceInFile = require('./replace-in-file');

module.exports = function init(args) {
//  var repo = 'https://github.com/gaigUXD/ui-bootstrap-seed.git';
  var repo = 'https://github.com/gaigUXD/ui-bootstrap-seed.git';
  var dest = args._[0] || constants.cloneLocation;
  var Spinner = clui.Spinner;
  var downloadingSpinner = new Spinner('Downloading...');

  if (args._[0]) {
    dest = S(args._[0]).dasherize().s;
  } else {
    dest = constants.cloneLocation;
  }

  reporter.log('Downloading files...');
  downloadingSpinner.start();

  githubDownload(repo, dest)
    .on('end', function () {
      downloadingSpinner.stop();
      reporter.success('Download complete\n');
      // Remove files not relevant to GAIG
      fs.unlinkSync(dest + '/.gitignore');
      fs.unlinkSync(dest + '/LICENSE');
      fs.unlinkSync(dest + '/README.md');

      prompt.start();
      prompt.get({
        properties: {
          projectName: {
            message: 'Project name'.blue
          },
          projectDescription: {
            message: 'Project description'.blue
          }
        }
      }, promptCallback);
    });

  function promptCallback(err, result) {
    var child;
    var projectName = {
      dashedCase: S(result.projectName || constants.defaults.projectName).dasherize().s,
      camelCase: S(result.projectName || constants.defaults.projectName).camelize().s
    };

    if (projectName.dashedCase.charAt(0) === '-') {
      projectName.dashedCase = projectName.dashedCase.slice(1);
    }

    var pkgReplacements = [
      {
        pattern: /"name"\:\s?".+"/,
        replacement: '"name": "' + projectName.dashedCase + '"'
      },
      {
        pattern: /"description"\:\s?".+"/,
        replacement: '"description": "' + result.projectDescription + '"'
      }
    ];
    var appReplacements = [
      {
        pattern: /\.module\('.+'/,
        replacement: '.module(\'' + projectName.camelCase + '\''
      },
      {
        pattern: /ng-app\=".+"/,
        replacement: 'ng-app="' + projectName.camelCase + '"'
      }
    ];

    if (err) {
      reporter.error(err);
    } else {
      replaceInFile(dest + '/package.json', pkgReplacements);
      replaceInFile(dest + '/bower.json', pkgReplacements);
      replaceInFile(dest + '/app/app.js', appReplacements);
      replaceInFile(dest + '/app/index.tpl', appReplacements);

      reporter.success('\nSeed project successfully initialized.');
      reporter.log('\nInstalling NPM dependencies. This ' +
        'process may take a couple of minutes.\n');

      try {
        process.chdir(dest);
        downloadingSpinner.start();
        exec('npm install',
          function (error, stdout, stderr) {
//            reporter.log('\n'+ stdout);
//            reporter.error('\n' + stderr);

            if (error !== null) {
              reporter.error(error);
            } else {
              reporter.success('\nInstallation successful!');
            }

            downloadingSpinner.stop();
          });
      }
      catch (err) {
        reporter.error('chdir: ' + err);
      }
    }
  }

};