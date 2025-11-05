# Backend Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MySQL** (v5.7 or higher)
3. **npm** package manager

## Installation Steps

### 1. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Copy and paste the entire content of database.sql
# Or use the following command:
mysql -u root -p < database.sql
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your configuration:
```

**Important .env variables:**

- `DB_HOST`: Database host (default: localhost)
- `DB_USER`: Database user (default: root)
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name (default: complaint_system)
- `JWT_SECRET`: Secret key for JWT tokens (change this to something random)
- `SMTP_HOST`: Email SMTP server (e.g., smtp.gmail.com)
- `SMTP_PORT`: SMTP port (e.g., 587)
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Email app password (NOT your regular password)
- `FRONTEND_URL`: Frontend URL (default: http://localhost:5173)

### 4. Setup Email Notifications

**For Gmail:**

1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated password
   - Use this password in `SMTP_PASS` in .env

**For Other Email Providers:**

- Gmail SMTP: `smtp.gmail.com:587`
- Outlook SMTP: `smtp-mail.outlook.com:587`
- Yahoo SMTP: `smtp.mail.yahoo.com:465` (use secure: true)

### 5. Run the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server should be running on `http://localhost:5000`

## Database Schema

The database includes the following tables:

- **users**: User accounts and authentication
- **complaints**: Complaint records
- **responses**: Admin responses to complaints
- **user_settings**: User preferences (theme, notifications, etc.)
- **audit_logs**: System audit trail

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints` - Get complaints (all for admin, own for user)
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id` - Update complaint (status for admin, priority for both)
- `DELETE /api/complaints/:id` - Delete complaint (admin only)

### Responses
- `POST /api/responses/:complaintId` - Add response (admin only)
- `GET /api/responses/:complaintId` - Get responses
- `DELETE /api/responses/:responseId` - Delete response (admin only)

### Users
- `GET /api/users/profile/:userId` - Get user profile
- `PATCH /api/users/profile/:userId` - Update profile
- `GET /api/users/settings/:userId` - Get user settings
- `PATCH /api/users/settings/:userId` - Update settings
- `POST /api/users/password/:userId` - Change password
- `GET /api/users` - Get all users (admin only)

## Troubleshooting

### Connection refused
- Make sure MySQL is running: `mysql.server start` (Mac) or `net start MySQL80` (Windows)
- Check database credentials in .env

### Email not sending
- Verify SMTP credentials
- Check if Gmail app password is correct
- Ensure "Less secure app access" is enabled (for Gmail older accounts)
- Check firewall/antivirus blocking port 587

### Port already in use
- Change PORT in .env to a different port (e.g., 5001)
- Or kill the process using the port

## Development Tips

1. Always use HTTPS in production
2. Rotate JWT_SECRET regularly
3. Use strong database passwords
4. Enable email notifications for security events
5. Regularly check audit logs
