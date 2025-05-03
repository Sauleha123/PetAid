import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../firebase";
import styled from "styled-components";
import Signup from "./Signup";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
`;

const ToggleLink = styled.p`
  text-align: center;
  color: #4b5563;
  margin-top: 1rem;
  cursor: pointer;
  & > span {
    color: #3b82f6;
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface AuthProps {
  setUser: (user: User | null) => void;
}

const Auth: React.FC<AuthProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <Container>
      {isLogin ? (
        <Login setUser={setUser} onSuccess={() => navigate('/home')} />
      ) : (
        <Signup setUser={setUser} onSuccess={() => navigate('/home')} />
      )}
      <ToggleLink>
        {isLogin ? "Don’t have an account? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Log In"}
        </span>
      </ToggleLink>
    </Container>
  );
};

export default Auth;