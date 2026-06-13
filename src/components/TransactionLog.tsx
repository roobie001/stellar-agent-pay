import React from "react";
import type { TransactionRecord } from "../lib/types";

type Props = {
  transactions: TransactionRecord[];
};

function getActionIcon(instruction: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes("transfer") || lower.includes("send")) return "💰";
  if (lower.includes("check") || lower.includes("balance")) return "🔍";
  if (lower.includes("if") && lower.includes("balance")) return "⚡";
  return "📋";
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

function truncateTxHash(hash: string): string {
  if (!hash || hash.length <= 16) return hash;
  return `${hash.slice(0, 16)}...`;
}

export const TransactionLog: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="space-y-4 text-white">
      <div>
        <h3 className="text-xl font-semibold text-white mb-1">
          Transaction Log
        </h3>
        <p className="text-sm text-gray-400">
          Recent agent actions and decisions.
        </p>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-700 bg-gray-900/30 p-8 text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm text-gray-400 font-medium">
              No transactions yet
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Submit an instruction to get started
            </p>
          </div>
        ) : (
          transactions.map((record) => (
            <div
              key={record.id}
              className="rounded-lg border border-gray-800 bg-gray-900/40 p-4 hover:bg-gray-900/60 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl mt-0.5 flex-shrink-0">
                    {getActionIcon(record.instruction)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 font-medium">
                      {formatTimestamp(record.timestamp)}
                    </p>
                    <p className="text-sm text-white mt-1 break-words">
                      {record.instruction}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap ${
                    record.status === "executed"
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {record.status === "executed" ? "✓ Executed" : "✕ Rejected"}
                </span>
              </div>

              {record.decision && (
                <div className="mt-3 rounded-lg bg-gray-950/50 px-3 py-2 text-xs text-gray-300 border border-gray-800">
                  <span className="text-gray-500 font-medium">Decision: </span>
                  {record.decision}
                </div>
              )}

              {record.txHash && (
                <div className="mt-3">
                  <a
                    href={`https://testnet.cspr.live/deploy/${record.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-orange-400 hover:text-orange-300 font-mono hover:underline transition"
                  >
                    Deploy: {truncateTxHash(record.txHash)}
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionLog;
