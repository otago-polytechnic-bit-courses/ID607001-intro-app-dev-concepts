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