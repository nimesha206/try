import { sessions } from './generatePairCode';

let pairedPhone = null;

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { pairCode } = req.body;
  if (!pairCode || !sessions[pairCode]) return res.status(400).json({ error: 'Invalid pairing code' });

  if (sessions[pairCode].expires < Date.now()) {
    delete sessions[pairCode];
    return res.status(400).json({ error: 'Pairing code expired' });
  }

  pairedPhone = sessions[pairCode].phone;

  delete sessions[pairCode];

  res.status(200).json({ success: true, phone: pairedPhone });
}

// Export setter for bot.js if needed
export function getPairedPhone() {
  return pairedPhone;
}
