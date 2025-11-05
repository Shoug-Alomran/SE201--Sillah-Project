# Sillah (صلة)

### Preventive Family Health Risk Detection System  
*SE201 – Introduction to Software Engineering Project*

[![Deploy MkDocs site to GitHub Pages](https://github.com/shoug-alomran/SE201--Sillah-Project/actions/workflows/deploy.yml/badge.svg)](https://github.com/shoug-alomran/SE201--Sillah-Project/actions/workflows/deploy.yml)

View Project Documentation:  
[https://shoug-alomran.github.io/SE201--Sillah-Project/](https://shoug-alomran.github.io/SE201--Sillah-Project/)

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
- Developed the **entire MkDocs documentation site** and automated deployment to **GitHub Pages**.  

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
| Documentation | MkDocs (Material Theme) |
| Deployment | GitHub Actions + Pages |

---

## How to Run the Prototype
1. Clone this repository:
   ```bash
   git clone https://github.com/shoug-alomran/SE201--Sillah-Project.git
