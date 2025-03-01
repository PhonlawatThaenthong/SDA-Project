const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const UserModel = require("./user");
const { ImageDetails } = require("./imagedetail");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:1234@cluster0.5ojwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer Configuration (For File Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "User not authenticated" });

  jwt.verify(token, "secret", (err, decodedUser) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decodedUser;
    next();
  });
};

// Upload File API
app.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    const { path, filename, mimetype } = req.file;
    const file = new ImageDetails({
      path,
      filename,
      mimetype,
      userId: req.user._id,
      username: req.user.username,
    });

    await file.save();
    res.json({ msg: "File uploaded successfully!", fileId: file._id });
  } catch (error) {
    res.status(500).json({ error: "Unable to upload file" });
  }
});

// Get All Uploaded Files
app.get("/files", async (req, res) => {
  try {
    const files = await ImageDetails.find();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch files" });
  }
});

// Serve Files (Images, PDFs, Videos, etc.)
app.get("/file/:id", async (req, res) => {
  try {
    const file = await ImageDetails.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.sendFile(path.join(__dirname, "uploads", file.filename));
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve file" });
  }
});

// Delete File API
app.delete("/file/:id", authenticateToken, async (req, res) => {
  try {
    const file = await ImageDetails.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    fs.unlink(`./uploads/${file.filename}`, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    await ImageDetails.findByIdAndDelete(req.params.id);
    res.json({ msg: "File deleted successfully", fileId: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete file" });
  }
});

// User Model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// User Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ username, email, password: hashedPassword });

    res.json({ status: "success", message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error creating user", error });
  }
});

// User Login (Returns Token)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ status: "error", message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ status: "error", message: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id, email: user.email, username: user.username }, "secret", { expiresIn: "1h" });

    res.json({ status: "success", message: "User signed in", token, user: { _id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Login error", error });
  }
});

// Get Authenticated User
app.get("/user", authenticateToken, (req, res) => {
  res.json({ status: "success", user: req.user });
});

// User Signout
app.post("/signout", (req, res) => {
  res.json({ status: "success", message: "User signed out" });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
