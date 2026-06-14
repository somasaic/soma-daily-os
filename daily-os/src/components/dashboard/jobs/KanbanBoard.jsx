import { useState } from 'react'
import {
  DndContext, closestCorners, DragOverlay,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDashboard } from '../../../store/DashboardContext'
import { KANBAN_COLUMNS } from '../../../constants/dashboard'
import JobCard from './JobCard'

export default function KanbanBoard({ toast }) {
  const { state, dispatch } = useDashboard()
  const { jobs } = state
  const [activeJob, setActiveJob] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragStart(event) {
    const { active } = event
    setActiveJob(jobs.find(j => j.id === active.id))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveJob(null)
    if (!over) return

    const jobId = active.id
    // over could be a column id or another job id
    let newStatus = over.id

    // If dropped over another job, find that job's column
    const overJob = jobs.find(j => j.id === over.id)
    if (overJob) newStatus = overJob.status

    // Verify it's a valid column
    if (KANBAN_COLUMNS.find(c => c.id === newStatus)) {
      const job = jobs.find(j => j.id === jobId)
      if (job && job.status !== newStatus) {
        dispatch({ type: 'MOVE_JOB', id: jobId, status: newStatus })
        toast?.(`Moved to ${KANBAN_COLUMNS.find(c => c.id === newStatus)?.label}`)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {KANBAN_COLUMNS.map(col => {
          const colJobs = jobs.filter(j => j.status === col.id)
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              jobs={colJobs}
              toast={toast}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeJob ? (
          <div style={{ transform: 'rotate(3deg)', opacity: 0.9 }}>
            <JobCard job={activeJob} toast={toast} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({ column, jobs, toast }) {
  return (
    <div className="kanban-col" data-status={column.id} id={column.id}>
      <div className="kanban-col-header">
        <span className="kanban-col-title" style={{ color: column.color }}>
          {column.label}
        </span>
        <span className="kanban-col-count" style={{ background: column.color + '22', color: column.color }}>
          {jobs.length}
        </span>
      </div>
      <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
        <div className="kanban-cards" id={column.id}>
          {jobs.length === 0 ? (
            <div className="kanban-empty">Drop here</div>
          ) : (
            jobs.map(job => (
              <JobCard key={job.id} job={job} toast={toast} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
