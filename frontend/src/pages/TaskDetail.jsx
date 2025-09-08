import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function TaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${taskId}`).then(res => setTask(res.data));
  }, [taskId]);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-3">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p>{task.description}</p>

      <div>
        <p><b>Bắt đầu:</b> {task.startAt ? new Date(task.startAt).toLocaleString() : "—"}</p>
        <p><b>Kết thúc:</b> {task.dueAt ? new Date(task.dueAt).toLocaleString() : "—"}</p>
        <p><b>Priority:</b> {task.priority}</p>
        <p><b>Status:</b> {task.completed ? "✅ Completed" : "⏳ Pending"}</p>
      </div>

      <div>
        <h2 className="font-semibold mt-4">Comments</h2>
        <ul className="list-disc pl-6">
          {task.comments?.map((c, i) => (
            <li key={i}>
              {c.text} – <span className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}