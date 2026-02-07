import express from "express";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import projectManager from './routes/projectmanager.route.js'
import projects from './routes/project.route.js'
import otp from './routes/otp.route.js'
import cookieparser from 'cookie-parser'


const app = express();





app.use(
  cors({
       origin: ["http://localhost:5173", "http://localhost:5174"],
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
app.use('/otp',otp);

app.use((req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: 'Route not found'

  });
});
app.use(errorMiddleware)
export default app ;
