import React, { useState } from "react";

type Props = {
  isProcessing: boolean;
  onSubmit: (input: string) => void;
};

export const AgentChat: React.FC<Props> = ({ isProcessing, onSubmit }) => {
  const [input, setInput] = useState("");

  const prompts = [
    "check my XLM balance",
    "send 10 XLM to G...",
    "pay only if balance > 100 XLM",
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSubmit(input.trim());
    setInput("");
  }

  function handlePromptClick(prompt: string) {
    setInput(prompt);
  }

  return (
    <div className="text-white">
      <div
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "12px",
        }}
      >
        What do you want to do?
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handlePromptClick(prompt)}
            type="button"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "0.5px solid rgba(124,58,237,0.3)",
              color: "#c4b5fd",
              borderRadius: "999px",
              padding: "4px 12px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. send 10 XLM to G..."
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "0.5px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "white",
            }}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing}
            style={{
              background: "linear-gradient(90deg, #7c3aed, #6d28d9)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            {isProcessing ? "⟳ Processing..." : "✦ Execute"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentChat;
