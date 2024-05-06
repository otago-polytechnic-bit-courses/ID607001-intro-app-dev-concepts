import { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          value={formData.name}
          id="name"
          name="name"
          onChange={handleChange}
          invalid={!!errors.name}
        />
        <label htmlFor="name">Region:</label>
        <input
          type="text"
          value={formData.region}
          id="region"
          name="region"
          onChange={handleChange}
          invalid={!!errors.region}
        />
        <label htmlFor="name">Country:</label>
        <input
          type="text"
          value={formData.country}
          id="country"
          name="country"
          onChange={handleChange}
          invalid={!!errors.country}
        />
        {errors.submitError && (
          <div className="text-danger">{errors.submitError}</div>
        )}
        <button type="submit">Add Institution</button>
      </form>
      <span>{errors.name}</span>
      <span>{errors.region}</span>
      <span>{errors.country}</span>
    </>
  );
};

InstitutionForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default InstitutionForm;
