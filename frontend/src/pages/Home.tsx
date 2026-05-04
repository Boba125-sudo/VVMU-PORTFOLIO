import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  toolsUsed?: string;
  createdAt: string;
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
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<{ [projectId: number]: number }>({});

  // useEffect(() => {
  //   async function fetchProjects() {
  //     try {
  //       const response = await api.get("/projects");
  //       setProjects(response.data);
  //     } catch (error) {
  //       console.error("Error loading projects:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchProjects();
  // }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get("/projects");
        const projectsData: Project[] = response.data;

        setProjects(projectsData);

        const likesData: { [projectId: number]: number } = {};

        await Promise.all(
          projectsData.map(async (project) => {
            try {
              const likesResponse = await api.get(
                `/projects/${project.id}/likes`,
              );
              likesData[project.id] = likesResponse.data.likesCount;
            } catch (error) {
              console.error(
                `Error loading likes for project ${project.id}:`,
                error,
              );
              likesData[project.id] = 0;
            }
          }),
        );

        setLikes(likesData);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <main style={styles.container}>
        <p>Loading projects...</p>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <section style={styles.hero}>
        <div>
          <p style={styles.badge}>Creative Portfolio Platform</p>
          <h1 style={styles.title}>Открий творчески проекти и портфолиа</h1>
          <p style={styles.subtitle}>
            Платформа за дизайнери, фотографи, илюстратори и уеб разработчици,
            които искат да представят своите най-добри проекти.
          </p>
        </div>
      </section>

      <section style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Последни проекти</h2>
        <p style={styles.sectionText}>Общо проекти: {projects.length}</p>
      </section>

      {projects.length === 0 ? (
        <p style={styles.empty}>Все още няма добавени проекти.</p>
      ) : (
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

                <Link to={`/projects/${project.id}`} style={styles.projectLink}>
                  <h3 style={styles.cardTitle}>{project.title}</h3>
                </Link>

                <p style={styles.description}>{project.description}</p>

                {project.toolsUsed && (
                  <p style={styles.tools}>
                    <strong>Tools:</strong> {project.toolsUsed}
                  </p>
                )}

                <div style={styles.author}>
                  <span>By {project.user.name}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
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
  projectLink: {
    textDecoration: "none",
    color: "inherit",
  },
  hero: {
    background: "linear-gradient(135deg, #111827, #1f2937)",
    color: "white",
    padding: "60px 40px",
    borderRadius: "24px",
    marginBottom: "40px",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#2563eb",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "42px",
    lineHeight: "1.1",
    margin: "0 0 16px",
  },
  subtitle: {
    fontSize: "18px",
    maxWidth: "720px",
    color: "#d1d5db",
    lineHeight: "1.6",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "28px",
    margin: 0,
  },
  sectionText: {
    color: "#6b7280",
  },
  empty: {
    padding: "30px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    color: "#6b7280",
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
    fontWeight: 600,
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
  },
  likes: {
    color: "#ef4444",
    fontWeight: 600,
  },
  cardTitle: {
    fontSize: "22px",
    margin: "0 0 10px",
  },
  description: {
    color: "#4b5563",
    lineHeight: "1.5",
    marginBottom: "14px",
  },
  tools: {
    fontSize: "14px",
    color: "#374151",
  },
  author: {
    marginTop: "18px",
    paddingTop: "14px",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "14px",
  },
};
