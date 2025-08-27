const express = require('express');
const cors = require('cors');
const { setPairedPhone } = require('./bot');

const app = express();
app.use(cors());
app.use(express.json());

const sessions = {}; // { pairCode: {phone, expires} }

app.post('/generatePairCode', (req, res) => {
  const { phone } = req.body;
  if(!phone) return res.status(400).json({ error: 'Phone is required' });

  const pairCode = (Math.floor(100000 + Math.random()*900000)).toString();
  sessions[pairCode] = { phone, expires: Date.now() + 5*60*1000 };

  res.json({ pairCode });
});

app.post('/validatePairCode', (req, res) => {
  const { pairCode } = req.body;
  if(!pairCode || !sessions[pairCode]){
    return res.status(400).json({ error: 'Invalid pairing code' });
  }

  if(sessions[pairCode].expires < Date.now()){
    delete sessions[pairCode];
    return res.status(400).json({ error: 'Pairing code expired' });
  }

  const session = sessions[pairCode];
  setPairedPhone(session.phone);
  delete sessions[pairCode];

  return res.json({ success: true, phone: session.phone });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Pairing server running on port ${PORT}`));
