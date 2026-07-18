import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Fan');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, role);
    if (role === 'Staff') {
      navigate('/ops');
    } else {
      navigate('/user');
    }
  };

  return (
    <div className="flex h-screen bg-mesh font-body-md text-on-surface items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg border border-outline-variant w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-stadium-blue">login</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">StadiumPulse Login</h1>
          <p className="text-on-surface-variant font-body-md">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="nameInput" className="font-label-caps text-label-caps text-on-surface-variant mb-1 block">Full Name</label>
            <input 
              id="nameInput"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-3 bg-surface focus:ring-2 focus:ring-stadium-blue outline-none transition-all text-on-surface"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="roleInput" className="font-label-caps text-label-caps text-on-surface-variant mb-1 block">Role</label>
            <select 
              id="roleInput"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-3 bg-surface focus:ring-2 focus:ring-stadium-blue outline-none transition-all text-on-surface"
            >
              <option value="Fan">Fan</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="passwordInput" className="font-label-caps text-label-caps text-on-surface-variant mb-1 block">Password</label>
            <input 
              id="passwordInput"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-3 bg-surface focus:ring-2 focus:ring-stadium-blue outline-none transition-all text-on-surface"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-stadium-blue hover:bg-primary text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4"
          >
            <span>Secure Login</span>
            <span className="material-symbols-outlined text-sm">login</span>
          </button>
        </form>
      </div>
    </div>
  );
}
