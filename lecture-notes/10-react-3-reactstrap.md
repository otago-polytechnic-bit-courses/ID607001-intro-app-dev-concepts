# React 3 - Reactstrap

**Reactstrap** is a library that provides you with predefined **Bootstrap** components that are stateless. The library does not depend on libraries like **jQuery** and **Bootstrap JS**. If you have not used **Bootstrap** before, have a look at this resource - https://developer.mozilla.org/en-US/docs/Glossary/Bootstrap.

Install **reactstrap** and **Bootstrap** using **NPM**:

```md
npm i bootstrap reactstrap
```

In `src/index.js`, import **Bootstrap**:

```md
import 'bootstrap/dist/css/bootstrap.min.css'
```

**Question:** What does `.min` mean?

You can find this file in the `node_modules/bootstrap/dist/css`.

Once you have done this, start the development server. A browser will open and navigate you to `localhost:3000`.

**Question:** Do you notice anything different?

**Bootstrap** will override your custom **CSS**.

## Create a navigation bar

Create a new component called `Navigation.js`. Add the following **JSX**:

```jsx
import React, { useState } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">Student Management System</NavbarBrand>
      <NavbarToggler onClick={toggle} /> 
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink href="/login">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/institutions">Institutions</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Navigation
```

Of course, in `App.js`, you need to import and declare the `Navigation` component:

```jsx
import React from 'react'
import Navigation from './components/Navigation'

const App = () => {
  return (
    <Navigation />
  )
}

export default App
```

After you done this, you should see the following:

![image](https://user-images.githubusercontent.com/22671392/137407896-6d2d9e92-829a-4d47-acd9-b21fba3994f6.png)

**What is happening in the Navigation component?** 
- You have one `state` variable called `isOpen`, which will allow you to open and close a collapsed navigation bar.
- This is a simple responsive navbar that contains two items (login and institutions).
- The `Navbar` component has two **props** - `color` and `expand`. Change the `color` value to **dark**. Now, your `Navbar` has a **charcoal** background with **black** text. 

![image](https://user-images.githubusercontent.com/22671392/137407975-e5aed07e-fe90-43fb-95b9-a9984380b85c.png)

- How do you change the text color? Change the **light** style (not the `color` **prop** value). It should look something like this:

```jsx
<Navbar color="dark" dark expand="md">
```

![image](https://user-images.githubusercontent.com/22671392/137407990-9481d599-7c07-4f42-a75f-5bc2f89ae40e.png)

- We will discuss the `expand` **prop** later.
- The `NavbarBrand` component contains the name of your company or product. Usually, the value is text or a logo. When you click on this, it navigates you to the **index** page.
- The `NavbarToggler` and `Collapse` components are **Bootstrap** responsive design specific. The navigation bar will only collapse when the screen width is a specific breakpoint. How do we specify a breakpoint? There are five breakpoints (refer to the resource below) that we can use. In the `Navbar` component, the `expand` **prop** value is `md` which is a screen width ≥ 768px. 
    - **Resource**: https://bootstrap.themes.guide/how-to-responsive-design-with-bootstrap.html 
- You will notice a hamburger menu on the left-hand side. 

![image](https://user-images.githubusercontent.com/22671392/137408027-53e183c7-cf2c-4f42-99c4-885abc5742be.png)

- By default, `isOpen` is set to `false` and when you click on this (`onClick` **prop** accepts a callback), it will call the `toggle()` function and set `isOpen` to `true`. If `isOpen` is true, then open the collapsed navigation bar. 

![image](https://user-images.githubusercontent.com/22671392/137408048-6ebfbebf-1313-42b0-ac62-f9aba487c3ac.png)

- The `Nav` component has a `className` **prop** with the value `mr-auto` (margin-right auto) and **navbar** style. These two are specific to **Bootstrap**.
- Each `NavLink` component is enclosed in a `NavItem` component. A `NavLink` has an `href` **prop**. Have a look at the **DOM** tree. It is just an `a` element enclosed in a `li` element. 

**Resource:** https://reactstrap.github.io/components/navbar

## Create a table

```jsx
import React from 'react'
import { Table } from 'reactstrap'

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
  )
}

export default InstitutionsTable;
```

**What is happening in the InstitutionTable component?** 

- It is not as abstract as the `Navigation` component. It is pretty much the same way you declare a `table` in **HTML**, except for the `Table` component. 
- There are obvious problems with this example, and if you have completed **task 5** in **09-react-2-components**, you will know how to make this example modular.

**Resource:** https://reactstrap.github.io/components/tables

## React Router

**React Router DOM** is a the most popular routing library for **React**. It enables you to implement dynamic routing in your **SPA**.

Install **React Router DOM** using **NPM**:

```md
npm i react-router-dom
```

**Note:** **React Router** has three packages (core, **DOM** bindings and **React Native** bindings). Make sure you choose the **DOM** bindings package.  

```jsx
import React, { useState } from 'react'

// Import the following:
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'

// Import the following component:
import InstitutionsTable from './InstitutionsTable'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Router>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Student Management System</NavbarBrand>
        <NavbarToggler onClick={toggle} /> 
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/institutions">Institutions</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Switch>
        <Route path="/login" /* Add component prop later */ />
        <Route path="/institutions" component={InstitutionsTable} />
      </Switch>
    </Router>
  )
}

export default Navigation;
```

**What is happening in the Navigation component?** 
- You enclose the `Navbar` component and its children, i.e., `NavbarBrand`, `NavbarToggler`, etc. in the `Router` component.
- The `Router` component uses regular URL paths, i.e., `/institutions`.
- `Switch` and `Route` are route matching components. When the `Switch` component is rendered, it searches through its `Route` (children) components to find a path that matches the current URL. For example, when you click on a `NavLink` component, it will map its `href` **prop** value, i.e., `/institutions` in the `NavLink` component to the `Route` component's `path` **prop** value, i.e., `/institutions` in the `Route` component then render the component, i.e., `InstitutionsTable` specified in the `component` **prop**.

After you done this, you should see the following if you are on `/institutions`:

![image](https://user-images.githubusercontent.com/22671392/137408107-b356d157-c042-4f1b-9725-b2d384479252.png)

**Resources:** 
- https://reactrouter.com/web/guides/quick-start
