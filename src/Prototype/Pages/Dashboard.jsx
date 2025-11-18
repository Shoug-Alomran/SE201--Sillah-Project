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
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {userProfile?.full_name || 'User'}</h1>
            <p className="welcome-subtitle">
              {isDoctor ? 'Healthcare Provider Portal' : 'Family Health Portal'}
            </p>
          </div>
          <div className="date-display">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          {isDoctor ? (
            // DOCTOR STATS
            <>
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Users className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.patientCount}</h3>
                  <p className="stat-label">Patients Assigned</p>
                  <p className="stat-description">Active patients under your care</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Calendar className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.appointmentCount}</h3>
                  <p className="stat-label">Upcoming Appointments</p>
                  <p className="stat-description">Scheduled for next 30 days</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <AlertTriangle className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value highlight-risk">{stats.highRiskCount}</h3>
                  <p className="stat-label">High Risk Cases</p>
                  <p className="stat-description">Requiring immediate attention</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Users className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.familyMembersCount}</h3>
                  <p className="stat-label">Family Members Tracked</p>
                  <p className="stat-description">Across all patient families</p>
                </div>
              </div>
            </>
          ) : (
            // PATIENT STATS
            <>
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Users className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.familyMembersCount}</h3>
                  <p className="stat-label">Family Members</p>
                  <p className="stat-description">In your family tree</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Calendar className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.appointmentCount}</h3>
                  <p className="stat-label">Upcoming Appointments</p>
                  <p className="stat-description">Your scheduled visits</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <FileText className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.highRiskCount}</h3>
                  <p className="stat-label">Health Records</p>
                  <p className="stat-description">Your medical history</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Bell className="stat-icon" />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{recentAlerts.length}</h3>
                  <p className="stat-label">Unread Alerts</p>
                  <p className="stat-description">Important notifications</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dashboard-content-grid">
          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="actions-grid">
              {isDoctor ? (
                // DOCTOR ACTIONS
                <>
                  <Link to="/patients" className="action-card">
                    <Users className="action-icon" />
                    <div className="action-content">
                      <h3>View My Patients</h3>
                      <p>Manage assigned patients</p>
                    </div>
                  </Link>
                  <Link to="/appointments" className="action-card">
                    <Calendar className="action-icon" />
                    <div className="action-content">
                      <h3>Manage Appointments</h3>
                      <p>Schedule and view visits</p>
                    </div>
                  </Link>
                  <Link to="/medications" className="action-card">
                    <Stethoscope className="action-icon" />
                    <div className="action-content">
                      <h3>Prescribe Medications</h3>
                      <p>Manage patient prescriptions</p>
                    </div>
                  </Link>
                  <Link to="/awareness-hub" className="action-card">
                    <BookOpen className="action-icon" />
                    <div className="action-content">
                      <h3>Medical Resources</h3>
                      <p>Educational materials</p>
                    </div>
                  </Link>
                </>
              ) : (
                // PATIENT ACTIONS
                <>
                  <Link to="/family-tree" className="action-card">
                    <Users className="action-icon" />
                    <div className="action-content">
                      <h3>Family Tree</h3>
                      <p>View family health history</p>
                    </div>
                  </Link>
                  <Link to="/my-health" className="action-card">
                    <Activity className="action-icon" />
                    <div className="action-content">
                      <h3>My Health Records</h3>
                      <p>View medical history</p>
                    </div>
                  </Link>
                  <Link to="/appointments" className="action-card">
                    <Calendar className="action-icon" />
                    <div className="action-content">
                      <h3>My Appointments</h3>
                      <p>Schedule and manage visits</p>
                    </div>
                  </Link>
                  <Link to="/awareness-hub" className="action-card">
                    <BookOpen className="action-icon" />
                    <div className="action-content">
                      <h3>Health Education</h3>
                      <p>Learn about conditions</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="content-card">
            <div className="card-header">
              <Shield className="card-icon" />
              <h2 className="card-title">Patient Privacy & Access</h2>
            </div>
            <div className="card-content">
              <p>
                {isDoctor 
                  ? `You have access to ${stats.patientCount} patients assigned to you. Patient data is protected by healthcare privacy regulations. You can only view and manage patients who have been specifically assigned to your care.`
                  : 'Your health information is protected and secure. Only healthcare providers directly involved in your care have access to your medical records in accordance with privacy regulations.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}