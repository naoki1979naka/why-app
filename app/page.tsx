"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        sessionId: sessionId,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: data.reply },
    ]);

    // 🔥 ここが重要
    if (!sessionId && data.sessionId) {
      setSessionId(data.sessionId);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-light text-center">WHY</h1>

        <div className="space-y-2 min-h-[200px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                msg.role === "user"
                  ? "bg-gray-200 text-right"
                  : "bg-black text-white"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="あなたはなぜ生きていると思いますか？"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 border border-black hover:bg-black hover:text-white"
          >
            {loading ? "..." : "送信"}
          </button>
        </div>
      </div>
    </main>
  );
}