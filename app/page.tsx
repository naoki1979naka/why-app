export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-light">WHY</h1>
        <p className="text-lg text-gray-600">
          なぜ、生きるのか。
        </p>
        <button className="px-6 py-2 border border-black hover:bg-black hover:text-white transition">
          はじめる
        </button>
      </div>
    </main>
  );
}