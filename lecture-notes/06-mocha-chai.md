# 06: Node.js Mocha & Chai

## Mocha + Chai = delicious testing

**Mocha** is a feature-rich JavaScript test framework running on Node.js and in the browser. It works hand-in-hand with **Chai** which is an assertion framework. You need **Chai** to assert things (true or false), and **Mocha** to run the tests.

To get started we first need to install **Mocha** as a dependency:

```bash
$ npm i mocha
```

Then install **Chai**:

```bash
$ npm i chai
```

Then we'll create a new folder in the root called `test` and put a file inside called `test.js`.

Inside `test.js` add the following example code:

```js
import { assert } from "chai";
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

Finally, in `package.json` add (or edit) your "test" script: `"test" : "mocha"`.

Now, in the terminal, you should be able to run this command:

```bash
$ npm test
```

And see this sort of output:

```bash
  Array
    #indexOf()
      ✔ should return -1 when the value is not present


  1 passing (7ms)
```
