import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Testimonials } from "./pages/Testimonials";
import { Contact } from "./pages/Contact";
import { RequestService } from "./pages/RequestService";
import { ScrollToTop } from "./components/ScrollToTop";

import { AuthProvider } from "./portal/auth/AuthContext";
import { PortalLogin } from "./portal/PortalLogin";
import { PortalRegister } from "./portal/PortalRegister";
import { PortalForgotPassword } from "./portal/PortalForgotPassword";
import { PortalResetPassword } from "./portal/PortalResetPassword";
import { PortalLayout } from "./portal/PortalLayout";
import { ClientManagement } from "./portal/pages/ClientManagement";
import { ClientDashboard } from "./portal/pages/ClientDashboard";
import { RequestDetail } from "./portal/pages/RequestDetail";
import { Assessments } from "./portal/pages/Assessments";
import { Account } from "./portal/pages/Account";
import { NewRequestWizard } from "./portal/wizard/NewRequestWizard";
import { ServiceRequests } from "./portal/pages/ServiceRequests";
import { Quotations } from "./portal/pages/Quotations";
import { ProjectManagement } from "./portal/pages/ProjectManagement";
import { TasksResources } from "./portal/pages/TasksResources";
import { DesignPortfolio } from "./portal/pages/DesignPortfolio";
import { CustomerFeedback } from "./portal/pages/CustomerFeedback";
import { AnalyticsDashboard } from "./portal/pages/AnalyticsDashboard";
import { NotificationsHub } from "./portal/pages/NotificationsHub";
import { SecurityAccess } from "./portal/pages/SecurityAccess";

function PublicLayout() {
  return (
    <div id="top">
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public marketing site */}
        <Route path="/" element={<PublicLayout />}>
          <Route index                  element={<Home />} />
          <Route path="portfolio"       element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="services"        element={<Services />} />
          <Route path="about"           element={<About />} />
          <Route path="testimonials"    element={<Testimonials />} />
          <Route path="contact"         element={<Contact />} />
          <Route path="request"         element={<RequestService />} />
        </Route>

        {/* Auth pages (no sidebar) */}
        <Route path="/portal/login"           element={<PortalLogin />} />
        <Route path="/portal/register"        element={<PortalRegister />} />
        <Route path="/portal/forgot-password" element={<PortalForgotPassword />} />
        <Route path="/portal/reset-password"  element={<PortalResetPassword />} />

        {/* Protected portal (role-based sidebar rendered by PortalLayout) */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<Navigate to="requests" replace />} />
          <Route path="clients"       element={<ClientManagement />} />
          <Route path="dashboard"     element={<ClientDashboard />} />
          <Route path="requests"      element={<ServiceRequests />} />
          <Route path="requests/new"      element={<NewRequestWizard />} />
          <Route path="requests/:id"      element={<RequestDetail />} />
          <Route path="assessments"   element={<Assessments />} />
          <Route path="account"       element={<Account />} />
          <Route path="quotations"    element={<Quotations />} />
          <Route path="projects"      element={<ProjectManagement />} />
          <Route path="tasks"         element={<TasksResources />} />
          <Route path="design-files"  element={<DesignPortfolio />} />
          <Route path="feedback"      element={<CustomerFeedback />} />
          <Route path="analytics"     element={<AnalyticsDashboard />} />
          <Route path="notifications" element={<NotificationsHub />} />
          <Route path="security"      element={<SecurityAccess />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
