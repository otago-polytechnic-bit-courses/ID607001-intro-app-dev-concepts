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

## Create a table

In the `components` directory, create a new directory called `tables`. In the `tables` directory, create a new component called `InstitutionsTable.js`. Add the following **JSX**:

```js
import { Table } from "reactstrap";

const InstitutionsTable = () => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Region</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Stanford University</td>
          <td>California</td>
          <td>United States of America</td>
        </tr>
        <tr>
          <td>Harvard University</td>
          <td>Massachusetts</td>
          <td>United States of America</td>
        </tr>
        <tr>
          <td>University of Oxford</td>
          <td>Oxford</td>
          <td>United Kingdom</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default InstitutionsTable;
```

**What is happening in the InstitutionTable component?**

It is pretty much the same way you declare a `table` in **HTML**, except for the `Table` component.

**Resource:** <https://reactstrap.github.io/components/tables>
