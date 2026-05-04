import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

type User = {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  toolsUsed?: string;
  userId: number;
  category: {
    id: number;
    name: string;
  };
  _count?: {
    likes: number;
  };
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    const parsedUser: User = JSON.parse(savedUser);

    setUser(parsedUser);
    setName(parsedUser.name || "");
    setEmail(parsedUser.email || "");
    setBio(parsedUser.bio || "");
    setAvatarUrl(parsedUser.avatarUrl || "");

    async function fetchProjects() {
      try {
        const response = await api.get("/projects");

        const myProjects = response.data.filter(
          (project: Project) => project.userId === parsedUser.id,
        );

        setProjects(myProjects);
      } catch (error) {
        console.error(error);
        setError("Неуспешно зареждане на проектите.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [navigate]);

  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put(
        "/users/me",
        {
          name,
          email,
          bio,
          avatarUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      
      window.location.reload();

      setMessage("Профилът е обновен успешно.");
    } catch (error: any) {
      console.error(error);
      setError(
        error.response?.data?.message || "Неуспешна промяна на профила.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return (
      <main style={styles.container}>
        <p>Зареждане...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div>
          <p style={styles.badge}>Dashboard</p>
          <h1 style={styles.title}>Моят профил</h1>
          <p style={styles.subtitle}>
            Управлявай данните си и виж всички твои творчески проекти.
          </p>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Изход
        </button>
      </header>

      <section style={styles.grid}>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Данни за профила</h2>

          {message && <div style={styles.success}>{message}</div>}
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleUpdateProfile} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Име</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Имейл</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={styles.textarea}
                placeholder="Кратко описание за теб"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Avatar URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                style={styles.input}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={styles.primaryButton}
            >
              {saving ? "Запазване..." : "Запази промените"}
            </button>
          </form>
        </article>

        <article style={styles.profilePreview}>
          <h2 style={styles.cardTitle}>Преглед</h2>

          <div style={styles.avatarBox}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h3 style={styles.profileName}>{name}</h3>
          <p style={styles.profileEmail}>{email}</p>
          <p style={styles.profileBio}>{bio || "Няма добавено описание."}</p>
        </article>
      </section>

      <section style={styles.projectsSection}>
        <div style={styles.projectsHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Моите проекти</h2>
            <p style={styles.sectionText}>
              Общо твои проекти: {projects.length}
            </p>
          </div>

          <div style={styles.headerActions}>
            <Link to="/projects/create" style={styles.primaryLinkButton}>
              + Нов проект
            </Link>

            <Link to="/" style={styles.secondaryButton}>
              Към началната страница
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div style={styles.emptyBox}>Все още нямаш добавени проекти.</div>
        ) : (
          <div style={styles.projectGrid}>
            {projects.map((project) => (
              <article key={project.id} style={styles.projectCard}>
                <div style={styles.projectImageBox}>
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={styles.projectImage}
                    />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}
                </div>

                <div style={styles.projectBody}>
                  <div style={styles.projectTop}>
                    <span style={styles.category}>{project.category.name}</span>

                    <span style={styles.likes}>
                      ♥ {project._count?.likes ?? 0}
                    </span>
                  </div>

                  <h3 style={styles.projectTitle}>{project.title}</h3>

                  <p style={styles.projectDescription}>{project.description}</p>

                  {project.toolsUsed && (
                    <p style={styles.tools}>
                      <strong>Tools:</strong> {project.toolsUsed}
                    </p>
                  )}

                  <Link
                    to={`/projects/${project.id}`}
                    style={styles.detailsLink}
                  >
                    Виж проекта
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
  },
  headerActions: {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap"
},
  primaryLinkButton: {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700
},
  badge: {
    display: "inline-block",
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "12px",
  },
  title: {
    fontSize: "40px",
    margin: "0 0 8px",
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.6",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "24px",
    marginBottom: "42px",
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  profilePreview: {
    backgroundColor: "#111827",
    color: "white",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
  },
  cardTitle: {
    fontSize: "24px",
    margin: "0 0 20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: 700,
    color: "#374151",
  },
  input: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },
  textarea: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    minHeight: "100px",
    resize: "vertical",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "16px",
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 700,
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: 700,
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: 700,
  },
  avatarBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid white",
  },
  avatarPlaceholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "46px",
    fontWeight: 800,
    border: "4px solid white",
  },
  profileName: {
    textAlign: "center",
    fontSize: "26px",
    margin: "0 0 8px",
  },
  profileEmail: {
    textAlign: "center",
    color: "#d1d5db",
    marginBottom: "20px",
  },
  profileBio: {
    textAlign: "center",
    color: "#e5e7eb",
    lineHeight: "1.6",
  },
  projectsSection: {
    marginTop: "20px",
  },
  projectsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },
  sectionTitle: {
    fontSize: "30px",
    margin: "0 0 6px",
  },
  sectionText: {
    margin: 0,
    color: "#6b7280",
  },
  emptyBox: {
    padding: "30px",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
  },
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  projectCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  projectImageBox: {
    height: "180px",
    backgroundColor: "#f3f4f6",
  },
  projectImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontWeight: 700,
  },
  projectBody: {
    padding: "20px",
  },
  projectTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  category: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
  },
  likes: {
    color: "#ef4444",
    fontWeight: 700,
  },
  projectTitle: {
    fontSize: "22px",
    margin: "0 0 10px",
  },
  projectDescription: {
    color: "#4b5563",
    lineHeight: "1.5",
  },
  tools: {
    fontSize: "14px",
    color: "#374151",
  },
  detailsLink: {
    display: "inline-block",
    marginTop: "12px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700,
  },
};
