#!/usr/bin/env node
'use strict';

var nbspPositions = require('./src/nbsp-positions'),
    nbspSequence = require('./src/nbsp-sequence');

var flatmap = require('flatmap');

var fs = require('fs'),
    Path = require('path');


var scanFile = (function () {
  var needEmptyLineBefore = false;

  return function (filename) {
    var nbsp = nbspSequence(filename) || '~';
    var text = fs.readFileSync(filename, { encoding: 'utf8' });
    var positions = nbspPositions(text);

    if (!positions.length) {
      return;
    }

    if (needEmptyLineBefore) {
      console.log();
    }
    console.log(filename);
    needEmptyLineBefore = true;

    var data = text.split('');
    positions.forEach(function (position) {
      data[position] = nbsp;
    });
    console.log(data.join('').trim());
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
