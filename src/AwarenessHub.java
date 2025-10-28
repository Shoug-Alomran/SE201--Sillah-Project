import java.util.Scanner;

public class AwarenessHub {
    public void start(Scanner input) {
        while (true) {
            System.out.println("\n=== Awareness Hub ===");
            System.out.println("1) View Educational Topics");
            System.out.println("2) Preventive Checklist");
            System.out.println("0) Back to main menu");
            System.out.print("Enter choice: ");
            String choice = input.nextLine().trim();

            if ("1".equals(choice)) {
                showTopics(input);
            } else if ("2".equals(choice)) {
                showChecklist();
            } else if ("0".equals(choice)) {
                System.out.println("Returning to main menu...");
                break;
            } else {
                System.out.println("Invalid choice.");
            }
        }
    }

    private void showTopics(Scanner input) {
        System.out.println("\nAvailable Topics:");
        System.out.println("1) Understanding Sickle Cell Disease");
        System.out.println("2) Importance of Genetic Screening");
        System.out.println("3) Healthy Heart Tips");
        System.out.print("Select topic: ");
        String choice = input.nextLine().trim();

        if ("1".equals(choice)) {
            System.out.println("SCD affects red blood cells and can be hereditary...");
        } else if ("2".equals(choice)) {
            System.out.println("Genetic screening helps detect hereditary risks early.");
        } else if ("3".equals(choice)) {
            System.out.println("Maintain a balanced diet, exercise, and regular checkups.");
        } else {
            System.out.println("Invalid topic.");
        }
    }

    private void showChecklist() {
        System.out.println("\n=== Preventive Checklist ===");
        System.out.println("[✓] Add family members to your health tree");
        System.out.println("[ ] Schedule your first screening");
        System.out.println("[ ] Read one Awareness article");
        System.out.println("Progress: 1/3 completed");
    }
}