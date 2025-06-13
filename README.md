# x402 Payments Backend Example

This repository contains a simple backend server built with Express and TypeScript that demonstrates how to integrate [x402](https://x402.com) payments.

The server exposes a `/protected` endpoint that requires an on-chain payment to access.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- An EVM-compatible wallet address to receive payments.

## Getting Started

### 1. Clone the repository

If you haven't cloned it, do so. Otherwise, proceed to the next step.

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project by copying the example:

```bash
cp .env.example .env
```

Now, open the `.env` file and add your EVM-compatible wallet address:

```
# .env

# Your EVM-compatible wallet address to receive payments
# Example: "0x1234567890123456789012345678901234567890"
RECIPIENT_ADDRESS="YOUR_WALLET_ADDRESS"

# The port the server will run on (optional, defaults to 4020)
# PORT=4020
```

Replace `YOUR_WALLET_ADDRESS` with your actual wallet address.

### 4. Run the Server

You can run the server in development mode, which will automatically restart on file changes:

```bash
npm run dev
```

The server will start on port 4020 (or the port you specified in `.env`).

For production, first build the TypeScript code:

```bash
npm run build
```

Then run the compiled JavaScript:

```bash
npm start
```

## Testing the Payment Flow

Once the server is running, you can test the protected endpoint using `curl`:

```bash
curl -v http://localhost:4020/protected
```

Because you haven't provided a payment, the server will respond with an `HTTP/1.1 402 Payment Required` status code. The response body will contain the necessary information for a client to make a payment.

To learn how to build a client that can handle this payment flow, check out the [x402 Quickstart for Buyers](https://x402.gitbook.io/x402/getting-started).
