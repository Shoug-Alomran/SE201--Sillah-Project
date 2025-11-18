import React from 'react';
import { AlertTriangle, Info, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function AlertCard({ alert, onMarkRead, onViewDetails }) {
  const getAlertIcon = (type) => {
    const icons = {
      'High Risk': <AlertTriangle className="w-5 h-5" />,
      'Moderate Risk': <AlertCircle className="w-5 h-5" />,
      'Low Risk': <CheckCircle className="w-5 h-5" />,
      'Information': <Info className="w-5 h-5" />
    };
    return icons[type] || icons['Information'];
  };

  const getAlertColor = (type) => {
    const colors = {
      'High Risk': 'from-red-500 to-rose-600',
      'Moderate Risk': 'from-amber-500 to-orange-600',
      'Low Risk': 'from-green-500 to-emerald-600',
      'Information': 'from-blue-500 to-cyan-600'
    };
    return colors[type] || colors['Information'];
  };

  const getBorderColor = (type) => {
    const colors = {
      'High Risk': 'border-l-red-500',
      'Moderate Risk': 'border-l-amber-500',
      'Low Risk': 'border-l-green-500',
      'Information': 'border-l-blue-500'
    };
    return colors[type] || colors['Information'];
  };

  return (
    <div className={`alert-card ${getBorderColor(alert.alert_type)} ${!alert.is_read ? 'alert-unread' : ''}`}>
      <div className="alert-card-header">
        <div className="alert-header-content">
          <div className={`alert-icon-wrapper bg-gradient-to-br ${getAlertColor(alert.alert_type)}`}>
            {getAlertIcon(alert.alert_type)}
          </div>
          <div className="alert-header-info">
            <h3 className="alert-title">{alert.title}</h3>
            <p className="alert-date">
              {format(new Date(alert.created_date), 'MMM d, yyyy • h:mm a')}
            </p>
          </div>
        </div>
        {!alert.is_read && (
          <span className="alert-new-badge">New</span>
        )}
      </div>

      <div className="alert-card-body">
        <p className="alert-message">{alert.message}</p>

        {alert.risk_factors && alert.risk_factors.length > 0 && (
          <div className="alert-risk-factors">
            <h4 className="risk-factors-title">Risk Factors Identified:</h4>
            <ul className="risk-factors-list">
              {alert.risk_factors.map((factor, idx) => (
                <li key={idx} className="risk-factor-item">
                  <span className="risk-bullet">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {alert.recommendation && (
          <div className={`alert-recommendation bg-gradient-to-r ${getAlertColor(alert.alert_type)}`}>
            <h4 className="recommendation-title">Recommendation:</h4>
            <p className="recommendation-text">{alert.recommendation}</p>
          </div>
        )}

        <div className="alert-actions">
          {!alert.is_read && (
            <button
              className="mark-read-btn"
              onClick={() => onMarkRead(alert.id)}
            >
              Mark as Read
            </button>
          )}
          <button
            className="learn-more-btn"
            onClick={() => onViewDetails(alert)}
          >
            <ExternalLink className="btn-icon-small" />
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}