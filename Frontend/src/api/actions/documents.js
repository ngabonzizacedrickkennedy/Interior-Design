import api from "../client";

export const getAllDocuments = () => api.get("/documents");
export const getDocumentById = (id) => api.get(`/documents/${id}`);
export const getDocumentsByProject = (projectId) => api.get(`/documents/project/${projectId}`);
export const uploadDocument = (body) => api.post("/documents", body);
export const incrementDocumentVersion = (id) => api.patch(`/documents/${id}/new-version`);
export const approveDocument = (id) => api.patch(`/documents/${id}/approve`);
export const rejectDocument = (id) => api.patch(`/documents/${id}/reject`);
