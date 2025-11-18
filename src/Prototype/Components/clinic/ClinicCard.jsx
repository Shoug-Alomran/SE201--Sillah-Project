import React from 'react';
import { MapPin, Phone, Star, Calendar, CheckCircle } from 'lucide-react';

export default function ClinicCard({ clinic, onBook }) {
  return (
    <div className="clinic-card-component">
      <div className="clinic-card-header-component">
        <div className="clinic-header-content">
          <div>
            <h3 className="clinic-name-component">{clinic.clinic_name}</h3>
            <span className="clinic-specialty-badge-component">
              {clinic.specialty}
            </span>
          </div>
          {clinic.is_certified && (
            <div className="clinic-certified-icon">
              <CheckCircle className="certified-check" />
            </div>
          )}
        </div>
      </div>
      
      <div className="clinic-card-body-component">
        <div className="clinic-info-row">
          <MapPin className="clinic-info-icon" />
          <div>
            <p className="clinic-location-name">{clinic.location}</p>
            {clinic.address && (
              <p className="clinic-address">{clinic.address}</p>
            )}
          </div>
        </div>

        {clinic.phone && (
          <div className="clinic-info-row">
            <Phone className="clinic-info-icon" />
            <p className="clinic-phone-text">{clinic.phone}</p>
          </div>
        )}

        {clinic.rating && (
          <div className="clinic-rating-row">
            <Star className="clinic-star-icon" />
            <span className="clinic-rating-value">{clinic.rating.toFixed(1)}</span>
            <span className="clinic-rating-max">/ 5.0</span>
          </div>
        )}

        {clinic.available_slots && clinic.available_slots.length > 0 && (
          <div className="clinic-slots-section">
            <p className="slots-label">Available times:</p>
            <div className="slots-badges">
              {clinic.available_slots.slice(0, 3).map((slot, idx) => (
                <span key={idx} className="slot-badge">{slot}</span>
              ))}
              {clinic.available_slots.length > 3 && (
                <span className="slot-badge">+{clinic.available_slots.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="clinic-card-footer-component">
        <button
          onClick={() => onBook(clinic)}
          className="clinic-book-btn"
        >
          <Calendar className="btn-icon-small" />
          Book Appointment
        </button>
      </div>
    </div>
  );
}