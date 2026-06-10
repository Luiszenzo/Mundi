import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Catch the redirect result specifically for mobile browsers
    getRedirectResult(auth).catch(console.error);

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = () => signInWithRedirect(auth, googleProvider);
  const logout = () => signOut(auth);

  return { user, loading, loginWithGoogle, logout };
}

