import express from "express";
const port = process.env.PORT;
import path from "path";
import errorHandler from './middleware/error.js';
const app = express();
import connectDB from "./config/db.js";
// Connect Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
import createRoutes from "./routes/route.js";
import Exhibition from "./models/Exhibition.js";
import Session from "./models/Session.js";

app.use("/api/exhibitions", createRoutes(Exhibition));
app.use("/api/sessions", createRoutes(Session));

//errorhandler
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port,() => console.log(`server is running on port ${port}`));
