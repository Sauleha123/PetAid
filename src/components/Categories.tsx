import styled from "styled-components";

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h3`
  color: #ff6f61;
  margin-bottom: 0.5rem;
`;

const Categories = () => {
  const lessons = [
    { title: "Feeding Your Pet", content: "Ensure a balanced diet with proteins, carbs, and vitamins." },
    { title: "Grooming Tips", content: "Brush your pet weekly to keep their coat shiny." },
    { title: "Exercise Needs", content: "Daily walks or playtime keep your pet healthy." },
  ];

  return (
    <>
      <h2>Pet Care Lessons</h2>
      {lessons.map((lesson, index) => (
        <Card key={index}>
          <Title>{lesson.title}</Title>
          <p>{lesson.content}</p>
        </Card>
      ))}
    </>
  );
};

export default Categories;