# Phase III – System Design

This section describes the detailed **system architecture**, **UML models**, and **key design principles** applied in the *Sillah (صلة) Family Health Management System*.  
The design ensures clarity, modularity, and extensibility, aligning with software engineering best practices taught in SE201.

---

## 3.1 System Architecture

The *Sillah* system adopts a **three-layer architecture** that separates the presentation, domain, and integration responsibilities.  
This layered design improves maintainability and simplifies testing.

1. **Presentation Layer:**  
   Handles all user interaction. In this prototype, interaction occurs through a command-line interface managed by the `Main` class.

2. **Domain Layer:**  
   Implements the business logic and core functionality of the system.  
   This includes classes such as `User`, `FamilyMember`, `Appointment`, `Clinic`, `HealthEvent`, `Message`, `BookingSystem`, `AlertSystem`, and `AwarenessHub`.

3. **Integration Layer:**  
   Represents future connectivity with external systems like a database, notification services, or APIs.

> **Figure 1:** System Architecture Overview  
> *(Insert your architecture diagram image here – e.g., “architecture-diagram.png”)*

The three layers communicate through well-defined interfaces.  
For instance, the `BookingSystem` acts as the mediator between the user’s requests and the domain entities like `Clinic` and `Appointment`.

---

## 3.2 Class Design

The class structure of *Sillah* reflects clear object-oriented design and encapsulation.  
Each class is responsible for a specific aspect of the system’s functionality.

| Class | Responsibility |
|:------|:----------------|
| **User** | Represents a registered user, manages authentication and profile updates. |
| **FamilyMember** | Stores family members’ health details and links to related appointments or health events. |
| **Appointment** | Manages booking, cancellation, and completion logic. |
| **Clinic** | Defines clinic information, available slots, and booking status. |
| **HealthEvent** | Represents a medical event (checkup, ECG, vaccine) related to a family member. |
| **BookingSystem** | Core controller that validates availability, manages bookings, and updates appointments. |
| **AlertSystem** | Handles generation of alerts and reminders for upcoming appointments. |
| **AwarenessHub** | Provides access to educational health articles and awareness materials. |
| **Message** | Enables in-system messaging between users and clinics. |
| **Main** | Serves as the entry point that coordinates all modules and simulates system operation. |

> **Figure 2:** UML Class Diagram  
> *(Insert your class diagram here – e.g., “class-diagram.png”)*

In the UML diagram, the relationships between classes highlight key interactions such as:
- A `User` manages multiple `FamilyMember` records.  
- Each `FamilyMember` can have several `HealthEvent` and `Appointment` objects.  
- `BookingSystem` interacts with `Clinic` and `AlertSystem` to manage schedules and reminders.  
- `AwarenessHub` connects to `User` to provide educational content.  
- The `Message` class supports communication between users and clinics.

---

## 3.3 Use Case Design

The use case model defines how different system actors interact with the system.  
The main actors include:
- **User:** Registers, manages family information, books appointments, and receives alerts.  
- **Clinic:** Manages schedules and confirms or cancels appointments.  
- **Administrator:** Manages clinic profiles and awareness content.

### Primary Use Cases
1. Register and login to the system.  
2. Add, update, or remove family members.  
3. Book and cancel clinic appointments.  
4. Record health events for family members.  
5. Receive alerts and reminders for upcoming medical activities.  
6. View awareness articles and health recommendations.  
7. Message clinics for inquiries or appointment changes.  
8. Manage system content (administrator only).

> **Figure 3:** Use Case Diagram  
> *(Insert your use case diagram here – e.g., “use-case-diagram.png”)*

Each use case in the diagram illustrates how users and clinics interact with the core subsystems, highlighting the sequence of communication between modules.

---

## 3.4 Sequence Design

To illustrate the system flow, consider the **appointment booking scenario**, which demonstrates the interaction between key classes.

### Example Sequence: Booking a Clinic Appointment
1. The **user** selects a family member and chooses the “Book Appointment” option.  
2. The **BookingSystem** checks available slots in the **Clinic**.  
3. If a slot is available, the system creates a new **Appointment** and confirms it.  
4. The **AlertSystem** automatically schedules a reminder for the appointment.  
5. The user receives confirmation through a message and alert notification.

> **Figure 4:** Sequence Diagram – Appointment Booking Flow  
> *(Insert your sequence diagram here – e.g., “sequence-diagram.png”)*

This design ensures proper communication between independent modules and prevents data duplication.

---

## 3.5 Design Principles Applied

The following software engineering principles were applied throughout the project:

| Principle | Description |
|:-----------|:-------------|
| **Single Responsibility Principle (SRP)** | Each class serves one clear purpose (e.g., `AlertSystem` only manages alerts). |
| **Encapsulation** | All data is private and accessible only through public methods. |
| **Inheritance** | Common attributes are reusable (e.g., `User` → `FamilyMember`). |
| **Abstraction** | Complex logic is hidden behind clean, accessible methods. |
| **Modularity** | System divided into independent, testable modules. |
| **Extensibility** | Architecture allows adding new modules (e.g., database) without refactoring existing code. |

---

## 3.6 Requirements-to-Design Mapping

| Requirement | Corresponding Design Component |
|:-------------|:-------------------------------|
| User authentication and registration | `User` class |
| Manage family members | `FamilyMember` and `HealthEvent` classes |
| Appointment booking and cancellation | `BookingSystem`, `Appointment`, `Clinic` |
| Alerts and reminders | `AlertSystem` |
| Awareness content | `AwarenessHub` |
| Messaging system | `Message` |
| Administrative control | `AwarenessHub`, `Clinic`, `User` (admin roles) |

This mapping ensures every functional requirement from Phase II is represented by a clear design element.

---

## 3.7 Key Design Decisions

1. **Layered Architecture:** Improves separation of concerns and future scalability.  
2. **Centralized Control via BookingSystem:** Simplifies scheduling logic and error handling.  
3. **OOP-Based Reusability:** Common methods are reused across multiple modules.  
4. **Lightweight AlertSystem:** Designed to be stateless and event-driven for efficiency.  
5. **Independent AwarenessHub:** Allows updating articles without affecting the booking workflow.  
6. **Future Database Support:** Class structure already accommodates persistent storage integration.

---

## 3.8 Future Enhancements

The current design provides a functional, console-based prototype.  
The following improvements are recommended for future development:

- Add **persistent database storage** using MySQL or PostgreSQL.  
- Replace CLI with a **JavaFX graphical interface**.  
- Enable **real-time notifications** via email or SMS.  
- Integrate **role-based dashboards** for users, clinics, and administrators.  
- Extend the system to include **mobile app support** for Android and iOS.  
- Include **data analytics** for public health insights.

> **Figure 5:** Suggested Extended Architecture  
> *(Insert your future system diagram – e.g., “future-architecture.png”)*

---

## 3.9 Summary

The *Sillah (صلة)* Family Health Management System was designed to reflect robust, scalable, and maintainable software engineering principles.  
Each component was structured for clarity and reusability, ensuring that future developers can extend the system easily with minimal coupling.

The next phase, **Prototype & Testing**, demonstrates how this design translates into a working implementation and validates system performance and correctness.