// Vercel Serverless Function — Telegram Lead Notification
// Environment Variables Required: BOT_TOKEN, CHAT_ID

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, area, style } = req.body;

  if (!phone || !area) {
    return res.status(400).json({ error: 'Телефон и площадь обязательны.' });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing environment variables: BOT_TOKEN or CHAT_ID');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const message = `🔥 НОВАЯ ЗАЯВКА — ДИЗАЙН ИНТЕРЬЕРА\n\n🏠 Тип объекта: ${name || '—'}\n📐 Площадь: ${area} м²\n🎨 Стиль: ${style || '—'}\n📞 Телефон: ${phone}`;

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ error: 'Ошибка отправки в Telegram.' });
    }

    return res.status(200).json({ success: true, message: 'Заявка отправлена!' });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }
}
