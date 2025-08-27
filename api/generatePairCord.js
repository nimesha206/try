import crypto from 'crypto';

const sessions = new Map();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Generate 6-digit random pair code
  const pairCode = crypto.randomInt(100000, 999999).toString();

  // formatted pair code
  const formattedCode = `nimesha~${pairCode}`;

  // Save session with expiration time
  sessions.set(pairCode, { phone, expires: Date.now() + 5 * 60 * 1000 });

  res.status(200).json({ pairCode: formattedCode });
}

// Export sessions to be accessed from validatePairCode.js (only within same runtime)
export { sessions };
