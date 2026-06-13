export async function getBalance(publicKeyHex: string): Promise<string> {
  // Mock for local dev — replace with real RPC when network is available
  if (!publicKeyHex || publicKeyHex.length < 10) {
    throw new Error("Invalid public key");
  }
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Return a realistic mock balance
  return "2500.5";
}

export async function sendTransfer({
  from,
  to,
  amount,
}: {
  from: string;
  to: string;
  amount: number;
  privateKeyPem?: string;
}): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  // Return a mock tx hash
  const mockHash = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
  return mockHash;
}

export default { getBalance, sendTransfer };
