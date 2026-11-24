import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CANNED_REPLIES } from "../data/mockData";

const WORKER_URL = import.meta.env.VITE_CHAT_WORKER_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm The Mechanic AI. What's going on with your car, or what service are you looking for? 🚗" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const getFallbackReply = () => {
    const text = CANNED_REPLIES[replyIdx % CANNED_REPLIES.length];
    setReplyIdx((i) => i + 1);
    return text;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;

    const updatedMessages = [...messages, { from: "user", text }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);

    try {
      if (!WORKER_URL) {
        await new Promise((r) => setTimeout(r, 700));
        setMessages((m) => [...m, { from: "ai", text: getFallbackReply() }]);
        return;
      }

      const payloadMessages = updatedMessages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) throw new Error("Worker response not ok");
      const data = await res.json();
      setMessages((m) => [...m, { from: "ai", text: data.reply || getFallbackReply() }]);
    } catch {
      setMessages((m) => [...m, { from: "ai", text: getFallbackReply() }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-2xl shadow-lg shadow-orange-500/40 transition-colors"
        aria-label="Open chat"
      >
        {open ? "✕" : "💬"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[calc(100vw-2.5rem)] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-orange-500 px-4 py-3 flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-white font-semibold text-sm">The Mechanic AI</p>
                <p className="text-orange-100 text-xs">Powered by Cloudflare Workers AI</p>
              </div>
            </div>
            <div className="h-72 overflow-y-auto p-3 space-y-2 bg-neutral-950">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    m.from === "user" ? "bg-orange-500 text-white rounded-br-sm" : "bg-neutral-800 text-neutral-100 rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 px-3 py-2 rounded-xl rounded-bl-sm">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="p-3 border-t border-neutral-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your question..."
                className="flex-1 bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button onClick={send} className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-lg text-sm">➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}