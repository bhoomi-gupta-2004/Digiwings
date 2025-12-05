// backend/src/modules/leaves/leaves.routes.js

const router = require('express').Router();
const { getDB } = require('../../config/db');
const { authMiddleware, adminMiddleware } = require('../../middlewares/auth');
const multer = require('multer');
const upload = multer();

// ==========================
// Employee applies for leave
// POST /api/leaves/apply
// ==========================
router.post('/apply', authMiddleware, upload.single('document'), async (req, res) => {
    const sql = getDB();
    const userId = req.user.id;

    // For multipart/form-data, fields are in req.body
    const { startDate, endDate, reason } = req.body;

    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("reason:", reason);
    console.log("file:", req.file); // uploaded file (if any)

    try {
        await sql`
            INSERT INTO leaves (user_id, start_date, end_date, reason, status)
            VALUES (${userId}, ${startDate}, ${endDate}, ${reason}, 'PENDING')
        `;
        res.status(201).json({ message: 'Leave application submitted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// ==========================
// Employee views own leave applications
// GET /api/leaves/me
// ==========================
router.get('/me', authMiddleware, async (req, res) => {
    const sql = getDB();
    const userId = req.user.id;

    try {
        const leaves = await sql`
            SELECT * FROM leaves
            WHERE user_id = ${userId}
            ORDER BY id DESC
        `;
        res.json(leaves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================
// Admin views all leave applications
// GET /api/leaves/admin?from=YYYY-MM-DD&to=YYYY-MM-DD&employeeId=EMP001
// ==========================
router.get('/admin', [authMiddleware, adminMiddleware], async (req, res) => {
    const sql = getDB();
    console.log("in leave admin");
    
    const { from, to, employeeId } = req.query;

    try {
        let employeeCondition = sql``; // Start with an empty SQL segment
        
        // 1. Conditionally fetch user ID if employeeId filter is present
        if (employeeId) {
            const user = await sql`SELECT id FROM users WHERE employee_id = ${employeeId}`;
            if (user.length > 0) {
                // If user found, set the condition dynamically
                employeeCondition = sql`AND l.user_id = ${user[0].id}`;
            } else {
                // If employeeId provided but not found, return an empty array immediately
                return res.json([]);
            }
        }
        
        // 2. Build the final query using conditional SQL segments
        const result = await sql`
            SELECT l.*, u.name AS employee_name, u.employee_id
            FROM leaves l
            JOIN users u ON l.user_id = u.id
            WHERE 1 = 1 -- Always true starting point for conditional WHERE clauses
            ${from && to ? sql`AND l.start_date >= ${from} AND l.end_date <= ${to}` : sql``}
            ${employeeCondition}
            ORDER BY l.id DESC
        `;

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================
// Admin approves/rejects leave
// PUT /api/leaves/admin/:id/status
// ==========================
router.put('/admin/:id/status', [authMiddleware, adminMiddleware], async (req, res) => {
    const sql = getDB();
    const leaveId = req.params.id;
    const adminId = req.user.id;
    const { status } = req.body;

    if (status !== 'APPROVED' && status !== 'REJECTED') {
        return res.status(400).json({ error: 'Invalid status provided. Must be APPROVED or REJECTED.' });
    }

    try {
        const result = await sql`
            UPDATE leaves
            SET status = ${status}, approved_by = ${adminId}, approved_at = NOW()
            WHERE id = ${leaveId}
            RETURNING *
        `;

        if (!result[0]) {
            return res.status(404).json({ error: 'Leave request not found.' });
        }

        res.json({ message: `Leave request ${status.toLowerCase()} successfully.`, leave: result[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;