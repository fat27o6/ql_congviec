// backend/src/controllers/labelController.js
import labelDAO from "../models/labelDAO.js";

export default class LabelController {
  static async createLabel(req, res) {
    const { name } = req.body;
    const userId = req.user && req.user.id;
    if (!name) return res.status(400).json({ error: "Label name is required" });

    try {
      const labelId = await labelDAO.addLabel(userId, name);
      // return the created label object if possible
      const label = await labelDAO.getLabelById(labelId);
      res.status(201).json(label || { _id: labelId, name });
    } catch (e) {
      console.error("Create label error:", e);
      res.status(500).json({ error: e.message });
    }
  }

  static async listLabels(req, res) {
    const userId = req.user && req.user.id;
    try {
      const labels = await labelDAO.getLabelsByUser(userId);
      res.status(200).json(labels);
    } catch (e) {
      console.error("List labels error:", e);
      res.status(500).json({ error: e.message });
    }
  }

  static async updateLabel(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user && req.user.id;
    if (!name) return res.status(400).json({ error: "Name required" });
    try {
      const ok = await labelDAO.updateLabel(userId, id, name);
      if (!ok) return res.status(404).json({ error: "Label not found" });
      const updated = await labelDAO.getLabelById(id);
      res.status(200).json(updated);
    } catch (e) {
      console.error("Update label error:", e);
      res.status(500).json({ error: e.message });
    }
  }

  static async deleteLabel(req, res) {
    const { id } = req.params;
    const userId = req.user && req.user.id;
    try {
      const ok = await labelDAO.deleteLabel(userId, id);
      if (!ok) return res.status(404).json({ error: "Label not found or not allowed" });
      res.status(200).json({ success: true });
    } catch (e) {
      console.error("Delete label error:", e);
      res.status(500).json({ error: e.message });
    }
  }

  // Optionally add getLabel by id
  static async getLabel(req, res) {
    const { id } = req.params;
    try {
      const label = await labelDAO.getLabelById(id);
      if (!label) return res.status(404).json({ error: "Label not found" });
      res.json(label);
    } catch (e) {
      console.error("Get label error:", e);
      res.status(500).json({ error: e.message });
    }
  }
}
