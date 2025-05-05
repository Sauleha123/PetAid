import { useState } from "react";
import axios from "axios";

const PetRecommendation = () => {
  const [formData, setFormData] = useState({
    category: "",
    climaticCondition: "",
    lifestyle: "",
    space: "",
    experience: "",
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const petCategories = [
    "Dog",
    "Cat",
    "Bird",
    "Fish",
    "Rabbit",
    "Hamster",
    "Guinea Pig",
    "Reptile",
    "Ferret",
  ];

  const climateOptions = [
    "Tropical (Humid & Warm)",
    "Arid (Dry & Hot)",
    "Temperate (Mild)",
    "Cold (Snowy/Chilly)",
    "Wet & Rainy",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Based on the following user input, recommend a specific breed and its common name for the selected pet category. Additionally, provide a Google Images search URL for the breed by formatting the breed name into the URL: https://www.google.com/search?tbm=isch&q=<breed_name>. Replace spaces with '+' in the query.
    - Pet Category: ${formData.category}
    - Lifestyle: ${formData.lifestyle}
    - Living space: ${formData.space}
    - Climate: ${formData.climaticCondition}
    - Pet experience: ${formData.experience}
    Provide the response in JSON format with fields: category, breed, commonName, imageSearchUrl.`;

    try {
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const generatedText = res.data.candidates[0]?.content?.parts[0]?.text || "{}";
      const result = JSON.parse(generatedText.replace(/```json\n|\n```/g, ""));
      
      // Validate imageSearchUrl
      if (!result.imageSearchUrl || !result.imageSearchUrl.includes("google.com/search?tbm=isch")) {
        const breedQuery = encodeURIComponent(result.breed.replace(/\s+/g, "+"));
        result.imageSearchUrl = `https://www.google.com/search?tbm=isch&q=${breedQuery}`;
      }
      
      setRecommendation(result);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      const fallbackRecommendations = {
        Dog: { 
          category: "Dog", 
          breed: "Labrador Retriever", 
          commonName: "Lab",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Labrador+Retriever"
        },
        Cat: { 
          category: "Cat", 
          breed: "Maine Coon", 
          commonName: "Maine Coon",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Maine+Coon"
        },
        Bird: { 
          category: "Bird", 
          breed: "Budgerigar", 
          commonName: "Budgie",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Budgerigar"
        },
        Fish: { 
          category: "Fish", 
          breed: "Betta", 
          commonName: "Betta Fish",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Betta"
        },
        Rabbit: { 
          category: "Rabbit", 
          breed: "Holland Lop", 
          commonName: "Lop",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Holland+Lop"
        },
        Hamster: { 
          category: "Hamster", 
          breed: "Syrian", 
          commonName: "Teddy Bear",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Syrian+Hamster"
        },
        "Guinea Pig": { 
          category: "Guinea Pig", 
          breed: "American", 
          commonName: "Cavy",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=American+Guinea+Pig"
        },
        Reptile: { 
          category: "Reptile", 
          breed: "Ball Python", 
          commonName: "Python",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Ball+Python"
        },
        Ferret: { 
          category: "Ferret", 
          breed: "Standard", 
          commonName: "Ferret",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Ferret"
        },
      };
      setRecommendation(
        fallbackRecommendations[formData.category] || {
          category: "Dog",
          breed: "Labrador Retriever",
          commonName: "Lab",
          imageSearchUrl: "https://www.google.com/search?tbm=isch&q=Labrador+Retriever",
        }
      );
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
          Pet Recommendation
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
              Pet Category
            </label>
            <select
              name="category"
              value={formData.category}
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
              {petCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
              Lifestyle
            </label>
            <select
              name="lifestyle"
              value={formData.lifestyle}
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
              <option value="Active">Active</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Balanced">Balanced</option>
            </select>
          </div>

          {/* Climate Dropdown */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
                display: "block",
                color: "#333",
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
              }}>Climate</label>
            <select
              name="climaticCondition"
              value={formData.climaticCondition}
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
              {climateOptions.map((climate) => (
                <option key={climate} value={climate}>
                  {climate}
                </option>
              ))}
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
              Living Space
            </label>
            <select
              name="space"
              value={formData.space}
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
              <option value="Apartment">Apartment</option>
              <option value="House with yard">House with yard</option>
              <option value="Small space">Small space</option>
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
              Pet Experience
            </label>
            <select
              name="experience"
              value={formData.experience}
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
              <option value="None">None</option>
              <option value="Some">Some</option>
              <option value="Experienced">Experienced</option>
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
            {loading ? "Loading..." : "Get Recommendation"}
          </button>
        </form>

        {recommendation && (
          <div style={{ marginTop: "2rem", textAlign: "left" }}>
            <h3
              style={{
                color: "#ff6f61",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Your Pet Recommendation
            </h3>
            <p
              style={{
                color: "#333",
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Category:</strong> {recommendation.category}
            </p>
            <p
              style={{
                color: "#333",
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Breed:</strong> {recommendation.breed}
            </p>
            <p style={{
                color: "#333",
                fontSize: "1rem",
                marginBottom: "0.5rem",
                }}>
                  <strong>Climate Considered:</strong> {formData.climaticCondition}
            </p>
            <p
              style={{
                color: "#333",
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Common Name:</strong> {recommendation.commonName}
            </p>
            <p
              style={{
                color: "#333",
                fontSize: "1rem",
                marginBottom: "1rem",
              }}
            >
              <strong>Images:</strong>{" "}
              <a
                href={recommendation.imageSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ff6f61", textDecoration: "underline" }}
              >
                View {recommendation.breed} images on Google
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetRecommendation;