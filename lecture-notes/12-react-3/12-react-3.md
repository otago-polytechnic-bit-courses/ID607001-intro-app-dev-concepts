# 12: React 3

## Preparation

1. In the **Terminal**, the following command:

```bash
npm create vite@latest
```

2. Name the project **12-react-3**, select **React** as the framework and select **JavaScript + SWC** as the variant.

3. Change into the project directory and install the dependencies:

```bash
cd 12-react-3
npm install
```

4. Start the development server:

```bash
npm run dev
```

If you try to run the development server before installing the dependencies, you will get an error.

5. Navigate to **http://127.0.0.1:5173/** in your browser.

You should see a page that says **Vite + React**.

## Axios

**Axios** is a promise-based HTTP client for the browser and Node.js. It is used to make HTTP requests to the server. It is a great alternative to the `fetch` API.

### Getting Started

1. In the **Terminal**, the following command:

```bash
npm install axios
```

2. In the **src** directory, create a new directory called **utils**. In the **utils** directory, create a new file called **axios.js**. In **axios.js**, add the following code:

```javascript
import axios from "axios";

// Create an axios instance
const studentManagementSystemInstance = axios.create({
  baseURL: "https://id607001-graysono-wbnj.onrender.com/api", // Replace with your own API URL
  timeout: 10000, // 10 seconds. Increase if requests are timing out
});

export { studentManagementSystemInstance };
```

**What is the benefit of using an axios instance?** It allows you to set default values for the configuration of the requests, such as the base URL and the timeout.

**Can I have multiple axios instances in a single application?** Yes. It is useful if you need to make requests to different APIs.

## React Router DOM

**React Router DOM** is a library that is used to add routing to a **React** application. It allows you to create different routes for different components.

### Getting Started

1. In the **Terminal**, the following command:

```bash
npm install react-router-dom
```

2. In the `src` directory, create a new directory called **components**. In the **components** directory, create a new file called **Navigation.jsx**. In **Navigation.jsx**, add the following code:

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import InstitutionTable from "./tables/InstitutionTable";

const Navigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/institutions" element={<InstitutionTable />} />
      </Routes>
    </Router>
  );
};

export default Navigation;
```

Let us breakdown the components in this code snippet:

- `Router` is a component that wraps the entire application. It is used to provide routing to the application.
- `Routes` is a component that contains the routes for the application.
- `Route` is a component that defines a route. It has two required props: `path` and `element`. `path` is the URL path and `element` is the component to be rendered when the path matches the current URL.

3. In the `src` directory, create a new directory called **forms**. In the **forms** directory, create a new file called **InstitutionForm.jsx**. In **InstitutionForm.jsx**, add the following code:

```jsx
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
    <form onSubmit={handleSubmit}>
      <label for="name">Name:</label>
      <input
        type="text"
        value={formData.name}
        id="name"
        name="name"
        onChange={handleChange}
        invalid={!!errors.name}
      />
      <span>{errors.name}</span>
      <label for="name">Region:</label>
      <input
        type="text"
        value={formData.region}
        id="region"
        name="region"
        onChange={handleChange}
        invalid={!!errors.region}
      />
      <span>{errors.region}</span>
      <label for="name">Country:</label>
      <input
        type="text"
        value={formData.country}
        id="country"
        name="country"
        onChange={handleChange}
        invalid={!!errors.country}
      />
      <span>{errors.country}</span>
      {errors.submitError && (
        <div className="text-danger">{errors.submitError}</div>
      )}
      <button type="submit">Add Institution</button>
    </form>
  );
};

InstitutionForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default InstitutionForm;
```

4. In the `src` directory, create a new directory called **tables**. In the **tables** directory, create a new file called **InstitutionTable.jsx**. In **InstitutionTable.jsx**, add the following code:

```jsx
import { useEffect, useState } from "react";

import { studentManagementSystemInstance } from "../../utils/axios";

import InstitutionForm from "../forms/InstitutionForm";

const InstitutionTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

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

  const handleFormSubmit = () => fetchData(); // Refetch data when the form is submitted

  return (
    <>
      <InstitutionForm onFormSubmit={handleFormSubmit} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Region</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
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
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default InstitutionTable;
```

5. In the `src` directory, open **App.jsx** and replace the existing code with the following:

```jsx
import Navigation from "./components/Navigation";

const App = () => {
  return <Navigation />;
};

export default App;
```

6. Navigate to **http://127.0.0.1:5173/īnstitutions**. **Note:** If you see, **No data available**, it means that you have not added any institutions yet.

## Formative Assessment

Before you start, create a new branch called **12-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

<<<<<<< HEAD
1. 
=======
# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
>>>>>>> cf545330576d1c625eac010447decdeb2d4daf5c
