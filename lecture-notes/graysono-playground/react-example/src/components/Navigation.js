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