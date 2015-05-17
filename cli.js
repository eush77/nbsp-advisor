#!/usr/bin/env node
'use strict';

var usage = function (code) {
  var name = require('./package.json').name;
  console.log('Usage:  ' + name + ' [<file> | <directory>]...');
  return code || 0;
};


process.exitCode = (function (argv) {
  if (argv == '--help') {
    return usage();
  }
}(process.argv.slice(2)));
