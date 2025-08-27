// /api/validatePairCode.js
import { sessions } from './generatePairCode.js';
import { setPairedPhone } from '../bot.js';  // Adjust path as per your folder structure

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pairCode } = req.body;
  if (!pairCode) {
    return res.status(400).json({ error: 'Pairing code is required' });
  }

  const numericCode = pairCode.includes('~') ? pairCode.split('~')[1] : pairCode;
  const session = sessions.get(numericCode);

  if (!session) {
    return res.status(400).json({ error: 'Invalid pairing code' });
  }

  if (session.expires < Date.now()) {
    sessions.delete(numericCode);
    return res.status(400).json({ error: 'Pairing code expired' });
  }

  sessions.delete(numericCode);

  setPairedPhone(session.phone);

  res.status(200).json({ success: true, phone: session.phone });
}
