// src/Prototype/Pages/BookAppointment.jsx
// @ts-nocheck
import React, { useState } from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { useAuth } from "../../contexts/AuthContext";

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const today = new Date().toISOString().split("T")[0];

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();

  // Clinic passed from Clinics.jsx
  const clinic = location.state?.clinic || null;

  const [form, setForm] = useState({
    clinic_name: clinic?.name || "",
    appointment_date: today,
    appointment_time: "",
    reason: "Preventive Cardiac Screening",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentUser || !userProfile) {
      alert("You must be logged in to book an appointment.");
      return;
    }

    if (!clinic) {
      alert("No clinic selected.");
      return;
    }

    try {
      const now = new Date().toISOString();

      // Insert into Supabase
      const { error } = await supabase.from("appointments").insert({
        patient_id: currentUser.id,
        doctor_id: userProfile.assigned_doctor, // your rule #1
        patient_name: userProfile.full_name, // your rule #2

        // Clinic fields (your rule #3)
        clinic_name: clinic.name,
        location: clinic.location,
        address: clinic.address,
        phone: clinic.phone,
        clinic_rating: clinic.rating,

        // Appointment fields (your rule #4)
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,

        reason: form.reason,
        notes: form.notes,

        status: "pending",
        created_at: now,
      });

      if (error) throw error;

      alert("Appointment booked successfully!");
      navigate("/appointments");
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment.");
    }
  }

  return (
    <div className="book-page">
      <div className="book-page-inner">
        <button
          type="button"
          className="back-button"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

        <h1 className="page-title">Book Appointment</h1>
        <p className="page-subtitle">
          Schedule your preventive health screening
        </p>

        <form className="book-card" onSubmit={handleSubmit}>
          <div className="book-card-header">Appointment Details</div>

          <div className="book-card-body">
            {/* Clinic */}
            <div className="field">
              <label htmlFor="clinic_name" className="field-label">
                Clinic
              </label>
              <input
                id="clinic_name"
                name="clinic_name"
                type="text"
                className="field-input"
                value={form.clinic_name}
                readOnly
              />
            </div>

            <div className="field-grid">
              {/* Date */}
              <div className="field">
                <label htmlFor="appointment_date" className="field-label">
                  <Calendar className="field-icon" />
                  Appointment Date *
                </label>
                <input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  min={today}
                  className="field-input"
                  value={form.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Time */}
              <div className="field">
                <label htmlFor="appointment_time" className="field-label">
                  <Clock className="field-icon" />
                  Time Slot *
                </label>
                <select
                  id="appointment_time"
                  name="appointment_time"
                  className="field-input"
                  value={form.appointment_time}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason */}
            <div className="field">
              <label htmlFor="reason" className="field-label">
                Reason for Visit
              </label>
              <input
                id="reason"
                name="reason"
                type="text"
                className="field-input"
                value={form.reason}
                onChange={handleChange}
                placeholder="e.g., Preventive Cardiac Screening"
              />
            </div>

            {/* Notes */}
            <div className="field">
              <label htmlFor="notes" className="field-label">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="field-input field-textarea"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any specific concerns or information..."
              />
            </div>

            {/* Info box */}
            <div className="info-box">
              <div className="info-title">
                <CheckCircle className="info-icon" />
                Important Information
              </div>
              <ul className="info-list">
                <li>Please arrive 15 minutes before your appointment</li>
                <li>Bring your national ID and insurance card</li>
                <li>You will receive a confirmation message shortly</li>
              </ul>
            </div>
          </div>

          <div className="book-card-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle className="btn-icon" />
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
