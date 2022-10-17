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

## Create a navigation bar

In the `src` directory, create a new directory called `components`. In the `components` directory, create a new component called `Navigation.js`. Add the following **JSX**:

```js
import { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="lg">
      <NavbarBrand href="/">Student Management System</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
          <NavItem>
            <NavLink href="/login">Login</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Navigation;
```

Of course, in `App.js`, you need to import and declare the `Navigation` component:

```js
import Navigation from "./components/Navigation";

const App = () => {
  return <Navigation />;
};

export default App;
```

After you done this, you should see the following:

<img src='https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/09-react-3/09-react-1.png' />

**What is happening in the Navigation component?**

- You have one `state` variable called `isOpen`, which will allow you to open and close a collapsed navigation bar.
- This is a simple responsive navbar that contains two items (login and institutions).
- The `Navbar` component has two values - `color` and `expand`. Change the `color` attribute's value to **dark**. Now, your `Navbar` has a **charcoal** background with **black** text.

<img src='https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/09-react-3/09-react-2.png' />

- How do you change the text color? Change the **light** style (not the `color` attribute's value). It should look something like this:

```js
<Navbar color="dark" dark expand="md">
```

<img src='https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/09-react-3/09-react-3.png' />

- We will discuss the `expand` later.
- The `NavbarBrand` component contains the name of your company or product. Usually, the value is text or a logo. When you click on this, it navigates you to the **index** page.
- The `NavbarToggler` and `Collapse` components are **Bootstrap** responsive design specific. The navigation bar will only collapse when the screen width is a specific breakpoint. How do we specify a breakpoint? There are five breakpoints (refer to the resource below) that we can use. In the `Navbar` component, the `expand` attribute's value is `md` which is a screen width ≥ 768px.
  - **Resource**: <https://bootstrap.themes.guide/how-to-responsive-design-with-bootstrap.html>
- You will notice a hamburger menu on the left-hand side.

<img src='https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/09-react-3/09-react-4.png' />

- By default, `isOpen` is set to `false` and when you click on this (`onClick` accepts a callback), it will call the `toggle()` function and set `isOpen` to `true`. If `isOpen` is true, then open the collapsed navigation bar.

<img src='https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/09-react-3/09-react-5.png' />

- The `Nav` component has a `className` attribute with the value `ms-auto` and **navbar** style. These two are specific to **Bootstrap**.
- Each `NavLink` component is enclosed in a `NavItem` component. A `NavLink` has an `href` attribute. Have a look at the **DOM** tree. It is just an `a` element enclosed in a `li` element.

**Resource:** <https://reactstrap.github.io/components/navbar>

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

It is not as abstract as the `Navigation` component. It is pretty much the same way you declare a `table` in **HTML**, except for the `Table` component.

**Resource:** <https://reactstrap.github.io/components/tables>

## React Router

**React Router DOM** is a the most popular routing library for **React**. It enables you to implement dynamic routing in your **SPA**.

Install **React Router DOM** using **NPM**:

```bash
npm i react-router-dom
```

**Note:** **React Router** has three packages (core, **DOM** bindings and **React Native** bindings). Make sure you choose the **DOM** bindings package.

```js
import { useState } from "react";

// Import the following:
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

// Import the following component:
import InstitutionsTable from "./tables/InstitutionsTable";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Router>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Student Management System</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/institutions">Institutions</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Routes>
        <Route path="/login" />
        <Route path="/institutions" element={<InstitutionsTable />} />
      </Routes>
    </Router>
  );
};

export default Navigation;
```

**What is happening in the Navigation component?**

- You enclose the `Navbar` component and its children, i.e., `NavbarBrand`, `NavbarToggler`, etc. in the `Router` component.
- The `Router` component uses regular URL paths, i.e., `/institutions`.
- `Routes` and `Route` are route matching components. When the `Routes` component is rendered, it searches through its `Route` (children) components to find a path that matches the current URL. For example, when you click on a `NavLink` component, it will map its `href` attribute's value, i.e., `/institutions` in the `NavLink` component to the `Route` component's `path` attribute's value, i.e., `/institutions` in the `Route` component then render the component, i.e., `InstitutionsTable` specified in the `element` attribute's value.

After you done this, you should see the following if you are on `/institutions`:

<img src='https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/09-react-3/09-react-6.png' />

**Resource:** <https://reactrouter.com/web/guides/quick-start>

## Your React Assignment

Go to **Heroku** and create a new application.
Name the application `id607001-<Your OP username>-react`. Once you have create the application, enable automatic deploys and manually deploy the `master` or `main` branch.

Go to the **Settings** tab and click on the **Add buildpack** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-7.png" width="650" height="950">

Add the following **buildpack** - <https://github.com/mars/create-react-app-buildpack>, then click the **Add changes** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-8.png" width="950" height="537">

Once you have done this, you see the following:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-9.png" width="650" height="950">

### Fetching Institutions data

In `InstitutionsTable.js`, replace the exisiting code with the following:

```jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "reactstrap";

const InstitutionsTable = () => {
  const BASE_URL = "https://id607001-graysono.herokuapp.com"; // replace with your deployed Heroku Node app

  const [data, setData] = useState([])

  useEffect(() => {
    const getInstitutionsData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/institutions`)
        setData(res.data.data)
      } catch (error) {
        console.log(error)
      }   
    }
    getInstitutionsData()
  }, [])

  const displayInstutitionsData = (
    data.map((d) => {
      return (
        <tr key={d._id}>
          <td>{d.name}</td>
          <td>{d.region}</td>
          <td>{d.country}</td>
        </tr>
      )
    })
  )

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
        {displayInstutitionsData}
      </tbody>
    </Table>
  );
};

export default InstitutionsTable;
```

## Forms

In the `components` directory, create a new directory called `forms`. In the `forms` directory, create a new component called `InsitutionsForm.js`. Add the following **JSX**:

```js
import axios from "axios";
import { useState } from "react";
import { Alert, Button, Form, FormGroup, Input } from "reactstrap";
import { Navigate } from "react-router-dom";

const InstitutionCreateForm = (props) => {
  const BASE_URL = "https://id607001-graysono.herokuapp.com"; // replace with your heroku app

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [isError, setIsError] = useState(false);

  const createInstitution = async () => {

    try {
      const res = await axios.post(`${BASE_URL}/api/institutions`, {
        name: name,
        region: region,
        country: country
      });

      if (res.status === 201) {
        // refresh the institution table data here
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createInstitution();
  };

  return (
    <>
      <h1 style={{ marginTop: "10px" }}>Create Institution</h1>
      {/* 
        When the form is submitted, it will call the handleSubmit 
        function above. You do not need to worry about specifying
        a method and action as you would typically do when dealing 
        with forms
      */}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            /*
              This attribute detects when the value of an input element changes
            */
            onChange={(e) => setName(e.target.value)}
            /*
              You can fetch validation messages from the request. There are plenty 
              of online resources that show you how to do this 
            */
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            name="region"
            placeholder="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            name="country"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </FormGroup>
        {/* 
          Display an alert message if there is an error
        */}
        {isError ? (
          <Alert color="danger">
            Something went wrong. Please try again.
          </Alert>
        ) : null}
        <Button>Submit</Button>
      </Form>
    </>
  );
};

export default InstitutionCreateForm;
```
