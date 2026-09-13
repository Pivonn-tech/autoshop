import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  ts: Date;
}

// ── Suggested prompts ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What trucks do you have under KSh 3M?",
  "I need brake pads for a Toyota Hilux 2019",
  "How often should I service my diesel engine?",
  "What's the difference between OEM and aftermarket parts?",
  "Book me a service appointment for next week",
  "Which motorcycles are good for Nairobi traffic?",
];

// ── Canned responses (placeholder until backend AI is wired) ───────────────────
function getReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("truck") || q.includes("lorry")) {
    return "We currently have several commercial trucks in stock — Isuzu NQR, Mitsubishi Canter, and a Hino 300 series. All are inspected and ready for the road. Would you like me to filter by payload capacity or budget?";
  }
  if (q.includes("brake") || q.includes("pad")) {
    return "For a Toyota Hilux 2019 (2.8L diesel), we stock Akebono and TRW front brake pad sets at KSh 4,200–6,800. Rear drums are also available. Shall I add a set to your cart, or would you prefer we fit them during a workshop visit?";
  }
  if (q.includes("service") || q.includes("oil") || q.includes("interval")) {
    return "For most diesel engines in Kenyan conditions (dusty roads, stop-start Nairobi traffic), we recommend an oil and filter change every 5,000 km or 3 months — whichever comes first. Full service intervals depend on your vehicle's make and model. What are you driving?";
  }
  if (q.includes("oem") || q.includes("aftermarket")) {
    return "OEM parts come directly from the vehicle manufacturer or their approved suppliers — guaranteed fitment and quality. Aftermarket parts are made by third parties and vary widely in quality. We stock only OEM-grade or tested aftermarket alternatives and back every part with a 30-day guarantee.";
  }
  if (q.includes("book") || q.includes("appointment")) {
    return "I can help with that! Our workshop is typically available Mon–Sat. To confirm a slot I'll need your name, vehicle details, and preferred date. Alternatively, use our booking page for instant confirmation: /appointments";
  }
  if (q.includes("motorcycle") || q.includes("motorbike") || q.includes("boda")) {
    return "For Nairobi traffic, our most popular picks are the Honda CB125F (reliable, low fuel cost) and the TVS Apache (sportier feel, good resale). If you're doing deliveries, the Bajaj Boxer is hard to beat. Budget range?";
  }
  return "Thanks for your question! Our team is best placed to give you an accurate answer. You can also reach us on 0743 645 366 or visit our workshop in Industrial Area. Is there anything else I can help you find on the site?";
}

// ── Sparkle icon ───────────────────────────────────────────────────────────────
function SparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" opacity="0.9"/>
      <path d="M19 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" opacity="0.7"/>
      <path d="M5 17l.5 1.5 1.5.5-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" opacity="0.6"/>
    </svg>
  );
}

// ── Chat bubble ────────────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            flexShrink: 0,
            marginRight: 10,
            marginTop: 2,
            boxShadow: "0 2px 8px rgba(109,40,217,0.35)",
          }}
        >
          <SparkleIcon size={15} />
        </div>
      )}
      <div
        style={{
          maxWidth: "75%",
          padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
          background: isUser
            ? "linear-gradient(135deg, #0F2A4A 0%, #1a3a5c 100%)"
            : "var(--surface)",
          color: isUser ? "white" : "var(--text)",
          fontSize: "0.9375rem",
          lineHeight: 1.65,
          border: isUser ? "none" : "1px solid var(--border)",
          boxShadow: isUser
            ? "0 2px 12px rgba(15,42,74,0.25)"
            : "var(--shadow-sm)",
        }}
      >
        {msg.text}
        <div
          style={{
            fontSize: "0.72rem",
            color: isUser ? "rgba(255,255,255,0.45)" : "var(--text-muted)",
            marginTop: 6,
            textAlign: "right",
          }}
        >
          {msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
      {isUser && (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            flexShrink: 0,
            marginLeft: 10,
            marginTop: 2,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div
        style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(109,40,217,0.35)",
        }}
      >
        <SparkleIcon size={15} />
      </div>
      <div
        style={{
          padding: "12px 18px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "4px 18px 18px 18px",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#7c3aed",
              opacity: 0.7,
              display: "inline-block",
              animation: `typing-dot 1.2s ${i * 0.2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hi! I'm AutoFix Kenya's AI assistant. I can help you find the right vehicle, source parts, book a service, or answer questions about your car. What can I help you with today?",
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate network latency
    setTimeout(() => {
      const reply = getReply(trimmed);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: reply, ts: new Date() },
      ]);
    }, 900 + Math.random() * 600);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      <Head>
        <title>AI Assistant — AutoFix Kenya</title>
        <meta name="description" content="Ask our AI assistant anything about vehicles, parts, and workshop services." />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Page header ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #091e33 0%, #0F2A4A 60%, #1a3a5c 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "36px 0 32px",
          }}
        >
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>AI Assistant</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  flexShrink: 0,
                  boxShadow: "0 4px 20px rgba(109,40,217,0.45)",
                  position: "relative",
                }}
              >
                <SparkleIcon size={26} />
                {/* Online dot */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -3,
                    right: -3,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "2.5px solid #091e33",
                  }}
                />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "white",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  AutoFix AI Assistant
                </h1>
                <p style={{ color: "rgba(255,255,255,0.55)", margin: "4px 0 0", fontSize: "0.875rem" }}>
                  Powered by AutoFix Kenya · Vehicles, Parts & Workshop help
                </p>
              </div>
              {/* Beta badge */}
              <div
                style={{
                  marginLeft: "auto",
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(109,40,217,0.25)",
                  border: "1px solid rgba(109,40,217,0.5)",
                  color: "#c4b5fd",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Beta
              </div>
            </div>
          </div>
        </div>

        {/* ── Chat area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 16px" }}>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "32px 0 8px",
              overflowY: "auto",
            }}
          >
            {messages.map((m) => <Bubble key={m.id} msg={m} />)}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (shown only before user sends first message) */}
          {messages.length === 1 && (
            <div style={{ paddingBottom: 16 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                Try asking…
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 999,
                      border: "1.5px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--text-secondary)",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 180ms ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed";
                      (e.currentTarget as HTMLElement).style.color = "#7c3aed";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              background: "var(--bg)",
              paddingBlock: "16px 24px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                borderRadius: 14,
                padding: "10px 10px 10px 16px",
                transition: "border-color 180ms ease",
              }}
              onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed"}
              onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about vehicles, parts, bookings…"
                rows={1}
                style={{
                  flex: 1,
                  resize: "none",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                  maxHeight: 120,
                  overflow: "auto",
                }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                aria-label="Send message"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: "none",
                  background: input.trim() && !typing
                    ? "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)"
                    : "var(--surface-2, #e5e7eb)",
                  color: input.trim() && !typing ? "white" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() && !typing ? "pointer" : "default",
                  transition: "all 180ms ease",
                  flexShrink: 0,
                  boxShadow: input.trim() && !typing ? "0 2px 8px rgba(109,40,217,0.4)" : "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
              Responses are AI-generated. Always confirm critical details with our team at{" "}
              <a href="tel:+254743645366" style={{ color: "var(--amber)", textDecoration: "none" }}>0743 645 366 / 0719 233 626</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
