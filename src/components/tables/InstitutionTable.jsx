// Note: Please read the code comments

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

import { studentManagementSystemInstance } from "../../utils/axios";

import InstitutionForm from "../forms/InstitutionForm";

const InstitutionTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    dob:"",
    nationality:"",
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
      const res = await studentManagementSystemInstance.get("/institutions");
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
        await studentManagementSystemInstance.delete(`/institutions/${id}`);
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
      firstname: "",
      lastname: "",
      dob:"",
      nationality:"",
      submitError: "",
    });
  };

  const handleEditFormSubmit = async (editedData) => {
    try {
      await studentManagementSystemInstance.put(`/institutions/${editItem.id}`, editedData);
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
                <th>First_Name</th>
                <th>Last_Name</th>
                <th>DOB</th>
                <th>Nationality</th>
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
                      <td>{item.firstname}</td>
                      <td>{item.lastname}</td>
                      <td>{item.dob}</td>
                      <td>{item.nationality}</td>
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
                <Label for="editFirst_Name">First_Name:</Label>
                <Input
                  type="text"
                  defaultValue={editItem?.firtname}
                  id="editFirst_Name"
                  name="editFirst_Name"
                  invalid={!!errors.firstname}
                />
                <FormFeedback>{errors.firstname}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for="editLast_Name">Last_Name:</Label>
                <Input
                  type="text"
                  defaultValue={editItem?.lastname}
                  id="editLast_Name"
                  name="editLast_Name"
                  invalid={!!errors.lastname}
                />
                <FormFeedback>{errors.lastname}</FormFeedback>
              </FormGroup>


              <FormGroup>
                <Label for="editDOB">DOB:</Label>
                <Input
                  type="text"
                  defaultValue={editItem?.dob}
                  id="editDOB"
                  name="editDOB"
                  invalid={!!errors.dob}
                />
                <FormFeedback>{errors.dob}</FormFeedback>
              </FormGroup>
            
              <FormGroup>
                <Label for="editNationality">Nationality:</Label>
                <Input
                  type="text"
                  defaultValue={editItem?.nationality}
                  id="editNationality"
                  name="editNationality"
                  invalid={!!errors.nationality}
                />
                <FormFeedback>{errors.nationality}</FormFeedback>
              </FormGroup>


            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  handleEditFormSubmit({
                    firstname: document.getElementById("editFirst_Name").value,
                    lastname: document.getElementById("editLast_Name").value,
                    dob: document.getElementById("editDOB").value,
                    nationality: document.getElementById("editNationality").value,
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