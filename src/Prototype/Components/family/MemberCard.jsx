import React from 'react';
import { User, AlertTriangle, Heart, Pencil, Trash2 } from 'lucide-react';

export default function MemberCard({ member, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      'Healthy': 'status-healthy',
      'At Risk': 'status-at-risk',
      'Diagnosed': 'status-diagnosed',
      'Deceased': 'status-deceased'
    };
    return colors[status] || colors['Healthy'];
  };

  return (
    <div className="member-card-component">
      <div className="member-card-header-component">
        <div className="member-header-content">
          <div className="member-avatar-icon">
            <User className="user-icon" />
          </div>
          <div className="member-info-text">
            <h3 className="member-name-text">{member.full_name}</h3>
            <p className="member-relation-text">{member.relation}</p>
          </div>
        </div>
        <div className="member-action-buttons">
          <button
            className="member-edit-btn"
            onClick={() => onEdit(member)}
          >
            <Pencil className="action-icon-small" />
          </button>
          <button
            className="member-delete-btn"
            onClick={() => onDelete(member)}
          >
            <Trash2 className="action-icon-small" />
          </button>
        </div>
      </div>

      <div className="member-card-body-component">
        <div className="member-detail-row-component">
          <span className="detail-label-component">Age</span>
          <span className="detail-value-component">{member.age} years</span>
        </div>
        
        {member.health_condition && (
          <div className="member-detail-row-component">
            <span className="detail-label-component">Condition</span>
            <span className="detail-value-component">{member.health_condition}</span>
          </div>
        )}

        <div className="member-badges">
          <span className={`member-status-badge ${getStatusColor(member.status)}`}>
            {member.status}
          </span>
          
          {member.has_scd && (
            <span className="member-status-badge status-scd">
              <AlertTriangle className="badge-icon-tiny" />
              SCD
            </span>
          )}
          
          {member.age_at_diagnosis && member.age_at_diagnosis < 50 && (
            <span className="member-status-badge status-early-onset">
              <Heart className="badge-icon-tiny" />
              Early Onset
            </span>
          )}
        </div>

        {member.additional_notes && (
          <div className="member-notes-section">
            <p className="member-notes-text">{member.additional_notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}