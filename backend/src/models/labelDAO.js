// backend/src/models/labelDAO.js
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let labelsCollection;

export default class LabelDAO {
  static async injectDB(conn) {
    if (labelsCollection) return;
    try {
      labelsCollection = await conn.db(process.env.QLCV_DB_NAME).collection("labels");
      await labelsCollection.createIndex({ userId: 1 });
      await labelsCollection.createIndex({ name: 1 });
    } catch (e) {
      console.error("LabelDAO injectDB:", e);
    }
  }

  static async addLabel(userId, name) {
    try {
      const newDoc = {
        name: name.trim(),
        userId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const r = await labelsCollection.insertOne(newDoc);
      return r.insertedId;
    } catch (e) {
      console.error("Unable to add label:", e);
      throw e;
    }
  }

  static async getLabelsByUser(userId) {
    try {
      const cursor = await labelsCollection.find({ userId: new ObjectId(userId) }).sort({ name: 1 });
      return cursor.toArray();
    } catch (e) {
      console.error("Unable to get labels:", e);
      throw e;
    }
  }

  static async getLabelById(labelId) {
    try {
      return await labelsCollection.findOne({ _id: new ObjectId(labelId) });
    } catch (e) {
      console.error("Unable to get label by id:", e);
      throw e;
    }
  }

  static async updateLabel(userId, labelId, name) {
    try {
      const res = await labelsCollection.updateOne(
        { _id: new ObjectId(labelId), userId: new ObjectId(userId) },
        { $set: { name: name.trim(), updatedAt: new Date() } }
      );
      return res.modifiedCount > 0;
    } catch (e) {
      console.error("Unable to update label:", e);
      throw e;
    }
  }

  static async deleteLabel(userId, labelId) {
    try {
      const res = await labelsCollection.deleteOne({ _id: new ObjectId(labelId), userId: new ObjectId(userId) });
      return res.deletedCount > 0;
    } catch (e) {
      console.error("Unable to delete label:", e);
      throw e;
    }
  }
}