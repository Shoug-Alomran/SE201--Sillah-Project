// src/Prototype/Pages/Dashboard.jsx
// @ts-nocheck
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
  Shield,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();

  const [stats, setStats] = useState({
    patientCount: 0,
    appointmentCount: 0,
    highRiskCount: 0,
    familyMembersCount: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDoctor = userProfile?.user_type === "doctor";

  useEffect(() => {
    if (!currentUser) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        if (isDoctor) {
          // ---------------------------------------------
          // DOCTOR DASHBOARD
          // ---------------------------------------------

          // 1. Get assigned patients
          const { data: assignments, error: assignError } = await supabase
            .from("doctor_patients")
            .select("patient_id")
            .eq("doctor_id", currentUser.uid)
            .eq("status", "active");

          if (assignError) throw assignError;

          const patientIds = assignments.map((a) => a.patient_id);

          // 2. Count high‑risk patients
          let highRiskCount = 0;
          let totalFamilyMembers = 0;

          if (patientIds.length > 0) {
            const { data: usersData, error: usersError } = await supabase
              .from("users")
              .select("uid, risk_level")
              .in("uid", patientIds);

            if (usersError) throw usersError;

            highRiskCount = usersData.filter(
              (u) => u.risk_level === "high"
            ).length;

            // 3. Count family members
            const { data: familyData, error: famError } = await supabase
              .from("family_members")
              .select("user_id");

            if (famError) throw famError;

            const familyCounts = {};
            familyData.forEach((f) => {
              familyCounts[f.user_id] = (familyCounts[f.user_id] || 0) + 1;
            });

            totalFamilyMembers = patientIds.reduce(
              (sum, id) => sum + (familyCounts[id] || 0),
              0
            );
          }

          // 4. Upcoming appointments
          const { data: appts, error: apptError } = await supabase
            .from("appointments")
            .select("*")
            .eq("doctor_id", currentUser.uid)
            .eq("status", "scheduled")
            .order("appointment_date", { ascending: true })
            .limit(5);

          if (apptError) throw apptError;

          setStats({
            patientCount: patientIds.length,
            appointmentCount: appts.length,
            highRiskCount,
            familyMembersCount: totalFamilyMembers,
          });

          setRecentAppointments(appts);
        } else {
          // ---------------------------------------------
          // PATIENT DASHBOARD
          // ---------------------------------------------

          // 1. Family members
          const { data: familyData, error: famError } = await supabase
            .from("family_members")
            .select("id")
            .eq("user_id", currentUser.uid);

          if (famError) throw famError;

          const familyCount = familyData.length;

          // 2. Upcoming appointments
          const { data: appts, error: apptError } = await supabase
            .from("appointments")
            .select("*")
            .eq("patient_id", currentUser.uid)
            .eq("status", "scheduled")
            .order("appointment_date", { ascending: true })
            .limit(5);

          if (apptError) throw apptError;

          // 3. Health records count
          const { data: healthData, error: healthError } = await supabase
            .from("personal_health_records")
            .select("id")
            .eq("user_id", currentUser.uid);

          if (healthError) throw healthError;

          setStats({
            patientCount: 0,
            appointmentCount: appts.length,
            highRiskCount: healthData.length,
            familyMembersCount: familyCount,
          });

          setRecentAppointments(appts);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, userProfile]);

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
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome back, {userProfile?.full_name || "User"}
          </h1>
          <p className="dashboard-subtitle">
            {isDoctor ? "Healthcare Provider Portal" : "Family Health Portal"}
          </p>
          <p className="dashboard-welcome">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {isDoctor ? (
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <Shield size={24} color="#14b8a6" />
            <h2 className="quick-actions-title" style={{ margin: 0 }}>
              Patient Privacy & Access
            </h2>
          </div>

          <p>
            {isDoctor
              ? `You have access to ${stats.patientCount} patients assigned to you. Patient data is protected by healthcare privacy regulations. You can only view and manage patients who have been specifically assigned to your care.`
              : `Your health information is protected and secure. Only healthcare providers directly involved in your care have access to your medical records in accordance with privacy regulations.`}
          </p>
        </div>
      </div>
    </div>
  );
}
