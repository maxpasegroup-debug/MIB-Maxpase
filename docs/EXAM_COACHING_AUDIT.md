# Exam Coaching Arena — Audit Report

**Module:** Exam Coaching Arena (AI-powered competitive exam training)  
**Scope:** Validation and stabilization only. No changes to Career Intelligence, Psychological Tests, AI Mentor, Growth System, Guidance, or Referral System.

---

## 1. Database status

### Tables verified

| Table             | Purpose                                      | Relations |
|-------------------|----------------------------------------------|-----------|
| ExamCategory      | Exam categories (e.g. Government & Banking) | → exams   |
| Exam              | Exams (e.g. SSC CGL Tier 1)                 | → category, subjects, questions, diagnosticTests, trainingSessions, performanceLogs, trainingPlans, examReadinesses |
| ExamSubject       | Subjects per exam (Quant, Reasoning, English)| → exam, topics, questions |
| ExamTopic         | Topics per subject                           | → subject, questions |
| ExamQuestion      | Question bank                               | → exam, subject, topic |
| DiagnosticTest    | User diagnostic attempts                     | → exam   |
| TrainingSession   | Practice/mock/speed sessions                | → exam   |
| PerformanceLog    | Computed metrics (accuracy, speed, weakTopics)| → exam   |
| TrainingPlan      | Stored training plans (JSON)                | → exam   |
| ExamReadiness     | Readiness score and predicted rank          | → exam   |

- No null exam relations: all FKs reference valid exam/category/subject/topic.
- Questions linked to topics correctly via `subjectId` and `topicId`.
- Seed: `seedExamCoaching()` runs from `prisma/seed.ts`. If categories are empty, GET `/api/exams/categories` auto-runs the seed so the directory is never empty after first hit.

---

## 2. Exam categories and question bank

- **Categories:** Seeded with "Government & Banking".
- **Exams:** SSC CGL Tier 1 (25 questions per session, 60 min).
- **Subjects:** Quantitative Aptitude, Reasoning, English (with weightage).
- **Topics:** Algebra, Number System, Logical Reasoning, English Grammar (4 topics for SSC CGL).
- **Question bank size:** Seed creates **42 questions** for SSC CGL (10 Algebra, 10 Number System, 10 Logical Reasoning, 12 English Grammar).

**Audit script:** `npx tsx scripts/auditExamQuestions.ts`  
Reports: total questions per exam, subjects/topics distribution, duplicate `question_text`, and notes that the schema has no `options` field (MCQ options not stored).

**Note:** The seed script creates 42 questions only when run on an empty exam setup (no categories). If you already have exam data from an earlier seed, clear exam-related tables or use a fresh DB and run `npx tsx prisma/seed.ts` to get the full 42-question bank with topics Algebra, Number System, Logical Reasoning, English Grammar.

---

## 3. API validation

### GET `/api/exams/categories`
- Returns categories with exam count. Auto-seeds if no categories exist.

### GET `/api/exams/list`
- Returns exams grouped by category.

### POST `/api/exams/diagnostic/start`
- Body: `{ examId }`. Returns `{ sessionId, questions }`.

### POST `/api/exams/training/start`
- Body: `{ userId?, examId, sessionType? }`. Returns `{ sessionId, sessionType, questions }`. Session types: practice, mock_test, speed_drill, memory_training, logic_training.

### POST `/api/exams/session/complete`
- Body: `{ sessionId, examId, type, score, total, durationSec, userId? }`.
- **Validation:** `sessionId` and `examId` required; `type` must be `"diagnostic"` or a valid training type.
- **Score:** `accuracy = (score / total) * 100`; `score` stored as correct count.
- **Duration:** Stored as `duration` for training sessions.
- **Behaviour:** Diagnostic → creates **DiagnosticTest** only. Training → **TrainingSession** updated only (by id, examId, userId). Then `calculatePerformance` and `saveExamReadiness` are called.

### GET `/api/exams/performance?examId=`
- Returns `{ logs, readiness, weakTopicNames }`. Used for accuracy trend, speed chart, readiness, and topic focus areas.

### GET `/api/exams/coach-feedback?examId=`
- Resolves weak topic IDs to names, then returns AI coach feedback (performance summary, weak topics, daily action recommendation).

---

## 4. Performance engine status

**Library:** `lib/examPerformance.ts`

- **Metrics computed:**  
  - **Accuracy:** Percentage (0–100) from diagnostic and training session accuracies.  
  - **Speed:** 0–100 proxy from average session duration (average response speed).  
  - **Weak topics:** From `topicScores` (topicId → correct/total); topics &lt; 50% mastery.  
  - **Consistency:** From variance of first vs last score; 0–100.
