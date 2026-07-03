// Role-to-default-route mapping — kept in its own file so it can be
// imported anywhere without triggering Vite Fast Refresh conflicts.

export const ROLE_DEFAULT_ROUTE = {
  CLIENT:          "/portal/dashboard",
  STAFF:           "/portal/tasks",
  PROJECT_MANAGER: "/portal/projects",
  ADMIN:           "/portal/clients",
};
