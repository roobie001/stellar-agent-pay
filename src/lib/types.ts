export type AgentInstruction = {
  action: "transfer" | "check_balance" | "conditional_transfer";
  amount?: number;
  recipient?: string;
  condition?: string;
  rawInput: string;
};

export type TransactionRecord = {
  id: string;
  timestamp: string;
  instruction: string;
  status: "pending" | "success" | "failed" | "executed" | "rejected";
  from?: string;
  to?: string;
  amount?: string;
  hash?: string;
  txHash?: string;
  decision?: string;
};
