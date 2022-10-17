# 09: React 3

## Reactstrap

**Reactstrap** is a library that provides you with predefined **Bootstrap** stateless components. The library does not depend on libraries like **jQuery** and **Bootstrap JS**. If you have not used **Bootstrap** before, have a look at this resource - <https://developer.mozilla.org/en-US/docs/Glossary/Bootstrap>.

Install **Bootstrap** and **reactstrap** using **NPM**:

```md
npm i bootstrap reactstrap
```

In `src/index.js`, import **Bootstrap**:

```md
import "bootstrap/dist/css/bootstrap.min.css"
```

:question: **Interview Question:** What does `.min` mean?

You can find this file in `node_modules/bootstrap/dist/css`.

Once you have done this, start the development server.

:question: **Interview Question:** Do you notice anything different?

**Note:** **Bootstrap** will override your custom **CSS**.
