# 10: React 4

In today's session, you will look at how to implement **authentication** on the **frontend**. Hopefully, it will help with your current or next **Studio 3** sprint.

In the `src` directory, create a new directory called `forms`. In the `form` directory, create a new component called `LoginForm.js`. Add the following **JSX**:

```js
import axios from "axios";
import { useState } from "react";
import { Alert, Button, Form, FormGroup, Input } from "reactstrap";
import { Navigate } from "react-router-dom";

const LoginForm = (props) => {
  const BASE_URL = "https://id607001-graysono.herokuapp.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHome, setIsHome] = useState(false);
  const [authError, setAuthError] = useState(false); // Used for authentication errors
  const [unknownError, setUnknownError] = useState(false); // Used for network errors

  const loginUser = async () => {
    setAuthError(false);
    setUnknownError(false);

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
        email: email,
        password: password,
      });

      if (response.status === 201) {
        props.login();
        setIsHome(true);
      }
    } catch (error) {
      console.log(error);

      if (error.response.status === 401) {
        setAuthError(true);
      } else {
        setUnknownError(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  if (isHome === true) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h1 style={{ marginTop: "10px" }}>Login</h1>
      {/* 
        When the form is submitted, it will call the handleSubmit 
        function above. You do not need to worry about specifying
        a method and action as you would typically do when dealing 
        with forms
      */}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            /*
              This attribute detects when the value of an input element changes
            */
            onChange={(e) => setEmail(e.target.value)}
            /*
              You can fetch validation messages from the request. There are plenty 
              of online resources that show you how to do this 
            */
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        {/* 
          Display an alert message if there is either an authentication or network error
        */}
        {authError ? (
          <Alert color="danger">
            Cannot recognize your credentials. Please try again.
          </Alert>
        ) : null}
        {unknownError ? (
          <Alert color="danger">
            There was a problem submitting your credentials.
          </Alert>
        ) : null}
        <Button>Submit</Button>
      </Form>
    </>
  );
};

export default LoginForm;
```

In `Navigation.js`, replace the existing code with the following:

```js
import axios from "axios";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import LoginForm from "./forms/LoginForm";
import InstitutionsTable from "./tables/InstitutionsTable";

const Navigation = () => {
  const BASE_URL = "https://id607001-graysono.herokuapp.com";

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true" || false
  );

  const toggle = () => setIsOpen(!isOpen);

  const login = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", true);
    alert("Logged in."); // Debugging purposes
  };

  const logout = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/logout`);

      if (response.status === 200) {
        setIsLoggedIn(false);
        sessionStorage.clear();
        alert("Logged out."); // Debugging purposes
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render a NavLink based on whether a user is logged in or out
  const authLink = isLoggedIn ? (
    <>
      <NavItem>
        <NavLink href="/institutions">Institutions</NavLink>
      </NavItem>
      <NavItem>
        <NavLink onClick={logout} style={{ cursor: "pointer" }}>
          Logout
        </NavLink>
      </NavItem>
    </>
  ) : (
    <NavLink href="/login">Login</NavLink>
  );

  return (
    <Router>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Student Management System</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            {authLink}
          </Nav>
        </Collapse>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/institutions" element={<InstitutionsTable />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default Navigation;
```

Here is an example of logging in with invalid credentials:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-1.png" width="950" height="537">

Here are examples of logging in with valid credentials:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-2.png" width="950" height="537">

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-3.png" width="950" height="537">

Once you are logged in, you should see the **Institutions** and **Logout** navigation links.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-4.png" width="950" height="537">

Click the **Institutions** navigation link. You should see the table of institutions.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-5.png" width="950" height="537">

Here is an example of logging out.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-5.png" width="950" height="537">

**Note:** The alerts are for debugging purposes. Remove it once you have the login and logout working.

## Formative Assessment

In this **in-class activity**, you will start developing your **CRUD** application for the **Project 2: React CRUD** assessment.

### Code review

You must submit all program files via **GitHub Classroom**. Here is the URL to the repository you will use for your code review – <https://classroom.github.com/a/Vq7T0W6E>. Checkout from the **main** branch to the **10-in-class-activity** branch by running the command - **git checkout 10-in-class-activity**. This branch will be your development branch for this activity. Once you have completed this activity, create a pull request and assign the **GitHub** user **grayson-orr** to a reviewer. **Do not** merge your pull request.

### Getting started

Open your repository in **Visual Studio Code**. Create a **React** application and implement authentication as described above.

### Starter code

After you have implemented authentication, have a look at this online resource - <https://github.com/olinations/crud-starter-frontend-hooks>. It is an excellent example on how to implement **CRUD** functionality. **Note:** This is example uses **fetch** instead of **Axios**.

### Final words

Please review your changes against the **Project 2: React CRUD** assessment document and marking rubric.
