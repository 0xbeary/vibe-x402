# x402 Payment Frontend Demo

This is a Next.js frontend that demonstrates the x402 payment protocol by testing both free and paid endpoints.

## Features

- **Free Endpoint Test**: Test the root endpoint that doesn't require payment
- **Paid Endpoint Test**: Test a protected endpoint that requires $0.001 USDC payment on Base Sepolia
- **Real-time Payment Processing**: Uses the x402-fetch client to handle payments automatically
- **Wallet Integration**: Built-in wallet client using viem for Base Sepolia testnet

## Prerequisites

Before running this frontend, ensure you have:

1. **Backend Running**: The x402 backend server running on port 4020
2. **Testnet Wallet**: A private key with USDC on Base Sepolia testnet
3. **Node.js**: Version 18 or later

## Setup Instructions

### 1. Install Dependencies

The required packages are already installed:
- `x402-fetch` - for making paid API requests
- `viem` - for wallet client functionality

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Your private key for signing x402 payments (Base Sepolia testnet)
# This should be a wallet with USDC on Base Sepolia
NEXT_PUBLIC_PRIVATE_KEY=0x1234567890abcdef...

# Backend URL where your x402 server is running
NEXT_PUBLIC_BACKEND_URL=http://localhost:4020
```

**Important Security Notes:**
- Only use testnet private keys
- Never commit private keys to version control
- This is for demonstration purposes only

### 3. Get Testnet USDC

To test payments, you'll need USDC on Base Sepolia:

1. **Get Base Sepolia ETH**: Use the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-sepolia-faucet)
2. **Get USDC**: Swap ETH for USDC on Base Sepolia using [Uniswap](https://app.uniswap.org/)
3. **Alternative**: Use the [Circle Faucet](https://faucet.circle.com/) for testnet USDC

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Free Endpoint Test
- Makes a request to `GET /` on your backend
- No payment required
- Should return a simple success message

### Paid Endpoint Test
1. **Initialize Wallet**: Creates a viem wallet client using your private key
2. **Payment Discovery**: When requesting `/protected`, the server returns 402 Payment Required with payment instructions
3. **Automatic Payment**: The x402-fetch client automatically handles the payment flow:
   - Parses payment requirements from the 402 response
   - Signs the payment transaction using your wallet
   - Retries the request with the payment proof
4. **Access Granted**: Server verifies payment and returns the protected content

## Project Structure

```
frontend/
├── src/
│   └── app/
│       └── page.tsx          # Main demo component
├── package.json               # Dependencies and scripts
└── README.md                 # This file
```

## API Endpoints Tested

| Endpoint | Method | Payment Required | Price |
|----------|--------|------------------|-------|
| `/` | GET | No | Free |
| `/protected` | GET | Yes | $0.001 USDC |

## Troubleshooting

### "Wallet Not Initialized"
- Ensure `NEXT_PUBLIC_PRIVATE_KEY` is set in your `.env.local`
- Verify the private key format (should start with 0x)

### "Payment Failed"
- Check that your wallet has USDC on Base Sepolia
- Ensure the backend server is running on port 4020
- Verify your private key has sufficient ETH for gas fees

### "Network Error"
- Confirm the backend URL in `NEXT_PUBLIC_BACKEND_URL`
- Check that the backend server is accessible

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **x402-fetch** - x402 payment client
- **viem** - Ethereum wallet client
- **Base Sepolia** - Testnet for payments

## Learn More

- [x402 Documentation](https://x402.gitbook.io/x402/)
- [x402 Quickstart for Buyers](https://x402.gitbook.io/x402/getting-started/quickstart-for-buyers)
- [Base Sepolia Network](https://docs.base.org/network-information)
- [viem Documentation](https://viem.sh/)

## Security Disclaimer

This is a demonstration application for testnet use only. Never use mainnet private keys or deploy this configuration to production without proper security measures.
