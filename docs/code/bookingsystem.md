??? note "AlertSystem.java"
```java
public class BookingSystem {
    public Clinic findClinic(String name) {
        if (name != null && name.equalsIgnoreCase("Riyadh Heart Center"))
            return new Clinic("Riyadh Heart Center", "Riyadh");
        return new Clinic("General Health Clinic", "Riyadh");
    }

    // Book an appointment for the user at the specified clinic while validating
    // inputs
    public Appointment bookAppointment(User user, Clinic clinic) {
        if (user == null || clinic == null)
            throw new IllegalArgumentException("User and clinic are required");
        System.out.println("Booking appointment...");
        return new Appointment(user, clinic);
    }
}
```