import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [clicks, setClicks] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    setError("");
    setShortUrl("");
    setShortCode("");
    setClicks(null);
    setCopied(false);
    setLoading(true);

    try {
      const res = await fetch(
        "https://url-shortener-api-zp3j.onrender.com/shorten",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to shorten URL");
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
      const res = await fetch(
        `https://url-shortener-api-zp3j.onrender.com/analytics/${shortCode}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analytics not found");
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
        <h1 style={styles.title}>URL Shortener</h1>
        <p style={styles.subtitle}>
          Shorten long links and track clicks in real time.
        </p>

        <div style={styles.inputRow}>
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
            <p style={styles.label}>Your short link</p>

            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
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

            {clicks !== null && (
              <p style={styles.clicks}>Total Clicks: {clicks}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #111827, #1f2937)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "650px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "44px",
    marginBottom: "10px",
    color: "#111827",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "30px",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  input: {
    flex: "1",
    minWidth: "260px",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
  },
  primaryButton: {
    padding: "14px 22px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "14px",
    background: "#f3f4f6",
  },
  label: {
    color: "#6b7280",
    marginBottom: "8px",
  },
  link: {
    color: "#2563eb",
    fontWeight: "bold",
    wordBreak: "break-all",
  },
  buttonRow: {
    marginTop: "18px",
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  secondaryButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
  },
  clicks: {
    marginTop: "15px",
    fontWeight: "bold",
    color: "#111827",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
};

export default App;