import TaskListPage from "../components/TaskListPage";

export default function CompletePage() {
  return (
    <TaskListPage
      title="Task đã hoàn thành"
      endpoint="/tasks/filter/complete"
    />
  );
}
