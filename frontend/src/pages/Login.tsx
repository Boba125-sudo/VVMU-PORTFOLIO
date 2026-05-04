import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setError("Грешен имейл или парола.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <p style={styles.badge}>Creative Portfolio</p>
          <h1 style={styles.title}>Вход в профила</h1>
          <p style={styles.subtitle}>
            Влез, за да добавяш проекти, да ги редактираш и да харесваш чужди
            портфолиа.
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Имейл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Парола</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Въведи парола"
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Влизане..." : "Вход"}
          </button>
        </form>

        <p style={styles.footerText}>
          Нямаш акаунт?{" "}
          <Link to="/register" style={styles.link}>
            Регистрирай се
          </Link>
        </p>

        <Link to="/" style={styles.backLink}>
          ← Назад към началната страница
        </Link>
      </section>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "34px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb"
  },
  header: {
    marginBottom: "24px"
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "14px"
  },
  title: {
    margin: "0 0 10px",
    fontSize: "32px",
    color: "#111827"
  },
  subtitle: {
    margin: 0,
    color: "#6b7280",
    lineHeight: "1.6"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontWeight: 700,
    color: "#374151"
  },
  input: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none"
  },
  button: {
    marginTop: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "16px"
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: 700
  },
  footerText: {
    marginTop: "20px",
    color: "#6b7280",
    textAlign: "center"
  },
  link: {
    color: "#2563eb",
    fontWeight: 700,
    textDecoration: "none"
  },
  backLink: {
    display: "block",
    marginTop: "20px",
    color: "#374151",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: 600
  }
};