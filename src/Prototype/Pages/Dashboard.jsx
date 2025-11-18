import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Bell, Calendar, BookOpen, Users, Activity, Stethoscope } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Dashboard() {
  const { currentUser, userProfile, isDoctor, isPatient } = useAuth();
  const [stats, setStats] = useState({
    healthRecords: 0,
    alerts: 0,
    appointments: 0,
    learningResources: 12,
    totalPatients: 0,
    assignedPatients: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return;

      try {
        setLoading(true);

        if (isPatient) {
          // Fetch patient-specific data
          await fetchPatientData();
        } else if (isDoctor) {
          // Fetch doctor-specific data
          await fetchDoctorData();
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [currentUser, isPatient, isDoctor]);

  // Fetch patient dashboard data
  async function fetchPatientData() {
    // Health Records
    const healthRecordsRef = collection(db, "health_records");
    const healthQuery = query(
      healthRecordsRef,
      where("user_id", "==", currentUser.uid)
    );
    const healthSnapshot = await getDocs(healthQuery);

    // Alerts
    const alertsRef = collection(db, "alerts");
    const alertsQuery = query(
      alertsRef,
      where("user_id", "==", currentUser.uid),
      where("is_read", "==", false)
    );
    const alertsSnapshot = await getDocs(alertsQuery);

    // Recent alerts (for display)
    const recentAlertsQuery = query(
      alertsRef,
      where("user_id", "==", currentUser.uid),
      orderBy("created_at", "desc"),
      limit(3)
    );
    const recentAlertsSnapshot = await getDocs(recentAlertsQuery);
    const alertsData = [];
    recentAlertsSnapshot.forEach((doc) => {
      alertsData.push({ id: doc.id, ...doc.data() });
    });

    // Appointments
    const appointmentsRef = collection(db, "appointments");
    const appointmentsQuery = query(
      appointmentsRef,
      where("user_id", "==", currentUser.uid),
      where("status", "==", "scheduled")
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    // Upcoming appointments (for display)
    const upcomingQuery = query(
      appointmentsRef,
      where("user_id", "==", currentUser.uid),
      where("status", "==", "scheduled"),
      orderBy("appointment_date", "asc"),
      limit(3)
    );
    const upcomingSnapshot = await getDocs(upcomingQuery);
    const appointmentsData = [];
    upcomingSnapshot.forEach((doc) => {
      appointmentsData.push({ id: doc.id, ...doc.data() });
    });

    setStats({
      healthRecords: healthSnapshot.size,
      alerts: alertsSnapshot.size,
      appointments: appointmentsSnapshot.size,
      learningResources: 12,
    });
    setRecentAlerts(alertsData);
    setUpcomingAppointments(appointmentsData);
  }

  // Fetch doctor dashboard data
  async function fetchDoctorData() {
    // Get patients assigned to this doctor
    const patientsRef = collection(db, "doctor_patients");
    const patientsQuery = query(
      patientsRef,
      where("doctor_id", "==", currentUser.uid)
    );
    const patientsSnapshot = await getDocs(patientsQuery);

    // Appointments for this doctor
    const appointmentsRef = collection(db, "appointments");
    const appointmentsQuery = query(
      appointmentsRef,
      where("doctor_id", "==", currentUser.uid),
      where("status", "==", "scheduled")
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    // Upcoming appointments (for display)
    const upcomingQuery = query(
      appointmentsRef,
      where("doctor_id", "==", currentUser.uid),
      where("status", "==", "scheduled"),
      orderBy("appointment_date", "asc"),
      limit(3)
    );
    const upcomingSnapshot = await getDocs(upcomingQuery);
    const appointmentsData = [];
    upcomingSnapshot.forEach((doc) => {
      appointmentsData.push({ id: doc.id, ...doc.data() });
    });

    setStats({
      totalPatients: patientsSnapshot.size,
      assignedPatients: patientsSnapshot.size,
      appointments: appointmentsSnapshot.size,
      learningResources: 12,
    });
    setUpcomingAppointments(appointmentsData);
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return ` at ${timeString}`;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1 className="dashboard-title">Loading...</h1>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Sillah (صلة)</h1>
          <p className="dashboard-subtitle">
            {isDoctor ? "Healthcare Provider Portal" : "Family Health Management System"}
          </p>
          <p className="dashboard-welcome">
            Welcome back, {userProfile?.full_name || currentUser?.displayName || "User"}
          </p>
        </header>

        {/* Stats Grid - Different for Doctor vs Patient */}
        <div className="stats-grid">
          {isPatient && (
            <>
              <Link to="/my-health" className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">My Health Records</p>
                    <p className="stat-value">{stats.healthRecords}</p>
                  </div>
                  <div className="stat-icon-wrapper from-blue-500">
                    <Heart className="stat-icon" />
                  </div>
                </div>
              </Link>

              <Link to="/alerts" className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">My Reminders</p>
                    <p className="stat-value">{stats.alerts}</p>
                  </div>
                  <div className="stat-icon-wrapper from-purple-500">
                    <Bell className="stat-icon" />
                  </div>
                </div>
              </Link>

              <Link to="/appointments" className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Upcoming Appointments</p>
                    <p className="stat-value">{stats.appointments}</p>
                  </div>
                  <div className="stat-icon-wrapper from-green-500">
                    <Calendar className="stat-icon" />
                  </div>
                </div>
              </Link>

              <Link to="/awareness-hub" className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Learning Resources</p>
                    <p className="stat-value">{stats.learningResources}+</p>
                  </div>
                  <div className="stat-icon-wrapper from-teal-500">
                    <BookOpen className="stat-icon" />
                  </div>
                </div>
              </Link>
            </>
          )}

          {isDoctor && (
            <>
              <Link to="/patients" className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Patients Assigned to Me</p>
                    <p className="stat-value">{stats.assignedPatients}</p>
                  </div>
                  <div className="stat-icon-wrapper from-blue-500">
                    <Users className="stat-icon" />
                  </div>
                </div>
              </Link>

              <Link to="/appointments" className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Upcoming Appointments</p>
                    <p className="stat-value">{stats.appointments}</p>
                  </div>
                  <div className="stat-icon-wrapper from-green-500">
                    <Calendar className="stat-icon" />
                  </div>
                </div>
              </Link>

              <Link to="/awareness-hub" className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Medical Resources</p>
                    <p className="stat-value">{stats.learningResources}+</p>
                  </div>
                  <div className="stat-icon-wrapper from-teal-500">
                    <BookOpen className="stat-icon" />
                  </div>
                </div>
              </Link>

              <div className="stat-card" style={{ cursor: "default" }}>
                <div className="stat-card-content">
                  <div className="stat-info">
                    <p className="stat-label">Active Treatments</p>
                    <p className="stat-value">Coming Soon</p>
                  </div>
                  <div className="stat-icon-wrapper from-purple-500">
                    <Stethoscope className="stat-icon" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Doctor Notice */}
        {isDoctor && (
          <div className="privacy-notice" style={{ marginTop: "1rem" }}>
            <Users className="privacy-icon" style={{ color: "#14b8a6" }} />
            <div className="privacy-content">
              <p className="privacy-title">Patient Privacy & Access</p>
              <p className="privacy-text">
                You have access to {stats.assignedPatients} patient{stats.assignedPatients !== 1 ? "s" : ""} assigned to you. Patient data is protected by healthcare privacy regulations. You can only view and manage patients who have been specifically assigned to your care.
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions - Different for Doctor vs Patient */}
        <div className="quick-actions-card">
          <h2 className="quick-actions-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {isPatient && (
              <>
                <Link to="/my-health" className="quick-action-btn btn-teal">
                  <Heart className="quick-action-icon" />
                  My Health
                </Link>
                <Link to="/appointments" className="quick-action-btn btn-blue">
                  <Calendar className="quick-action-icon" />
                  Book Appointment
                </Link>
                <Link to="/awareness-hub" className="quick-action-btn btn-purple">
                  <BookOpen className="quick-action-icon" />
                  Learn More
                </Link>
              </>
            )}

            {isDoctor && (
              <>
                <Link to="/patients" className="quick-action-btn btn-teal">
                  <Users className="quick-action-icon" />
                  View My Patients
                </Link>
                <Link to="/appointments" className="quick-action-btn btn-blue">
                  <Calendar className="quick-action-icon" />
                  Manage Appointments
                </Link>
                <Link to="/awareness-hub" className="quick-action-btn btn-purple">
                  <BookOpen className="quick-action-icon" />
                  Medical Resources
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="activity-grid">
          {/* Recent Alerts (Patients Only) */}
          {isPatient && (
            <div className="activity-card">
              <div className="activity-card-header">
                <h3 className="activity-card-title">Recent Alerts</h3>
                <Link to="/alerts" className="view-all-btn">
                  View All
                </Link>
              </div>
              <div className="activity-card-content">
                {recentAlerts.length === 0 ? (
                  <p className="empty-message">No recent alerts</p>
                ) : (
                  recentAlerts.map((alert) => (
                    <div key={alert.id} className="alert-item">
                      <h4 className="alert-item-title">{alert.title}</h4>
                      <p className="alert-item-message">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          <div className="activity-card">
            <div className="activity-card-header">
              <h3 className="activity-card-title">Upcoming Appointments</h3>
              <Link to="/appointments" className="view-all-btn">
                View All
              </Link>
            </div>
            <div className="activity-card-content">
              {upcomingAppointments.length === 0 ? (
                <p className="empty-message">No upcoming appointments</p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <h4 className="appointment-item-title">
                      {appointment.clinic_name}
                    </h4>
                    <p className="appointment-item-details">
                      {formatDate(appointment.appointment_date)}
                      {formatTime(appointment.appointment_time)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Doctor-specific: Recent Patient Updates */}
          {isDoctor && (
            <div className="activity-card">
              <div className="activity-card-header">
                <h3 className="activity-card-title">Patient Updates</h3>
                <Link to="/patients" className="view-all-btn">
                  View All
                </Link>
              </div>
              <div className="activity-card-content">
                <p className="empty-message">
                  Check the Patients page to view detailed health information for your assigned patients
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}