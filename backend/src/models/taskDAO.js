import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let tasks // Separate tasks collection
export default class taskDAO {
    static async injectDB(conn) {
        if (tasks) {
            return
        }
        try {
            tasks = await conn.db(process.env.QLCV_DB_NAME).collection("tasks")
            // Create indexes for better performance
            await tasks.createIndex({ projectId: 1 })
            await tasks.createIndex({ sectionId: 1 })
            await tasks.createIndex({ assigneeId: 1 })
            await tasks.createIndex({ title: "text" })
        } catch (e) {
            console.error(`Unable to establish a collection handle in taskDAO: ${e}`)
        }
    }

    static async addTask(taskData) {
        try {
            const taskDoc = {
                _id: new ObjectId(),
                title: taskData.title,
                description: taskData.description || "",
                startAt: taskData.startAt ? new Date(taskData.startAt) : null,
                dueAt: taskData.dueAt ? new Date(taskData.dueAt) : null,
                priority: taskData.priority || "medium",
                labels: taskData.labels || [],
                projectId: new ObjectId(taskData.projectId),
                sectionId: taskData.sectionId ? new ObjectId(taskData.sectionId) : null,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: new ObjectId(taskData.userId)
            }
            
            const result = await tasks.insertOne(taskDoc)
            return result.insertedId
        } catch (e) {
            console.error(`Unable to add task: ${e}`)
            throw e
        }
    }

    static async getTasksByProject(projectId) {
        try {
            const cursor = await tasks.find(
                {   projectId: new ObjectId(projectId),
                    sectionId: null
                }
            ).sort({ createdAt: 1 })
            
            return await cursor.toArray()
        } catch (e) {
            console.error(`Unable to get tasks by project: ${e}`)
            throw e
        }
    }

    static async getTasksBySection(sectionId) {
        try {
            const cursor = await tasks.find({
                sectionId: new ObjectId(sectionId)
            }).sort({ createdAt: 1 })
            
            return await cursor.toArray()
        } catch (e) {
            console.error(`Unable to get tasks by section: ${e}`)
            throw e
        }
    }

    static async getTasksComplete(userId) {
        try {
            const cursor = await tasks.find({
                userId: new ObjectId(userId),
                completed: true
            }).sort({ createdAt: 1 })
            
            return await cursor.toArray()
        } catch (e) {
            console.error(`Unable to get tasks completed: ${e}`)
            throw e
        }
    }

    static async updateTask(taskId, updateData) {
        try {
            const updateFields = { updatedAt: new Date() };
            
            // Add only the fields that are provided
            if (updateData.title !== undefined) updateFields.title = updateData.title;
            if (updateData.description !== undefined) updateFields.description = updateData.description;
            if (updateData.startAt !== undefined) updateFields.startAt = updateData.startAt ? new Date(updateData.startAt) : null;
            if (updateData.dueAt !== undefined) updateFields.dueAt = updateData.dueAt ? new Date(updateData.dueAt) : null;
            if (updateData.priority !== undefined) updateFields.priority = updateData.priority;
            if (updateData.labels !== undefined) updateFields.labels = updateData.labels;
            
            const result = await tasks.updateOne(
                { _id: new ObjectId(taskId) },
                { $set: updateFields }
            )
            
            return result.modifiedCount > 0
        } catch (e) {
            console.error(`Unable to update task: ${e}`)
            throw e
        }
    }

    static async deleteTask(taskId) {
        try {
            const result = await tasks.deleteOne(
                { _id: new ObjectId(taskId) }
            )
            
            return result.deletedCount > 0
        } catch (e) {
            console.error(`Unable to delete task: ${e}`)
            throw e
        }
    }

    static async getTaskById(taskId) {
        try {
            const pipeline = [
            { $match: { _id: new ObjectId(taskId) } },
            {
                $lookup: {
                from: "labels",           // tên collection labels
                localField: "labels",     // field trong task
                foreignField: "_id",      // so với label._id
                as: "labelDetails"
                }
            },
            {
                $project: {
                _id: 1,
                title: 1,
                description: 1,
                startAt: 1,
                dueAt: 1,
                priority: 1,
                completed: 1,
                comments: 1,
                projectId: 1,
                sectionId: 1,
                userId: 1,
                createdAt: 1,
                updatedAt: 1,
                labels: "$labelDetails"   // trả mảng object label { _id, name, ... }
                }
            }
            ];

            const results = await tasks.aggregate(pipeline).toArray();
            return results[0];
        } catch (e) {
            console.error(`Unable to get task by ID with labels: ${e}`);
            throw e;
        }
    }

    static async getTasksByUserId(userId) {
        try {
            const cursor = await tasks.find(
                { userId: new ObjectId(userId) }
            ).sort({ createdAt: 1 })
            
            return await cursor.toArray()
        } catch (e) {
            console.error(`Unable to get tasks by user ID: ${e}`)
            throw e
        }
    }

    static async searchTasks(query, userId) {
        try {
            const pipeline = [
            {
                $match: {
                userId: new ObjectId(userId),
                title: { $regex: query, $options: "i" }
                }
            },
            {
                $lookup: {
                from: "labels",
                localField: "labels",
                foreignField: "_id",
                as: "labelDetails"
                }
            },
            {
                $project: {
                _id: 1,
                title: 1,
                dueAt: 1,
                completed: 1,
                priority: 1,
                labels: "$labelDetails"
                }
            }
            ];
            return await tasks.aggregate(pipeline).toArray();
        } catch (e) {
            console.error(`Unable to search tasks: ${e}`)
            throw e
        }
    }

