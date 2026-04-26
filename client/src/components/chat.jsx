import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import neutralMonkey from "../assets/neutral-monkey.png";
import happyMonkey from "../assets/happy-monkey.png";


export default function Assistant({ chatList, Colors, setChatList }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setChatList((prev) => [...prev, { from: "user", message: inputValue }]);
    setChatList((prev) => [
      ...prev,
      { from: "assistant", message: ". . .", pending: true },
    ]);
    setInputValue("");
    const response = await fetch("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: inputValue }),
    });
    const data = await response.json();
    setChatList((prev) => [
      ...prev.filter((m) => !m.pending),
      { from: "assistant", message: data.response },
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  return (
    <>
      {isOpen && (
        <div className="chat-box">
          <h4>Assistant</h4>
          <div className="chat-message-box">
            {chatList.map((message, index) => (
              <div key={index}>
                {message.from === "assistant" ? (
                  <div className="asst-message">
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="user-message">
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <div ref={bottomRef} />
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-monkey-button"
      >
        <img
          src={isOpen ? happyMonkey : neutralMonkey}
          alt="chat"
          className="chat-monkey-img"
        />
      </button>
    </>
  );
}
