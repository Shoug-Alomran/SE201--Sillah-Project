import java.util.Scanner;

public class Main {
    private static final String Title = "=== Sillah (صلة) Preventive Health System ===";

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        while (true) {
            printMenu();
            String choice = sc.nextLine().trim();

            if ("1".equals(choice)) {
                runLowRiskDemo();
            } else if ("2".equals(choice)) {
                runHighRiskDemo(); // shows the high-risk alert scenario
            } else if ("0".equals(choice)) {
                System.out.println("Goodbye!");
                break;
            } else {
                System.out.println("Invalid choice. Please select 1, 2, or 0.");
            }

            System.out.println(); // spacing between runs
            System.out.println("Press ENTER to return to the menu...");
            sc.nextLine();
        }

        sc.close();
    }

    private static void printMenu() {
        System.out.println();
        System.out.println(Title);
        System.out.println("Select a demo scenario:");
        System.out.println("  1) Low/No Risk family (baseline)");
        System.out.println("  2) High Risk family (>=2 SCD relatives under 50)");
        System.out.println("  0) Exit");
        System.out.print("Enter choice: ");
    }

    // === Scenario 1: Your existing baseline (no immediate hereditary risk) ===
    private static void runLowRiskDemo() {
        System.out.println();
        System.out.println("--- Demo: Low/No Risk Family ---");

        User user = new User("Shoug Alomran");

        // Family: one SCD relative < 50 and one healthy → should be "No immediate
        // hereditary risk"
        FamilyMember f1 = new FamilyMember("Father", 55, "Healthy");
        FamilyMember f2 = new FamilyMember("Brother", 30, "Healthy");
        user.addFamilyMember(f1);
        user.addFamilyMember(f2);

        runFlow(user);
    }

    // === Scenario 2: High-risk example (2 relatives with SCD under 50) ===
    private static void runHighRiskDemo() {
        System.out.println();
        System.out.println("--- Demo: HIGH Risk Family ---");

        User user = new User("Shoug Alomran");

        // Two relatives with SCD and age < 50 → should trigger High Risk alert
        FamilyMember f1 = new FamilyMember("Father", 45, "SCD");
        FamilyMember f2 = new FamilyMember("Brother", 30, "SCD");
        // Add a third relative just to show variety (optional)
        FamilyMember f3 = new FamilyMember("Mother", 48, "Healthy");

        user.addFamilyMember(f1);
        user.addFamilyMember(f2);
        user.addFamilyMember(f3);

        runFlow(user);
    }

    // Shared flow: risk check → recommend clinic → book appointment
    private static void runFlow(User user) {
        System.out.println(Title);

        AlertSystem alertSystem = new AlertSystem();
        String alert = alertSystem.checkRisk(user);
        System.out.println(alert);

        BookingSystem bookingSystem = new BookingSystem();
        Clinic clinic = bookingSystem.findClinic("Riyadh Heart Center");
        if (clinic != null) {
            System.out.println("Recommended Clinic: " + clinic.getName());
        } else {
            System.out.println("No clinic found. Using default clinic.");
            clinic = new Clinic("General Health Clinic", "Riyadh");
        }

        System.out.println("Booking appointment...");
        Appointment appointment = bookingSystem.bookAppointment(user, clinic);
        System.out.println("Appointment booked for " + appointment.getUser().getName() +
                " at " + appointment.getClinic().getName());
        System.out.println("=== End of Simulation ===");
    }
}