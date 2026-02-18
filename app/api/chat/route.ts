import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    let currentSessionId = sessionId;

    // 🔥 セッションが無ければ作成
    if (!currentSessionId) {
      const { data: session } = await supabase
        .from("sessions")
        .insert({})
        .select()
        .single();

      currentSessionId = session.id;
    }

    // 🔥 ユーザー発言を保存
    await supabase.from("messages").insert([
      {
        role: "user",
        content: message,
        session_id: currentSessionId,
      },
    ]);

    // 🔥 過去メッセージを取得（このセッションのみ）
    const { data: previousMessages } = await supabase
      .from("messages")
      .select("role, content")
      .eq("session_id", currentSessionId)
      .order("created_at", { ascending: true });

    // 🔥 OpenAI用メッセージ配列を作る
    const chatMessages = [
      {
        role: "system",
        content: `
あなたは「WHY」という哲学的対話アプリのAIです。
答えを与えず、問い返しによって思考を深めます。
優しく、断定せず、共感的に話してください。
        `,
      },
      ...(previousMessages || []),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages as any,
    });

    const reply = response.choices[0].message.content ?? "";

    // 🔥 AIの返答を保存
    await supabase.from("messages").insert([
      {
        role: "assistant",
        content: reply,
        session_id: currentSessionId,
      },
    ]);

    return Response.json({
      reply,
      sessionId: currentSessionId,
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "AIエラー" }, { status: 500 });
  }
}