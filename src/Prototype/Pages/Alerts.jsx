import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, ExternalLink } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";

export default function Alerts() {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAlerts();
  }, [currentUser]);

  async function fetchAlerts() {
    if (!currentUser) {
      setError("Please log in to view alerts");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", currentUser.uid)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAlerts(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Unable to load alerts");
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAsRead = async (alertId) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    } catch (err) {
      console.error("Error marking alert as read:", err);
      alert("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadAlerts = alerts.filter(a => !a.is_read);

      const { error } = await supabase
        .from("alerts")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .in("id", unreadAlerts.map(a => a.id));

      if (error) throw error;

      setAlerts(alerts.map(alert => ({ ...alert, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
      alert("Failed to mark all as read");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " · " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const getFilteredAlerts = () => {
    switch (filter) {
      case "unread":
        return alerts.filter(a => !a.is_read);
      case "read":
        return alerts.filter(a => a.is_read);
      case "high":
        return alerts.filter(a => a.priority === "high");
      case "moderate":
        return alerts.filter(a => a.priority === "moderate");
      default:
        return alerts;
    }
  };

  const filteredAlerts = getFilteredAlerts();
  const unreadCount = alerts.filter(a => !a.is_read).length;

  if (loading) {
    return (
      <div className="alerts-page">
        <div className="alerts-container">
          <h1 className="alerts-title">
            <Bell className="title-icon" />
            Medical Alerts
          </h1>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alerts-page">
        <div className="alerts-container">
          <h1 className="alerts-title">
            <Bell className="title-icon" />
            Alerts & Reminders
          </h1>
          <div className="error-state">
            <AlertTriangle className="error-icon" />
            <p className="error-title">{error}</p>
            <p className="error-text">Please check your connection or try again later.</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-page">
      <div className="alerts-container">
        <div className="alerts-header">
          <div>
            <h1 className="alerts-title">
              <Bell className="title-icon" />
              Medical Alerts
            </h1>
            <p className="alerts-subtitle">
              {unreadCount} unread reminder{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="mark-all-btn">
              <CheckCircle className="btn-icon" />
              Mark All as Read
            </button>
          )}
        </div>

        <div className="alerts-filters">
          <button onClick={() => setFilter("all")} className={`filter-tab ${filter === "all" ? "active" : ""}`}>
            All Alerts
          </button>
          <button onClick={() => setFilter("unread")} className={`filter-tab ${filter === "unread" ? "active" : ""}`}>
            Unread
          </button>
          <button onClick={() => setFilter("read")} className={`filter-tab ${filter === "read" ? "active" : ""}`}>
            Read
          </button>
          <button onClick={() => setFilter("high")} className={`filter-tab ${filter === "high" ? "active" : ""}`}>
            High Risk
          </button>
          <button onClick={() => setFilter("moderate")} className={`filter-tab ${filter === "moderate" ? "active" : ""}`}>
            Moderate
          </button>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <Bell className="empty-icon" />
            <p className="empty-title">No Alerts</p>
            <p className="empty-text">
              {filter === "all"
                ? "You're all caught up! No alerts at this time."
                : `No ${filter} alerts found.`}
            </p>
          </div>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map((alertItem) => (
              <div key={alertItem.id} className={`alert-card ${!alertItem.is_read ? "unread" : ""}`}>
                <div className="alert-card-header">
                  <div className="alert-icon-wrapper">
                    <Info className="alert-icon" />
                  </div>
                  <div className="alert-header-content">
                    <div className="alert-title-row">
                      <h3 className="alert-title">{alertItem.title}</h3>
                      {!alertItem.is_read && <span className="new-badge">New</span>}
                    </div>
                    <p className="alert-date">{formatDate(alertItem.created_at)}</p>
                  </div>
                </div>

                <div className="alert-card-body">
                  <p className="alert-message">{alertItem.message}</p>

                  {alertItem.recommendation && (
                    <div className="recommendation-box">
                      <strong>Recommendation:</strong>
                      <p>{alertItem.recommendation}</p>
                    </div>
                  )}

                  <div className="alert-actions">
                    {!alertItem.is_read && (
                      <button onClick={() => handleMarkAsRead(alertItem.id)} className="mark-read-btn">
                        Mark as Read
                      </button>
                    )}
                    {alertItem.link && (
                      <button onClick={() => window.open(alertItem.link, "_blank")} className="learn-more-btn">
                        <ExternalLink size={16} />
                        Learn More
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
