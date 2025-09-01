import Header from "../components/ChatComponents/Header.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { escapeHtml } from "../utilities/sanitize.js";
import { botReply } from "../utilities/bot.js";

export default function Chat() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const myUser = auth.user;
  const otherUser = "Maja";

  const [messages, setMessages] = useState([
    { user: otherUser, text: "Hej! Jag heter Maja. Hur mår du?" },
  ]);
  const [text, setText] = useState("");

  const canSend = text.trim().length > 0;

  function deleteMessage(indexToRemove) {
    setMessages((prev) => prev.filter((_, i) => i !== indexToRemove));
  }
  async function sendMessage(e) {
    e?.preventDefault?.();
    const userClean = escapeHtml(text.trim());
    if (!userClean) return;

    setMessages((prev) => [...prev, { user: myUser, text: userClean }]);
    setText("");

    try {
      const botText = await botReply(userClean);
      const botClean = escapeHtml(botText);
      setMessages((prev) => [...prev, { user: otherUser, text: botClean }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          user: otherUser,
          text: "Någonting fick fel, försök skriva något igen.",
        },
      ]);
    }
  }

  return (
    <div>
      <Header />
      <div className="chat-container">
        <div className="chat-wrap">
          <ul className="chat-list">
            {messages.map((m, i) => {
              const mine = m.user === myUser;
              return (
                <li key={i} className={`bubble ${mine ? "right" : "left"}`}>
                  <div
                    className="bubble-text"
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                  <button
                    className="del"
                    onClick={() => deleteMessage(i)}
                    aria-label="Delete"
                    title="Delete message"
                  >
                    {" "}
                    X{" "}
                  </button>
                </li>
              );
            })}
          </ul>

          <form className="composer" onSubmit={sendMessage}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeHolder="Skriv ett meddelande..."
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
              }}
            />
            <button disabled={!canSend}>Skicka</button>
          </form>
        </div>
      </div>
    </div>
  );
}
