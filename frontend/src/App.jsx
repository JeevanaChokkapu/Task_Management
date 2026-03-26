import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { login, signup, getTasks, createTask, updateTask, deleteTask } from './api';
import TaskDashboard from './TaskDashboard';
import AuthForm from './AuthForm';

const tokenKey = 'task_token';

const ProtectedRoute = ({ children, token }) => {
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem(tokenKey) || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('task_user') || 'null'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tasksState, setTasksState] = useState({ tasks: [], analytics: { total: 0, done: 0, pending: 0, completionRate: 0 } });
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  const navigate = useNavigate();

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, filters]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTasks(token, filters);
      setTasksState(res);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      if (err.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values, mode) => {
    setLoading(true);
    setError('');
    try {
      const response = mode === 'login' ? await login(values) : await signup(values);
      localStorage.setItem(tokenKey, response.token);
      localStorage.setItem('task_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem('task_user');
    setToken('');
    setUser(null);
    navigate('/login');
  };

  const handleCreate = async (data) => {
    setLoading(true);
    setError('');
    try {
      await createTask(token, data);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Create task failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updates) => {
    setLoading(true);
    setError('');
    try {
      await updateTask(token, id, updates);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Update task failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteTask(token, id);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Delete task failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Task Management</h1>
        {token && (
          <div className="header-actions">
            <strong>{user?.name}</strong>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>
      {error && <div className="banner error">{error}</div>}
      {loading && <div className="banner info">Loading...</div>}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute token={token}>
              <TaskDashboard
                tasksState={tasksState}
                filters={filters}
                setFilters={setFilters}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<AuthForm onSubmit={handleLogin} mode="login" />} />
        <Route path="/signup" element={<AuthForm onSubmit={handleLogin} mode="signup" />} />
      </Routes>
    </div>
  );
}

export default App;
