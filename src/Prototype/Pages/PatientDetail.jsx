import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, AlertTriangle, Heart, Users, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Mock Data
const mockPatient = {
  id: 1,
  full_name: 'Ahmed Mohammed',
  email: 'ahmed.mohammed@example.com',
  phone_number: '+966 50 123 4567',
  user_type: 'patient'
};

const mockFamilyMembers = [
  {
    id: 1,
    full_name: 'Ali Ahmed',
    relation: 'Father',
    date_of_birth: '1960-03-15',
    has_scd: true,
    age_at_diagnosis: 42,
    medical_notes: 'Diagnosed with sickle cell disease'
  },
  {
    id: 2,
    full_name: 'Maryam Hassan',
    relation: 'Mother',
    date_of_birth: '1965-07-20',
    has_scd: false,
    age_at_diagnosis: null,
    medical_notes: 'No hereditary conditions'
  },
  {
    id: 3,
    full_name: 'Fatima Ahmed',
    relation: 'Sister',
    date_of_birth: '1992-05-10',
    has_scd: true,
    age_at_diagnosis: 35,
    medical_notes: 'Early onset sickle cell disease'
  }
];

const mockHealthRecords = [
  {
    id: 1,
    diagnosis: 'Hypertension',
    diagnosis_date: '2023-05-15',
    age_at_diagnosis: 30,
    treatment: 'Medication and lifestyle changes',
    medications: ['Lisinopril 10mg', 'Aspirin 81mg'],
    notes: 'Regular monitoring required',
    is_hereditary_condition: true
  },
  {
    id: 2,
    diagnosis: 'Type 2 Diabetes',
    diagnosis_date: '2024-02-20',
    age_at_diagnosis: 31,
    treatment: 'Diet control and Metformin',
    medications: ['Metformin 500mg'],
    notes: 'Blood sugar levels improving',
    is_hereditary_condition: true
  }
];

const mockAppointments = [
  {
    id: 1,
    clinic_name: 'City Health Clinic',
    appointment_date: '2025-11-20',
    appointment_time: '10:00 AM',
    reason: 'Annual checkup',
    status: 'Scheduled'
  },
  {
    id: 2,
    clinic_name: 'Heart Care Center',
    appointment_date: '2025-10-15',
    appointment_time: '2:30 PM',
    reason: 'Follow-up consultation',
    status: 'Completed'
  }
];

