# React 4 - CRUD

In today's session, you will look at how to implement authentication on the frontend. The following code snippets are an adaption from the code snippets found in this GitHub repository - https://github.com/unlikenesses/sanctum-react-spa. Hopefully, it will help with your current or next Studio 3 sprint.

In your **Laravel API** application, update the following:

- In `config/cors.php`, set `'supports_credentials' => false,` to `'supports_credentials' => true,`
- In `routes/api.php`, change `Route::post('/logout', [AuthController::class, 'logout']);` to `Route::get('/logout', [AuthController::class, 'logout']);`

Go to your application on **Heroku** and add the following environment variable:

`SANCTUM_STATEFUL_DOMAINS` and `<YOUR APP NAME EXCLUDING PROTOCOL>.herokuapp.com`



Please view the following resources:
- https://laravel.com/docs/8.x/sanctum#cors-and-cookies
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- https://www.youtube.com/watch?v=4KHiSt0oLJ0

In your **React** application, you will need to add the following:

Create a new component called `LoginForm`. This component will contain the login logic for your application.

```jsx
// LoginForm.js

import axios from "axios";
import React, { useState } from "react";
import { Alert, Button, Form, FormGroup, Input } from "reactstrap";
import { Redirect } from "react-router-dom";

const LoginForm = (props) => {
  const BASE_URL = "https://intro-app-dev-laravel-app.herokuapp.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHome, setIsHome] = useState(false);
  const [authError, setAuthError] = useState(false); // Used for authentication errors
  const [unknownError, setUnknownError] = useState(false); // Used for network errors

  const handleSubmit = (e) => {
    e.preventDefault();

    setAuthError(false);
    setUnknownError(false);
    
    /** 
      Please read the following:
        - https://laravel.com/docs/8.x/sanctum#csrf-protection
        - https://owasp.org/www-community/attacks/csrf
    */

    axios.get(`${BASE_URL}/sanctum/csrf-cookie`).then((_) => {
      axios
        .post(`${BASE_URL}/api/v1/login`, {
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.status === 201) {
            props.login();
            setIsHome(true);
            // Set a new item called token in session storage. You will send 
            // it in the request header later on
            sessionStorage.setItem("token", response.data.token); 
          }
        })
        .catch((error) => {
          // Authentication error as specified in your Laravel API application
          if (error.response.status === 401) {
            setAuthError(true);
          } else {
            setUnknownError(true);
          }
        });
    });
  };

  if (isHome === true) {
    return <Redirect to="/" />;
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
            {/* This attribute detects when the value of an input element changes */}
            onChange={(e) => setEmail(e.target.value)} 
            {/* 
              You can fetch validation messages from the request. There are plenty 
              of resources that show you how to do this 
            */}
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

**Note:** you will need to add this code to your existing `App.js`. It will not a simple copy and paste, so please be careful.

```jsx
// App.js

import axios from 'axios'
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
import LoginForm from "./components/Forms/LoginForm";

const App = () => {
  const BASE_URL = "https://intro-app-dev-laravel-app.herokuapp.com";

  const [isOpen, setIsOpen] = useState(false);
  
  // State variable for checking if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState( 
    // In session/local storage, all values are of type string
    sessionStorage.getItem("isLoggedIn") === "true" || false 
  );

  const toggle = () => setIsOpen(!isOpen);

  const login = () => {
    setIsLoggedIn(true);
    // Set a new item called isLoggedIn in session storage. Note: here true 
    // is of type boolean. In session storage, true is of type string
    sessionStorage.setItem("isLoggedIn", true); 
  };

  const logout = () => {
    axios
      // You will notice that the logout route is no longer POST. I had a 
      // lot of issues dealing with POST and found that GET works the same
      .get(`${BASE_URL}/api/v1/logout`, { 
        // This is how you send a bearer token in the request header. You only 
        // need to do this for protected routes
        headers: { 
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(false);
          sessionStorage.clear(); // Clear all items in session storage
          alert("Logged out."); // Debugging purposes
        }
      });
  };

  // Render a NavLink based on whether a user is logged in or out
  const authLink = isLoggedIn ? (
    <NavLink onClick={logout} style={{ cursor: "pointer" }}> 
      Logout
    </NavLink>
  ) : (
    <NavLink href="/login">Login</NavLink>
  );

  // Debugging purposes
  if (isLoggedIn) alert("Logged in."); // You will most likely display your API data tables

  return (
    <Router>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Student Management System</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>{authLink}</NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Container>
        <Switch>
          <Route
            path="/login"
            render={(props) => <LoginForm {...props} login={login} />}
          />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
```
