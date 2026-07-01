import { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { chat } from "../api/ai";
import "../styles/chatWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Bonjour ! Je suis votre assistant pédagogique. Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const { response } = await chat(text);
      setMessages((prev) => [...prev, { role: "assistant", text: response || "..." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Désolé, une erreur est survenue." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} title="Assistant IA">
        {open ? <FaTimes /> : <FaRobot />}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <FaRobot /> Assistant IA
          </div>

          <div className="chat-panel-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
            ))}
            {loading && <div className="chat-bubble assistant">...</div>}
          </div>

          <form className="chat-panel-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
