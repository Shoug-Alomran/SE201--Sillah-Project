import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Layout from "./Prototype/Layout.jsx";
import Login from "./Prototype/Pages/Login.jsx";
import Signup from "./Prototype/Pages/Signup.jsx";
import Dashboard from "./Prototype/Pages/Dashboard.jsx";
import Appointments from "./Prototype/Pages/Appointments.jsx";
import AwarenessHub from "./Prototype/Pages/AwarenessHub.jsx";
import Clinics from "./Prototype/Pages/Clinics.jsx";
import FamilyTree from "./Prototype/Pages/FamilyTree.jsx";
import MyHealth from "./Prototype/Pages/MyHealth.jsx";
import PatientDetail from "./Prototype/Pages/PatientDetail.jsx";
import Patients from "./Prototype/Pages/Patients.jsx";
import RiskAssessment from "./Prototype/Pages/RiskAssessment.jsx";
import Alerts from "./Prototype/Pages/Alerts.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Common Routes (Both Patient & Doctor) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/alerts" element={
          <ProtectedRoute>
            <Layout currentPageName="Alerts">
              <Alerts />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute>
            <Layout currentPageName="Appointments">
              <Appointments />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/clinics" element={
          <ProtectedRoute>
            <Layout currentPageName="Clinics">
              <Clinics />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/awareness-hub" element={
          <ProtectedRoute>
            <Layout currentPageName="AwarenessHub">
              <AwarenessHub />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Patient-Only Routes */}
        <Route path="/my-health" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['patient']}>
              <Layout currentPageName="MyHealth">
                <MyHealth />
              </Layout>
            </RoleBasedRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/family-tree" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['patient']}>
              <Layout currentPageName="FamilyTree">
                <FamilyTree />
              </Layout>
            </RoleBasedRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/risk-assessment" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['patient']}>
              <Layout currentPageName="RiskAssessment">
                <RiskAssessment />
              </Layout>
            </RoleBasedRoute>
          </ProtectedRoute>
        } />
        
        {/* Doctor-Only Routes */}
        <Route path="/patients" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['doctor']}>
              <Layout currentPageName="Patients">
                <Patients />
              </Layout>
            </RoleBasedRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/patient-detail" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['doctor']}>
              <Layout currentPageName="PatientDetail">
                <PatientDetail />
              </Layout>
            </RoleBasedRoute>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;