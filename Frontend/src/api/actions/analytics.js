import api from "../client";

export const getAnalyticsSnapshot = () => api.get("/analytics");
