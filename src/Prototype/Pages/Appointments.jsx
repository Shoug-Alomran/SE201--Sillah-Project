// src/Prototype/Pages/Appointments.jsx
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  X,
  CheckCircle,
  AlertTriangle,
  Plus,
  Phone,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { supabase } from "../../supabase";
import { clinicsData } from "../../data/clinics";

export default function Appointments() {
  const location = useLocation();
  const { currentUser, userProfile, isDoctor, isPatient } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [clinicRatings, setClinicRatings] = useState({}); // { clinicName: { avg, count } }

  const [bookingForm, setBookingForm] = useState({
    clinic_id: "",
    clinic_name: "",
    appointment_date: "",
    appointment_time: "",
    location: "",
    reason: "",
    notes: "",
    phone: "",
    address: "",
  });

  const [ratingInProgress, setRatingInProgress] = useState({}); // { [appointmentId]: rating }

  const incomingClinic = location.state?.clinic;
  const isBooking = location.state?.isBooking;

  // Initialize booking modal from navigation state
  useEffect(() => {
    if (isBooking && incomingClinic) {
      const clinic = clinicsData.find((c) => c.name === incomingClinic.name);
      if (clinic) {
        setSelectedClinic(clinic);
        setBookingForm({
          clinic_id: clinic.id,
          clinic_name: clinic.name,
          appointment_date: "",
          appointment_time: "",
          location: clinic.location,
          address: clinic.address,
          phone: clinic.phone,
          reason: "",
          notes: "",
        });
      }
      setShowBookingModal(true);
    }
  }, [isBooking, incomingClinic]);

  // Fetch all clinic ratings for displaying averages
  const fetchClinicRatings = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("clinic_name, clinic_rating")
        .not("clinic_rating", "is", null);

      if (error) throw error;

      const map = {};
      data.forEach((row) => {
        const name = row.clinic_name;
        const rating = row.clinic_rating;
        if (!map[name]) {
          map[name] = { sum: 0, count: 0 };
        }
        map[name].sum += rating;
        map[name].count += 1;
      });

      const finalRatings = {};
      Object.keys(map).forEach((name) => {
        finalRatings[name] = {
          avg: map[name].sum / map[name].count,
          count: map[name].count,
        };
      });

      setClinicRatings(finalRatings);
    } catch (err) {
      console.error("Error fetching clinic ratings:", err);
      // Non-blocking; we don't show an error UI for this
    }
  };

  // Fetch appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (!currentUser) {
        setError("Please log in to view appointments");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        let query = supabase.from("appointments").select("*");

        if (isPatient) {
          query = query.eq("user_id", currentUser.uid);
        } else if (isDoctor) {
          query = query.eq("doctor_id", currentUser.uid);
        }

        const { data, error } = await query.order("appointment_date", {
          ascending: false,
        });

        if (error) throw error;

        setAppointments(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Unable to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
    fetchClinicRatings();
  }, [currentUser, isPatient, isDoctor]);

  const handleClinicSelect = (e) => {
    const clinicId = e.target.value;
    const clinic = clinicsData.find((c) => c.id === parseInt(clinicId));

    if (clinic) {
      setSelectedClinic(clinic);
      setBookingForm((prev) => ({
        ...prev,
        clinic_id: clinic.id,
        clinic_name: clinic.name,
        location: clinic.location,
        address: clinic.address,
        phone: clinic.phone,
      }));
    } else {
      setSelectedClinic(null);
      setBookingForm((prev) => ({
        ...prev,
        clinic_id: "",
        clinic_name: "",
        location: "",
        address: "",
        phone: "",
      }));
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (
      !bookingForm.clinic_name ||
      !bookingForm.appointment_date ||
      !bookingForm.appointment_time
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      let doctorId = null;

      if (isPatient) {
        const { data: assignments, error: assignmentError } = await supabase
          .from("doctor_patients")
          .select("doctor_id")
          .eq("patient_id", currentUser.uid)
          .eq("status", "active")
          .limit(1);

        if (assignmentError) throw assignmentError;

        if (assignments && assignments.length > 0) {
          doctorId = assignments[0].doctor_id;
        }
      }

      const newAppointment = {
        user_id: currentUser.uid,
        patient_name: userProfile?.full_name || currentUser.displayName,
        doctor_id: doctorId,
        clinic_name: bookingForm.clinic_name,
        appointment_date: bookingForm.appointment_date,
        appointment_time: bookingForm.appointment_time,
        location: bookingForm.location,
        address: bookingForm.address,
        phone: bookingForm.phone,
        reason: bookingForm.reason,
        notes: bookingForm.notes,
        status: "scheduled",
        created_at: new Date().toISOString(),
        clinic_rating: null,
      };

      const { data, error } = await supabase
        .from("appointments")
        .insert(newAppointment)
        .select()
        .single();

      if (error) throw error;

      setAppointments((prev) => [{ ...data }, ...prev]);

      setBookingForm({
        clinic_id: "",
        clinic_name: "",
        appointment_date: "",
        appointment_time: "",
        location: "",
        reason: "",
        notes: "",
        phone: "",
        address: "",
      });
      setSelectedClinic(null);
      setShowBookingModal(false);
      alert("Appointment booked successfully!");
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
        )
      );
      alert("Appointment cancelled successfully");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    if (!isDoctor) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "completed" } : apt
        )
      );
      alert("Appointment marked as completed");
    } catch (err) {
      console.error("Error completing appointment:", err);
      alert("Failed to complete appointment. Please try again.");
    }
  };

  const handleSetRating = async (appointmentId, rating) => {
    try {
      setRatingInProgress((prev) => ({ ...prev, [appointmentId]: rating }));

      const { error } = await supabase
        .from("appointments")
        .update({ clinic_rating: rating })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, clinic_rating: rating } : apt
        )
      );

      // Refresh aggregated clinic ratings
      await fetchClinicRatings();
      alert("Thank you for rating this clinic!");
    } catch (err) {
      console.error("Error saving rating:", err);
      alert("Failed to save rating. Please try again.");
    } finally {
      setRatingInProgress((prev) => {
        const copy = { ...prev };
        delete copy[appointmentId];
        return copy;
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const renderStars = (value, outOf = 5) => {
    const stars = [];
    const rounded = Math.round(value);
    for (let i = 1; i <= outOf; i++) {
      stars.push(
        <Star
          key={i}
          className="clinic-detail-icon"
          style={{
            color: i <= rounded ? "#f59e0b" : "#e5e7eb",
            width: "1rem",
            height: "1rem",
          }}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <div className="appointments-container">
          <header className="appointments-header">
            <h1 className="appointments-title">
              <Calendar className="title-icon" />
              {isDoctor ? "Patient Appointments" : "My Appointments"}
            </h1>
            <p className="appointments-subtitle">Loading appointments...</p>
          </header>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-page">
        <div className="appointments-container">
          <header className="appointments-header">
            <h1 className="appointments-title">
              <Calendar className="title-icon" />
              {isDoctor ? "Patient Appointments" : "My Appointments"}
            </h1>
            <p className="appointments-subtitle">Unable to load appointments</p>
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
    <div className="appointments-page">
      <div className="appointments-container">
        <header
          className="appointments-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1 className="appointments-title">
              <Calendar className="title-icon" />
              {isDoctor ? "Patient Appointments" : "My Appointments"}
            </h1>
            <p className="appointments-subtitle">
              {isDoctor
                ? `Managing ${appointments.length} appointment${
                    appointments.length !== 1 ? "s" : ""
                  }`
                : `You have ${appointments.length} appointment${
                    appointments.length !== 1 ? "s" : ""
                  }`}
            </p>
          </div>

          {isPatient && (
            <button
              onClick={() => setShowBookingModal(true)}
              className="add-member-btn"
              style={{ marginTop: 0 }}
            >
              <Plus className="btn-icon" />
              Book Appointment
            </button>
          )}
        </header>

        <div className="appointments-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({appointments.length})
          </button>
          <button
            className={`filter-btn ${
              filter === "scheduled" ? "active" : ""
            }`}
            onClick={() => setFilter("scheduled")}
          >
            Upcoming (
            {appointments.filter((a) => a.status === "scheduled").length})
          </button>
          <button
            className={`filter-btn ${
              filter === "completed" ? "active" : ""
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed (
            {appointments.filter((a) => a.status === "completed").length})
          </button>
          <button
            className={`filter-btn ${
              filter === "cancelled" ? "active" : ""
            }`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled (
            {appointments.filter((a) => a.status === "cancelled").length})
          </button>
        </div>

        <div className="appointments-list">
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <Calendar className="empty-icon" />
              <p className="empty-title">
                {filter === "all"
                  ? "No Appointments Yet"
                  : `No ${filter} appointments`}
              </p>
              <p className="empty-text">
                {filter === "all"
                  ? isDoctor
                    ? "You don't have any appointments scheduled with your patients yet."
                    : "You haven't booked any appointments yet."
                  : "Try changing the filter to see other appointments."}
              </p>

              {isPatient && filter === "all" && (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="empty-action-btn"
                >
                  <Plus className="empty-action-icon" />
                  Book Your First Appointment
                </button>
              )}
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-header-content">
                    <h2 className="appointment-clinic">
                      {appointment.clinic_name}
                    </h2>
                    <span
                      className="appointment-badge"
                      style={{
                        background:
                          appointment.status === "scheduled"
                            ? "#dbeafe"
                            : appointment.status === "completed"
                            ? "#d1fae5"
                            : appointment.status === "cancelled"
                            ? "#fee2e2"
                            : "#f3f4f6",
                        color:
                          appointment.status === "scheduled"
                            ? "#1e40af"
                            : appointment.status === "completed"
                            ? "#065f46"
                            : appointment.status === "cancelled"
                            ? "#991b1b"
                            : "#374151",
                        borderColor:
                          appointment.status === "scheduled"
                            ? "#bfdbfe"
                            : appointment.status === "completed"
                            ? "#a7f3d0"
                            : appointment.status === "cancelled"
                            ? "#fecaca"
                            : "#d1d5db",
                      }}
                    >
                      {appointment.status
                        .charAt(0)
                        .toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>

                  {appointment.status === "scheduled" && (
                    <button
                      onClick={() =>
                        handleCancelAppointment(appointment.id)
                      }
                      className="cancel-btn"
                      title="Cancel appointment"
                    >
                      <X className="cancel-icon" />
                    </button>
                  )}
                </div>

                <div className="appointment-body">
                  <div className="appointment-info-grid">
                    <div className="appointment-info-item">
                      <Calendar className="info-icon" />
                      <span className="info-text">
                        {formatDate(appointment.appointment_date)}
                      </span>
                    </div>

                    <div className="appointment-info-item">
                      <Clock className="info-icon" />
                      <span className="info-text">
                        {appointment.appointment_time || "N/A"}
                      </span>
                    </div>

                    <div className="appointment-info-item">
                      <MapPin className="info-icon" />
                      <span className="info-text">
                        {appointment.location || "N/A"}
                      </span>
                    </div>

                    {isDoctor && appointment.patient_name && (
                      <div className="appointment-info-item">
                        <User className="info-icon" />
                        <span className="info-text">
                          {appointment.patient_name}
                        </span>
                      </div>
                    )}
                  </div>

                  {appointment.reason && (
                    <div className="appointment-detail-box">
                      <p className="detail-text">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="appointment-detail-box">
                      <p className="detail-text">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Rating section for patients on completed appointments */}
                  {isPatient && appointment.status === "completed" && (
                    <div className="appointment-detail-box">
                      <p className="detail-text">
                        <strong>Rate this clinic:</strong>
                      </p>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              handleSetRating(appointment.id, star)
                            }
                            disabled={!!ratingInProgress[appointment.id]}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            <Star
                              style={{
                                color:
                                  (appointment.clinic_rating || 0) >= star
                                    ? "#f59e0b"
                                    : "#e5e7eb",
                                width: "1.25rem",
                                height: "1.25rem",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                      {appointment.clinic_rating && (
                        <p className="detail-text" style={{ marginTop: "0.25rem" }}>
                          Your rating: {appointment.clinic_rating} / 5
                        </p>
                      )}
                    </div>
                  )}

                  {/* Doctor actions */}
                  {isDoctor && appointment.status === "scheduled" && (
                    <div className="appointment-actions">
                      <button
                        onClick={() =>
                          handleCompleteAppointment(appointment.id)
                        }
                        className="complete-btn"
                      >
                        <CheckCircle className="complete-icon" />
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">Book an Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="modal-body">
              <div className="form-content">
                {/* CLINIC DROPDOWN */}
                <div className="form-field">
                  <label htmlFor="clinic_select" className="form-label">
                    <MapPin className="form-label-icon" />
                    Select Clinic *
                  </label>
                  <select
                    id="clinic_select"
                    value={bookingForm.clinic_id}
                    onChange={handleClinicSelect}
                    className="form-input"
                    required
                  >
                    <option value="">-- Choose a clinic --</option>
                    {clinicsData.map((clinic) => {
                      const ratingInfo =
                        clinicRatings[clinic.name] || null;
                      return (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name} - {clinic.location} (
                          {clinic.specialty}
                          {ratingInfo
                            ? `, ⭐ ${ratingInfo.avg.toFixed(
                                1
                              )} (${ratingInfo.count} ratings)`
                            : ""}
                          )
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* CLINIC DETAILS */}
                {selectedClinic && (
                  <div className="clinic-details-box">
                    <div className="clinic-detail-row">
                      <MapPin className="clinic-detail-icon" />
                      <span>{selectedClinic.address}</span>
                    </div>
                    <div className="clinic-detail-row">
                      <Phone className="clinic-detail-icon" />
                      <span>{selectedClinic.phone}</span>
                    </div>
                    <div className="clinic-detail-row">
                      <Clock className="clinic-detail-icon" />
                      <span>{selectedClinic.hours}</span>
                    </div>
                    <div className="clinic-detail-row">
                      {/* Combined: static + dynamic rating */}
                      {(() => {
                        const ratingInfo =
                          clinicRatings[selectedClinic.name] || null;
                        const avg =
                          ratingInfo?.avg ?? selectedClinic.rating;
                        const count =
                          ratingInfo?.count ?? selectedClinic.reviews;
                        return (
                          <>
                            {renderStars(avg)}
                            <span style={{ marginLeft: "0.4rem" }}>
                              {avg.toFixed(1)} / 5 ({count} reviews)
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* TIME SLOTS */}
                {selectedClinic && selectedClinic.available_slots && (
                  <div className="form-field">
                    <label className="form-label">
                      <Clock className="form-label-icon" />
                      Available Today
                    </label>
                    <div className="time-slots-grid">
                      {selectedClinic.available_slots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`time-slot-btn ${
                            bookingForm.appointment_time === slot
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => {
                            setBookingForm((prev) => ({
                              ...prev,
                              appointment_time: slot,
                              appointment_date:
                                new Date().toISOString().split("T")[0],
                            }));
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-grid-two">
                  <div className="form-field">
                    <label
                      htmlFor="appointment_date"
                      className="form-label"
                    >
                      <Calendar className="form-label-icon" />
                      Date *
                    </label>
                    <input
                      id="appointment_date"
                      type="date"
                      min={getMinDate()}
                      value={bookingForm.appointment_date}
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          appointment_date: e.target.value,
                        }))
                      }
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label
                      htmlFor="appointment_time"
                      className="form-label"
                    >
                      <Clock className="form-label-icon" />
                      Time *
                    </label>
                    <input
                      id="appointment_time"
                      type="time"
                      value={bookingForm.appointment_time}
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          appointment_time: e.target.value,
                        }))
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="reason" className="form-label">
                    <User className="form-label-icon" />
                    Reason for Visit
                  </label>
                  <input
                    id="reason"
                    type="text"
                    value={bookingForm.reason}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="e.g., Annual checkup, Follow-up"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="notes" className="form-label">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="form-input form-textarea"
                    placeholder="Any additional information..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedClinic(null);
                    setBookingForm({
                      clinic_id: "",
                      clinic_name: "",
                      appointment_date: "",
                      appointment_time: "",
                      location: "",
                      reason: "",
                      notes: "",
                      phone: "",
                      address: "",
                    });
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
                  <Calendar
                    className="btn-icon"
                    style={{ width: "1rem", height: "1rem" }}
                  />
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
