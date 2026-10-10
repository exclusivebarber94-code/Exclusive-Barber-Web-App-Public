export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientName, clientPhone, serviceName, barberName, date, time, price } = req.body;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const ownerTo = process.env.TWILIO_WHATSAPP_TO;

  // SIDs de las plantillas aprobadas por WhatsApp
  const CLIENT_TEMPLATE_SID = 'HX3e85a8446dba0bb58f8a9a9a69f478e3db';
  const OWNER_TEMPLATE_SID = 'HX72c927857b5f25142b698ce7a218b874';

  if (!accountSid || !authToken || !from || !ownerTo) {
    return res.status(500).json({ error: 'Twilio not configured' });
  }

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  // Formatear fecha
  const [year, month, day] = date.split('-');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dateFormatted = `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;

  // Formatear precio
  const priceFormatted = `$${Number(price).toLocaleString('es-CO')}`;

  const sendTemplate = async (to, contentSid, variables) => {
    const params = new URLSearchParams({
      From: from,
      To: to,
      ContentSid: contentSid,
      ContentVariables: JSON.stringify(variables),
    });
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    return response.json();
  };

  const formatPhone = (phone) => {
    const digits = phone.replace(/\D/g, '').replace(/^57/, '');
    return `whatsapp:+57${digits}`;
  };

  try {
    // Mensaje al dueño (siempre)
    const ownerResult = await sendTemplate(ownerTo, OWNER_TEMPLATE_SID, {
      '1': clientName,
      '2': clientPhone || 'No proporcionado',
      '3': serviceName,
      '4': barberName,
      '5': dateFormatted,
      '6': time,
      '7': priceFormatted,
    });

    // Mensaje al cliente (si tiene número)
    let clientResult = null;
    if (clientPhone) {
      clientResult = await sendTemplate(formatPhone(clientPhone), CLIENT_TEMPLATE_SID, {
        '1': clientName,
        '2': dateFormatted,
        '3': time,
        '4': serviceName,
        '5': barberName,
        '6': priceFormatted,
      });
    }

    return res.status(200).json({ success: true, ownerResult, clientResult });
  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({ error: 'Failed to send messages' });
  }
}