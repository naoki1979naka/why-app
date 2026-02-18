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

    if (!sessionId && data.sessionId) {
      setSessionId(data.sessionId);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col justify-between px-6 py-16">
      
      {/* 上部余白 */}
      <div />

      {/* 中央コンテンツ */}
      <div className="max-w-xl mx-auto text-center space-y-10">

        <h1 className="text-5xl font-light tracking-[0.2em] text-neutral-300">
          WHY
        </h1>

        <div className="space-y-3 text-neutral-500">
          <p className="text-xl">ただ生きるために。</p>
          <p className="text-sm tracking-wide">
            外側は静かに、内側は深く。
          </p>
        </div>

        {/* チャット表示 */}
        <div className="space-y-4 text-left min-h-[200px] mt-10">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-neutral-800 text-right"
                  : "bg-neutral-700 text-left"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* 入力 */}
        <div className="flex gap-3 mt-6">
          <input
            className="flex-1 bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-sm focus:outline-none focus:border-neutral-600 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="人はなぜ生きるか。"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-5 py-2 border border-neutral-700 rounded-xl text-sm hover:bg-neutral-800 transition"
          >
            {loading ? "..." : "送信"}
          </button>
        </div>

      </div>

      {/* 下部寄付 */}
      <div className="text-center text-xs text-neutral-600 space-y-3 mt-12">
        <p>この場所が続くように、そっと支える。</p>
        <div className="space-x-4">
          <button className="hover:text-neutral-400 transition">
            ¥500
          </button>
          <button className="hover:text-neutral-400 transition">
            ¥1000
          </button>
          <button className="hover:text-neutral-400 transition">
            任意
          </button>
        </div>
      </div>

    </main>
  );
}