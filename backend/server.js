const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Clip = require("./models/Clip");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // to parse JSON body

mongoose.connect("mongodb://127.0.0.1:27017/webclips", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});
// Save a new clip
app.post("/api/clips", async (req, res) => {
  try {
    const clip = new Clip(req.body);
    await clip.save();
    res.status(201).json({ message: "Clip saved", clip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save clip" });
  }
});

// Get all clips
app.get("/api/clips", async (req, res) => {
  try {
    const clips = await Clip.find().sort({ _id: -1 });
    res.json(clips);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clips" });
  }
});

// Delete all clips
app.delete("/api/clips", async (req, res) => {
  try {
    await Clip.deleteMany({});
    res.json({ message: "All clips deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete clips" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
