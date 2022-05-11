# 10: React 4

In today's session, you will look at how to implement **authentication** using the **authorization request header** and deploy to **Heroku**. Hopefully, it will help with your current or next **Studio 3** sprint.

## Node.js Application

Firstly, you will need to update your **Project 1: Node.js REST API** application.

In `middleware/auth.js`, replace the existing code with the following:

```js
import jwt from 'jsonwebtoken'

const authRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization /** Please read this resource - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization */

  /** Check if a bearer token is given or a token starts with bearer */
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided')
  }

  /** Verify only the token */
  const token = authHeader.split(' ')[1]

  /** You have seen this before **/
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    console.log('Not authorized to access this route')
  }
};

export default authRoute;
```

In `controllers/auth.js`, replace the `login()` function with the following:

```js
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid email" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, msg: "Invalid password" });
    }

    const token = user.createJWT() /** Calling the createJWT() in Users.js */

    return res.status(201).json({
      success: true,
      token: token,
      msg: "User successfully logged in",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while logging in a user",
    });
  }
};
```

In `models/User.js`, add the following schema method:

```js
usersSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}
```

Go to **Postman** and test it.



## React Application

In the `components` directory, create a new directory called `forms`. In the `forms` directory, create a new component called `LoginForm.js`. Add the following **JSX**:

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

  const authResources = isLoggedIn ? (
    <Route path="/institutions" element={<InstitutionsTable />} />
  ) : (
    <></>
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
          {authResources}
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

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-6.png" width="950" height="537">

**Note:** The alerts are for debugging purposes. Remove it once you have the login and logout working.

## Formative Assessment

In this **in-class activity**, you will start developing your **CRUD** application for the **Project 2: React CRUD** assessment.

### Submission

You must submit all program files via **GitHub Classroom**. Here is the URL to the repository you will use for this **in-class activity** – <https://classroom.github.com/a/Vq7T0W6E>. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**. 

### Getting started

Open your repository in **Visual Studio Code**. Create a **React** application and implement authentication as described above.

### Deployment

Go to **Heroku** and create a new application.
Name the application `id607001-<Your OP username>-react`. Once you have create the application, enable automatic deploys and manually deploy the `master` or `main` branch.

Go to the **Settings** tab and click on the **Add buildpack** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-7.png" width="650" height="950">

Add the following **buildpack** - <https://github.com/mars/create-react-app-buildpack>, then click the **Add changes** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-8.png" width="950" height="537">

Once you have done this, you see the following:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/10-react-4/10-react-9.png" width="650" height="950">

### Starter code

After you have implemented authentication and deployment, have a look at this online resource - <https://github.com/olinations/crud-starter-frontend-hooks>. It is an excellent example on how to implement **CRUD** functionality. **Note:** This is example uses **fetch** instead of **Axios**.

### Final words

Please review your changes against the **Project 2: React CRUD** assessment document and marking rubric.
