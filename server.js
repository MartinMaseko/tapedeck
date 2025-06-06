const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Dynamic CORS setup (add your frontend URLs as needed)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000', 'https://tapedeck.netlify.app/'];

app.use(cors({ origin: allowedOrigins }));

// Use Railway volume if available, else local uploads
const uploadDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

// Helper for base URL
const getBaseUrl = () => process.env.APP_URL || `http://localhost:${PORT}`;

// Upload endpoint for images and mp3s
app.post(
  "/app/uploads/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "mp3s", maxCount: 20 }
  ]),
  (req, res) => {
    const files = req.files;
    const baseUrl = getBaseUrl();
    const response = {
      images: files.images ? files.images.map((file) => `${baseUrl}/uploads/${file.filename}`) : [],
      mp3s: files.mp3s ? files.mp3s.map((file) => `${baseUrl}/uploads/${file.filename}`) : [],
    };
    res.status(200).json(response);
  }
);

app.post("/app/uploads/single", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(200).json({ url });
});

// Serve React static files
app.use(express.static(path.join(__dirname, "build")));

// For any other route, serve index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${getBaseUrl()}`);
});