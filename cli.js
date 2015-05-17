#!/usr/bin/env node
'use strict';

var nbspPositions = require('./src/nbsp-positions');

var flatmap = require('flatmap');

var fs = require('fs'),
    Path = require('path');


var scanFile = function (filename) {
  var text = fs.readFileSync(filename, { encoding: 'utf8' });
  var positions = nbspPositions(text);
  positions.forEach(function (position) {
    console.log(filename + ': ' + position);
  });
};


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
  var usage = function (code) {
    var name = require('./package.json').name;
    console.log('Usage:  ' + name + ' [<file> | <directory>]...');
    return code || 0;
  };

  if (argv == '--help') {
    return usage();
  }

  if (!argv.length) {
    argv = ['.'];
  }

  flatmap(argv, getFiles).forEach(scanFile);
}(process.argv.slice(2)));
