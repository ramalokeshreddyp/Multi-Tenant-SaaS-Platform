const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../config/db');

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    let totalProjects, activeTasks, completedTasks, teamMembers;

    // Super Admin sees ALL tenants
    if (role === 'super_admin') {
      totalProjects = await db.query(`SELECT COUNT(*) FROM projects`);
      activeTasks = await db.query(`SELECT COUNT(*) FROM tasks WHERE status = 'todo'`);
      completedTasks = await db.query(`SELECT COUNT(*) FROM tasks WHERE status = 'completed'`);
      teamMembers = await db.query(`SELECT COUNT(*) FROM users`);
    } 
    // Tenant users see ONLY their tenant
    else {
      totalProjects = await db.query(
        `SELECT COUNT(*) FROM projects WHERE tenant_id = $1`,
        [tenantId]
      );

      activeTasks = await db.query(
        `SELECT COUNT(*) FROM tasks WHERE tenant_id = $1 AND status = 'todo'`,
        [tenantId]
      );

      completedTasks = await db.query(
        `SELECT COUNT(*) FROM tasks WHERE tenant_id = $1 AND status = 'completed'`,
        [tenantId]
      );

      teamMembers = await db.query(
        `SELECT COUNT(*) FROM users WHERE tenant_id = $1`,
        [tenantId]
      );
    }

    res.json({
      totalProjects: Number(totalProjects.rows[0].count),
      activeTasks: Number(activeTasks.rows[0].count),
      completedTasks: Number(completedTasks.rows[0].count),
      teamMembers: Number(teamMembers.rows[0].count)
    });

  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ message: 'Dashboard error' });
  }
});

module.exports = router;
