import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  LayoutDashboard,
  Calendar,
  Bell,
  MapPin,
  BookOpen,
  Users,
  Activity,
  LogOut,
  Menu,
  X,
  User,
  Stethoscope,
  Pill,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children, currentPageName }) {
  const { logout, currentUser, userProfile, isDoctor, isPatient } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert("Failed to logout");
    }
  };

  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="top-nav-inner">
          {/* Brand */}
          <Link to="/dashboard" className="brand">
            <div className="brand-icon">
              <Heart className="brand-heart" />
            </div>
            <div className="brand-text">
              <div className="brand-title">Sillah</div>
              <div className="brand-subtitle">صلة - Family Health</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links nav-links--desktop">
            {/* Common links for all users */}
            <Link
              to="/dashboard"
              className={`nav-link ${currentPageName === "Dashboard" ? "nav-link--active" : ""
                }`}
            >
              <LayoutDashboard className="nav-link-icon" />
              Dashboard
            </Link>

            {/* Patient-only links */}
            {isPatient && (
              <>
                <Link
                  to="/my-health"
                  className={`nav-link ${currentPageName === "MyHealth" ? "nav-link--active" : ""
                    }`}
                >
                  <Heart className="nav-link-icon" />
                  My Health
                </Link>

                <Link
                  to="/alerts"
                  className={`nav-link ${currentPageName === "Alerts" ? "nav-link--active" : ""
                    }`}
                >
                  <Bell className="nav-link-icon" />
                  Alerts
                </Link>

                <Link
                  to="/medications"
                  className={`nav-link ${currentPageName === "Medications" ? "nav-link--active" : ""
                    }`}
                >
                  <Pill className="nav-link-icon" />
                  Medications
                </Link>

                <Link
                  to="/appointments"
                  className={`nav-link ${currentPageName === "Appointments" ? "nav-link--active" : ""
                    }`}
                >
                  <Calendar className="nav-link-icon" />
                  Appointments
                </Link>

                <Link
                  to="/clinics"
                  className={`nav-link ${currentPageName === "Clinics" ? "nav-link--active" : ""
                    }`}
                >
                  <MapPin className="nav-link-icon" />
                  Clinics
                </Link>

                <Link
                  to="/awareness-hub"
                  className={`nav-link ${currentPageName === "AwarenessHub" ? "nav-link--active" : ""
                    }`}
                >
                  <BookOpen className="nav-link-icon" />
                  Awareness Hub
                </Link>

                <Link
                  to="/family-tree"
                  className={`nav-link ${currentPageName === "FamilyTree" ? "nav-link--active" : ""
                    }`}
                >
                  <Users className="nav-link-icon" />
                  Family Tree
                </Link>

                <Link
                  to="/risk-assessment"
                  className={`nav-link ${currentPageName === "RiskAssessment" ? "nav-link--active" : ""
                    }`}
                >
                  <Activity className="nav-link-icon" />
                  Risk Assessment
                </Link>
              </>
            )}

            {/* Doctor-only links */}
            {isDoctor && (
              <>
                <Link
                  to="/patients"
                  className={`nav-link ${currentPageName === "Patients" ? "nav-link--active" : ""
                    }`}
                >
                  <Users className="nav-link-icon" />
                  My Patients
                </Link>

                <Link
                  to="/medications"
                  className={`nav-link ${currentPageName === "Medications" ? "nav-link--active" : ""
                    }`}
                >
                  <Pill className="nav-link-icon" />
                  Medications
                </Link>

                <Link
                  to="/appointments"
                  className={`nav-link ${currentPageName === "Appointments" ? "nav-link--active" : ""
                    }`}
                >
                  <Calendar className="nav-link-icon" />
                  Appointments
                </Link>

                <Link
                  to="/clinics"
                  className={`nav-link ${currentPageName === "Clinics" ? "nav-link--active" : ""
                    }`}
                >
                  <MapPin className="nav-link-icon" />
                  Clinics
                </Link>

                <Link
                  to="/awareness-hub"
                  className={`nav-link ${currentPageName === "AwarenessHub" ? "nav-link--active" : ""
                    }`}
                >
                  <BookOpen className="nav-link-icon" />
                  Awareness Hub
                </Link>
              </>
            )}

            <button className="nav-link nav-link--ghost" onClick={handleLogout}>
              <LogOut className="nav-link-icon" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="menu-icon" />
            ) : (
              <Menu className="menu-icon" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="nav-links nav-links--mobile">
            <Link
              to="/dashboard"
              className={`nav-link nav-link--mobile ${currentPageName === "Dashboard" ? "nav-link--active" : ""
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="nav-link-icon" />
              Dashboard
            </Link>

            {/* Patient-only mobile links */}
            {isPatient && (
              <>
                <Link
                  to="/my-health"
                  className={`nav-link nav-link--mobile ${currentPageName === "MyHealth" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="nav-link-icon" />
                  My Health
                </Link>

                <Link
                  to="/alerts"
                  className={`nav-link nav-link--mobile ${currentPageName === "Alerts" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bell className="nav-link-icon" />
                  Alerts
                </Link>

                <Link
                  to="/medications"
                  className={`nav-link nav-link--mobile ${currentPageName === "Medications" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Pill className="nav-link-icon" />
                  Medications
                </Link>

                <Link
                  to="/appointments"
                  className={`nav-link nav-link--mobile ${currentPageName === "Appointments" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar className="nav-link-icon" />
                  Appointments
                </Link>

                <Link
                  to="/clinics"
                  className={`nav-link nav-link--mobile ${currentPageName === "Clinics" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MapPin className="nav-link-icon" />
                  Clinics
                </Link>

                <Link
                  to="/awareness-hub"
                  className={`nav-link nav-link--mobile ${currentPageName === "AwarenessHub" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="nav-link-icon" />
                  Awareness Hub
                </Link>

                <Link
                  to="/family-tree"
                  className={`nav-link nav-link--mobile ${currentPageName === "FamilyTree" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="nav-link-icon" />
                  Family Tree
                </Link>

                <Link
                  to="/risk-assessment"
                  className={`nav-link nav-link--mobile ${currentPageName === "RiskAssessment" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Activity className="nav-link-icon" />
                  Risk Assessment
                </Link>
              </>
            )}

            {/* Doctor-only mobile links */}
            {isDoctor && (
              <>
                <Link
                  to="/patients"
                  className={`nav-link nav-link--mobile ${currentPageName === "Patients" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="nav-link-icon" />
                  My Patients
                </Link>

                <Link
                  to="/medications"
                  className={`nav-link nav-link--mobile ${currentPageName === "Medications" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Pill className="nav-link-icon" />
                  Medications
                </Link>

                <Link
                  to="/appointments"
                  className={`nav-link nav-link--mobile ${currentPageName === "Appointments" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar className="nav-link-icon" />
                  Appointments
                </Link>

                <Link
                  to="/clinics"
                  className={`nav-link nav-link--mobile ${currentPageName === "Clinics" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MapPin className="nav-link-icon" />
                  Clinics
                </Link>

                <Link
                  to="/awareness-hub"
                  className={`nav-link nav-link--mobile ${currentPageName === "AwarenessHub" ? "nav-link--active" : ""
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="nav-link-icon" />
                  Awareness Hub
                </Link>
              </>
            )}

            <button
              className="nav-link nav-link--mobile nav-link--ghost"
              onClick={handleLogout}
            >
              <LogOut className="nav-link-icon" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="app-main">{children}</main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="footer-col">
            <h3 className="footer-title">
              <Heart className="footer-heart" />
              Sillah (صلة)
            </h3>
            <p className="footer-text">
              Empowering families with hereditary health insights and preventive
              care solutions.
            </p>
            <p className="footer-note">
              {isDoctor ? "Healthcare Provider Portal" : "Patient Portal"}
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitle">Quick Links</h4>
            <div className="footer-links">
              <Link to="/dashboard" className="footer-link">
                Dashboard
              </Link>
              {isPatient && (
                <>
                  <Link to="/family-tree" className="footer-link">
                    Family Tree
                  </Link>
                  <Link to="/risk-assessment" className="footer-link">
                    Risk Assessment
                  </Link>
                </>
              )}
              {isDoctor && (
                <Link to="/patients" className="footer-link">
                  My Patients
                </Link>
              )}
              <Link to="/awareness-hub" className="footer-link">
                Awareness Hub
              </Link>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitle">Support</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">
                Help Center
              </a>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
              <a href="#" className="footer-link">
                Terms of Service
              </a>
              <a href="#" className="footer-link">
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="app-footer-bottom">
          <p>&copy; 2025 Sillah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}