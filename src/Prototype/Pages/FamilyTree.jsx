import React, { useState, useEffect } from "react";
import { Users, Plus, Search, Edit, Trash2, Heart, AlertCircle, Activity } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function FamilyTree() {
  const { currentUser } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    age: "",
    health_status: "healthy",
    conditions: [],
    diagnosis_age: "",
    medical_notes: ""
  });

  const hereditaryConditions = [
    "Sickle Cell Disease",
    "Type 2 Diabetes",
    "High Cholesterol",
    "Hypertension (High Blood Pressure)",
    "Heart Disease",
    "Breast Cancer",
    "Colon Cancer",
    "Alzheimer's Disease",
    "Asthma",
    "Stroke",
    "Obesity",
    "Osteoporosis",
    "Mental Health Conditions"
  ];

  useEffect(() => {
    fetchFamilyMembers();
  }, [currentUser]);

  async function fetchFamilyMembers() {
    if (!currentUser) {
      setError("Please log in to view family members");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const membersRef = collection(db, "family_members");
      const q = query(membersRef, where("user_id", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const members = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });

      setFamilyMembers(members);
      setError(null);
    } catch (err) {
      console.error("Error fetching family members:", err);
      setError("Unable to load family members");
    } finally {
      setLoading(false);
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      const newMember = {
        user_id: currentUser.uid,
        name: formData.name,
        relationship: formData.relationship,
        age: parseInt(formData.age),
        health_status: formData.health_status,
        conditions: formData.conditions,
        diagnosis_age: formData.diagnosis_age ? parseInt(formData.diagnosis_age) : null,
        medical_notes: formData.medical_notes,
        created_at: new Date().toISOString()
      };

      if (editingMember) {
        await updateDoc(doc(db, "family_members", editingMember.id), newMember);
        setFamilyMembers(familyMembers.map(m => 
          m.id === editingMember.id ? { ...newMember, id: editingMember.id } : m
        ));
        alert("Family member updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "family_members"), newMember);
        setFamilyMembers([...familyMembers, { id: docRef.id, ...newMember }]);
        alert("Family member added successfully!");
      }

      setFormData({
        name: "",
        relationship: "",
        age: "",
        health_status: "healthy",
        conditions: [],
        diagnosis_age: "",
        medical_notes: ""
      });
      setShowAddModal(false);
      setEditingMember(null);
    } catch (err) {
      console.error("Error saving family member:", err);
      alert("Failed to save family member");
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      age: member.age.toString(),
      health_status: member.health_status,
      conditions: member.conditions || [],
      diagnosis_age: member.diagnosis_age ? member.diagnosis_age.toString() : "",
      medical_notes: member.medical_notes || ""
    });
    setShowAddModal(true);
  };

  const handleDelete = async (memberId) => {
    if (!confirm("Are you sure you want to delete this family member?")) return;

    try {
      await deleteDoc(doc(db, "family_members", memberId));
      setFamilyMembers(familyMembers.filter(m => m.id !== memberId));
      alert("Family member deleted successfully!");
    } catch (err) {
      console.error("Error deleting family member:", err);
      alert("Failed to delete family member");
    }
  };

  const handleConditionToggle = (condition) => {
    if (formData.conditions.includes(condition)) {
      setFormData({
        ...formData,
        conditions: formData.conditions.filter(c => c !== condition)
      });
    } else {
      setFormData({
        ...formData,
        conditions: [...formData.conditions, condition]
      });
    }
  };

  const filteredMembers = familyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="family-tree-page">
        <div className="family-tree-container">
          <h1 className="family-tree-title">Family Health Tree</h1>
          <p>Loading family members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="family-tree-page">
      <div className="family-tree-container">
        <header className="family-tree-header">
          <div>
            <h1 className="family-tree-title">Family Health Tree</h1>
            <p className="family-tree-subtitle">Manage your family's health history</p>
          </div>
          <button
            onClick={() => {
              setEditingMember(null);
              setFormData({
                name: "",
                relationship: "",
                age: "",
                health_status: "healthy",
                conditions: [],
                diagnosis_age: "",
                medical_notes: ""
              });
              setShowAddModal(true);
            }}
            className="add-member-btn"
          >
            <Plus className="btn-icon" />
            Add Family Member
          </button>
        </header>

        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search family members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {familyMembers.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <p className="empty-title">No Family Members Added Yet</p>
            <p className="empty-text">Start building your family health tree by adding family members.</p>
            <button onClick={() => setShowAddModal(true)} className="empty-action-btn">
              <Plus className="empty-action-icon" />
              Add Your First Family Member
            </button>
          </div>
        ) : (
          <div className="family-members-grid">
            {filteredMembers.map((member) => (
              <div key={member.id} className="family-member-card-new">
                <div className="family-card-header-new">
                  <div className="family-card-header-left">
                    <h3 className="family-member-name-new">{member.name}</h3>
                    <p className="family-member-relationship-new">{member.relationship}</p>
                  </div>
                  <div className="family-card-header-right">
                    <button 
                      onClick={() => handleEdit(member)} 
                      className="family-edit-btn-new" 
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)} 
                      className="family-delete-btn-new" 
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="family-card-content-new">
                  <p className="family-member-age-new">
                    <strong>Age:</strong> {member.age} years
                  </p>

                  <div className="family-health-status-row-new">
                    <strong>Health Status:</strong>
                    <span
                      className={`family-health-badge-new ${
                        member.health_status === "healthy" ? "badge-healthy" :
                        member.health_status === "at_risk" ? "badge-at-risk" :
                        "badge-diagnosed"
                      }`}
                    >
                      {member.health_status === "healthy" && <Heart size={14} />}
                      {member.health_status === "at_risk" && <AlertCircle size={14} />}
                      {member.health_status === "diagnosed" && <Activity size={14} />}
                      <span>
                        {member.health_status === "healthy" ? "No Condition" :
                         member.health_status === "at_risk" ? "At Risk" : "Has Condition(s)"}
                      </span>
                    </span>
                  </div>

                  {member.conditions && member.conditions.length > 0 && (
                    <div className="family-conditions-section-new">
                      <strong>Conditions:</strong>
                      <div className="family-conditions-list-new">
                        {member.conditions.map((condition, index) => (
                          <span key={index} className="family-condition-tag-new">{condition}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.diagnosis_age && (
                    <p className="family-diagnosis-age-new">
                      <strong>Diagnosed at:</strong> {member.diagnosis_age} years
                    </p>
                  )}

                  {member.medical_notes && (
                    <div className="family-notes-section-new">
                      <strong>Medical Notes:</strong>
                      <p className="family-notes-text-new">{member.medical_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMember ? "Edit Family Member" : "Add Family Member"}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close">×</button>
            </div>

            <form onSubmit={handleAddMember} className="modal-body">
              <div className="form-content">
                <div className="form-field">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="relationship" className="form-label">Relationship *</label>
                  <select
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Cousin">Cousin</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="age" className="form-label">Age *</label>
                  <input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="health_status" className="form-label">Health Status *</label>
                  <select
                    id="health_status"
                    value={formData.health_status}
                    onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="healthy">No Condition</option>
                    <option value="at_risk">At Risk</option>
                    <option value="diagnosed">Has Hereditary Condition(s)</option>
                  </select>
                </div>

                {formData.health_status === "diagnosed" && (
                  <>
                    <div className="form-field">
                      <label className="form-label">Select Conditions *</label>
                      <div className="conditions-checkbox-grid">
                        {hereditaryConditions.map((condition) => (
                          <label key={condition} className="condition-checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.conditions.includes(condition)}
                              onChange={() => handleConditionToggle(condition)}
                            />
                            <span>{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="diagnosis_age" className="form-label">Age at Diagnosis</label>
                      <input
                        id="diagnosis_age"
                        type="number"
                        value={formData.diagnosis_age}
                        onChange={(e) => setFormData({ ...formData, diagnosis_age: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                <div className="form-field">
                  <label htmlFor="medical_notes" className="form-label">Medical Notes</label>
                  <textarea
                    id="medical_notes"
                    value={formData.medical_notes}
                    onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                    className="form-input form-textarea"
                    rows="3"
                    placeholder="Any additional medical information..."
                  />
                </div>
              </div>

              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="cancel-btn"
                  style={{ padding: "0.75rem 1.5rem", borderRadius: "0.5rem" }}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}