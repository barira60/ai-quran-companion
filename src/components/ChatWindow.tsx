import { MarkdownMessage } from "@/components/MarkdownMessage";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveLocalMessages } from "@/lib/local-store";
import { EN_PROMPTS, UR_PROMPTS, getStoredLanguage, useLanguage } from "@/lib/language-store";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { BookHeart, Send, Sparkle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function partsToText(parts: UIMessage["parts"]): string {
  return parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

const QUICK_PROMPTS = EN_PROMPTS;

const HEALING_PROMPTS: Record<string, string[]> = {
  Stress: [
    "I feel overwhelmed and can't focus.",
    "Help me calm my racing thoughts.",
    "Give me a dua for stress relief.",
  ],
  Anxiety: [
    "I'm feeling anxious and restless.",
    "Remind me that Allah is in control.",
    "What does the Quran say about worry?",
  ],
  Sadness: [
    "I'm feeling sad and lonely.",
    "Comfort for a heavy heart.",
    "Verses for when grief feels heavy.",
  ],
  Fear: [
    "I'm afraid of what might happen.",
    "Give me courage from the Quran.",
    "Dua for protection from fear.",
  ],
  Patience: [
    "I need patience with this hardship.",
    "Help me stay steadfast.",
    "Verses about sabr.",
  ],
  Hope: [
    "I've lost hope in this situation.",
    "Remind me of Allah's mercy.",
    "Verses for hope after hardship.",
  ],
  Tawakkul: [
    "Help me trust Allah more.",
    "How do I put my trust in Allah?",
    "Verses about tawakkul.",
  ],
  Gratitude: [
    "I want to be more grateful.",
    "Help me count my blessings.",
    "Verses about shukr.",
  ],
};

export function ChatWindow({
  threadId,
  mood,
  initialMessages,
}: {
  threadId: string;
  mood?: string | null;
  initialMessages: UIMessage[];
}) {
  const [appLang] = useLanguage();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          mood: mood || undefined,
          language: getStoredLanguage(),
        }),
      }),
    [mood],
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => console.error(e),
    onFinish: ({ messages: final }) => {
      const firstUser = final.find((m) => m.role === "user");
      const titleHint = firstUser ? partsToText(firstUser.parts).slice(0, 80) : undefined;
      try {
        saveLocalMessages(
          threadId,
          final.map((m) => ({ role: m.role, parts: m.parts as unknown[] })),
          titleHint,
        );
      } catch (e) {
        console.error("save failed", e);
      }
    },
  });

  useEffect(() => {
    composerRef.current?.focus();
  }, [threadId, status]);

  const submit = async (text: string) => {
    if (!text.trim() || status === "submitted" || status === "streaming") return;
    if (error) clearError();
    setInput("");
    await sendMessage({ text: text.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit(input);
    }
  };

  const isLoading = status === "submitted" || status === "streaming";
  const quickPrompts = appLang === "ur"
    ? UR_PROMPTS
    : mood
      ? (HEALING_PROMPTS[mood] ?? QUICK_PROMPTS)
      : QUICK_PROMPTS;

  return (
    <div className="flex h-full w-full flex-1 min-w-0 flex-col">
      <Conversation className="w-full flex-1 min-h-0">
        <ConversationContent className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-2 sm:py-4">
          {messages.length === 0 && (
            <ConversationEmptyState
              icon={<Sparkle className="size-6 text-gold" />}
              title={
                appLang === "ur"
                  ? mood ? `ہیلنگ موڈ · ${mood}` : "اپنے دل کی بات بتائیں"
                  : mood ? `Healing Mode · ${mood}` : "Share what's on your heart"
              }
              description={
                appLang === "ur"
                  ? "اپنی کیفیت، پریشانی یا سوال بیان کریں۔ قرآن اور سنت سے رہنمائی حاصل کریں۔"
                  : "Describe how you feel or what you're struggling with. I'll share guidance from the Qur'an and Sunnah."
              }
              className="py-4 sm:py-8 px-2 sm:px-4"
            >
              <div className="flex flex-col items-center gap-2.5 sm:gap-4 max-w-lg mx-auto">
                <div className="rounded-full bg-gold/15 p-2 sm:p-2.5 text-gold">
                  <BookHeart className="size-6 sm:size-7" />
                </div>
                <h3 className={appLang === "ur" ? "font-urdu text-lg sm:text-xl font-bold text-foreground" : "font-serif text-base sm:text-lg font-semibold"}>
                  {appLang === "ur"
                    ? mood ? `ہیلنگ موڈ · ${mood}` : "اپنے دل کا حال بیان کریں"
                    : mood ? `Healing Mode · ${mood}` : "Share what's on your heart"}
                </h3>
                <p className={appLang === "ur" ? "font-urdu text-xs sm:text-sm text-muted-foreground max-w-sm text-center leading-relaxed" : "text-xs sm:text-sm text-muted-foreground max-w-sm text-center leading-relaxed"}>
                  {appLang === "ur"
                    ? "آپ جو بھی محسوس کر رہے ہیں، بے جھجھک لکھیں۔ قرآن، حدیث اور دعا سے رہنمائی ملے گی۔"
                    : mood
                      ? `You chose ${mood}. Share a little more, or pick a prompt to begin.`
                      : "Describe how you feel or what you're struggling with. I'll share verses, hadith, duas, and practical steps."}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-1 sm:pt-2" dir={appLang === "ur" ? "rtl" : "ltr"}>
                  {quickPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => void submit(p)}
                      className={`rounded-full border bg-card hover:bg-accent transition-colors shadow-2xs ${
                        appLang === "ur" 
                          ? "font-urdu text-xs sm:text-sm px-2.5 py-1 leading-normal" 
                          : "text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          )}

          {messages.map((m) => {
            const text = partsToText(m.parts);
            if (m.role === "user") {
              const isUserUrdu = /[\u0600-\u06FF]/.test(text);
              return (
                <Message key={m.id} from="user">
                  <MessageContent
                    className={
                      isUserUrdu
                        ? "font-urdu text-[14px] sm:text-[16px] leading-[2.0] sm:leading-[2.2] text-right"
                        : "text-sm sm:text-base leading-relaxed"
                    }
                    dir={isUserUrdu ? "rtl" : "ltr"}
                  >
                    {text}
                  </MessageContent>
                </Message>
              );
            }
            return (
              <Message key={m.id} from="assistant">
                <MessageContent>
                  <MarkdownMessage text={text} />
                </MessageContent>
              </Message>
            );
          })}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer className={appLang === "ur" ? "font-urdu text-xs sm:text-sm leading-normal" : ""}>
                  {appLang === "ur" ? "رہنمائی تلاش کی جا رہی ہے…" : "Reflecting on your words…"}
                </Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <span>{error.message || "Failed to get response. Please try again."}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-destructive/40 hover:bg-destructive/10"
                onClick={() => {
                  clearError();
                  const lastUser = [...messages].reverse().find((m) => m.role === "user");
                  if (lastUser) {
                    const text = partsToText(lastUser.parts);
                    if (text) void sendMessage({ text });
                  }
                }}
              >
                Retry
              </Button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t bg-card/60 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2 rounded-2xl sm:rounded-3xl border border-primary/20 bg-background/90 px-3 py-1 sm:py-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-ring focus-within:border-primary">
            <Textarea
              ref={composerRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              dir={appLang === "ur" ? "rtl" : "ltr"}
              placeholder={
                appLang === "ur"
                  ? "اپنے دل کی بات یا پریشانی یہاں لکھیں…"
                  : "Tell me how you're feeling…"
              }
              rows={1}
              className={`min-h-[36px] max-h-32 sm:max-h-40 flex-1 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0 text-sm sm:text-base leading-snug ${
                appLang === "ur"
                  ? "font-urdu text-[1.25rem] leading-[2.3] placeholder:font-urdu placeholder:text-[1.15rem]"
                  : "text-sm sm:text-base leading-snug"
              }`}
              disabled={isLoading}
            />
            <Button
              type="button"
              size="icon"
              className="size-8 sm:size-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-transform active:scale-95"
              onClick={() => void submit(input)}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="size-3.5 sm:size-4" />
            </Button>
          </div>
          <p className={`mt-1 text-center truncate ${appLang === "ur" ? "font-urdu text-[10px] leading-loose text-muted-foreground" : "text-[10px] text-muted-foreground"}`}>
            {appLang === "ur"
              ? "تعلیمی رہنمائی۔ مستند علماء یا ڈاکٹروں کا متبادل نہیں ہے۔"
              : "Educational content. Not a substitute for qualified scholars or doctors."}
          </p>
        </div>
      </div>
    </div>
  );
}
