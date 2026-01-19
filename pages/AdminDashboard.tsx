
import React, { useState } from 'react';
import { PricingPlan } from '../types';
import { DEFAULT_PLANS } from '../constants';
import { useSearchParams } from 'react-router-dom';

interface AdminDashboardProps {
  profileImage: string;
  setProfileImage: (url: string) => void;
  adminName: string;
  setAdminName: (name: string) => void;
  // CMS Props
  cmsContent: any;
  setCmsContent: (content: any) => void;
  // Job Tags Props
  jobTags: string[];
  setJobTags: (tags: string[]) => void;
}

// Types for internal state
interface Contractor {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
  plan: 'Pro Monthly' | 'Pro Yearly' | 'Free Trial';
  status: 'Active' | 'Inactive';
  joinDate: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Sub Admin';
  permissions: {
    manageContractors: boolean;
    manageAdmins: boolean;
  };
}

const MOCK_CONTRACTORS: Contractor[] = [
  { id: '1', firstName: 'Mike', lastName: 'Builder', company: 'Mike Construction', phone: '(555) 123-4567', email: 'mike@example.com', plan: 'Pro Monthly', status: 'Active', joinDate: '2023-10-01' },
  { id: '2', firstName: 'Sarah', lastName: 'Miller', company: 'Sarah Designs', phone: '(555) 987-6543', email: 'sarah@example.com', plan: 'Pro Yearly', status: 'Active', joinDate: '2023-11-15' },
  { id: '3', firstName: 'John', lastName: 'Doe', company: 'Elite Roofing', phone: '(555) 555-5555', email: 'contact@eliteroofing.com', plan: 'Free Trial', status: 'Inactive', joinDate: '2024-01-20' },
];

const MOCK_ADMINS: AdminUser[] = [
  { id: '1', name: 'Main Admin', email: 'admin@renovatepro.ai', role: 'Super Admin', permissions: { manageContractors: true, manageAdmins: true } },
  { id: '2', name: 'Support Rep', email: 'support@renovatepro.ai', role: 'Sub Admin', permissions: { manageContractors: false, manageAdmins: false } },
];

