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


var Scanner = function () {
  return {
    needEmptyLineBefore: false,

    scanFile: function (filename, cb) {
      // Print the header.
      if (this.needEmptyLineBefore) {
        console.log();
      }
      console.log(chalk.bold.green(filename));
      this.needEmptyLineBefore = true;

      this.nbsp = nbspSequence(filename) || '~';
      var text = fs.readFileSync(filename, { encoding: 'utf8' });
      var paragraphs = text.split('\n\n');

      each(Object.keys(paragraphs), function (i, cb) {
        this.scanParagraph(paragraphs[i], function (err, paragraph) {
          if (err) return cb(err);
          paragraphs[i] = paragraph;
          cb();
        });
      }.bind(this), saveFile);

      function saveFile(err) {
        if (err) return cb(err);

        inquire({
          type: 'confirm',
          message: 'Save the file',
          name: 'save',
          default: false
        }, function (answer) {
          if (answer.save) {
            fs.writeFileSync(filename, paragraphs.join('\n\n'),
                             { encoding: 'utf8' });
          }
          cb();
        });
      }
    },

    scanParagraph: function (text, cb) {
      var positions = nbspPositions(text);
      if (!positions.length) {
        return process.nextTick(cb.bind(null, null, text));
      }

      var parts = fzip([-1].concat(positions), positions.concat(Infinity),
                       function (left, right) {
                         return text.slice(left + 1, right);
                       });
      console.log(parts.join(chalk.green(this.nbsp)).trim());

      inquire({
        type: 'confirm',
        message: 'Apply changes',
        name: 'apply',
        default: false
      }, function (answer) {
        cb(null, parts.join(answer.apply ? this.nbsp : ' '));
      }.bind(this));
    }
  };
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
  if (!argv.length) {
    argv = ['.'];
  }

  var scanner = Scanner();

  each(flatmap(argv, getFiles), scanner.scanFile.bind(scanner), function (err) {
    if (err) throw err;
  });
}(process.argv.slice(2)));
