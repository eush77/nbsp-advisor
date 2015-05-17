'use strict';

var nbspPositions = require('../src/nbsp-positions');

var test = require('tape');


test('nbsp-positions', function (t) {
  t.deepEqual(nbspPositions('Foo is ok\nBar claims to be so, also.'),
              [6, 23, 26]);
  t.end();
});