const Tabs = ({ tabs, active, onChange }: any) => (
  <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
    {tabs.map((tab: string) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${active === tab ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  profileImage, setProfileImage, 
  adminName, setAdminName,
  cmsContent, setCmsContent,
  jobTags, setJobTags
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Users';
  const setActiveTab = (tab: string) => setSearchParams({ tab });
  
  // Admin Profile State
  const [adminEmail, setAdminEmail] = useState('admin@renovatepro.ai');
  
  // User Management State
  const [userSubTab, setUserSubTab] = useState<'contractors' | 'admins'>('contractors');
  const [contractors, setContractors] = useState<Contractor[]>(MOCK_CONTRACTORS);
  const [admins, setAdmins] = useState<AdminUser[]>(MOCK_ADMINS);

  // Plan Management State
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);
  
  // CMS Local State (for editing before save)
  const [localCms, setLocalCms] = useState(cmsContent);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'user' | 'plan'>('user');
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // Tag Input State
  const [newTag, setNewTag] = useState('');
  
  // Dynamic editing state
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CRUD HANDLERS ---

  const handleOpenUserModal = (mode: 'add' | 'edit', user?: any) => {
    setModalType('user');
    setModalMode(mode);
    setEditingItem(user || (userSubTab === 'contractors' ? {
      firstName: '', lastName: '', company: '', phone: '', email: '', plan: 'Pro Monthly', status: 'Active'
    } : {
      name: '', email: '', role: 'Sub Admin', permissions: { manageContractors: false, manageAdmins: false }
    }));
    setIsModalOpen(true);
  };

  const handleOpenPlanModal = (mode: 'add' | 'edit', plan?: any) => {
    setModalType('plan');
    setModalMode(mode);
    setEditingItem(plan || {
      name: '', price: 0, interval: 'monthly', features: [], recommended: false
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === 'user') {
      if (userSubTab === 'contractors') {
        if (modalMode === 'add') {
          const newContractor: Contractor = {
            ...editingItem,
            id: Math.random().toString(36).substr(2, 9),
            joinDate: new Date().toISOString().split('T')[0]
          };
          setContractors([...contractors, newContractor]);
        } else {
          setContractors(contractors.map(c => c.id === editingItem.id ? editingItem : c));
        }
      } else {
        if (modalMode === 'add') {
          const newAdmin: AdminUser = {
            ...editingItem,
            id: Math.random().toString(36).substr(2, 9)
          };
          setAdmins([...admins, newAdmin]);
        } else {
          setAdmins(admins.map(a => a.id === editingItem.id ? editingItem : a));
        }
      }
    } else if (modalType === 'plan') {
       if (modalMode === 'add') {
         const newPlan: PricingPlan = {
           ...editingItem,
           id: Math.random().toString(36).substr(2, 9)
         };
         setPlans([...plans, newPlan]);
       } else {
         setPlans(plans.map(p => p.id === editingItem.id ? editingItem : p));
       }
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      if (userSubTab === 'contractors') {
        setContractors(current => current.filter(c => c.id !== id));
      } else {
        setAdmins(current => current.filter(a => a.id !== id));
      }
    }
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(current => current.filter(p => p.id !== id));
    }
  };

  // --- JOB TAG HANDLERS ---
  const handleAddTag = () => {
    if (newTag.trim() && !jobTags.includes(newTag.trim())) {
      setJobTags([...jobTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    if (window.confirm(`Delete tag "${tag}"?`)) {
      setJobTags(jobTags.filter(t => t !== tag));
    }
  };

  const handleSaveProfileSettings = () => {
    alert('Settings saved successfully!');
    setActiveTab('Users');
  };

  const handleSaveCMS = () => {
    setCmsContent(localCms);
    alert('CMS Settings saved!');
  };

  // Helper to update deeply nested CMS state
  const updateCMS = (section: string, field: string, value: any, index?: number, subField?: string) => {
    const newCms = { ...localCms };
    if (index !== undefined && subField) {
       // Updating an item in an array (e.g. features[0].title)
       newCms[section][field][index][subField] = value;
    } else if (index !== undefined) {
       // Updating an array of strings (e.g. useCases.items[0])
       newCms[section][field][index] = value;
    } else {
       // Updating a simple field
       newCms[section][field] = value;
    }
    setLocalCms(newCms);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Manage content, users, and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Admin Mode</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Tabs tabs={['Users', 'Pricing', 'CMS', 'Job Tags', 'Leads', 'Settings']} active={activeTab} onChange={setActiveTab} />

        {activeTab === 'Job Tags' && (
          <div className="max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Manage Job Status Tags</h3>
            <div className="flex gap-4 mb-6">
               <input 
                 type="text" 
                 placeholder="Enter new status tag..." 
                 className="flex-grow p-2 border rounded-lg"
                 value={newTag}
                 onChange={e => setNewTag(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleAddTag()}
               />
               <button 
                onClick={handleAddTag}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700"
               >
                 Add Tag
               </button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
               {jobTags.map((tag, i) => (
                 <div key={i} className="flex justify-between items-center p-4 border-b last:border-0 hover:bg-slate-50">
                    <span className="font-medium text-slate-800 capitalize">{tag}</span>
                    <button 
                      onClick={() => handleDeleteTag(tag)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Delete Tag"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 </div>
               ))}
               {jobTags.length === 0 && <div className="p-4 text-center text-slate-500">No tags defined.</div>}
            </div>
            <p className="text-sm text-slate-500 mt-4">Note: Tags will be displayed capitalized on project cards (e.g., "open quote" → "Open Quote").</p>
          </div>
        )}

        {activeTab === 'CMS' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex justify-end sticky top-0 bg-white z-10 py-2 border-b mb-4">
               <button 
                onClick={handleSaveCMS}
                className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 shadow-md"
              >
                Save All Changes
              </button>
            </div>

            {/* HERO SECTION */}
            <div className="border p-6 rounded-lg bg-slate-50/50">
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Hero Section</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Badge Text</label>
                  <input type="text" className="w-full border p-2 rounded" value={localCms.hero.badge} onChange={e => updateCMS('hero', 'badge', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Headline Part 1 (Black)</label>
                    <input type="text" className="w-full border p-2 rounded" value={localCms.hero.headlinePart1} onChange={e => updateCMS('hero', 'headlinePart1', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Headline Part 2 (Blue)</label>
                    <input type="text" className="w-full border p-2 rounded" value={localCms.hero.headlinePart2} onChange={e => updateCMS('hero', 'headlinePart2', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Subheadline</label>
                  <textarea className="w-full border p-2 rounded h-20" value={localCms.hero.subheadline} onChange={e => updateCMS('hero', 'subheadline', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">CTA Button Text</label>
                  <input type="text" className="w-full border p-2 rounded" value={localCms.hero.ctaText} onChange={e => updateCMS('hero', 'ctaText', e.target.value)} />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 block mb-1">Benefits List</label>
                   <div className="space-y-2">
                     {localCms.hero.benefits.map((benefit: string, i: number) => (
                       <input key={i} type="text" className="w-full border p-2 rounded text-sm" value={benefit} onChange={e => updateCMS('hero', 'benefits', e.target.value, i)} />
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* VIDEO SECTION */}
            <div className="border p-6 rounded-lg bg-slate-50/50">
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Video Section</h3>
              <div className="grid gap-4">
                 <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Section Title</label>
                  <input type="text" className="w-full border p-2 rounded" value={localCms.video.title} onChange={e => updateCMS('video', 'title', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Video URL (MP4)</label>
                  <input type="text" className="w-full border p-2 rounded" value={localCms.video.url} onChange={e => updateCMS('video', 'url', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Poster Image URL</label>
                  <input type="text" className="w-full border p-2 rounded" value={localCms.video.poster} onChange={e => updateCMS('video', 'poster', e.target.value)} />
                </div>
              </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="border p-6 rounded-lg bg-slate-50/50">
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">How It Works</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Title</label>
                  <input type="text" className="w-full border p-2 rounded" value={localCms.howItWorks.title} onChange={e => updateCMS('howItWorks', 'title', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Subtitle</label>
                  <input type="text" className="w-full border p-2 rounded" value={localCms.howItWorks.subtitle} onChange={e => updateCMS('howItWorks', 'subtitle', e.target.value)} />
                </div>
                <div className="space-y-4 mt-2">
                   {localCms.howItWorks.steps.map((step: any, i: number) => (
                     <div key={i} className="border p-3 rounded bg-white">
                        <div className="text-xs font-bold text-brand-600 mb-2">Step {i + 1}</div>
                        <div className="grid grid-cols-1 gap-2">
                          <input type="text" className="w-full border p-2 rounded text-sm font-bold" value={step.title} onChange={e => updateCMS('howItWorks', 'steps', e.target.value, i, 'title')} placeholder="Step Title" />
                          <input type="text" className="w-full border p-2 rounded text-sm" value={step.desc} onChange={e => updateCMS('howItWorks', 'steps', e.target.value, i, 'desc')} placeholder="Step Description" />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* FEATURES */}
            <div className="border p-6 rounded-lg bg-slate-50/50">
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Features Grid</h3>
              <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Title</label>
                  <input type="text" className="w-full border p-2 rounded mb-4" value={localCms.features.title} onChange={e => updateCMS('features', 'title', e.target.value)} />
              </div>
               <div className="grid grid-cols-2 gap-4">
                   {localCms.features.items.map((feat: any, i: number) => (
                     <div key={i} className="border p-3 rounded bg-white">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex gap-2">
                            <input type="text" className="w-12 border p-2 rounded text-center" value={feat.icon} onChange={e => updateCMS('features', 'items', e.target.value, i, 'icon')} />
                            <input type="text" className="flex-grow border p-2 rounded text-sm font-bold" value={feat.title} onChange={e => updateCMS('features', 'items', e.target.value, i, 'title')} />
                          </div>
                          <textarea className="w-full border p-2 rounded text-sm h-16" value={feat.desc} onChange={e => updateCMS('features', 'items', e.target.value, i, 'desc')} />
                        </div>
                     </div>
                   ))}
                </div>
            </div>

            {/* USE CASES & PRICING */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="border p-6 rounded-lg bg-slate-50/50">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Use Cases</h3>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Title</label>
                  <input type="text" className="w-full border p-2 rounded mb-4" value={localCms.useCases.title} onChange={e => updateCMS('useCases', 'title', e.target.value)} />
                   <div className="space-y-2">
                     {localCms.useCases.items.map((item: string, i: number) => (
                       <input key={i} type="text" className="w-full border p-2 rounded text-sm" value={item} onChange={e => updateCMS('useCases', 'items', e.target.value, i)} />
                     ))}
                   </div>
               </div>
               
               <div className="border p-6 rounded-lg bg-slate-50/50">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Pricing Section</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Title</label>
                      <input type="text" className="w-full border p-2 rounded" value={localCms.pricing.title} onChange={e => updateCMS('pricing', 'title', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Subtitle</label>
                      <input type="text" className="w-full border p-2 rounded" value={localCms.pricing.subtitle} onChange={e => updateCMS('pricing', 'subtitle', e.target.value)} />
                    </div>
                  </div>
               </div>
            </div>

            {/* TESTIMONIALS & FAQ */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="border p-6 rounded-lg bg-slate-50/50">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Testimonials</h3>
                   <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Title</label>
                      <input type="text" className="w-full border p-2 rounded" value={localCms.testimonials.title} onChange={e => updateCMS('testimonials', 'title', e.target.value)} />
                    </div>
                </div>
                 <div className="border p-6 rounded-lg bg-slate-50/50">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">FAQ</h3>
                   <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Title</label>
                      <input type="text" className="w-full border p-2 rounded mb-4" value={localCms.faq.title} onChange={e => updateCMS('faq', 'title', e.target.value)} />
                       <div className="space-y-2 max-h-60 overflow-y-auto">
                        {localCms.faq.items.map((item: any, i: number) => (
                           <div key={i} className="border p-2 rounded bg-white">
                             <input type="text" className="w-full border p-1 rounded text-xs font-bold mb-1" value={item.q} onChange={e => updateCMS('faq', 'items', e.target.value, i, 'q')} />
                             <textarea className="w-full border p-1 rounded text-xs" value={item.a} onChange={e => updateCMS('faq', 'items', e.target.value, i, 'a')} />
                           </div>
                        ))}
                      </div>
                    </div>
                </div>
            </div>

            {/* FOOTER & SEO */}
             <div className="border p-6 rounded-lg bg-slate-50/50">
              <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Footer & SEO</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-4">
                  <h4 className="font-bold text-sm text-slate-600">Footer CTA</h4>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Headline</label>
                    <input type="text" className="w-full border p-2 rounded" value={localCms.footer.headline} onChange={e => updateCMS('footer', 'headline', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Subheadline</label>
                    <input type="text" className="w-full border p-2 rounded" value={localCms.footer.subheadline} onChange={e => updateCMS('footer', 'subheadline', e.target.value)} />
                  </div>
                   <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Button Text</label>
                    <input type="text" className="w-full border p-2 rounded" value={localCms.footer.ctaText} onChange={e => updateCMS('footer', 'ctaText', e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-4">
                   <h4 className="font-bold text-sm text-slate-600">SEO</h4>
                   <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Meta Title</label>
                    <input type="text" className="w-full border p-2 rounded" value={localCms.seo.metaTitle} onChange={e => updateCMS('seo', 'metaTitle', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'Pricing' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Plans</h3>
              <button 
                onClick={() => handleOpenPlanModal('add')}
                className="text-sm bg-brand-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                + Add Plan
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="p-3">Plan Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Interval</th>
                  <th className="p-3">Features</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">
                      {plan.name}
                      {plan.recommended && <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Recommended</span>}
                    </td>
                    <td className="p-3">${plan.price}</td>
                    <td className="p-3 capitalize">{plan.interval}</td>
                    <td className="p-3 text-xs text-slate-500 max-w-xs truncate">{plan.features.join(', ')}</td>
                    <td className="p-3 flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenPlanModal('edit', plan)}
                        className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Users' && (
           <div>
             {/* User Type Toggle */}
             <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
               <button 
                onClick={() => setUserSubTab('contractors')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${userSubTab === 'contractors' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Contractors
               </button>
               <button 
                onClick={() => setUserSubTab('admins')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${userSubTab === 'admins' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Team / Sub-Admins
               </button>
             </div>

             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg">
                 {userSubTab === 'contractors' ? 'Paid Contractors' : 'Admin Team'}
               </h3>
               <button 
                 onClick={() => handleOpenUserModal('add')}
                 className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
               >
                 <span>+</span> Add {userSubTab === 'contractors' ? 'Contractor' : 'Admin'}
               </button>
             </div>

             {/* USERS TABLE */}
             <div className="overflow-x-auto border rounded-lg">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                     <th className="p-4 font-semibold">User Details</th>
                     {userSubTab === 'contractors' ? (
                       <>
                         <th className="p-4 font-semibold">Contact</th>
                         <th className="p-4 font-semibold">Plan</th>
                         <th className="p-4 font-semibold">Status</th>
                       </>
                     ) : (
                       <>
                         <th className="p-4 font-semibold">Role</th>
                         <th className="p-4 font-semibold">Permissions</th>
                       </>
                     )}
                     <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {(userSubTab === 'contractors' ? contractors : admins).map((user: any) => (
                     <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                       <td className="p-4">
                         {userSubTab === 'contractors' ? (
                           <>
                             <div className="font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                             <div className="text-xs text-slate-500">{user.company}</div>
                             <div className="text-xs text-slate-400">{user.email}</div>
                           </>
                         ) : (
                            <>
                             <div className="font-bold text-slate-900">{user.name}</div>
                             <div className="text-xs text-slate-500">{user.email}</div>
                           </>
                         )}
                       </td>
                       {userSubTab === 'contractors' ? (
                         <>
                           <td className="p-4 text-slate-600">
                             <div>{user.phone}</div>
                             <div className="text-xs text-slate-400">Joined: {user.joinDate}</div>
                           </td>
                           <td className="p-4">
                             <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-xs font-medium border border-brand-100">{user.plan}</span>
                           </td>
                           <td className="p-4">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                               {user.status}
                             </span>
                           </td>
                         </>
                       ) : (
                         <>
                           <td className="p-4 text-slate-700 font-medium">{user.role}</td>
                           <td className="p-4">
                             <div className="flex flex-col gap-1 text-xs">
                               <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${user.permissions.manageContractors ? 'bg-green-500' : 'bg-red-300'}`}></div>
                                 <span className={user.permissions.manageContractors ? 'text-slate-700' : 'text-slate-400'}>Manage Contractors</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${user.permissions.manageAdmins ? 'bg-green-500' : 'bg-red-300'}`}></div>
                                 <span className={user.permissions.manageAdmins ? 'text-slate-700' : 'text-slate-400'}>Manage Admins</span>
                               </div>
                             </div>
                           </td>
                         </>
                       )}
                       <td className="p-4 text-right space-x-2">
                         <button 
                           onClick={() => handleOpenUserModal('edit', user)}
                           className="text-brand-600 hover:text-brand-800 font-medium hover:underline"
                         >
                           Edit
                         </button>
                         <button 
                           onClick={() => handleDeleteUser(user.id)}
                           className="text-red-500 hover:text-red-700 font-medium hover:underline"
                           disabled={user.role === 'Super Admin'}
                         >
                           Delete
                         </button>
                       </td>
                     </tr>
                   ))}
                   {((userSubTab === 'contractors' ? contractors : admins).length === 0) && (
                     <tr>
                       <td colSpan={5} className="p-8 text-center text-slate-400">No users found.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {activeTab === 'Leads' && (
           <div className="text-center py-12 text-slate-500">Form submissions and leads placeholder</div>
        )}

        {activeTab === 'Settings' && (
           <div className="space-y-8 max-w-lg">
             <div>
               <h3 className="font-bold mb-4">Profile Settings</h3>
               <div className="flex items-center gap-6">
                 <div className="w-24 h-24 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-300">
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <label className="block bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors">
                     Change Picture
                     <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                   </label>
                   <p className="text-xs text-slate-400 mt-2">Recommended: 200x200px</p>
                 </div>
               </div>
             </div>
             
             <div className="pt-6 border-t border-slate-100">
               <h3 className="font-bold mb-4">Account Information</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                   <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg" 
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                   />
                 </div>
                  <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                   <input 
                    type="email" 
                    className="w-full p-2 border rounded-lg" 
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                   />
                 </div>
               </div>
               <button 
                onClick={handleSaveProfileSettings}
                className="mt-6 bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700"
               >
                Save Changes
               </button>
             </div>
           </div>
        )}
      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fade-in relative">
            <h3 className="text-xl font-bold mb-6">
              {modalMode === 'add' ? 'Add New' : 'Edit'} {modalType === 'plan' ? 'Plan' : (userSubTab === 'contractors' ? 'Contractor' : 'Admin')}
            </h3>
            
            <div className="space-y-4">
              {modalType === 'plan' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Plan Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded" 
                      value={editingItem?.name || ''}
                      onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border rounded" 
                        value={editingItem?.price || 0}
                        onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Interval</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={editingItem?.interval || 'monthly'}
                        onChange={e => setEditingItem({...editingItem, interval: e.target.value})}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Features (one per line)</label>
                    <textarea 
                      className="w-full p-2 border rounded h-32"
                      value={Array.isArray(editingItem?.features) ? editingItem.features.join('\n') : ''}
                      onChange={e => setEditingItem({...editingItem, features: e.target.value.split('\n')})}
                      placeholder="Unlimited Projects&#10;4K Export..."
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingItem?.recommended || false}
                      onChange={e => setEditingItem({...editingItem, recommended: e.target.checked})}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">Recommended Plan</span>
                  </label>
                </>
              ) : (
                /* USER FORM FIELDS */
                <>
                  {userSubTab === 'contractors' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded" 
                            value={editingItem?.firstName || ''}
                            onChange={e => setEditingItem({...editingItem, firstName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded" 
                            value={editingItem?.lastName || ''}
                            onChange={e => setEditingItem({...editingItem, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Company</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded" 
                          value={editingItem?.company || ''}
                          onChange={e => setEditingItem({...editingItem, company: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded" 
                          value={editingItem?.phone || ''}
                          onChange={e => setEditingItem({...editingItem, phone: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded" 
                        value={editingItem?.name || ''}
                        onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded" 
                      value={editingItem?.email || ''}
                      onChange={e => setEditingItem({...editingItem, email: e.target.value})}
                    />
                  </div>

                  {/* CONTRACTOR SPECIFIC FIELDS */}
                  {userSubTab === 'contractors' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Plan</label>
                          <select 
                            className="w-full p-2 border rounded"
                            value={editingItem?.plan || 'Pro Monthly'}
                            onChange={e => setEditingItem({...editingItem, plan: e.target.value})}
                          >
                            <option value="Pro Monthly">Pro Monthly</option>
                            <option value="Pro Yearly">Pro Yearly</option>
                            <option value="Free Trial">Free Trial</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                          <select 
                            className="w-full p-2 border rounded"
                            value={editingItem?.status || 'Active'}
                            onChange={e => setEditingItem({...editingItem, status: e.target.value})}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ADMIN SPECIFIC FIELDS */}
                  {userSubTab === 'admins' && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Permissions</label>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input 
                              type="checkbox"
                              className="w-5 h-5 text-brand-600 rounded"
                              checked={editingItem?.permissions?.manageContractors || false}
                              onChange={e => setEditingItem({
                                ...editingItem, 
                                permissions: { ...editingItem.permissions, manageContractors: e.target.checked }
                              })}
                            />
                            <div>
                              <div className="font-medium text-sm">Manage Contractors</div>
                              <div className="text-xs text-slate-500">Can add, edit, or delete paid contractor accounts</div>
                            </div>
                          </label>
                          
                          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input 
                              type="checkbox"
                              className="w-5 h-5 text-brand-600 rounded"
                              checked={editingItem?.permissions?.manageAdmins || false}
                              onChange={e => setEditingItem({
                                ...editingItem, 
                                permissions: { ...editingItem.permissions, manageAdmins: e.target.checked }
                              })}
                              disabled={editingItem?.role === 'Super Admin'} 
                            />
                            <div>
                              <div className="font-medium text-sm">Manage Admins</div>
                              <div className="text-xs text-slate-500">Can create other sub-admins and set permissions</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700"
              >
                Save {modalType === 'plan' ? 'Plan' : 'User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
