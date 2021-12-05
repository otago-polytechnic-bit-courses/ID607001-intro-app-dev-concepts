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
            /*
              This attribute detects when the value of an input element changes
            */
            onChange={(e) => setEmail(e.target.value)} 
            /*
              You can fetch validation messages from the request. There are plenty 
              of resources that show you how to do this 
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