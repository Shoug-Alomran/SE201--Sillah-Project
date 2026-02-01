// src/Prototype/Pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  User,
  AlertCircle,
  Phone,
  Stethoscope,
  Users,
} from "lucide-react";
import { supabase } from "../../supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("patient");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch doctors from Supabase
  useEffect(() => {
    async function fetchDoctors() {
      if (userType !== "patient") {
        setDoctors([]);
        return;
      }

      try {
        setLoadingDoctors(true);

        const { data, error } = await supabase
          .from("users")
          .select("uid, full_name, email")
          .eq("user_type", "doctor");

        if (error) throw error;

        setDoctors(data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    }

    fetchDoctors();
  }, [userType]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (userType === "patient" && !selectedDoctor) {
      return setError("Please select a doctor");
    }

    try {
      setError("");
      setLoading(true);

      // 1️⃣ Create user in Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (authError) throw authError;

      const uid = authData.user.id;

      // 2️⃣ Insert user into "users" table
      const { error: insertError } = await supabase.from("users").insert({
        uid,
        email,
        full_name: fullName,
        phone: phoneNumber || null,
        user_type: userType,
        risk_level: null,
        gender: null,
        birthdate: null,
        address: null,
        age: null,
        blood_type: null,
        // If patient, store their doctor
        assigned_doctor: userType === "patient" ? selectedDoctor : null,
      });

      if (insertError) throw insertError;

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to create account. Email may already be in use.");
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-icon-large">
              <Heart className="brand-heart-large" />
            </div>
            <h1 className="auth-title">Join Sillah (صلة)</h1>
            <p className="auth-subtitle">Create your account</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* User Type Selection */}
            <div className="form-field">
              <label className="form-label">
                <Users className="form-label-icon" />
                I am a
              </label>
              <div className="user-type-selector">
                <button
                  type="button"
                  className={`user-type-btn ${
                    userType === "patient" ? "active" : ""
                  }`}
                  onClick={() => setUserType("patient")}
                >
                  <Users className="user-type-icon" />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  className={`user-type-btn ${
                    userType === "doctor" ? "active" : ""
                  }`}
                  onClick={() => setUserType("doctor")}
                >
                  <Stethoscope className="user-type-icon" />
                  <span>Doctor</span>
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="fullName" className="form-label">
                <User className="form-label-icon" />
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-label">
                <Mail className="form-label-icon" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="phoneNumber" className="form-label">
                <Phone className="form-label-icon" />
                Phone Number (Optional)
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-input"
                placeholder="+966 50 123 4567"
              />
            </div>

            {/* Doctor Selection (Only for Patients) */}
            {userType === "patient" && (
              <div className="form-field">
                <label htmlFor="doctor" className="form-label">
                  <Stethoscope className="form-label-icon" />
                  Select Your Doctor
                </label>

                {loadingDoctors ? (
                  <p className="form-input" style={{ color: "#6b7280" }}>
                    Loading available doctors...
                  </p>
                ) : doctors.length === 0 ? (
                  <div className="doctor-notice">
                    <AlertCircle
                      className="form-label-icon"
                      style={{ color: "#f59e0b" }}
                    />
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      No doctors available yet. You can still sign up and select
                      a doctor later.
                    </p>
                  </div>
                ) : (
                  <select
                    id="doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.uid} value={doctor.uid}>
                        {doctor.full_name} - {doctor.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="password" className="form-label">
                <Lock className="form-label-icon" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock className="form-label-icon" />
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                (userType === "patient" &&
                  doctors.length > 0 &&
                  !selectedDoctor)
              }
              className="auth-submit-btn"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
