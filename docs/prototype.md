# Phase IV – Prototype & Testing

This phase details the implementation, demonstration, and evaluation of the *Sillah (صلة) Family Health Management System* prototype. It validates how the design and requirements from previous phases were successfully transformed into a working Java application following software engineering best practices.

---

## 4.1 Prototype Overview

The *Sillah* system prototype was developed using **Java (JDK 17)** and demonstrates the use of **Object-Oriented Programming (OOP)** principles including encapsulation, inheritance, and modularity. It allows users to register, add family members, book appointments, receive health alerts, and view awareness content — all within a **Command-Line Interface (CLI)** environment.

> **Development Environment:** Visual Studio Code / IntelliJ IDEA  
> **Programming Language:** Java 17  
> **Paradigm:** Object-Oriented Programming  
> **Testing Types:** Unit Testing and Integration Testing

This prototype represents a complete, testable version of the system design presented in Phase III and serves as the foundation for future GUI or web expansion.

---

## 4.2 Implemented Modules

| Module | Description |
|:--------|:-------------|
| **Main.java** | Acts as the program entry point and manages the main menu navigation. |
| **User.java** | Handles user registration, login, and authentication. |
| **FamilyMember.java** | Stores and manages individual family members’ information. |
| **Appointment.java** | Manages booking, modification, and cancellation of appointments. |
| **Clinic.java** | Stores clinic data, working hours, and appointment slots. |
| **HealthEvent.java** | Records checkups and medical events such as ECG results. |
| **BookingSystem.java** | Connects user, clinic, and appointment modules for booking coordination. |
| **AlertSystem.java** | Automatically generates reminders and alerts for upcoming events. |
| **AwarenessHub.java** | Provides verified educational health content to users. |
| **Message.java** | Supports communication between users and clinics. |

Each class was independently implemented, compiled, and verified to ensure that all functional requirements were met.

---

## 4.3 Console Interaction Example

The prototype uses a **menu-driven console interface** where users interact with the system by selecting options.

```bash
--- Sillah (صلة) Family Health Management System ---

1) Register / Login
2) Add Family Member
3) Book Appointment
4) View Awareness Hub
5) Check Alerts
0) Exit
Select option: 3

Enter Family Member ID: FM01
Select Clinic: Al-Noor Cardiology Center
Enter Date (YYYY-MM-DD): 2025-11-10
Enter Time (HH:MM): 10:30
Appointment booked successfully!

Reminder set for: 2025-11-09 at 10:30 AM
```
### 4.3.1 Awareness Hub Example
--- Awareness Hub ---

1) Understanding Heart Disease
2) Importance of Regular Checkups
3) Early Warning Signs of Cardiac Risk
4) Family Genetics and Prevention

Select an article to read: 2

> Regular checkups help in early detection of hereditary risks
  and ensure timely medical intervention.

### 4.3.2 Alert Example
--- Alerts ---

Upcoming Appointment: Family Member (FM01)
Clinic: Al-Noor Cardiology Center
Date: 2025-11-10
Reminder: Tomorrow at 10:30 AM

## 4.4 System Screenshots

This section includes a visual demonstration of the *Sillah (صلة) Family Health Management System* prototype.  
Each figure represents a specific part of the system workflow captured during the execution phase.

| Figure | Description | Suggested File Name | Notes |
|:--------|:-------------|:--------------------|:------|
| **Figure 4.1** | Main Menu Interface showing all system options available to the user. | `main-menu.png` | Displayed when the program starts. |
| **Figure 4.2** | Appointment Booking Interface showing user input prompts and confirmation message. | `booking-interface.png` | Confirms data entry for family member, clinic, and time. |
| **Figure 4.3** | Alert Output displaying the generated reminder message for an upcoming appointment. | `alert-output.png` | Automatically created after booking confirmation. |
| **Figure 4.4** | Awareness Hub Display presenting selectable educational health topics. | `awareness-hub.png` | Provides interactive reading of awareness articles. |
| **Figure 4.5** | Future GUI Mockup demonstrating the proposed visual layout for the next system version. | `future-gui.png` | Illustrates potential upgrade from CLI to GUI. |

> **Note:** Place all corresponding images inside the folder `docs/img/` and ensure file names match those in the table above for proper linking in MkDocs.

You can include inline references below each figure like this:

```markdown
![Main Menu Interface](/img/main-menu.png)
*Figure 4.1: Main Menu Interface of the Sillah System*

![Appointment Booking Interface](/img/booking-interface.png)
*Figure 4.2: Appointment Booking Process*

![Alert Output](/img/alert-output.png)
*Figure 4.3: Example of Alert System Notification*

![Awareness Hub](/img/awareness-hub.png)
*Figure 4.4: Awareness Hub Display*

![Future GUI Mockup](/img/future-gui.png)
*Figure 4.5: Proposed GUI Design (Future Enhancement)*

## 4.4 Prototype Execution and Results

Below are the console interactions demonstrating key functionalities of the **Sillah (صلة)** Preventive Health Management System.

### Figure 4.1: System Startup Interface
![Sillah System Startup](/img/figure4-1.png)

### Figure 4.2: Low/No Risk Family Simulation
![Low/No Risk Family](/img/figure4-2.png)

### Figure 4.3: High Risk Family Simulation
![High Risk Family](/img/figure4-3.png)

### Figure 4.4: Awareness Hub Main Menu
![Awareness Hub Main Menu](/img/figure4-4.png)

### Figure 4.5: Educational Topics Menu
![Educational Topics Menu](/img/figure4-5.png)

### Figure 4.6: Educational Topic – Sickle Cell Disease
![Sickle Cell Topic](/img/figure4-6.png)

### Figure 4.7: Educational Topic – Genetic Screening
![Genetic Screening Topic](/img/figure4-7.png)

### Figure 4.8: Educational Topic – Healthy Heart Tips
![Healthy Heart Tips](/img/figure4-8.png)

### Figure 4.9: Preventive Checklist View
![Preventive Checklist](/img/figure4-9.png)

### Figure 4.10: Preventive Checklist Progress
![Checklist Progress](/img/figure4-10.png)

### Figure 4.11: Exit Interface
![Exit Interface](/img/figure4-11.png)