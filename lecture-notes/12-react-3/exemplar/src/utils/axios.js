import axios from "axios";

// Create an axios instance
const studentManagementSystemInstance = axios.create({
  baseURL: "https://id607001-graysono-wbnj.onrender.com/api", // Replace with your own API URL
  timeout: 10000, // 10 seconds. Increase if requests are timing out
});

export { studentManagementSystemInstance };
