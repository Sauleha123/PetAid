import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "bootstrap/dist/css/bootstrap.min.css";

interface SignupProps {
  setUser: (user: any) => void;
  onSuccess?: () => void;
}

const Signup: React.FC<SignupProps> = ({ setUser, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      if (onSuccess) onSuccess();
      else navigate("/home"); // Default redirect if no onSuccess callback
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      {/* Signup Card */}
      <div className="card shadow p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="fw-bold text-primary mb-3">Get Registerd</h2>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="mb-3">
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email</label>
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
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>

        {/* Navigation Links */}
        <p className="mb-2">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none text-primary fw-semibold"> {/* Use Link */}
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;