# Phase II – Requirements Analysis and Documentation

This phase defines the **functional** and **non-functional requirements** for the *Sillah (صلة)* Family Health Management System.  
All requirements were gathered from the proposal, user interviews, and system goals, then refined into clear, measurable items.

---

## 2.1 Functional Requirements

| ID | Requirement | Description | Priority |
|:--:|:-------------|:-------------|:-----------:|
| **FR-01** | **User Registration and Login** | The system shall allow new users to register and returning users to log in securely. | High |
| **FR-02** | **Add Family Member** | Users can record family members with name, relation, age, and health condition. | High |
| **FR-03** | **Add Health Event** | Users can specify a condition (e.g., SCD, hypertension) and age of onset. | High |
| **FR-04** | **Generate Risk Alert** | The system automatically analyzes data and generates hereditary risk alerts. | High |
| **FR-05** | **Book Clinic Appointment** | Users can select an available clinic and confirm booking. | Medium |
| **FR-06** | **View Awareness Content** | Users can access educational material and preventive checklists in the Awareness Hub. | Medium |
| **FR-07** | **View Alert History** | Users can view and track previous alerts. | Low |
| **FR-08** | **Risk Detection Logic** | The system shall identify patterns such as ≥2 relatives with SCD under age 50 and classify risk level. | High |
| **FR-09** | **Messaging / Notifications** | The system shall display alert and confirmation messages within the interface. | Medium |
| **FR-10** | **Administrator Management** | Administrators can manage awareness content, clinics, and users. | Medium |

---

## 2.2 Non-Functional Requirements

The following Non-Functional Requirements (NFRs) ensure that the *Sillah (صلة) Family Health Management System* prototype is usable, reliable, and secure for all user types.  
Items marked **[Conceptual]** are considered future or production-level requirements.

---

### 2.2.1 Usability Requirements

| ID | Requirement | Description | Priority |
|:--:|:-------------|:-------------|:-----------:|
| **UR-01** | **Mobile-First Responsive Design** | Interface must be optimized for mobile and desktop layouts. | Critical |
| **UR-02** | **WCAG 2.1 Level AA Accessibility** | Must follow international accessibility standards for readability and navigation. | High |
| **UR-03** | **Task Completion Efficiency** | Users should complete key actions (add family, book appointment) in under 5 minutes. | High |
| **UR-04** | **Bilingual Interface (Arabic & English)** | Full Arabic and English language support with correct RTL layout. | High |
| **UR-05** | **Clear Error Messages & Guidance** | Errors must be polite, descriptive, and placed near the input fields. | High |
| **UR-06** | **Intuitive Information Architecture** | Navigation and structure must be logical and easy to follow. | High |
| **UR-07** | **Consistent Design System** | Icons, colors, and fonts must follow a uniform design pattern. | Medium |
| **UR-08** | **Onboarding & First-Time UX** | First-time users should see short instructions explaining each feature. | Medium |
| **UR-09** | **Plain-Language Readability** | All on-screen text must be written in clear, non-technical language. | Medium |
| **UR-10** | **Visual Feedback & System Status** | The system must show feedback (e.g., “Booking successful”) after user actions. | Medium |
| **UR-11** | **Help & Support Access** | Quick-help tooltips and “Help” links must be accessible from all screens. | Low |
| **UR-12** | **System Usability Scale (SUS)** | The prototype shall score ≥ 80 % on usability evaluation during testing. | Low |

---

### 2.2.2 Reliability Requirements

| ID | Requirement | Description | Priority |
|:--:|:-------------|:-------------|:-----------:|
| **RR-01** | **Availability & Uptime [Conceptual]** | The production system should maintain ≥ 99.5 % uptime. | Critical |
| **RR-02** | **Backup & Disaster Recovery [Conceptual]** | Automatic backups and recovery within 5 minutes in case of failure. | Critical |
| **RR-03** | **Graceful Degradation & Fault Tolerance** | The system should continue functioning partially even if one module fails. | High |
| **RR-04** | **Data Accuracy & Integrity** | Risk calculations and family data must remain accurate and consistent. | Critical |
| **RR-05** | **Browser & Device Compatibility** | The system must run correctly on Chrome, Safari, and Edge browsers. | High |
| **RR-06** | **Performance Under Load [Conceptual]** | Response time under 2 s for up to 100 concurrent users. | Medium |
| **RR-07** | **Content Consistency & Currency** | Awareness Hub content must remain accurate and updated. | Medium |
| **RR-08** | **Session Reliability & State** | Sessions should persist during temporary connection drops. | Medium |
| **RR-09** | **API Reliability & Error Handling** | API calls should handle errors gracefully and retry if needed. | Medium |
| **RR-10** | **Notification Delivery Reliability** | Alerts and reminders must always be delivered successfully. | Medium |

---

### 2.2.3 Security Requirements

| ID | Requirement | Description | Priority |
|:--:|:-------------|:-------------|:-----------:|
| **SR-01** | **Encryption at Rest [Conceptual]** | All sensitive health data stored in the database must be encrypted. | Critical |
| **SR-02** | **Encryption in Transit [Conceptual]** | All communication between client and server must use HTTPS/TLS. | Critical |
| **SR-03** | **Authentication** | Users must log in securely using unique credentials. | Critical |
| **SR-04** | **Role-Based Access Control (RBAC)** | Access must be restricted by role (Citizen, Provider, Admin). | Critical |
| **SR-05** | **Consent Management** | Users must explicitly agree to data collection before use. | High |
| **SR-06** | **Audit Logging** | System must track all admin edits and major data changes. | High |
| **SR-07** | **Input Validation & Sanitization** | Prevent invalid data entry and block malicious input (e.g., XSS). | High |
| **SR-08** | **Privacy by Design – Data Minimization** | Only essential data is stored, following Saudi PDPL compliance. | High |
| **SR-09** | **Secure Password Reset** | Password resets require identity verification and token validation. | High |
| **SR-10** | **Awareness Hub Content Security** | Educational materials must be editable only by administrators. | Medium |

---

## 2.3 System Models and Actors

| Actor | Role | Responsibilities |
|:------|:------|:----------------|
| User | Primary actor | Registers, manages family members, books appointments |
| Clinic | External actor | Accepts and manages bookings |
| Administrator | Support actor | Maintains awareness content and user accounts |

---

## 2.4 Constraints and Assumptions

- Development language: **Java 17 (OOP)**  
- Database engine: MySQL Community Edition  
- GUI framework: Java FX  
- Operating system tested: Windows 11 and macOS Sonoma  
- Assumption: Internet connection available for updates and alerts.  

---

> These requirements serve as the foundation for the **Design Phase**, where system architecture and class interactions are detailed.