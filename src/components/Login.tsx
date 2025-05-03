import React, { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import localImage from "./1.png"; // Import the local image
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '../App.css';


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
      else navigate("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      if (onSuccess) onSuccess();
      else navigate("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="mb-3">
          <img
            src={localImage}
            alt="PetAid Logo"
            className="rounded-circle border border-2 border-primary shadow-sm"
            style={{ width: "80px", height: "80px" }}
          />
        </div>

        <h2 className="fw-bold text-primary mb-3">Dive In!</h2>

        <div className="mt-4">
          <button onClick={handleGoogleLogin} className="btn google-btn w-100 mb-3">
          <i className="bi bi-google me-2"></i> Log in with Google
          </button>
        </div>

        {/* OR Divider */}
        <div className="or-divider d-flex align-items-center text-muted my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 fw-semibold">OR</span>
          <hr className="flex-grow-1" />
        </div>

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


        <p>
          Don't have an account?{" "}
          <a href="/signup" className="text-decoration-none text-primary fw-semibold">Sign Up</a>
        </p>

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
