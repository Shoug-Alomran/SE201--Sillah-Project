// src/Prototype/Pages/MyHealth.jsx
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  Plus,
  Edit3,
  Trash2,
  HeartPulse,
  BarChart2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";

export default function MyHealth() {
  const { currentUser, isPatient } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [form, setForm] = useState({
    record_type: "note",
    risk_level: "none",
    notes: "",
    data_input: "",
  });

  useEffect(() => {
    if (!currentUser) return;

    const fetchRecords = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("personal_health_records")
          .select("*")
          .eq("user_id", currentUser.uid)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setRecords(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching health records:", err);
        setError("Unable to load your health records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [currentUser]);

  const resetForm = () => {
    setForm({
      record_type: "note",
      risk_level: "none",
      notes: "",
      data_input: "",
    });
    setEditingRecord(null);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingRecord(record);
    setForm({
      record_type: record.record_type || "note",
      risk_level: record.risk_level || "none",
      notes: record.notes || "",
      data_input: record.data ? JSON.stringify(record.data, null, 2) : "",
    });
    setShowForm(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const parseDataInput = () => {
    if (!form.data_input.trim()) return null;

    try {
      return JSON.parse(form.data_input);
    } catch (err) {
      alert("Invalid JSON in data field. Please check the format.");
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const parsedData = parseDataInput();

      const payload = {
        user_id: currentUser.uid,
        record_type: form.record_type,
        risk_level: form.risk_level || null,
        notes: form.notes || null,
        data: parsedData,
      };

      if (editingRecord) {
        const { error } = await supabase
          .from("personal_health_records")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingRecord.id);

        if (error) throw error;

        setRecords((prev) =>
          prev.map((r) =>
            r.id === editingRecord.id
              ? { ...r, ...payload, updated_at: new Date().toISOString() }
              : r
          )
        );
      } else {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from("personal_health_records")
          .insert({
            ...payload,
            created_at: now,
            updated_at: null,
          })
          .select()
          .single();

        if (error) throw error;

        setRecords((prev) => [data, ...prev]);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving health record:", err);
      if (!String(err).includes("Invalid JSON")) {
        alert("Failed to save record. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this health record? This cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from("personal_health_records")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting health record:", err);
      alert("Failed to delete record. Please try again.");
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskLabel = (risk) => {
    if (risk === "high") return "High Risk";
    if (risk === "moderate") return "Moderate Risk";
    if (risk === "low") return "Low Risk";
    return "No Significant Risk";
  };

  const getRiskClass = (risk) => {
    if (risk === "high") return "risk-high";
    if (risk === "moderate") return "risk-moderate";
    if (risk === "low") return "risk-low";
    return "risk-none";
  };

  const countByRisk = (risk) =>
    records.filter((r) => r.risk_level === risk).length;

  const countByType = (type) =>
    records.filter((r) => r.record_type === type).length;

  if (loading) {
    return (
      <div className="myhealth-page">
        <div className="myhealth-container">
          <header className="myhealth-header">
            <h1 className="myhealth-title">
              <Activity className="title-icon" />
              My Health Overview
            </h1>
            <p className="myhealth-subtitle">
              Loading your health records and risk assessments...
            </p>
          </header>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myhealth-page">
        <div className="myhealth-container">
          <header className="myhealth-header">
            <h1 className="myhealth-title">
              <Activity className="title-icon" />
              My Health Overview
            </h1>
            <p className="myhealth-subtitle">Unable to load your health data</p>
          </header>

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

  return (
    <div className="myhealth-page">
      <div className="myhealth-container">
        {/* Header */}
        <header className="myhealth-header">
          <div>
            <h1 className="myhealth-title">
              <Activity className="title-icon" />
              My Health Overview
            </h1>
            <p className="myhealth-subtitle">
              View your records, risk assessments, and key health events
            </p>
          </div>

          {isPatient && (
            <button onClick={openNewForm} className="add-member-btn">
              <Plus className="btn-icon" />
              Add Health Record
            </button>
          )}
        </header>

        {/* Stats */}
        <div className="statistics-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Total Records</p>
                <p className="stat-value">{records.length}</p>
              </div>
              <ClipboardList
                className="stat-icon"
                style={{ color: "#3b82f6", opacity: 0.2 }}
              />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">High Risk Flags</p>
                <p className="stat-value stat-value-red">
                  {countByRisk("high")}
                </p>
              </div>
              <AlertTriangle
                className="stat-icon"
                style={{ color: "#ef4444", opacity: 0.2 }}
              />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Risk Assessments</p>
                <p className="stat-value stat-value-amber">
                  {countByType("risk_assessment")}
                </p>
              </div>
              <BarChart2
                className="stat-icon"
                style={{ color: "#f59e0b", opacity: 0.2 }}
              />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Clinical Notes</p>
                <p className="stat-value stat-value-green">
                  {countByType("note")}
                </p>
              </div>
              <HeartPulse
                className="stat-icon"
                style={{ color: "#10b981", opacity: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {records.length === 0 ? (
          <div className="empty-state">
            <ClipboardList className="empty-icon" />
            <p className="empty-title">No Health Records Yet</p>
            <p className="empty-text">
              Add your first health record or risk assessment to start tracking
              your journey over time.
            </p>
            {isPatient && (
              <button onClick={openNewForm} className="empty-action-btn">
                <Plus className="empty-action-icon" />
                Add Your First Record
              </button>
            )}
          </div>
        ) : (
          <div className="timeline">
            {records.map((record) => (
              <div key={record.id} className="timeline-item">
                <div className="timeline-marker" />

                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-title">
                        {record.record_type === "risk_assessment"
                          ? "Risk Assessment"
                          : record.record_type === "diagnosis"
                          ? "Diagnosis"
                          : record.record_type === "vital"
                          ? "Vital Record"
                          : "Health Note"}
                      </h3>
                      <p className="timeline-subtitle">
                        Created: {formatDateTime(record.created_at)}
                        {record.updated_at && (
                          <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>
                            · Updated: {formatDateTime(record.updated_at)}
                          </span>
                        )}
                      </p>
                    </div>

                    {record.risk_level && record.risk_level !== "none" && (
                      <span
                        className={`risk-badge ${getRiskClass(
                          record.risk_level
                        )}`}
                      >
                        {getRiskLabel(record.risk_level)}
                      </span>
                    )}
                  </div>

                  <div className="timeline-body">
                    {record.notes && (
                      <p className="timeline-notes">{record.notes}</p>
                    )}

                    {record.data && (
                      <div className="timeline-data-box">
                        <p className="timeline-data-label">Details</p>
                        <pre className="timeline-data-pre">
                          {JSON.stringify(record.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  {isPatient && (
                    <div className="timeline-footer">
                      <button
                        className="family-action-btn"
                        onClick={() => openEditForm(record)}
                      >
                        <Edit3 className="family-action-icon" />
                        Edit
                      </button>
                      <button
                        className="family-action-btn delete"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="family-action-icon" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingRecord ? "Edit Health Record" : "Add Health Record"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-content">
                  <div className="form-grid-two">
                    <div className="form-field">
                      <label className="form-label">Record Type</label>
                      <select
                        className="form-input"
                        value={form.record_type}
                        onChange={(e) =>
                          handleFormChange("record_type", e.target.value)
                        }
                      >
                        <option value="note">Health Note</option>
                        <option value="risk_assessment">
                          Risk Assessment
                        </option>
                        <option value="diagnosis">Diagnosis</option>
                        <option value="vital">Vital Record</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Risk Level</label>
                      <select
                        className="form-input"
                        value={form.risk_level}
                        onChange={(e) =>
                          handleFormChange("risk_level", e.target.value)
                        }
                      >
                        <option value="none">None / Not Applicable</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-input form-textarea"
                      rows="3"
                      value={form.notes}
                      onChange={(e) =>
                        handleFormChange("notes", e.target.value)
                      }
                      placeholder="Summary of this record, diagnosis, or reasoning behind the risk level."
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Structured Data (JSON, optional)
                    </label>
                    <textarea
                      className="form-input form-textarea"
                      rows="6"
                      value={form.data_input}
                      onChange={(e) =>
                        handleFormChange("data_input", e.target.value)
                      }
                      placeholder={`Example:
{
  "blood_pressure": "120/80",
  "heart_rate": 72,
  "bmi": 23.4,
  "symptoms": ["fatigue", "headache"]
}`}
                    />
                    <p className="helper-text">
                      Optional. Use JSON to store vitals, metrics, or detailed
                      structured data.
                    </p>
                  </div>
                </div>

                <div className="form-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="cancel-btn"
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-btn">
                    {editingRecord ? "Save Changes" : "Add Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
