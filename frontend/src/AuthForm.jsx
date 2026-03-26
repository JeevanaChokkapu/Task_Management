import { useState } from 'react';
import { Link } from 'react-router-dom';

function AuthForm({ onSubmit, mode }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
    onSubmit(payload, mode);
  };

  return (
    <div className="auth-card">
      <h2>{mode === 'login' ? 'Login' : 'Sign up'}</h2>
      <form onSubmit={submit}>
        {mode === 'signup' && (
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
        )}
        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
        </label>
        <label>
          Password
          <input name="password" value={form.password} onChange={handleChange} type="password" required minLength={6} />
        </label>
        <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
      <div className="auth-footer">
        {mode === 'login' ? (
          <Link to="/signup">Create account</Link>
        ) : (
          <Link to="/login">Already have an account?</Link>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
