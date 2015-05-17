'use strict';

var extname = require('path').extname;


var nbsp = {
  html: '&nbsp;',
  tex: '~'
};


module.exports = function (filename) {
  return nbsp[extname(filename)];
};
