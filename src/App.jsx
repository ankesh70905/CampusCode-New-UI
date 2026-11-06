import { useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import NextPhasePage from "./pages/NextPhasePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import { DashboardOverviewPage } from "./pages/DashboardOverviewPage.jsx";
import {
  AchievementsPage,
  ActivityPage,
  CertificatesPage,
  NotificationsPage,
  ProjectsPage,
  ProjectDetailPage,
  SettingsPage,
  StudentProfilePage,
} from "./pages/DashboardFeaturePages.jsx";
import {
  DiscoverEventsPage,
  EventDetailsPage,
  EventHubPage,
  MyEventsPage,
} from "./pages/EventPages.jsx";
import { eventCatalog } from "./data/eventsMockData.js";

export default function App() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const previousTitle = document.title;
    const titles = {
      "/": "CampusCode — Your ideas deserve an arena",
      "/login": "Log in — CampusCode",
      "/register": "Join CampusCode",
      "/app": "Overview — CampusCode",
      "/app/events": "Discover Events — CampusCode",
      "/app/my-events": "My Events — CampusCode",
      "/app/projects": "My Projects — CampusCode",
      "/app/activity": "Activity — CampusCode",
      "/app/achievements": "Achievements — CampusCode",
      "/app/certificates": "Certificates — CampusCode",
      "/app/profile": "Student Profile — CampusCode",
      "/app/notifications": "Notifications — CampusCode",
      "/app/settings": "Settings — CampusCode",
    };
    const eventId = pathname.match(/^\/app\/events\/([^/]+)/)?.[1];
    const event = eventCatalog.find((item) => item.id === eventId);
    document.title = event
      ? `${event.title}${pathname.endsWith("/hub") ? " Event Hub" : ""} — CampusCode`
      : titles[pathname] || (pathname.startsWith("/app/projects/") ? "Project Workspace — CampusCode" : "CampusCode");
    return () => {
      document.title = previousTitle;
    };
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="events" element={<DiscoverEventsPage />} />
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        <Route path="events/:eventId/hub" element={<EventHubPage />} />
        <Route path="my-events" element={<MyEventsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NextPhasePage page="Page not found" />} />
      </Route>
      <Route path="*" element={<NextPhasePage page="Page not found" />} />
    </Routes>
  );
}
