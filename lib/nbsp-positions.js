'use strict';

var execall = require('regexp.execall'),
    unicode = require('unicoderegexp'),
    merge = unicode.spliceCharacterClassRegExps;


var alphanumeric = merge(unicode.letter, unicode.number);

var not = function (regexp) {
  return merge(/^/, regexp);
};


var nbspRegExp = RegExp('(^|\\s' + not(alphanumeric).source + '*)' +
                        '(' + alphanumeric.source + '{1,2})(?= [^ ])', 'g');


module.exports = function (text) {
  nbspRegExp.lastIndex = 0;
  return execall(nbspRegExp, text)
    .filter(function (match) {
      return !/\d/.test(match[1]);
    })
    .map(function (match) {
      return match.index + match[0].length;
    });
};
