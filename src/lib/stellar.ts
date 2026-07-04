import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");

export async function getBalance(publicKey: string): Promise<string> {
  if (!publicKey || publicKey.length < 10)
    throw new Error("Invalid public key");
  const account = await server.loadAccount(publicKey);
  const xlmBalance = account.balances.find(
    (b: any) => b.asset_type === "native",
  );
  const amount = parseFloat(xlmBalance?.balance ?? "0");
  return `${amount.toLocaleString()} XLM`;
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

export default { getBalance, sendTransfer };
