// File: Main.java
public class Main {
    public static void main(String[] args) {
        Message msg = new Message(Lang.EN); // change to Lang.AR for Arabic
        System.out.println(msg.title());

        User user = new User("Shoug Alomran");

        FamilyMember father = new FamilyMember("Father", 55, "SCD");
        father.addHealthEvent(new HealthEvent("Hypertension", 50, "Mild blood pressure increase"));

        FamilyMember brother = new FamilyMember("Brother", 30);
        brother.addHealthEvent(new HealthEvent("Healthy", 0, "No recorded conditions"));

        user.addFamilyMember(father);
        user.addFamilyMember(brother);

        AlertSystem alertSystem = new AlertSystem();
        String alert = alertSystem.checkRisk(user);
        System.out.println(alert);

        BookingSystem bookingSystem = new BookingSystem();
        Clinic clinic = bookingSystem.findClinic("Riyadh Heart Center");
        System.out.println(msg.recommendedClinic() + clinic.getName());
        Appointment appointment = bookingSystem.bookAppointment(user, clinic);
        System.out.println("Appointment booked for " + appointment.getUser().getName()
                + " at " + appointment.getClinic().getName());

        System.out.println(msg.end());
    }
}
