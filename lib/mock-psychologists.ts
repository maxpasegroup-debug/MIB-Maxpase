export interface PsychologistCard {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  profilePhoto: string | null;
  consultationFee: number;
  bio?: string;
  languages?: string;
  availability?: { date: string; slots: string[] }[];
}

export const MOCK_PSYCHOLOGISTS: PsychologistCard[] = [
  {
    id: "1",
    name: "Dr. Anjali Nair",
    specialization: "Clinical Psychologist",
    experienceYears: 10,
    rating: 4.8,
    profilePhoto: null,
    consultationFee: 800,
    bio: "Specializing in anxiety, stress, and relationship issues. CBT and mindfulness-based approaches.",
    languages: "English, Hindi, Malayalam",
    availability: [
      { date: "2025-03-15", slots: ["10:00", "11:00", "15:00"] },
      { date: "2025-03-16", slots: ["09:00", "14:00"] },
    ],
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialization: "Counselling Psychologist",
    experienceYears: 8,
    rating: 4.9,
    profilePhoto: null,
    consultationFee: 750,
    bio: "Expert in career counselling and youth mental health.",
    languages: "English, Hindi, Tamil",
    availability: [
      { date: "2025-03-15", slots: ["16:00", "17:00"] },
      { date: "2025-03-17", slots: ["10:00", "11:00", "12:00"] },
    ],
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialization: "Child & Adolescent Psychologist",
    experienceYears: 12,
    rating: 4.7,
    profilePhoto: null,
    consultationFee: 900,
    bio: "Focus on child behaviour, parenting, and school-related stress.",
    languages: "English, Hindi",
    availability: [
      { date: "2025-03-16", slots: ["10:00", "11:00"] },
      { date: "2025-03-18", slots: ["14:00", "15:00", "16:00"] },
    ],
  },
];
