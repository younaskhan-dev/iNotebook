const path = require("path");

const envPath = path.resolve(__dirname, "..", ".env");
const backendEnvPath = path.resolve(__dirname, ".env");

const dotenvResult = require("dotenv").config({ path: envPath });

if (dotenvResult.error) {
  require("dotenv").config({ path: backendEnvPath });
  console.warn(`Root .env not found. Loaded backend .env from ${backendEnvPath}`);
} else {
  console.log(`Loaded environment from ${envPath}`);
}

const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const startReminderJob = require("./utils/reminderJob");

connectToMongo();
startReminderJob();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://i-notebook-secure.vercel.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("iNotebook backend is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && (err.stack || err.message || err));

  if (req.path && req.path.startsWith("/api")) {
    if (err && err.name === "MulterError") {
      return res.status(400).json({ success: false, error: err.message });
    }

    const status = err && err.status ? err.status : 500;

    return res.status(status).json({
      success: false,
      error: err && err.message ? err.message : "Internal Server Error",
    });
  }

  next(err);
});

app.listen(port, () => {
  console.log(`iNoteBook listening on port ${port}`);
});