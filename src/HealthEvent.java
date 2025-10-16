public class HealthEvent {
    private String condition;
    private int ageAtDiagnosis;

    public HealthEvent(String condition, int ageAtDiagnosis) {
        this.condition = condition;
        this.ageAtDiagnosis = ageAtDiagnosis;
    }

    public String getCondition() {
        return condition;
    }

    public int getAgeAtDiagnosis() {
        return ageAtDiagnosis;
    }
}