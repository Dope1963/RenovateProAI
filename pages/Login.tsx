import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface LoginProps {
  setUserRole: (role: UserRole) => void;
  setAdminName: (name: string) => void;
  setAdminProfileImage: (url: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setUserRole, setAdminName, setAdminProfileImage }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      if (user.role === UserRole.ADMIN) {
        setUserRole(UserRole.ADMIN);
        setAdminName(user.name);
        setAdminProfileImage(user.profileImage);
        navigate('/admin');
      } else if (user.role === UserRole.CONTRACTOR) {
        setUserRole(UserRole.CONTRACTOR);
        // Note: Contractor profile state is currently handled locally in Layout/Dashboard
        // In a full app, we would set global contractor state here too
        navigate('/app');
      }
    } else {
      setError('Invalid email or password.');
    }
  };

  const quickFill = (role: 'admin' | 'contractor') => {
    if (role === 'admin') {
      setEmail('admin@renovatepro.ai');
      setPassword('password');
    } else {
      setEmail('mike@example.com');
      setPassword('password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your projects
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder="name@work-email.com"
              />
            </div>
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                  Forgot password?
                </a>
               </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors shadow-md"
            >
              Sign In
            </button>
          </div>
        </form>
         
         <div className="border-t pt-4">
           <p className="text-xs text-center text-slate-400 mb-2">Demo Quick Fill</p>
           <div className="flex gap-2 justify-center">
             <button 
                type="button" 
                onClick={() => quickFill('admin')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded"
             >
               Admin
             </button>
             <button 
                type="button" 
                onClick={() => quickFill('contractor')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded"
             >
               Contractor
             </button>
           </div>
         </div>

         <div className="text-center mt-6 space-y-3">
           <p className="text-sm text-slate-600">
             Don't have an account?{' '}
             <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-500">
               Sign up for free
             </Link>
           </p>
         </div>
      </div>
    </div>
  );
};