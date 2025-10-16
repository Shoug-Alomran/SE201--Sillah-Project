public class Appointment {
    private User user;
    private Clinic clinic;

    public Appointment(User user, Clinic clinic) {
        this.user = user;
        this.clinic = clinic;
    }

    public User getUser() {
        return user;
    }

    public Clinic getClinic() {
        return clinic;
    }
}