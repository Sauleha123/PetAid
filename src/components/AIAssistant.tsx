import { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: url("https://img.freepik.com/free-vector/emotional-support-animal-concept-illustration_114360-26130.jpg?t=st=1741636464~exp=1741640064~hmac=ae359f9132f14d524b9354ca9e506bfa38803ed36ffb67cae15d578cbf767701&w=1060") no-repeat center center fixed;
  background-size: cover;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.9); /* Semi-transparent white background */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: none;
  height: 100px;
  &:focus {
    border-color: #ff6f61;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #e65b50;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Response = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9); /* Semi-transparent white background */
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100%;
  max-width: 600px;
  max-height: 300px; /* Fixed height for scrollable area */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const ResponseTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ResponseList = styled.ul`
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
`;

const ResponseItem = styled.li`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const AIAssistant = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Provide a concise diagnosis and care guidelines for a pet with the following symptoms: ${symptoms}. Format the response as 3-4 bullet points.`,
              },
            ],
          },
        ],
      };

      const res = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Extract the generated text from the response
      const generatedText = res.data.candidates[0]?.content?.parts[0]?.text || "No diagnosis available.";
      setResponse(generatedText);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      setResponse("Error fetching diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Convert response text to bullet points
  const formatResponse = (text: string) => {
    return text.split("\n").map((line, index) => (
      <ResponseItem key={index}>{line.replace(/^\s*[\-\*]?\s*/, "")}</ResponseItem>
    ));
  };

  return (
    <Container>
      <h2>AI Health Assistant</h2>
      <Form onSubmit={handleSubmit}>
        <TextArea
          placeholder="Describe your pet's symptoms (e.g., vomiting, lethargy)..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Diagnosing..." : "Get Diagnosis"}
        </Button>
      </Form>
      {response && (
        <Response>
          <ResponseTitle>Diagnosis and Care Guidelines:</ResponseTitle>
          <ResponseList>{formatResponse(response)}</ResponseList>
        </Response>
      )}
    </Container>
  );
};

export default AIAssistant;