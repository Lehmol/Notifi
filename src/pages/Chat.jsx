import { useEffect, useState, useRef } from "react";
import Header from "../components/ChatComponents/Header.jsx";
import api from "../utilities/api";
import getCsrfToken from "../utilities/csrf";
import { useAuth } from "../auth/AuthContext.jsx";

const BOT_MESSAGES = [
  "Hur står det till?",
  "Jag heter Maja, vad heter du?",
  "Kul! Berätta mer..",
];

export default function Chat() {
  const { auth } = useAuth();
  const myId = String(auth?.id ?? "");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const botIdx = useRef(0);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/messages");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.messages || [];
      setMessages(data);
    } catch (e) {
      console.error("Kunde inte hämta meddelanden");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || sending) return;

    setSending(true);
    const tempId = `temp_${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: tempId, text: msg, userId: myId, isBot: false, temp: true },
    ]);
    setText("");

    try {
      const csrfToken = await getCsrfToken();
      const { data } = await api.post("/messages", { text: msg, csrfToken });

      const created = data?.latestMessage ?? data ?? {};
      const saved = {
        id: created.id ?? created._id ?? created.msgId ?? tempId,
        text: created.text ?? msg,
        userId: String(created.userId ?? myId),
        isBot: Boolean(created.isBot ?? false),
        temp: false,
      };

      setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            text: BOT_MESSAGES[botIdx.current++ % BOT_MESSAGES.length],
            userId: "bot",
            isBot: true,
          },
        ]);
      }, 1000);
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      console.error("Kunde inte skicka meddelande");
    } finally {
      setSending(false);
    }
  };

  const deleteMessageServer = async (id) => {
    const before = messages;
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      const csrfToken = await getCsrfToken();
      await api.delete(`/messages/${id}`, { data: { csrfToken } });
    } catch (e) {
      setMessages(before);
      console.error("Kunde inte radera meddelande");
    }
  };

  return (
    <div>
      <Header />
      <div className="chat-container">
        <div className="chat-wrap">
          <ul className="chat-list">
            {messages.map((m) => {
              const mine = !m.isBot && String(m.userId) === myId;
              return (
                <li key={m.id} className={`bubble ${mine ? "right" : "left"}`}>
                  <div
                    className="bubble-text"
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                  {mine && m.id && !m.temp && !m.isBot && (
                    <button
                      className="del"
                      onClick={() => deleteMessageServer(m.id)}
                      aria-label="Delete"
                      title="Delete message"
                    >
                      X
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <form className="composer" onSubmit={sendMessage}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv ett meddelande..."
              autoComplete="off"
            />
            <button disabled={sending || text.trim().length === 0}>
              {sending ? "Skickar…" : "Skicka"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
