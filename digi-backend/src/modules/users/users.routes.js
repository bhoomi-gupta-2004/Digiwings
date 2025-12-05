// backend/src/modules/users/users.routes.js

const router = require('express').Router();
const { getDB } = require('../../config/db');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth');
const { hashPassword } = require('../../utils/bcrypt');

// ==========================
// GET /api/users/me
// Employee self-service: get own profile
// ==========================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const result = await sql`
      SELECT name, employee_id, role, email, phone, department, salary, date_hired, address
      FROM users
      WHERE id = ${req.user.id}
    `;
    res.json(result[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// POST /api/admin/users
// Admin: add new employee
// ==========================
router.post('/admin/users', [authMiddleware, adminMiddleware], async (req, res) => {
  const sql = getDB();
  const { employeeId, name, role, password, email, phone, department, salary, date_hired, address } = req.body;

  try {
    const password_hash = await hashPassword(password);

    const result = await sql`
      INSERT INTO users
        (employee_id, name, role, password_hash, email, phone, department, salary, date_hired, address, active)
      VALUES
        (${employeeId}, ${name}, ${role}, ${password_hash}, ${email}, ${phone}, ${department}, ${salary}, ${date_hired}, ${address}, TRUE)
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Employee with this ID or email already exists.' });
    }
    res.status(500).json({ error: 'Server error.' });
  }
});

// ==========================
// PUT /api/admin/:id
// Admin: update employee info
// ==========================
router.put('/admin/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  const sql = getDB();
  const userId = req.params.id;
  const { name, role, password, active, email, phone, department, salary, date_hired, address } = req.body;

  try {
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name'); values.push(name); }
    if (role !== undefined) { fields.push('role'); values.push(role); }
    if (password !== undefined) { fields.push('password_hash'); values.push(await hashPassword(password)); }
    if (active !== undefined) { fields.push('active'); values.push(active); }
    if (email !== undefined) { fields.push('email'); values.push(email); }
    if (phone !== undefined) { fields.push('phone'); values.push(phone); }
    if (department !== undefined) { fields.push('department'); values.push(department); }
    if (salary !== undefined) { fields.push('salary'); values.push(salary); }
    if (date_hired !== undefined) { fields.push('date_hired'); values.push(date_hired); }
    if (address !== undefined) { fields.push('address'); values.push(address); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update.' });
    }

    // Build dynamic SQL
    const setClause = fields.map((f, i) => `${f} = ${sql(values[i])}`).join(', ');
    const query = sql`UPDATE users SET ${sql.raw(setClause)} WHERE id = ${userId} RETURNING *`;
    const result = await query;

    if (!result[0]) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// DELETE /api/admin/:id
// Admin: delete employee and related data
// ==========================
router.delete('/admin/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  const sql = getDB();
  const userId = req.params.id;

  try {
    // Delete related data first to avoid FK constraint errors
    await sql`DELETE FROM attendance WHERE user_id = ${userId}`;
    await sql`DELETE FROM leaves WHERE user_id = ${userId}`;
    await sql`DELETE FROM tasks WHERE user_id = ${userId}`;

    const result = await sql`DELETE FROM users WHERE id = ${userId} RETURNING *`;

    if (!result[0]) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// GET /api/admin
// Admin: get all users
// ==========================
router.get('/admin', [authMiddleware, adminMiddleware], async (req, res) => {
  console.log("hello");
  
  const sql = getDB();
  try {
    const result = await sql`
      SELECT id, employee_id, name, role, email, phone, department, salary, date_hired, address, active, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
