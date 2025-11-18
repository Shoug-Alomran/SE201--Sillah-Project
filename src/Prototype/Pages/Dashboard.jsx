import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Bell, 
  Calendar, 
  BookOpen, 
  Users, 
  Activity, 
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  FileText,
  Shield
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState({
    patientCount: 0,
    appointmentCount: 0,
    highRiskCount: 0,
    familyMembersCount: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        if (userProfile?.user_type === 'doctor') {
          // DOCTOR DASHBOARD DATA
          const assignmentsQuery = query(
            collection(db, "doctor_patients"),
            where("doctor_id", "==", currentUser.uid),
            where("status", "==", "active")
          );
          const assignmentsSnapshot = await getDocs(assignmentsQuery);
          const patientIds = assignmentsSnapshot.docs.map(doc => doc.data().patient_id);
          
          let highRiskCount = 0;
          let totalFamilyMembers = 0;

          for (const patientId of patientIds) {
            const userQuery = query(collection(db, "users"), where("uid", "==", patientId));
            const userSnapshot = await getDocs(userQuery);
            
            if (!userSnapshot.empty) {
              const patientData = userSnapshot.docs[0].data();
              if (patientData.risk_level === 'high') highRiskCount++;

              const familyQuery = query(collection(db, "family_members"), where("user_id", "==", patientId));
              const familySnapshot = await getDocs(familyQuery);
              totalFamilyMembers += familySnapshot.size;
            }
          }

          const appointmentsQuery = query(
            collection(db, "appointments"),
            where("doctor_id", "==", currentUser.uid),
            where("status", "==", "scheduled"),
            orderBy("appointment_date", "asc"),
            limit(5)
          );
          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setStats({
            patientCount: patientIds.length,
            appointmentCount: appointmentsData.length,
            highRiskCount: highRiskCount,
            familyMembersCount: totalFamilyMembers
          });
          setRecentAppointments(appointmentsData);

        } else {
          // PATIENT DASHBOARD DATA
          const familyQuery = query(collection(db, "family_members"), where("user_id", "==", currentUser.uid));
          const familySnapshot = await getDocs(familyQuery);
          const familyCount = familySnapshot.size;

          const appointmentsQuery = query(
            collection(db, "appointments"),
            where("patient_id", "==", currentUser.uid),
            where("status", "==", "scheduled"),
            orderBy("appointment_date", "asc"),
            limit(5)
          );
          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const healthQuery = query(collection(db, "personal_health_records"), where("user_id", "==", currentUser.uid));
          const healthSnapshot = await getDocs(healthQuery);
          const healthRecordsCount = healthSnapshot.size;

          setStats({
            patientCount: 0,
            appointmentCount: appointmentsData.length,
            highRiskCount: healthRecordsCount,
            familyMembersCount: familyCount
          });
          setRecentAppointments(appointmentsData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, userProfile]);

  const isDoctor = userProfile?.user_type === 'doctor';

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {userProfile?.full_name || 'User'}</h1>
          <p className="dashboard-subtitle">
            {isDoctor ? 'Healthcare Provider Portal' : 'Family Health Portal'}
          </p>
          <p className="dashboard-welcome">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          {isDoctor ? (
            // DOCTOR STATS
            <>
              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Patients Assigned</p>
                    <h3 className="stat-value">{stats.patientCount}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-blue-500">
                    <Users className="stat-icon" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Upcoming Appointments</p>
                    <h3 className="stat-value">{stats.appointmentCount}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-purple-500">
                    <Calendar className="stat-icon" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">High Risk Cases</p>
                    <h3 className="stat-value">{stats.highRiskCount}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-green-500">
                    <AlertTriangle className="stat-icon" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Family Members Tracked</p>
                    <h3 className="stat-value">{stats.familyMembersCount}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-teal-500">
                    <Users className="stat-icon" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // PATIENT STATS
            <>
              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Family Members</p>
                    <h3 className="stat-value">{stats.familyMembersCount}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-blue-500">
                    <Users className="stat-icon" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Upcoming Appointments</p>
                    <h3 className="stat-value">{stats.appointmentCount}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-purple-500">
                    <Calendar className="stat-icon" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Health Records</p>
                    <h3 className="stat-value">{stats.highRiskCount}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-green-500">
                    <FileText className="stat-icon" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Unread Alerts</p>
                    <h3 className="stat-value">{recentAlerts.length}</h3>
                  </div>
                  <div className="stat-icon-wrapper from-teal-500">
                    <Bell className="stat-icon" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <h2 className="quick-actions-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {isDoctor ? (
              // DOCTOR ACTIONS
              <>
                <Link to="/patients" className="quick-action-btn btn-teal">
                  <Users className="quick-action-icon" />
                  View My Patients
                </Link>
                <Link to="/appointments" className="quick-action-btn btn-blue">
                  <Calendar className="quick-action-icon" />
                  Manage Appointments
                </Link>
                <Link to="/medications" className="quick-action-btn btn-purple">
                  <Stethoscope className="quick-action-icon" />
                  Prescribe Medications
                </Link>
                <Link to="/awareness-hub" className="quick-action-btn btn-teal">
                  <BookOpen className="quick-action-icon" />
                  Medical Resources
                </Link>
              </>
            ) : (
              // PATIENT ACTIONS
              <>
                <Link to="/family-tree" className="quick-action-btn btn-teal">
                  <Users className="quick-action-icon" />
                  Family Tree
                </Link>
                <Link to="/my-health" className="quick-action-btn btn-blue">
                  <Activity className="quick-action-icon" />
                  My Health Records
                </Link>
                <Link to="/appointments" className="quick-action-btn btn-purple">
                  <Calendar className="quick-action-icon" />
                  My Appointments
                </Link>
                <Link to="/awareness-hub" className="quick-action-btn btn-teal">
                  <BookOpen className="quick-action-icon" />
                  Health Education
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="quick-actions-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Shield size={24} color="#14b8a6" />
            <h2 className="quick-actions-title" style={{ margin: 0 }}>Patient Privacy & Access</h2>
          </div>
          <p>
            {isDoctor 
              ? `You have access to ${stats.patientCount} patients assigned to you. Patient data is protected by healthcare privacy regulations. You can only view and manage patients who have been specifically assigned to your care.`
              : 'Your health information is protected and secure. Only healthcare providers directly involved in your care have access to your medical records in accordance with privacy regulations.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}