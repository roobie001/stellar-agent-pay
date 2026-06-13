import type { AgentInstruction, TransactionRecord } from "./types";
import { getBalance, sendTransfer } from "./casper";

function parseInstructionMock(input: string): AgentInstruction {
  const lower = input.toLowerCase();
  // Simple dev-mode heuristics
  if (lower.includes("balance") || lower.includes("check")) {
    return { action: "check_balance", rawInput: input };
  }
  if (lower.includes("transfer") || lower.includes("send")) {
    // Try to extract amount and recipient (basic parsing)
    const amountMatch = input.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    // Extract hex key (simple heuristic: 64-char hex string)
    const keyMatch = input.match(/([0-9a-f]{64})/i);
    const recipient = keyMatch ? keyMatch[1] : "";
    return { action: "transfer", amount, recipient, rawInput: input };
  }
  if (lower.includes("if") && lower.includes("balance")) {
    // Conditional transfer
    const amountMatch = input.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    const keyMatch = input.match(/([0-9a-f]{64})/i);
    const recipient = keyMatch ? keyMatch[1] : "";
    return {
      action: "conditional_transfer",
      amount,
      recipient,
      condition: "balance > 100",
      rawInput: input,
    };
  }
  return { action: "check_balance", rawInput: input };
}

export async function parseInstruction(
  input: string,
): Promise<AgentInstruction> {
  try {
    const response = await fetch("http://localhost:3001/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `You are a payment agent for the Casper blockchain. Parse the user's natural language instruction and return ONLY a JSON object with this exact shape:
{
  "action": "transfer" | "check_balance" | "conditional_transfer",
  "amount": number (in CSPR, optional),
  "recipient": string (Casper public key hex, optional),
  "condition": string (e.g. "balance > 100", optional),
  "rawInput": string (original user input)
}
Return only valid JSON. No explanation. No markdown.`,
          },
          { role: "user", content: input },
        ],
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    try {
      return JSON.parse(text) as AgentInstruction;
    } catch {
      return { action: "check_balance", rawInput: input };
    }
  } catch (err) {
    console.warn("AI endpoint unreachable, using dev mode parser", err);
    return parseInstructionMock(input);
  }
}

function evaluateCondition(condition: string, balance: number): boolean {
  const normalized = condition.trim().toLowerCase();
  const match = normalized.match(
    /balance\s*(>=|<=|==|===|!=|!==|>|<)\s*([0-9]+(?:\.[0-9]+)?)/,
  );
  if (!match) return false;

  const operator = match[1];
  const threshold = Number(match[2]);
  switch (operator) {
    case ">":
      return balance > threshold;
    case "<":
      return balance < threshold;
    case ">=":
      return balance >= threshold;
    case "<=":
      return balance <= threshold;
    case "==":
    case "===":
      return balance === threshold;
    case "!=":
    case "!==":
      return balance !== threshold;
    default:
      return false;
  }
}

export async function executeInstruction(
  instruction: AgentInstruction,
  publicKey: string,
): Promise<TransactionRecord> {
  const id = Date.now().toString();
  const timestamp = new Date().toISOString();
  const rawInstruction = instruction.rawInput;

  if (instruction.action === "check_balance") {
    const balance = await getBalance(publicKey);
    return {
      id,
      timestamp,
      instruction: rawInstruction,
      status: "executed",
      decision: String(balance),
    };
  }

  if (instruction.action === "transfer") {
    const tx = await sendTransfer({
      from: publicKey,
      to: instruction.recipient ?? "",
      amount: instruction.amount ?? 0,
    });

    return {
      id,
      timestamp,
      instruction: rawInstruction,
      status: "executed",
      txHash: String((tx as any).hash ?? (tx as any).deployHash ?? ""),
    };
  }

  if (instruction.action === "conditional_transfer") {
    const balanceRaw = await getBalance(publicKey);
    const balance = Number(balanceRaw);

    if (!instruction.condition) {
      return {
        id,
        timestamp,
        instruction: rawInstruction,
        status: "rejected",
        decision: "No condition provided for conditional_transfer.",
      };
    }

    const passes = evaluateCondition(instruction.condition, balance);
    if (!passes) {
      return {
        id,
        timestamp,
        instruction: rawInstruction,
        status: "rejected",
        decision: `Condition not met: ${instruction.condition} with balance ${balance}`,
      };
    }

    const tx = await sendTransfer({
      from: publicKey,
      to: instruction.recipient ?? "",
      amount: instruction.amount ?? 0,
    });

    return {
      id,
      timestamp,
      instruction: rawInstruction,
      status: "executed",
      txHash: String((tx as any).hash ?? (tx as any).deployHash ?? ""),
    };
  }

  return {
    id,
    timestamp,
    instruction: rawInstruction,
    status: "rejected",
    decision: "Unsupported action.",
  };
}

export default parseInstruction;
