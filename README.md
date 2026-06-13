# CasperAgent Pay

> Autonomous AI payment agent on Casper Network

CasperAgent Pay lets users execute CSPR transactions using plain English instructions. Powered by Groq LLaMA for intent parsing and casper-js-sdk v5 for onchain execution.

## Demo

[Demo Video](https://youtu.be/RJjepOluS9g) | [Live App](https://casper-agent-pay.vercel.app/)

## What It Does

Users type natural language payment instructions and the AI agent autonomously:

- Parses the intent (balance check, transfer, conditional transfer)
- Evaluates any conditions against real wallet state
- Executes the transaction on Casper Network
- Logs every decision with tx hash and timestamp

### Example Instructions

- `check my balance` → queries CSPR balance
- `transfer 50 CSPR to 0202...` → executes direct transfer
- `pay only if my balance is above 100 CSPR` → conditional payment

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Frontend   | React + TypeScript + Vite + Tailwind CSS |
| AI Agent   | Groq LLaMA 3.1 8B Instant                |
| Blockchain | casper-js-sdk v5 + Casper Testnet        |
| Backend    | Node.js + Express (proxy server)         |
| Deploy     | Vercel                                   |

## Architecture

User Input → Groq LLaMA (parse intent) → AgentInstruction

AgentInstruction → casper-js-sdk (execute) → TransactionRecord

TransactionRecord → UI (logged with tx hash)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/roobie001/casper-agent-pay
cd casper-agent-pay

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run dev server + proxy
npm run dev
```

## Environment Variables

```env
VITE_CASPER_RPC=https://rpc.testnet.casperlabs.io/rpc
VITE_CASPER_NETWORK=casper-test
GROQ_API_KEY=your_groq_api_key
```

## Hackathon

Built for the **Casper Agentic Buildathon 2026** .

Tags: Agentic AI · DeFi · Real-World Assets · Casper Network · x402

## Builder

**Cajetan Obiajulu** — Final year CS student at UNN, building at the intersection of AI and Web3.

GitHub: [@roobie001](https://github.com/roobie001)
