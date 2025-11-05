# Complaint System Backend

Backend API untuk Sistem Pengaduan Masyarakat (SCMS) dibangun dengan Express.js dan MySQL.

## Features

- User authentication dengan JWT
- Complaint management (create, read, update)
- Admin responses system
- Email notifications
- User profile management
- Settings management (theme, notifications)
- Row-level security dengan role-based access control

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── complaints.js        # Complaint routes
│   ├── responses.js         # Response routes
│   └── users.js             # User/profile routes
├── services/
│   └── emailService.js      # Email sending service
├── server.js                # Main application file
├── database.sql             # Database schema
├── .env.example             # Environment variables template
├── SETUP.md                 # Setup guide
└── package.json             # Dependencies
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Configure `.env` with your settings

4. Create database:
```bash
mysql -u root -p < database.sql
```

5. Run server:
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Complaints
- `POST /api/complaints` - Create complaint (user)
- `GET /api/complaints` - Get complaints list
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id` - Update complaint (status/priority)
- `DELETE /api/complaints/:id` - Delete complaint (admin)

### Responses
- `POST /api/responses/:complaintId` - Add response to complaint (admin)
- `GET /api/responses/:complaintId` - Get responses for complaint
- `DELETE /api/responses/:responseId` - Delete response (admin)

### Users
- `GET /api/users/profile/:userId` - Get user profile
- `PATCH /api/users/profile/:userId` - Update profile
- `GET /api/users/settings/:userId` - Get user settings
- `PATCH /api/users/settings/:userId` - Update settings
- `POST /api/users/password/:userId` - Change password
- `GET /api/users` - Get all users (admin)

## Database Schema

### users
- id: UUID primary key
- email: unique email
- password_hash: bcryptjs hashed password
- full_name: user's full name
- phone: contact phone
- role: 'user' or 'admin'
- avatar_url: profile picture URL
- is_active: account status
- created_at, updated_at: timestamps

### complaints
- id: UUID primary key
- user_id: FK to users
- title: complaint title
- description: detailed description
- category: complaint category
- priority: low/medium/high/urgent
- status: open/in_progress/resolved/closed
- location: incident location
- attachment_url: file attachment
- created_at, updated_at: timestamps

### responses
- id: UUID primary key
- complaint_id: FK to complaints
- admin_id: FK to users (admin)
- message: response message
- attachment_url: file attachment
- created_at, updated_at: timestamps

### user_settings
- id: UUID primary key
- user_id: FK to users
- theme: 'light' or 'dark'
- email_notifications: boolean
- sms_notifications: boolean
- language: language code
- timezone: timezone string
- created_at, updated_at: timestamps

## Environment Variables

```
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=complaint_system
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key_here

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@complaintsystem.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Client stores token in localStorage
4. Client sends token in Authorization header: `Bearer <token>`
5. Server verifies token on protected routes

## Email Notifications

Emails are sent in the following cases:

1. **New Complaint**: Admin receives email when new complaint is submitted
2. **Admin Response**: User receives email when admin responds
3. **Status Change**: User receives email when complaint status changes

Gmail requires:
- 2-Factor Authentication enabled
- App Password (not regular password)

## Error Handling

API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

Error responses include error message:
```json
{
  "error": "Error message description"
}
```

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- CORS enabled for frontend only
- Role-based access control
- Input validation
- SQL injection prevention with parameterized queries

## Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Use strong database password
3. Enable HTTPS
4. Set `NODE_ENV=production`
5. Configure proper SMTP credentials
6. Update `FRONTEND_URL` to production domain
7. Use proper email from address
8. Setup database backups

## Troubleshooting

### Database Connection Failed
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env
# Check database exists
mysql -u root -p
SHOW DATABASES;
USE complaint_system;
SHOW TABLES;
```

### Email Not Sending
- Verify SMTP credentials
- Ensure 2FA is enabled for Gmail
- Check app password is correct
- Verify firewall allows SMTP port 587

### Port Already in Use
```bash
# Change PORT in .env or
# Kill process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

## License

Closed Source

## Support

For issues or questions, check:
1. Backend logs for error messages
2. Frontend console for API errors
3. Email configuration if notifications fail
4. Database connectivity if queries fail
