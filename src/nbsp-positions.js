'use strict';

var execall = require('regexp.execall');


module.exports = function (text) {
  return execall(/ \w{1,2} /g, text).map(function (match) {
    return match.index + match[0].length - 1;
  });
};