export default function PatientDetail() {
  const [patient] = useState(mockPatient);
  const [familyMembers] = useState(mockFamilyMembers);
  const [healthRecords] = useState(mockHealthRecords);
  const [appointments] = useState(mockAppointments);

  const scdEarlyOnset = familyMembers.filter(m => m.has_scd && m.age_at_diagnosis < 50);
  const riskLevel = scdEarlyOnset.length >= 2 ? 'High' : scdEarlyOnset.length === 1 ? 'Moderate' : familyMembers.some(m => m.has_scd) ? 'Low' : 'None';

  const getRiskColor = (level) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Moderate': 'bg-amber-100 text-amber-800 border-amber-200',
      'Low': 'bg-green-100 text-green-800 border-green-200',
      'None': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[level] || colors['None'];
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="patient-detail-page">
      <div className="patient-detail-container">
        {/* Header */}
        <div className="patient-detail-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft className="back-icon" />
            Back to Patients
          </button>

          <div className="patient-info-header">
            <div className="patient-avatar-section">
              <div className="patient-avatar">
                <User className="avatar-icon" />
              </div>
              <div className="patient-details">
                <h1 className="patient-name">{patient.full_name}</h1>
                <div className="patient-contact">
                  <div className="contact-item">
                    <Mail className="contact-icon" />
                    <span>{patient.email}</span>
                  </div>
                  {patient.phone_number && (
                    <div className="contact-item">
                      <Phone className="contact-icon" />
                      <span>{patient.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {riskLevel && riskLevel !== 'None' && (
              <span className={`risk-badge ${getRiskColor(riskLevel)}`}>
                {riskLevel} Risk
              </span>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-card-content">
              <div className="summary-info">
                <p className="summary-label">Family Members</p>
                <p className="summary-value">{familyMembers.length}</p>
              </div>
              <Users className="summary-icon" style={{ color: '#3b82f6', opacity: 0.2 }} />
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-content">
              <div className="summary-info">
                <p className="summary-label">Health Records</p>
                <p className="summary-value">{healthRecords.length}</p>
              </div>
              <FileText className="summary-icon" style={{ color: '#a855f7', opacity: 0.2 }} />
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-content">
              <div className="summary-info">
                <p className="summary-label">SCD Cases</p>
                <p className="summary-value">{familyMembers.filter(m => m.has_scd).length}</p>
              </div>
              <AlertTriangle className="summary-icon" style={{ color: '#ef4444', opacity: 0.2 }} />
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-content">
              <div className="summary-info">
                <p className="summary-label">Early Onset</p>
                <p className="summary-value">{scdEarlyOnset.length}</p>
              </div>
              <Heart className="summary-icon" style={{ color: '#ec4899', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        {scdEarlyOnset.length > 0 && (
          <div className={`risk-assessment-card ${riskLevel === 'High' ? 'high-risk' : 'moderate-risk'}`}>
            <div className="risk-header">
              <h2 className="risk-title">
                <AlertTriangle className={riskLevel === 'High' ? 'risk-icon-high' : 'risk-icon-moderate'} />
                {riskLevel} Risk - Early Onset Cases Detected
              </h2>
            </div>
            <div className="risk-body">
              <p className="risk-description">
                {scdEarlyOnset.length} family member{scdEarlyOnset.length > 1 ? 's' : ''} with SCD diagnosed before age 50:
              </p>
              <div className="risk-members">
                {scdEarlyOnset.map(member => (
                  <div key={member.id} className="risk-member-item">
                    <p className="risk-member-name">{member.full_name} ({member.relation})</p>
                    <p className="risk-member-age">Diagnosed at age {member.age_at_diagnosis}</p>
                  </div>
                ))}
              </div>
              <div className="risk-recommendation">
                <p className="recommendation-text">
                  <strong>Clinical Recommendation:</strong> Genetic counseling and preventive cardiac screening recommended for patient and immediate family members.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Family Tree */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <Users className="section-icon" />
              Family Health Tree ({familyMembers.length} members)
            </h2>
          </div>
          <div className="section-body">
            {familyMembers.length > 0 ? (
              <div className="family-members-grid">
                {familyMembers.map((member) => (
                  <div key={member.id} className="family-member-card">
                    <div className="family-member-header">
                      <div>
                        <h3 className="family-member-name">{member.full_name}</h3>
                        <p className="family-member-relation">{member.relation}</p>
                      </div>
                    </div>
                    <div className="family-member-body">
                      <div className="member-detail-row">
                        <span className="detail-label">Age:</span>
                        <span className="detail-value">{calculateAge(member.date_of_birth)} years</span>
                      </div>
                      <div className="member-detail-row">
                        <span className="detail-label">Health Status:</span>
                        <span className={`health-badge ${member.has_scd ? 'has-condition' : 'no-condition'}`}>
                          {member.has_scd ? 'Has SCD' : 'No Condition'}
                        </span>
                      </div>
                      {member.has_scd && member.age_at_diagnosis && (
                        <div className="member-detail-row">
                          <span className="detail-label">Diagnosed at:</span>
                          <span className="detail-value">{member.age_at_diagnosis} years</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No family members recorded yet</p>
            )}
          </div>
        </div>

        {/* Patient Health Records */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <FileText className="section-icon" style={{ color: '#a855f7' }} />
              Patient Health Records
            </h2>
          </div>
          <div className="section-body">
            {healthRecords.length > 0 ? (
              <div className="health-records-list">
                {healthRecords.map((record) => (
                  <div key={record.id} className="health-record-item">
                    <div className="record-item-header">
                      <div>
                        <h4 className="record-item-title">{record.diagnosis}</h4>
                        <p className="record-item-date">
                          Diagnosed: {format(new Date(record.diagnosis_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      {record.is_hereditary_condition && (
                        <span className="hereditary-badge">Hereditary</span>
                      )}
                    </div>

                    <div className="record-item-details">
                      {record.age_at_diagnosis && (
                        <div className="record-detail">
                          <span className="record-label">Age at diagnosis: </span>
                          <span className="record-value">{record.age_at_diagnosis}</span>
                        </div>
                      )}
                      {record.treatment && (
                        <div className="record-detail">
                          <span className="record-label">Treatment: </span>
                          <span className="record-value">{record.treatment}</span>
                        </div>
                      )}
                    </div>

                    {record.medications && record.medications.length > 0 && (
                      <div className="record-medications">
                        <p className="medications-label">Medications:</p>
                        <div className="medications-list">
                          {record.medications.map((med, idx) => (
                            <span key={idx} className="medication-badge">{med}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.notes && (
                      <div className="record-notes">
                        <p className="notes-text">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No personal health records available</p>
            )}
          </div>
        </div>

        {/* Appointments */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <Calendar className="section-icon" style={{ color: '#10b981' }} />
              Appointment History
            </h2>
          </div>
          <div className="section-body">
            {appointments.length > 0 ? (
              <div className="appointments-list">
                {appointments.map((apt) => (
                  <div key={apt.id} className="appointment-item">
                    <div className="appointment-item-content">
                      <div>
                        <h4 className="appointment-clinic">{apt.clinic_name}</h4>
                        <p className="appointment-datetime">
                          {format(new Date(apt.appointment_date), 'EEEE, MMM d, yyyy')} at {apt.appointment_time}
                        </p>
                        {apt.reason && (
                          <p className="appointment-reason">
                            <strong>Reason:</strong> {apt.reason}
                          </p>
                        )}
                      </div>
                      <span className={`appointment-status-badge ${
                        apt.status === 'Scheduled' ? 'status-scheduled' :
                        apt.status === 'Completed' ? 'status-completed' :
                        'status-cancelled'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No appointments scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}