/**
 * Question bank seed: result-oriented, behavioral questions.
 * Tagging: category, sub_area, trait_measured, age_group, test_type (rapid/deep).
 * 4-scale: Never=1, Sometimes=2, Often=3, Always=4.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AGE_GROUPS = ["AGE_6_12", "AGE_13_18", "AGE_18_25", "AGE_25_40", "AGE_40_60", "AGE_60_PLUS"] as const;
type AgeGroup = (typeof AGE_GROUPS)[number];

const STANDARD_ANSWERS = [
  { answerText: "Never", scoreValue: 1 },
  { answerText: "Sometimes", scoreValue: 2 },
  { answerText: "Often", scoreValue: 3 },
  { answerText: "Always", scoreValue: 4 },
];

interface QuestionInput {
  categoryId: string;
  subArea: string;
  ageGroup: AgeGroup;
  questionText: string;
  traitMeasured: string;
  weight?: number;
  culturalContext?: boolean;
  techContext?: boolean;
  testType: "rapid" | "deep";
  displayOrder?: number | null;
  reverseScored?: boolean;
}

async function createQuestion(input: QuestionInput) {
  const q = await prisma.question.create({
    data: {
      categoryId: input.categoryId,
      subArea: input.subArea,
      ageGroup: input.ageGroup,
      questionText: input.questionText,
      traitMeasured: input.traitMeasured,
      weight: input.weight ?? 1,
      culturalContext: input.culturalContext ?? false,
      techContext: input.techContext ?? false,
      testType: input.testType,
      displayOrder: input.displayOrder ?? null,
      reverseScored: input.reverseScored ?? false,
    },
  });
  for (const a of STANDARD_ANSWERS) {
    await prisma.answer.create({
      data: { questionId: q.id, answerText: a.answerText, scoreValue: a.scoreValue },
    });
  }
  return q;
}

async function main() {
  console.log("Seeding question bank...");

  const stress = await prisma.category.upsert({
    where: { id: "cat-stress" },
    update: {},
    create: {
      id: "cat-stress",
      name: "Stress & Anxiety",
      description: "Assess and understand stress and anxiety levels.",
      thumbnail: "/thumbnails/stress.jpg",
    },
  });

  await prisma.test.upsert({
    where: { categoryId_type: { categoryId: stress.id, type: "rapid" } },
    update: {},
    create: {
      categoryId: stress.id,
      name: "Rapid Mind Check",
      type: "rapid",
      durationMinutes: 15,
      totalQuestions: 35,
    },
  });
  await prisma.test.upsert({
    where: { categoryId_type: { categoryId: stress.id, type: "deep" } },
    update: {},
    create: {
      categoryId: stress.id,
      name: "Deep Psychological Assessment",
      type: "deep",
      durationMinutes: 60,
      totalQuestions: 100,
    },
  });

  // Categories + tests for recommendations (always ensure these exist)
  const confidence = await prisma.category.upsert({
    where: { id: "cat-confidence" },
    update: {},
    create: {
      id: "cat-confidence",
      name: "Confidence Issues",
      description: "Self-belief and confidence assessment.",
      thumbnail: "/thumbnails/confidence.jpg",
    },
  });
  const career = await prisma.category.upsert({
    where: { id: "cat-career" },
    update: {},
    create: {
      id: "cat-career",
      name: "Career Confusion",
      description: "Clarity on career direction and motivation.",
      thumbnail: "/thumbnails/career.jpg",
    },
  });
  for (const cat of [confidence, career]) {
    await prisma.test.upsert({
      where: { categoryId_type: { categoryId: cat.id, type: "rapid" } },
      update: {},
      create: { categoryId: cat.id, name: "Rapid Mind Check", type: "rapid", durationMinutes: 15, totalQuestions: 35 },
    });
    await prisma.test.upsert({
      where: { categoryId_type: { categoryId: cat.id, type: "deep" } },
      update: {},
      create: { categoryId: cat.id, name: "Deep Psychological Assessment", type: "deep", durationMinutes: 60, totalQuestions: 100 },
    });
  }
  const recCount = await prisma.testRecommendation.count();
  if (recCount === 0) {
    await prisma.testRecommendation.createMany({
      data: [
        { triggerTrait: "stress", triggerCondition: ">65", recommendedCategoryId: stress.id, priority: 10 },
        { triggerTrait: "confidence", triggerCondition: "<40", recommendedCategoryId: confidence.id, priority: 20 },
        { triggerTrait: "technology_behaviour", triggerCondition: ">70", recommendedCategoryId: stress.id, priority: 30 },
        { triggerTrait: "motivation", triggerCondition: "<45", recommendedCategoryId: career.id, priority: 40 },
        { triggerTrait: "resilience", triggerCondition: "<45", recommendedCategoryId: confidence.id, priority: 50 },
      ],
    });
    console.log("Seeded test_recommendations.");
  }

  // --- Psychologist marketplace (5–10 profiles) ---
  const psychologistData = [
    { id: "psy-1", name: "Dr. Anjali Nair", specialization: "Clinical Psychologist", experienceYears: 10, languages: "English, Hindi, Malayalam", rating: 4.8, profilePhoto: "/psychologists/placeholder.svg", bio: "Specializing in anxiety, stress, and relationship issues. CBT and mindfulness-based approaches.", consultationFee: 800 },
    { id: "psy-2", name: "Dr. Rajesh Kumar", specialization: "Counselling Psychologist", experienceYears: 8, languages: "English, Hindi, Tamil", rating: 4.9, profilePhoto: "/psychologists/placeholder.svg", bio: "Expert in career counselling and youth mental health.", consultationFee: 750 },
    { id: "psy-3", name: "Dr. Priya Sharma", specialization: "Child & Adolescent Psychologist", experienceYears: 12, languages: "English, Hindi", rating: 4.7, profilePhoto: "/psychologists/placeholder.svg", bio: "Focus on child behaviour, parenting, and school-related stress.", consultationFee: 900 },
    { id: "psy-4", name: "Dr. Suresh Menon", specialization: "Stress & Anxiety", experienceYears: 15, languages: "English, Malayalam", rating: 4.85, profilePhoto: "/psychologists/placeholder.svg", bio: "Evidence-based interventions for stress, burnout, and work-life balance.", consultationFee: 1000 },
    { id: "psy-5", name: "Dr. Kavitha Reddy", specialization: "Emotional Wellness", experienceYears: 6, languages: "English, Hindi, Telugu", rating: 4.6, profilePhoto: "/psychologists/placeholder.svg", bio: "Support for emotional regulation, self-esteem, and life transitions.", consultationFee: 700 },
    { id: "psy-6", name: "Dr. Amit Patel", specialization: "Career & Motivation", experienceYears: 9, languages: "English, Hindi, Gujarati", rating: 4.75, profilePhoto: "/psychologists/placeholder.svg", bio: "Career direction, motivation, and performance coaching.", consultationFee: 850 },
    { id: "psy-7", name: "Dr. Meera Iyer", specialization: "Trauma & Resilience", experienceYears: 11, languages: "English, Tamil", rating: 4.9, profilePhoto: "/psychologists/placeholder.svg", bio: "Trauma-informed care and building resilience.", consultationFee: 950 },
    { id: "psy-8", name: "Dr. Vikram Singh", specialization: "Relationship & Family", experienceYears: 14, languages: "English, Hindi", rating: 4.8, profilePhoto: "/psychologists/placeholder.svg", bio: "Couples and family therapy, communication, and conflict resolution.", consultationFee: 900 },
  ];
  for (const p of psychologistData) {
    await prisma.psychologist.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }
  console.log("Seeded psychologists.");

  const existing = await prisma.question.count({ where: { categoryId: stress.id } });
  if (existing > 0) {
    console.log("Questions already exist; skipping question seed.");
  } else {
  // --- Behavioral (daily life) ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_18_25",
    questionText: "Do you feel worried about your future at night when you try to sleep?",
    traitMeasured: "stress",
    testType: "rapid",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_25_40",
    questionText: "Do you feel mentally tired even before starting your daily tasks?",
    traitMeasured: "stress",
    testType: "rapid",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_13_18",
    questionText: "Do you find it hard to fall asleep because your mind is busy?",
    traitMeasured: "stress",
    testType: "rapid",
  });

  // --- Cultural context ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "cultural_context",
    ageGroup: "AGE_13_18",
    questionText: "Do you feel pressured by family expectations about studies or career?",
    traitMeasured: "stress",
    culturalContext: true,
    testType: "deep",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "cultural_context",
    ageGroup: "AGE_18_25",
    questionText: "Do you feel uncomfortable sharing your feelings with family members?",
    traitMeasured: "emotional_stability",
    culturalContext: true,
    testType: "deep",
  });

  // --- Technology & AI era ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "technology",
    ageGroup: "AGE_18_25",
    questionText: "Do you spend more time on your phone than talking to people around you?",
    traitMeasured: "technology_behaviour",
    techContext: true,
    testType: "rapid",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "technology",
    ageGroup: "AGE_13_18",
    questionText: "Do social media posts affect how you feel about your life?",
    traitMeasured: "emotional_stability",
    techContext: true,
    testType: "deep",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "technology",
    ageGroup: "AGE_13_18",
    questionText: "Do you feel distracted when studying because of your phone?",
    traitMeasured: "technology_behaviour",
    techContext: true,
    testType: "deep",
  });

  // --- Self awareness ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "self_awareness",
    ageGroup: "AGE_25_40",
    questionText: "Do you understand why you react emotionally in certain situations?",
    traitMeasured: "self_awareness",
    testType: "deep",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "self_awareness",
    ageGroup: "AGE_18_25",
    questionText: "Do you reflect on your decisions after something goes wrong?",
    traitMeasured: "self_awareness",
    testType: "rapid",
  });

  // --- Decision making ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "decision_making",
    ageGroup: "AGE_25_40",
    questionText: "When you face an important decision, do you delay it because of fear?",
    traitMeasured: "decision_making",
    testType: "deep",
  });

  // --- Emotional regulation ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "emotional_regulation",
    ageGroup: "AGE_18_25",
    questionText: "When someone criticizes you, do you feel upset for a long time?",
    traitMeasured: "emotional_stability",
    testType: "rapid",
  });

  // --- Work & productivity ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "work_productivity",
    ageGroup: "AGE_25_40",
    questionText: "Do you feel mentally tired even before starting your daily tasks?",
    traitMeasured: "stress",
    testType: "deep",
  });

  // --- Child specific (6–12, parent answers) ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "child_specific",
    ageGroup: "AGE_6_12",
    questionText: "Does the child get angry quickly when things don't go their way?",
    traitMeasured: "emotional_stability",
    testType: "deep",
  });

  // --- Teen (13–18) ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "teen",
    ageGroup: "AGE_13_18",
    questionText: "Do you compare yourself with others on social media?",
    traitMeasured: "confidence",
    techContext: true,
    testType: "deep",
  });

  // --- More traits for rapid/deep balance (confidence, resilience, motivation, life_satisfaction) ---
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_18_25",
    questionText: "Do you believe you can achieve your goals even when things are hard?",
    traitMeasured: "confidence",
    testType: "rapid",
  });
  // Reverse-scored: "Always" = low confidence → score 4 becomes 1 for trait
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_25_40",
    questionText: "I often doubt my abilities.",
    traitMeasured: "confidence",
    testType: "deep",
    reverseScored: true,
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_25_40",
    questionText: "After a setback, do you try again with a clear plan?",
    traitMeasured: "resilience",
    testType: "rapid",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_18_25",
    questionText: "Do you feel motivated to start your day in the morning?",
    traitMeasured: "motivation",
    testType: "rapid",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_25_40",
    questionText: "Do you feel satisfied with how your life is going overall?",
    traitMeasured: "life_satisfaction",
    testType: "rapid",
  });
  await createQuestion({
    categoryId: stress.id,
    subArea: "behavioral",
    ageGroup: "AGE_13_18",
    questionText: "Do you find it easy to join in when others are talking in a group?",
    traitMeasured: "social_behaviour",
    testType: "rapid",
  });

  // Sample translation (Hindi) for first question — add more via question_translations
  const first = await prisma.question.findFirst({
    where: { categoryId: stress.id },
    orderBy: { createdAt: "asc" },
  });
  if (first) {
    await prisma.questionTranslation.upsert({
      where: {
        questionId_languageCode: { questionId: first.id, languageCode: "hi" },
      },
      update: {},
      create: {
        questionId: first.id,
        languageCode: "hi",
        translatedText: "क्या आप रात को सोने की कोशिश करते समय अपने भविष्य को लेकर चिंतित महसूस करते हैं?",
      },
    });
  }

  }

  const { seedCareerIntelligence } = await import("./seed-career");
  await seedCareerIntelligence();

  const { seedExamCoaching } = await import("./seed-exam");
  await seedExamCoaching();

  // Growth missions (gamified psychological growth)
  const growthMissions = [
    { title: "Gratitude practice", description: "Write down three things you are grateful for today.", category: "mindfulness", points: 15 },
    { title: "Reflection journal", description: "Spend 5 minutes reflecting on your day and how you felt.", category: "reflection", points: 20 },
    { title: "Learn a new skill", description: "Spend 15 minutes learning something new (course, video, or article).", category: "learning", points: 25 },
    { title: "Career exploration", description: "Explore one career path or role that interests you.", category: "career", points: 30 },
    { title: "Mindfulness practice", description: "Complete a 5-minute breathing or mindfulness exercise.", category: "mindfulness", points: 10 },
    { title: "Daily intention", description: "Set one positive intention for the day.", category: "mindfulness", points: 10 },
    { title: "Strengths check", description: "List two strengths you used today.", category: "reflection", points: 15 },
    { title: "Skill practice", description: "Practice a skill related to your goals for 20 minutes.", category: "learning", points: 35 },
    { title: "Career research", description: "Read about a job or industry you're curious about.", category: "career", points: 25 },
    { title: "Kindness act", description: "Do one small act of kindness for yourself or someone else.", category: "wellbeing", points: 20 },
  ];
  const existingMissions = await prisma.growthMission.count();
  if (existingMissions === 0) {
    await prisma.growthMission.createMany({
      data: growthMissions,
    });
  }

  console.log("Seed complete: categories, tests, question bank, psychologists, career intelligence, exam coaching, growth missions.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
