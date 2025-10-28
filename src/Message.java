enum Lang {
    EN, AR
}

public class Message {
    private final Lang lang;

    public Message(Lang lang) {
        this.lang = lang;
    }

    public String title() {
        return lang == Lang.AR ? "=== صلة: نظام الصحة الوقائية ===" : "=== Sillah (صلة) Preventive Health System ===";
    }

    public String highRisk() {
        return lang == Lang.AR ? "مخاطر عالية: يرجى حجز فحص وقائي."
                : "High Risk: Please schedule a preventive screening.";
    }

    public String moderateRisk() {
        return lang == Lang.AR ? "مخاطر متوسطة: يُنصح باستشارة طبية."
                : "Moderate Risk: Consider a medical consultation.";
    }

    public String lowRisk() {
        return lang == Lang.AR ? "لا توجد مخاطر وراثية فورية." : "No immediate hereditary risk detected.";
    }

    public String recommendedClinic() {
        return lang == Lang.AR ? "العيادة الموصى بها: " : "Recommended Clinic: ";
    }

    public String end() {
        return lang == Lang.AR ? "=== نهاية المحاكاة ===" : "=== End of Simulation ===";
    }
}