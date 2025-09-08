// src/pages/TaskListPage.jsx
import { useEffect, useState } from "react";
import { api } from "../api";
import TaskCard from "../components/TaskCard";

export default function TaskListPage({ title, endpoint, searchQuery }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    let url = endpoint;
    if (searchQuery) url += `?query=${encodeURIComponent(searchQuery)}`;
    const res = await api.get(url);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [endpoint, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      {tasks.length === 0 ? (
        <p className="text-gray-500">Không có task nào</p>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onStatusChange={fetchTasks}/>
          ))}
        </div>
      )}
    </div>
  );
}