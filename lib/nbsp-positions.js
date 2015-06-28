'use strict';

var execall = require('regexp.execall');


module.exports = function (text) {
  return execall(/(^|\s\W*)(\w{1,2})(?= [^ ])/g, text)
    .filter(function (match) {
      return !/\d/.test(match[1]);
    })
    .map(function (match) {
      return match.index + match[0].length;
    });
};
