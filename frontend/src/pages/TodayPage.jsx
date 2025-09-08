import TaskListPage from "../components/TaskListPage";

export default function TodayPage() {
  return (
    <TaskListPage
      title="Task hết hạn hôm nay"
      endpoint="/tasks/filter/today"
    />
  );
}