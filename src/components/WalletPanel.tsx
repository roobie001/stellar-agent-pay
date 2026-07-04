import React, { useEffect, useState } from "react";
import { connectFreighter, isFreighterInstalled } from "../lib/freighter";

type Props = {
  publicKey: string;
  setPublicKey: (k: string) => void;
  secretKey: string;
  setSecretKey: (k: string) => void;
  isFreighterConnected: boolean;
  setIsFreighterConnected: (v: boolean) => void;
};

export const WalletPanel: React.FC<Props> = ({
  publicKey,
  setPublicKey,
  secretKey,
  setSecretKey,
  isFreighterConnected,
  setIsFreighterConnected,
}) => {
  const [freighterAvailable, setFreighterAvailable] = useState<boolean | null>(
    null,
  );
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkFreighter() {
      try {
        const installed = await isFreighterInstalled();
        if (!cancelled) {
          setFreighterAvailable(installed);
        }
      } catch {
        if (!cancelled) {
          setFreighterAvailable(false);
        }
      }
    }

    checkFreighter();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleFreighterConnect() {
    setIsConnecting(true);
    try {
      const address = await connectFreighter();
      setPublicKey(address);
      setIsFreighterConnected(true);
      setShowManualEntry(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    setPublicKey("");
    setSecretKey("");
    setIsFreighterConnected(false);
    setShowManualEntry(false);
  }

  const showManualSection = !isFreighterConnected || showManualEntry;

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
        {isFreighterConnected ? (
          <>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "8px",
                padding: "8px 12px",
                background: "rgba(16,185,129,0.15)",
                border: "0.5px solid rgba(16,185,129,0.3)",
                color: "#10b981",
                fontSize: "13px",
                width: "fit-content",
              }}
            >
              ✓ Freighter Connected
            </div>
            <button
              type="button"
              onClick={handleDisconnect}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                padding: 0,
                fontSize: "12px",
                width: "fit-content",
                textAlign: "left",
              }}
            >
              Disconnect
            </button>
          </>
        ) : freighterAvailable === false ? (
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              padding: "8px 10px",
              background: "rgba(124,58,237,0.15)",
              border: "0.5px solid rgba(124,58,237,0.3)",
              color: "#c4b5fd",
              fontSize: "12px",
              textDecoration: "none",
            }}
          >
            Install Freighter ↗
          </a>
        ) : (
          <button
            type="button"
            onClick={handleFreighterConnect}
            disabled={isConnecting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              padding: "8px 10px",
              background: "rgba(124,58,237,0.2)",
              border: "0.5px solid rgba(167,139,250,0.4)",
              color: "#c4b5fd",
              fontSize: "12px",
              cursor: "pointer",
              opacity: isConnecting ? 0.7 : 1,
            }}
          >
            {isConnecting ? "Connecting..." : "Connect Freighter"}
          </button>
        )}

        {showManualSection && (
          <>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="G... your Stellar public key"
                value={publicKey}
                onChange={(e) => {
                  setIsFreighterConnected(false);
                  setPublicKey(e.target.value);
                }}
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
                onChange={(e) => {
                  setIsFreighterConnected(false);
                  setSecretKey(e.target.value);
                }}
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

              <p
                style={{ fontSize: "11px", color: "#f59e0b", marginTop: "6px" }}
              >
                ⚠ Never share your secret key with anyone.
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.45)",
                  marginTop: "-2px",
                }}
              >
                For better security, use Freighter wallet above
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPanel;
