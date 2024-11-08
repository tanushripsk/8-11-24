const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const Locations = require("./models/Locations");
var jwt = require("jsonwebtoken");
const jwt_key = "gayatrimam@123";

const app = express();

const buildpath = path.join(__dirname, "../build");
app.use(express.static(buildpath));

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins
  })
);
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://vyomidada:zSOQeNxQBM0BlBLM@cluster0.hzhmx.mongodb.net/",
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/freelisting", require("./routes/freelisting"));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error during request:", err);
  res.status(500).send("Something's broken. Please refresh the page!");
});

const PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
