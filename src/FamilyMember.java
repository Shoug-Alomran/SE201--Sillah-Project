public class FamilyMember {
    private String relation;
    private int age;
    private String healthCondition;

    public FamilyMember(String relation, int age, String healthCondition) {
        this.relation = relation;
        this.age = age;
        this.healthCondition = healthCondition;
    }

    public String getRelation() {
        return relation;
    }

    public int getAge() {
        return age;
    }

    public String getHealthCondition() {
        return healthCondition;
    }
}
