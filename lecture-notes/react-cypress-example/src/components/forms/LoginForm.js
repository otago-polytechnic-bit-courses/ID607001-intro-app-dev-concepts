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