import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import TaskFormModal from '../components/TaskFormModal'
import Section from '../components/Section'

export default function ProjectDetail() {
  const { id } = useParams()
  const [tasks, setTasks] = useState([])
  const [sections, setSections] = useState([])

  const load = async () => {
    try {
      const [{ data: t }, { data: s }] = await Promise.all([
        api.get(`/tasks/projects/${id}/tasks`),
        api.get(`/sections/project/${id}`)
      ])
      setTasks(Array.isArray(t) ? t : [])
      setSections(Array.isArray(s) ? s : [])
    } catch (err) {
      console.error('Failed to load project detail:', err)
      setTasks([])
      setSections([])
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const grouped = useMemo(() => {
    const bySection = { none: [] }
    if (Array.isArray(tasks)) {
      for (const t of tasks) {
        let key = t.sectionId || 'none'
        // Nếu backend trả object thay vì string
        if (typeof key === 'object' && key._id) key = key._id
        if (!bySection[key]) bySection[key] = []
        bySection[key].push(t)
      }
    }
    return bySection
  }, [tasks])
  console.log("sections in ProjectDetail", sections)
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project</h1>
        <button
          onClick={() =>
            document.dispatchEvent(
              new CustomEvent('open-task-modal', { detail: { projectId: id } })
            )
          }
          className="px-3 py-1 rounded bg-indigo-600 text-white"
        >
          Add task
        </button>
      </div>

      <div className="space-y-6">
        <button
          onClick={async () => {
            const name = prompt('Section name?')
            if (name) {
              try {
                await api.post('/sections', { projectId: id, name })
                load()
              } catch (e) {
                console.error('Add section failed', e)
                alert(e?.response?.data?.error || 'Add section failed')
              }
            }
          }}
          className="px-3 py-1 rounded border"
        >
          + Add section
        </button>

        {Array.isArray(sections) && sections.length > 0 ? (
          sections.map(sec => (
            <Section
              key={sec._id}
              sectionId={sec._id}
              title={sec.name}
              tasks={Array.isArray(grouped[sec._id]) ? grouped[sec._id] : []}
              onUpdated={load}
              projectId={id}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">No sections</div>
        )}
        <Section
          sectionId={null}
          title="No Section"
          tasks={Array.isArray(grouped['none']) ? grouped['none'] : []}
          onUpdated={load}
          projectId={id}
        />
      </div>

      <TaskFormModal defaultProjectId={id} onCreated={load} />
    </div>
  )
}