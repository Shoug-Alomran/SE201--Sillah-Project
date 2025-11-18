import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function MemberForm({ member, onSave, onCancel }) {
  const [formData, setFormData] = useState(member || {
    full_name: '',
    relation: '',
    age: '',
    health_condition: 'Healthy',
    has_scd: false,
    age_at_diagnosis: '',
    additional_notes: '',
    status: 'Healthy'
  });

  const relations = ['Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin'];
  const statuses = ['Healthy', 'At Risk', 'Diagnosed', 'Deceased'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      age: parseInt(formData.age),
      age_at_diagnosis: formData.age_at_diagnosis ? parseInt(formData.age_at_diagnosis) : null
    });
  };

  return (
    <div className="member-form-wrapper">
      <div className="member-form-card">
        <div className="member-form-header">
          <span className="form-title">{member ? 'Edit Family Member' : 'Add Family Member'}</span>
          <button
            type="button"
            className="form-close-btn"
            onClick={onCancel}
          >
            <X className="close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="member-form-body">
          <div className="form-content">
            <div className="form-grid-two">
              <div className="form-field">
                <label htmlFor="full_name" className="form-label">Full Name *</label>
                <input
                  id="full_name"
                  type="text"
                  className="form-input"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="relation" className="form-label">Relation *</label>
                <select
                  id="relation"
                  className="form-input"
                  value={formData.relation}
                  onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  required
                >
                  <option value="">Select relation</option>
                  {relations.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="age" className="form-label">Age *</label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  max="120"
                  className="form-input"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Age"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="health_condition" className="form-label">Health Condition</label>
                <input
                  id="health_condition"
                  type="text"
                  className="form-input"
                  value={formData.health_condition}
                  onChange={(e) => setFormData({ ...formData, health_condition: e.target.value })}
                  placeholder="e.g., Healthy, SCD, Hypertension"
                />
              </div>

              <div className="form-field">
                <label htmlFor="age_at_diagnosis" className="form-label">Age at Diagnosis</label>
                <input
                  id="age_at_diagnosis"
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.age_at_diagnosis}
                  onChange={(e) => setFormData({ ...formData, age_at_diagnosis: e.target.value })}
                  placeholder="If diagnosed"
                />
              </div>
            </div>

            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                id="has_scd"
                className="form-checkbox"
                checked={formData.has_scd}
                onChange={(e) => setFormData({ ...formData, has_scd: e.target.checked })}
              />
              <label htmlFor="has_scd" className="form-checkbox-label">
                Has Sickle Cell Disease (SCD)
              </label>
            </div>

            <div className="form-field">
              <label htmlFor="additional_notes" className="form-label">Additional Notes</label>
              <textarea
                id="additional_notes"
                className="form-textarea"
                value={formData.additional_notes}
                onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                placeholder="Any additional health information..."
                rows={3}
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              <Save className="btn-icon-small" />
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}