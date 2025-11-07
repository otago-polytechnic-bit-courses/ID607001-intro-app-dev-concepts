export const endpoints = [
  // Institutions
  {
    method: "GET",
    path: `/api/institutions`,
    description: "Get all institutions",
  },
  {
    method: "GET",
    path: `/api/institutions/:id`,
    description: "Get an institution by ID",
  },
  {
    method: "POST",
    path: `/api/institutions`,
    description: "Create an institution",
  },
  {
    method: "PUT",
    path: `/api/institutions/:id`,
    description: "Update an institution",
  },
  {
    method: "DELETE",
    path: `/api/institutions/:id`,
    description: "Delete an institution",
  },

  // Departments
  {
    method: "GET",
    path: `/api/departments`,
    description: "Get all departments",
  },
  {
    method: "GET",
    path: `/api/departments/:id`,
    description: "Get a department by ID",
  },
  {
    method: "POST",
    path: `/api/departments`,
    description: "Create a department",
  },
  {
    method: "PUT",
    path: `/api/departments/:id`,
    description: "Update a department",
  },
  {
    method: "DELETE",
    path: `/api/departments/:id`,
    description: "Delete a department",
  },
];
