import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendComplaintNotification = async (adminEmail, complaint, userEmail) => {
  try {
    const htmlContent = `
      <h2>Laporan Baru Diterima</h2>
      <p><strong>Judul:</strong> ${complaint.title}</p>
      <p><strong>Kategori:</strong> ${complaint.category}</p>
      <p><strong>Prioritas:</strong> ${complaint.priority}</p>
      <p><strong>Lokasi:</strong> ${complaint.location || '-'}</p>
      <p><strong>Deskripsi:</strong></p>
      <p>${complaint.description}</p>
      <p><strong>Dari:</strong> ${userEmail}</p>
      <p>---</p>
      <p>Silakan login ke sistem untuk memberikan respons.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: adminEmail,
      subject: `Laporan Baru: ${complaint.title}`,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendResponseNotification = async (userEmail, response, complaintTitle) => {
  try {
    const htmlContent = `
      <h2>Ada Respons untuk Laporan Anda</h2>
      <p><strong>Laporan:</strong> ${complaintTitle}</p>
      <p><strong>Respons dari Admin:</strong></p>
      <p>${response.message}</p>
      <p>---</p>
      <p>Silakan login ke sistem untuk melihat detail lengkapnya.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: `Respons untuk Laporan: ${complaintTitle}`,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendStatusChangeNotification = async (userEmail, complaint, oldStatus, newStatus) => {
  try {
    const htmlContent = `
      <h2>Status Laporan Berubah</h2>
      <p><strong>Laporan:</strong> ${complaint.title}</p>
      <p><strong>Status Sebelumnya:</strong> ${oldStatus}</p>
      <p><strong>Status Baru:</strong> ${newStatus}</p>
      <p>---</p>
      <p>Silakan login ke sistem untuk melihat detail lengkapnya.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: `Perubahan Status Laporan: ${complaint.title}`,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
