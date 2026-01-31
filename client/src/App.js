import { useState, useRef, useEffect } from "react";

export default function App() {

  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = async () => {

    if (!input.trim()) return;

    setChat(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://zyra-ai-jj1l.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setChat(prev => [...prev, { role: "bot", text: data.reply }]);

    } catch {
      setChat(prev => [...prev, { role: "bot", text: "Connection error" }]);
    }

    setLoading(false);
  };

  return (
    <div className="page">

      <div className="card">

        <div className="top">ZYRA AI</div>

        <div className="messages">

          {chat.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === "zyra" && <span className="avatar">🤖</span>}
              {m.text}
            </div>
          ))}

          {loading && <div className="msg bot">🤖 Thinking....</div>}

          <div ref={bottomRef}></div>

        </div>

        <div className="bar">

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask ZYRA..."
            onKeyDown={e => e.key === "Enter" && send()}
          />

          <button onClick={send}>➤</button>

        </div>

      </div>

    </div>
  );
}
