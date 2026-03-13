# Mind Assessment — Psychology Platform Landing

A modern, colorful landing page for a psychology assessment platform built with Next.js 14, TailwindCSS, Framer Motion, and React Icons.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TailwindCSS**
- **Framer Motion**
- **Lottie React** (available for future use)
- **React Icons**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

- `app/page.tsx` — Main landing page composing all sections
- `app/layout.tsx` — Root layout with Poppins font
- `app/globals.css` — Tailwind + custom gradient/keyframe styles
- `app/components/`
  - `HeroSection.tsx` — Full-screen hero with animated gradient, floating logo placeholder, CTA buttons
  - `CategoryGrid.tsx` — 8 life-problem cards (stress, relationships, career, etc.)
  - `HowItWorks.tsx` — 3-step flow (Choose → Answer → Report)
  - `TestTypes.tsx` — Rapid (15 min) vs Deep (60 min) test cards with glow
  - `AudienceSection.tsx` — Children, Students, Professionals, Parents, Counselors
  - `ResultPreview.tsx` — Mock report with progress bars and radar-style chart
  - `CTASection.tsx` — Final CTA with gradient background
  - `Footer.tsx` — About, Privacy, For Psychologists, Contact

## Logo

The hero uses an emoji placeholder (🧠). To use a real logo, replace the placeholder div in `HeroSection.tsx` with:

```tsx
import Image from "next/image";
// ...
<Image src="/logo.png" alt="Logo" width={112} height={112} className="..." />
```

Place your image in `public/logo.png`.

## Phase 1 — Database

Prisma + SQLite. Tables: **categories**, **tests**, **questions**, **answers**, **users**, **test_sessions**, **responses**, **results**.

### Setup

```bash
cp .env.example .env   # or use existing .env with DATABASE_URL="file:./dev.db"
npm install
npx prisma migrate dev --name init
npm run db:seed
```

### Commands

| Command | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:push` | Push schema without migration (dev) |
| `npm run db:seed` | Seed categories, tests, sample questions/answers |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

### Schema overview

- **categories** — id, name, description, thumbnail, created_at  
- **tests** — category_id, name, type (rapid/deep), duration_minutes, total_questions  
- **questions** — category_id, sub_area, age_group, question_text, trait_measured, weight, cultural_context, tech_context, test_type  
- **answers** — question_id, answer_text, score_value (Never=1 … Always=4)  
- **test_sessions** — user_id, category_id, test_type, language_code (en/ml/hi/ta), started_at, completed_at, score_summary  
- **responses** — session_id, question_id, selected_answer, score  
- **results** — session_id, stress_score, confidence_score, emotional_score, trait_scores (JSON), ai_analysis  

Use the Prisma client from `lib/prisma.ts` (singleton) in API routes or server components.

### Question bank (result-oriented)

Questions measure **real-life behaviour** with a 4-point scale (Never / Sometimes / Often / Always → 1–4).

- **Tagging:** category, sub_area, trait_measured, age_group, test_type (rapid | deep).  
- **Deep test:** 10 traits × 10 questions = 100. **Rapid test:** 10 traits × 3–4 = 30–40.  
- **Traits:** stress, confidence, emotional_stability, decision_making, social_behaviour, technology_behaviour, motivation, resilience, self_awareness, life_satisfaction.  
- **Sub-areas:** behavioral, cultural_context, technology, self_awareness, decision_making, emotional_regulation, work_productivity, child_specific (6–12), teen (13–18).  
- **Result engine:** `lib/traits.ts` and `lib/interpretation.ts` — trait score 0–100 → band (e.g. Stress: 0–20 Low, 21–35 Moderate, 36–50 High, 51+ Very High).  
- **Scoring:** `lib/results.ts` — `completeSessionAndCreateResult(sessionId)` computes weighted trait scores (with **reverse scoring** when `reverse_scored` is true) and writes `results.trait_scores` JSON.  
- **Display order:** `questions.display_order` (INT, optional) — B2B fixed order when set; null = randomize. Use `lib/questions.ts` `sortQuestionsByDisplayOrder()`.  
- **Reverse scoring:** `questions.reverse_scored` (boolean) — e.g. "I often doubt my abilities" → Always = low confidence; engine uses `5 - score` for these items.  
- **Translations:** `question_translations` (question_id, language_code, translated_text) — e.g. ml, hi, ta for rural/regional. Use `lib/questions.ts` `getQuestionText(question, languageCode)`.  
- **Session language:** Each test session stores a `language_code` (en, ml, hi, ta) so the system can load translated questions for the entire test; default is `"en"`.  
- **B2B results:** `results.psychologist_notes`, `results.reviewed_by_psychologist` for counseling workflow.

---

## Design

- **Colors:** Purple, pink, blue, yellow/amber gradients
- **Font:** Poppins (Google Font)
- **Responsive:** Mobile-first; 1 column → 2 columns (tablet) → 4 columns (desktop) for cards
- **Animations:** Framer Motion (fade-in, slide-up, hover scale, floating logo); CSS keyframes for gradient and glow
