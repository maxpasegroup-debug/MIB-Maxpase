import Link from "next/link";

export default function ResultNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Report not found
        </h1>
        <p className="text-gray-600 mb-6">
          This result may not exist yet or the link may be incorrect. Complete a
          test to see your report here.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
