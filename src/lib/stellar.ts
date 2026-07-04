import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");

export async function getBalance(publicKey: string): Promise<string> {
  if (!publicKey || publicKey.length < 10)
    throw new Error("Invalid public key");
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
      (b: any) => b.asset_type === "native",
    );
    const amount = parseFloat(xlmBalance?.balance ?? "0");
    return `${amount.toLocaleString()} XLM`;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return "Account not found. Verify via your Stellar wallet.";
    }

    throw error;
  }
}

export async function sendTransfer({
  from,
  to,
  amount,
  secretKey,
}: {
  from: string;
  to: string;
  amount: number;
  secretKey: string;
}): Promise<string> {
  const account = await server.loadAccount(from);
  const fee = await server.fetchBaseFee();
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: to,
        asset: StellarSdk.Asset.native(),
        amount: amount.toFixed(7),
      }),
    )
    .setTimeout(30)
    .build();
  transaction.sign(StellarSdk.Keypair.fromSecret(secretKey));
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

export async function sendTransferWithFreighter({
  from,
  to,
  amount,
}: {
  from: string;
  to: string;
  amount: number;
}): Promise<string> {
  const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
  const account = await server.loadAccount(from);
  const fee = await server.fetchBaseFee();

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: to,
        asset: StellarSdk.Asset.native(),
        amount: amount.toFixed(7),
      }),
    )
    .setTimeout(30)
    .build();

  const { signAndSubmitTransaction } = await import("./freighter");
  return await signAndSubmitTransaction(transaction, "MAINNET");
}

export default { getBalance, sendTransfer, sendTransferWithFreighter };
