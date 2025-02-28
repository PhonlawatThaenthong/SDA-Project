const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const UserModel = require('./user')

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:1234@cluster0.5ojwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// ✅ LOGIN ROUTE (Fix)
app.post('/login', (req ,res) => {
  const { _id, email, password } = req.body

  UserModel.findOne({ email : email })
  .then(user => {
      if (user) {
          bcrypt.compare(password, user.password, (err, response) => {
              if(response) {
                  const token = jwt.sign({ _id: user._id, email : user.email, username : user.username }, 'secret', { expiresIn: '1hr' }) 
                  res.cookie('token', token, {
                      httpOnly: true,
                      secure: true, // Set to true in production
                      sameSite: 'none', // Change to 'none' in production if using cross-site cookies
                      maxAge: 3600000 // 1 hour in milliseconds
                    });
                  return res.json("User signed in")
              } else {
                  return res.json("Email or password is incorrect")
                  
              }
          })
      } else {
          return res.json("User not found")
      }

  })
})

app.get('/user', (req, res) => {
  const token = req.cookies['token']
  if(token) {
      jwt.verify(token, 'secret', (err, user) => {  
          if(err) {
              return res.json("User not authenticated")
          }
          return res.json(user)
      })
  } 
  else {
      return res.json("User not authenticated")
  }
})

app.post('/signout', (req, res) => {
  res.clearCookie('token');
  return res.json("User signed out");
})

// ✅ SIGNUP ROUTE (Fix)
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
