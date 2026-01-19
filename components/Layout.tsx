import React from 'react';
import { UserRole } from '../types';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  adminProfileImage?: string;
  adminName?: string;
  contractorName?: string;
  contractorProfileImage?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userRole, 
  setUserRole, 
  adminProfileImage, 
  adminName,
  contractorName,
  contractorProfileImage
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    setUserRole(UserRole.VISITOR);
    navigate('/');
  };

  const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
    <Link 
      to={to} 
      className="text-slate-600 hover:text-brand-600 font-medium px-3 py-2 transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  );

  // Determine where the logo/brand name links to based on user role
  const brandLink = userRole === UserRole.CONTRACTOR ? '/app' : (userRole === UserRole.ADMIN ? '/admin' : '/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to={brandLink} 
                className="flex items-center gap-2"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">R</div>
                <span className="font-bold text-xl tracking-tight text-slate-900">RenovatePro<span className="text-brand-600">AI</span></span>
              </Link>
            </div>

            {/* Desktop Nav - Hidden on Login Page */}
            {location.pathname !== '/login' && (
              <div className="hidden md:flex items-center space-x-4">
                {userRole === UserRole.VISITOR && (
                  <>
                    <NavLink to="/" label="Home" onClick={() => window.scrollTo(0, 0)} />
                    <NavLink to="/#pricing" label="Pricing" />
                    <NavLink to="/#features" label="Features" />
                    <Link 
                      to="/login"
                      className="text-slate-600 font-medium px-3 py-2 hover:text-brand-600"
                    >
                      Login
                    </Link>
                    <button 
                       onClick={() => navigate('/signup')}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 shadow-md"
                    >
                      Sign Up
                    </button>
                  </>
                )}

                {userRole === UserRole.CONTRACTOR && (
                  <>
                    <NavLink to="/app" label="Projects" />
                    <NavLink to="/app/settings" label="Settings" />
                    <button 
                      onClick={handleLogout}
                      className="text-slate-500 hover:text-red-500 text-sm font-medium ml-2"
                    >
                      Sign Out
                    </button>
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                       <div className="text-right hidden lg:block">
                          <div className="text-sm font-bold text-slate-700">{contractorName}</div>
                       </div>
                       <Link to="/app/settings" className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300 hover:ring-2 hover:ring-brand-500 transition-all">
                         <img src={contractorProfileImage || "https://picsum.photos/100/100?u=1"} alt="Profile" className="w-full h-full object-cover" />
                       </Link>
                    </div>
                  </>
                )}
                   {userRole === UserRole.ADMIN && (
                  <>
                    <NavLink to="/admin" label="Admin Dashboard" />
                    <button onClick={handleLogout} className="text-red-500 text-sm font-medium">Logout</button>
                    {adminName && <span className="text-sm font-bold text-slate-700">{adminName}</span>}
                    <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                      <img src={adminProfileImage || "https://picsum.photos/100/100?u=2"} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button - Hidden on Login Page */}
            {location.pathname !== '/login' && (
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && location.pathname !== '/login' && (
           <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-lg">
             {userRole === UserRole.VISITOR ? (
               <>
                 <Link 
                   to="/" 
                   className="block p-2 text-slate-700 hover:bg-slate-50" 
                   onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}
                 >
                   Home
                 </Link>
                 <Link to="/#pricing" className="block p-2 text-slate-700 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                 <Link 
                    to="/login"
                    className="block w-full text-left p-2 text-slate-700 font-bold hover:bg-slate-50"
                    onClick={() => setIsMenuOpen(false)}
                 >
                    Login
                 </Link>
                 <button onClick={() => { navigate('/signup'); setIsMenuOpen(false); }} className="block w-full text-left p-2 text-brand-600 font-bold">Sign Up Free</button>
                 <button onClick={() => { setUserRole(UserRole.ADMIN); navigate('/admin'); setIsMenuOpen(false); }} className="block w-full text-left p-2 text-slate-400 text-xs">Admin Login (Demo)</button>
               </>
             ) : (
                <>
                  {userRole === UserRole.CONTRACTOR && (
                    <>
                      <Link to="/app" className="block p-2 text-slate-700 font-medium" onClick={() => setIsMenuOpen(false)}>My Projects</Link>
                      <Link to="/app/settings" className="block p-2 text-slate-700 font-medium" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                    </>
                  )}
                  {userRole === UserRole.ADMIN && (
                     <Link to="/admin" className="block p-2 text-slate-700 font-medium" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left p-2 text-red-600 font-bold">Sign Out</button>
                </>
             )}
           </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {location.pathname !== '/login' && location.pathname !== '/signup' && !location.pathname.startsWith('/app') && !location.pathname.startsWith('/admin') && (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center text-white font-bold text-sm">R</div>
                 <span className="text-white font-bold text-lg">RenovateProAI</span>
              </div>
              <p className="text-sm">Helping contractors win more jobs with instant AI visualizations.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/#features" className="hover:text-white">Features</Link></li>
                <li><Link to="/#pricing" className="hover:text-white">Pricing</Link></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
               <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><Link to="/legal" className="hover:text-white">Privacy & Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Start Now</h4>
              <button 
                onClick={() => { navigate('/signup'); }}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-sm w-full transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs">
            © 2024 RenovateProAI. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};