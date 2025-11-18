import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Automatic Alert Generation System
 * Generates personalized health alerts based on:
 * - Family health history
 * - Risk assessment results
 * - Personal health records
 * - Age and demographics
 */

export async function generateHealthAlerts(userId) {
  try {
    // Fetch user's family members
    const familyMembersRef = collection(db, "family_members");
    const familyQuery = query(familyMembersRef, where("user_id", "==", userId));
    const familySnapshot = await getDocs(familyQuery);
    
    const familyMembers = [];
    familySnapshot.forEach((doc) => {
      familyMembers.push({ id: doc.id, ...doc.data() });
    });

    // Fetch user's personal health records
    const healthRecordsRef = collection(db, "personal_health_records");
    const healthQuery = query(healthRecordsRef, where("user_id", "==", userId));
    const healthSnapshot = await getDocs(healthQuery);
    
    const healthRecords = [];
    healthSnapshot.forEach((doc) => {
      healthRecords.push({ id: doc.id, ...doc.data() });
    });

    // Check for existing alerts to avoid duplicates
    const existingAlertsRef = collection(db, "alerts");
    const existingQuery = query(existingAlertsRef, where("user_id", "==", userId));
    const existingSnapshot = await getDocs(existingQuery);
    
    const existingAlertTypes = new Set();
    existingSnapshot.forEach((doc) => {
      existingAlertTypes.add(doc.data().alert_type);
    });

    const alerts = [];
    const now = new Date().toISOString();

    // === ALERT TYPE 1: At-Risk Family Members ===
    const atRiskMembers = familyMembers.filter(m => m.health_status === "at_risk");
    if (atRiskMembers.length >= 2 && !existingAlertTypes.has("high_risk_family")) {
      alerts.push({
        user_id: userId,
        alert_type: "high_risk_family",
        title: "High Hereditary Risk Detected",
        message: `You have ${atRiskMembers.length} family members identified as "At Risk" for hereditary conditions. This increases your personal risk for similar health issues.`,
        recommendation: "Schedule a comprehensive health screening and genetic counseling session to assess your personal risk factors.",
        priority: "high",
        is_read: false,
        link: "/risk-assessment",
        created_at: now
      });
    }

    // === ALERT TYPE 2: Diagnosed Family Members ===
    const diagnosedMembers = familyMembers.filter(m => 
      m.health_status === "diagnosed" || 
      (m.conditions && m.conditions.length > 0)
    );
    
    if (diagnosedMembers.length >= 1 && !existingAlertTypes.has("family_diagnosed")) {
      const conditions = diagnosedMembers.flatMap(m => m.conditions || []);
      const uniqueConditions = [...new Set(conditions)];
      
      alerts.push({
        user_id: userId,
        alert_type: "family_diagnosed",
        title: "Family Members with Hereditary Conditions",
        message: `${diagnosedMembers.length} family member(s) have been diagnosed with hereditary conditions including: ${uniqueConditions.slice(0, 3).join(", ")}${uniqueConditions.length > 3 ? "..." : ""}.`,
        recommendation: "Review your family health tree and discuss these conditions with your doctor during your next checkup.",
        priority: "high",
        is_read: false,
        link: "/family-tree",
        created_at: now
      });
    }

    // === ALERT TYPE 3: Recommended Health Screenings ===
    if (atRiskMembers.length > 0 && !existingAlertTypes.has("screening_recommended")) {
      alerts.push({
        user_id: userId,
        alert_type: "screening_recommended",
        title: "Health Screening Recommended",
        message: "Based on your family health history, we recommend scheduling regular health screenings to monitor for early signs of hereditary conditions.",
        recommendation: "Book a comprehensive health checkup with a general practitioner. Include cardiovascular screening, blood work, and genetic counseling if available.",
        priority: "high",
        is_read: false,
        link: "/clinics",
        created_at: now
      });
    }

    // === ALERT TYPE 4: Genetic Counseling Recommendation ===
    if (diagnosedMembers.length >= 2 && !existingAlertTypes.has("genetic_counseling")) {
      alerts.push({
        user_id: userId,
        alert_type: "genetic_counseling",
        title: "Genetic Counseling Recommended",
        message: "Multiple family members with hereditary conditions suggest a strong genetic component. Genetic counseling can help you understand your personal risk.",
        recommendation: "Schedule an appointment with a genetic counselor to discuss family planning and preventive measures.",
        priority: "high",
        is_read: false,
        link: "/clinics",
        created_at: now
      });
    }

    // === ALERT TYPE 5: Update Family Tree ===
    if (familyMembers.length < 3 && !existingAlertTypes.has("add_family_members")) {
      alerts.push({
        user_id: userId,
        alert_type: "add_family_members",
        title: "Complete Your Family Health Tree",
        message: "Adding more family members helps us provide more accurate risk assessments. Try to include at least 3 generations (parents, grandparents, siblings).",
        recommendation: "Add more family members to your health tree, including their ages, relationships, and any known health conditions.",
        priority: "moderate",
        is_read: false,
        link: "/family-tree",
        created_at: now
      });
    }

    // === ALERT TYPE 6: Medication Reminders ===
    const chronicConditions = healthRecords.filter(r => r.is_chronic);
    if (chronicConditions.length > 0 && !existingAlertTypes.has("medication_reminder")) {
      alerts.push({
        user_id: userId,
        alert_type: "medication_reminder",
        title: "Medication Adherence Reminder",
        message: `You have ${chronicConditions.length} chronic condition(s) requiring ongoing medication. Regular medication adherence is crucial for managing these conditions.`,
        recommendation: "Set daily medication reminders and track your doses. Consult your doctor if you experience any side effects.",
        priority: "high",
        is_read: false,
        link: "/my-health",
        created_at: now
      });
    }

    // === ALERT TYPE 7: Regular Checkup Reminder ===
    if (!existingAlertTypes.has("annual_checkup")) {
      alerts.push({
        user_id: userId,
        alert_type: "annual_checkup",
        title: "Annual Health Checkup Due",
        message: "It's important to schedule regular health checkups, especially with your family history of hereditary conditions.",
        recommendation: "Book your annual health checkup. This should include blood pressure, cholesterol screening, and diabetes tests.",
        priority: "moderate",
        is_read: false,
        link: "/appointments",
        created_at: now
      });
    }

    // === ALERT TYPE 8: Lifestyle Recommendations ===
    if (atRiskMembers.length > 0 && !existingAlertTypes.has("lifestyle_tips")) {
      alerts.push({
        user_id: userId,
        alert_type: "lifestyle_tips",
        title: "Preventive Health Tips",
        message: "Given your family health history, lifestyle modifications can significantly reduce your risk of developing hereditary conditions.",
        recommendation: "Focus on: regular exercise (30 min/day), balanced diet, stress management, adequate sleep, and avoiding smoking/excessive alcohol.",
        priority: "moderate",
        is_read: false,
        link: "/awareness-hub",
        created_at: now
      });
    }

    // === ALERT TYPE 9: High Cholesterol Family History ===
    const cholesterolCases = familyMembers.filter(m => 
      m.conditions && m.conditions.includes("High Cholesterol")
    );
    if (cholesterolCases.length >= 1 && !existingAlertTypes.has("cholesterol_risk")) {
      alerts.push({
        user_id: userId,
        alert_type: "cholesterol_risk",
        title: "Cholesterol Screening Recommended",
        message: "Family history of high cholesterol increases your risk. Early detection and management can prevent cardiovascular disease.",
        recommendation: "Get a lipid panel blood test to check your cholesterol levels. If elevated, discuss diet changes and treatment options with your doctor.",
        priority: "high",
        is_read: false,
        link: "/clinics",
        created_at: now
      });
    }

    // === ALERT TYPE 10: Diabetes Family History ===
    const diabetesCases = familyMembers.filter(m => 
      m.conditions && m.conditions.includes("Type 2 Diabetes")
    );
    if (diabetesCases.length >= 1 && !existingAlertTypes.has("diabetes_risk")) {
      alerts.push({
        user_id: userId,
        alert_type: "diabetes_risk",
        title: "Diabetes Risk Alert",
        message: "Family history of Type 2 Diabetes significantly increases your risk. Prevention and early detection are key.",
        recommendation: "Get an HbA1c or fasting glucose test. Maintain healthy weight, exercise regularly, and monitor your blood sugar levels.",
        priority: "high",
        is_read: false,
        link: "/clinics",
        created_at: now
      });
    }

    // === ALERT TYPE 11: Hypertension Family History ===
    const hypertensionCases = familyMembers.filter(m => 
      m.conditions && m.conditions.includes("Hypertension (High Blood Pressure)")
    );
    if (hypertensionCases.length >= 1 && !existingAlertTypes.has("hypertension_risk")) {
      alerts.push({
        user_id: userId,
        alert_type: "hypertension_risk",
        title: "Blood Pressure Monitoring Needed",
        message: "Family history of hypertension puts you at increased risk for high blood pressure and heart disease.",
        recommendation: "Monitor your blood pressure regularly. Reduce salt intake, maintain healthy weight, and exercise regularly.",
        priority: "high",
        is_read: false,
        link: "/clinics",
        created_at: now
      });
    }

    // === ALERT TYPE 12: Welcome Message (for new users) ===
    if (familyMembers.length === 0 && !existingAlertTypes.has("welcome")) {
      alerts.push({
        user_id: userId,
        alert_type: "welcome",
        title: "Welcome to Sillah",
        message: "Thank you for joining Sillah (صلة), your family health management system. Start by adding family members to build your health tree and identify potential hereditary risks.",
        recommendation: "Add at least 3 family members (parents, siblings, grandparents) to get a comprehensive risk assessment.",
        priority: "moderate",
        is_read: false,
        link: "/family-tree",
        created_at: now
      });
    }

    // Save all alerts to Firestore
    for (const alert of alerts) {
      await addDoc(collection(db, "alerts"), alert);
    }

    return {
      success: true,
      alertsGenerated: alerts.length,
      alerts: alerts
    };

  } catch (error) {
    console.error("Error generating alerts:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Call this function when:
 * 1. User logs in
 * 2. User adds/updates family members
 * 3. User adds/updates health records
 * 4. Periodically (e.g., daily check)
 */
export async function checkAndGenerateAlerts(userId) {
  console.log("Checking for new health alerts...");
  const result = await generateHealthAlerts(userId);
  
  if (result.success) {
    console.log(`Generated ${result.alertsGenerated} new alerts`);
  } else {
    console.error("Failed to generate alerts:", result.error);
  }
  
  return result;
}