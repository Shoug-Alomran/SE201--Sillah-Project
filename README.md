# Sillah (صلة)

### Preventive Family Health Risk Detection System  
*SE201 – Introduction to Software Engineering Project*

---

## Overview
**Sillah (صلة)** is a Java-based preventive health awareness system that analyzes family medical history to detect hereditary risks — particularly **Sudden Cardiac Death (SCD)** and related conditions.  
It provides **smart alerts**, **educational resources**, and **clinic recommendations** to encourage early preventive screening.  

This project demonstrates the full **software engineering lifecycle**, from requirements and UML modeling to design and prototyping, following the **Layered + MVC** architectural pattern.

---

## Team Members
- **Shoug Alomran**  
- **Aljawarah Alsaleh**   
- **Aljawhara Alruzuq**
- **Aljoharah Albawardi**

---
## Credits

**Team Leader & Developer – Shoug Fawaz Alomran**  
Led the overall project development and documentation for *Sillah (صلة)*.  
Responsibilities included:
- Created and implemented the complete **Java prototype**, including the Family Health Tree, Alert System, Booking System, and Awareness Hub.  
- Designed the **Use Case Diagram** and coordinated updates across UML artifacts.  
- Compiled all deliverables into the final **master report**, integrating team diagrams, documents, and results.  
- Conducted **testing simulations**, ensured functionality matched user stories, and finalized the GitHub repository.  

**Aljawarah Alsaleh**  
- Designed the **System Sequence Diagrams (SSDs)** and **Class Diagram**.  
- Worked on the **Risk Alert Module design** and contributed to visual refinements.  
- Developed the **front-end graphical interface** and **team logo** using Figma and Sigma tools.  

**Aljawhara Alruzuq**  
- Authored the complete **Non-Functional Requirements (Phase II) document**.  
- Designed the **Activity Diagram** and worked on the **Awareness Hub structure**.  
- Collaborated on the **front-end interface** and **logo design** to align visual identity with system functionality.  

**Aljoharah Albawardi**  
- Created the **System Architecture Diagram** and defined the **3-Tier MVC structure**.  
- Designed **Clinic Locator mockups** and contributed to UI and presentation materials.  

---

## Objectives
- Promote early **preventive screening** through family history analysis.  
- Build a **simulated Java prototype** demonstrating risk detection and alert generation.  
- Apply **object-oriented principles** and **UML modeling** to a real-world public health use case.  

---

## Core Features (MVP)
1. **Add Family Members & Health History**  
   Users can record relatives and their medical events.  

2. **Risk Detection System**  
   The system applies hereditary rules (e.g., “≥2 first-degree relatives with SCD <50 years”) to trigger alerts.  

3. **Clinic Locator (Simulated)**  
   Displays a sample list of clinics for preventive checkups.  

4. **Awareness Hub**  
   Provides educational content and a checklist for screening readiness.  

---

## System Design
- **Architecture:** Layered + MVC  
- **Model Layer:** `User`, `FamilyMember`, `HealthEvent`, `Clinic`, `Appointment`  
- **Controller Layer:** `AlertSystem`, `BookingSystem`  
- **View Layer:** Console-based interaction (Java)  

---

## Technology Stack
| Component | Tool |
|------------|------|
| Programming Language | Java |
| IDE | Visual Studio Code |
| Version Control | Git & GitHub |
| UML Design | Lucidchart / Draw.io |

---

## How to Run the Prototype
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/SE201-Sillah.git

## Simulation Scenarios and Outputs

---

### Scenario 1: Low / No Risk Family
=== Sillah (صلة) Preventive Health System ===
--- Demo: Low/No Risk Family ---
=== Sillah (صلة) Preventive Health System ===
No immediate hereditary risk detected.
Recommended Clinic: Riyadh Heart Center
Booking appointment...
Appointment booked for Shoug Alomran at Riyadh Heart Center
=== End of Simulation ===

---

### Scenario 2: High Risk Family (two or more SCD relatives under 50)
=== Sillah (صلة) Preventive Health System ===
--- Demo: HIGH Risk Family ---
=== Sillah (صلة) Preventive Health System ===
High Risk: Multiple early SCD cases detected. Please schedule a preventive screening.
Recommended Clinic: Riyadh Heart Center
Booking appointment...
Appointment booked for Shoug Alomran at Riyadh Heart Center
=== End of Simulation ===

---

### Scenario 3: Awareness Hub Simulation
=== Awareness Hub ===
1) View Educational Topics
2) Preventive Checklist
0) Back to main menu
Enter choice: 1

Available Topics:
1) Understanding Sickle Cell Disease
2) Importance of Genetic Screening
3) Healthy Heart Tips
Select topic: 2
Genetic screening helps detect hereditary risks early.

Press ENTER to return to the menu...

=== Awareness Hub ===
1) View Educational Topics
2) Preventive Checklist
0) Back to main menu
Enter choice: 2

=== Preventive Checklist ===
[✓] Add family members to your health tree
[ ] Schedule your first screening
[ ] Read one Awareness article
Progress: 1/3 completed