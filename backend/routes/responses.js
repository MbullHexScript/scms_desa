import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { sendResponseNotification } from '../services/emailService.js';

const router = express.Router();

router.post('/:complaintId', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const connection = await pool.getConnection();

    const [complaints] = await connection.query(
      'SELECT * FROM complaints WHERE id = ?',
      [req.params.complaintId]
    );

    if (complaints.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = complaints[0];

    const [result] = await connection.query(
      'INSERT INTO responses (complaint_id, admin_id, message) VALUES (?, ?, ?)',
      [req.params.complaintId, req.user.id, message]
    );

    const [userEmail] = await connection.query(
      'SELECT email FROM users WHERE id = ?',
      [complaint.user_id]
    );

    connection.release();

    await sendResponseNotification(
      userEmail[0].email,
      { message },
      complaint.title
    );

    res.status(201).json({ id: result.insertId, message: 'Response added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add response' });
  }
});

router.get('/:complaintId', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [complaints] = await connection.query(
      'SELECT * FROM complaints WHERE id = ?',
      [req.params.complaintId]
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
      [req.params.complaintId]
    );

    connection.release();

    res.json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

router.delete('/:responseId', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [responses] = await connection.query(
      'SELECT * FROM responses WHERE id = ?',
      [req.params.responseId]
    );

    if (responses.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Response not found' });
    }

    if (responses[0].admin_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Access denied' });
    }

    await connection.query('DELETE FROM responses WHERE id = ?', [req.params.responseId]);
    connection.release();

    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete response' });
  }
});

export default router;
