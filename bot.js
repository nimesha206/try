const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const P = require('pino');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

let pairedPhone = null;

function setPairedPhone(phone) {
  pairedPhone = phone;
  console.log('Paired phone set to', phone);
}

async function startBot() {
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;

    if (pairedPhone && from.includes(pairedPhone)) {
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

      let reply = "Sorry, I didn't understand.";
      if (text.toLowerCase().includes('hello')) reply = 'Hello! How can I help?';
      else if (text.toLowerCase().includes('how are you')) reply = "I'm fine, thank you!";
      else if (text.toLowerCase().includes('bye')) reply = 'Goodbye! Have a nice day!';
      
      await sock.sendMessage(from, { text: reply });
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if ((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('Bot connected');
    }
  });
}

startBot();

module.exports = { setPairedPhone };
