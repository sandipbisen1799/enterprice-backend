import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import projectManager from './routes/projectmanager.route.js'
import projects from './routes/project.route.js'
import connectwithdb from "./config/db.js";
import cookieparser from 'cookie-parser'
dotenv.config();

const app = express();
const PORT =  8000;

console.log(process.env.PORT)

connectwithdb();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


/* ✅ Body parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
/* ✅ Routes */
app.use("/auth", authRouter);
app.use("/projectmanager",projectManager);
app.use('/projects',projects)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
