
import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectSpace, ProjectStatus, ImageSize, Material } from '../types';
import { MOCK_PROJECTS } from '../constants';
import * as geminiService from '../services/geminiService';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';

// --- SETTINGS & MATERIALS MANAGER ---
interface SettingsProps {
  contractorName: string;
  setContractorName: (name: string) => void;
  contractorImage: string;
  setContractorImage: (url: string) => void;
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ 
  contractorName, setContractorName, 
  contractorImage, setContractorImage,
  materials, setMaterials
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'materials'>('profile');
  
  // Profile State
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Material Form State
  const [isEditingMaterial, setIsEditingMaterial] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({
    name: '', category: '', subCategory: '', description: '', imageUrl: ''
  });

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContractorImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Material Handlers
  const handleMaterialImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMaterial(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMaterial = () => {
    if (!currentMaterial.name || !currentMaterial.category) return;
    
    if (currentMaterial.id) {
        // Update existing
        setMaterials(materials.map(m => m.id === currentMaterial.id ? currentMaterial as Material : m));
    } else {
        // Create new
        const newMat: Material = {
            ...currentMaterial as Material,
            id: Math.random().toString(36).substr(2, 9),
            imageUrl: currentMaterial.imageUrl || 'https://via.placeholder.com/100'
        };
        setMaterials([...materials, newMat]);
    }
    setIsEditingMaterial(false);
    setCurrentMaterial({ name: '', category: '', subCategory: '', description: '', imageUrl: '' });
  };

  const handleDeleteMaterial = (id: string) => {
    if(window.confirm("Delete this material?")) {
        setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const handleEditMaterialClick = (m: Material) => {
      setCurrentMaterial(m);
      setIsEditingMaterial(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>
      
      <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'profile' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
              Profile & Account
          </button>
          <button 
             onClick={() => setActiveTab('materials')}
             className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'materials' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
              Materials Library
          </button>
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8 animate-fade-in">
            {/* Profile Picture */}
            <div>
            <label className="block text-sm font-bold text-slate-700 mb-4">Profile Picture</label>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                <img src={contractorImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                <label className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                    Change Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                </label>
                <p className="text-xs text-slate-400 mt-2">JPG or PNG, max 2MB</p>
                </div>
            </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
                <input 
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={contractorName}
                onChange={e => setContractorName(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Change Password</label>
                <input 
                type="password" 
                placeholder="Enter new password"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
            </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-green-600 font-medium text-sm">{successMsg}</span>
            <button 
                onClick={handleProfileSave}
                className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-md"
            >
                Save Profile
            </button>
            </div>
        </div>
      )}

      {activeTab === 'materials' && (
          <div className="animate-fade-in">
              {isEditingMaterial ? (
                  <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                      <h2 className="text-xl font-bold mb-6">{currentMaterial.id ? 'Edit Material' : 'Add New Material'}</h2>
                      
                      <div className="space-y-4">
                          <div className="flex gap-4 items-start">
                             <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                 {currentMaterial.imageUrl ? <img src={currentMaterial.imageUrl} className="w-full h-full object-cover" /> : <span className="text-slate-400 text-xs">No Image</span>}
                             </div>
                             <div>
                                <label className="block bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors">
                                    Upload Image
                                    <input type="file" accept="image/*" className="hidden" onChange={handleMaterialImageUpload} />
                                </label>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Paint, Flooring" 
                                    className="w-full p-2 border rounded"
                                    value={currentMaterial.category}
                                    onChange={e => setCurrentMaterial({...currentMaterial, category: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Sub-Category</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Sherwin-Williams, Hardwood" 
                                    className="w-full p-2 border rounded"
                                    value={currentMaterial.subCategory}
                                    onChange={e => setCurrentMaterial({...currentMaterial, subCategory: e.target.value})}
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Material Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Repose Gray" 
                                className="w-full p-2 border rounded"
                                value={currentMaterial.name}
                                onChange={e => setCurrentMaterial({...currentMaterial, name: e.target.value})}
                              />
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                              <textarea 
                                placeholder="Describe the material..." 
                                className="w-full p-2 border rounded h-24"
                                value={currentMaterial.description}
                                onChange={e => setCurrentMaterial({...currentMaterial, description: e.target.value})}
                              />
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-8">
                          <button onClick={() => setIsEditingMaterial(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
                          <button onClick={handleSaveMaterial} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700">Save Material</button>
                      </div>
                  </div>
              ) : (
                  <div>
                      <div className="flex justify-between items-center mb-6">
                          <p className="text-slate-500">Manage your commonly used materials for quick access in projects.</p>
                          <button 
                            onClick={() => { setCurrentMaterial({ name: '', category: '', subCategory: '', description: '', imageUrl: '' }); setIsEditingMaterial(true); }}
                            className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
                          >
                              <span>+</span> Add Material
                          </button>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                                  <tr>
                                      <th className="p-4 w-20">Image</th>
                                      <th className="p-4">Name / Description</th>
                                      <th className="p-4">Category</th>
                                      <th className="p-4">Sub-Category</th>
                                      <th className="p-4 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {materials.map(m => (
                                      <tr key={m.id} className="hover:bg-slate-50">
                                          <td className="p-4">
                                              <img src={m.imageUrl} alt={m.name} className="w-12 h-12 rounded object-cover border border-slate-200" />
                                          </td>
                                          <td className="p-4">
                                              <div className="font-bold text-slate-900">{m.name}</div>
                                              <div className="text-xs text-slate-500 truncate max-w-xs">{m.description}</div>
                                          </td>
                                          <td className="p-4 text-sm text-slate-600">{m.category}</td>
                                          <td className="p-4 text-sm text-slate-600">{m.subCategory}</td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => handleEditMaterialClick(m)} className="text-brand-600 hover:text-brand-800 font-medium text-sm mr-3">Edit</button>
                                              <button onClick={() => handleDeleteMaterial(m.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                          </td>
                                      </tr>
                                  ))}
                                  {materials.length === 0 && (
                                      <tr><td colSpan={5} className="p-8 text-center text-slate-400">No materials found. Add one to get started.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

// --- PROJECT LIST COMPONENTS ---

interface ProjectListProps {
  onNewProject: () => void;
  projects: Project[];
  onDeleteProject: (id: string) => void;
  onUpdateProjectImage: (id: string, newImage: string) => void;
  jobTags?: string[];
}

const ProjectList = ({ onNewProject, projects, onDeleteProject, onUpdateProjectImage }: ProjectListProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeProjectIdForUpload, setActiveProjectIdForUpload] = useState<string | null>(null);

  const handleTriggerUpload = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent card click
    setActiveProjectIdForUpload(projectId);
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeProjectIdForUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProjectImage(activeProjectIdForUpload, reader.result as string);
        setActiveProjectIdForUpload(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
        <button onClick={onNewProject} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 flex items-center gap-2 shadow-sm transition-colors">
          <span className="text-lg">+</span> New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No projects yet. Start your first renovation!</p>
          </div>
        ) : (
          projects.map(project => (
            <div 
              key={project.id} 
              onClick={() => navigate(`/app/project/${project.id}`)}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer relative"
            >
              {/* Cover Photo */}
              <div className="h-48 bg-slate-200 relative overflow-hidden group">
                 <img 
                   src={project.coverPhoto || project.spaces[0]?.afterImage || 'https://via.placeholder.com/400'} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                   alt={project.name} 
                 />
                 
                 {/* Change Image Button Overlay */}
                 <button 
                    onClick={(e) => handleTriggerUpload(e, project.id)}
                    className="absolute top-3 left-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Change Cover Photo"
                 >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </button>

                 <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm uppercase tracking-wide capitalize z-10 ${
                     project.status === 'Complete' ? 'bg-green-100 text-green-800 border border-green-200' : 
                     project.status === 'Open Job' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                 }`}>
                    {project.status}
                 </div>
              </div>
              {/* Content */}
              <div className="p-5 flex-grow flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg text-slate-900 truncate flex-grow mr-2 leading-tight">{project.name}</h3>
                   <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-sm">${(project.quoteAmount/1000).toFixed(1)}k</span>
                 </div>
                 <p className="text-sm text-slate-500 mb-4 flex-grow font-medium">{project.clientName} • {project.spaces.length} Space{project.spaces.length !== 1 ? 's' : ''}</p>
                 
                 <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
                   <div className="flex -space-x-2 overflow-hidden pl-1">
                      {project.spaces.map((space, i) => (
                          <div key={space.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative" title={space.name}>
                               {space.afterImage ? <img src={space.afterImage} className="h-full w-full object-cover" alt={space.name} /> : <div className="h-full w-full flex items-center justify-center text-xs text-slate-400 bg-slate-100">?</div>}
                          </div>
                      ))}
                   </div>
                   
                   <div className="ml-auto flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium">{new Date(project.date).toLocaleDateString()}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Project"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- PROJECT DETAIL VIEW ---
interface ProjectDetailProps {
  projects: Project[];
  onAddSpace: (projectId: string) => void;
  onEditSpace: (projectId: string, spaceId: string) => void;
}

const ProjectDetailView: React.FC<ProjectDetailProps> = ({ projects, onAddSpace, onEditSpace }) => {
  const { projectId } = useParams();
  const project = projects.find(p => p.id === projectId);

  if (!project) return <div className="p-8 text-center text-slate-500">Project not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/app" className="text-sm text-slate-500 hover:text-brand-600 flex items-center gap-1 mb-4 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h1 className="text-3xl font-bold text-slate-900 mb-1">{project.name}</h1>
             <p className="text-slate-500 font-medium">{project.clientName} • {project.clientAddress}</p>
          </div>
          <div className="flex gap-3">
             <div className="text-right mr-4">
               <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Quote</div>
               <div className="font-bold text-xl">${project.quoteAmount.toLocaleString()}</div>
             </div>
             <span className={`px-4 py-2 rounded-lg font-bold capitalize h-fit ${
                 project.status === 'Complete' ? 'bg-green-100 text-green-800' : 
                 project.status === 'Open Job' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
             }`}>
                {project.status}
             </span>
          </div>
        </div>
      </div>

      {/* Spaces Grid */}
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Project Spaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Existing Spaces */}
        {project.spaces.map(space => (
          <div 
            key={space.id} 
            onClick={() => onEditSpace(project.id, space.id)}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
          >
            <div className="aspect-video bg-slate-900 relative">
               <img 
                 src={space.afterImage || space.beforeImage || 'https://via.placeholder.com/400'} 
                 className="w-full h-full object-cover" 
                 alt={space.name} 
               />
               
               {space.afterImage && (
                 <span className="absolute top-3 right-3 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                   AFTER
                 </span>
               )}

               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm">Open Editor</span>
               </div>
            </div>
            <div className="p-4">
               <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900">{space.name}</h3>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               </div>
               <p className="text-sm text-slate-500 mt-1 line-clamp-2">{space.description}</p>
            </div>
          </div>
        ))}

        {/* Add Space Card */}
        <div 
          onClick={() => onAddSpace(project.id)}
          className="border-2 border-dashed border-slate-300 rounded-xl min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50/50 transition-colors"
        >
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <h3 className="font-bold text-lg text-slate-700">Add New Space</h3>
          <p className="text-slate-500 text-sm mt-1">Kitchen, Bath, Bedroom...</p>
        </div>

      </div>
    </div>
  );
};


// --- WIZARD COMPONENT ---

interface WizardProps {
  mode: 'new-project' | 'add-space' | 'edit-space';
  onCancel: () => void;
  onSave: (data: any) => void;
  initialData?: any; // Project or Space data
  materials: Material[]; // Added materials prop
}

const StepWizard: React.FC<WizardProps> = ({ mode, onCancel, onSave, initialData, materials }) => {
  const [step, setStep] = useState(mode === 'new-project' ? 1 : 2);
  const [loading, setLoading] = useState(false);

  // Data State
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    clientName: '',
    quoteAmount: 0,
    status: 'Open Quote',
    ...((mode === 'new-project' && initialData) ? initialData : {})
  });

  const [spaceInfo, setSpaceInfo] = useState<Partial<ProjectSpace>>({
    name: 'New Space',
    materials: [],
    description: '',
    beforeImage: null,
    afterImage: null,
    ...(mode === 'edit-space' ? initialData : {})
  });

  // AI Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  // Generated Images State
  const [generatedAfterCustom, setGeneratedAfterCustom] = useState<string | null>(spaceInfo.afterImage || null);
  const [generatedAfterAI, setGeneratedAfterAI] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<'custom' | 'ai'>('custom');

  // Mic State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Export Options State
  const [includeElectrical, setIncludeElectrical] = useState(false);
  const [includePlumbing, setIncludePlumbing] = useState(false);
  const [pullPermit, setPullPermit] = useState(false);

  // AI State
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.Resolution_1K);
  const [refinementPrompt, setRefinementPrompt] = useState('');

  // Material Selection State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  // Computed lists for filters
  const availableCategories = Array.from(new Set(materials.map(m => m.category))).sort();
  const availableSubCategories = selectedCategory 
    ? Array.from(new Set(materials.filter(m => m.category === selectedCategory).map(m => m.subCategory))).sort()
    : [];
  
  const displayedMaterials = materials.filter(m => {
    if (selectedCategory && m.category !== selectedCategory) return false;
    if (selectedSubCategory && m.subCategory !== selectedSubCategory) return false;
    return true;
  });


  // -- Handlers --

  const handleGenerate = async () => {
    if (!spaceInfo.beforeImage) return;
    setLoading(true);
    try {
        const base64Data = spaceInfo.beforeImage.includes(',') ? spaceInfo.beforeImage.split(',')[1] : spaceInfo.beforeImage;
        const materialsText = spaceInfo.materials?.map(m => `${m.name} (${m.description})`).join(', ') || '';
        
        const promises = [];
        
        // 1. Generate Custom if description exists
        if (spaceInfo.description) {
            const customPrompt = `Renovation details: ${spaceInfo.description}. Specific Materials: ${materialsText}. Ensure high photorealism and correct perspective integration of materials.`;
            promises.push(
                geminiService.generateAfterImage(base64Data, customPrompt, imageSize)
                    .then(res => ({ type: 'custom', res }))
            );
        }
        
        // 2. Generate AI if suggestion exists
        if (aiSuggestion) {
             const aiPrompt = `Renovation details: ${aiSuggestion}. Specific Materials: ${materialsText}. Ensure high photorealism and correct perspective integration of materials.`;
             promises.push(
                geminiService.generateAfterImage(base64Data, aiPrompt, imageSize)
                    .then(res => ({ type: 'ai', res }))
            );
        }
        
        if (promises.length === 0) {
            alert("Please provide a description or use the Auto-Analyze feature.");
            setLoading(false);
            return;
        }

        const results = await Promise.all(promises);
        
        let hasCustom = false;
        let hasAI = false;

        results.forEach(r => {
            if (r.type === 'custom') {
                setGeneratedAfterCustom(r.res);
                hasCustom = true;
            }
            if (r.type === 'ai') {
                setGeneratedAfterAI(r.res);
                hasAI = true;
            }
        });
        
        // Set active to whatever finished (prioritize custom if both)
        if (hasCustom) setActivePreview('custom');
        else if (hasAI) setActivePreview('ai');

    } catch (e) {
      console.error(e);
      alert("Failed to generate image.");
    }
    setLoading(false);
  };

  const handleRefine = async () => {
    const currentImage = activePreview === 'ai' ? generatedAfterAI : generatedAfterCustom;
    if (!currentImage || !refinementPrompt) return;
    
    setLoading(true);
    try {
      const base64Data = currentImage.includes(',') ? currentImage.split(',')[1] : currentImage;
      const result = await geminiService.refineImage(base64Data, refinementPrompt);
      if (result) {
          if (activePreview === 'ai') setGeneratedAfterAI(result);
          else setGeneratedAfterCustom(result);
      }
      setRefinementPrompt('');
    } catch (e) {
      console.error(e);
      alert("Refinement failed.");
    }
    setLoading(false);
  };

  const handleAutoAnalyze = async () => {
      if (!spaceInfo.beforeImage) return;
      setLoading(true);
      try {
        const base64Data = spaceInfo.beforeImage.includes(',') ? spaceInfo.beforeImage.split(',')[1] : spaceInfo.beforeImage;
        const analysis = await geminiService.analyzeImage(base64Data);
        setAiSuggestion(analysis);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
  };

  const handleSmartDescription = async () => {
      setLoading(true);
      try {
        const smartDesc = await geminiService.generateSmartDescription(spaceInfo.description || "Renovation project");
        setSpaceInfo(prev => ({...prev, description: smartDesc}));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
  };

  const handleMicClick = () => {
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
        return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false; // Stop after one sentence/pause for simplicity
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpaceInfo(prev => ({
            ...prev,
            description: (prev.description ? prev.description + " " : "") + transcript
        }));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleFinalSave = () => {
    // Determine which result to save
    const finalImage = activePreview === 'ai' ? generatedAfterAI : generatedAfterCustom;
    const finalDesc = activePreview === 'ai' ? aiSuggestion : spaceInfo.description;

    // Construct final payload based on mode
    const finalSpace = {
      ...spaceInfo,
      description: finalDesc, // Update description to match the selected plan
      id: spaceInfo.id || Math.random().toString(36).substr(2, 9),
      afterImage: finalImage,
    };

    if (mode === 'new-project') {
      onSave({
        ...projectInfo,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        spaces: [finalSpace]
      });
    } else {
      // For add-space or edit-space, just return the space object
      onSave(finalSpace);
    }
    setStep(6);
  };

  const toggleMaterial = (m: Material) => {
    const exists = spaceInfo.materials?.find(x => x.id === m.id);
    const newMats = exists 
      ? spaceInfo.materials?.filter(x => x.id !== m.id)
      : [...(spaceInfo.materials || []), m];
    setSpaceInfo({...spaceInfo, materials: newMats});
  };

  // PDF Export Logic
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Please allow popups to export PDF.");
        return;
    }
    
    const activeImage = activePreview === 'ai' ? generatedAfterAI : generatedAfterCustom;
    const activeDesc = activePreview === 'ai' ? aiSuggestion : spaceInfo.description;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Executive Summary - ${spaceInfo.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
          body { font-family: 'Inter', Helvetica, sans-serif; color: #1e293b; margin: 0; padding: 0; line-height: 1.5; }
          .page { padding: 40px 50px; box-sizing: border-box; width: 100%; max-width: 850px; margin: 0 auto; background: white; }
          
          /* Header */
          .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
          .logo span { color: #0284c7; }
          .doc-title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 600; }
          
          /* Grid Layout for Info */
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .info-item { margin-bottom: 15px; }
          .label { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 500; color: #0f172a; }
          
          /* Section Headers */
          .section-title { font-size: 18px; font-weight: 700; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 12px; margin: 30px 0 15px 0; }
          
          /* Content */
          .description { background: #f8fafc; padding: 20px; border-radius: 8px; font-size: 14px; color: #334155; border: 1px solid #e2e8f0; }
          
          /* Images */
          .image-card { margin-bottom: 20px; break-inside: avoid; }
          .image-label { font-size: 12px; font-weight: 700; color: #fff; background: #0f172a; display: inline-block; padding: 4px 12px; border-radius: 4px 4px 0 0; }
          .main-image { width: 100%; height: 400px; object-fit: cover; border-radius: 0 4px 4px 4px; border: 1px solid #cbd5e1; display: block; }
          
          /* List */
          .scope-list { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .scope-list li { background: #fff; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; font-size: 13px; }
          .scope-list li strong { display: block; color: #0284c7; margin-bottom: 4px; }
          
          /* Footer */
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
          
          .page-break { page-break-before: always; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .page-break { break-before: page; }
          }
        </style>
      </head>
      <body>
        
        <!-- PAGE 1: EXECUTIVE SUMMARY -->
        <div class="page">
            <div class="header">
              <div class="logo">RenovatePro<span>AI</span></div>
              <div class="doc-title">Executive Summary</div>
            </div>

            <div class="info-grid">
               <div>
                 <div class="info-item">
                   <span class="label">Project Name</span>
                   <div class="value">${projectInfo.name || 'Renovation Project'}</div>
                 </div>
                 <div class="info-item">
                   <span class="label">Client</span>
                   <div class="value">${projectInfo.clientName || 'Valued Client'}</div>
                 </div>
               </div>
               <div style="text-align: right;">
                 <div class="info-item">
                   <span class="label">Date</span>
                   <div class="value">${new Date().toLocaleDateString()}</div>
                 </div>
                 <div class="info-item">
                   <span class="label">Est. Budget</span>
                   <div class="value">$${projectInfo.quoteAmount ? projectInfo.quoteAmount.toLocaleString() : '0.00'}</div>
                 </div>
               </div>
            </div>

            <div class="section-title">Current Condition Analysis</div>
            <div class="image-card">
               <div class="image-label">BEFORE RENOVATION</div>
               <img src="${spaceInfo.beforeImage}" class="main-image" />
            </div>

            <div class="section-title">Scope of Work</div>
            <div class="description">
              ${activeDesc || 'No description provided.'}
            </div>
            
            <div class="footer">
               <span>Generated by RenovateProAI</span>
               <span>Page 1 of 2</span>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 2: PROPOSED DESIGN -->
        <div class="page">
            <div class="header">
              <div class="logo">RenovatePro<span>AI</span></div>
              <div class="doc-title">Design Proposal</div>
            </div>

            <div class="section-title">AI Visualization</div>
            <div class="image-card">
               <div class="image-label" style="background: #0284c7;">PROPOSED AFTER</div>
               <img src="${activeImage}" class="main-image" />
            </div>

            <div class="section-title">Project Specifications & Inclusions</div>
            <ul class="scope-list">
                ${includeElectrical ? '<li><strong>Electrical</strong>Rough-in, trim, wiring, and fixture installation per code.</li>' : ''}
                ${includePlumbing ? '<li><strong>Plumbing</strong>Rough-in, supply/waste lines, valves, and fixture installation.</li>' : ''}
                ${pullPermit ? '<li><strong>Permits</strong>Contractor handles all required building permits and inspections.</li>' : ''}
                <li><strong>Design Concept</strong>Implementation of the proposed aesthetic and layout.</li>
                ${spaceInfo.materials && spaceInfo.materials.length > 0 ? `<li><strong>Selected Materials</strong>${spaceInfo.materials.map(m => m.name).join(', ')}</li>` : ''}
            </ul>

            <div class="description" style="margin-top: 30px; border-left: 4px solid #22c55e;">
               <strong>Professional Note:</strong> This visualization represents the design intent. Final finishes may vary based on material availability and site conditions.
            </div>

            <div class="footer">
               <span>Generated by RenovateProAI</span>
               <span>Page 2 of 2</span>
            </div>
        </div>
        
        <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 500); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // -- Render Steps --

  if (step === 1) { // New Project Info
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Project Name (e.g. Smith Kitchen)" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            value={projectInfo.name}
            onChange={e => setProjectInfo({...projectInfo, name: e.target.value})}
          />
           <input 
            type="text" 
            placeholder="Client Name" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
             value={projectInfo.clientName}
            onChange={e => setProjectInfo({...projectInfo, clientName: e.target.value})}
          />
           <input 
            type="number" 
            placeholder="Estimated Quote Amount ($)" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            onChange={e => setProjectInfo({...projectInfo, quoteAmount: Number(e.target.value)})}
          />
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onCancel} className="text-slate-500 px-4 py-2">Cancel</button>
            <button onClick={() => setStep(2)} className="bg-brand-600 text-white px-6 py-2 rounded-lg">Next: Add Space</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) { // Upload & Space Name
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Space Details</h2>
        <div className="mb-6 text-left">
           <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
           <input 
            type="text" 
            placeholder="Space Name (e.g. Master Bath)" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none mb-4"
            value={spaceInfo.name}
            onChange={e => setSpaceInfo({...spaceInfo, name: e.target.value})}
          />
        </div>
        
        {spaceInfo.beforeImage ? (
           <div className="mb-6 relative group">
              <img src={spaceInfo.beforeImage} alt="Before" className="max-h-64 mx-auto rounded-lg shadow" />
              <button 
                onClick={() => setSpaceInfo({...spaceInfo, beforeImage: null})}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Change
              </button>
           </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSpaceInfo({...spaceInfo, beforeImage: reader.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <div className="text-6xl mb-4">📸</div>
            <p className="font-medium text-slate-700">Tap to take photo or upload</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8">
            <button onClick={onCancel} className="text-slate-500 px-4 py-2">Cancel</button>
            <button 
              disabled={!spaceInfo.beforeImage}
              onClick={() => setStep(3)} 
              className="bg-brand-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              Next: Description
            </button>
        </div>
      </div>
    );
  }

  if (step === 3) { // Renovation Description Step
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Describe the Renovation</h2>
        
        {/* Top: Image */}
        <div className="w-full max-w-2xl mx-auto mb-8 bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
             <div className="relative aspect-video">
                  <img src={spaceInfo.beforeImage!} alt="Before" className="w-full h-full object-cover" />
             </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Custom Scope */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
               <div className="flex justify-between items-center mb-4">
                   <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                       Your Vision
                   </label>
                   <button 
                     onClick={handleMicClick}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                   >
                       {isListening ? (
                           <>
                             <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                             Rec
                           </>
                       ) : (
                           <>
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                             Dictate
                           </>
                       )}
                   </button>
               </div>
               
               <div className="relative flex-grow">
                   <textarea 
                     className="w-full p-4 border border-slate-300 rounded-xl h-48 text-base leading-relaxed focus:ring-2 focus:ring-brand-500 outline-none shadow-sm resize-none"
                     placeholder="Type your renovation goals here... (e.g. Remove the carpet, install oak flooring, paint walls white, add modern lighting)"
                     value={spaceInfo.description}
                     onChange={e => setSpaceInfo({...spaceInfo, description: e.target.value})}
                   />
                   <div className="absolute bottom-3 right-3">
                       <button 
                           onClick={handleSmartDescription}
                           className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center gap-1"
                           disabled={loading}
                           title="Improve text with AI"
                        >
                           ✨ AI Enhance
                       </button>
                   </div>
               </div>
            </div>

            {/* Right: AI Suggestion */}
            <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm flex flex-col h-full relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                   <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">2</span>
                       AI Suggestion
                   </label>
               </div>
               
               <div className="relative flex-grow flex flex-col relative z-10">
                   <div className="mb-4">
                        <button 
                            onClick={handleAutoAnalyze}
                            className="w-full bg-white text-brand-600 py-3 rounded-lg font-bold hover:bg-brand-50 flex items-center justify-center gap-2 border-2 border-brand-100 transition-colors shadow-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-pulse">Analyzing...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Auto-Analyze Image
                                </>
                            )}
                        </button>
                   </div>
                   <textarea 
                     className="w-full p-4 border border-brand-200 rounded-xl flex-grow text-base leading-relaxed focus:ring-2 focus:ring-brand-500 outline-none shadow-sm resize-none bg-brand-50/30"
                     placeholder="AI suggested renovation plan will appear here..."
                     value={aiSuggestion}
                     onChange={e => setAiSuggestion(e.target.value)}
                   />
               </div>
            </div>

        </div>

        <div className="flex justify-between items-center pt-8 mt-4">
            <button onClick={() => setStep(2)} className="text-slate-500 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">Back</button>
            <button 
                onClick={() => setStep(4)} 
                className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-brand-700 transition-transform transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!spaceInfo.description && !aiSuggestion}
            >
                Next: Select Materials
            </button>
        </div>
      </div>
    );
  }

  if (step === 4) { // Materials Selection Step
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Select Materials</h2>
            <div className="text-sm text-slate-500">
                Selected: <span className="font-bold text-brand-600">{spaceInfo.materials?.length || 0}</span>
            </div>
        </div>
        
        <div className="flex flex-col gap-8">
          
          {/* Material Selector */}
          <div className="flex-grow bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              {/* Category Filters */}
              <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                      <button 
                        onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${!selectedCategory ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                      >
                          All Categories
                      </button>
                      {availableCategories.map(cat => (
                           <button 
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(null); }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedCategory === cat ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                          >
                            {cat}
                          </button>
                      ))}
                  </div>
                  
                  {/* SubCategory Filters */}
                  {selectedCategory && (
                       <div className="flex flex-wrap gap-2 animate-fade-in pl-2 border-l-2 border-brand-100">
                          <span className="text-xs font-bold text-slate-400 py-1.5">Sub-Category:</span>
                           <button 
                             onClick={() => setSelectedSubCategory(null)}
                             className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${!selectedSubCategory ? 'bg-slate-200 text-slate-800' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                           >
                               Any
                           </button>
                           {availableSubCategories.map(sub => (
                               <button 
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${selectedSubCategory === sub ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                               >
                                {sub}
                               </button>
                           ))}
                       </div>
                  )}
              </div>

              {/* Material Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {displayedMaterials.map(m => {
                      const isSelected = spaceInfo.materials?.some(x => x.id === m.id);
                      return (
                        <div 
                            key={m.id} 
                            onClick={() => toggleMaterial(m)}
                            className={`cursor-pointer border rounded-lg overflow-hidden transition-all relative group ${isSelected ? 'ring-2 ring-brand-500 border-transparent shadow-md' : 'border-slate-200 hover:border-brand-300 hover:shadow-sm'}`}
                        >
                            <div className="h-28 bg-slate-100 relative">
                                <img src={m.imageUrl} className="w-full h-full object-cover" loading="lazy" />
                                {isSelected && (
                                    <div className="absolute inset-0 bg-brand-600/20 flex items-center justify-center">
                                        <div className="bg-brand-600 text-white rounded-full p-1">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <div className="text-xs text-slate-500 font-medium mb-0.5">{m.subCategory}</div>
                                <div className="font-bold text-slate-900 text-sm leading-tight mb-1">{m.name}</div>
                                <div className="text-[10px] text-slate-400 line-clamp-2">{m.description}</div>
                            </div>
                        </div>
                      );
                  })}
                  {displayedMaterials.length === 0 && (
                      <div className="col-span-full py-12 text-center text-slate-400">
                          No materials found in this category.
                      </div>
                  )}
              </div>
          </div>

          {/* Selected Materials Sidebar - Moved Below */}
          <div className="w-full shrink-0">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Selected Items</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {spaceInfo.materials?.map(m => (
                         <div key={m.id} className="bg-white border border-slate-200 p-2 rounded-lg flex items-center gap-3 shadow-sm group">
                             <img src={m.imageUrl} className="w-10 h-10 rounded object-cover border border-slate-100" />
                             <div className="flex-grow min-w-0">
                                 <div className="font-bold text-xs text-slate-900 truncate">{m.name}</div>
                                 <div className="text-[10px] text-slate-500">{m.category}</div>
                             </div>
                             <button onClick={() => toggleMaterial(m)} className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                         </div>
                     ))}
                     {(!spaceInfo.materials || spaceInfo.materials.length === 0) && (
                         <div className="col-span-full text-center py-8 text-slate-400 text-sm">
                             No materials selected yet.
                         </div>
                     )}
                 </div>
             </div>
          </div>

        </div>

        <div className="flex justify-end pt-8 gap-3 border-t border-slate-100 mt-6">
            <button onClick={() => setStep(3)} className="text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">Back</button>
            <button onClick={() => { setStep(5); handleGenerate(); }} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-brand-700 transition-colors">Generate Preview</button>
        </div>
      </div>
    );
  }

  if (step === 5) { // Preview
    const currentActiveImage = activePreview === 'ai' ? generatedAfterAI : generatedAfterCustom;

    return (
      <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-slate-900">
        <div className="flex-grow relative flex items-center justify-center p-4">
          {loading ? (
             <div className="text-white text-center">
               <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500 mx-auto mb-4"></div>
               <p className="text-xl font-light animate-pulse">Designing your space...</p>
             </div>
          ) : currentActiveImage ? (
            <div className="w-full max-w-6xl">
               <BeforeAfterSlider beforeImage={spaceInfo.beforeImage!} afterImage={currentActiveImage} />
            </div>
          ) : (
            <div className="text-white">Waiting for generation...</div>
          )}
        </div>

        <div className="bg-white p-4 border-t border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-end lg:items-center gap-6">
             
             {/* Plan Selector (New Feature) */}
             {(generatedAfterCustom || generatedAfterAI) && (
                 <div className="flex gap-2 p-1 bg-slate-100 rounded-lg shrink-0">
                     {generatedAfterCustom && (
                        <button 
                           onClick={() => setActivePreview('custom')}
                           className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activePreview === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Your Scope
                        </button>
                     )}
                     {generatedAfterAI && (
                        <button 
                           onClick={() => setActivePreview('ai')}
                           className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activePreview === 'ai' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            AI Proposal
                        </button>
                     )}
                 </div>
             )}

             {/* Refine Controls */}
             <div className="flex-grow w-full space-y-3">
               <div className="flex gap-2 w-full">
                  <input 
                    type="text" 
                    placeholder={`Refine ${activePreview === 'ai' ? 'AI Proposal' : 'Your Scope'}...`}
                    className="flex-grow p-2 border rounded-lg"
                    value={refinementPrompt}
                    onChange={e => setRefinementPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRefine()}
                  />
                  <button onClick={handleRefine} disabled={loading} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">Refine</button>
                  <select 
                    className="p-2 border rounded-lg text-sm hidden sm:block"
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value as ImageSize)}
                  >
                    <option value={ImageSize.Resolution_1K}>1K Res</option>
                    <option value={ImageSize.Resolution_2K}>2K Res</option>
                    <option value={ImageSize.Resolution_4K}>4K Res</option>
                  </select>
               </div>
               
               {/* Scope & Permitting Checkboxes */}
               <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 pt-1">
                  <span className="font-bold text-slate-400 uppercase text-xs mr-2">Scope & Permitting:</span>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" className="rounded text-brand-600" checked={includeElectrical} onChange={e => setIncludeElectrical(e.target.checked)} />
                    Includes Electrical
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" className="rounded text-brand-600" checked={includePlumbing} onChange={e => setIncludePlumbing(e.target.checked)} />
                    Includes Plumbing
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" className="rounded text-brand-600" checked={pullPermit} onChange={e => setPullPermit(e.target.checked)} />
                    Contractor Pulls Permit
                  </label>
               </div>
             </div>

             {/* Actions */}
             <div className="flex items-center gap-3 shrink-0">
                <button onClick={handleGenerate} disabled={loading} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 hidden sm:block">Regenerate</button>
                <button 
                    onClick={handleExportPDF} 
                    className="bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Export PDF
                </button>
                <button onClick={handleFinalSave} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-green-700">Save & Finish</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 6) { // Success
     return (
       <div className="max-w-2xl mx-auto py-16 px-4 text-center">
         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
         </div>
         <h2 className="text-3xl font-bold mb-4">{mode === 'new-project' ? 'Project Created!' : 'Space Saved!'}</h2>
         <p className="text-slate-600 mb-8">Your renovation visualization is ready.</p>
         <button onClick={onCancel} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800">
           Return to Project
         </button>
       </div>
    );
  }

  return null;
};
