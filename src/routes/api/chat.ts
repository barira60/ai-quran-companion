import {
  QURAN_COMPANION_SYSTEM_PROMPT,
  QURAN_COMPANION_URDU_SYSTEM_PROMPT,
} from "@/lib/system-prompt";
import { createFileRoute } from "@tanstack/react-router";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

type ChatBody = { messages?: unknown; mood?: string; language?: "en" | "ur" };

export const Route = createFileRoute("/api/chat")({
  component: () => null,
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as ChatBody;
          if (!Array.isArray(body.messages)) {
            return new Response("messages required", { status: 400 });
          }

          const geminiKey = (
            process.env.GEMINI_API_KEY ||
            process.env.VITE_GEMINI_API_KEY
          )?.trim();
          const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();

          if (!geminiKey && !openrouterKey) {
            return new Response("Missing GEMINI_API_KEY in .env file.", {
              status: 500,
            });
          }

          const isUrdu = body.language === "ur";
          let system = isUrdu
            ? QURAN_COMPANION_URDU_SYSTEM_PROMPT
            : QURAN_COMPANION_SYSTEM_PROMPT;

          if (body.mood) {
            if (isUrdu) {
              system += `\n\nصارف نے ہیلنگ موڈ میں یہ موضوع منتخب کیا ہے: "${body.mood}". براہ کرم اسی کیفیت اور موضوع کو سامنے رکھ کر تسلی اور رہنمائی فرمائیں۔`;
            } else {
              system += `\n\nThe user has selected the focus area: "${body.mood}". Tailor your response to this emotion or theme.`;
            }
          }

          // If Gemini API Key is present, use Google Gemini
          if (geminiKey) {
            const rawContents: Array<{
              role: "user" | "model";
              parts: Array<{ text: string }>;
            }> = [];

            for (const msg of body.messages as any[]) {
              const content = Array.isArray(msg.parts)
                ? msg.parts
                    .map((p: any) => (p.type === "text" ? p.text : ""))
                    .join("")
                : typeof msg.content === "string"
                  ? msg.content
                  : "";

              if (content.trim()) {
                const role: "user" | "model" =
                  msg.role === "assistant" || msg.role === "model"
                    ? "model"
                    : "user";
                rawContents.push({
                  role,
                  parts: [{ text: content }],
                });
              }
            }

            // Ensure at least one user message
            if (rawContents.length === 0) {
              return new Response("At least one message is required", {
                status: 400,
              });
            }

            // Merge consecutive messages of the same role
            const mergedContents: Array<{
              role: "user" | "model";
              parts: Array<{ text: string }>;
            }> = [];
            for (const item of rawContents) {
              const prev = mergedContents[mergedContents.length - 1];
              if (prev && prev.role === item.role) {
                prev.parts[0].text += `\n\n${item.parts[0].text}`;
              } else {
                mergedContents.push({
                  role: item.role,
                  parts: [{ text: item.parts[0].text }],
                });
              }
            }

            // Ensure first message is from user
            if (mergedContents[0]?.role === "model") {
              mergedContents.shift();
            }

            // Enforce language directly on the last user message so LLM follows current mode regardless of previous chat language
            if (body.language === "ur" && mergedContents.length > 0) {
              const last = mergedContents[mergedContents.length - 1];
              if (last.role === "user") {
                last.parts[0].text += `\n\n[اہم ترین اور لازمی ہدایت: براہ کرم اس سوال کا پورا جواب، تمام عنوانات، مستند حدیث کا ترجمہ، راوی کا نام، کتاب کا نام، دعا کا ترجمہ و تشریح، اور تمام سیکشنز 100 فیصد خالص، مستند اور آسان اردو میں تحریر فرمائیں۔ انگریزی زبان کا کوئی لفظ یا انگریزی ترجمہ بالکل شامل نہ کریں۔]`;
              }
            } else if (body.language === "en" && mergedContents.length > 0) {
              const last = mergedContents[mergedContents.length - 1];
              if (last.role === "user") {
                last.parts[0].text += `\n\n[CRITICAL INSTRUCTION: Please reply to this question completely in English (with Arabic for Quran verses and Dua Arabic text as required). All section titles, hadith translation, dua meaning, explanations, and advice must be in clear English. Do not reply in Urdu.]`;
              }
            }

            const candidateModels = [
              "gemini-3.6-flash",
              "gemini-3.7-flash",
              "gemini-3.5-flash",
              "gemini-flash-latest",
              "gemini-3.1-flash-lite",
            ];

            let geminiRes: Response | null = null;
            for (const model of candidateModels) {
              try {
                const res = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${geminiKey}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      systemInstruction: {
                        parts: [{ text: system }],
                      },
                      contents: mergedContents,
                      generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192,
                      },
                    }),
                  },
                );

                if (res.ok) {
                  geminiRes = res;
                  break;
                }
              } catch (e) {
                console.warn(`Gemini model ${model} fetch failed:`, e);
              }
            }

            if (geminiRes && geminiRes.ok) {
              const responseStream = geminiRes.body;
              const stream = createUIMessageStream({
                execute: async ({ writer }) => {
                  writer.write({ type: "start" });
                  writer.write({ type: "text-start", id: "text-1" });

                  if (responseStream) {
                    const reader = responseStream.getReader();
                    const decoder = new TextDecoder();
                    let sseBuffer = "";

                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;

                      sseBuffer += decoder.decode(value, { stream: true });
                      const lines = sseBuffer.split("\n");
                      sseBuffer = lines.pop() || "";

                      for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data:")) continue;
                        const data = trimmed.slice(5).trim();
                        if (!data || data === "[DONE]") continue;

                        try {
                          const parsed = JSON.parse(data);
                          const parts =
                            parsed.candidates?.[0]?.content?.parts;
                          if (Array.isArray(parts)) {
                            for (const p of parts) {
                              if (p.text) {
                                const clean = p.text
                                  .replace(/<\|tool_call_start\|>[\s\S]*?(?:<\|tool_call_end\|>|$)/g, "")
                                  .replace(/\[(?:quran_com|sunnah_com)\([^\]]*?\)(?:,\s*(?:quran_com|sunnah_com)\([^\]]*?\))*\]/g, "")
                                  .replace(/<\|(?:im_start|im_end|tool_call_start|tool_call_end)\b[^>]*>/g, "");
                                if (clean) {
                                  writer.write({
                                    type: "text-delta",
                                    id: "text-1",
                                    delta: clean,
                                  });
                                }
                              }
                            }
                          }
                        } catch {
                          // ignore malformed chunk
                        }
                      }
                    }
                  }

                  writer.write({ type: "text-end", id: "text-1" });
                  writer.write({ type: "finish" });
                },
              });

              return createUIMessageStreamResponse({ stream });
            }
          }

          // Fallback to OpenRouter if Gemini failed or is not available
          const openrouterModels = [
            "google/gemini-2.0-flash-001",
            "meta-llama/llama-3.3-70b-instruct:free",
            "mistralai/mistral-7b-instruct:free",
          ];

          const apiMessages: Array<{ role: string; content: string }> = [
            { role: "system", content: system },
          ];

          for (const msg of body.messages as any[]) {
            const content = Array.isArray(msg.parts)
              ? msg.parts
                  .map((p: any) => (p.type === "text" ? p.text : ""))
                  .join("")
              : typeof msg.content === "string"
                ? msg.content
                : "";
            if (content) {
              apiMessages.push({ role: msg.role, content });
            }
          }

          if (body.language === "ur" && apiMessages.length > 0) {
            const last = apiMessages[apiMessages.length - 1];
            if (last.role === "user") {
              last.content += `\n\n[اہم ترین اور لازمی ہدایت: براہ کرم اس سوال کا پورا جواب، تمام عنوانات، مستند حدیث کا ترجمہ، راوی کا نام، کتاب کا نام، دعا کا ترجمہ و تشریح، اور تمام سیکشنز 100 فیصد خالص، مستند اور آسان اردو میں تحریر فرمائیں۔ انگریزی زبان کا کوئی لفظ یا انگریزی ترجمہ بالکل شامل نہ کریں۔]`;
            }
          } else if (body.language === "en" && apiMessages.length > 0) {
            const last = apiMessages[apiMessages.length - 1];
            if (last.role === "user") {
              last.content += `\n\n[CRITICAL INSTRUCTION: Please reply to this question completely in English (with Arabic for Quran verses and Dua Arabic text as required). All section titles, hadith translation, dua meaning, explanations, and advice must be in clear English. Do not reply in Urdu.]`;
            }
          }

          let openrouterRes: Response | null = null;
          for (const m of openrouterModels) {
            try {
              const apiRes = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${openrouterKey}`,
                    "HTTP-Referer": "https://quran-companion.app",
                    "X-Title": "Quran Companion AI",
                  },
                  body: JSON.stringify({
                    model: m,
                    messages: apiMessages,
                    stream: true,
                  }),
                },
              );

              if (apiRes.ok) {
                openrouterRes = apiRes;
                break;
              }
            } catch (e) {
              console.warn(`OpenRouter model ${m} failed:`, e);
            }
          }

          if (!openrouterRes || !openrouterRes.ok) {
            return new Response(
              "The AI service is currently busy. Please try again in a few moments.",
              { status: 503 },
            );
          }

          const orStream = openrouterRes.body;
          const stream = createUIMessageStream({
            execute: async ({ writer }) => {
              writer.write({ type: "start" });
              writer.write({ type: "text-start", id: "text-1" });

              if (orStream) {
                const reader = orStream.getReader();
                const decoder = new TextDecoder();
                let sseBuffer = "";

                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  sseBuffer += decoder.decode(value, { stream: true });
                  const lines = sseBuffer.split("\n");
                  sseBuffer = lines.pop() || "";

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const data = trimmed.slice(5).trim();
                    if (!data || data === "[DONE]") continue;

                    try {
                      const parsed = JSON.parse(data);
                      const delta = parsed.choices?.[0]?.delta?.content;
                      if (delta) {
                        const clean = delta
                          .replace(/<\|tool_call_start\|>[\s\S]*?(?:<\|tool_call_end\|>|$)/g, "")
                          .replace(/\[(?:quran_com|sunnah_com)\([^\]]*?\)(?:,\s*(?:quran_com|sunnah_com)\([^\]]*?\))*\]/g, "")
                          .replace(/<\|(?:im_start|im_end|tool_call_start|tool_call_end)\b[^>]*>/g, "");
                        if (clean) {
                          writer.write({
                            type: "text-delta",
                            id: "text-1",
                            delta: clean,
                          });
                        }
                      }
                    } catch {
                      // skip
                    }
                  }
                }
              }

              writer.write({ type: "text-end", id: "text-1" });
              writer.write({ type: "finish" });
            },
          });

          return createUIMessageStreamResponse({ stream });
        } catch (err) {
          console.error("Chat API handler error:", err);
          const msg = err instanceof Error ? err.message : String(err);
          return new Response(`AI Service Error: ${msg}`, { status: 500 });
        }
      },
    },
  },
});
