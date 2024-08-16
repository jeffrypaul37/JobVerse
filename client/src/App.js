import React, { useEffect } from "react";
import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import withLayout from "./components/layout/withLayout";
import "./App.css";
import { useSocketStore } from "./store/store";
import { getUsername } from "./pages/auth/helper/api";

const Home = lazy(() => import("./pages/Home"));
const FaqPage = lazy(() => import("./pages/Faq"));
const ContactPage = lazy(() => import("./pages/Contact"));

/* Auth Pages */
const UserNamePage = lazy(() => import("./pages/auth/Username"));
const PasswordPage = lazy(() => import("./pages/auth/Password"));
const RegisterPage = lazy(() => import("./pages/auth/Register"));
const ProfilePage = lazy(() => import("./pages/auth/Profile"));
const RecoveryPage = lazy(() => import("./pages/auth/Recovery"));
const ResetPage = lazy(() => import("./pages/auth/Reset"));
const SearchResults = lazy(() => import("./pages/search/search"));
/* Recruiter Pages*/
const JobCreation = lazy(() => import("./pages/recruiter/JobCreation"));
const JobsDashboard = lazy(() => import("./pages/recruiter/JobsDashboard"));
const UpdateJob = lazy(() => import("./pages/recruiter/UpdateJob"));
const JobDetail = lazy(() => import("./pages/recruiter/JobDetail"));
const CreateEvent = lazy(()=> import("./pages/recruiter/EventCreation"));
const EventDashboard = lazy(()=> import("./pages/recruiter/EventDashboard"));
const EventUpdate = lazy(()=> import("./pages/recruiter/UpdateEvent"));


/* Job Seeker Pages */
const JobApplication = lazy(() => import("./pages/jobSeeker/JobApplication"));
const JobDetails = lazy(() => import("./pages/jobSeeker/JobDetails"));
const Applications = lazy(() => import("./pages/jobSeeker/Applications"));
const Bookmarks = lazy(() => import("./pages/jobSeeker/Bookmarks"));
const viewEvents = lazy(()=> import("./pages/jobSeeker/ViewEvents"));

/* Notifications Pages */

const Notifications = lazy(() => import("./pages/notifications"));

/* Page Not Found */
const PageNotFoundPage = lazy(() => import("./components/pageNotFound"));

function App() {
  const initializeSocket = useSocketStore((state) => state.initializeSocket);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const user = await getUsername();
        initializeSocket(token, user.username);
      }
    };
    loadData();
  }, [initializeSocket]);

  return (
    <Box>
      <Router>
        <Routes>
          <Route element={withLayout(Home)()} path="/" />
          <Route element={withLayout(PageNotFoundPage)()} path="/about" />
          <Route element={withLayout(FaqPage)()} path="/faq" />
          <Route element={withLayout(ContactPage)()} path="/contact-us" />
          <Route element={withLayout(SearchResults)()} path="/search" />
          {/*Auth Routes*/}
          <Route element={withLayout(UserNamePage)()} path="/login" />
          <Route element={withLayout(PasswordPage)()} path="/password" />
          <Route element={withLayout(RegisterPage)()} path="/register" />
          <Route element={withLayout(ProfilePage)()} path="/profile" />
          <Route element={withLayout(RecoveryPage)()} path="/recovery" />
          <Route element={withLayout(ResetPage)()} path="/reset" />

          {/* Recruiter Routes */}
          <Route
            element={withLayout(JobCreation)()}
            path="/recruiter/create-job"
          />
          <Route
            element={withLayout(JobsDashboard)()}
            path="/recruiter/dashboard"
          />
          <Route
            element={withLayout(JobDetail)()}
            path="/recruiter/job/:jobId"
          />

          <Route
            element={withLayout(UpdateJob)()}
            path="/recruiter/update-job/:id"
          />

          <Route
            element={withLayout(CreateEvent)()}
            path="/recruiter/create-event"
          />

          <Route
            element={withLayout(EventDashboard)()}
            path="/recruiter/events-dashboard"
          />

          <Route
            element={withLayout(EventUpdate)()}
            path="/recruiter/update-event/:eventId"
          />

          {/* Job Seeker Routes */}
          <Route
            element={withLayout(JobApplication)()}
            path="/job-seeker/job/:jobId/apply"
          />
          <Route
            element={withLayout(JobDetails)()}
            path="/job-seeker/jobs/:jobId"
          />
          <Route
            element={withLayout(Applications)()}
            path="/job-seeker/applications"
          />

          <Route
            element={withLayout(Bookmarks)()}
            path="/job-seeker/bookmarks"
          />

          <Route
            element={withLayout(viewEvents)()}
            path="/job-seeker/view-events"
          />

          <Route element={withLayout(Notifications)()} path="/notifications" />

          {/*404 Page Not Found*/}
          <Route element={withLayout(PageNotFoundPage)()} path="*" />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
