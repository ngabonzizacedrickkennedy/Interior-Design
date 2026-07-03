import api from "../client";

export const getAllProjects = () => api.get("/projects");
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const getProjectsByClient = (clientId) => api.get(`/projects/client/${clientId}`);
export const updateMilestones = (id, milestones) =>
  api.patch(`/projects/${id}/milestones`, { milestones });
export const updateProjectStatus = (id, operationalStatus) =>
  api.patch(`/projects/${id}/status`, { operationalStatus });
