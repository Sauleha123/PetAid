import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin: 3rem 0;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const SectionTitle = styled.h2`
  color: #ff6f61;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ff6f61;
  display: inline-block;
`;

const GuideList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GuideItem = styled.li`
  margin: 1rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
`;

const VideoWrapper = styled.div`
  margin: 1.5rem 0;
  iframe {
    width: 100%;
    max-width: 800px;
    height: 450px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Lessons = () => {
  return (
    <Container>
      <Title>Pet Care Lessons</Title>
      <Subtitle>
        Explore comprehensive guides, tips, and video tutorials to care for your pets effectively!
      </Subtitle>

      {/* Health Section */}
      <Section>
        <SectionTitle>Pet Health Basics</SectionTitle>
        <p>
          Keeping your pet healthy involves regular check-ups, vaccinations, and monitoring their
          behavior. Here are some key tips to ensure your pet thrives:
        </p>
        <GuideList>
          <GuideItem>
            <strong>1. Regular Vet Visits:</strong> Schedule check-ups every 6-12 months to detect
            issues early and maintain a health record.
          </GuideItem>
          <GuideItem>
            <strong>2. Vaccinations:</strong> Ensure core vaccines (e.g., rabies, distemper) are up to
            date, and discuss additional vaccines with your vet based on lifestyle.
          </GuideItem>
          <GuideItem>
            <strong>3. Parasite Control:</strong> Use flea and tick preventatives to protect your pet,
            and check for worms with regular deworming treatments.
          </GuideItem>
          <GuideItem>
            <strong>4. Monitor Behavior:</strong> Watch for changes in appetite, energy, or mood as
            early indicators of health problems.
          </GuideItem>
        </GuideList>
        <VideoWrapper>
          <iframe
            src="https://www.youtube.com/embed/7Jj7ECZNNaI"
            title="Pet Health Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      </Section>

      {/* Nutrition Section */}
      <Section>
        <SectionTitle>Pet Nutrition Guide</SectionTitle>
        <p>
          Proper nutrition is crucial for your pet’s growth, energy, and overall well-being. Here’s a
          step-by-step guide to feeding your pet:
        </p>
        <GuideList>
          <GuideItem>
            <strong>Step 1: Choose Quality Food:</strong> Select a diet based on your pet’s age,
            breed, and health needs (e.g., grain-free for allergies or wet food for hydration).
          </GuideItem>
          <GuideItem>
            <strong>Step 2: Portion Control:</strong> Follow feeding guidelines and adjust for weight,
            activity level, and age to prevent obesity.
          </GuideItem>
          <GuideItem>
            <strong>Step 3: Add Supplements:</strong> Consider probiotics or omega-3s for added
            benefits, but consult a vet before introducing new supplements.
          </GuideItem>
          <GuideItem>
            <strong>Step 4: Fresh Water:</strong> Ensure constant access to clean water to support
            digestion and hydration.
          </GuideItem>
        </GuideList>
        <VideoWrapper>
          <iframe
            src="https://www.youtube.com/embed/ppkBktPF6FI"
            title="Pet Nutrition Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      </Section>

      {/* Training Section */}
      <Section>
        <SectionTitle>Pet Training Techniques</SectionTitle>
        <p>
          Training your pet improves behavior, strengthens your bond, and ensures a harmonious home.
          Follow these steps for success:
        </p>
        <GuideList>
          <GuideItem>
            <strong>Step 1: Start with Basics:</strong> Teach commands like "sit" or "stay" using
            positive reinforcement with treats or praise.
          </GuideItem>
          <GuideItem>
            <strong>Step 2: Be Consistent:</strong> Use the same cues and rewards daily to avoid
            confusion and build habits.
          </GuideItem>
          <GuideItem>
            <strong>Step 3: Socialize Early:</strong> Expose your pet to new environments, people, and
            pets to reduce anxiety and improve adaptability.
          </GuideItem>
          <GuideItem>
            <strong>Step 4: Patience is Key:</strong> Allow time for your pet to learn, and avoid
            punishment to maintain a positive experience.
          </GuideItem>
        </GuideList>
        <VideoWrapper>
          <iframe
            src="https://www.youtube.com/embed/BA03fJxB2aU"
            title="Pet Training Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      </Section>

      {/* First Aid Section */}
      <Section>
        <SectionTitle>Raising cows Basics</SectionTitle>
        <p>
          This video provides an essential guide to handling farm animals, teaching you how to
          perform basic first aid techniques at home. Learn how to recognize signs of distress,
          apply bandages, and stabilize your pet until you can reach a veterinarian.
        </p>
        <GuideList>
          <GuideItem>
            <strong>1. Recognize Distress:</strong> Look for symptoms like excessive panting, limping,
            or vomiting as signs of an emergency.
          </GuideItem>
          <GuideItem>
            <strong>2. Basic Bandaging:</strong> Learn to apply a clean cloth or bandage to minor
            wounds to stop bleeding.
          </GuideItem>
          <GuideItem>
            <strong>3. CPR Basics:</strong> Understand the steps for pet CPR in case of cardiac
            arrest (consult a professional first).
          </GuideItem>
          <GuideItem>
            <strong>4. Emergency Kit:</strong> Keep a pet first aid kit with gauze, antiseptic, and a
            contact list for vets.
          </GuideItem>
        </GuideList>
        <VideoWrapper>
          <iframe
            src="https://www.youtube.com/embed/sEXD7PxOMqk"
            title="Pet First Aid Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      </Section>

      {/* Grooming Section */}
      <Section>
        <SectionTitle>Rabbit Farming Tips</SectionTitle>
        <p>
        Learn essential tips for successful rabbit farming. This video covers breeding, housing, feeding,
        and health management to ensure your rabbits thrive.
        </p>
        <GuideList>
          <GuideItem>
          <strong>1. Breeding:</strong> Select healthy breeding pairs and monitor their reproductive cycles.
          </GuideItem>
          <GuideItem>
          <strong>2. Housing:</strong> Provide clean, spacious, and well-ventilated hutches for your rabbits.
          </GuideItem>
          <GuideItem>
          <strong>3. Feeding:</strong> Offer a balanced diet of hay, fresh vegetables, and pellets.
          </GuideItem>
          <GuideItem>
          <strong>4. Health Management:</strong> Regularly check for signs of illness and maintain proper hygiene.
          </GuideItem>
        </GuideList>
        <VideoWrapper>
          <iframe
            src="https://www.youtube.com/embed/3CNwxQ_BISU"
            title="Pet Grooming Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
      </Section>
    </Container>
  );
};

export default Lessons;