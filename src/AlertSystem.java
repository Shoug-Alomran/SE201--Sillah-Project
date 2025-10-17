// File: AlertSystem.java
public class AlertSystem {

    public String checkRisk(User user) {
        int earlySCDCount = 0;

        for (FamilyMember fm : user.getFamilyMembers()) {
            for (HealthEvent event : fm.getHealthEvents()) {
                if ("SCD".equalsIgnoreCase(event.getCondition()) && event.getAgeAtDiagnosis() < 50) {
                    earlySCDCount++;
                }
            }
        }

        if (earlySCDCount >= 2) {
            return "High Risk: Multiple early SCD cases detected. Please schedule a preventive screening.";
        } else if (earlySCDCount == 1) {
            return "Moderate Risk: One hereditary case detected. Consult your doctor for screening.";
        } else {
            return "No immediate hereditary risk detected.";
        }
    }
}