import { useState } from "react";
import TaskListPage from "../components/TaskListPage";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="max-w-6xl mx-auto p-4 flex gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="Nhập tên task..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => setSearch(query)}
        >
          Tìm
        </button>
      </div>
      {search && (
        <TaskListPage
          title={`Kết quả tìm: "${search}"`}
          endpoint="/tasks/search"
          searchQuery={search}
        />
      )}
    </div>
  );
}