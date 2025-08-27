let sessions = {};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // 6-digit random pair code generate කිරීම
  const pairCode = Math.floor(100000 + Math.random() * 900000).toString();

  // formatted pair code
  const formattedCode = `nimesha~${pairCode}`;

  // session object එකට සේව්
  sessions[pairCode] = { phone, expires: Date.now() + 5 * 60 * 1000 };

  // formatted code response එකට යවන්න
  res.status(200).json({ pairCode: formattedCode });
}
