import { useEffect, useState } from "react";
import AgentChat from "./components/AgentChat";
import WalletPanel from "./components/WalletPanel";
import TransactionLog from "./components/TransactionLog";
import { parseInstruction, executeInstruction } from "./lib/agent";
import type { TransactionRecord } from "./lib/types";

function truncatePublicKey(publicKey: string): string {
  if (!publicKey) return "";
  if (publicKey.length <= 10) return publicKey;
  return `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`;
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 3l18 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10.58 10.58A2 2 0 0012 16a2 2 0 001.42-.58"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9.88 5.08A10.94 10.94 0 0112 5c5 0 9 4 10 7a11.6 11.6 0 01-2.1 3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.1 6.1C3.6 8.1 2 10.9 2 12c1 3 5 7 10 7 1.1 0 2.2-.2 3.2-.56"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7s-9-4-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function App() {
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [balanceDisplay, setBalanceDisplay] = useState("••••••");
  const [balanceRevealed, setBalanceRevealed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem("stellar_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("stellar_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    let cancelled = false;

    async function refreshBalance() {
      if (!publicKey) {
        setBalanceDisplay("••••••");
        return;
      }

      try {
        const { getBalance } = await import("./lib/stellar");
        const balance = await getBalance(publicKey);
        if (!cancelled) {
          setBalanceDisplay(balance);
        }
      } catch {
        if (!cancelled) {
          setBalanceDisplay("••••••");
        }
      }
    }

    refreshBalance();

    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  async function handleAgentSubmit(input: string) {
    setIsProcessing(true);
    try {
      const instruction = await parseInstruction(input);
      const result = await executeInstruction(
        instruction,
        publicKey,
        secretKey,
      );
      setTransactions((prev) => [
        { ...result, accountKey: publicKey },
        ...prev,
      ]);
    } catch (error) {
      const rejectedRecord: TransactionRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        instruction: input,
        status: "rejected",
        decision: error instanceof Error ? error.message : String(error),
        accountKey: publicKey,
      };
      setTransactions((prev) => [rejectedRecord, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="top-shimmer" />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(rgba(124,58,237,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="mx-auto flex min-h-screen max-w-7xl flex-col"
        style={{ position: "relative", zIndex: 1 }}
      >
        <header
          style={{
            padding: "24px 28px 16px",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "8px",
              }}
            >
              PAYMENT AGENT
            </p>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 500,
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              <span style={{ color: "white" }}>Stellar</span>
              <span style={{ color: "#a78bfa" }}>Agent</span>
              <span style={{ color: "white" }}> Pay</span>
            </h1>
            <p
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
              }}
            >
              Autonomous AI payments on Stellar Network
              <span
                style={{
                  background: "rgba(16,185,129,0.15)",
                  border: "0.5px solid rgba(16,185,129,0.3)",
                  color: "#10b981",
                  borderRadius: "20px",
                  padding: "2px 8px",
                  fontSize: "11px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "#10b981",
                    display: "inline-block",
                  }}
                />
                Mainnet
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-8">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 lg:hidden"
            >
              ⚙ Wallet
            </button>

            <div
              className="w-fit max-w-full min-w-0 sm:min-w-[220px]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: publicKey ? "#10b981" : "#ef4444",
                }}
              />
              <span
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}
              >
                {publicKey ? "Connected" : "Not connected"}
              </span>
              {publicKey && (
                <span className="hidden lg:block">
                  <span
                    style={{
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
                      fontSize: "12px",
                      color: "#a78bfa",
                    }}
                  >
                    {truncatePublicKey(publicKey)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </header>

        <div
          className="flex flex-col lg:flex-row"
          style={{ flex: 1, minHeight: 0 }}
        >
          <aside
            className={`${sidebarOpen ? "flex" : "hidden"} w-full border-b border-b-[rgba(124,58,237,0.2)] lg:flex lg:w-[220px] lg:border-b-0 lg:border-r lg:border-r-[rgba(124,58,237,0.2)] lg:min-h-screen`}
            style={{
              flexShrink: 0,
              padding: "16px",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <WalletPanel
              publicKey={publicKey}
              setPublicKey={setPublicKey}
              secretKey={secretKey}
              setSecretKey={setSecretKey}
            />

            <div
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "0.5px solid rgba(124,58,237,0.25)",
                borderRadius: "10px",
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  XLM balance
                </span>
                <button
                  type="button"
                  onClick={() => setBalanceRevealed((value) => !value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.55)",
                    cursor: "pointer",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  aria-label={
                    balanceRevealed ? "Hide balance" : "Reveal balance"
                  }
                >
                  <EyeIcon hidden={!balanceRevealed} />
                </button>
              </div>
              {balanceRevealed ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      color: "#a78bfa",
                    }}
                  >
                    {balanceDisplay}
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    letterSpacing: "3px",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "18px",
                  }}
                >
                  ••••••
                </span>
              )}
            </div>

            <div style={{ marginTop: "auto" }}>
              <div
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "4px",
                }}
              >
                NETWORK
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>
                    Status
                  </span>
                  <span style={{ color: "#10b981" }}>Online</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>
                    Horizon
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>
                    testnet
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <section
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div
              style={{
                borderBottom: "0.5px solid rgba(255,255,255,0.08)",
                padding: "16px 20px",
              }}
            >
              <AgentChat
                isProcessing={isProcessing}
                onSubmit={handleAgentSubmit}
              />
            </div>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                padding: "16px 20px",
                overflowY: "auto",
              }}
            >
              <TransactionLog
                transactions={transactions}
                currentAccount={publicKey}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
