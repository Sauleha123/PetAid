import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaPaw, FaHeart, FaStar } from "react-icons/fa";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Fetch pet care tips from Gemini API
  const fetchPetCareTips = async () => {
    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const payload = {
        contents: [{ parts: [{ text: "Provide 3 concise pet care tips, each as a single line without numbering." }] }],
      };

      const res = await axios.post(API_URL, payload, { headers: { "Content-Type": "application/json" } });
      const generatedText = res.data.candidates[0]?.content?.parts[0]?.text || "";
      const tipsArray = generatedText.split("\n").filter((tip) => tip.trim() !== "");
      const shuffledTips = tipsArray.sort(() => Math.random() - 0.5).slice(0, 3);
      setTips(shuffledTips);
    } catch (error) {
      console.error("Error fetching pet care tips:", error);
      setTips([
        "Ensure your pet gets regular exercise to stay healthy.",
        "Provide fresh water daily to keep your pet hydrated.",
        "Engage your pet with toys to stimulate their mind.",
      ]);
    }
  };

  useEffect(() => {
    fetchPetCareTips();
  }, []);

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (current, next) => setActiveSlide(next),
    customPaging: (i) => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: activeSlide === i ? "#ff6f61" : "#ddd",
          transition: "all 0.3s ease",
        }}
      />
    ),
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ul style={{ margin: "0", padding: "0" }}>{dots}</ul>
      </div>
    ),
  };

  const carouselItems = [
    {
      title: "Interactive Pet Lessons",
      description: "Master pet care, training, and health through our engaging courses.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      path: "/lessons",
      icon: <FaPaw />,
      color: "#4CAF50",
    },
    {
      title: "AI Health Checker",
      description: "Get instant pet health assessments and personalized recommendations.",
      image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b",
      path: "/ai-check",
      icon: <FaHeart />,
      color: "#E91E63",
    },
    {
      title: "Premium Pet Shop",
      description: "Discover high-quality food, toys, and accessories for your furry friends.",
      image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9",
      path: "/shop",
      icon: <FaStar />,
      color: "#FF9800",
    },
    {
      title: "Expert Vet Consultations",
      description: "Connect with certified veterinarians through convenient video appointments.",
      image: "https://tse1.mm.bing.net/th?id=OIP.6RYho7aVj6ExrkA6b5dq0wHaE8&pid=Api&P=0&h=180",
      path: "/vet-consultation",
      icon: <FaPaw />,
      color: "#2196F3",
    },
    {
      title: "Find Your Perfect Pet",
      description: "Discover which pet matches your lifestyle with our smart recommendation tool.",
      image: "https://easyscienceforkids.com/wp-content/uploads/2019/05/Persian-Cat-23-4-1.jpg",
      path: "/pet-recommendation",
      icon: <FaHeart />,
      color: "#9C27B0",
    },
    {
      title: "Pet Mood Analysis",
      description: "Understand your pet's emotions and behavior with our advanced AI detector.",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
      path: "/pet-mood-detector",
      icon: <FaStar />,
      color: "#607D8B",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        backgroundSize: "cover",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "2.5rem",
          width: "95%",
          maxWidth: "1100px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          marginBottom: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
            <FaPaw style={{ color: "#ff6f61", fontSize: "2.5rem", marginRight: "1rem" }} />
            <h1
              style={{
                color: "#333",
                fontSize: "2.5rem",
                fontWeight: "800",
                margin: 0,
                background: "linear-gradient(90deg, #ff6f61 0%, #ff9671 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PetAid
            </h1>
          </div>
          <h2
            style={{
              color: "#444",
              fontSize: "1.8rem",
              marginBottom: "1rem",
              fontWeight: "600",
            }}
          >
            Welcome, {user?.email ? user.email.split('@')[0] : "Pet Lover"}! 🐾
          </h2>
          <p
            style={{
              color: "#666",
              fontSize: "1.2rem",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Your one-stop destination for all pet care needs. Explore our features and give your furry friends the care they deserve!
          </p>
        </div>

        {/* Enhanced Carousel */}
        <div style={{ position: "relative", marginBottom: "3rem" }}>
          <Slider {...settings}>
            {carouselItems.map((item, index) => (
              <div key={index}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
                    display: "flex",
                    flexDirection: window.innerWidth < 768 ? "column" : "row",
                    margin: "10px",
                    border: `1px solid ${item.color}20`,
                    height: window.innerWidth < 768 ? "auto" : "350px",
                    transition: "transform 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: window.innerWidth < 768 ? "100%" : "50%",
                      height: window.innerWidth < 768 ? "200px" : "100%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        left: "15px",
                        background: item.color,
                        color: "#fff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "1.5rem",
                      width: window.innerWidth < 768 ? "100%" : "50%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <h3
                      style={{
                        color: item.color,
                        fontSize: "1.6rem",
                        fontWeight: "700",
                        marginBottom: "0.8rem",
                        borderBottom: `2px solid ${item.color}30`,
                        paddingBottom: "0.5rem",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ color: "#555", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                      {item.description}
                    </p>
                    <button
                      style={{
                        background: item.color,
                        color: "#fff",
                        border: "none",
                        padding: "0.7rem 1.2rem",
                        borderRadius: "50px",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: "pointer",
                        alignSelf: "flex-start",
                        transition: "all 0.3s ease",
                        boxShadow: `0 4px 10px ${item.color}40`,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = `0 6px 15px ${item.color}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = `0 4px 10px ${item.color}40`;
                      }}
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Pet Care Tips Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
          borderRadius: "20px",
          padding: "2rem",
          width: "95%",
          maxWidth: "1100px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          marginBottom: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
          <FaHeart style={{ color: "#ff6f61", fontSize: "1.8rem", marginRight: "0.8rem" }} />
          <h3
            style={{
              color: "#333",
              fontSize: "1.8rem",
              fontWeight: "700",
              margin: 0,
            }}
          >
            Today's Pet Care Tips
          </h3>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {tips.map((tip, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "1.2rem",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                flex: "1 1 300px",
                border: "1px solid #f0f0f0",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "#ff6f61",
                    fontSize: "1.2rem",
                    marginRight: "0.5rem",
                    marginTop: "0.1rem",
                  }}
                >
                  •
                </span>
                <p
                  style={{
                    color: "#555",
                    fontSize: "1.05rem",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div
        style={{
          background: "linear-gradient(90deg, #ff6f61 0%, #ff9671 100%)",
          borderRadius: "20px",
          padding: "2rem",
          width: "95%",
          maxWidth: "1100px",
          boxShadow: "0 10px 30px rgba(255, 111, 97, 0.3)",
          textAlign: "center",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "1rem" }}>
          Ready to give your pet the best care?
        </h3>
        <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem", maxWidth: "800px" }}>
          Explore all our features or start with a pet health assessment today.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            style={{
              background: "#fff",
              color: "#ff6f61",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate("/ai-check")}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
            }}
          >
            Start Health Check
          </button>
          <button
            style={{
              background: "transparent",
              color: "#fff",
              border: "2px solid #fff",
              padding: "0.8rem 1.5rem",
              borderRadius: "50px",
              fontWeight: "600",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate("/lessons")}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Explore Lessons
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;