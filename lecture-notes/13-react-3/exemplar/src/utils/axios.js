import axios from "axios";

// Create an axios instance
const studentManagementSystemInstance = axios.create({
  baseURL: "https://id607001-graysono-1i3w.onrender.com/api", // Replace with your own API URL
  timeout: 100000, // 100 seconds. Increase if requests are timing out
});

export { studentManagementSystemInstance };
