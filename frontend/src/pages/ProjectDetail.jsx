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
        api.get(`/sections/projects/${id}`)
      ])
      setTasks(Array.isArray(t) ? t : [])
      setSections(Array.isArray(s) ? s : [])
    } catch (err) {
      console.error('Failed to load project detail:', err)
      setTasks([])
      setSections([])
    }
  }

  useEffect(() => { load() }, [id])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project</h1>
        <button
          onClick={() =>
            document.dispatchEvent(
              new CustomEvent('open-task-modal', { detail: { projectId: id, sectionId: null } })
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
              sectionId={sec._id} // giữ ObjectId
              title={sec.name}
              onUpdated={load}
              projectId={id}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">No sections</div>
        )}

        {/* Tasks không có section */}
        <Section
          sectionId={null}
          title="No Section"
          onUpdated={load}
          projectId={id}
        />
      </div>

      <TaskFormModal defaultProjectId={id} onCreated={load} />
    </div>
  )
}