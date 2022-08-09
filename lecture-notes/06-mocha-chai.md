# 06: Node.js Mocha & Chai

## Mocha

Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser.

To get started we first need to install **Mocha** as a dependency:

```bash
$ npm i mocha
```

Then we'll create a new folder in the root called `test` and put a file inside called `test.js`.

Inside `test.js` add the following example code:

```js
var assert = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```
