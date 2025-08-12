// Netlify Function: Telegram relay (Node 18+)
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if(!TOKEN || !CHAT_ID){
      return { statusCode: 500, body: JSON.stringify({ ok:false, error:'Missing TELEGRAM_* env vars' })};
    }

    const data = JSON.parse(event.body || '{}');
    const { name='', email='', phone='', message='', source='unknown' } = data;

    // Basic validation
    if(!name || !email) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Name and email are required.' })};
    }

    // Escape message content
    const esc = (s) => String(s).replace(/_/g,'\_').replace(/\*/g,'\*').replace(/\[/g,'\[').replace(/`/g,'\`');

    const text =
`🧩 New ${esc(source)} submission
• Name: ${esc(name)}
• Email: ${esc(email)}
• Phone: ${esc(phone)}
• Message: ${esc(message)}`;

    const resp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'MarkdownV2'
      })
    });

    if (!resp.ok) {
      const t = await resp.text();
      return { statusCode: 502, body: JSON.stringify({ ok:false, error:'Telegram API error', details:t }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok:true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error: e.message }) };
  }
}
