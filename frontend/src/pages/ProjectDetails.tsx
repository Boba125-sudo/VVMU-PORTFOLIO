import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/axios";

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  toolsUsed?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    bio?: string;
    avatarUrl?: string;
  };
  category: {
    id: number;
    name: string;
  };
  _count?: {
    likes: number;
  };
};

type LoggedUser = {
  id: number;
  name: string;
  email: string;
};

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setLoggedUser(JSON.parse(savedUser));
    }

    async function fetchProject() {
      try {
        const projectResponse = await api.get(`/projects/${id}`);
        setProject(projectResponse.data);

        const likesResponse = await api.get(`/projects/${id}/likes`);
        setLikesCount(likesResponse.data.likesCount);
      } catch (error) {
        console.error(error);
        setError("Проектът не беше намерен.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  async function handleLike() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Трябва да влезеш в профила си, за да харесаш проект.");
      return;
    }

    try {
      setLikeLoading(true);

      await api.post(
        `/projects/${id}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const likesResponse = await api.get(`/projects/${id}/likes`);
      setLikesCount(likesResponse.data.likesCount);
    } catch (error) {
      console.error(error);
      alert("Неуспешно харесване. Възможно е вече да си харесал този проект.");
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleUnlike() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Трябва да влезеш в профила си.");
      return;
    }

    try {
      setLikeLoading(true);

      await api.delete(`/projects/${id}/likes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const likesResponse = await api.get(`/projects/${id}/likes`);
      setLikesCount(likesResponse.data.likesCount);
    } catch (error) {
      console.error(error);
      alert("Неуспешно премахване на харесването.");
    } finally {
      setLikeLoading(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.container}>
        <p>Loading project...</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main style={styles.container}>
        <p style={styles.error}>{error}</p>
        <Link to="/" style={styles.backLink}>
          ← Назад към началната страница
        </Link>
      </main>
    );
  }

  const isOwner = loggedUser && project.user.id === loggedUser.id;

  return (
    <main style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← Назад към всички проекти
      </Link>

      <section style={styles.layout}>
        <div style={styles.imageBox}>
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              style={styles.image}
            />
          ) : (
            <div style={styles.noImage}>No Image</div>
          )}
        </div>

        <div style={styles.content}>
          <div style={styles.topRow}>
            <span style={styles.category}>{project.category.name}</span>
            <span style={styles.likes}>♥ {likesCount}</span>
          </div>

          <h1 style={styles.title}>{project.title}</h1>

          <p style={styles.description}>{project.description}</p>

          {project.toolsUsed && (
            <div style={styles.infoBox}>
              <h3 style={styles.infoTitle}>Използвани инструменти</h3>
              <p style={styles.infoText}>{project.toolsUsed}</p>
            </div>
          )}

          <div style={styles.authorBox}>
            <h3 style={styles.infoTitle}>Автор</h3>
            <Link to={`/users/${project.user.id}`} style={styles.authorLink}>
              {project.user.name}
            </Link>
            {/* {project.user.bio && (
              <p style={styles.infoText}>{project.user.bio}</p>
            )} */}
          </div>

          <div style={styles.actions}>
            <button
              onClick={handleLike}
              disabled={likeLoading}
              style={styles.primaryButton}
            >
              {likeLoading ? "Моля изчакай..." : "Харесай проекта"}
            </button>

            <button
              onClick={handleUnlike}
              disabled={likeLoading}
              style={styles.secondaryButton}
            >
              Премахни харесване
            </button>

            {isOwner && (
              <Link
                to={`/projects/${project.id}/edit`}
                style={styles.editButton}
              >
                Редактирай проекта
              </Link>
            )}
          </div>
        </div>
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
  editButton: {
    backgroundColor: "#111827",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 700,
  },

  backLink: {
    display: "inline-block",
    marginBottom: "24px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "36px",
    alignItems: "start",
  },
  imageBox: {
    height: "520px",
    backgroundColor: "#f3f4f6",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  image: {
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
    fontSize: "22px",
  },
  content: {
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    backgroundColor: "white",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  category: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 600,
  },
  likes: {
    color: "#ef4444",
    fontWeight: 700,
    fontSize: "18px",
  },
  title: {
    fontSize: "40px",
    lineHeight: "1.1",
    margin: "0 0 18px",
    color: "#111827",
  },
  description: {
    color: "#4b5563",
    lineHeight: "1.7",
    fontSize: "17px",
    marginBottom: "24px",
  },
  infoBox: {
    padding: "18px",
    borderRadius: "16px",
    backgroundColor: "#f9fafb",
    marginBottom: "16px",
  },
  authorBox: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
    borderRadius: "16px",
    backgroundColor: "#f9fafb",
    marginBottom: "22px",
  },
  infoTitle: {
    display: "inlineBlock",
    margin: "0 0 0",
    fontSize: "16px",
    color: "#111827",
  },
  infoText: {
    margin: 0,
    color: "#4b5563",
    lineHeight: "1.5",
  },
  authorName: {
    margin: "0 0 6px",
    color: "#111827",
    fontWeight: 700,
  },

  authorLink: {
    display: "inline-block",
    color: "#2563eb",
    fontWeight: 800,
    textDecoration: "none",
  },

  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryButton: {
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    color: "#374151",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  error: {
    color: "#dc2626",
    fontWeight: 700,
  },
};
