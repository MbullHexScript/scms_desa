# Sistem Pengaduan Masyarakat (SCMS) - Setup Guide

Panduan lengkap untuk setup dan menjalankan sistem pengaduan masyarakat dengan backend MySQL dan frontend React.

## Daftar Isi

1. [Requirements](#requirements)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Email Configuration](#email-configuration)
5. [Running the Application](#running-the-application)
6. [Admin Account Creation](#admin-account-creation)
7. [Troubleshooting](#troubleshooting)

## Requirements

### System Requirements
- Node.js v16 atau lebih tinggi
- MySQL v5.7 atau lebih tinggi
- npm atau yarn
- Git (opsional)

### Operating System
- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 20.04+)

## Backend Setup

### Step 1: Install MySQL

**Windows:**
1. Download MySQL Community Server dari [mysql.com](https://www.mysql.com/downloads/mysql/)
2. Jalankan installer
3. Pilih opsi "Server Machine"
4. Setup MySQL sebagai service
5. Ingat password root yang Anda buat

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### Step 2: Create Database

Buka terminal atau Command Prompt dan masuk ke MySQL:

```bash
mysql -u root -p
```

Masukkan password root Anda, kemudian jalankan:

```sql
source /path/to/backend/database.sql
```

Atau copy-paste isi file `backend/database.sql` ke MySQL prompt.

Verifikasi database dibuat:
```sql
USE complaint_system;
SHOW TABLES;
EXIT;
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Configure Environment Variables

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=complaint_system
DB_PORT=3306

JWT_SECRET=your_secret_key_change_this_in_production

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

FRONTEND_URL=http://localhost:5173
```

### Step 5: Run Backend Server

**Development Mode (dengan auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

Cek dengan membuka: `http://localhost:5000/api/health`

## Frontend Setup

### Step 1: Install Dependencies

Dari root project directory:

```bash
npm install
```

### Step 2: Configure Environment Variables

Edit file `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Run Frontend Development Server

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## Email Configuration

### Gmail Setup

Email notifications menggunakan Gmail. Untuk setup:

1. **Enable 2-Factor Authentication**
   - Buka https://myaccount.google.com
   - Klik "Security" di sidebar kiri
   - Enable "2-Step Verification"

2. **Create App Password**
   - Buka https://myaccount.google.com/apppasswords
   - Select "Mail" dan "Windows Computer" (atau device Anda)
   - Google akan generate password 16 karakter
   - Copy password ini ke `SMTP_PASS` di `.env`

3. **Note:** Jangan gunakan password Gmail regular, harus menggunakan App Password

### Alternative Email Providers

#### Outlook
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

#### Yahoo
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_password
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

### Access Application

Buka browser dan navigasikan ke:
```
http://localhost:5173
```

## Admin Account Creation

### Cara 1: Direct Database (Recommended untuk Development)

```bash
mysql -u root -p

USE complaint_system;

INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active)
VALUES (
  UUID(),
  'admin@example.com',
  '$2a$10$your_hashed_password_here',
  'Admin User',
  '+62812345678',
  'admin',
  TRUE
);
```

Untuk generate password hash, gunakan Node.js:

```bash
node -e "require('bcryptjs').hash('password123', 10, (err, hash) => console.log(hash))"
```

Copy hash ke database.

### Cara 2: Register Normal User, Kemudian Update Role

1. Register user melalui aplikasi
2. Update role di database:

```bash
mysql -u root -p

USE complaint_system;

UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

## Features

### User Features
- ✅ Buat laporan/pengaduan
- ✅ Lihat status laporan
- ✅ Terima notifikasi email ketika ada response dari admin
- ✅ Edit profil
- ✅ Ubah password
- ✅ Dark mode / Light mode
- ✅ Settings (notifikasi, tema)

### Admin Features
- ✅ Lihat semua laporan
- ✅ Update status laporan
- ✅ Kirim respons ke laporan
- ✅ Lihat statistik
- ✅ Terima notifikasi email untuk laporan baru
- ✅ Kelola data warga
- ✅ Dark mode / Light mode

## Troubleshooting

### Port Sudah Digunakan

**Port 5000 (Backend):**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change PORT in .env
```

**Port 5173 (Frontend):**
Vite akan otomatis gunakan port berikutnya (5174, 5175, etc.)

### Database Connection Error

1. Pastikan MySQL service berjalan:
   - Windows: `net start MySQL80`
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

2. Verifikasi credentials di `.env`

3. Test koneksi manual:
```bash
mysql -u root -p -h localhost
```

### Email Tidak Terkirim

1. Pastikan Gmail App Password benar di `.env`
2. Pastikan 2FA enabled di Gmail
3. Cek log di backend console
4. Test email manual:

```bash
cd backend
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password'
  }
});
transporter.sendMail({
  from: 'noreply@complaintsystem.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
}, (err, info) => {
  if (err) console.log(err);
  else console.log('Email sent:', info.response);
});
"
```

### Frontend Cannot Connect to Backend

1. Pastikan backend running di `http://localhost:5000`
2. Check `VITE_API_URL` di `.env` file
3. Check browser console untuk error details
4. Ensure CORS is configured in backend

### Build Error

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Production Deployment

### Environment Setup

Sebelum deploy ke production:

1. **Update JWT Secret**
   - Generate secret baru: `openssl rand -hex 32`
   - Update `JWT_SECRET` di backend `.env`

2. **Update Database Credentials**
   - Gunakan strong password
   - Jangan commit `.env` ke git

3. **Update FRONTEND_URL**
   - Sesuaikan dengan domain production Anda

4. **Security**
   - Enable HTTPS
   - Update SMTP credentials
   - Setup firewall rules

## Support

Untuk pertanyaan atau issue, silakan:
1. Cek bagian Troubleshooting di atas
2. Cek backend logs
3. Cek browser console
4. Verifikasi semua environment variables

## License

Closed Source
