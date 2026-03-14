const DEFAULT_SKILLS = [
  "Programming",
  "Communication",
  "Leadership",
  "Critical thinking",
];

interface SkillRecommendationsProps {
  skills?: string[];
}

export default function SkillRecommendations({ skills = DEFAULT_SKILLS }: SkillRecommendationsProps) {
  return (
    <div className="rounded-2xl shadow-lg border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Skills</h3>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="flex items-center gap-2 text-gray-700"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
