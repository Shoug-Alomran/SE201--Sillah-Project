import java.util.ArrayList;

public class User {
    private String name;
    private ArrayList<FamilyMember> familyMembers;

    public User(String name) {
        this.name = name;
        this.familyMembers = new ArrayList<>();
    }

    public void addFamilyMember(FamilyMember fm) {
        familyMembers.add(fm);
    }

    public ArrayList<FamilyMember> getFamilyMembers() {
        return familyMembers;
    }

    public String getName() {
        return name;
    }
}