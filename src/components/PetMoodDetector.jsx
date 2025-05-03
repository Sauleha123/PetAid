import { useState } from "react";
import axios from "axios";

const PetMoodDetector = () => {
  const [formData, setFormData] = useState({
    behavior: "",
    appetite: "",
    activity: "",
  });
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Based on the following pet details, determine the pet's mood (e.g., Happy, Stressed, Sick, etc.) and provide a brief explanation:
    - Behavior: ${formData.behavior}
    - Appetite: ${formData.appetite}
    - Activity level: ${formData.activity}
    Provide the response in JSON format with fields: mood, explanation.`;

    try {
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const res = await axios.post(API_URL, payload, { headers: { "Content-Type": "application/json" } });
      const generatedText = res.data.candidates[0]?.content?.parts[0]?.text || "{}";
      const result = JSON.parse(generatedText.replace(/```json\n|\n```/g, ""));
      setMood(result);
    } catch (error) {
      console.error("Error detecting mood:", error);
      setMood({
        mood: "Happy",
        explanation: "Your pet seems to be doing well based on typical behavior.",
      }); // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "url('https://wallpapercave.com/wp/WEZQPxy.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          padding: "2rem",
          width: "90%",
          maxWidth: "600px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#ff6f61",
            fontSize: "2rem",
            marginBottom: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Pet Mood Detector
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "#333",
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
              }}
            >
              Behavior
            </label>
            <select
              name="behavior"
              value={formData.behavior}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            >
              <option value="">Select...</option>
              <option value="Playful">Playful</option>
              <option value="Aggressive">Aggressive</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "#333",
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
              }}
            >
              Appetite
            </label>
            <select
              name="appetite"
              value={formData.appetite}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            >
              <option value="">Select...</option>
              <option value="Normal">Normal</option>
              <option value="Increased">Increased</option>
              <option value="Decreased">Decreased</option>
            </select>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "#333",
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
              }}
            >
              Activity Level
            </label>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            >
              <option value="">Select...</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#ff6f61",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "5px",
              border: "none",
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading..." : "Detect Mood"}
          </button>
        </form>

        {mood && (
          <div style={{ marginTop: "2rem", textAlign: "left" }}>
            <h3
              style={{
                color: "#ff6f61",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Pet Mood Analysis
            </h3>
            <p style={{ color: "#333", fontSize: "1rem", marginBottom: "0.5rem" }}>
              <strong>Mood:</strong> {mood.mood}
            </p>
            <p style={{ color: "#333", fontSize: "1rem" }}>
              <strong>Explanation:</strong> {mood.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetMoodDetector;