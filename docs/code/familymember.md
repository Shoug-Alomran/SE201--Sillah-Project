??? note "AlertSystem.java"
```java
public class FamilyMember {
    private String relation;
    private int age;
    private List<HealthEvent> healthEvents = new ArrayList<>();

    // Constructor with validation
    public FamilyMember(String relation, int age) {
        if (relation == null || relation.trim().isEmpty()) {
            throw new IllegalArgumentException("Relation required");
        }
        if (age < 0 || age > 120) {
            throw new IllegalArgumentException("Age must be between 0 and 120");
        }
        this.relation = relation.trim();
        this.age = age;
    }

    // Adds an initial HealthEvent automatically.
    public FamilyMember(String relation, int age, String healthCondition) {
        this(relation, age);
        if (healthCondition != null && !healthCondition.trim().isEmpty()) {
            // Use a simple guessed ageAtDiagnosis (you can change it when you know the real
            // age)
            addHealthEvent(
                    new HealthEvent(healthCondition.trim(), Math.max(0, Math.min(age, 50)), "Initial condition"));
        }
    }

    public String getRelation() {
        return relation;
    }

    public int getAge() {
        return age;
    }

    public void addHealthEvent(HealthEvent event) {
        if (event != null) {
            healthEvents.add(event);
        }
    }

    public List<HealthEvent> getHealthEvents() {
        return Collections.unmodifiableList(healthEvents);
    }

    public String getHealthCondition() {
        return healthEvents.isEmpty() ? "Healthy" : healthEvents.get(0).getCondition();
    }

    @Override
    public String toString() {
        return relation + " (Age: " + age + ", Events: " + healthEvents.size() + ")";
    }
}
```