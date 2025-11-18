import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, AlertTriangle, Heart, Users, FileText, Calendar, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

  // Fetch patient data from Firebase
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        
        // Fetch patient profile
        const patientDoc = await getDoc(doc(db, 'users', patientId));
        if (patientDoc.exists()) {
          setPatient({ id: patientId, ...patientDoc.data() });
        } else {
          setError('Patient not found');
          return;
        }

        // Fetch family members
        const familyQuery = query(
          collection(db, 'family_members'),
          where('patient_id', '==', patientId)
        );
        const familySnapshot = await getDocs(familyQuery);
        const familyData = familySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFamilyMembers(familyData);

        // Fetch health records
        const healthQuery = query(
          collection(db, 'health_records'),
          where('patient_id', '==', patientId)
        );
        const healthSnapshot = await getDocs(healthQuery);
        const healthData = healthSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHealthRecords(healthData);

        // Fetch appointments
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('patient_id', '==', patientId)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAppointments(appointmentsData);

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
    // You can add a toast notification here if you have one
    alert('Patient ID copied to clipboard!');
  };

  const calculateAge = (dob) => {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateRiskLevel = () => {
    const scdFamilyMembers = familyMembers.filter(m => m.has_scd);
    const earlyOnset = scdFamilyMembers.filter(m => m.age_at_diagnosis && m.age_at_diagnosis < 50);
    
    if (earlyOnset.length >= 2) return 'High';
    if (earlyOnset.length === 1) return 'Moderate';
    if (scdFamilyMembers.length > 0) return 'Low';
    return 'None';
  };

  const getRiskColor = (level) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Moderate': 'bg-amber-100 text-amber-800 border-amber-200',
      'Low': 'bg-green-100 text-green-800 border-green-200',
      'None': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[level] || colors['None'];
  };

  if (loading) {
    return (
      <div className="patient-detail-page">
        <div className="patient-detail-container">
          <div className="loading-spinner">Loading patient data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-detail-page">
        <div className="patient-detail-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-detail-page">
        <div className="patient-detail-container">
          <div className="error-message">Patient not found</div>
        </div>
      </div>
    );
  }

  const riskLevel = calculateRiskLevel();
  const scdEarlyOnset = familyMembers.filter(m => m.has_scd && m.age_at_diagnosis && m.age_at_diagnosis < 50);

  return (
    <div className="patient-detail-page">
      <div className="patient-detail-container">
        {/* Header */}
        <div className="patient-detail-header">
          <button className="back-btn" onClick={() => navigate('/patients')}>
            <ArrowLeft className="back-icon" />
            Back to Patients
          </button>

          <div className="patient-info-header">
            <div className="patient-avatar-section">
              <div className="patient-avatar">
                <User className="avatar-icon" />
              </div>
              <div className="patient-details">
                <h1 className="patient-name">{patient.full_name || 'Unknown Patient'}</h1>
                <div className="patient-contact">
                  <div className="contact-item">
                    <Mail className="contact-icon" />
                    <span>{patient.email || 'No email'}</span>
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
            
            {/* PATIENT ID DISPLAY - FOR DOCTORS TO COPY */}
            {userProfile?.user_type === 'doctor' && (
              <div className="patient-id-display-box">
                <label className="patient-id-display-label">
                  🆔 PATIENT ID (Use this to prescribe medications)
                </label>
                <div className="patient-id-display-content">
                  <input
                    type="text"
                    value={patientId}
                    readOnly
                    className="patient-id-display-input"
                  />
                  <button 
                    onClick={copyPatientId}
                    className="copy-id-btn-large"
                  >
                    <Copy size={16} />
                    Copy ID
                  </button>
                </div>
                <p className="patient-id-helper-text">
                  Paste this Patient ID in the Medications page when prescribing
                </p>
              </div>
            )}

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
                <p className="summary-label">Upcoming Appointments</p>
                <p className="summary-value">
                  {appointments.filter(apt => 
                    apt.status === 'Scheduled' && 
                    new Date(apt.appointment_date) >= new Date()
                  ).length}
                </p>
              </div>
              <Calendar className="summary-icon" style={{ color: '#10b981', opacity: 0.2 }} />
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
                        <span className="detail-value">
                          {member.date_of_birth ? `${calculateAge(member.date_of_birth)} years` : 'Unknown'}
                        </span>
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