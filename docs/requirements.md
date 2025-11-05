# Phase II – Requirements Analysis and Documentation

This phase defines the **functional** and **non-functional requirements** for the *Sillah (صلة)* Family Health Management System.  
All requirements were gathered from the proposal, user interviews, and system goals, then refined into clear, measurable items.

---

## 2.1 Functional Requirements

<details open>
<summary><strong>FR 1 – User Registration and Login</strong></summary>

- The system shall allow new users to register using a username, password, and contact details.  
- The system shall verify credentials for returning users.  
- The system shall allow password reset via registered email.
</details>

<details>
<summary><strong>FR 2 – Family Member Management</strong></summary>

- Users shall be able to add, edit, and remove family members.  
- Each record shall include name, age, relationship, and medical history.
</details>

<details>
<summary><strong>FR 3 – Appointment Booking and Scheduling</strong></summary>

- Users shall book, update, or cancel appointments with available clinics.  
- The system shall display available dates and times dynamically.
</details>

<details>
<summary><strong>FR 4 – Clinic Management</strong></summary>

- Clinics can register with working hours and available services.  
- The system shall store clinic profiles for user search and booking.
</details>

<details>
<summary><strong>FR 5 – Health Event Recording</strong></summary>

- Users shall record medical events (e.g., check-ups, test results).  
- The system shall store events per family member for future analysis.
</details>

<details>
<summary><strong>FR 6 – Alert and Reminder System</strong></summary>

- The system shall automatically generate alerts for upcoming appointments or due check-ups.  
- Users shall receive alert messages within the application.
</details>

<details>
<summary><strong>FR 7 – Awareness Hub</strong></summary>

- The system shall provide verified educational articles and tips.  
- Administrators shall be able to update awareness content.
</details>

<details>
<summary><strong>FR 8 – Risk Detection Logic</strong></summary>

- The system shall analyze stored family data to detect hereditary patterns.  
- When a pattern is detected, the user shall receive a preventive alert.
</details>

<details>
<summary><strong>FR 9 – Messaging and Notifications</strong></summary>

- The system shall enable in-app messages between users and clinics.  
- Each message shall include sender ID, receiver ID, timestamp, and content.
</details>

<details>
<summary><strong>FR 10 – System Administration</strong></summary>

- Admin users shall manage registered clinics, articles, and accounts.  
- Admins shall be able to generate reports on system usage.
</details>

---

## 2.2 Non-Functional Requirements

<details open>
<summary><strong>Performance and Efficiency (NFR 1-5)</strong></summary>

| # | Requirement |
|:--:|:-------------|
| 1 | System response time shall be ≤ 2 seconds for booking or alert operations. |
| 2 | The application shall support at least 100 concurrent users. |
| 3 | Database queries shall be optimized using indexed keys. |
| 4 | CPU usage shall remain below 80 % under peak load. |
| 5 | System startup time shall not exceed 5 seconds. |
</details>

<details>
<summary><strong>Usability and Accessibility (NFR 6-11)</strong></summary>

| # | Requirement |
|:--:|:-------------|
| 6 | Interface shall be intuitive with consistent layout and icons. |
| 7 | Buttons and text fields shall be labeled clearly. |
| 8 | System shall support both English and Arabic interfaces. |
| 9 | Font size and color contrast shall meet WCAG AA standards. |
| 10 | All alerts must be visible and accessible from the home dashboard. |
| 11 | Help tooltips shall be available for major features. |
</details>

<details>
<summary><strong>Reliability and Availability (NFR 12-15)</strong></summary>

| # | Requirement |
|:--:|:-------------|
| 12 | System uptime shall be ≥ 99 %. |
| 13 | Automatic backup shall occur every 24 hours. |
| 14 | In case of failure, data recovery shall occur within 5 minutes. |
| 15 | Error logs shall be stored securely and reviewed weekly. |
</details>

<details>
<summary><strong>Security and Privacy (NFR 16-22)</strong></summary>

| # | Requirement |
|:--:|:-------------|
| 16 | Passwords shall be encrypted using SHA-256. |
| 17 | Role-based access control shall restrict unauthorized actions. |
| 18 | Sensitive data (health records) must be stored encrypted. |
| 19 | System shall enforce automatic logout after 15 minutes idle. |
| 20 | Audit trail shall record all admin changes. |
| 21 | System shall comply with local Saudi data-protection laws. |
| 22 | All communication shall occur via secure HTTPS protocol. |
</details>

<details>
<summary><strong>Maintainability and Scalability (NFR 23-27)</strong></summary>

| # | Requirement |
|:--:|:-------------|
| 23 | Code shall follow modular OOP design. |
| 24 | Documentation shall be updated after every major release. |
| 25 | System shall support adding new modules without core changes. |
| 26 | Testing suite shall include unit and integration tests. |
| 27 | Database schema shall support future cloud migration. |
</details>

<details>
<summary><strong>Portability and Compatibility (NFR 28-32)</strong></summary>

| # | Requirement |
|:--:|:-------------|
| 28 | System shall run on Windows, macOS, and Linux with JDK ≥ 17. |
| 29 | Database engine shall be interchangeable (MySQL / PostgreSQL). |
| 30 | Front-end GUI shall be built using portable Java FX. |
| 31 | Exported reports shall be readable in common browsers. |
| 32 | System packaging shall use standard .jar distribution. |
</details>

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