import React, { useState } from "react";
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
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  display: inline-block;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  display: inline-block;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #ff6f61;
  }
`;

const SearchButton = styled.a`
  padding: 0.75rem 1.5rem;
  background: #ff6f61;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #e65b50;
  }
`;

const CategorySection = styled.div`
  margin: 3rem 0;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CategoryTitle = styled.h2`
  color: #ff6f61;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ff6f61;
  display: inline-block;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: left;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductTitle = styled.h3`
  color: #333;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ProductUse = styled.p`
  color: #ff6f61;
  font-size: 0.95rem;
  font-style: italic;
`;

const PurchaseLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ff6f61;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: background 0.3s ease;

  &:hover {
    background: #e65b50;
  }
`;

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Food & Nutrition",
      products: [
        {
          name: "High-Protein Dry Dog Food",
          description: "A balanced diet with 30% protein, designed for adult dogs.",
          use: "Supports muscle growth and energy for active dogs.",
          link: "https://amzn.in/d/7NpkIBb",
        },
        {
          name: "Grain-Free Cat Food",
          description: "Made with natural ingredients, ideal for cats with allergies.",
          use: "Improves digestion and reduces allergic reactions.",
          link: "https://amzn.in/d/gZZ0kkR",
        },
        {
          name: "Puppy Milk Replacer",
          description: "A formula enriched with DHA for brain development.",
          use: "Essential for orphaned or nursing puppies under 6 weeks.",
          link: "https://amzn.in/d/4Jkl03T",
        },
      ],
    },
    {
      title: "Grooming Essentials",
      products: [
        {
          name: "Deshedding Brush",
          description: "A stainless steel brush that removes loose fur.",
          use: "Reduces shedding and keeps your pet’s coat healthy.",
          link: "https://amzn.in/d/5oNIcSq",
        },
        {
          name: "Pet Shampoo (Oatmeal-Based)",
          description: "A gentle shampoo with oatmeal to soothe itchy skin.",
          use: "Relieves dryness and irritation, ideal for sensitive pets.",
          link: "https://amzn.in/d/9YdeFkE",
        },
        {
          name: "Nail Clippers with Safety Guard",
          description: "Ergonomic clippers to trim pet nails safely.",
          use: "Prevents over-cutting and keeps nails at a healthy length.",
          link: "https://amzn.in/d/2UrRbob",
        },
      ],
    },
    {
      title: "Health & Wellness",
      products: [
        {
          name: "Flea and Tick Collar",
          description: "A 6-month protection collar against fleas and ticks.",
          use: "Protects pets from parasites and prevents infestations.",
          link: "https://amzn.in/d/8LXxpSU",
        },
        {
          name: "Probiotic Supplement",
          description: "Chewable tablets to support gut health.",
          use: "Improves digestion and boosts immunity in pets.",
          link: "https://amzn.in/d/avUgH2u",
        },
        {
          name: "Dental Chews",
          description: "Treats that reduce plaque and freshen breath.",
          use: "Promotes oral hygiene and prevents dental diseases.",
          link: "https://amzn.in/d/chO8kQd",
        },
      ],
    },
    {
      title: "Toys & Enrichment",
      products: [
        {
          name: "Rubber Chew Toy",
          description: "A durable toy for aggressive chewers.",
          use: "Satisfies chewing instincts and prevents destructive behavior.",
          link: "https://amzn.in/d/7VSWxGR",
        },
        {
          name: "Interactive Puzzle Feeder",
          description: "A toy that dispenses treats as pets solve puzzles.",
          use: "Stimulates mental activity and reduces boredom.",
          link: "https://amzn.in/d/4wGmuqt",
        },
        {
          name: "Feather Wand for Cats",
          description: "A wand with colorful feathers to engage cats.",
          use: "Encourages exercise and fulfills hunting instincts.",
          link: "https://amzn.in/d/d0fEJDb",
        },
      ],
    },
    {
      title: "Training & Behavior",
      products: [
        {
          name: "Clicker Training Kit",
          description: "A clicker and guidebook for positive reinforcement.",
          use: "Helps train pets with consistent commands and rewards.",
          link: "https://amzn.in/d/4qWI5Qe",
        },
        {
          name: "Anti-Bark Collar",
          description: "A humane collar with sound/vibration feedback.",
          use: "Reduces excessive barking without causing distress.",
          link: "https://amzn.in/d/c99yhbr",
        },
        {
          name: "Puppy Training Pads",
          description: "Absorbent pads for house training.",
          use: "Teaches puppies where to relieve themselves indoors.",
          link: "https://amzn.in/d/fhGUdN5",
        },
      ],
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query
  const filteredCategories = categories.map((category) => ({
    ...category,
    products: category.products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.use.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.products.length > 0);

  // Amazon search URL
  const amazonSearchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;

  return (
    <Container>
      <Title>Pet Shop</Title>
      <Subtitle>
        Discover essential products and services for your pets. Learn what each item is used for to keep your furry friends happy and healthy!
      </Subtitle>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search for pet products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchButton href={amazonSearchUrl} target="_blank" rel="noopener noreferrer">
          Search on Amazon
        </SearchButton>
      </SearchContainer>

      {filteredCategories.length > 0 ? (
        filteredCategories.map((category, index) => (
          <CategorySection key={index}>
            <CategoryTitle>{category.title}</CategoryTitle>
            <ProductGrid>
              {category.products.map((product, idx) => (
                <ProductCard key={idx}>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductUse>Use: {product.use}</ProductUse>
                  <PurchaseLink href={product.link} target="_blank" rel="noopener noreferrer">
                    Buy on Amazon
                  </PurchaseLink>
                </ProductCard>
              ))}
            </ProductGrid>
          </CategorySection>
        ))
      ) : (
        <CategorySection>
          <CategoryTitle>No Products Found</CategoryTitle>
          <p>Try adjusting your search query or check Amazon for more options.</p>
        </CategorySection>
      )}
    </Container>
  );
};

export default Shop;