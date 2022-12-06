import React from "react";
import { useState, useEffect } from "react";

import { auth, db } from "../firebase/firebase";
import { set, push, ref } from "firebase/database";

export const AuthContext = React.createContext();

export function AuthProvider(props) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);

      if (!user) setCurrentUser(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name, avatarConfig) => {
    const res = await auth.createUserWithEmailAndPassword(email, password);

    await res.user.updateProfile({ displayName: name });

    const newUserId = res.user.uid;

    await set(ref(db, "users/" + newUserId), {
      id: newUserId,
      name,
      email,
      avatarConfig,
      details: { racketBrand: "Wilson", backhand: "One-Handed" },
    });

    await push(ref(db, "usersList/"), name);
  };

  const login = async (email, password) => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    await auth.signOut();
    setCurrentUser(false);
  };

  const resetPassword = async (email) => {
    await auth.sendPasswordResetEmail(email);
  };

  const updatePassword = (password) => currentUser.updatePassword(password);

  const guestLogin = async () => {
    await auth.signInAnonymously();
  };

  // DATABASE

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updatePassword,
    guestLogin,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
