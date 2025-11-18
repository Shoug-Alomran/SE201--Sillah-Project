import React, { useState, useEffect } from "react";
import { Bell, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Alerts() {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read

  // Fetch alerts from Firestore
  useEffect(() => {
    async function fetchAlerts() {
      if (!currentUser) {
        setError("Please log in to view alerts");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const alertsRef = collection(db, "alerts");
        const q = query(
          alertsRef,
          where("user_id", "==", currentUser.uid),
          orderBy("created_at", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const alertsData = [];
        querySnapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() });
        });
        
        setAlerts(alertsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Unable to load alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, [currentUser]);

  // Mark alert as read
  const markAsRead = async (alertId) => {
    try {
      const alertRef = doc(db, "alerts", alertId);
      await updateDoc(alertRef, {
        is_read: true,
        read_at: new Date().toISOString()
      });
      
      // Update local state
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    } catch (err) {
      console.error("Error marking alert as read:", err);
      alert("Failed to mark as read. Please try again.");
    }
  };

  // Delete alert
  const deleteAlert = async (alertId) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    try {
      await deleteDoc(doc(db, "alerts", alertId));
      
      // Update local state
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error("Error deleting alert:", err);
      alert("Failed to delete alert. Please try again.");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadAlerts = alerts.filter(a => !a.is_read);
    
    try {
      const updatePromises = unreadAlerts.map(alert => 
        updateDoc(doc(db, "alerts", alert.id), {
          is_read: true,
          read_at: new Date().toISOString()
        })
      );
      
      await Promise.all(updatePromises);
      
      // Update local state
      setAlerts(alerts.map(alert => ({ ...alert, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
      alert("Failed to mark all as read. Please try again.");
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filter === "unread") return !alert.is_read;
    if (filter === "read") return alert.is_read;
    return true; // "all"
  });

  const unreadCount = alerts.filter(a => !a.is_read).length;

  // Get alert type styling
  const getAlertTypeStyle = (type) => {
    const styles = {
      reminder: "border-l-blue-500 bg-blue-50",
      warning: "border-l-amber-500 bg-amber-50",
      info: "border-l-teal-500 bg-teal-50",
      success: "border-l-green-500 bg-green-50",
    };
    return styles[type] || "border-l-gray-500 bg-gray-50";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="appointments-page">
        <div className="appointments-container">
          <header className="appointments-header">
            <h1 className="appointments-title">
              <Bell className="title-icon" />
              Alerts & Reminders
            </h1>
            <p className="appointments-subtitle">Loading your alerts...</p>
          </header>
          <div className="empty-state">
            <Bell className="empty-icon" style={{ animation: "pulse 2s infinite" }} />
            <p className="empty-title">Loading Alerts...</p>
            <p className="empty-text">Please wait while we fetch your notifications.</p>
          </div>
        </div>
      </div>
    );
  }

  // ---- Error State ----
  if (error) {
    return (
      <div className="appointments-page">
        <div className="appointments-container">
          <header className="appointments-header">
            <h1 className="appointments-title">
              <Bell className="title-icon" />
              Alerts & Reminders
            </h1>
            <p className="appointments-subtitle">Unable to load alerts</p>
          </header>
          <div className="empty-state">
            <AlertTriangle className="empty-icon" style={{ color: "#ef4444" }} />
            <p className="empty-title">{error}</p>
            <p className="empty-text">Please check your connection or try again later.</p>
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

  // ---- Main UI ----
  return (
    <div className="appointments-page">
      <div className="appointments-container">
        {/* Header */}
        <header className="appointments-header">
          <h1 className="appointments-title">
            <Bell className="title-icon" />
            Alerts & Reminders
          </h1>
          <p className="appointments-subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up! 🎉"}
          </p>
        </header>

        {/* Filters */}
        <div className="appointments-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({alerts.length})
          </button>
          <button
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            Read ({alerts.length - unreadCount})
          </button>
          
          {unreadCount > 0 && (
            <button
              className="filter-btn"
              onClick={markAllAsRead}
              style={{ marginLeft: "auto", background: "#14b8a6", color: "white" }}
            >
              <CheckCircle className="btn-icon-small" />
              Mark All Read
            </button>
          )}
        </div>

        {/* Alerts List */}
        <div className="appointments-list">
          {filteredAlerts.length === 0 ? (
            <div className="empty-state">
              <Bell className="empty-icon" />
              <h2 className="empty-title">
                {filter === "unread" ? "No unread alerts" : 
                 filter === "read" ? "No read alerts" : 
                 "No alerts yet"}
              </h2>
              <p className="empty-text">
                {filter === "all" 
                  ? "When you have new alerts, they'll appear here."
                  : "Try changing the filter to see other alerts."}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`appointment-card ${!alert.is_read ? "alert-unread" : ""}`}
              >
                <div className="appointment-header">
                  <div className="appointment-header-content">
                    <h2 className="appointment-clinic">
                      {alert.title}
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {!alert.is_read && (
                        <span className="appointment-badge" style={{
                          background: "#14b8a6",
                          color: "white",
                          border: "none"
                        }}>
                          New
                        </span>
                      )}
                      <span className={`appointment-badge ${
                        alert.alert_type === "warning" ? "badge-warning" :
                        alert.alert_type === "success" ? "badge-success" :
                        alert.alert_type === "info" ? "badge-info" : ""
                      }`}>
                        {alert.alert_type || "info"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="appointment-body">
                  <div className="appointment-detail-box">
                    <p className="detail-text">{alert.message}</p>
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #f3f4f6"
                  }}>
                    <p className="appointment-item-details">
                      {formatDate(alert.created_at)}
                    </p>
                    
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {!alert.is_read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="complete-btn"
                          style={{ fontSize: "0.875rem", padding: "0.5rem 0.75rem" }}
                        >
                          <CheckCircle className="complete-icon" />
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="cancel-btn"
                        style={{ padding: "0.5rem" }}
                      >
                        <Trash2 className="cancel-icon" style={{ width: "1rem", height: "1rem" }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}