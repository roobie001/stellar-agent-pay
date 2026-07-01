import React from "react";
import type { TransactionRecord } from "../lib/types";

type Props = {
  transactions: TransactionRecord[];
  currentAccount: string;
};

function truncatePublicKey(value: string): string {
  if (!value) return "";
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function truncateHash(value: string): string {
  if (!value) return "";
  if (value.length <= 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function getActionLabel(instruction: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes("if") && lower.includes("balance"))
    return "Conditional transfer";
  if (lower.includes("check") || lower.includes("balance"))
    return "Balance check";
  return "Transfer";
}

function formatInstruction(instruction: string): string {
  return instruction.replace(/G[A-Z0-9]{55,56}/g, (match) =>
    truncatePublicKey(match),
  );
}

function _getActionIcon(instruction: string): string {
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

export const TransactionLog: React.FC<Props> = ({
  transactions,
  currentAccount,
}) => {
  // Filter transactions safely based on the currently connected account
  const filteredTransactions = transactions.filter((tx) => {
    // Fallback: If a record doesn't have an accountKey yet (old logs),
    // let it show up so your history doesn't abruptly disappear.
    if (!tx.accountKey) return true;

    return tx.accountKey === currentAccount;
  });

  return (
    <div
      className="text-white"
      style={{ overflowY: "auto", maxHeight: "calc(100vh - 280px)" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}>
          Transaction log
        </h3>
        <span
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "2px 8px",
            fontSize: "11px",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {filteredTransactions.length}
        </span>
      </div>

      <div className="pr-2 space-y-2">
        {filteredTransactions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="text-xs mt-1">Submit an instruction to get started</p>
          </div>
        ) : (
          filteredTransactions.map((record) => (
            <div
              key={record.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.45)",
                      marginBottom: "4px",
                    }}
                  >
                    {getActionLabel(record.instruction)}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "white",
                    }}
                  >
                    {formatInstruction(record.instruction)}
                  </div>
                </div>
                <span
                  style={{
                    background:
                      record.status === "executed"
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(239,68,68,0.15)",
                    border: `0.5px solid ${record.status === "executed" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: record.status === "executed" ? "#10b981" : "#ef4444",
                    borderRadius: "20px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {record.status === "executed" ? "Executed" : "Rejected"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}
                >
                  {formatTimestamp(record.timestamp)}
                </span>

                {record.status === "executed" && record.txHash && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${record.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "11px",
                      color: "#a78bfa",
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
                    }}
                  >
                    {truncateHash(record.txHash)}
                  </a>
                )}

                {record.status === "executed" && record.decision && (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#a78bfa",
                    }}
                  >
                    {record.decision}
                  </span>
                )}

                {record.status === "rejected" && record.decision && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {record.decision}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionLog;
