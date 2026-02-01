??? note "User.java"

```java
import java.util.*;

public class User {
    private String name;
    private List<FamilyMember> familyMembers = new ArrayList<>();

    // Validation
    public User(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name required");
        }
        this.name = name.trim();
    }

    // Valdiation
    public void addFamilyMember(FamilyMember fm) {
        if (fm != null)
            familyMembers.add(fm);
    }

    public List<FamilyMember> getFamilyMembers() {
        return Collections.unmodifiableList(familyMembers);
    }

    public String getName() {
        return name;
    }
}
```