- **Storage:** All metrics written to **PerformanceLog** (accuracy, speed, consistency, weakTopics as JSON string).

---

## 5. Readiness engine status

**Library:** `lib/examReadiness.ts`

- **Inputs:** accuracy, speed, consistency, weakTopics (from PerformanceMetrics).
- **Formula:** `accuracy*0.35 + speed*0.25 + consistency*0.2 + (100 - weakPenalty)*0.2`; weakPenalty = min(30, weakTopics.length * 5).
- **Score range:** Clamped **0–100**.
- **Output:** `readinessScore`, `predictedRank` (Top 5%, Top 15%, Top 30%, Middle tier, Needs more practice). Stored in **ExamReadiness**.

---

## 6. AI coach validation

**Library:** `lib/examAICoach.ts`

- **Feedback includes:**  
  - Performance summary (accuracy %, speed %, readiness /100).  
  - Weak topics (by name when resolved from IDs).  
  - Daily action recommendation, e.g. *"Practice 20 questions from [Algebra and Number System] today."*
- **Styles:** strict, mentor, military, motivational. Each style includes the above and style-specific wording.

---

## 7. Training plan engine status

**Library:** `lib/examTrainingPlan.ts`

- **3-day plan:**  
  - Day 1: Weak topic drill (or full syllabus practice).  
  - Day 2: Logic and speed drills.  
  - Day 3: Mock test.
- **7-day plan:** Day 1 diagnostic review, Days 2–3 subject focus, Day 4 speed drill, Day 5 weak topics, Day 6 mixed practice, Day 7 mock test.
- **Storage:** Plan stored in **TrainingPlan** as JSON (`planData`).

---

## 8. Frontend flow and navigation

- **/exam-coaching** — Landing: categories, exam list, start diagnostic. Links to `/exam-coaching/[examId]`.
- **/exam-coaching/[examId]** — Dashboard: Start Diagnostic, Training Arena (practice / mock_test / speed_drill), Performance link, AI Coach Feedback. Redirects to `/exam-coaching/train/[sessionId]`.
- **/exam-coaching/train/[sessionId]** — Question UI: progress, timer, MCQ. On submit → POST session/complete → redirect to `/exam-coaching/result?...&examId=`.
- **/exam-coaching/result** — Score, total, duration; links to performance (if examId) and Exam Coaching.
- **/exam-coaching/performance/[examId]** — Readiness score, predicted rank, weak topics (focus areas), accuracy trend (LineChart), speed score (BarChart). Uses **recharts**.

Navigation between these pages is consistent and links are correct.

---

## 9. Performance charts

- **Accuracy trend:** LineChart (recharts), session index vs accuracy %.
- **Speed score:** BarChart (recharts), session index vs speed %.
- **Readiness score:** Displayed in card (0–100).
- **Topic mastery / focus areas:** Weak topics from latest PerformanceLog shown as tags (topic names from API).

---

## 10. Mobile support status

- **Route:** `/mobile/exam-coaching`
- **Tabs:** My Exam, Daily Mission, Practice, Mock Test, Performance. Each links to `/exam-coaching` or explains next step.
- **Flow:** User can choose exam (via Exam directory), start training, and view performance from the exam dashboard. Mobile home has "Exam Coaching Arena" card → `/mobile/exam-coaching`.

---

## 11. Landing page and dashboard

- **Landing (ProductFeatures):** Card "Exam Coaching Arena" with description: *"AI-powered exam training with diagnostics, coaching, and performance tracking."* Link: `/exam-coaching`.
- **Dashboard:** "Exam Coaching" section with card and link to `/exam-coaching` (Exam Coaching Arena button).

---

## 12. Summary

| Area              | Status |
|-------------------|--------|
| Database          | Models and relations correct; seed + auto-seed in place. |
| Question bank     | 42 questions (SSC CGL); audit script added. |
| Session complete  | Validated; diagnostic vs training handled correctly. |
| Performance engine| Accuracy, speed, consistency, weak topics; stored in PerformanceLog. |
| Readiness engine  | 0–100 score; accuracy, speed, consistency, topic mastery. |
| AI coach          | Performance summary, weak topics, daily action. |
| Training plan     | Day 1 practice, Day 2 drills, Day 3 mock; stored in TrainingPlan. |
| Frontend          | All pages and navigation verified. |
| Charts            | recharts: accuracy trend, speed, readiness, weak topics. |
| Mobile            | Tabs and links to exam directory and performance. |
| Landing / Dashboard | Card and section present with correct copy and link. |

The Exam Coaching Arena is **stable and scalable** for adding more exams and questions; other platform modules were not modified.
