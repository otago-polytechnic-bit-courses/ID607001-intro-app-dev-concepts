// App.js

import axios from 'axios'
import React, { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap"
import LoginForm from "./components/LoginForm"

const App = () => {
  const BASE_URL = "https://intro-app-dev-laravel-app.herokuapp.com"

  const [isOpen, setIsOpen] = useState(false)
  
  // State variable for checking if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState( 
    // In session/local storage, all values are of type string
    sessionStorage.getItem("isLoggedIn") === "true" || false 
  )

  const toggle = () => setIsOpen(!isOpen)

  const login = () => {
    setIsLoggedIn(true)
    // Set a new item called isLoggedIn in session storage. Note: here true 
    // is of type boolean. In session storage, true is of type string
    sessionStorage.setItem("isLoggedIn", true) 
    alert("Logged in.") // Debugging purposes
  }

  const logout = () => {
    axios
      // You will notice that the logout route is no longer POST. I had a 
      // lot of issues dealing with POST and found that GET works the same
      .get(`${BASE_URL}/api/v1/logout`)
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(false)
          sessionStorage.clear() // Clear all items in session storage
          alert("Logged out.") // Debugging purposes
        }
      })
  }

  // Render a NavLink based on whether a user is logged in or out
  const authLink = isLoggedIn ? (
    <NavLink onClick={logout} style={{ cursor: "pointer" }}> 
      Logout
    </NavLink>
  ) : (
    <NavLink href="/login">Login</NavLink>
  )

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
            render={() => <LoginForm login={login} />}
          />
        </Switch>
      </Container>
    </Router>
  )
}

export default App