// Note: Please read the code comments

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

import { studentManagementSystemInstance } from "../../utils/axios";

const InstitutionForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob:"",
    nationality:"",
  
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    dob:"",
    nationality:"",
    submitError: "",
  });

  // This function is called when the input fields change
  const handleChange = (e) => {
    const { name, value } = e.target; // name refers to the name attribute of the input field, value refers to the value of the input field
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // This function is called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      await studentManagementSystemInstance.post("/institutions", formData);
      setFormData({
        firstname: "",
        lastname: "",
        dob:"",
        nationality:"",
      });
      setErrors({
        firstname: "",
        lastname: "",
        dob:"",
        nationality:"",
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
        <Label for="name">First_Name:</Label>
        <Input
          type="text"
          value={formData.firstname}
          id="firstname"
          name="firstname"
          onChange={handleChange}
          invalid={!!errors.firstname}
        />
        <FormFeedback>{errors.firstname}</FormFeedback>
      </FormGroup>

      <FormGroup>
        <Label for="name">Last_Name:</Label>
        <Input
          type="text"
          value={formData.lastname}
          id="lastname"
          name="lastname"
          onChange={handleChange}
          invalid={!!errors.lastname} 
        />
        <FormFeedback>{errors.lastname}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="name">DOB:</Label>
        <Input
          type="text"
          value={formData.dob}
          id="dob"
          name="dob"
          onChange={handleChange}
          invalid={!!errors.dob}
        />
        <FormFeedback>{errors.dob}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="name">Nationality:</Label>
        <Input
          type="text"
          value={formData.nationality}
          id="nationality"
          name="nationality"
          onChange={handleChange}
          invalid={!!errors.nationality}
        />
        <FormFeedback>{errors.nationality}</FormFeedback>
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