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
