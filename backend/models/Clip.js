const mongoose = require("mongoose");

const clipSchema = new mongoose.Schema({
  text: { type: String, required: true },
  note: { type: String },
  summary: { type: String },
  url: { type: String },
  date: { type: String }, // e.g. "July 8, 2025, 5:00 PM"
  pin: { type: Boolean, default: false } // ✅ Add this line
});

module.exports = mongoose.model("Clip", clipSchema);
