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

  const handleSupport = () => {
    alert("将来的にStripe決済を接続します 🌙");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 p-6">
      <div className="w-full max-w-xl space-y-10">

        {/* タイトル */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-wide">
            WHY
          </h1>

          <div className="space-y-1 text-neutral-400">
            <p className="text-lg">ただ生きるために。</p>
            <p className="text-sm">外側は静かに、</p>
            <p className="text-sm">内側は深く。</p>
          </div>
        </div>

        {/* サポートエリア */}
        <div className="text-center space-y-3">
          <button
            onClick={handleSupport}
            className="text-sm border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-800 transition"
          >
            🌙 この場所を支える
          </button>

          <button
            onClick={handleSupport}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition"
          >
            ☕ そっと応援する
          </button>
        </div>

        {/* メッセージ表示 */}
        <div className="space-y-3 min-h-[200px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-neutral-800 text-right"
                  : "bg-neutral-700 text-left"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* 入力欄 */}
        <div className="flex gap-2">
          <input
            className="flex-1 bg-neutral-900 border border-neutral-700 p-3 rounded text-sm focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="なぜ生きているのだろう。"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 border border-neutral-600 rounded hover:bg-neutral-800 transition"
          >
            {loading ? "..." : "送信"}
          </button>
        </div>

      </div>
    </main>
  );
}