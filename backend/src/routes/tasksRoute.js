import express from "express";
import TaskController from "../controllers/taskController.js";
import middleware from "../middleware.js";

const router = express.Router();

// Tất cả routes đều yêu cầu xác thực
router.use(middleware.authenticateToken);

// Validation middleware cho task
const validateTask = (req, res, next) => {
    const { title, description, startAt, dueAt, priority, labels } = req.body;
    
    if (title && title.length > 100) {
        return res.status(400).json({ error: "Task title must be less than 100 characters" });
    }
    
    if (description && description.length > 1000) {
        return res.status(400).json({ error: "Task description must be less than 1000 characters" });
    }
    
    if (dueAt && isNaN(Date.parse(dueAt))) {
        return res.status(400).json({ error: "Invalid due date format" });
    }
    
    if (startAt && isNaN(Date.parse(startAt))) {
        return res.status(400).json({ error: "Invalid start date format" });
    }
    
    const validPriorities = ["p1", "p2", "p3", "p4"];
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: "Priority must be one of: p1, p2, p3, p4" });
    }
    
    next();
};

// Routes

router.get("/search", TaskController.searchTasks);
router.get("/filter/today", TaskController.getTodayTasks);
router.get("/filter/upcoming", TaskController.getUpcomingTasks);
router.get("/filter/complete", TaskController.getCompletedTasks);

router.get("/projects/:projectId/tasks", TaskController.getTasksByProject); // Fixed this line
router.get("/sections/:sectionId", TaskController.getTasksBySection);
router.get("/users/:userId", TaskController.getTasksByUserId);
router.patch("/:taskId/status", TaskController.updateTaskStatus);
router.post("/:taskId/labels", TaskController.addLabelToTask);
router.delete("/:taskId/labels", TaskController.removeLabelFromTask);

router.get('/:taskId/comments', TaskController.getTaskComments);
router.post('/:taskId/comments', TaskController.addTaskComment);
router.delete('/:taskId/comments/:commentId', TaskController.deleteComment);

router.get("/:taskId", TaskController.getTaskById);
router.put("/:taskId", validateTask, TaskController.updateTask);
router.delete("/:taskId", TaskController.deleteTask);
router.post("/", validateTask, TaskController.createTask);

export default router;