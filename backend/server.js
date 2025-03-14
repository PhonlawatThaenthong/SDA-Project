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
const Log = require("./logsUser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:1234@cluster0.5ojwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).send('Error retrieving logs');
  }
});

// Add log entry


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

app.post('/logs-login', authenticateToken, async (req, res) => {
  const { message, level } = req.body;
  const newLog = new Log({ message, level,userId: req.user._id,
    username: req.user.username,type:"login"});
  try {
    await newLog.save();
    res.status(200).send('Log saved');
  } catch (err) {
    res.status(500).send('Error saving log');
  }
});

app.post('/logs-logout', authenticateToken, async (req, res) => {
  const { message, level } = req.body;
  const newLog = new Log({ message, level,userId: req.user._id,
    username: req.user.username,type:"logout"});
  try {
    await newLog.save();
    res.status(200).send('Log saved');
  } catch (err) {
    res.status(500).send('Error saving log');
  }
});

app.post('/logs-upload', authenticateToken, async (req, res) => {
  const { message, level } = req.body;
  const newLog = new Log({ message, level,userId: req.user._id,
    username: req.user.username,type:"upload"});
  try {
    await newLog.save();
    res.status(200).send('Log saved');
  } catch (err) {
    res.status(500).send('Error saving log');
  }
});

app.post('/logs-remove-file', authenticateToken, async (req, res) => {
  const { message, level } = req.body;
  const newLog = new Log({ message, level,userId: req.user._id,
    username: req.user.username,type:"remove-file"});
  try {
    await newLog.save();
    res.status(200).send('Log saved');
  } catch (err) {
    res.status(500).send('Error saving log');
  }
});

// Upload File API
app.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    const { path, filename, mimetype } = req.file;
    const fileSize = req.file.size; // Get file size from the uploaded file
    
    const file = new ImageDetails({
      path,
      filename,
      mimetype,
      userId: req.user._id,
      username: req.user.username,
      fileSize: fileSize, // Save the file size
    });

    await file.save();
    res.json({ 
      msg: "File uploaded successfully!", 
      fileId: file._id,
      fileSize: fileSize 
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to upload file" });
  }
});

app.get("/user/storage", authenticateToken, async (req, res) => {
  try {
    // ใช้งาน .find() แทน .aggregate() เพื่อลดปัญหา
    const files = await ImageDetails.find({ userId: req.user._id });
    
    // คำนวณขนาดรวมของไฟล์
    let totalSize = 0;
    files.forEach(file => {
      if (file.fileSize) {
        totalSize += file.fileSize;
      }
    });
    
    const totalFiles = files.length;
    const sizeInGB = totalSize / 1073741824;
    
    res.json({ 
      totalSize: totalSize,
      totalSizeInGB: parseFloat(sizeInGB.toFixed(2)),
      totalFiles: totalFiles,
      storageLimit: 1, // เปลี่ยนเป็น 1 GB
      storagePercentage: parseFloat(((sizeInGB / 1) * 100).toFixed(2))
    });
  } catch (error) {
    console.error("Error calculating storage:", error);
    res.status(500).json({ error: "Unable to retrieve storage information" });
  }
});

// Get All Files uploaded by the authenticated user
app.get("/files", authenticateToken, async (req, res) => {
  try {
    const files = await ImageDetails.find({ userId: req.user._id }); // Filter by userId
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

app.get('/user/all-storage', authenticateToken, async (req, res) => {
  try {
    // ตรวจสอบว่าผู้ใช้มีสิทธิ์ admin หรือไม่ (ถ้าต้องการจำกัดสิทธิ์)
    
    // ดึงข้อมูลการใช้พื้นที่จัดเก็บของผู้ใช้ทั้งหมด
    const users = await UserModel.find({}).select('_id username');
    
    const storageData = [];
    
    for (const user of users) {
      // หาไฟล์ทั้งหมดของผู้ใช้แต่ละคน
      const files = await ImageDetails.find({ userId: user._id });
      
      // คำนวณขนาดรวม
      let totalSize = 0;
      files.forEach(file => {
        if (file.fileSize) {
          totalSize += file.fileSize;
        }
      });
      
      // หาวันที่อัพโหลดล่าสุด
      let lastUpload = null;
      if (files.length > 0) {
        const sortedFiles = [...files].sort((a, b) => 
          new Date(b.uploadDate || b.createdAt) - new Date(a.uploadDate || a.createdAt)
        );
        lastUpload = sortedFiles[0].uploadDate || sortedFiles[0].createdAt;
      }
      
      storageData.push({
        key: user._id.toString(),
        userId: user._id.toString(),
        username: user.username,
        totalFiles: files.length,
        totalSizeBytes: totalSize,
        lastUpload: lastUpload
      });
    }
    
    res.json(storageData);
  } catch (error) {
    console.error("Error fetching all users storage data:", error);
    res.status(500).json({ error: "Unable to retrieve storage information" });
  }
});

// Get Authenticated User
app.get("/user", authenticateToken, (req, res) => {
  res.json({ status: "success", user: req.user });
});

app.put("/edit-user", authenticateToken, (req, res) => {
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
