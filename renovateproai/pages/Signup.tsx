import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { DEFAULT_PLANS } from '../constants';

interface SignupProps {
  setUserRole: (role: UserRole) => void;
}

export const Signup: React.FC<SignupProps> = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // State
  const [selectedPlanId, setSelectedPlanId] = useState<'monthly' | 'yearly'>('yearly');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    password: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    zip: ''
  });

  // Load plan from URL param if present
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'monthly' || planParam === 'yearly') {
      setSelectedPlanId(planParam);
    }
  }, [searchParams]);

  const activePlan = DEFAULT_PLANS.find(p => p.id === selectedPlanId) || DEFAULT_PLANS[1];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Stripe API call
    setTimeout(() => {
      setLoading(false);
      setUserRole(UserRole.CONTRACTOR);
      navigate('/app');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Column: Order Summary */}
        <div className="lg:w-5/12 bg-slate-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-600/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"></div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-8 text-white/90 hover:text-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Back
            </Link>
            <h2 className="text-3xl font-bold mb-6">Order Summary</h2>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{activePlan.name}</h3>
                <span className="text-2xl font-bold">${activePlan.price}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {activePlan.features.slice(0, 4).map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <svg className="w-5 h-5 text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feat}
                  </li>
                ))}
              </ul>
              
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 mb-4">
                <button 
                  onClick={() => setSelectedPlanId('monthly')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedPlanId === 'monthly' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setSelectedPlanId('yearly')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedPlanId === 'yearly' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Yearly (Save 17%)
                </button>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-slate-400">Total due today</span>
                <span className="text-xl font-bold text-white">${activePlan.price}.00</span>
              </div>
            </div>
          </div>

          <div className="mt-8 relative z-10">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span>Secure 256-bit SSL Encrypted Payment</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Form */}
        <div className="lg:w-7/12 p-8 lg:p-12 bg-white overflow-y-auto max-h-screen">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Account & Payment</h2>
            
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">1. Create Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input type="text" name="firstName" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="John" onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input type="text" name="lastName" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Doe" onChange={handleInputChange} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input type="text" name="company" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Acme Construction" onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="(555) 123-4567" onChange={handleInputChange} />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                   <input type="email" name="email" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="john@example.com" onChange={handleInputChange} />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                   <input type="password" name="password" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="••••••••" onChange={handleInputChange} />
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex justify-between items-center">
                  <span>2. Payment Details</span>
                  <div className="flex gap-2 opacity-50">
                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                  </div>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input type="text" name="cardNumber" required placeholder="0000 0000 0000 0000" className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono" onChange={handleInputChange} />
                    <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                    <input type="text" name="expiry" required placeholder="MM / YY" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono" onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                    <div className="relative">
                      <input type="text" name="cvc" required placeholder="123" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono" onChange={handleInputChange} />
                      <div className="absolute right-3 top-3.5 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ZIP / Postal Code</label>
                    <input type="text" name="zip" required placeholder="12345" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" onChange={handleInputChange} />
                </div>
              </div>

              <div className="pt-4 pb-8">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Pay $${activePlan.price} & Start Trial`
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  By clicking above, you agree to our Terms of Service and Privacy Policy. You will not be charged until your 14-day trial ends.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};