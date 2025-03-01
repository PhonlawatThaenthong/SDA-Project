const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const UserModel = require('./user');
const { ImageDetails } = require("./imagedetail");
const path = require("path");

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS
app.use(express.static("uploads"));

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:1234@cluster0.5ojwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname )
  }
})

const upload = multer({ storage })

app.post("/single", upload.single("image"), async(req, res) => {
  try {
    const {path, filename} = req.file
    const image = await ImageDetails({path, filename})
    await image.save()
    res.send({"msg":"Image Uploaded"})
  } catch (error) {
    res.send({"error":"Unable to Uploaded Image"})
  }
})

app.get("/image/:id", async(req, res) => {
  const {id} = req.params
  try {
    const image = await ImageDetails.findById(id)
    if (!image) res.send({"msg":"Image Not Found"})
    
    const imagePath = path.join(__dirname, "uploads", image.filename)
    res.sendFile(imagePath)
  } catch (error) {
    res.send({"error":"Unable to get Image"})
  }
})

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Updated LOGIN ROUTE (Returning only token)
app.post('/login', (req, res) => {
  const { email, password } = req.body

  UserModel.findOne({ email: email })
  .then(user => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if(response) {
          const token = jwt.sign(
            { _id: user._id, email: user.email, username: user.username }, 
            'secret', 
            { expiresIn: '1hr' }
          )
          
          return res.json({
            status: "success",
            message: "User signed in successfully",
            token: token,
            user: {
              _id: user._id,
              email: user.email,
              username: user.username
            }
          })
        } else {
          return res.json({
            status: "error",
            message: "Email or password is incorrect"
          })
        }
      })
    } else {
      return res.json({
        status: "error",
        message: "User not found"
      })
    }
  })
})

// Updated USER ROUTE (Using Authorization header)
app.get('/user', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN format
  
  if (token) {
    jwt.verify(token, 'secret', (err, user) => {  
      if (err) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated"
        })
      }
      return res.json({
        status: "success",
        user
      })
    })
  } else {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated"
    })
  }
})

// Updated SIGNOUT ROUTE
app.post('/signout', (req, res) => {
  return res.json({
    status: "success",
    message: "User signed out"
  });
})

// SIGNUP ROUTE
app.post('/signup', (req, res) => {
  const {username, email, password} = req.body;
  bcrypt.hash(password, 10)
  .then(hash => {
    UserModel.create({username, email, password: hash})
    .then(users => res.json({
      status: "success", 
      message: "User created successfully",
      user: users
    }))
    .catch(err => res.json({
      status: "error",
      message: "Error creating user",
      error: err
    }))
  })
})

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});