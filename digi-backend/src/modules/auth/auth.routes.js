const router = require('express').Router();
const { getDB } = require('../../config/db');
const { comparePassword } = require('../../utils/bcrypt');
const { generateToken } = require('../../utils/jwt');

router.post('/login', async (req, res) => {
  const sql = getDB();

  const { employeeId, password } = req.body;

  console.log(employeeId);
  console.log(password);
  
  try {
    const result = await sql`
      SELECT * FROM users WHERE employee_id = ${employeeId}
    `;
    
    const user = result[0];

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.json({ token, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
