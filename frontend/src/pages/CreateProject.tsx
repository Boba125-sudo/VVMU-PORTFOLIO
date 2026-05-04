import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

type Category = {
  id: number;
  name: string;
};

export default function CreateProject() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchCategories() {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);

        if (response.data.length > 0) {
          setCategoryId(String(response.data[0].id));
        }
      } catch (error) {
        console.error(error);
        setError("Неуспешно зареждане на категориите.");
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!title || !description || !categoryId) {
      setError("Моля, попълни всички задължителни полета.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/projects",
        {
          title,
          description,
          imageUrl,
          toolsUsed,
          categoryId: Number(categoryId)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate(`/projects/${response.data.id}`);
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Неуспешно създаване на проект.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.container}>
      <Link to="/dashboard" style={styles.backLink}>
        ← Назад към Dashboard
      </Link>

      <section style={styles.card}>
        <div style={styles.header}>
          <p style={styles.badge}>Create Project</p>
          <h1 style={styles.title}>Добави нов проект</h1>
          <p style={styles.subtitle}>
            Представи своя творчески проект с описание, категория, изображение и използвани инструменти.
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {categoriesLoading ? (
          <p>Зареждане на категории...</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Заглавие *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
                placeholder="Например: Modern Portfolio Website"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Описание *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
                placeholder="Опиши проекта си..."
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={styles.input}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Използвани инструменти</label>
              <input
                type="text"
                value={toolsUsed}
                onChange={(e) => setToolsUsed(e.target.value)}
                style={styles.input}
                placeholder="React, TypeScript, Figma"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Категория *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={styles.input}
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Създаване..." : "Създай проект"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "820px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif"
  },
  backLink: {
    display: "inline-block",
    marginBottom: "24px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "34px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
  },
  header: {
    marginBottom: "26px"
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
    fontSize: "36px",
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
  textarea: {
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    minHeight: "140px",
    resize: "vertical",
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
  }
};