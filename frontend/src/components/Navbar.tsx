import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <img src={logo} alt="Vision Board logo" style={styles.logoImage} />
        </Link>

        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/projects/create" style={styles.link}>
                New project
              </Link>

              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>

              <span style={styles.userInfo}>Welcome, {user.name}</span>

              <button onClick={handleLogout} style={styles.logoutButton}>
                Изход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginButton}>
                Вход
              </Link>

              <Link to="/register" style={styles.registerButton}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    width: "100%",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "white",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },
  logoImage: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  link: {
    color: "#374151",
    textDecoration: "none",
    fontWeight: 600,
  },
  userInfo: {
    color: "#2563eb",
    fontWeight: 700,
  },
  loginButton: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700,
  },
  registerButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 700,
  },
  logoutButton: {
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
