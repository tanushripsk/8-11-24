const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const Locations = require("./models/Locations");
var jwt = require("jsonwebtoken");
const jwt_key = "gayatrimam@123";

const app = express();

// Middleware
// app.use(
//   cors({
//     origin: "*", // Allow all origins
//   })
// );
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// MongoDB connection
mongoose.connect(
  "mongodb://nagpurdial_nagpurdialpsk:2HUqJfIWlZ@157.173.119.93:27017/nagpurdial_NagpurDial1?authSource=admin",
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// Routes for search by locations
app.post("/api/search", async (req, res) => {
  const { locationsName } = req.body;
  try {
    const locations = await Locations.find({
      name: { $regex: locationsName, $options: "i" }, // Case-insensitive search by component name
    });
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Routes for search by business name and address as well
app.post("/api/location", async (req, res) => {
  const { locationsName } = req.body;
  if (typeof locationsName !== "string" || locationsName.trim() === "") {
    return res.status(400).json({ message: "Invalid input" });
  }
  try {
    const locations = await Locations.find({
      $or: [
        { description: { $regex: locationsName, $options: "i" } },
        { name: { $regex: locationsName, $options: "i" } },
      ],
    });
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Schema for login
const userSchema = new mongoose.Schema({
  email: String,
  number: String,
});
const User = mongoose.model("User", userSchema);

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, number } = req.body;
    if (!email || !number) {
      return res.status(400).send("Email and number are required");
    }
    const user = await User.findOne({ email, number });
    if (!user) {
      return res.status(401).send("Invalid email or number");
    }
    res.status(200).send("Login successful");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error during request:", err);
  res.status(500).send("Something's broken. Please refresh the page!");
});

const PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
