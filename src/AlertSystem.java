public class AlertSystem {
    public String checkRisk(User user) {
        int riskCount = 0;

        for (FamilyMember fm : user.getFamilyMembers()) {
            if (fm.getHealthCondition().equalsIgnoreCase("SCD") && fm.getAge() < 50) {
                riskCount++;
            }
        }

        if (riskCount >= 2) {
            return "High Risk: Please schedule a preventive screening.";
        } else {
            return "No immediate hereditary risk detected.";
        }
    }
}