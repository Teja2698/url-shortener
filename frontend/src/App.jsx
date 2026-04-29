import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [clicks, setClicks] = useState(null);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    setError("");
    setShortUrl("");
    setShortCode("");
    setClicks(null);

    try {
      const res = await fetch(
        "https://url-shortener-api-zp3j.onrender.com/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
      console.error(err);
      setError("Could not connect to backend.");
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
      console.error(err);
      setError("Could not fetch analytics.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter your long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "10px", width: "320px" }}
      />

      <br />
      <br />

      <button onClick={handleShorten} style={{ padding: "10px 20px" }}>
        Shorten
      </button>

      <br />
      <br />

      {shortUrl && (
        <div>
          <p>
            Short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </p>

          <button onClick={getAnalytics} style={{ padding: "8px 16px" }}>
            Check Clicks
          </button>

          {clicks !== null && <p>Total Clicks: {clicks}</p>}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;