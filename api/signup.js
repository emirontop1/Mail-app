import nodemailer from 'nodemailer';

// Buraya kendi Gmail bilgilerinizi girin.
// BU YÖNTEM GÜVENLİ DEĞİLDİR!
const GMAIL_USER = 'emrozlemr@gmail.com'; 
const GMAIL_APP_PASSWORD = 'adddaygmrepabzry';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: 'Merhaba Mesajınız',
    html: `
      <h1>Merhaba!</h1>
      <p>Bu, size gönderdiğimiz basit bir test mesajıdır.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'E-posta başarıyla gönderildi.' });
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return res.status(500).json({ message: 'E-posta gönderilirken bir hata oluştu.', detail: error.message });
  }
}
