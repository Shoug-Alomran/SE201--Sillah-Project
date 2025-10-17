public class HealthEvent {
    private String condition;
    private int ageAtDiagnosis;
    private String description;

    public HealthEvent(String condition, int ageAtDiagnosis, String description) {
        if (condition == null || condition.trim().isEmpty()) {
            throw new IllegalArgumentException("Condition required");
        }
        if (ageAtDiagnosis < 0 || ageAtDiagnosis > 120) {
            throw new IllegalArgumentException("Age must be between 0 and 120");
        }
        this.condition = condition.trim();
        this.ageAtDiagnosis = ageAtDiagnosis;
        this.description = (description == null) ? "" : description.trim();
    }

    public String getCondition() {
        return condition;
    }

    public int getAgeAtDiagnosis() {
        return ageAtDiagnosis;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return condition + " (diagnosed at age " + ageAtDiagnosis + ")";
    }
}
