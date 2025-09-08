import TaskListPage from "../components/TaskListPage";

export default function UpcomingPage() {
  return (
    <TaskListPage
      title="Task sắp hết hạn (3 ngày tới)"
      endpoint="/tasks/filter/upcoming"
    />
  );
}