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
    applyAll: false,

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
      var changed = false;

      each(Object.keys(paragraphs), function (i, cb) {
        this.scanParagraph(paragraphs[i], function (err, paragraph, status) {
          if (err) return cb(err);
          if (status.abort) return cb(true);
          if (status.changed) {
            paragraphs[i] = paragraph;
            changed = true;
          }
          cb();
        });
      }.bind(this), saveFile);

      function saveFile(err) {
        if (err == true || !changed) {
          return cb();
        }
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
        return process.nextTick(cb.bind(null, null, text, { changed: false }));
      }

      var parts = fzip([-1].concat(positions), positions.concat(Infinity),
                       function (left, right) {
                         return text.slice(left + 1, right);
                       });
      console.log(parts.join(chalk.green(this.nbsp)).trim());

      var apply = function (apply, abort) {
        cb(null, parts.join(apply ? this.nbsp : ' '), {
          changed: apply,
          abort: abort
        });
      }.bind(this);

      if (this.applyAll) {
        return apply(true, false);
      }

      inquire({
        type: 'expand',
        message: 'Apply changes',
        name: 'apply',
        choices: [
          {
            key: 'y',
            name: 'yes',
            value: true
          }, {
            key: 'n',
            name: 'no',
            value: false
          }, {
            key: 'a',
            name: 'all',
            value: 'all'
          }, {
            key: 'q',
            name: 'quit',
            value: 'quit'
          }
        ],
        default: 1
      }, function (answer) {
        switch (answer.apply) {
          case 'quit':
            return apply(false, true);

          case 'all':
            this.applyAll = true;
            // Fall through.

          default:
            return apply(answer.apply, false);
        }
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
