import React, { useEffect, useState } from 'react';
import { DEFAULT_PLANS, MOCK_TESTIMONIALS } from '../constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

interface MarketingHomeProps {
  setUserRole: (role: UserRole) => void;
  cmsContent: any; // Using any for flexibility with the dynamic CMS object
}

export const MarketingHome: React.FC<MarketingHomeProps> = ({ setUserRole, cmsContent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Signup Form State - Simplified for redirect
  const [email, setEmail] = useState('');
  const [a2pConsent, setA2pConsent] = useState(false);

  const handleSignupStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // In a real app, we'd pass the email via state or query param
    navigate('/signup'); 
  };

  // Handle Hash Scrolling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col">
      {/* Split Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy & Benefits */}
            <div className="text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-sm mb-6 border border-brand-100">
                {cmsContent.hero.badge}
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                {cmsContent.hero.headlinePart1} <br />
                <span className="text-brand-600">{cmsContent.hero.headlinePart2}</span>
              </h1>
              <p className="mt-4 text-xl text-slate-600 max-w-lg mb-8 leading-relaxed">
                {cmsContent.hero.subheadline}
              </p>
              
              {/* Benefits List moved to Hero */}
              <ul className="space-y-4 mb-8">
                {cmsContent.hero.benefits.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Signup Form */}
            <div className="w-full max-w-md mx-auto lg:ml-auto">
               <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 relative">
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                   30-Day Guarantee
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create your account</h3>
                 <form onSubmit={handleSignupStart} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="john@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="flex items-start gap-3 my-2">
                        <input 
                            type="checkbox" 
                            required 
                            id="a2p-consent"
                            checked={a2pConsent}
                            onChange={(e) => setA2pConsent(e.target.checked)}
                            className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                        />
                        <label htmlFor="a2p-consent" className="text-xs text-slate-500 leading-snug cursor-pointer">
                            I agree to receive SMS, Email, and automated calls from RenovateProAI. Msg & data rates may apply. Reply STOP to opt out.
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-lg hover:bg-brand-700 transition-colors shadow-md mt-2">
                      {cmsContent.hero.ctaText}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                      30-day money-back guarantee. Cancel at any time.
                    </p>
                 </form>
               </div>
            </div>
          </div>

          {/* Video moved below Grid */}
          <div className="mt-20 max-w-5xl mx-auto">
             <div className="text-center mb-8">
               <p className="text-sm font-bold text-slate-500 tracking-wider">{cmsContent.video.title}</p>
             </div>
             <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-slate-900/5">
                <video 
                  key={cmsContent.video.url} // Force re-render if URL changes
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={cmsContent.video.poster}
                >
                  <source src={cmsContent.video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
             </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-100/50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* How It Works (Timeline) - LINKED AS FEATURES */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{cmsContent.howItWorks.title}</h2>
            <p className="text-slate-600 mt-4">{cmsContent.howItWorks.subtitle}</p>
          </div>
          
          <div className="relative border-l-2 border-brand-100 pl-8 ml-4 md:ml-0 space-y-12">
            {cmsContent.howItWorks.steps.map((step: any, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-brand-600 border-4 border-white shadow-sm"></div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-600 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{cmsContent.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cmsContent.features.items.map((feature: any, i: number) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">{cmsContent.useCases.title}</h2>
           <div className="flex flex-wrap justify-center gap-4">
             {cmsContent.useCases.items.map((role: string) => (
               <span key={role} className="px-6 py-3 bg-slate-100 rounded-full text-slate-700 font-medium text-lg">
                 {role}
               </span>
             ))}
           </div>
        </div>
      </section>

      {/* Pricing - ID Added for Navigation */}
      <section id="pricing" className="py-24 bg-slate-900 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">{cmsContent.pricing.title}</h2>
            <p className="text-slate-400 mt-4">{cmsContent.pricing.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {DEFAULT_PLANS.map((plan) => (
              <div key={plan.id} className={`relative p-8 rounded-2xl border ${plan.recommended ? 'border-brand-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}>
                {plan.recommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-3 py-1 rounded-full text-sm font-bold">Most Popular</span>}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold">${plan.price}</span>
                  <span className="ml-2 text-slate-400">/{plan.interval}</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate(`/signup?plan=${plan.id}`)} 
                  className={`w-full mt-8 py-3 rounded-lg font-bold transition-colors ${plan.recommended ? 'bg-brand-600 hover:bg-brand-500' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">{cmsContent.testimonials.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex text-yellow-400 mb-4">{'★'.repeat(5)}</div>
                <p className="text-slate-700 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{cmsContent.faq.title}</h2>
          <div className="space-y-6">
            {cmsContent.faq.items.map((faq: any, i: number) => (
              <div key={i} className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">{cmsContent.footer.headline}</h2>
          <p className="text-brand-100 text-xl mb-10">{cmsContent.footer.subheadline}</p>
          <button onClick={() => navigate('/signup')} className="bg-white text-brand-600 px-10 py-4 rounded-full font-bold text-xl hover:bg-brand-50 transition-colors shadow-xl">
            {cmsContent.footer.ctaText}
          </button>
        </div>
      </section>
    </div>
  );
};