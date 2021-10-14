# React 3 - Reactstrap

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

Once you have done this, start the development server. You will be automatically navigated to `localhost:3000`.

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
  );
}

export default Navigation
```

**What is happening?** 
- You have one `state` variable called `isOpen` and it will allow you to open and close a collapsed navigation bar.
- This is a simple responsive nav bar which contains two items (login and institutions).
- The `Navbar` component has two **props** - `color` and `expand`. Change the `color` value to **dark**. Now, your `Navbar` has a **charcoal** background with **black** text. 
- How do you change the text color? Change the **light** style (not the `color` **prop** value). It should look something like this:

```jsx
<Navbar color="dark" dark expand="md">
```

- We will discuss the `expand` **prop** later.
- The `NavbarBrand` component contains the name of your company or product. Usually, the value is text or a logo. When you click on this, it navigates you to the **index** page.
- The `NavbarToggler` and `Collapse` components are **Bootstrap** responsive design specific. The navigation bar will only collapse when the screen width is a specific breakpoint. How do we specify a breakpoint? There are five breakpoint (refer to the resource below) that we can use. In the `Navbar` component, the `expand` **prop** value is `md` which is a screen width ≥ 768px. You will notice a hamburger menu on the left-hand side. By default, `isOpen` is set to `false` and when you click on this, it will call the `toggle()` function and set `isOpen` to `true`. If `isOpen` is true, then open the collapsed navigation bar. 
   - **Resource**: https://bootstrap.themes.guide/how-to-responsive-design-with-bootstrap.html 
- The `Nav` component has a `className` **prop** with the value `mr-auto` (margin-right auto) and **navbar** style. These two are specific to **Bootstrap**.
- Each `NavLink` component is enclosed in a `NavItem` component. A `NavLink` has an `href` **prop**. Have a look at the **DOM** tree. It is just an `a` element enclosed in a `li` element. 

## Create a form

## Create a table

## React Router
