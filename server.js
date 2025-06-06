const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

console.log('Starting server with configuration:');
console.log('APP_URL:', process.env.APP_URL);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('PORT:', process.env.PORT);
console.log('Upload Directory:', process.env.RAILWAY_VOLUME_MOUNT_PATH || 'local uploads/');

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

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    headers: req.headers,
    query: req.query,
    body: req.body
  });
  next();
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

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
  console.log('Upload attempt received');
  console.log('Files:', req.file);
  console.log('Body:', req.body);
  console.log('Upload dir:', uploadDir);

  if (!req.file) {
    console.log('No file received');
    return res.status(400).json({ error: "No file uploaded" });
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  console.log('Generated URL:', url);
  
  res.status(200).json({ url });
});


app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${getBaseUrl()}`);
});