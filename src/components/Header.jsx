import { useAuth } from "../hooks/useAuth";
import logoImg from "../assets/logo.png";

export default function Header({ page, setPage, isAdmin }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "fill",        label: "Llenar",      icon: "📝", page: "quiniela"    },
    { id: "myquiniela",  label: "Mi Quiniela", icon: "⚽", page: "myquiniela"  },
    { id: "tabla",       label: "Tabla",       icon: "🏆", page: "tabla"       },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "🔧", page: "admin" }] : []),
  ];

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          {/* Logo */}
          <div className="logo-area">
            <img src={logoImg} alt="Metal Shapers Racing Store" className="logo-img" />
            <div className="logo-text">
              <span className="logo-name">Metal Shapers</span>
              <span className="logo-sub">Racing Store · Mundial 2026</span>
            </div>
          </div>

          {/* Desktop nav */}
          {user && (
            <nav className="nav">
              {navItems.map(item => (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  className={`nav-btn${page === item.page ? " active" : ""}`}
                  onClick={() => setPage(item.page)}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=1a2235&color=ffd700`}
                alt={user.displayName}
                className="user-avatar"
                title={user.displayName}
              />
              <button className="btn-logout" onClick={logout}>Salir</button>
            </nav>
          )}
        </div>
      </header>

      {/* Mobile bottom nav bar */}
      {user && (
        <nav className="mobile-nav">
          <div className="mobile-nav-inner">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                className={`mobile-nav-btn${page === item.page ? " active" : ""}`}
                onClick={() => setPage(item.page)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
            {/* Avatar + logout */}
            <button className="mobile-nav-btn" onClick={logout}>
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=1a2235&color=ffd700&size=64`}
                alt={user.displayName}
                style={{ width: "1.35rem", height: "1.35rem", borderRadius: "50%", border: "1.5px solid var(--gold)", objectFit: "cover" }}
              />
              Salir
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
