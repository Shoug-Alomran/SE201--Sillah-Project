public class Main {
    public static void main(String[] args) {
        System.out.println("=== Sillah (صلة) Preventive Health System ===");

        // Create a user
        User user = new User("Shou Alomran");

        // Add family members
        FamilyMember f1 = new FamilyMember("Father", 45, "SCD");
        FamilyMember f2 = new FamilyMember("Brother", 30, "Healthy");
        user.addFamilyMember(f1);
        user.addFamilyMember(f2);

        // Check risk
        AlertSystem alertSystem = new AlertSystem();
        String alert = alertSystem.checkRisk(user);
        System.out.println(alert);

        // Show available clinics
        BookingSystem bookingSystem = new BookingSystem();
        Clinic clinic = bookingSystem.findClinic("Riyadh Heart Center");
        if (clinic != null) {
            System.out.println("Recommended Clinic: " + clinic.getName());
        }

        // Book appointment
        Appointment appointment = bookingSystem.bookAppointment(user, clinic);
        System.out.println("Appointment booked for " + appointment.getUser().getName() +
                " at " + appointment.getClinic().getName());
                System.out.println("=== End of Simulation ===");
    }
}
