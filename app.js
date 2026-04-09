require("dotenv").config();

const express = require("express");
const { nanoid } = require("nanoid");
const db = require("./db");
const { client, connectRedis } = require("./redisClient");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("URL Shortener API Running");
});

app.post("/shorten", (req, res) => {
    const longUrl = req.body.url;

    if (!longUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortCode = nanoid(6);

    const sql = "INSERT INTO urls (short_code, long_url) VALUES (?, ?)";
    db.query(sql, [shortCode, longUrl], async (err) => {
        if (err) {
            console.error("Insert error:", err.message);
            return res.status(500).json({ error: "Database insert failed" });
        }

        try {
            await client.set(shortCode, longUrl);
        } catch (redisErr) {
            console.error("Redis set error:", redisErr.message);
        }

        res.json({
            shortUrl: `${BASE_URL}/${shortCode}`,
            shortCode: shortCode
        });
    });
});

app.get("/analytics/:code", (req, res) => {
    const code = req.params.code;

    const sql = "SELECT short_code, long_url, clicks, created_at FROM urls WHERE short_code = ?";
    db.query(sql, [code], (err, results) => {
        if (err) {
            console.error("Analytics error:", err.message);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "URL not found in database" });
        }

        res.json(results[0]);
    });
});

app.get("/all-urls", (req, res) => {
    db.query("SELECT * FROM urls", (err, results) => {
        if (err) {
            console.error("All URLs error:", err.message);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results);
    });
});

app.get("/:code", async (req, res) => {
    const code = req.params.code;
    console.log("Redirect route called with code:", code);

    try {
        const cachedUrl = await client.get(code);

        if (cachedUrl) {
            console.log("Cache hit for:", code);

            const updateSql = "UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?";
            db.query(updateSql, [code], (updateErr) => {
                if (updateErr) {
                    console.error("Update error:", updateErr.message);
                }

                return res.redirect(cachedUrl);
            });

            return;
        }

        console.log("Cache miss for:", code);

        const selectSql = "SELECT long_url FROM urls WHERE short_code = ?";
        db.query(selectSql, [code], async (err, results) => {
            if (err) {
                console.error("Select error:", err.message);
                return res.status(500).send("Database error");
            }

            if (results.length === 0) {
                return res.status(404).send("URL not found");
            }

            const longUrl = results[0].long_url;

            try {
                await client.set(code, longUrl);
            } catch (redisErr) {
                console.error("Redis set error:", redisErr.message);
            }

            const updateSql = "UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?";
            db.query(updateSql, [code], (updateErr) => {
                if (updateErr) {
                    console.error("Update error:", updateErr.message);
                }

                res.redirect(longUrl);
            });
        });
    } catch (error) {
        console.error("Redis get error:", error.message);
        res.status(500).send("Server error");
    }
});

connectRedis()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect Redis:", err.message);
    });