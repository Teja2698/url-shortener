require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Render URL
const BASE_URL = "https://url-shortener-api-zp3j.onrender.com";

app.use(cors({ origin: "*" }));
app.use(express.json());

// In-memory storage (resets on restart)
const urlMap = {};
const analyticsMap = {};

app.get("/", (req, res) => {
  res.send("URL Shortener API Running");
});

// Create short URL
app.post("/shorten", (req, res) => {
  let longUrl = req.body.url;

  if (!longUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
    longUrl = "https://" + longUrl;
  }

  const shortCode = nanoid(6);

  urlMap[shortCode] = longUrl;

  analyticsMap[shortCode] = {
    clicks: 0,
    longUrl,
    shortCode,
  };

  res.json({
    shortUrl: `${BASE_URL}/${shortCode}`,
    shortCode,
  });
});

// Get analytics
app.get("/analytics/:code", (req, res) => {
  const code = req.params.code;

  if (!analyticsMap[code]) {
    return res.status(404).json({ error: "Analytics not found" });
  }

  res.json(analyticsMap[code]);
});

// Redirect short URL
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const longUrl = urlMap[code];

  if (!longUrl) {
    return res.status(404).send("URL not found");
  }

  analyticsMap[code].clicks += 1;

  res.redirect(longUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});