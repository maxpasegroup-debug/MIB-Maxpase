interface ProfileCardProps {
  name: string;
  email: string;
  role: string;
}

export default function ProfileCard({ name, email, role }: ProfileCardProps) {
  return (
    <div className="rounded-2xl shadow-xl border border-white/60 bg-white/80 backdrop-blur-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
      <h3 className="text-sm text-gray-500 mb-1">Profile</h3>
      <p className="text-xl font-semibold text-gray-900">{name}</p>
      <p className="text-sm text-gray-600">{email}</p>
      <p className="mt-2 text-xs text-gray-500 capitalize">{role}</p>
    </div>
  );
}
