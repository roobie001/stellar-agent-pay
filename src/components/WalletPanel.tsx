import React from "react";

type Props = {
  publicKey: string;
  setPublicKey: (k: string) => void;
  secretKey: string;
  setSecretKey: (k: string) => void;
};

export const WalletPanel: React.FC<Props> = ({
  publicKey,
  setPublicKey,
  secretKey,
  setSecretKey,
}) => {
  return (
    <div>
      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.3)",
          marginBottom: "4px",
        }}
      >
        WALLET
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="G... your Stellar public key"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "8px 10px",
            fontSize: "12px",
            color: "white",
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
          }}
        />

        <input
          type="password"
          placeholder="S... your Stellar secret key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "8px 10px",
            fontSize: "12px",
            color: "white",
          }}
        />

        <p style={{ fontSize: "11px", color: "#f59e0b", marginTop: "6px" }}>
          ⚠ Never share your secret key with anyone.
        </p>
      </div>
    </div>
  );
};

export default WalletPanel;
