import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin, authorizeUser } from '../middleware/auth.js';
import { sendComplaintNotification, sendResponseNotification, sendStatusChangeNotification } from '../services/emailService.js';

const router = express.Router();

router.post('/', authenticate, authorizeUser, async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO complaints (user_id, title, description, category, priority, location) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, category, priority || 'medium', location]
    );

    const [adminUsers] = await connection.query(
      'SELECT email FROM users WHERE role = "admin"'
    );

    const [userEmail] = await connection.query(
      'SELECT email FROM users WHERE id = ?',
      [req.user.id]
    );

    connection.release();

    const complaint = { title, description, category, priority, location };
    for (const admin of adminUsers) {
      await sendComplaintNotification(admin.email, complaint, userEmail[0].email);
    }

    res.status(201).json({ id: result.insertId, message: 'Complaint created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let query = 'SELECT * FROM complaints';
    let params = [];

    if (req.user.role === 'user') {
      query += ' WHERE user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY created_at DESC';

    const [complaints] = await connection.query(query, params);
    connection.release();

    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [complaints] = await connection.query(
      'SELECT * FROM complaints WHERE id = ?',
      [req.params.id]
    );

    if (complaints.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = complaints[0];

    if (req.user.role === 'user' && complaint.user_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Access denied' });
    }

    const [responses] = await connection.query(
      `SELECT r.*, u.full_name, u.email FROM responses r
       JOIN users u ON r.admin_id = u.id
       WHERE r.complaint_id = ? ORDER BY r.created_at ASC`,
      [req.params.id]
    );

    connection.release();

    res.json({ complaint, responses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { status, priority } = req.body;
    const connection = await pool.getConnection();

    const [complaints] = await connection.query(
      'SELECT * FROM complaints WHERE id = ?',
      [req.params.id]
    );

    if (complaints.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = complaints[0];

    if (req.user.role === 'user' && complaint.user_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'user' && status) {
      connection.release();
      return res.status(403).json({ error: 'Users cannot change status' });
    }

    const oldStatus = complaint.status;

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (priority) {
      updates.push('priority = ?');
      values.push(priority);
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);

    await connection.query(
      `UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (status && status !== oldStatus) {
      const [userEmail] = await connection.query(
        'SELECT email FROM users WHERE id = ?',
        [complaint.user_id]
      );

      await sendStatusChangeNotification(
        userEmail[0].email,
        complaint,
        oldStatus,
        status
      );
    }

    connection.release();

    res.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [complaints] = await connection.query(
      'SELECT * FROM complaints WHERE id = ?',
      [req.params.id]
    );

    if (complaints.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = complaints[0];

    if (req.user.role === 'user' && complaint.user_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'user') {
      connection.release();
      return res.status(403).json({ error: 'Users cannot delete complaints' });
    }

    await connection.query('DELETE FROM complaints WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

export default router;
