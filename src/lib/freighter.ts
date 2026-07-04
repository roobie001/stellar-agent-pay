import freighterApi from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

export async function isFreighterInstalled(): Promise<boolean> {
  const { isConnected, error } = await freighterApi.isConnected();
  if (error) throw new Error(String(error));
  return isConnected;
}

export async function connectFreighter(): Promise<string> {
  const { isConnected: connected, error: connectedError } =
    await freighterApi.isConnected();
  if (connectedError) throw new Error(String(connectedError));
  if (!connected) {
    throw new Error(
      "Freighter wallet not installed. Please install it from https://www.freighter.app/",
    );
  }
  const { address, error } = await freighterApi.requestAccess();
  if (error) throw new Error(error);
  return address;
}

export async function signAndSubmitTransaction(
  transaction: StellarSdk.Transaction,
  network: "MAINNET" | "TESTNET" = "MAINNET",
): Promise<string> {
  const networkPassphrase =
    network === "MAINNET"
      ? StellarSdk.Networks.PUBLIC
      : StellarSdk.Networks.TESTNET;

  const { signedTxXdr, error } = await freighterApi.signTransaction(
    transaction.toXDR(),
    { networkPassphrase },
  );

  if (error) throw new Error(error);

  const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedTxXdr,
    networkPassphrase,
  );

  const result = await server.submitTransaction(signedTx);
  return result.hash;
}
