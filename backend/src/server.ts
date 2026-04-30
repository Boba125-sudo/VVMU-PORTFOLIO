import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import likeRoutes from "./routes/likeRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Creative Portfolio API is working");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  
});

app.use("/projects", projectRoutes);

app.use("/categories", categoryRoutes);

app.use("/", likeRoutes);

app.use("/auth", authRoutes);

app.use("/users", userRoutes);