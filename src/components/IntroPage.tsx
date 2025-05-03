import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./2.png"; // Ensure you have a logo file in the assets folder
import '../App.css';

const IntroPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleServiceClick = () => {
    setShowModal(true);
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 p-0">
      {/* Navigation Bar */}
      <div className="d-flex justify-content-end p-3 flex-wrap">
        <Link to="/login" className="btn btn-primary me-2 shadow-sm px-4 mb-2 mb-md-0">
          Log In
        </Link>
        <Link to="/signup" className="btn google-btn shadow-sm px-4">
          Sign Up
        </Link>
      </div>

      {/* Main Content */}
      <div className="row flex-grow-1 d-flex align-items-center flex-column flex-md-row py-4">
        {/* Left Side - Logo Image */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <img src={logo} alt="PetAid Logo" className="img-fluid" style={{ maxWidth: "80%", maxHeight: "300px" }} />
        </div>

        {/* Right Side - Features Section */}
        <div className="col-12 col-md-6 text-center p-4">
          <h1 className="fw-bold text-primary mb-3" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
            Welcome to PetAid 🐾
          </h1>
          <p className="text-muted mb-4" style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)" }}>
            Your one-stop solution for pet care services. Get AI-powered health checks, expert consultations,
            and the best pet products, all in one place.
          </p>

          <h2 className="h4 mb-4">Our Services</h2>
          <div className="row g-3">
            {[
              { icon: "📚", title: "Pet Education", description: "Learn about pet care, training, and health." },
              { icon: "🤖", title: "AI Health Check", description: "Diagnose pet health issues with AI." },
              { icon: "🛍️", title: "Pet Store", description: "Shop for pet supplies and accessories." },
              { icon: "🛍️", title: "Pet Recommendation", description: "Decide who will be your partner." },
              { icon: "🛍️", title: "Pet Mood Detector", description: "Helps in diagnosing mood of your pet." },
              { icon: "👩‍⚕️", title: "Vet Consultation", description: "Schedule appointments with certified vets." },
            ].map((service, index) => (
              <div className="col-12 col-sm-6" key={index}>
                <div
                  className="p-3 border rounded bg-light shadow-sm service-tile"
                  onClick={handleServiceClick}
                >
                  {service.icon} <strong>{service.title}</strong>
                  <p className="small text-muted mb-0">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>You need to log in to access this service.</p>
              </div>
              <div className="modal-footer">
                <Link to="/login" className="btn btn-primary">
                  Log In
                </Link>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Responsiveness */}
      <style>{`
        .service-tile {
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .service-tile:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        @media (max-width: 767px) {
          .container-fluid {
            padding-bottom: 2rem;
          }
          .row.flex-grow-1 {
            align-items: flex-start;
          }
          .service-tile {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default IntroPage;