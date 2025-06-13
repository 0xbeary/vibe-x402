# x402 Payments Demo (Fullstack)

This repository contains a fullstack application demonstrating how to use the [x402 Payment Protocol](https://x402.com). It includes:

1.  **A Backend Server**: Built with Express and TypeScript, it exposes both a free public endpoint and a `/protected` endpoint that requires an on-chain payment.
2.  **A Frontend Client**: A Next.js application that provides a user interface to test both the free and paid endpoints, handling the payment flow automatically.

## How It Works

The project demonstrates a complete client-server payment loop:

1.  **Request**: The frontend client requests access to the `/protected` endpoint on the backend.
2.  **Payment Required**: The backend server sees the request lacks payment and responds with an `HTTP 402 Payment Required` error, including the price and payment details in the headers.
3.  **Automatic Payment**: The frontend, using the `x402-fetch` library, catches the 402 response, signs the required payment transaction using the user's configured private key, and retries the original request with the payment proof attached.
4.  **Access Granted**: The backend server's middleware verifies the payment proof via the x402 facilitator and, if valid, grants access to the protected endpoint, returning the secret content.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- An EVM-compatible wallet address to receive payments.
- A second EVM-compatible wallet with **Base Sepolia testnet USDC** to act as the buyer.

### 1. Installation

Install dependencies for both the backend and the frontend:

```bash
# Install backend dependencies from the root directory
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Configuration

You will need to configure environment variables for both the backend and frontend.

#### Backend Server

Create a `.env` file in the root of the project. You can copy the example file if it exists, or create a new one.

```bash
touch .env
```

Open `.env` and add your receiving wallet address. This is the address that will collect the funds from the paid endpoint.

```env
# .env

# Your EVM-compatible wallet address to receive payments
RECIPIENT_ADDRESS="0xYourReceivingWalletAddress"
```

#### Frontend Client

Create a `.env.local` file in the `/frontend` directory:

```bash
touch frontend/.env.local
```

Open `frontend/.env.local` and add the private key of the wallet you intend to **pay from**.

```env
# /frontend/.env.local

# Your private key for signing x402 payments (Base Sepolia testnet)
# This wallet must have USDC on the Base Sepolia testnet.
NEXT_PUBLIC_PRIVATE_KEY="0xYourTestnetPrivateKey"
```

**Important Security Notes:**
-   Only use **testnet** private keys. This is for demonstration purposes only.
-   The `.env.local` file is already in `.gitignore` to prevent you from committing private keys.

### 3. Running the Application

You'll need to run the backend and frontend in separate terminal windows.

**Terminal 1: Start the Backend Server**

```bash
# From the project root
npm run dev
```
The server will start on `http://localhost:5678`.

**Terminal 2: Start the Frontend Client**

```bash
# From the project root
cd frontend
npm run dev -- -p 5454
```
The frontend will be available at `http://localhost:5454`.

### 4. Test the Integration

Open `http://localhost:5454` in your browser.

-   Click **"Test Free Endpoint"** to make a request to the root path (`/`) that doesn't require payment.
-   Click **"Test Paid Endpoint"** to initiate the x402 payment flow to access `/protected`. If your paying wallet is configured correctly, the payment will be processed automatically.

---

## Tech Stack

-   **Backend**: Express, TypeScript, `x402-express`
-   **Frontend**: Next.js, React, TypeScript, Tailwind CSS, `x402-fetch`
-   **Blockchain**: Payments are handled on the **Base Sepolia** testnet using USDC.
