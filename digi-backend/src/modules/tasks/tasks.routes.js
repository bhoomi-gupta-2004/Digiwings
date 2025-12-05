// backend/src/modules/tasks/tasks.routes.js

const router = require('express').Router();
const { getDB } = require('../../config/db');
const { authMiddleware } = require('../../middlewares/auth');

// ==========================
// GET all tasks for the logged-in user
// GET /api/tasks
// ==========================
router.get('/', authMiddleware, async (req, res) => {
  const sql = getDB();
  const userId = req.user.id;

  try {
    const tasks = await sql`
      SELECT * FROM tasks
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// POST a new task
// POST /api/tasks
// ==========================
router.post('/', authMiddleware, async (req, res) => {
  console.log("in todo");
  
  const sql = getDB();
  const userId = req.user.id;
  const { title, description, dueDate, category, priority } = req.body;

  try {
    const result = await sql`
      INSERT INTO tasks (title, description, due_date, category, priority, user_id)
      VALUES (${title}, ${description}, ${dueDate}, ${category}, ${priority}, ${userId})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// PUT to toggle task completion
// PUT /api/tasks/:id
// ==========================
router.put('/:id', authMiddleware, async (req, res) => {
  const sql = getDB();
  const taskId = req.params.id;
  const userId = req.user.id;
  const { completed } = req.body;

  try {
    const result = await sql`
      UPDATE tasks
      SET completed = ${completed}
      WHERE id = ${taskId} AND user_id = ${userId}
      RETURNING *
    `;

    if (!result[0]) {
      return res.status(404).json({ error: 'Task not found or you do not have permission.' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error('Error toggling task completion:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// DELETE a task
// DELETE /api/tasks/:id
// ==========================
router.delete('/:id', authMiddleware, async (req, res) => {
  const sql = getDB();
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await sql`
      DELETE FROM tasks
      WHERE id = ${taskId} AND user_id = ${userId}
      RETURNING *
    `;

    if (!result[0]) {
      return res.status(404).json({ error: 'Task not found or you do not have permission.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
