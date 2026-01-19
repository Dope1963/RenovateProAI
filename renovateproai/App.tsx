
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MarketingHome } from './pages/MarketingHome';
import { ContractorDashboard } from './pages/ContractorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { UserRole, Material } from './types';
import { DEFAULT_CMS_CONTENT, MOCK_MATERIALS } from './constants';

function App() {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.VISITOR);
  
  // Admin Profile State
  const [adminProfileImage, setAdminProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [adminName, setAdminName] = useState('Administrator');

  // Contractor Profile State
  const [contractorName, setContractorName] = useState('Mike Builder');
  const [contractorImage, setContractorImage] = useState('https://picsum.photos/100/100?u=1');
  
  // Materials State (Lifted)
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);

  // Global CMS State
  const [cmsContent, setCmsContent] = useState(DEFAULT_CMS_CONTENT);
  
  // Job Tags State
  const [jobTags, setJobTags] = useState<string[]>(['Open Quote', 'Open Job', 'Complete']);

  return (
    <HashRouter>
      <Layout 
        userRole={userRole} 
        setUserRole={setUserRole} 
        adminProfileImage={adminProfileImage}
        adminName={adminName}
        contractorName={contractorName}
        contractorProfileImage={contractorImage}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <MarketingHome 
                setUserRole={setUserRole} 
                cmsContent={cmsContent}
              />
            } 
          />
          <Route 
            path="/login" 
            element={
              <Login 
                setUserRole={setUserRole} 
                setAdminName={setAdminName}
                setAdminProfileImage={setAdminProfileImage}
              />
            } 
          />
          <Route path="/signup" element={<Signup setUserRole={setUserRole} />} />
          
          <Route 
            path="/app/*" 
            element={
              userRole === UserRole.CONTRACTOR 
              ? <ContractorDashboard 
                  jobTags={jobTags} 
                  contractorName={contractorName}
                  setContractorName={setContractorName}
                  contractorImage={contractorImage}
                  setContractorImage={setContractorImage}
                  materials={materials}
                  setMaterials={setMaterials}
                /> 
              : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              userRole === UserRole.ADMIN 
              ? <AdminDashboard 
                  profileImage={adminProfileImage} 
                  setProfileImage={setAdminProfileImage}
                  adminName={adminName}
                  setAdminName={setAdminName}
                  // CMS Props
                  cmsContent={cmsContent}
                  setCmsContent={setCmsContent}
                  // Job Tags
                  jobTags={jobTags}
                  setJobTags={setJobTags}
                /> 
              : <div className="p-8 text-center">
                  <h2 className="text-xl font-bold">Admin Login</h2>
                  <p className="mb-4">Use the demo menu to access.</p>
                  <button onClick={() => setUserRole(UserRole.ADMIN)} className="bg-brand-600 text-white px-4 py-2 rounded">Simulate Admin Login</button>
                </div>
            } 
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
