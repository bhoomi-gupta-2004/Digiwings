// backend/src/modules/attendance/attendance.routes.js

const router = require('express').Router();
const { getDB } = require('../../config/db');
const { authMiddleware } = require('../../middlewares/auth');

// ==========================
// Employee check-in
// POST /api/attendance/check-in
// ==========================
router.post('/check-in', authMiddleware, async (req, res) => {
  const sql = getDB();
  const userId = req.user.id;

  try {
    await sql`
      INSERT INTO attendance (user_id, check_in_at, status)
      VALUES (${userId}, NOW(), 'PENDING')
    `;
    res.status(201).json({ message: 'Check-in recorded successfully.' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'You have already checked in today.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// Employee check-out
// POST /api/attendance/check-out
// ==========================
router.post('/check-out', authMiddleware, async (req, res) => {
  const sql = getDB();
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const result = await sql`
      UPDATE attendance
      SET check_out_at = NOW()
      WHERE user_id = ${userId} AND check_in_at::date = ${today}
      RETURNING *
    `;

    if (!result[0]) {
      return res.status(404).json({ error: 'Check-in record for today not found.' });
    }

    res.json({
      message: 'Check-out successful.',
      checkOutTime: result[0].check_out_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// Employee personal attendance history
// GET /api/attendance/me?from&to
// ==========================
router.get('/me', authMiddleware, async (req, res) => {
  const sql = getDB();
  const { from, to } = req.query;
  const userId = req.user.id;

  try {
    const result = await sql`
      SELECT check_in_at, check_out_at, status, approved_at
      FROM attendance
      WHERE user_id = ${userId}
        AND check_in_at::date BETWEEN ${from} AND ${to}
      ORDER BY check_in_at DESC
    `;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
