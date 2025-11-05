import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/profile/:userId', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [users] = await connection.query(
      'SELECT id, email, full_name, phone, role, avatar_url FROM users WHERE id = ?',
      [req.params.userId]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    if (req.user.role === 'user' && req.user.id !== user.id) {
      connection.release();
      return res.status(403).json({ error: 'Access denied' });
    }

    const [settings] = await connection.query(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [req.params.userId]
    );

    connection.release();

    res.json({
      user,
      settings: settings[0] || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.patch('/profile/:userId', authenticate, async (req, res) => {
  try {
    const { full_name, phone, avatar_url } = req.body;

    if (req.user.role === 'user' && req.user.id !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const connection = await pool.getConnection();

    const updates = [];
    const values = [];

    if (full_name) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (avatar_url) {
      updates.push('avatar_url = ?');
      values.push(avatar_url);
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.userId);

    await connection.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    connection.release();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/settings/:userId', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    if (req.user.role === 'user' && req.user.id !== req.params.userId) {
      connection.release();
      return res.status(403).json({ error: 'Access denied' });
    }

    const [settings] = await connection.query(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [req.params.userId]
    );

    connection.release();

    if (settings.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json(settings[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.patch('/settings/:userId', authenticate, async (req, res) => {
  try {
    const { theme, email_notifications, sms_notifications, language, timezone } = req.body;

    if (req.user.role === 'user' && req.user.id !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const connection = await pool.getConnection();

    const updates = [];
    const values = [];

    if (theme) {
      updates.push('theme = ?');
      values.push(theme);
    }
    if (email_notifications !== undefined) {
      updates.push('email_notifications = ?');
      values.push(email_notifications);
    }
    if (sms_notifications !== undefined) {
      updates.push('sms_notifications = ?');
      values.push(sms_notifications);
    }
    if (language) {
      updates.push('language = ?');
      values.push(language);
    }
    if (timezone) {
      updates.push('timezone = ?');
      values.push(timezone);
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.userId);

    await connection.query(
      `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    connection.release();

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

router.post('/password/:userId', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (req.user.role === 'user' && req.user.id !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const connection = await pool.getConnection();

    const [users] = await connection.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.params.userId]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password_hash);

    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, req.params.userId]
    );

    connection.release();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [users] = await connection.query(
      'SELECT id, email, full_name, phone, role, is_active FROM users'
    );

    connection.release();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
