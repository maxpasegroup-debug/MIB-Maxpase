interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
