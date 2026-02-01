// src/Prototype/Pages/FamilyTree.jsx
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  Heart,
  Activity,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";

export default function FamilyTree() {
  const { currentUser, isPatient } = useAuth();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [form, setForm] = useState({
    name: "",
    relationship: "",
    age: "",
    health_status: "healthy",
    conditions_input: "",
    diagnosis_age: "",
    medical_notes: "",
  });

  useEffect(() => {
    if (!currentUser) return;

    const fetchFamilyMembers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("family_members")
          .select("*")
          .eq("user_id", currentUser.uid)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setFamilyMembers(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching family members:", err);
        setError("Unable to load family history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [currentUser]);

  const resetForm = () => {
    setForm({
      name: "",
      relationship: "",
      age: "",
      health_status: "healthy",
      conditions_input: "",
      diagnosis_age: "",
      medical_notes: "",
    });
    setEditingMember(null);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name || "",
      relationship: member.relationship || "",
      age: member.age?.toString() || "",
      health_status: member.health_status || "healthy",
      conditions_input: member.conditions || "", // stored as text
      diagnosis_age: member.diagnosis_age?.toString() || "",
      medical_notes: member.medical_notes || "",
    });
    setShowForm(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!form.name || !form.relationship || !form.age) {
      alert("Name, relationship, and age are required.");
      return;
    }

    try {
      const conditionsText = form.conditions_input
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .join(", ");

      const payload = {
        user_id: currentUser.uid,
        name: form.name,
        relationship: form.relationship,
        age: parseInt(form.age, 10) || null,
        health_status: form.health_status,
        conditions: conditionsText || null,
        diagnosis_age: form.diagnosis_age
          ? parseInt(form.diagnosis_age, 10)
          : null,
        medical_notes: form.medical_notes || null,
      };

      if (editingMember) {
        const { error } = await supabase
          .from("family_members")
          .update(payload)
          .eq("id", editingMember.id);

        if (error) throw error;

        setFamilyMembers((prev) =>
          prev.map((m) =>
            m.id === editingMember.id ? { ...m, ...payload } : m
          )
        );
      } else {
        const { data, error } = await supabase
          .from("family_members")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setFamilyMembers((prev) => [data, ...prev]);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving family member:", err);
      alert("Failed to save family member. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this family member from your history?")) return;

    try {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting family member:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  const getStatusLabel = (status) => {
    if (status === "diagnosed") return "Diagnosed";
    if (status === "at-risk") return "At Risk";
    return "Healthy";
  };

  const getStatusClass = (status) => {
    if (status === "diagnosed") return "status-diagnosed";
    if (status === "at-risk") return "status-at-risk";
    return "status-healthy";
  };

  const countByStatus = (status) =>
    familyMembers.filter((m) => m.health_status === status).length;

  if (loading) {
    return (
      <div className="family-page">
        <div className="family-container">
          <header className="family-header">
            <h1 className="family-title">
              <Users className="title-icon" />
              Family Health History
            </h1>
            <p className="family-subtitle">Loading your family records...</p>
          </header>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="family-page">
        <div className="family-container">
          <header className="family-header">
            <h1 className="family-title">
              <Users className="title-icon" />
              Family Health History
            </h1>
            <p className="family-subtitle">Unable to load family history</p>
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
    <div className="family-page">
      <div className="family-container">
        {/* Header */}
        <header className="family-header">
          <div>
            <h1 className="family-title">
              <Users className="title-icon" />
              Family Health History
            </h1>
            <p className="family-subtitle">
              Track hereditary risks and family medical patterns
            </p>
          </div>

          {isPatient && (
            <button onClick={openNewForm} className="add-member-btn">
              <Plus className="btn-icon" />
              Add Family Member
            </button>
          )}
        </header>

        {/* Stats */}
        <div className="statistics-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Total Family Members</p>
                <p className="stat-value">{familyMembers.length}</p>
              </div>
              <Users className="stat-icon" style={{ color: "#3b82f6", opacity: 0.2 }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Diagnosed Conditions</p>
                <p className="stat-value stat-value-red">
                  {countByStatus("diagnosed")}
                </p>
              </div>
              <Heart className="stat-icon" style={{ color: "#ef4444", opacity: 0.2 }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">At Risk</p>
                <p className="stat-value stat-value-amber">
                  {countByStatus("at-risk")}
                </p>
              </div>
              <Activity
                className="stat-icon"
                style={{ color: "#f59e0b", opacity: 0.2 }}
              />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">No Known Conditions</p>
                <p className="stat-value stat-value-green">
                  {countByStatus("healthy")}
                </p>
              </div>
              <Heart
                className="stat-icon"
                style={{ color: "#10b981", opacity: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {familyMembers.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <p className="empty-title">No Family Members Added</p>
            <p className="empty-text">
              Start building your family health tree to better understand hereditary
              risks and patterns across generations.
            </p>
            {isPatient && (
              <button onClick={openNewForm} className="empty-action-btn">
                <Plus className="empty-action-icon" />
                Add First Family Member
              </button>
            )}
          </div>
        ) : (
          <div className="family-grid">
            {familyMembers.map((member) => (
              <div key={member.id} className="family-card">
                <div className="family-card-header">
                  <div>
                    <h3 className="family-name">{member.name}</h3>
                    <p className="family-relationship">{member.relationship}</p>
                  </div>

                  <span
                    className={`family-status-badge ${getStatusClass(
                      member.health_status
                    )}`}
                  >
                    {getStatusLabel(member.health_status)}
                  </span>
                </div>

                <div className="family-card-body">
                  <p className="family-detail">
                    <span className="family-detail-label">Age:</span>{" "}
                    {member.age ?? "N/A"}
                  </p>

                  {member.conditions && (
                    <p className="family-detail">
                      <span className="family-detail-label">Conditions:</span>{" "}
                      {member.conditions}
                    </p>
                  )}

                  {member.diagnosis_age && (
                    <p className="family-detail">
                      <span className="family-detail-label">Diagnosis Age:</span>{" "}
                      {member.diagnosis_age}
                    </p>
                  )}

                  {member.medical_notes && (
                    <p className="family-notes">
                      <span className="family-detail-label">Notes:</span>{" "}
                      {member.medical_notes}
                    </p>
                  )}
                </div>

                {isPatient && (
                  <div className="family-card-footer">
                    <button
                      className="family-action-btn"
                      onClick={() => openEditForm(member)}
                    >
                      <Edit3 className="family-action-icon" />
                      Edit
                    </button>
                    <button
                      className="family-action-btn delete"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="family-action-icon" />
                      Remove
                    </button>
                  </div>
                )}
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
                  {editingMember ? "Edit Family Member" : "Add Family Member"}
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
                  <div className="form-field">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={(e) =>
                        handleFormChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Relationship *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.relationship}
                      onChange={(e) =>
                        handleFormChange("relationship", e.target.value)
                      }
                      placeholder="e.g., Mother, Brother, Child"
                      required
                    />
                  </div>

                  <div className="form-grid-two">
                    <div className="form-field">
                      <label className="form-label">Age *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={form.age}
                        onChange={(e) =>
                          handleFormChange("age", e.target.value)
                        }
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Health Status</label>
                      <select
                        className="form-input"
                        value={form.health_status}
                        onChange={(e) =>
                          handleFormChange("health_status", e.target.value)
                        }
                      >
                        <option value="healthy">Healthy</option>
                        <option value="at-risk">At Risk</option>
                        <option value="diagnosed">Diagnosed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Conditions (comma separated)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.conditions_input}
                      onChange={(e) =>
                        handleFormChange("conditions_input", e.target.value)
                      }
                      placeholder="e.g., Diabetes, Heart disease, Cancer"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Diagnosis Age (optional)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={form.diagnosis_age}
                      onChange={(e) =>
                        handleFormChange("diagnosis_age", e.target.value)
                      }
                      min="0"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Medical Notes (optional)
                    </label>
                    <textarea
                      className="form-input form-textarea"
                      rows="3"
                      value={form.medical_notes}
                      onChange={(e) =>
                        handleFormChange("medical_notes", e.target.value)
                      }
                      placeholder="Add any relevant details about their diagnosis, treatment, or progression."
                    />
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
                    {editingMember ? "Save Changes" : "Add Member"}
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
