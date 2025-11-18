import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, AlertTriangle, Heart, Users, FileText, Calendar, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  const [patient, setPatient] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        
        const usersQuery = query(collection(db, 'users'), where('uid', '==', patientId));
        const usersSnapshot = await getDocs(usersQuery);
        
        if (!usersSnapshot.empty) {
          setPatient({ id: patientId, ...usersSnapshot.docs[0].data() });
        } else {
          setError('Patient not found');
          return;
        }

        const familyQuery = query(
          collection(db, 'family_members'),
          where('user_id', '==', patientId)
        );
        const familySnapshot = await getDocs(familyQuery);
        setFamilyMembers(familySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        const healthQuery = query(
          collection(db, 'personal_health_records'),
          where('user_id', '==', patientId)
        );
        const healthSnapshot = await getDocs(healthQuery);
        setHealthRecords(healthSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('patient_id', '==', patientId)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        setAppointments(appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const copyPatientId = () => {
    navigator.clipboard.writeText(patientId);
    alert('Patient ID copied to clipboard!');
  };

  const calculateRiskLevel = () => {
    const scdFamilyMembers = familyMembers.filter(m => 
      m.health_status && m.health_status.toLowerCase().includes('scd')
    );
    const earlyOnset = scdFamilyMembers.filter(m => 
      m.diagnosis_age && m.diagnosis_age < 50
    );
    
    if (earlyOnset.length >= 2) return 'High';
    if (earlyOnset.length === 1) return 'Moderate';
    if (scdFamilyMembers.length > 0) return 'Low';
    return 'None';
  };

  if (loading) {
    return (
      <div className="patients-page">
        <div className="patients-container">
          <div className="empty-message">Loading patient data...</div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patients-page">
        <div className="patients-container">
          <div className="empty-state">
            <AlertTriangle className="empty-icon" />
            <p className="empty-title">{error || 'Patient not found'}</p>
            <button onClick={() => navigate('/patients')} className="empty-action-btn">
              <ArrowLeft className="empty-action-icon" />
              Back to Patients
            </button>
          </div>
        </div>
      </div>
    );
  }

  const riskLevel = calculateRiskLevel();
  const scdEarlyOnset = familyMembers.filter(m => 
    m.health_status && 
    m.health_status.toLowerCase().includes('scd') && 
    m.diagnosis_age && 
    m.diagnosis_age < 50
  );

  return (
    <div className="patients-page">
      <div className="patients-container">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/patients')} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#4b5563'
          }}
        >
          <ArrowLeft size={16} />
          Back to Patients
        </button>

        {/* Patient Header */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={32} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
                  {patient.full_name || 'Unknown Patient'}
                </h1>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Mail size={14} />
                    {patient.email || 'No email'}
                  </div>
                  {patient.phone_number && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Phone size={14} />
                      {patient.phone_number}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PATIENT ID - For Prescribing */}
          {userProfile?.user_type === 'doctor' && (
            <div style={{
              background: '#dbeafe',
              border: '1px solid #bfdbfe',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Copy size={16} color="#2563eb" />
                <strong style={{ color: '#1e40af', fontSize: '0.875rem' }}>
                  PATIENT ID (USE THIS TO PRESCRIBE MEDICATIONS)
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={patientId}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #93c5fd',
                    borderRadius: '0.375rem',
                    background: 'white',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  onClick={copyPatientId}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}
                >
                  Copy ID
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#1e3a8a', margin: '0.5rem 0 0 0' }}>
                Paste this Patient ID in the Medications page when prescribing
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Family Members</p>
                <h3 className="stat-value">{familyMembers.length}</h3>
              </div>
              <div className="stat-icon-wrapper from-blue-500">
                <Users className="stat-icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Health Records</p>
                <h3 className="stat-value">{healthRecords.length}</h3>
              </div>
              <div className="stat-icon-wrapper from-purple-500">
                <FileText className="stat-icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">SCD Cases</p>
                <h3 className="stat-value">
                  {familyMembers.filter(m => m.health_status && m.health_status.toLowerCase().includes('scd')).length}
                </h3>
              </div>
              <div className="stat-icon-wrapper from-green-500">
                <AlertTriangle className="stat-icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Appointments</p>
                <h3 className="stat-value">{appointments.length}</h3>
              </div>
              <div className="stat-icon-wrapper from-teal-500">
                <Calendar className="stat-icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Risk Alert */}
        {scdEarlyOnset.length > 0 && (
          <div className="alert-card" style={{ borderLeftColor: riskLevel === 'High' ? '#ef4444' : '#f59e0b' }}>
            <div className="alert-card-header">
              <div className="alert-header-content">
                <div className="alert-icon-wrapper" style={{ background: riskLevel === 'High' ? '#ef4444' : '#f59e0b' }}>
                  <AlertTriangle size={20} />
                </div>
                <div className="alert-header-info">
                  <h3 className="alert-title">{riskLevel} Risk - Early Onset Cases Detected</h3>
                  <p className="alert-date">
                    {scdEarlyOnset.length} family member{scdEarlyOnset.length > 1 ? 's' : ''} with SCD diagnosed before age 50
                  </p>
                </div>
              </div>
            </div>
            <div className="alert-card-body">
              <div className="alert-risk-factors">
                <p className="risk-factors-title">Family Members:</p>
                <ul className="risk-factors-list">
                  {scdEarlyOnset.map(member => (
                    <li key={member.id} className="risk-factor-item">
                      <span className="risk-bullet">•</span>
                      {member.name} ({member.relationship}) - Diagnosed at age {member.diagnosis_age}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="alert-recommendation" style={{ borderLeftColor: '#14b8a6' }}>
                <p className="recommendation-title">Clinical Recommendation:</p>
                <p className="recommendation-text">
                  Genetic counseling and preventive cardiac screening recommended for patient and immediate family members.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Family Tree */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h2 className="activity-card-title">
              Family Health Tree ({familyMembers.length} members)
            </h2>
          </div>
          <div className="activity-card-content">
            {familyMembers.length > 0 ? (
              <div className="members-grid">
                {familyMembers.map((member) => (
                  <div key={member.id} className="member-card-component">
                    <div className="member-card-header-component">
                      <div className="member-header-content">
                        <div className="member-avatar-icon">
                          <User className="user-icon" />
                        </div>
                        <div className="member-info-text">
                          <h3 className="member-name-text">{member.name}</h3>
                          <p className="member-relation-text">{member.relationship}</p>
                        </div>
                      </div>
                    </div>
                    <div className="member-card-body-component">
                      <div className="member-detail-row-component">
                        <span className="detail-label-component">Age:</span>
                        <span className="detail-value-component">
                          {member.age ? `${member.age} years` : 'Unknown'}
                        </span>
                      </div>
                      <div className="member-detail-row-component">
                        <span className="detail-label-component">Status:</span>
                        <span className={`member-status-badge ${
                          member.health_status && member.health_status.toLowerCase().includes('scd') 
                            ? 'status-scd' 
                            : member.health_status === 'at risk'
                            ? 'status-at-risk'
                            : 'status-healthy'
                        }`}>
                          {member.health_status || 'Healthy'}
                        </span>
                      </div>
                      {member.diagnosis_age && (
                        <div className="member-detail-row-component">
                          <span className="detail-label-component">Diagnosed:</span>
                          <span className="detail-value-component">Age {member.diagnosis_age}</span>
                        </div>
                      )}
                      {member.conditions && member.conditions.length > 0 && (
                        <div className="member-detail-row-component">
                          <span className="detail-label-component">Conditions:</span>
                          <span className="detail-value-component">{member.conditions.join(', ')}</span>
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

        {/* Health Records */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h2 className="activity-card-title">Patient Health Records</h2>
          </div>
          <div className="activity-card-content">
            {healthRecords.length > 0 ? (
              <div className="health-records-list">
                {healthRecords.map((record) => (
                  <div key={record.id} className="health-record-card">
                    <div className="record-header">
                      <div className="record-header-content">
                        <h3 className="record-diagnosis">{record.diagnosis}</h3>
                        <p className="record-date">
                          {record.diagnosis_date ? format(new Date(record.diagnosis_date), 'MMM d, yyyy') : 'Date unknown'}
                        </p>
                      </div>
                      {record.is_hereditary_condition && (
                        <span className="hereditary-badge">Hereditary</span>
                      )}
                    </div>
                    <div className="record-body">
                      {record.age_at_diagnosis && (
                        <div className="record-info-row">
                          <span className="info-label">Age at diagnosis:</span>
                          <span className="info-value">{record.age_at_diagnosis}</span>
                        </div>
                      )}
                      {record.treatment && (
                        <div className="record-detail-box">
                          <p className="detail-text"><strong>Treatment:</strong> {record.treatment}</p>
                        </div>
                      )}
                      {record.medications && record.medications.length > 0 && (
                        <div className="record-detail-box">
                          <p className="detail-text-label">Medications:</p>
                          <div className="medications-list">
                            {record.medications.map((med, idx) => (
                              <span key={idx} className="medication-badge">{med}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {record.notes && (
                        <div className="record-detail-box">
                          <p className="detail-text">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No personal health records available</p>
            )}
          </div>
        </div>

        {/* Appointments */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h2 className="activity-card-title">Appointment History</h2>
          </div>
          <div className="activity-card-content">
            {appointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {appointments.map((apt) => (
                  <div key={apt.id} className="appointment-item">
                    <h4 className="appointment-item-title">{apt.clinic_name || 'Clinic Visit'}</h4>
                    <p className="appointment-item-details">
                      {apt.appointment_date ? format(new Date(apt.appointment_date), 'EEEE, MMM d, yyyy') : 'Date TBD'} 
                      {apt.appointment_time && ` at ${apt.appointment_time}`}
                    </p>
                    {apt.reason && (
                      <p className="appointment-item-details" style={{ marginTop: '0.25rem' }}>
                        <strong>Reason:</strong> {apt.reason}
                      </p>
                    )}
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