import React, { useState } from "react";

type Props = {
  isProcessing: boolean;
  onSubmit: (input: string) => void;
};

export const AgentChat: React.FC<Props> = ({ isProcessing, onSubmit }) => {
  const [input, setInput] = useState("");

  const prompts = [
    "check my balance",
    "transfer 50 CSPR to...",
    "pay only if balance > 100",
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
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Agent Chat</h2>
        <p className="text-sm text-gray-400">
          Submit a natural language instruction and let the AI agent decide what
          to do.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handlePromptClick(prompt)}
            className="px-3 py-2 rounded-full bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600 text-xs font-medium transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Instruction
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. transfer 10 CSPR to 0202..."
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 disabled:opacity-50"
            disabled={isProcessing}
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default AgentChat;
