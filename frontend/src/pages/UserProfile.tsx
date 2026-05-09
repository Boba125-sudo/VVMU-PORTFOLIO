import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/axios";

type User = {
  id: number;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  toolsUsed?: string | null;
  userId: number;
  user: User;
  category: {
    id: number;
    name: string;
  };
};

export default function UserProfile() {
  const { id } = useParams();

  const [author, setAuthor] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [likes, setLikes] = useState<{ [projectId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAuthorProjects() {
      try {
        const response = await api.get("/projects");
        const allProjects: Project[] = response.data;

        const authorProjects = allProjects.filter(
          (project) => project.user.id === Number(id),
        );

        if (authorProjects.length === 0) {
          setError("Този потребител няма проекти или не съществува.");
          return;
        }

        setAuthor(authorProjects[0].user);
        setProjects(authorProjects);

        const likesData: { [projectId: number]: number } = {};

        await Promise.all(
          authorProjects.map(async (project) => {
            try {
              const likesResponse = await api.get(
                `/projects/${project.id}/likes`,
              );
              likesData[project.id] = likesResponse.data.likesCount;
            } catch {
              likesData[project.id] = 0;
            }
          }),
        );

        setLikes(likesData);
      } catch (error) {
        console.error(error);
        setError("Неуспешно зареждане на профила.");
      } finally {
        setLoading(false);
      }
    }

    fetchAuthorProjects();
  }, [id]);

  if (loading) {
    return (
      <main style={styles.container}>
        <p>Зареждане на профила...</p>
      </main>
    );
  }

  if (error || !author) {
    return (
      <main style={styles.container}>
        <p style={styles.error}>{error}</p>
        <Link to="/" style={styles.backLink}>
          ← Назад към началната страница
        </Link>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← Назад към всички проекти
      </Link>

      <section style={styles.profileHeader}>
        <div style={styles.avatarBox}>
          {author.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.name}
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <p style={styles.badge}>Creator Profile</p>
          <h1 style={styles.title}>{author.name}</h1>
          <p style={styles.bio}>
            {author.bio || "Този автор все още няма добавено описание."}
          </p>
          <p style={styles.stats}>Общо проекти: {projects.length}</p>
        </div>
      </section>

      <section style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Портфолио проекти</h2>
      </section>

      <section style={styles.grid}>
        {projects.map((project) => (
          <article key={project.id} style={styles.card}>
            <div style={styles.imageWrapper}>
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

            <div style={styles.cardBody}>
              <div style={styles.cardTop}>
                <span style={styles.category}>{project.category.name}</span>
                <span style={styles.likes}>♥ {likes[project.id] ?? 0}</span>
              </div>

              <h3 style={styles.cardTitle}>{project.title}</h3>

              <p style={styles.description}>{project.description}</p>

              {project.toolsUsed && (
                <p style={styles.tools}>
                  <strong>Tools:</strong> {project.toolsUsed}
                </p>
              )}

              <Link to={`/projects/${project.id}`} style={styles.detailsLink}>
                Виж проекта
              </Link>
            </div>
          </article>
        ))}
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
  backLink: {
    display: "inline-block",
    marginBottom: "24px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700,
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
    background: "linear-gradient(45deg, rgb(21, 42, 205), rgb(164, 49, 216))",
    color: "white",
    padding: "38px",
    borderRadius: "28px",
    marginBottom: "40px",
  },
  avatarBox: {
    flexShrink: 0,
  },
  avatar: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid white",
  },
  avatarPlaceholder: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    backgroundColor: "#462dd1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "52px",
    fontWeight: 800,
    border: "4px solid white",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#462dd1",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "12px",
  },
  title: {
    fontSize: "42px",
    margin: "0 0 10px",
    color: "#d1d5db",
  },
  bio: {
    color: "#d1d5db",
    lineHeight: "1.6",
    maxWidth: "680px",
    margin: "0 0 12px",
  },
  stats: {
    color: "#ffffff",
    fontWeight: 700,
    margin: 0,
  },
  sectionHeader: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "30px",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  imageWrapper: {
    height: "190px",
    backgroundColor: "#f3f4f6",
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
  },
  cardBody: {
    padding: "20px",
  },
  cardTop: {
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
  cardTitle: {
    fontSize: "22px",
    margin: "0 0 10px",
  },
  description: {
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
  error: {
    color: "#dc2626",
    fontWeight: 700,
  },
};
