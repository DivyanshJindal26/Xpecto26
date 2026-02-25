import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import session from "express-session";
import { setServers } from "node:dns/promises";

// Load environment variables FIRST
setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import passportConfig from "./config/passport.js";

// Import routes
import exhibitionRoutes from "./routes/exhibitionRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";
import proniteRoutes from "./routes/proniteRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many authentication attempts, please try again later.",
  skipSuccessfulRequests: true,
});

app.use("/api/", limiter);
app.use("/api/auth/google", authLimiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "https://xpecto.org",
      "https://www.xpecto.org",
      "http://localhost:5173",
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Body parser with size limits (increased to allow base64 file uploads)
// NOTE: Keep this reasonably constrained in production or switch to multipart uploads.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Express session (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Initialize Passport
app.use(passportConfig.initialize());
app.use(passportConfig.session());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Xpecto API is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/pronites", proniteRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/leads", leadRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
