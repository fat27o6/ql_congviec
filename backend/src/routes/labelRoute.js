// backend/src/routes/labelRoute.js
import express from "express";
import LabelController from "../controllers/labelController.js";
import middleware from "../middleware.js";

const router = express.Router();

// All label routes require authentication
router.use(middleware.authenticateToken);

// CRUD
router.get("/", LabelController.listLabels);        // GET /api/labels
router.post("/", LabelController.createLabel);      // POST /api/labels
router.get("/:id", LabelController.getLabel);       // GET /api/labels/:id
router.put("/:id", LabelController.updateLabel);    // PUT /api/labels/:id
router.delete("/:id", LabelController.deleteLabel); // DELETE /api/labels/:id

export default router;
