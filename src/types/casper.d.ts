interface CasperWalletProvider {
  requestConnection: () => Promise<void>;
  getActivePublicKey: () => Promise<string>;
  sign: (deployJson: any, publicKey: string) => Promise<any>;
}

declare global {
  interface Window {
    casperWalletProvider?: CasperWalletProvider;
  }
}

export {};
