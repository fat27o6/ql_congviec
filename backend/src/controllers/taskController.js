import taskDAO from "../models/taskDAO.js";

export default class TaskController {
    static async getTasksByProject(req, res) {
        const { projectId } = req.params;
        
        try {
            const tasks = await taskDAO.getTasksByProject(projectId);
            res.json(Array.isArray(tasks) ? tasks : [])
        } catch (e) {
            console.error("Get tasks error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async getTasksBySection(req, res) {
        const { sectionId } = req.params;
        
        try {
            const tasks = await taskDAO.getTasksBySection(sectionId);
            res.json(Array.isArray(tasks) ? tasks : [])
        } catch (e) {
            console.error("Get tasks error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async createTask(req, res) {
        const { title, description, startAt, dueAt, priority, labels, projectId, sectionId } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ error: "Task title is required" });
        }

        try {
            const taskId = await taskDAO.addTask({
                title,
                description,
                startAt,
                dueAt,
                priority,
                labels,
                projectId,
                sectionId,
                userId
            });
            
            res.status(201).json({ 
                id: taskId,
                title: title
            });
        } catch (e) {
            console.error("Create task error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async updateTask(req, res) {
        const { taskId } = req.params;
        const { title, description, startAt, dueAt, priority, labels, completed } = req.body;
        
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "At least one field is required for update" });
        }

        try {
            const updated = await taskDAO.updateTask(taskId, {
                title,
                description,
                startAt,
                dueAt,
                priority,
                labels
            });
            
            if (!updated) {
                return res.status(404).json({ error: "Task not found or no changes made" });
            }
            
            res.status(200).json({ message: "Task updated" });
        } catch (e) {
            console.error("Update task error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async getTaskComments(req, res) {
        const { taskId } = req.params;
        
        try {
            const task = await taskDAO.getTaskById(taskId);
            
            if (!task) return res.status(404).json({ error: 'Task not found' });
            if(!task.comments){
                return res.json([]);
            }
            else{
                res.status(200).json(task.comments);
            }
        } catch (e) {
            console.error("Get task by ID error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async deleteComment(req, res) {
        const { taskId, commentId } = req.params
        try {
        const success = await taskDAO.deleteComment(taskId, commentId)
        if (!success) {
            return res.status(404).json({ error: "Comment not found" })
        }
        res.json({ success: true })
        } catch (e) {
        console.error("Delete comment error:", e)
        res.status(500).json({ error: e.message })
        }
    }

    static async addTaskComment(req, res) {
        try {
            const { text } = req.body;
            const { taskId } = req.params;

            const task = await taskDAO.getTaskById(taskId);
            if (!task) return res.status(404).json({ error: 'Task not found' });

            const addcomment = await taskDAO.addComment(taskId, text);
            res.status(200).json(addcomment);

        } catch (e) {
            console.error(`Unable to update task status: ${e}`)
            throw e
        }
    }

    // Additional methods that might be needed based on your existing implementation
    static async deleteTask(req, res) {
        const { taskId } = req.params;
        
        try {
            const deleted = await taskDAO.deleteTask(taskId);
            
            if (!deleted) {
                return res.status(404).json({ error: "Task not found" });
            }
            
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (e) {
            console.error("Delete task error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async getTaskById(req, res) {
        const { taskId } = req.params;
        
        try {
            const task = await taskDAO.getTaskById(taskId);
            
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            
            res.status(200).json(task);
        } catch (e) {
            console.error("Get task by ID error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async getTaskComplete(req, res) {
        const userId = req.user.id;
        
        try {
            const task = await taskDAO.getTasksComplete(userId);
            
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            
            res.status(200).json(task);
        } catch (e) {
            console.error("Get task complete error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async getTasksByUserId(req, res) {
        const { userId } = req.params;
        
        try {
            const tasks = await taskDAO.getTasksByUserId(userId);
            res.status(200).json(tasks);
        } catch (e) {
            console.error("Get tasks by user ID error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async searchTasks(req, res) {
        try {
            const userId = req.user.id;
            const { query } = req.query;
            const tasks = await taskDAO.searchTasks(query || "", userId);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getTodayTasks(req, res) {
        try {
            const userId = req.user.id;
            const tasks = await taskDAO.getTodayTasks(userId);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getUpcomingTasks(req, res) {
        try {
            const userId = req.user.id; 
            const tasks = await taskDAO.getUpcomingTasks(userId);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getCompletedTasks(req, res) {
        try {
            const userId = req.user.id;
            const tasks = await taskDAO.getCompletedTasks(userId);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async updateTaskStatus(req, res) {
        const { taskId } = req.params;

        try {
            const updated = await taskDAO.updateTaskStatus(taskId);
            
            if (!updated) {
                return res.status(404).json({ error: "Task not found" });
            }
            
            res.status(200).json({ message: "Task status updated successfully" });
        } catch (e) {
            console.error("Update task status error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async addLabelToTask(req, res) {
        const { taskId } = req.params;
        const { labelId } = req.body;
        
        if (!labelId) {
            return res.status(400).json({ error: "Label ID is required" });
        }

        try {
            const updated = await taskDAO.addLabelToTask(taskId, labelId);
            
            if (!updated) {
                return res.status(404).json({ error: "Task or label not found" });
            }
            
            res.status(200).json({ message: "Label added to task successfully" });
        } catch (e) {
            console.error("Add label to task error:", e);
            res.status(500).json({ error: e.message });
        }
    }

    static async removeLabelFromTask(req, res) {
        const { taskId } = req.params;
        const { labelId } = req.body;
        
        if (!labelId) {
            return res.status(400).json({ error: "Label ID is required" });
        }

        try {
            const updated = await taskDAO.removeLabelFromTask(taskId, labelId);
            
            if (!updated) {
                return res.status(404).json({ error: "Task or label not found" });
            }
            
            res.status(200).json({ message: "Label removed from task successfully" });
        } catch (e) {
            console.error("Remove label from task error:", e);
            res.status(500).json({ error: e.message });
        }
    }
}