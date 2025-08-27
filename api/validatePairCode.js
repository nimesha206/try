import { sessions, setPairedPhone } from './generatePairCode';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pairCode } = req.body;

  if (!pairCode || !sessions[pairCode]) {
    return res.status(400).json({ error: 'Invalid pair code' });
  }

  if (sessions[pairCode].expires < Date.now()) {
    delete sessions[pairCode];
    return res.status(400).json({ error: 'Pair code expired' });
  }

  const session = sessions[pairCode];

  setPairedPhone(session.phone);

  delete sessions[pairCode];

  res.status(200).json({ success: true, phone: session.phone });
}
