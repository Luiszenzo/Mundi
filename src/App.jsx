import { useState, useEffect } from "react";
import "./index.css";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import QuinielaForm from "./components/QuinielaForm";
import Leaderboard from "./components/Leaderboard";
import MyQuiniela from "./components/MyQuiniela";
import AdminPanel from "./components/AdminPanel";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const ADMIN_EMAILS = ["luiszenzo2@gmail.com"];

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("quiniela");
  const [hasQuiniela, setHasQuiniela] = useState(false);

  // Check if user already has a quiniela
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "quinielas", user.uid)).then(snap => {
      if (snap.exists()) {
        setHasQuiniela(true);
        setPage("myquiniela"); // default to viewing their quiniela
      }
    });
  }, [user]);

  if (loading) {
    return (
      <div className="loader-full">
        <div className="spinner" />
        <span style={{ color: "var(--text-muted)", fontFamily: "Outfit, sans-serif" }}>
          Cargando...
        </span>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const isAdmin = ADMIN_EMAILS.includes(user.email);

  const renderPage = () => {
    switch (page) {
      case "quiniela":  return <QuinielaForm />;
      case "myquiniela": return <MyQuiniela />;
      case "tabla":     return <Leaderboard />;
      case "admin":     return isAdmin ? <AdminPanel /> : <QuinielaForm />;
      default:          return <QuinielaForm />;
    }
  };

  return (
    <div className="app-wrapper">
      <Header page={page} setPage={setPage} isAdmin={isAdmin} />
      {renderPage()}
    </div>
  );
}
