import { useState } from "react";
import AgentChat from "./components/AgentChat";
import WalletConnect from "./components/WalletConnect";
import TransactionLog from "./components/TransactionLog";
import { parseInstruction, executeInstruction } from "./lib/agent";
import type { TransactionRecord } from "./lib/types";

function App() {
  const [publicKey, setPublicKey] = useState("");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleAgentSubmit(input: string) {
    setIsProcessing(true);
    try {
      const instruction = await parseInstruction(input);
      const result = await executeInstruction(instruction, publicKey);
      setTransactions((prev) => [result, ...prev]);
    } catch (error) {
      const rejectedRecord: TransactionRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        instruction: input,
        status: "rejected",
        decision: error instanceof Error ? error.message : String(error),
      };
      setTransactions((prev) => [rejectedRecord, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-[0.32em] text-gray-500 mb-2">
            Payment Agent
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-gray-300 to-orange-600 bg-clip-text text-transparent mb-2">
            CasperAgent Pay
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-400">
            Autonomous AI payment agent on Casper Network
          </p>
        </header>

        <div className="space-y-3 mb-8">
          <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 font-medium text-sm flex items-start gap-2">
            <span className="text-lg">⚠</span>
            <span>
              Dev Mode — Casper RPC mocked. Real transactions disabled.
            </span>
          </div>
          {!publicKey && (
            <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 p-4 font-medium text-sm flex items-start gap-2">
              <span className="text-lg">🔑</span>
              <span>
                Connect your wallet to get started — paste your Casper testnet
                public key below.
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <WalletConnect
                publicKey={publicKey}
                setPublicKey={setPublicKey}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 lg:w-2/3">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <AgentChat
                isProcessing={isProcessing}
                onSubmit={handleAgentSubmit}
              />
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <TransactionLog transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
