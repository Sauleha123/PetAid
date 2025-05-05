import React, { useState, useEffect, Suspense, lazy } from "react";
import {Routes,Route,Navigate,Link,useLocation,} from "react-router-dom";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import localLogo from "./logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";

// Lazy load components
const Auth = lazy(() => import("./components/Auth"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./components/Home"));
const Lessons = lazy(() => import("./components/Lessons"));
const AIAssistant = lazy(() => import("./components/AIAssistant"));
const Shop = lazy(() => import("./components/Shop"));
const VetConsultation = lazy(() => import("./components/VetConsultation"));
const PetRecommendation = lazy(() => import("./components/PetRecommendation"));
const PetMoodDetector = lazy(() => import("./components/PetMoodDetector"));
const IntroPage = lazy(() => import("./components/IntroPage"));
const ChatBox = lazy(() => import("./components/ChatBox"));

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);

  const generateChatId = () => {
    if (!user) return "";
    const vetId = "vet123";
    return `${user.uid}_${vetId}`;
  };

  // List of routes where padding is required
  const routesWithTopPadding = [
    "/home",
    "/lessons",
    "/ai-check",
    "/shop",
    "/vet-consultation",
    "/pet-recommendation",
    "/pet-mood-detector",
    "/chat",
  ];

  // Check if current path needs padding (can also refine with includes or regex for dynamic routes like `/chat/:id`)
  const needsPadding = routesWithTopPadding.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {user && <Navbar user={user} setUser={setUser} chatId={generateChatId()} />}

      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }
      >
        <main className="flex-grow-1" style={{ paddingTop: needsPadding ? "65px" : "0" }}>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/login" element={user ? <Navigate to="/home" /> : <Auth setUser={setUser} />} />
            <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup setUser={setUser} />} />
            <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
            <Route path="/lessons" element={user ? <Lessons /> : <Navigate to="/login" />} />
            <Route path="/ai-check" element={user ? <AIAssistant /> : <Navigate to="/login" />} />
            <Route path="/shop" element={user ? <Shop /> : <Navigate to="/login" />} />
            <Route path="/vet-consultation" element={user ? <VetConsultation /> : <Navigate to="/login" />} />
            <Route path="/pet-recommendation" element={user ? <PetRecommendation /> : <Navigate to="/login" />} />
            <Route path="/pet-mood-detector" element={user ? <PetMoodDetector /> : <Navigate to="/login" />} />
            <Route path="/chat/:chatId" element={user ? <ChatBox /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </Suspense>

      <Footer />
    </div>
  );
};

const Navbar = ({ user, setUser, chatId }: { user: User; setUser: (user: User | null) => void; chatId: string }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-dark d-flex align-items-center" to="/home">
          <img
            src={localLogo}
            alt="PetAid Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          PetAid
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <NavItem to="/lessons">Lessons</NavItem>
            <NavItem to="/ai-check">AI Check</NavItem>
            <NavItem to="/shop">Shop</NavItem>
            <NavItem to="/vet-consultation">Vet Consultation</NavItem>
            <NavItem to="/pet-recommendation">Pet Recommendation</NavItem>
            <NavItem to="/pet-mood-detector">Pet Mood Detector</NavItem>
            <NavItem to={`/chat/${chatId}`}>Chat</NavItem>
            {user ? (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link text-dark fw-semibold bg-transparent border-0 py-2 px-3 hover:text-blue-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <NavItem to="/signup">Sign Up</NavItem>
                <NavItem to="/login">Log In</NavItem>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li className="nav-item">
    <Link
      className="nav-link text-dark fw-semibold py-2 px-3 hover:text-blue-600 transition-colors duration-200"
      to={to}
    >
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer
      className="py-4 mt-auto text-center"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
        bottom: "0",
        width: "100%",
      }}
    >
      <div className="container-fluid px-4">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-dark mb-0">
              © {new Date().getFullYear()} PetAid. All rights reserved.
            </p>
          </div>
          <div className="col-12 col-md-6">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-end gap-3">
              <a
                href="mailto:madiwalesauleha@gmail.com"
                className="text-dark text-decoration-none hover:text-blue-600 transition-colors duration-200"
              >
                madiwalesauleha@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/sauleha-madiwale-69325a27b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark hover:text-blue-600 transition-colors duration-200"
              >
                <i className="bi bi-linkedin" style={{ fontSize: "24px" }}></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
