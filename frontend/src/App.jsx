import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [clicks, setClicks] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_URL = "https://url-shortener-api-zp3j.onrender.com";

  const handleShorten = async () => {
    setError("");
    setShortUrl("");
    setShortCode("");
    setClicks(null);
    setCopied(false);

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to shorten URL.");
        return;
      }

      setShortUrl(data.shortUrl);
      setShortCode(data.shortCode);
      setClicks(0);
    } catch (err) {
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = async () => {
    if (!shortCode) return;

    try {
      const res = await fetch(`${API_URL}/analytics/${shortCode}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analytics not found.");
        return;
      }

      setClicks(data.clicks);
    } catch (err) {
      setError("Could not fetch analytics.");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>Full-Stack Project</div>

        <h1 style={styles.title}>URL Shortener</h1>

        <p style={styles.subtitle}>
          Shorten long links and track clicks in real time.
        </p>

        <div style={styles.techRow}>
          <span style={styles.techBadge}>React</span>
          <span style={styles.techBadge}>Node.js</span>
          <span style={styles.techBadge}>Express</span>
          <span style={styles.techBadge}>Render</span>
        </div>

        <div style={styles.inputBox}>
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleShorten} style={styles.primaryButton}>
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {shortUrl && (
          <div style={styles.resultBox}>
            <p style={styles.resultLabel}>Your short link</p>

            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.shortLink}
            >
              {shortUrl}
            </a>

            <div style={styles.buttonRow}>
              <button onClick={copyLink} style={styles.secondaryButton}>
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <button onClick={getAnalytics} style={styles.secondaryButton}>
                Check Clicks
              </button>
            </div>

            <div style={styles.analyticsCard}>
              <p style={styles.analyticsTitle}>Analytics</p>
              <p style={styles.analyticsNumber}>
                {clicks !== null ? clicks : 0}
              </p>
              <p style={styles.analyticsText}>Total Clicks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "780px",
    background: "rgba(255, 255, 255, 0.96)",
    borderRadius: "24px",
    padding: "44px",
    textAlign: "center",
    boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
  },
  badge: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "54px",
    margin: "0 0 10px",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "18px",
    color: "#64748b",
    marginBottom: "20px",
  },
  techRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },
  techBadge: {
    background: "#f1f5f9",
    color: "#334155",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "600",
  },
  inputBox: {
    display: "flex",
    gap: "12px",
    background: "#f8fafc",
    padding: "10px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "16px",
    padding: "14px",
    color: "#0f172a",
  },
  primaryButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "28px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "24px",
  },
  resultLabel: {
    color: "#64748b",
    marginBottom: "10px",
    fontWeight: "600",
  },
  shortLink: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: "17px",
    wordBreak: "break-all",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  secondaryButton: {
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "11px 18px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  analyticsCard: {
    margin: "24px auto 0",
    maxWidth: "220px",
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
  },
  analyticsTitle: {
    margin: 0,
    color: "#93c5fd",
    fontWeight: "bold",
  },
  analyticsNumber: {
    fontSize: "42px",
    fontWeight: "bold",
    margin: "8px 0",
  },
  analyticsText: {
    margin: 0,
    color: "#cbd5e1",
  },
  error: {
    color: "#dc2626",
    marginTop: "16px",
    fontWeight: "600",
  },
};

export default App;