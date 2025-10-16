public class BookingSystem {

    public Clinic findClinic(String name) {
        // In a real system, this would search a database.
        // Here, we return a sample clinic for demo purposes.
        if (name.equalsIgnoreCase("Riyadh Heart Center")) {
            return new Clinic("Riyadh Heart Center", "Riyadh");
        } else {
            return new Clinic("General Health Clinic", "Riyadh");
        }
    }

    public Appointment bookAppointment(User user, Clinic clinic) {
        System.out.println("Booking appointment...");
        return new Appointment(user, clinic);
    }
}
