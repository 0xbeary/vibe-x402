import express from 'express';
import cors from 'cors';
import { paymentMiddleware, PaymentMiddlewareConfig } from 'x402-express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5678;

// Enable CORS for all routes so that the Next.js frontend (port 5454) can call the API on port 5678 during development.
app.use(cors());

// This is your wallet address where you'll receive payments
const recipient = process.env.RECIPIENT_ADDRESS as `0x${string}`;

if (!recipient) {
  throw new Error('RECIPIENT_ADDRESS is not set in the environment variables.');
}

if (!recipient.startsWith('0x')) {
  throw new Error('RECIPIENT_ADDRESS must be a valid Ethereum address starting with 0x');
}

// Configure and apply the payment middleware globally
app.use(paymentMiddleware(
  recipient,
  {
    "GET /protected": {
      price: '$0.001',
      network: 'base-sepolia',
    }
  },
  {
    url: "https://x402.org/facilitator", // Facilitator URL for Base Sepolia testnet.
  }
));

app.get('/', (req, res) => {
  res.send('x402 server is running!');
});

// This is the protected route that requires payment
// The middleware will automatically handle payment verification for it
app.get('/protected', (req, res) => {
  res.json({
    data: 'This is the secret content you paid for!',
    timestamp: new Date().toISOString(),
    message: 'Payment verification successful'
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log('To test the protected route, run:');
  console.log(`curl http://localhost:${port}/protected`);
  console.log('You should receive a 402 Payment Required response.');
}); 