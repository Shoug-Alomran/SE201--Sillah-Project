import React, { useState, useEffect } from "react";
import { AlertTriangle, Heart, Users, Info, ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function RiskAssessment() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch family members from Firestore
  useEffect(() => {
    async function fetchFamilyMembers() {
      if (!currentUser) {
        setError("Please log in to view risk assessment");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const membersRef = collection(db, "family_members");
        const q = query(membersRef, where("user_id", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const familyData = [];
        querySnapshot.forEach((doc) => {
          familyData.push({ id: doc.id, ...doc.data() });
        });
        
        setMembers(familyData);
        setError(null);
      } catch (err) {
        console.error("Error fetching family members:", err);
        setError("Unable to load family data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchFamilyMembers();
  }, [currentUser]);

  // Helper functions to analyze health data - FIXED TO USE CORRECT FIELD NAMES
  const hasSCD = (member) => {
    // Check if diagnosed with SCD
    const healthStatus = member.health_status?.toLowerCase() || "";
    const medicalNotes = member.medical_notes?.toLowerCase() || "";
    
    return (
      healthStatus === "diagnosed" ||
      healthStatus.includes("scd") ||
      healthStatus.includes("sickle cell") ||
      medicalNotes.includes("scd") ||
      medicalNotes.includes("sickle cell")
    );
  };

  const isAtRisk = (member) => {
    // Check if at risk
    const healthStatus = member.health_status?.toLowerCase() || "";
    return healthStatus === "at_risk" || healthStatus === "at risk";
  };

  const isHealthy = (member) => {
    // Check if healthy/no condition
    const healthStatus = member.health_status?.toLowerCase() || "";
    return healthStatus === "healthy" || healthStatus === "no condition";
  };

  const getDiagnosisAge = (member) => {
    return member.diagnosis_age || null;
  };

  // Calculate statistics
  const scdMembers = members.filter((m) => hasSCD(m));
  const earlyOnsetMembers = scdMembers.filter((m) => {
    const age = getDiagnosisAge(m);
    return age !== null && age < 50;
  });

  const atRiskMembers = members.filter((m) => isAtRisk(m));
  const healthyMembers = members.filter((m) => isHealthy(m));

  // Calculate overall risk level
  const calculateRiskLevel = () => {
    const earlyOnsetCount = earlyOnsetMembers.length;
    const scdCount = scdMembers.length;
    const atRiskCount = atRiskMembers.length;
    const totalMembers = members.length;

    // Critical: Multiple diagnosed cases or early onset
    if (scdCount >= 2 || earlyOnsetCount >= 1) {
      return {
        level: "High Risk",
        color: "red",
        message: `${scdCount} family member(s) diagnosed with SCD. ${earlyOnsetCount > 0 ? 'Including early-onset cases. ' : ''}Immediate screening recommended.`,
        severity: "critical",
      };
    }

    // Moderate: One diagnosed case or multiple at-risk
    if (scdCount === 1 || atRiskCount >= 2) {
      return {
        level: "Moderate Risk",
        color: "amber",
        message: `${scdCount === 1 ? '1 diagnosed case and ' : ''}${atRiskCount} family member(s) at risk. Regular monitoring advised.`,
        severity: "moderate",
      };
    }

    // Low-Moderate: One at-risk member
    if (atRiskCount === 1) {
      return {
        level: "Low-Moderate Risk",
        color: "yellow",
        message: "1 family member at risk. Stay vigilant with regular checkups.",
        severity: "low-moderate",
      };
    }

    // Low: No diagnosed or at-risk members
    return {
      level: "Low Risk",
      color: "green",
      message: "No immediate hereditary risk detected. Continue healthy lifestyle habits.",
      severity: "low",
    };
  };

  const risk = calculateRiskLevel();

  // Generate personalized recommendations
  const getRecommendations = () => {
    const base = [];

    if (risk.severity === "critical") {
      base.push(
        "Schedule a comprehensive cardiac screening within the next 2 weeks",
        "Consult with a genetic counselor for family planning guidance",
        "Begin regular cardiovascular health monitoring (every 3-6 months)",
        "Share your complete family health history with all healthcare providers",
        "Consider genetic testing for all immediate family members"
      );
    } else if (risk.severity === "moderate") {
      base.push(
        "Schedule a preventive cardiac screening within the next 3 months",
        "Discuss family history in detail with your primary care physician",
        "Monitor for early warning signs (chest pain, shortness of breath)",
        "Maintain a heart-healthy diet and regular exercise routine",
        "Keep detailed records of family health history"
      );
    } else if (risk.severity === "low-moderate") {
      base.push(
        "Schedule annual cardiac checkups",
        "Track and update family health history regularly",
        "Maintain healthy lifestyle habits (diet, exercise, no smoking)",
        "Stay informed about SCD symptoms and warning signs",
        "Consider preventive genetic counseling if planning a family"
      );
    } else {
      base.push(
        "Continue with routine annual health checkups",
        "Maintain a healthy lifestyle with balanced diet and exercise",
        "Keep family health history updated in the Sillah app",
        "Stay educated about hereditary health conditions",
        "Monitor any new symptoms and report to your doctor"
      );
    }

    return base;
  };

  const recommendations = getRecommendations();

  // Calculate risk percentage for visualization
  const getRiskPercentage = () => {
    if (members.length === 0) return 0;
    
    let score = 0;
    const maxScore = members.length * 100;
    
    // Diagnosed members contribute most to risk
    score += scdMembers.length * 50;
    
    // Early onset is especially risky
    score += earlyOnsetMembers.length * 30;
    
    // At-risk members contribute moderately
    score += atRiskMembers.length * 20;
    
    return Math.min(Math.round((score / maxScore) * 100), 100);
  };

  const riskPercentage = getRiskPercentage();

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="risk-assessment-page">
        <div className="risk-assessment-container">
          <div className="risk-assessment-header">
            <h1 className="risk-assessment-title">
              <Heart className="title-icon" />
              Risk Assessment
            </h1>
            <p className="risk-assessment-subtitle">
              Hereditary health risk analysis
            </p>
          </div>
          <div className="empty-state">
            <Heart className="empty-icon" style={{ animation: "pulse 2s infinite" }} />
            <p className="empty-title">Analyzing Family Health Data...</p>
            <p className="empty-text">
              Please wait while we calculate your hereditary risk assessment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- Error State ----
  if (error) {
    return (
      <div className="risk-assessment-page">
        <div className="risk-assessment-container">
          <div className="risk-assessment-header">
            <h1 className="risk-assessment-title">
              <Heart className="title-icon" />
              Risk Assessment
            </h1>
            <p className="risk-assessment-subtitle">
              Hereditary health risk analysis
            </p>
          </div>
          <div className="empty-state">
            <AlertTriangle className="empty-icon" style={{ color: "#ef4444" }} />
            <p className="empty-title">{error}</p>
            <p className="empty-text">
              Please check your connection or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="empty-action-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Empty State (No Family Members) ----
  if (members.length === 0) {
    return (
      <div className="risk-assessment-page">
        <div className="risk-assessment-container">
          <div className="risk-assessment-header">
            <h1 className="risk-assessment-title">
              <Heart className="title-icon" />
              Risk Assessment
            </h1>
            <p className="risk-assessment-subtitle">
              Hereditary health risk analysis
            </p>
          </div>
          <div className="empty-state">
            <Users className="empty-icon" />
            <p className="empty-title">No Family Members Added Yet</p>
            <p className="empty-text">
              Add family members to your family tree to generate a personalized risk assessment.
            </p>
            <button
              onClick={() => navigate("/family-tree")}
              className="empty-action-btn"
            >
              <Users className="empty-action-icon" />
              Add Family Members
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Main UI ----
  return (
    <div className="risk-assessment-page">
      <div className="risk-assessment-container">
        {/* Header */}
        <div className="risk-assessment-header">
          <h1 className="risk-assessment-title">
            <Heart className="title-icon" />
            Risk Assessment
          </h1>
          <p className="risk-assessment-subtitle">
            Based on {members.length} family member{members.length !== 1 ? "s" : ""} in your family tree
          </p>
        </div>

        {/* Risk Level Card */}
        <div className={`risk-level-card risk-border-${risk.color}`}>
          <div className="risk-level-header">
            <h2 className="risk-level-title">Overall Risk Level</h2>
            <span className={`risk-level-badge badge-${risk.color}`}>
              {risk.level}
            </span>
          </div>
          <div className="risk-level-body">
            {/* Risk Message */}
            <div className={`risk-message-box message-${risk.color}`}>
              <p className="risk-message">
                <Info className="message-icon" />
                {risk.message}
              </p>
            </div>

            {/* Risk Percentage Indicator */}
            <div className="risk-percentage-box">
              <div className="risk-percentage-header">
                <span className="risk-percentage-label">Risk Score</span>
                <span className="risk-percentage-value">{riskPercentage}%</span>
              </div>
              <div className="risk-percentage-bar">
                <div
                  className={`risk-percentage-fill bg-${risk.color}`}
                  style={{ width: `${riskPercentage}%` }}
                />
              </div>
            </div>

            {/* Critical Alert for High Risk */}
            {risk.severity === "critical" && (
              <div className="critical-alert">
                <h4 className="critical-alert-title">
                  <AlertTriangle className="alert-icon" />
                  Critical Risk Factors Identified
                </h4>
                <p className="critical-alert-text">
                  {scdMembers.length} family member
                  {scdMembers.length > 1 ? "s" : ""} diagnosed with 
                  Sickle Cell Disease. {earlyOnsetMembers.length > 0 && `Including ${earlyOnsetMembers.length} early-onset case(s).`} Immediate medical consultation recommended.
                </p>
                <button
                  className="critical-alert-btn"
                  onClick={() => navigate("/clinics")}
                >
                  Find Nearby Clinics
                  <ArrowRight className="btn-arrow-icon" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="risk-stats-grid">
          <div className="risk-stat-card">
            <div className="risk-stat-content">
              <div className="risk-stat-info">
                <p className="risk-stat-label">Total Family Members</p>
                <p className="risk-stat-value">{members.length}</p>
              </div>
              <Users
                className="risk-stat-icon"
                style={{ color: "#3b82f6", opacity: 0.2 }}
              />
            </div>
          </div>

          <div className="risk-stat-card">
            <div className="risk-stat-content">
              <div className="risk-stat-info">
                <p className="risk-stat-label">SCD Cases</p>
                <p className="risk-stat-value">{scdMembers.length}</p>
              </div>
              <AlertTriangle
                className="risk-stat-icon"
                style={{ color: "#ef4444", opacity: 0.2 }}
              />
            </div>
          </div>

          <div className="risk-stat-card">
            <div className="risk-stat-content">
              <div className="risk-stat-info">
                <p className="risk-stat-label">Early Onset (&lt;50)</p>
                <p className="risk-stat-value">{earlyOnsetMembers.length}</p>
              </div>
              <Heart
                className="risk-stat-icon"
                style={{ color: "#a855f7", opacity: 0.2 }}
              />
            </div>
          </div>

          <div className="risk-stat-card">
            <div className="risk-stat-content">
              <div className="risk-stat-info">
                <p className="risk-stat-label">At Risk</p>
                <p className="risk-stat-value">{atRiskMembers.length}</p>
              </div>
              <TrendingUp
                className="risk-stat-icon"
                style={{ color: "#f59e0b", opacity: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-card">
          <h2 className="recommendations-title">Personalized Recommendations</h2>
          <div className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="recommendation-item">
                <div className="recommendation-number">{idx + 1}</div>
                <p className="recommendation-text">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Members */}
        {(earlyOnsetMembers.length > 0 || scdMembers.length > 0) && (
          <div className="high-risk-members-card">
            <h2 className="high-risk-title">Family Members with SCD</h2>
            <div className="high-risk-members-list">
              {scdMembers.map((member) => (
                <div key={member.id} className="high-risk-member-item">
                  <div className="high-risk-member-info">
                    <div>
                      <h4 className="high-risk-member-name">
                        {member.name || "Unknown"}
                      </h4>
                      <p className="high-risk-member-relation">
                        {member.relationship || "Family Member"} • Age {member.age}
                      </p>
                    </div>
                    <div className="high-risk-member-diagnosis">
                      <p className="diagnosis-age">
                        {getDiagnosisAge(member) ? `Diagnosed at age ${getDiagnosisAge(member)}` : 'Diagnosed'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* At Risk Members Section */}
        {atRiskMembers.length > 0 && (
          <div className="high-risk-members-card">
            <h2 className="high-risk-title">At-Risk Family Members</h2>
            <div className="high-risk-members-list">
              {atRiskMembers.map((member) => (
                <div key={member.id} className="high-risk-member-item">
                  <div className="high-risk-member-info">
                    <div>
                      <h4 className="high-risk-member-name">
                        {member.name || "Unknown"}
                      </h4>
                      <p className="high-risk-member-relation">
                        {member.relationship || "Family Member"} • Age {member.age}
                      </p>
                    </div>
                    <div className="high-risk-member-diagnosis">
                      <span className="diagnosis-age" style={{ color: "#f59e0b", fontWeight: "600" }}>
                        At Risk - Monitoring Recommended
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="risk-actions">
          <button
            onClick={() => navigate("/family-tree")}
            className="risk-action-btn btn-secondary"
          >
            <Users className="risk-action-icon" />
            Update Family Tree
          </button>
          
          {risk.severity !== "low" && (
            <button
              onClick={() => navigate("/clinics")}
              className="risk-action-btn btn-primary"
            >
              <Heart className="risk-action-icon" />
              Find Healthcare Providers
            </button>
          )}
        </div>
      </div>
    </div>
  );
}