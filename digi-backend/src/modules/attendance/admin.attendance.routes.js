// backend/src/modules/attendance/admin.attendance.routes.js

const router = require('express').Router();
const { getDB } = require('../../config/db');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth');
const { Parser } = require('@json2csv/plainjs');

// ==========================
// Admin daily dashboard
// GET /api/admin/attendance/dashboard/today
// ==========================
router.get('/dashboard/today', [authMiddleware, adminMiddleware], async (req, res) => {
  const sql = getDB();
  const today = new Date().toISOString().split('T')[0];

  try {
    const usersWithAttendance = await sql`
      SELECT
        u.id,
        u.name,
        u.employee_id,
        u.role,
        CASE WHEN a.check_in_at IS NOT NULL THEN TRUE ELSE FALSE END AS checked_in,
        a.status,
        a.check_in_at,
        a.check_out_at
      FROM users u
      LEFT JOIN attendance a
        ON u.id = a.user_id
        AND (a.check_in_at AT TIME ZONE 'UTC')::date = ${today}
      WHERE u.active = TRUE
    `;
    res.json(usersWithAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ==========================
// Admin approve attendance
// POST /api/admin/attendance/:id/approve
// ==========================
router.post('/:id/approve', [authMiddleware, adminMiddleware], async (req, res) => {
  const sql = getDB();
  const attendanceId = req.params.id;
  const adminId = req.user.id;

  try {
    const result = await sql`
      UPDATE attendance
      SET status = 'APPROVED', approved_by = ${adminId}, approved_at = NOW()
      WHERE id = ${attendanceId}
      RETURNING *
    `;

    if (!result[0]) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }

    res.json({ message: 'Attendance approved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// Admin attendance reports
// GET /api/admin/attendance?from&to&employeeId
// ==========================
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  const sql = getDB();
  const { from, to, employeeId } = req.query;

  try {
    let baseQuery = `
      SELECT a.id, u.name, u.employee_id, u.role, a.check_in_at, a.check_out_at, a.status
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.check_in_at::date BETWEEN ${from} AND ${to}
    `;
    if (employeeId) {
      baseQuery += ` AND u.employee_id = ${employeeId}`;
    }

    const result = await sql`${sql.raw(baseQuery)}`;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// Admin export reports to CSV
// GET /api/admin/attendance/export.csv?from&to&employeeId
// ==========================
router.get('/export.csv', [authMiddleware, adminMiddleware], async (req, res) => {
  const sql = getDB();
  const { from, to, employeeId } = req.query;

  try {
    let baseQuery = `
      SELECT a.id, u.name, u.employee_id, u.role, a.check_in_at, a.check_out_at, a.status
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.check_in_at::date BETWEEN ${from} AND ${to}
    `;
    if (employeeId) {
      baseQuery += ` AND u.employee_id = ${employeeId}`;
    }

    const result = await sql`${sql.raw(baseQuery)}`;

    const parser = new Parser();
    const csv = parser.parse(result);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
