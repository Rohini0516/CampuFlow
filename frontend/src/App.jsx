import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { FacultyPage } from './pages/FacultyPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { TimetablePage } from './pages/TimetablePage';
import { AttendancePage } from './pages/AttendancePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { ExamsPage } from './pages/ExamsPage';
import { EventsPage } from './pages/EventsPage';
import { PlacementsPage } from './pages/PlacementsPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { GrievancesPage } from './pages/GrievancesPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="placements" element={<PlacementsPage />} />
        <Route path="internships" element={<InternshipsPage />} />
        <Route path="complaints" element={<GrievancesPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
