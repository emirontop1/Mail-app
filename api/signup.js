import nodemailer from 'nodemailer';

// Buraya kendi Gmail bilgilerinizi girin.
// BU YÖNTEM GÜVENLİ DEĞİLDİR!
const GMAIL_USER = 'emrozlemr@gmail.com'; 
const GMAIL_APP_PASSWORD = 'addd aygm repa bzry'; 

// Rastgele bir şifre oluşturan fonksiyon
function generatePassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const newPassword = generatePassword();

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
    subject: 'Yeni Hesap Şifreniz',
    html: `
      <h1>Hesabınız Oluşturuldu!</h1>
      <p>Merhaba,</p>
      <p>Hesabınız başarıyla oluşturuldu. İşte giriş şifreniz:</p>
      <h2>${newPassword}</h2>
      <p>Güvenliğiniz için bu şifreyi kimseyle paylaşmayınız.</p>
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
