import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "YOUR_API_KEY";

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `YOUR_API_URL${API_KEY}`,
        { contents: [{ parts: [{ text: userMsg.text }] }] },
        { headers: { "Content-Type": "application/json" } }
      );

      const botText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No reply received.";
      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]); // remove all messages
  }

  return (
    <div className="chat-wrapper">
      <header className="chat-header">
        <span>ChatGPT</span>

        <button className="clear-btn" onClick={clearChat}>
          Clear Chat
        </button>
      </header>

      <main className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="message bot">Thinking…</div>}
      </main>

      <footer className="input-area">
        <input
          className="chat-input"
          type="text"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </footer>
    </div>
  );
}
