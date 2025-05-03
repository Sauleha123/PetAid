import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import localImage from "./1.png"; // Import the local image
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is loaded
import "bootstrap-icons/font/bootstrap-icons.css"; // Optional for icons

interface LoginProps {
  setUser: (user: any) => void;
  onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ setUser, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      if (onSuccess) onSuccess();
      else navigate("/home"); // Default redirect if no onSuccess callback
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      {/* Card Container */}
      <div className="card shadow p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
        {/* Logo */}
        <div className="mb-3">
          <img
            src={localImage}
            alt="PetAid Logo"
            className="rounded-circle border border-2 border-primary shadow-sm"
            style={{ width: "80px", height: "80px" }}
          />
        </div>

        {/* Title */}
        <h2 className="fw-bold text-primary mb-3">Dive In!</h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mb-3">
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Log In</button>
        </form>

        {/* Links */}
       
        <p>
          Don't have an account? <a href="/signup" className="text-decoration-none text-primary fw-semibold">Sign Up</a>
        </p>

        {/* Features Section */}
        <div className="mt-4">
          <h5 className="fw-bold text-dark">PetAid Features</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <i className="bi bi-journal-bookmark-fill text-primary me-2"></i> Lessons
            </li>
            <li className="list-group-item">
              <i className="bi bi-heart-pulse-fill text-danger me-2"></i> Vet Consultation
            </li>
            <li className="list-group-item">
              <i className="bi bi-bag-fill text-success me-2"></i> Shop
            </li>
            <li className="list-group-item">
              <i className="bi bi-robot text-info me-2"></i> AI Checking
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
