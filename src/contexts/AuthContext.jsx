// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);     // Supabase Auth user
  const [userProfile, setUserProfile] = useState(null);     // Row from "users" table
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // SIGNUP
  // -----------------------------
  async function signup(email, password, fullName, phoneNumber, userType, doctorId) {
    // 1️⃣ Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) throw authError;

    const uid = authData.user.id;

    // 2️⃣ Insert user profile into "users" table
    const { error: insertError } = await supabase.from("users").insert({
      uid,
      email,
      full_name: fullName,
      phone: phoneNumber || null,
      user_type: userType,
      assigned_doctor: userType === "patient" ? doctorId : null,
      created_at: new Date().toISOString(),
    });

    if (insertError) throw insertError;

    return authData.user;
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  async function logout() {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
  }

  // -----------------------------
  // LOAD USER SESSION + PROFILE
  // -----------------------------
  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user || null;
      setCurrentUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("uid", user.id)
          .single();

        setUserProfile(profile || null);
      }

      setLoading(false);
    }

    loadSession();

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;
        setCurrentUser(user);

        if (user) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("uid", user.id)
            .single();

          setUserProfile(profile || null);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    isDoctor: userProfile?.user_type === "doctor",
    isPatient: userProfile?.user_type === "patient",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
