import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

type Clinic = {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  services?: string[];
  timing: string;
  doctors: {
    name: string;
    specialty: string;
    availability: string;
  }[];
  mapLink: string;
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  text-align: center;
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

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  margin-left: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #ff6f61;
  }
`;

const ClinicList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ClinicCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ClinicName = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ClinicAddress = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ClinicPhone = styled.p`
  font-size: 1rem;
  color: #ff6f61;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ClinicTiming = styled.p`
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.5rem;
`;

const DoctorList = styled.div`
  margin-top: 1rem;
`;

const DoctorItem = styled.div`
  margin-bottom: 0.75rem;
`;

const DoctorName = styled.p`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const DoctorDetails = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const MapLink = styled.a`
  font-size: 1rem;
  color: #ff6f61;
  text-decoration: none;
  display: block;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const VetConsultation = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCity, setFilterCity] = useState<string>('');

  const sampleClinics: Clinic[] = [
    // Mumbai
    {
      id: "MUM-01",
      name: "Paw Prints Veterinary Clinic",
      address: "Building No. 24, Vaibhav Cooprative Housing Society, Shop No. 4, Building. 24, Ground Floor, Shastri Nagar Rd Number 1, Shastri Nagar, Goregaon West, Mumbai, Maharashtra 400104",
      phone: "07977326969",
      city: "Mumbai",
      services: ["Surgery", "Vaccinations", "Diagnostics"],
      timing: "11 AM - 7 PM",
      doctors: [
        { name: "Dr. Nilima Sakpal", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Sanjay Patil", specialty: "General Medicine", availability: "10 AM - 6 PM" },
        { name: "Dr. Priya Sharma", specialty: "Vaccinations", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/WaHhShQ8kfXxHjH1A"
    },
    {
      id: "MUM-02",
      name: "Blue 7 Vets",
      address: "1st floor, Avirahi Homes, 3, New Link Rd, B Wing, I C Colony, Borivali West, Mumbai, Maharashtra 400103",
      phone: "08356961917",
      city: "Mumbai",
      services: ["Emergency Care", "Dental Care"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Rahul Jain", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Sneha Patel", specialty: "Dental Care", availability: "9 AM - 5 PM" },
        { name: "Dr. Vikram Singh", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/6GsEpzcxzBnsJdah9" 
    },
    {
      id: "MUM-03",
      name: "Tata Trust Small Animal Hospital, Mumbai",
      address: "Gangaram Babu Sakpal Rd, Saat Rasta, Adarsh Nagar, Mahalakshmi, Mumbai, Maharashtra 400011",
      phone: "02231053105",
      city: "Mumbai",
      services: ["Surgery", "Imaging", "Emergency Care"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Aniruddha Bhalerao", specialty: "Surgery", availability: "24/7" },
        { name: "Dr. Meera Desai", specialty: "Imaging", availability: "9 AM - 5 PM" },
        { name: "Dr. Rohit Menon", specialty: "Emergency Care", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/NoeXZKdRtB83HpNv6" 
    },
    {
      id: "MUM-04",
      name: "PET OZONE CLINIC",
      address: "Shop no 3&4, Marble Arch, Apartments, Shastri Nagar Lane 1, opp. Dilly Dally, Shastri Nagar, Andheri West, Mumbai, Maharashtra 400053",
      phone: "09820445010",
      city: "Mumbai",
      services: ["Grooming", "Vaccinations"],
      timing: "10 AM - 6 PM",
      doctors: [
        { name: "Dr. Gautam Anand", specialty: "Grooming", availability: "10 AM - 5 PM" },
        { name: "Dr. Neha Kulkarni", specialty: "Vaccinations", availability: "11 AM - 6 PM" },
        { name: "Dr. Sameer Khan", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/fynGbSsoMxHjmSjP6" 
    },
    {
      id: "MUM-05",
      name: "Top Dog Pets Clinic",
      address: "shah industrial estate, Millenium Toyota, Plot No.23, Off Veera Desai Rd, Industrial Area, Andheri West, Mumbai, Maharashtra 400053",
      phone: "09820141899",
      city: "Mumbai",
      services: ["Dental Care", "Diagnostics"],
      timing: "9 AM - 7 PM",
      doctors: [
        { name: "Dr. Ashish Shah", specialty: "Dental Care", availability: "9 AM - 5 PM" },
        { name: "Dr. Pooja Verma", specialty: "Diagnostics", availability: "10 AM - 6 PM" },
        { name: "Dr. Karan Desai", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/5hupgs9aMkuJqiLm6" 
    },

    // Delhi
    {
      id: "DEL-01",
      name: "Friendicoes SECA",
      address: "No 271 & 273, Block M, Jungpura Extension, Defence Colony, New Delhi, Delhi 110024",
      phone: "01135712939",
      city: "Delhi",
      services: ["Surgery", "Shelter", "Vaccinations"],
      timing: "9:30 AM - 9 PM",
      doctors: [
        { name: "Dr. Rakesh Gupta", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Anjali Tiwari", specialty: "General Medicine", availability: "10 AM - 4 PM" },
        { name: "Dr. Vikrant Malhotra", specialty: "Vaccinations", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/1wbiRrwL4vs5aDxeA" 
    },
    {
      id: "DEL-02",
      name: "CGS Veterinary Hospital",
      address: "GF 3,4,5, DLF South Square Mall, Block G, Sarojini Nagar, New Delhi, Delhi 110023",
      phone: "09311014420",
      city: "Delhi",
      services: ["Emergency Care", "Diagnostics"],
      timing: "8 AM - 8 PM",
      doctors: [
        { name: "Dr. Pankaj Sharma", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Neeraj Kapoor", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Sonia Gupta", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/HwyCvjsCf1VBZssFA" 
    },
    {
      id: "DEL-03",
      name: "MaxPetZ Clinic, Rohini",
      address: "B, 10/10, Pocket 10, Sector 3, Rohini, Delhi, 110085",
      phone: "08860970949",
      city: "Delhi",
      services: ["Surgery", "Dental Care"],
      timing: "10 AM - 8 PM",
      doctors: [
        { name: "Dr. Ashok Kumar", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Ritu Jain", specialty: "Dental Care", availability: "10 AM - 6 PM" },
        { name: "Dr. Manish Arora", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/DDmPxjAGGjB7U42Z8" 
    },
    {
      id: "DEL-04",
      name: "Global Pet Clinic And Surgery Centre",
      address: "81 , Ground floor, Shree aggarsain, international hospital, road, near TATA Power DDL, Pocket 1, Sector 22, Rohini, Delhi, 110086",
      phone: "08765423825",
      city: "Delhi",
      services: ["Grooming", "Vaccinations"],
      timing: "10 AM - 8:30 PM",
      doctors: [
        { name: "Dr. Kavita Rao", specialty: "Grooming", availability: "10 AM - 5 PM" },
        { name: "Dr. Sanjay Yadav", specialty: "Vaccinations", availability: "11 AM - 6 PM" },
        { name: "Dr. Preeti Joshi", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/aBjEedbiphhi38Sn8" 
    },
    {
      id: "DEL-05",
      name: "Apollo Vets Healthcare",
      address: "477, DDA Flats, Pocket-1, Carmel Chowk, Sector-22, Dwarka, New Delhi, Delhi 110075",
      phone: "09990250011",
      city: "Delhi",
      services: ["Diagnostics", "Pet Boarding"],
      timing: "9 AM - 8 PM",
      doctors: [
        { name: "Dr. Deepak Verma", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Meera Singh", specialty: "General Medicine", availability: "10 AM - 6 PM" },
        { name: "Dr. Amit Sharma", specialty: "Pet Boarding", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/65pjyYvjsgkVQdDg7" 
    },

    // Bengaluru
    {
      id: "BLR-01",
      name: "Cessna Lifeline Veterinary Hospital",
      address: "No. 237, Ground floor, Dr CV Raman Road, RMV extension, Sadashiva Nagar, Bengaluru, Karnataka 560080",
      phone: "07676365365",
      city: "Bengaluru",
      services: ["Surgery", "Diagnostics", "Emergency Care"],
      timing: "9 AM - 7 PM",
      doctors: [
        { name: "Dr. Vinay R.", specialty: "Surgery", availability: "24/7" },
        { name: "Dr. Lakshmi S.", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Anil Kumar", specialty: "Emergency Care", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/ssVbjtzz5a7R3LAm7" 
    },
    {
      id: "BLR-02",
      name: "Pet Stepin’ Veterinary Clinic",
      address: "38, HAL Old Airport Rd, behind Manipal Hospital, Rustam Bagh Layout, Bengaluru, Karnataka 560017",
      phone: "09742279644",
      city: "Bengaluru",
      services: ["Grooming", "Vaccinations"],
      timing: "12 PM - 5 PM",
      doctors: [
        { name: "Dr. Priya Nair", specialty: "Grooming", availability: "10 AM - 5 PM" },
        { name: "Dr. Kartik Sharma", specialty: "Vaccinations", availability: "11 AM - 6 PM" },
        { name: "Dr. Nisha Rao", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/ybbKcDfFKTiMRx2w5" 
    },
    {
      id: "BLR-03",
      name: "Vetic Pet Clinic",
      address: "100 Feet Rd, near Domlur, Krishna Reddy Layout, Amarjyoti Layout, Domlur, Bengaluru, Karnataka 560071",
      phone: "09205187100",
      city: "Bengaluru",
      services: ["Dental Care", "Diagnostics"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Sanjay Hegde", specialty: "Dental Care", availability: "9 AM - 5 PM" },
        { name: "Dr. Anusha Shetty", specialty: "Diagnostics", availability: "10 AM - 6 PM" },
        { name: "Dr. Rohan Pillai", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/CFHRyB4CzS1wQrKx8" 
    },
    {
      id: "BLR-04",
      name: "Veterinary Hospital",
      address: "Bellary Rd, opposite to CBI, Sanjayanagara, Bengaluru, Karnataka 560024",
      phone: "08482245241",
      city: "Bengaluru",
      services: ["Surgery", "Vaccinations"],
      timing: "9 AM - 12 PM",
      doctors: [
        { name: "Dr. Ramesh Gowda", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Kavya Reddy", specialty: "Vaccinations", availability: "10 AM - 4 PM" },
        { name: "Dr. Manoj Kumar", specialty: "General Medicine", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/4VG2mCpDLExuujb86" 
    },
    {
      id: "BLR-05",
      name: "Pawsome Veterinary Care",
      address: "69/3, Railway Parallel Rd, Gnanabharathi, Stage II, Kengeri Satellite Town, Bengaluru, Karnataka 560060",
      phone: "09148984874",
      city: "Bengaluru",
      services: ["Emergency Care", "Pet Boarding"],
      timing: "5 PM - 9 PM",
      doctors: [
        { name: "Dr. Vikram Reddy", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Tara Gowda", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Shalini Hegde", specialty: "Pet Boarding", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/WLhcqLN4B98Tsh3c9" 
    },

    // Chennai
    {
      id: "CHE-01",
      name: "Madras Veterinary hospital",
      address: "34, Vepery High Rd, Periamet, Vepery, Choolai, Chennai, Tamil Nadu 600007",
      phone: "04425665566",
      city: "Chennai",
      services: ["Surgery", "Vaccinations"],
      timing: "10:30 AM - 12 AM",
      doctors: [
        { name: "Dr. Suresh Kumar", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Lakshmi Priya", specialty: "Vaccinations", availability: "10 AM - 4 PM" },
        { name: "Dr. Ravi Shankar", specialty: "General Medicine", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/qDp5xLfZipXj5VYv9" 
    },
    {
      id: "CHE-02",
      name: "Blue Cross of India",
      address: "72, Velachery Rd, Guindy, Chennai, Tamil Nadu 600032",
      phone: "04446274999",
      city: "Chennai",
      services: ["Emergency Care", "Shelter"],
      timing: "9 AM - 5 PM",
      doctors: [
        { name: "Dr. Karthik Raj", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Priya Nair", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Vinod Kumar", specialty: "Shelter Care", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/m4CMcDAkGRWBRo2k8" 
    },
    {
      id: "CHE-03",
      name: "VIJAY PETZONE",
      address: "16,TTK ROAD, 1st Cross St, Alwarpet, Chennai, Tamil Nadu 600018",
      phone: "04424332055",
      city: "Chennai",
      services: ["Dental Care", "Grooming"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Nisha Reddy", specialty: "Dental Care", availability: "10 AM - 5 PM" },
        { name: "Dr. Rohan Menon", specialty: "Grooming", availability: "11 AM - 6 PM" },
        { name: "Dr. Tara Kumar", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/MB39kKxzjFscY6AF8" 
    },
    {
      id: "CHE-04",
      name: "Vetic Pet Clinic Banjara Hills",
      address: "1st & 2nd Floor, 8-2, 603/B/34/23, Road No. 10, near Banjara Hills, Singada Kunta, Hyderabad, Telangana 500034",
      phone: "09205847400",
      city: "Chennai",
      services: ["Diagnostics", "Surgery"],
      timing: "9:30 AM - 8 PM",
      doctors: [
        { name: "Dr. Vikram Rao", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Anjali Menon", specialty: "Surgery", availability: "10 AM - 6 PM" },
        { name: "Dr. Sanjay Iyer", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/fUmi9sb45YhC9Aor5" 
    },
    {
      id: "CHE-05",
      name: "Paws and claws pet clinic - ECR",
      address: "Thomas Research, 2/164, SH 49, Cholamandal Artists Village, Injambakkam, Chennai, Tamil Nadu 600115",
      phone: "09600026684",
      city: "Chennai",
      services: ["Emergency Care", "Pet Boarding"],
      timing: "10 AM - 6 PM",
      doctors: [
        { name: "Dr. Aravind Kumar", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Shalini Raj", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Manoj Pillai", specialty: "Pet Boarding", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/qsB2AAKL9zP8SYBD8" 
    },

    // Kolkata
    {
      id: "KOL-01",
      name: "Kolkata Veterinary Clinic & Diagnostic Centre Newgaria",
      address: "H-10, Biswas Apartment,Chanda caterer Lane Near Sukanta Mancha,C-70 Srinagar main road, Police Station Road, New Garia, Pancha Sayar, Kolkata, West Bengal 700094",
      phone: "08902565256",
      city: "Kolkata",
      services: ["Surgery", "Vaccinations"],
      timing: "9 AM - 8 PM",
      doctors: [
        { name: "Dr. Amit Bose", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Rina Das", specialty: "Vaccinations", availability: "10 AM - 6 PM" },
        { name: "Dr. Sanjay Roy", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/oC4nVYqQCKUKEAyV6" 
    },
    {
      id: "KOL-02",
      name: "Paws Avenue - Pet Care Clinic",
      address: "2/3, Judges Court Rd, Alipore, Kolkata, West Bengal 700027",
      phone: "+91 33 2356 1234",
      city: "Kolkata",
      services: ["Grooming", "Diagnostics"],
      timing: "10 AM - 10 PM",
      doctors: [
        { name: "Dr. Neha Banerjee", specialty: "Grooming", availability: "10 AM - 5 PM" },
        { name: "Dr. Arjun Das", specialty: "Diagnostics", availability: "11 AM - 6 PM" },
        { name: "Dr. Shalini Roy", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/jfhLa2R5rmfaPUVs9"
    },
    {
      id: "KOL-03",
      name: "WB State Veterinary Hospital Kolkata",
      address: "G848+6V4, Naskarpur, Behala, Kolkata, West Bengal 700034",
      phone: "+91 33 2556 7890",
      city: "Kolkata",
      services: ["Surgery", "Vaccinations"],
      timing: "9 AM - 3:30 PM",
      doctors: [
        { name: "Dr. Sameer Mitra", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Anjali Bose", specialty: "Vaccinations", availability: "10 AM - 4 PM" },
        { name: "Dr. Vikrant Roy", specialty: "General Medicine", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/xTVEEUVGMfRcgLc7A" 
    },
    {
      id: "KOL-04",
      name: "PAWSITIVE WELLNESS",
      address: "Cooperative Colony, Santoshpur Co-operative Society, Kata Potti, Santoshpur, Kolkata, Maheshtala, West Bengal 700066",
      phone: "08910222697",
      city: "Kolkata",
      services: ["Emergency Care", "Pet Boarding"],
      timing: "11 AM - 6 PM",
      doctors: [
        { name: "Dr. Sanjay Sen", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Ritu Banerjee", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Arjun Roy", specialty: "Pet Boarding", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/77GAQ6C33GkcgxG77" 
    },
    {
      id: "KOL-05",
      name: "Vetassure Pet Clinic",
      address: "BF-13, Street No. - 165, near Biswa Bangla, Action Area 1B, Gate, Newtown, New Town, West Bengal 700156",
      phone: "07448744860",
      city: "Kolkata",
      services: ["Dental Care", "Diagnostics"],
      timing: "11 AM - 8 PM",
      doctors: [
        { name: "Dr. Tara Roy", specialty: "Dental Care", availability: "10 AM - 5 PM" },
        { name: "Dr. Rohan Mitra", specialty: "Diagnostics", availability: "11 AM - 6 PM" },
        { name: "Dr. Shalini Bose", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/zeNqPz3hACjU3jWa7" 
    },

    // Hyderabad
    {
      id: "HYD-01",
      name: "Vetic Pet Clinic HITEC City",
      address: "Plot# 19, Rohini Layout Rd, opp. Cyber Towers, near HITEC City, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081",
      phone: "09821008260",
      city: "Hyderabad",
      services: ["Surgery", "Diagnostics"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Anil Reddy", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Priya Rao", specialty: "Diagnostics", availability: "10 AM - 6 PM" },
        { name: "Dr. Vikram Naidu", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/fNAm9oh9P6yibRwV7" 
    },
    {
      id: "HYD-02",
      name: "VETCARE Pet Hospital",
      address: "H.no.8, 1-284/OU/4B, Manikonda Rd, opp. Pochamma Temple, OU Colony, Shaikpet, Hyderabad, Pokalwada, Telangana 500089",
      phone: "09000333869",
      city: "Hyderabad",
      services: ["Emergency Care", "Grooming"],
      timing: "9:30 AM - 8:30 PM",
      doctors: [
        { name: "Dr. Sanjay Naidu", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Ritu Reddy", specialty: "Grooming", availability: "9 AM - 5 PM" },
        { name: "Dr. Arjun Rao", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/atAxxqsY5Y3R4pE37" 
    },
    {
      id: "HYD-03",
      name: "Govt. Super Speciality Veterinary Hospital",
      address: "Vittalwadi Ln, beside 33KV Electric Substation, Hari Vihar Colony, Bhawani Nagar, Narayanguda, Hyderabad, Telangana 500029",
      phone: "+91 40 2331 5678",
      city: "Hyderabad",
      services: ["Surgery", "Vaccinations"],
      timing: "9 AM - 1 PM",
      doctors: [
        { name: "Dr. Tara Naidu", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Rohan Reddy", specialty: "Vaccinations", availability: "10 AM - 4 PM" },
        { name: "Dr. Shalini Rao", specialty: "General Medicine", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/iMFfiyoHyZsKSMKp6" 
    },
    {
      id: "HYD-04",
      name: "PAWS & HUGS ANIMAL CARE CLINIC",
      address: "Ground floor, New Municipal office line, ECIL, beside Sree Enclave, Kamalanagar, Hyderabad, Telangana 500062",
      phone: "08012912921",
      city: "Hyderabad",
      services: ["Dental Care", "Pet Boarding"],
      timing: "10 AM - 10 PM",
      doctors: [
        { name: "Dr. Vikram Sharma", specialty: "Dental Care", availability: "10 AM - 5 PM" },
        { name: "Dr. Anjali Reddy", specialty: "General Medicine", availability: "11 AM - 6 PM" },
        { name: "Dr. Sanjay Rao", specialty: "Pet Boarding", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/aLMaxtfGNokfecyG6" 
    },
    {
      id: "HYD-05",
      name: "City Vet Animal Hospital",
      address: "Ground floor, besides pizza hut, Beeramguda Main Rd, Ameenpur, Hyderabad, Telangana 502032",
      phone: "09573622893",
      city: "Hyderabad",
      services: ["Emergency Care", "Diagnostics"],
      timing: "8:30 AM - 10:30 PM",
      doctors: [
        { name: "Dr. Arjun Naidu", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Shalini Reddy", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Manoj Rao", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/gEGTURAWVpzhfJZ86" 
    },

    // Pune
    {
      id: "PUN-01",
      name: "Small Paws Veterinary Clinic",
      address: "Krushna Park, below Allen Solly, Yashwant Nagar, Kharadi, Pune, Maharashtra 411014",
      phone: "08080141806",
      city: "Pune",
      services: ["Surgery", "Vaccinations"],
      timing: "10 AM - 1:30 PM & 5:30 PM - 8 PM",
      doctors: [
        { name: "Dr. Anil Deshmukh", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Priya Kulkarni", specialty: "Vaccinations", availability: "10 AM - 6 PM" },
        { name: "Dr. Vikram Patil", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/4G1MwDXt1wqTiuGV6" 
    },
    {
      id: "PUN-02",
      name: "Vet Care Pet Clinic",
      address: "Shop No 7, Herekar Park, Opposite Kamla Nehru Park, Deccan Gymkhana, Pune, Maharashtra 411004",
      phone: "02025679175",
      city: "Pune",
      services: ["Emergency Care", "Diagnostics"],
      timing: "10 AM - 1 PM & 6 PM - 8 PM",
      doctors: [
        { name: "Dr. Sanjay Pawar", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Ritu Sharma", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Arjun Kulkarni", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/rSZty6d6NSaqjcwy9" 
    },
    {
      id: "PUN-03",
      name: "Government Veterinary Hospital",
      address: "Pune, 411007, Pune University, Aundh, Pune, Maharashtra 411007",
      phone: "+91 20 2589 7890",
      city: "Pune",
      services: ["Dental Care", "Grooming"],
      timing: "9 AM - 4 PM",
      doctors: [
        { name: "Dr. Sameer More", specialty: "Dental Care", availability: "10 AM - 5 PM" },
        { name: "Dr. Tara Deshmukh", specialty: "Grooming", availability: "11 AM - 6 PM" },
        { name: "Dr. Rohan Patil", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/6rT6szFzwtor9s1H7" 
    },
    {
      id: "PUN-04",
      name: "Vetic Pet Clinic Aundh",
      address: "No. 1 & 2, Surmani Society, DP Rd, near Aundh, opp. DAV, Harmony Society, Ward No. 8, Wireless Colony, Aundh, Pune, Maharashtra 411007",
      phone: "09205863500",
      city: "Pune",
      services: ["Surgery", "Pet Boarding"],
      timing: "9:30 AM - 8 PM",
      doctors: [
        { name: "Dr. Priya Joshi", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Vikram More", specialty: "General Medicine", availability: "10 AM - 6 PM" },
        { name: "Dr. Niti Deshmukh", specialty: "Pet Boarding", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/qSXq26hqgoCUKC3z9" 
    },
    {
      id: "PUN-05",
      name: "Healthy Paws",
      address: "Dasra Chowk, Bajirao Shreepati Mark, beside Ashwini Hospital, Balewadi Gaon, Balewadi, Pune, Maharashtra 411045",
      phone: "+91 20 2663 5678",
      city: "Pune",
      services: ["Emergency Care", "Diagnostics"],
      timing: "10:30 AM - 2 PM & 6:30 PM - 8 PM",
      doctors: [
        { name: "Dr. Arjun Sharma", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Shalini More", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Rohan Deshmukh", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/143peP2GXsaLbMsh9" 
    },

    // Ahmedabad
    {
      id: "AHM-01",
      name: "Caring Paws Vet Clinic & Surgical Centre",
      address: "Shop No. 3, Antrix Complex, Panjarapole Cross Rd, Panjara Pol, Ambawadi, Ahmedabad, Gujarat 380015",
      phone: "09737887900",
      city: "Ahmedabad",
      services: ["Surgery", "Vaccinations"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Sanjay Patel", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Priya Shah", specialty: "Vaccinations", availability: "10 AM - 6 PM" },
        { name: "Dr. Vikram Desai", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/pzS6uJyqWkAGi1s68" 
    },
    {
      id: "AHM-02",
      name: "BestBuds Pet Hospital",
      address: "under the bridge, Kailash Mansarovar Flats, 1, New Sharda Mandir Rd, Paldi, Ahmedabad, Gujarat 380007",
      phone: "06351699775",
      city: "Ahmedabad",
      services: ["Emergency Care", "Diagnostics"],
      timing: "10 AM - 7 PM",
      doctors: [
        { name: "Dr. Anil Shah", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Neha Patel", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Sameer Desai", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/ZXgyQTtdsjz3v9QY9" 
    },
    {
      id: "AHM-03",
      name: "Paws Universe",
      address: "House D & G, COLONNADE-2, Rajpath Rangoli Rd, Bodakdev, Ahmedabad, Gujarat 380054",
      phone: "+91 79 2789 1234",
      city: "Ahmedabad",
      services: ["Dental Care", "Grooming"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Rohan Desai", specialty: "Dental Care", availability: "10 AM - 5 PM" },
        { name: "Dr. Shalini Shah", specialty: "Grooming", availability: "11 AM - 6 PM" },
        { name: "Dr. Sanjay Patel", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/K5znJeJu7U18MX2A6" 
    },
    {
      id: "AHM-04",
      name: "GOVERNMENT VETERINARY HOSPITAL PREMDARWAJA",
      address: "Old City, Dariyapur, Ahmedabad, Gujarat 380001",
      phone: "+91 79 2546 7890",
      city: "Ahmedabad",
      services: ["Surgery", "Vaccinations"],
      timing: "9 AM - 12 PM",
      doctors: [
        { name: "Dr. Vikrant Patel", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Shalini Desai", specialty: "Vaccinations", availability: "10 AM - 4 PM" },
        { name: "Dr. Sanjay Shah", specialty: "General Medicine", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/zx8AwWwVdCGHde6N7" 
    },
    {
      id: "AHM-05",
      name: "Petmate Veterinary Hospital",
      address: "ShopNo.111, Dev Parijat, Near, Vaishnodevi Cir, behind Gorbandh Restaurant, Ahmedabad, Khodiyar, Gujarat 382421",
      phone: "07621094609",
      city: "Ahmedabad",
      services: ["Emergency Care", "Pet Boarding"],
      timing: "8 AM - 8:30 PM",
      doctors: [
        { name: "Dr. Neha Shah", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Anil Patel", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Sameer Mehta", specialty: "Pet Boarding", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/mUqZeWJAv3rccvXj8" 
    },

    // Jaipur
    {
      id: "JAI-01",
      name: "Jaipur pet clinic",
      address: "194/213, Sector 19, Pratap Nagar, Jaipur, Rajasthan 302033",
      phone: "08875771921",
      city: "Jaipur",
      services                           
      : ["Surgery", "Vaccinations"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Sanjay Sharma", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Priya Singh", specialty: "Vaccinations", availability: "10 AM - 6 PM" },
        { name: "Dr. Vikram Rathore", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/pNsFwxzbJz1xUmpg8" 
    },
    {
      id: "JAI-02",
      name: "PET CARE CLINIC",
      address: "Shop no b1-2 Devanda plaza Maharana Pratap marg, Shiv Mandir Rd, near RANGOLI GARDENS, Jaipur, Rajasthan 302034",
      phone: "08387888696",
      city: "Jaipur",
      services: ["Emergency Care", "Diagnostics"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Anil Rathore", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Neha Sharma", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Sameer Singh", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/CTZFS1SqYvojkA1RA" 
    },
    {
      id: "JAI-03",
      name: "Government Veterinary Polyclinic Hospital",
      address: "5, Jayanti Market, Pink City, MI Road, Gopinath Marg, Jaipur, Rajasthan 302001",
      phone: "01412373237",
      city: "Jaipur",
      services: ["Surgery", "Vaccinations"],
      timing: "9 AM - 9 PM",
      doctors: [
        { name: "Dr. Vikram Singh", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Priya Rathore", specialty: "Vaccinations", availability: "10 AM - 4 PM" },
        { name: "Dr. Sameer Sharma", specialty: "General Medicine", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/rCLBBAGJGBCRRSjf7" 
    },
    {
      id: "JAI-04",
      name: "City pet clinic Jaipur",
      address: "Kings Rd, Rail Nagar, Shiv Shakti Nagar, Brijlalpura, Jaipur, Rajasthan 302019",
      phone: "08952922797",
      city: "Jaipur",
      services: ["Dental Care", "Grooming"],
      timing: "8 AM - 11 PM",
      doctors: [
        { name: "Dr. Rohan Sharma", specialty: "Dental Care", availability: "10 AM - 5 PM" },
        { name: "Dr. Shalini Singh", specialty: "Grooming", availability: "11 AM - 6 PM" },
        { name: "Dr. Sanjay Rathore", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/JH3rTVWc8JC4XffA6" 
    },
    {
      id: "JAI-05",
      name: "DCC Animal Hospital Jaipur",
      address: "BASEMENT, IDB, FS-6, GAYATRI NAGAR, Maharani Farm, Durgapura, Jaipur, Rajasthan 302018",
      phone: "09311560101",
      city: "Jaipur",
      services: ["Emergency Care", "Pet Boarding"],
      timing: "10 AM - 7 PM",
      doctors: [
        { name: "Dr. Neha Rathore", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Sanjay Singh", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Rohan Jain", specialty: "Pet Boarding", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/2nQZKMY9JDqq4uWa9" 
    },

    // Chandigarh
    {
      id: "CHD-01",
      name: "Pet Care Clinic",
      address: "Hallo Majra Main Market Rd, Baba Samada Wala, Hallo Majra, Chandigarh, 160002",
      phone: "+91 172 270 1234",
      city: "Chandigarh",
      services: ["Surgery", "Vaccinations"],
      timing: "24/7",
      doctors: [
        { name: "Dr. Anil Sharma", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Priya Singh", specialty: "Vaccinations", availability: "10 AM - 6 PM" },
        { name: "Dr. Vikram Gupta", specialty: "General Medicine", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/9ciNpcDRecZLxr8J9" 
    },
    {
      id: "CHD-02",
      name: "Tricity Veterinary Hospital",
      address: "H.B. NO 375, Kochar Farms, Shastri Nagar Rajiv Gandhi Technology Park, Chandigarh 160101",
      phone: "09855501155",
      city: "Chandigarh",
      services: ["Emergency Care", "Diagnostics"],
      timing: "9 AM - 8 PM",
      doctors: [
        { name: "Dr. Sanjay Gupta", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Neha Kaur", specialty: "Diagnostics", availability: "9 AM - 5 PM" },
        { name: "Dr. Sameer Sharma", specialty: "General Medicine", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/2ubYverJTe25W692A" 
    },
    {
      id: "CHD-03",
      name: "Government Pet Hospital",
      address: "Shastri Market Rd, Sector 22D, Sector 22, Chandigarh, 160022",
      phone: "+91 172 2690 7890",
      city: "Chandigarh",
      services: ["Surgery", "Vaccinations"],
      timing: "9 AM - 2 PM",
      doctors: [
        { name: "Dr. Rohan Kaur", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Shalini Gupta", specialty: "Vaccinations", availability: "10 AM - 4 PM" },
        { name: "Dr. Sanjay Singh", specialty: "General Medicine", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/pLMuZMBuuzgUoqHh9" 
    },
    {
      id: "CHD-04",
      name: "Pawsitive Steps Pet Care",
      address: "1374, 4, near Infant Jesus School, Phase 11, Sector 65, Sahibzada Ajit Singh Nagar, Punjab 160062",
      phone: "08725996416",
      city: "Chandigarh",
      services: ["Dental Care", "Grooming"],
      timing: "11 AM - 1 PM & 5 PM - 9 PM",
      doctors: [
        { name: "Dr. Shalini Singh", specialty: "Dental Care", availability: "10 AM - 5 PM" },
        { name: "Dr. Rohan Gupta", specialty: "Grooming", availability: "11 AM - 6 PM" },
        { name: "Dr. Anil Kaur", specialty: "General Medicine", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/ovcLGRYnAPYvH68f6"
    },
    {
      id: "CHD-05",
      name: "Petvet24 Veterinary Clinic",
      address: "SCO - 140, back side entry, in front of Police Station, Sector 24D, Sector 24, Chandigarh, 160024",
      phone: "07083865773",
      city: "Chandigarh",
      services: ["Emergency Care", "Pet Boarding"],
      timing: "9 AM - 9 PM",
      doctors: [
        { name: "Dr. Vikram Kaur", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Neha Singh", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Sameer Gupta", specialty: "Pet Boarding", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/UwfSDGZvkX8cWKy56" 
    },

    // Belgaum
    {
      id: "BEL-01",
      name: "Paws Care and Heal Pet Clinic",
      address: "Ganapati Temple, double road, near Hindalga, beside shambavi clinic, Hanuman Nagar, Belagavi, Hindalga, Karnataka 591108",
      phone: "09483852691",
      city: "Belgaum",
      services: ["Surgery", "Vaccinations", "Diagnostics"],
      timing: "10:30 AM - 2 PM & 5.30 PM - 9 PM",
      doctors: [
        { name: "Dr. Vishwanath Banti", specialty: "Surgery", availability: "9 AM - 5 PM" },
        { name: "Dr. Anil Kulkarni", specialty: "General Medicine", availability: "10 AM - 6 PM" },
        { name: "Dr. Shashidhar Patil", specialty: "Vaccinations", availability: "11 AM - 7 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/BkcPMpchrhQuEL3J9" 
    },
    {
      id: "BEL-02",
      name: "Niranjan Pet Clinic",
      address: "591108, Jay Nagar, Hanuman Nagar, Hindalga, Karnataka 591108",
      phone: "09448116671",
      city: "Belgaum",
      services: ["Emergency Care", "Pet Boarding", "General Medicine"],
      timing: "6 PM - 9 PM",
      doctors: [
        { name: "Dr. Niranjan Patil", specialty: "Emergency Care", availability: "24/7" },
        { name: "Dr. Praveen Desai", specialty: "General Medicine", availability: "9 AM - 5 PM" },
        { name: "Dr. Mahesh Kulkarni", specialty: "Pet Boarding", availability: "10 AM - 6 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/DF1XBL4mcuDb3qqA9" 
    },
    {
      id: "BEL-03",
      name: "Pets Paradise Veterinary Clinic",
      address: "4, Emerald corner, Chatrapati Sambhaji Rd, Ashraywadi, Shivaji Colony, Tilakwadi, Belagavi, Karnataka 590006",
      phone: "09900224852",
      city: "Belgaum",
      services: ["Grooming", "Dental Care", "Nutrition"],
      timing: "9 AM - 2 PM & 5 PM - 9 PM",
      doctors: [
        { name: "Dr. Santosh Kulkarni", specialty: "Grooming", availability: "10 AM - 5 PM" },
        { name: "Dr. Deepak G. Yaligar", specialty: "Dental Care", availability: "11 AM - 6 PM" },
        { name: "Dr. Vinayak Joshi", specialty: "Nutrition", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/cX8bhm88H7Kyx8pH7" 
    },
    {
      id: "BEL-04",
      name: "Pet / Veterinary Clinic",
      address: "VG46+WM3, Eagle heights complex, Maruthi Galli, Belagavi, Karnataka 590001",
      phone: "09483834999",
      city: "Belgaum",
      services: ["Surgery", "Vaccinations", "Diagnostics"],
      timing: "9 AM - 5 PM",
      doctors: [
        { name: "Dr. A. B. Shetti", specialty: "Vaccinations", availability: "9 AM - 5 PM" },
        { name: "Dr. Rajendra Patil", specialty: "Surgery", availability: "10 AM - 4 PM" },
        { name: "Dr. Suresh Naik", specialty: "Diagnostics", availability: "11 AM - 5 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/qGyqsmNU6hmjHKVT9" 
    },
    {
      id: "BEL-05",
      name: "V care speciality Pet hospital Belagavi (Veterinary Hospital )",
      address: "Roy Rd, behind Lele Ground, Shivaji Colony, Tilakwadi, Belagavi, Karnataka 591306",
      phone: "08088906090",
      city: "Belgaum",
      services: ["General Medicine", "Diagnostics", "Pet Care"],
      timing: "8 AM - 11 PM",
      doctors: [
        { name: "Dr. Santosh B. Patil", specialty: "General Medicine", availability: "10 AM - 5 PM" },
        { name: "Dr. Prakash Kulkarni", specialty: "Diagnostics", availability: "11 AM - 6 PM" },
        { name: "Dr. Nitin Desai", specialty: "Pet Care", availability: "10 AM - 4 PM" },
      ],
      mapLink: "https://maps.app.goo.gl/8VhCPUujPB6e4yXD7" 
    },
];

  useEffect(() => {
    const filteredClinics = sampleClinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCity ? clinic.city.toLowerCase() === filterCity.toLowerCase() : true)
    );
    setClinics(filteredClinics);
  }, [searchQuery, filterCity]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCity(e.target.value);
  };

  const cities = Array.from(new Set(sampleClinics.map((clinic) => clinic.city)));

  return (
    <Container>
      <Title>Veterinary Consultation</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search for vet clinics..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FilterSelect onChange={handleCityFilterChange}>
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </FilterSelect>
      </SearchContainer>
      <ClinicList>
        {clinics.map((clinic) => (
          <ClinicCard key={clinic.id}>
            <ClinicName>{clinic.name}</ClinicName>
            <ClinicAddress>{clinic.address}</ClinicAddress>
            <ClinicPhone>{clinic.phone}</ClinicPhone>
            <ClinicTiming>Timing: {clinic.timing}</ClinicTiming>
            <DoctorList>
              {clinic.doctors.map((doctor, index) => (
                <DoctorItem key={index}>
                  <DoctorName>{doctor.name}</DoctorName>
                  <DoctorDetails>
                    Specialty: {doctor.specialty} | Available: {doctor.availability}
                  </DoctorDetails>
                </DoctorItem>
              ))}
            </DoctorList>
            <MapLink href={clinic.mapLink} target="_blank" rel="noopener noreferrer">
              View on Google Maps
            </MapLink>
          </ClinicCard>
        ))}
      </ClinicList>
    </Container>
  );
};

export default VetConsultation;