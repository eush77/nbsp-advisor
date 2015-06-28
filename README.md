[![npm](https://nodei.co/npm/nbsp-advisor.png)](https://nodei.co/npm/nbsp-advisor/)

# nbsp-advisor

[![Dependency Status][david-badge]][david]

Tries to fix missing non-breaking space in text documents from the command line. For lazy people.

[david]: https://david-dm.org/eush77/nbsp-advisor
[david-badge]: https://david-dm.org/eush77/nbsp-advisor.png

## Example

```
$ nbsp-advisor LICENSE
Copyright (c) 2015~Eugene Sharygin
? Apply changes: (yNqh)
Permission is~hereby granted, free of~charge, to~any person obtaining a~copy
of~this software and associated documentation files (the "Software"), to~deal
in~the Software without restriction, including without limitation the rights
to~use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of~the Software, and to~permit persons to~whom the Software is
furnished to~do~so, subject to~the following conditions:
? Apply changes: (yNqh)
The above copyright notice and this permission notice shall be~included in~all
copies or~substantial portions of~the Software.
? Apply changes: (yNqh)
THE SOFTWARE IS~PROVIDED "AS~IS", WITHOUT WARRANTY OF~ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO~THE WARRANTIES OF~MERCHANTABILITY,
FITNESS FOR A~PARTICULAR PURPOSE AND NONINFRINGEMENT. IN~NO~EVENT SHALL THE
AUTHORS OR~COPYRIGHT HOLDERS BE~LIABLE FOR ANY CLAIM, DAMAGES OR~OTHER
LIABILITY, WHETHER IN~AN~ACTION OF~CONTRACT, TORT OR~OTHERWISE, ARISING FROM,
OUT OF~OR~IN~CONNECTION WITH THE SOFTWARE OR~THE USE OR~OTHER DEALINGS IN~THE
SOFTWARE.
? Apply changes: (yNqh)
? Save the file: (y/N)
```

## CLI

#### `> nbsp-advisor [<file> | <directory>]...`

Offers you some non-breaking space, one paragraph at a time. You can answer `y` or `n` (or `q` to quit). You can save changes at the end.

Syntax is `~` for LaTeX documents and `&nbsp;` for HTML files. For other files, `~` is the default.

File is scanned from top to bottom, but in the future it should be integrated with version control systems (like Git) to avoid skipping the same parts of the file over and over again.

## Install

```
npm install -g nbsp-advisor
```

## License

MIT
