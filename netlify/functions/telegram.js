// Netlify Function: Telegram relay (Node 18+)
export async function handler(event) {
  // CORS (optional; keeps console clean if you open the function in browser)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Method Not Allowed',
    };
  }

  try {
    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return json({ ok:false, error:'Missing TELEGRAM_* env vars' }, 500);
    }

    const data = JSON.parse(event.body || '{}');
    const { name = '', email = '', phone = '', message = '', source = 'unknown' } = data;

    if (!name || !email) {
      return json({ ok:false, error:'Name and email are required.' }, 400);
    }

    // Plain text message (no Markdown parse_mode to avoid escaping issues)
    const text =
`New ${source} submission
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`;

    const tgResp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    if (!tgResp.ok) {
      const details = await tgResp.text();
      return json({ ok:false, error:'Telegram API error', details }, 502);
    }

    return json({ ok:true }, 200);

  } catch (e) {
    return json({ ok:false, error: e.message }, 500);
  }
}

// helper to return JSON with CORS
function json(obj, status = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(obj),
  };
}
