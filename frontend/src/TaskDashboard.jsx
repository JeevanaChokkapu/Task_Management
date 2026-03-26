import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

const priorityLevels = ['Low', 'Medium', 'High'];
const statusList = ['Todo', 'In Progress', 'Done'];

function TaskDashboard({ tasksState, filters, setFilters, onCreate, onUpdate, onDelete }) {
  const [draft, setDraft] = useState({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' });
  const [editId, setEditId] = useState(null);

  const groupByStatus = useMemo(() => {
    const grouped = { Todo: [], 'In Progress': [], Done: [] };
    tasksState.tasks.forEach((task) => grouped[task.status].push(task));
    return grouped;
  }, [tasksState.tasks]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const payload = { ...draft, dueDate: draft.dueDate || null };
    if (editId) {
      onUpdate(editId, payload);
      setEditId(null);
    } else {
      onCreate(payload);
    }
    setDraft({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' });
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setDraft({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
    });
  };

  return (
    <section className="dashboard">
      <div className="analytics">
        <div className="stat">Total: {tasksState.analytics.total}</div>
        <div className="stat">Done: {tasksState.analytics.done}</div>
        <div className="stat">Pending: {tasksState.analytics.pending}</div>
        <div className="stat">Completion: {tasksState.analytics.completionRate}%</div>
      </div>

      <div className="filters">
        <input placeholder="Search title" value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
        <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
          <option value="">All statuses</option>
          {statusList.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}>
          <option value="">All priorities</option>
          {priorityLevels.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="form-card">
        <h2>{editId ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={onSubmit}>
          <label>
            Title
            <input
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            />
          </label>
          <label>
            Status
            <select value={draft.status} onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}>
              {statusList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>
            Priority
            <select value={draft.priority} onChange={(e) => setDraft((prev) => ({ ...prev, priority: e.target.value }))}>
              {priorityLevels.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label>
            Due Date
            <input type="date" value={draft.dueDate} onChange={(e) => setDraft((prev) => ({ ...prev, dueDate: e.target.value }))} />
          </label>
          <div className="form-actions">
            <button type="submit">{editId ? 'Update Task' : 'Create Task'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setDraft({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="board">
        {statusList.map((status) => (
          <div key={status} className="column">
            <h3>{status} ({groupByStatus[status].length})</h3>
            {groupByStatus[status].map((task) => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Due: {task.dueDate ? dayjs(task.dueDate).format('MMM DD, YYYY') : 'N/A'}</p>
                <div className="card-actions">
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => onDelete(task._id)}>Delete</button>
                  {task.status !== 'Done' && <button onClick={() => onUpdate(task._id, { status: 'Done' })}>Mark Done</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TaskDashboard;
