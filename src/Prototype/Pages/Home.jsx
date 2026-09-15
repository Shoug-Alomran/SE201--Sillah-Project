import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Activity,
  Bell,
  BookOpen,
  MapPin,
  Pill,
  UserPlus,
  ClipboardList,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const features = [
  {
    icon: Users,
    title: "Family Tree",
    text: "Record the health history of your parents, siblings, and relatives in one organized place.",
  },
  {
    icon: Activity,
    title: "Hereditary Risk Detection",
    text: "Rule-based analysis spots hereditary cardiac risk patterns across your family history.",
  },
  {
    icon: Bell,
    title: "Personalized Alerts",
    text: "Get timely alerts and recommendations when a potential risk is detected.",
  },
  {
    icon: BookOpen,
    title: "Awareness Hub",
    text: "Learn about heart health, genetic screening, and prevention through trusted educational content.",
  },
  {
    icon: MapPin,
    title: "Clinic Booking",
    text: "Explore clinics and book appointments for preventive care.",
  },
  {
    icon: Pill,
    title: "Medication Tracking",
    text: "Keep track of active medications and stay on top of your treatment plan.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up as a patient or a doctor. Patients can link with their doctor during sign up.",
  },
  {
    icon: ClipboardList,
    title: "Add your family history",
    text: "Add family members and the health conditions they have been diagnosed with.",
  },
  {
    icon: ShieldCheck,
    title: "Act early",
    text: "Review your risk level, follow the recommendations, and book a screening before problems start.",
  },
];

export default function Home() {
  const { currentUser } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="app-shell home-shell">
      {/* Top Navigation */}
      <nav className="top-nav" aria-label="Main navigation">
        <div className="top-nav-inner">
          <Link to="/" className="brand">
            <div className="brand-icon">
              <Heart className="brand-heart" />
            </div>
            <div className="brand-text">
              <div className="brand-title">Sillah</div>
              <div className="brand-subtitle">صلة - Family Health</div>
            </div>
          </Link>

          <div className="home-nav-actions">
            {currentUser ? (
              <Link to="/dashboard" className="nav-link nav-link--active">
                <LayoutDashboard className="nav-link-icon" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link nav-link--active">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="prevention-strip">
          <p className="prevention-strip-text">
            Prevention First: Track risk early, stay informed, and protect your
            family health.
          </p>
        </div>
      </nav>

      <main className="home-page">
        <div className="home-container">
          {/* Hero */}
          <section className="home-hero">
            <div className="brand-icon-large">
              <Heart className="brand-heart-large" />
            </div>
            <p className="home-eyebrow">Preventive Family Health Platform</p>
            <h1 className="home-title">
              Your family's health story, connected.
            </h1>
            <p className="home-lead">
              Sillah (صلة) means <strong>connection</strong>. It helps Saudi
              families record their family health history, understand potential
              hereditary heart health risks, and organize preventive care in one
              place.
            </p>
            <div className="home-cta-row">
              {currentUser ? (
                <Link to="/dashboard" className="home-btn home-btn--primary">
                  Go to Dashboard
                  <ArrowRight className="home-btn-icon" />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="home-btn home-btn--primary">
                    Get Started
                    <ArrowRight className="home-btn-icon" />
                  </Link>
                  <Link to="/login" className="home-btn home-btn--secondary">
                    I already have an account
                  </Link>
                </>
              )}
            </div>
          </section>

          {/* Features */}
          <section className="home-section">
            <h2 className="section-title home-section-title">
              What you can do with Sillah
            </h2>
            <div className="home-features-grid">
              {features.map((feature) => {
                const { icon: Icon, title, text } = feature;
                return (
                  <div key={title} className="home-feature-card">
                    <div className="home-feature-icon">
                      <Icon />
                    </div>
                    <h3 className="home-feature-title">{title}</h3>
                    <p className="home-feature-text">{text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How it works */}
          <section className="home-section">
            <h2 className="section-title home-section-title">How it works</h2>
            <div className="home-steps-grid">
              {steps.map((step, index) => {
                const { icon: Icon, title, text } = step;
                return (
                  <div key={title} className="home-step-card">
                    <div className="home-step-number">{index + 1}</div>
                    <Icon className="home-step-icon" />
                    <h3 className="home-feature-title">{title}</h3>
                    <p className="home-feature-text">{text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Audience */}
          <section className="home-section">
            <h2 className="section-title home-section-title">
              Built for patients and doctors
            </h2>
            <div className="home-audience-grid">
              <div className="home-audience-card">
                <Users className="home-audience-icon" />
                <div>
                  <h3 className="home-feature-title">
                    Patients &amp; Families
                  </h3>
                  <p className="home-feature-text">
                    Manage your family tree, personal health records,
                    medications, and appointments, and see your hereditary risk
                    assessment.
                  </p>
                </div>
              </div>
              <div className="home-audience-card">
                <Stethoscope className="home-audience-icon" />
                <div>
                  <h3 className="home-feature-title">Healthcare Providers</h3>
                  <p className="home-feature-text">
                    Follow your patients, review their risk alerts and health
                    records, and manage bookings from one portal.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing CTA */}
          {!currentUser && (
            <section className="home-closing">
              <h2 className="home-closing-title">
                Start protecting your family today
              </h2>
              <p className="home-closing-text">
                Bring your family history together and take the first step
                toward informed care.
              </p>
              <Link to="/signup" className="home-btn home-btn--light">
                Create a free account
                <ArrowRight className="home-btn-icon" />
              </Link>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer-bottom">
          <p>&copy; {currentYear} Sillah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
