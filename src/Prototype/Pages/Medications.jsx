import React, { useState, useEffect } from "react";
import { Pill, Plus, Clock, Calendar, Edit, Trash2, Bell, Stethoscope, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Medications() {
  const { currentUser, isDoctor, isPatient } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  // Patients use "patient" view, doctors use "doctor" view - no toggling
  const viewMode = isDoctor ? "doctor" : "patient";

  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "once_daily",
    times_per_day: 1,
    route: "oral",
    administration_times: ["09:00"],
    start_date: "",
    end_date: "",
    refill_date: "",
    instructions: "",
    side_effects: "",
    is_active: true,
    // Doctor prescription fields
    prescribed_by: "",
    prescribed_for_patient: "",
    diagnosis: "",
    duration_days: ""
  });

  useEffect(() => {
    fetchMedications();
  }, [currentUser, viewMode]);

  async function fetchMedications() {
    if (!currentUser) {
      setError("Please log in to view medications");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const medicationsRef = collection(db, "medications");
      
      let q;
      if (viewMode === "patient") {
        // Show medications for this patient
        q = query(medicationsRef, where("patient_id", "==", currentUser.uid));
      } else {
        // Show medications prescribed by this doctor
        q = query(medicationsRef, where("doctor_id", "==", currentUser.uid));
      }
      
      const querySnapshot = await getDocs(q);

      const meds = [];
      querySnapshot.forEach((doc) => {
        meds.push({ id: doc.id, ...doc.data() });
      });

      // Sort by start date (newest first)
      meds.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      setMedications(meds);
      setError(null);
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError("Unable to load medications");
    } finally {
      setLoading(false);
    }
  }

  const handleAddMedication = async (e) => {
    e.preventDefault();

    try {
      const newMedication = {
        patient_id: viewMode === "patient" ? currentUser.uid : formData.prescribed_for_patient,
        doctor_id: viewMode === "doctor" ? currentUser.uid : null,
        medication_name: formData.medication_name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        times_per_day: parseInt(formData.times_per_day),
        route: formData.route,
        administration_times: formData.administration_times,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        refill_date: formData.refill_date || null,
        instructions: formData.instructions,
        side_effects: formData.side_effects,
        is_active: formData.is_active,
        prescribed_by: viewMode === "doctor" ? currentUser.uid : formData.prescribed_by || null,
        diagnosis: formData.diagnosis || null,
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingMed) {
        await updateDoc(doc(db, "medications", editingMed.id), {
          ...newMedication,
          created_at: editingMed.created_at
        });
        setMedications(medications.map(m => 
          m.id === editingMed.id ? { ...newMedication, id: editingMed.id, created_at: editingMed.created_at } : m
        ));
        alert("Medication updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "medications"), newMedication);
        setMedications([{ id: docRef.id, ...newMedication }, ...medications]);
        alert("Medication added successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("Error saving medication:", err);
      alert("Failed to save medication");
    }
  };

  const handleEdit = (med) => {
    setEditingMed(med);
    setFormData({
      medication_name: med.medication_name,
      dosage: med.dosage,
      frequency: med.frequency,
      times_per_day: med.times_per_day,
      route: med.route,
      administration_times: med.administration_times || ["09:00"],
      start_date: med.start_date,
      end_date: med.end_date || "",
      refill_date: med.refill_date || "",
      instructions: med.instructions || "",
      side_effects: med.side_effects || "",
      is_active: med.is_active,
      prescribed_by: med.prescribed_by || "",
      prescribed_for_patient: med.patient_id || "",
      diagnosis: med.diagnosis || "",
      duration_days: med.duration_days || ""
    });
    setShowAddModal(true);
  };

  const handleDelete = async (medId) => {
    if (!confirm("Are you sure you want to delete this medication?")) return;

    try {
      await deleteDoc(doc(db, "medications", medId));
      setMedications(medications.filter(m => m.id !== medId));
      alert("Medication deleted successfully!");
    } catch (err) {
      console.error("Error deleting medication:", err);
      alert("Failed to delete medication");
    }
  };

  const handleToggleActive = async (med) => {
    try {
      await updateDoc(doc(db, "medications", med.id), {
        is_active: !med.is_active,
        updated_at: new Date().toISOString()
      });
      setMedications(medications.map(m => 
        m.id === med.id ? { ...m, is_active: !m.is_active } : m
      ));
    } catch (err) {
      console.error("Error toggling medication status:", err);
      alert("Failed to update medication status");
    }
  };

  const handleTimesChange = (numTimes) => {
    const times = [];
    const baseHour = 9; // Start at 9 AM
    const interval = Math.floor(12 / numTimes); // Spread across ~12 hours
    
    for (let i = 0; i < numTimes; i++) {
      const hour = (baseHour + (i * interval)) % 24;
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    setFormData({
      ...formData,
      times_per_day: numTimes,
      administration_times: times
    });
  };

  const updateTime = (index, value) => {
    const newTimes = [...formData.administration_times];
    newTimes[index] = value;
    setFormData({ ...formData, administration_times: newTimes });
  };

  const resetForm = () => {
    setFormData({
      medication_name: "",
      dosage: "",
      frequency: "once_daily",
      times_per_day: 1,
      route: "oral",
      administration_times: ["09:00"],
      start_date: "",
      end_date: "",
      refill_date: "",
      instructions: "",
      side_effects: "",
      is_active: true,
      prescribed_by: "",
      prescribed_for_patient: "",
      diagnosis: "",
      duration_days: ""
    });
    setShowAddModal(false);
    setEditingMed(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const activeMedications = medications.filter(m => m.is_active);
  const inactiveMedications = medications.filter(m => !m.is_active);

  if (loading) {
    return (
      <div className="medications-page">
        <div className="medications-container">
          <h1 className="medications-title">Medications</h1>
          <p>Loading medications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medications-page">
      <div className="medications-container">
        {/* Header */}
        <div className="medications-header">
          <div>
            <h1 className="medications-title">
              <Pill className="title-icon" />
              {isDoctor ? "Prescribe Medications" : "My Medications"}
            </h1>
            <p className="medications-subtitle">
              {isDoctor 
                ? "Prescribe and manage patient medications" 
                : "Track your medications and get reminders"}
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="add-medication-btn"
          >
            <Plus className="btn-icon" />
            {isDoctor ? "Prescribe Medication" : "Add Medication"}
          </button>
        </div>


        {/* Active Medications */}
        <div className="medications-section">
          <h2 className="section-title">
            Active Medications ({activeMedications.length})
          </h2>
          
          {activeMedications.length === 0 ? (
            <div className="empty-state">
              <Pill className="empty-icon" />
              <p className="empty-title">
                {isDoctor ? "No Active Prescriptions" : "No Active Medications"}
              </p>
              <p className="empty-text">
                {isDoctor 
                  ? "No active prescriptions. Start by prescribing a medication to a patient."
                  : "Add your medications to track them and receive reminders."}
              </p>
              <button onClick={() => setShowAddModal(true)} className="empty-action-btn">
                <Plus className="empty-action-icon" />
                {isDoctor ? "Prescribe Medication" : "Add Medication"}
              </button>
            </div>
          ) : (
            <div className="medications-grid">
              {activeMedications.map((med) => (
                <div key={med.id} className="medication-card">
                  <div className="medication-card-header">
                    <div className="medication-header-left">
                      <h3 className="medication-name">{med.medication_name}</h3>
                      <p className="medication-dosage">{med.dosage}</p>
                    </div>
                    <div className="medication-header-right">
                      <button 
                        onClick={() => handleEdit(med)} 
                        className="medication-edit-btn"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(med.id)} 
                        className="medication-delete-btn"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="medication-card-body">
                    <div className="medication-info-row">
                      <Clock size={16} />
                      <span><strong>Frequency:</strong> {med.frequency.replace(/_/g, ' ')}</span>
                    </div>

                    <div className="medication-info-row">
                      <Bell size={16} />
                      <span><strong>Times:</strong> {med.administration_times.join(", ")}</span>
                    </div>

                    <div className="medication-info-row">
                      <Pill size={16} />
                      <span><strong>Route:</strong> {med.route}</span>
                    </div>

                    <div className="medication-info-row">
                      <Calendar size={16} />
                      <span><strong>Started:</strong> {formatDate(med.start_date)}</span>
                    </div>

                    {med.end_date && (
                      <div className="medication-info-row">
                        <Calendar size={16} />
                        <span><strong>Ends:</strong> {formatDate(med.end_date)}</span>
                      </div>
                    )}

                    {med.refill_date && (
                      <div className="medication-refill-alert">
                        <Bell size={14} />
                        <span>Refill due: {formatDate(med.refill_date)}</span>
                      </div>
                    )}

                    {med.instructions && (
                      <div className="medication-instructions">
                        <strong>Instructions:</strong>
                        <p>{med.instructions}</p>
                      </div>
                    )}

                    <div className="medication-actions">
                      <button
                        onClick={() => handleToggleActive(med)}
                        className="toggle-active-btn"
                      >
                        Mark as Inactive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inactive Medications */}
        {inactiveMedications.length > 0 && (
          <div className="medications-section">
            <h2 className="section-title">
              Inactive Medications ({inactiveMedications.length})
            </h2>
            <div className="medications-grid">
              {inactiveMedications.map((med) => (
                <div key={med.id} className="medication-card inactive">
                  <div className="medication-card-header">
                    <div className="medication-header-left">
                      <h3 className="medication-name">{med.medication_name}</h3>
                      <p className="medication-dosage">{med.dosage}</p>
                      <span className="inactive-badge">Inactive</span>
                    </div>
                    <div className="medication-header-right">
                      <button 
                        onClick={() => handleDelete(med.id)} 
                        className="medication-delete-btn"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="medication-card-body">
                    <div className="medication-actions">
                      <button
                        onClick={() => handleToggleActive(med)}
                        className="toggle-active-btn active"
                      >
                        Reactivate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMed 
                  ? "Edit Medication" 
                  : isDoctor ? "Prescribe Medication" : "Add Medication"}
              </h2>
              <button onClick={() => resetForm()} className="modal-close">×</button>
            </div>

            <form onSubmit={handleAddMedication} className="modal-body">
              <div className="form-content">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="medication_name" className="form-label">Medication Name *</label>
                    <input
                      id="medication_name"
                      type="text"
                      value={formData.medication_name}
                      onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                      className="form-input"
                      placeholder="e.g., Metformin, Lisinopril"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="dosage" className="form-label">Dosage *</label>
                    <input
                      id="dosage"
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="form-input"
                      placeholder="e.g., 500mg, 10mg"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="frequency" className="form-label">Frequency *</label>
                    <select
                      id="frequency"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="once_daily">Once Daily</option>
                      <option value="twice_daily">Twice Daily</option>
                      <option value="three_times_daily">Three Times Daily</option>
                      <option value="four_times_daily">Four Times Daily</option>
                      <option value="as_needed">As Needed</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="route" className="form-label">How Taken *</label>
                    <select
                      id="route"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="oral">Oral (by mouth)</option>
                      <option value="sublingual">Sublingual (under tongue)</option>
                      <option value="topical">Topical (on skin)</option>
                      <option value="injection">Injection</option>
                      <option value="inhalation">Inhalation</option>
                      <option value="nasal">Nasal</option>
                      <option value="eye_drops">Eye Drops</option>
                      <option value="ear_drops">Ear Drops</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="times_per_day" className="form-label">Times Per Day *</label>
                  <input
                    id="times_per_day"
                    type="number"
                    min="1"
                    max="6"
                    value={formData.times_per_day}
                    onChange={(e) => handleTimesChange(parseInt(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Administration Times *</label>
                  <div className="times-grid">
                    {formData.administration_times.map((time, index) => (
                      <input
                        key={index}
                        type="time"
                        value={time}
                        onChange={(e) => updateTime(index, e.target.value)}
                        className="form-input time-input"
                        required
                      />
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="start_date" className="form-label">Start Date *</label>
                    <input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="end_date" className="form-label">End Date (Optional)</label>
                    <input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="refill_date" className="form-label">Refill Reminder Date</label>
                  <input
                    id="refill_date"
                    type="date"
                    value={formData.refill_date}
                    onChange={(e) => setFormData({ ...formData, refill_date: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="instructions" className="form-label">Instructions</label>
                  <textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="form-input form-textarea"
                    rows="3"
                    placeholder="e.g., Take with food, Take 30 minutes before meals"
                  />
                </div>

                {isDoctor && (
                  <>
                    <div className="form-field">
                      <label htmlFor="prescribed_for_patient" className="form-label">Patient ID *</label>
                      <input
                        id="prescribed_for_patient"
                        type="text"
                        value={formData.prescribed_for_patient}
                        onChange={(e) => setFormData({ ...formData, prescribed_for_patient: e.target.value })}
                        className="form-input"
                        placeholder="Enter patient ID"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="diagnosis" className="form-label">Diagnosis</label>
                      <input
                        id="diagnosis"
                        type="text"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        className="form-input"
                        placeholder="e.g., Type 2 Diabetes, Hypertension"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="duration_days" className="form-label">Duration (Days)</label>
                      <input
                        id="duration_days"
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                        className="form-input"
                        placeholder="e.g., 30, 60, 90"
                      />
                    </div>
                  </>
                )}

                <div className="form-field">
                  <label htmlFor="side_effects" className="form-label">Known Side Effects</label>
                  <textarea
                    id="side_effects"
                    value={formData.side_effects}
                    onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
                    className="form-input form-textarea"
                    rows="2"
                    placeholder="e.g., Nausea, dizziness, headache"
                  />
                </div>
              </div>

              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingMed ? "Update Medication" : "Add Medication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}