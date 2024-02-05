# 13: React 4


If you get stuck, a completed version of this project is available in the **exemplar** directory.


```bash
npm install axios bootstrap react-router-dom reactstrap
```

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Remove import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";

// It will render the App component in the root element. You can find the root 
// element in the index.html file in the root directory
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```jsx
import { useState } from "react";

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

import InstitutionTable from "./tables/InstitutionTable";

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
              <NavLink href="/institutions">Institutions</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Routes>
        <Route path="/institutions" element={<InstitutionTable />} />
      </Routes>
    </Router>
  );
};

export default Navigation;
```

```jsx
import axios from "axios";

// Create an axios instance
const instance = axios.create({
  baseURL: "https://id607001-graysono-wbnj.onrender.com/api", // Replace with your own API URL
  timeout: 10000, // 10 seconds. Increase if requests are timing out
});

export default instance;
```

```jsx
import { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import PropTypes from "prop-types";

import instance from "../../utils/axios";

const InstitutionForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    region: "",
    country: "",
    submitError: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/institutions", formData);
      setFormData({
        name: "",
        region: "",
        country: "",
      });
      setErrors({
        name: "",
        region: "",
        country: "",
        submitError: "",
      });
      onFormSubmit(); // Call the onFormSubmit prop
    } catch (err) {
      // Handle validation errors
      if (err.response && err.response.data && err.response.data.msg) {
        const errorMsg = err.response.data.msg; // Get the error message
        const field = errorMsg.split(" ")[0]; // Get the field name from the error message, i.e., "name should be a string" -> "name"
        setErrors((prevErrors) => ({
          ...prevErrors, // Keep the other errors
          [field]: errorMsg, // Set the error for the field
        }));
      } else {
        console.log(err);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="name">Name:</Label>
        <Input
          type="text"
          value={formData.name}
          id="name"
          name="name"
          onChange={handleChange}
          invalid={!!errors.name}
        />
        <FormFeedback>{errors.name}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="name">Region:</Label>
        <Input
          type="text"
          value={formData.region}
          id="region"
          name="region"
          onChange={handleChange}
          invalid={!!errors.region} 
        />
        <FormFeedback>{errors.region}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="name">Country:</Label>
        <Input
          type="text"
          value={formData.country}
          id="country"
          name="country"
          onChange={handleChange}
          invalid={!!errors.country}
        />
        <FormFeedback>{errors.country}</FormFeedback>
      </FormGroup>
      {errors.submitError && (
        <div className="text-danger">{errors.submitError}</div>
      )}
      <Button type="submit">Add Institution</Button>
    </Form>
  );
};

InstitutionForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default InstitutionForm;
```

```jsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

import instance from "../../utils/axios";

import InstitutionForm from "../forms/InstitutionForm";

const InstitutionTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    region: "",
    country: "",
    submitError: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await instance.get("/institutions");
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await instance.delete(`/institutions/${id}`);
        setData(data.filter((item) => item.id !== id)); // Remove the item from the data array
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (item) => {
    setEditItem(item); // Set the item to be edited
    setModalOpen(true); // Open the modal
  };

  const resetErrors = () => { 
    setErrors({
      name: "",
      region: "",
      country: "",
      submitError: "",
    });
  };

  const handleEditFormSubmit = async (editedData) => {
    try {
      await instance.put(`/institutions/${editItem.id}`, editedData);
      const updatedData = data.map((item) => // Update the item in the data array
        item.id === editItem.id ? { ...item, ...editedData } : item
      );
      resetErrors();
      setData(updatedData);
      setModalOpen(false);
      setEditItem(null);
    } catch (err) {
      // Handle validation errors
      if (err.response && err.response.data && err.response.data.msg) {
        const errorMsg = err.response.data.msg; // Get the error message
        const field = errorMsg.split(" ")[0]; // Get the field name from the error message, i.e., "name should be a string" -> "name"
        setErrors({
          ...errors, // Keep the other errors
          [field]: errorMsg, // Set the error for the field
        });
      } else {
        console.log(err);
      }
    }
  };

  const handleFormSubmit = () => fetchData(); // Refetch data when the form is submitted

  return (
    <>
      <InstitutionForm onFormSubmit={handleFormSubmit} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Region</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center"> 
                    No data available
                  </td>
                </tr>
              ) : (
                <>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.region}</td>
                      <td>{item.country}</td>
                      <td>
                        <Button
                          color="primary"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          color="danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </Table>
          <Modal
            isOpen={modalOpen}
            toggle={() => {
              resetErrors(); // Reset errors when the modal is closed
              setModalOpen(!modalOpen);
            }}
          >
            <ModalHeader
              toggle={() => {
                resetErrors(); // Reset errors when the modal is closed
                setModalOpen(!modalOpen);
              }}
            >
              Edit Item
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="editName">Name:</Label>
                <Input
                  type="text"
                  defaultValue={editItem?.name}
                  id="editName"
                  name="editName"
                  invalid={!!errors.name}
                />
                <FormFeedback>{errors.name}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="editRegion">Region:</Label>
                <Input
                  type="text"
                  defaultValue={editItem?.region}
                  id="editRegion"
                  name="editRegion"
                  invalid={!!errors.region}
                />
                <FormFeedback>{errors.region}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="editCountry">Country:</Label>
                <Input
                  type="text"
                  defaultValue={editItem?.country}
                  id="editCountry"
                  name="editCountry"
                  invalid={!!errors.country}
                />
                <FormFeedback>{errors.country}</FormFeedback>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  handleEditFormSubmit({
                    name: document.getElementById("editName").value,
                    region: document.getElementById("editRegion").value,
                    country: document.getElementById("editCountry").value,
                  })
                }
              >
                Save
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  resetErrors();
                  setModalOpen(!modalOpen);
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </>
  );
};

export default InstitutionTable;
```

## Formative Assessment

Before you start, create a new branch called **13-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.