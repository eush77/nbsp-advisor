#!/usr/bin/env node
'use strict';

var nbspPositions = require('./lib/nbsp-positions'),
    nbspSequence = require('./lib/nbsp-sequence');

var flatmap = require('flatmap'),
    fzip = require('fzip'),
    chalk = require('chalk'),
    inquire = require('inquirer').prompt,
    each = require('async-each-series'),
    help = require('help-version')(usage()).help;

var fs = require('fs'),
    Path = require('path');


function usage() {
  return 'Usage:  nbsp-advisor [<file> | <directory>]...';
}


var scanFile = (function () {
  var needEmptyLineBefore = false;

  return function (filename, cb) {
    var nbsp = nbspSequence(filename) || '~';
    var text = fs.readFileSync(filename, { encoding: 'utf8' });
    var positions = nbspPositions(text);
    if (!positions.length) {
      return cb();
    }

    // Print the header.
    if (needEmptyLineBefore) {
      console.log();
    }
    console.log(chalk.bold.green(filename));
    needEmptyLineBefore = true;

    var parts = fzip([-1].concat(positions), positions.concat(Infinity),
                     function (left, right) {
                       return text.slice(left + 1, right);
                     });
    console.log(parts.join(chalk.green(nbsp)).trim());

    inquire({
      type: 'confirm',
      message: 'Save the file',
      name: 'save'
    }, function (answer) {
      if (answer.save) {
        fs.writeFileSync(filename, parts.join(nbsp), { encoding: 'utf8' });
      }
      cb();
    });
  };
}());


var getFiles = function (path) {
  var stat = fs.statSync(path);
  if (stat.isFile()) {
    return [path];
  }
  else if (stat.isDirectory()) {
    return fs.readdirSync(path)
      .map(function (subpath) {
        return Path.join(path, subpath);
      })
      .filter(function (path) {
        return fs.statSync(path).isFile();
      });
  }
  else {
    return [];
  }
};


(function main(argv) {
  if (!argv.length) {
    argv = ['.'];
  }

  each(flatmap(argv, getFiles), scanFile);
}(process.argv.slice(2)));
