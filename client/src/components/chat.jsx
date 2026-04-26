import { useState } from "react";
import neutralMonkey from "../assets/neutral-monkey.png";
import happyMonkey from "../assets/happy-monkey.png";

export default function Assistant({ chatList, setChatList }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setChatList([...chatList, { from: "user", message: inputValue }]);
    setInputValue("");
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            width: "320px",
            height: "400px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            zIndex: 1000,
          }}
        >
          <h4>Assistant</h4>
          <div className="chat-message-box">
            {chatList.map((message, index) => (
              <div key={index}>
                {message.from === "assistant" ? (
                  <p className="asst-message">{message.message}</p>
                ) : (
                  <p className="user-message">{message.message}</p>
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
