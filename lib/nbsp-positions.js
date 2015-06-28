'use strict';

var execall = require('regexp.execall'),
    unicode = require('unicoderegexp'),
    merge = unicode.spliceCharacterClassRegExps;


var nbspRegExp = function () {
  return RegExp('(^|\\s)(' + unicode.punctuation.source + '?' +
                unicode.letter.source + '{1,2}' +
                '|' + unicode.number.source + '+)(?= [^ ])', 'g');
};


module.exports = function (text) {
  return execall(nbspRegExp(), text)
    .map(function (match) {
      return match.index + match[0].length;
    });
};
