
Patches applied summary:
- Navbar buttons dispatch custom events: open-task-modal, open-project-modal, filter-tasks (detail.filter = 'today'|'upcoming'|'complete')
- Add Task buttons dispatch open-task-modal with {projectId, sectionId} in detail
- TaskFormModal listens for open-task-modal; Save only enabled when >=1 label selected
- TaskCard includes Edit/Delete buttons and toggleComplete with PATCH to /api/tasks/:id/status
- ProjectDetail/ProjectList listen to filter-tasks and use window.__currentTaskFilter for simple filtering logic
Notes for testing:
- Start backend and frontend. Use browser console to see custom events if needed.
- To trigger Add Task modal globally: document.dispatchEvent(new CustomEvent('open-task-modal',{detail:{projectId:'<id>'}}))