    static async getTodayTasks(userId) {
        const start = new Date(); start.setHours(0,0,0,0);
        const end = new Date(); end.setHours(23,59,59,999);
        const pipeline = [
            {
                $match: {
                userId: new ObjectId(userId),
                dueAt: { $gte: start, $lte: end },
                completed: false
                }
            },
            {
                $lookup: {
                from: "labels",
                localField: "labels",
                foreignField: "_id",
                as: "labelDetails"
                }
            },
            {
                $project: {
                _id: 1,
                title: 1,
                dueAt: 1,
                completed: 1,
                priority: 1,
                labels: "$labelDetails"
                }
            }
        ];
        return await tasks.aggregate(pipeline).toArray();
    }

    static async getUpcomingTasks(userId) {
        const today = new Date();
        const upcoming = new Date();
        upcoming.setDate(today.getDate() + 3);
        const pipeline = [
            {
                $match: {
                userId: new ObjectId(userId),
                dueAt: { $gt: today, $lte: upcoming },
                completed: false
                }
            },
            {
                $lookup: {
                from: "labels",
                localField: "labels",
                foreignField: "_id",
                as: "labelDetails"
                }
            },
            {
                $project: {
                _id: 1,
                title: 1,
                dueAt: 1,
                completed: 1,
                priority: 1,
                labels: "$labelDetails"
                }
            }
        ];
        return await tasks.aggregate(pipeline).toArray();
    }

    static async getCompletedTasks(userId) {
        const pipeline = [
            {
                $match: {
                userId: new ObjectId(userId),
                completed: true
                }
            },
            {
                $lookup: {
                from: "labels",
                localField: "labels",
                foreignField: "_id",
                as: "labelDetails"
                }
            },
            {
                $project: {
                _id: 1,
                title: 1,
                dueAt: 1,
                completed: 1,
                priority: 1,
                labels: "$labelDetails"
                }
            }
        ];
        return await tasks.aggregate(pipeline).toArray();
    }

    static async updateTaskStatus(taskId) {
        try {
            const task = await tasks.findOne({ _id: new ObjectId(taskId) })
            if (!task) {
                throw new Error("Task not found")
            }
            
            // Update task status to completed
            const result = await tasks.updateOne(
                { _id: new ObjectId(taskId) },
                { 
                    $set: {
                        completed: !task.completed,
                        updatedAt: new Date()
                    } 
                }
            )
            
            return result.modifiedCount > 0
        } catch (e) {
            console.error(`Unable to update task status: ${e}`)
            throw e
        }
    }

    static async addComment(taskId, comment) {
        try {
            const newComment = {
                _id: new ObjectId(),
                text: comment,
                createdAt: new Date(),
            };
            const result = await tasks.updateOne(
                { _id: new ObjectId(taskId) },
                { $push: {
                        comments: newComment
                    }
                }
            )
            return result;
        } catch (e) {
            console.error(`Unable to add label to task: ${e}`)
            throw e
        }
    }

    static async deleteComment(taskId, commentId) {
        try {
            const result = await tasks.updateOne(
            { _id: new ObjectId(taskId) },
            { $pull: { comments: { _id: new ObjectId(commentId) } } }
            )
            if (result.matchedCount === 0) {
            throw new Error("Task not found")
            }
            return result
        } catch (e) {
            console.error(`Unable to delete comment: ${e}`)
            throw e
        }
    }

    static async addLabelToTask(taskId, labelId) {
        try {
            const result = await tasks.updateOne(
                { _id: new ObjectId(taskId) },
                { 
                    $addToSet: { labels: new ObjectId(labelId) },
                    $set: { updatedAt: new Date() }
                }
            )
            
            return result.modifiedCount > 0
        } catch (e) {
            console.error(`Unable to add label to task: ${e}`)
            throw e
        }
    }

    static async removeLabelFromTask(taskId, labelId) {
        try {
            const result = await tasks.updateOne(
                { _id: new ObjectId(taskId) },
                { 
                    $pull: { labels: new ObjectId(labelId) },
                    $set: { updatedAt: new Date() }
                }
            )
            
            return result.modifiedCount > 0
        } catch (e) {
            console.error(`Unable to remove label from task: ${e}`)
            throw e
        }
    }

    static async getTasksWithLabels(labelIds) {
        try {
            const objectIds = labelIds.map(id => new ObjectId(id))
            const cursor = await tasks.find(
                { labels: { $in: objectIds } }
            ).sort({ createdAt: 1 })
            
            return await cursor.toArray()
        } catch (e) {
            console.error(`Unable to get tasks with labels: ${e}`)
            throw e
        }
    }

    static async updateTasksByProject(projectId, updateData) {
        try {
            const result = await tasks.updateMany(
                { projectId: new ObjectId(projectId) },
                { $set: updateData }
            )
            
            return result.modifiedCount
        } catch (e) {
            console.error(`Unable to bulk update tasks by project: ${e}`)
            throw e
        }
    }

    static async deleteTasksByProject(projectId) {
        try {
            const result = await tasks.deleteMany(
                { projectId: new ObjectId(projectId) }
            )
            
            return result.deletedCount
        } catch (e) {
            console.error(`Unable to bulk delete tasks by project: ${e}`)
            throw e
        }
    }

    static async deleteTasksBySection(sectionId) {
        try {
            const result = await tasks.deleteMany(
                { sectionId: new ObjectId(sectionId) }
            )
            
            return result.deletedCount
        } catch (e) {
            console.error(`Unable to bulk delete tasks by section: ${e}`)
            throw e
        }
    }
}