import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import GoalSetup from './GoalSetup';
import CreateModule from '../components/CreateModule';
import { ArrowLeft } from 'lucide-react';
import './CreateFlow.css';

const CreateFlow = () => {
  const [setupData, setSetupData] = useState({
    goal: '',
    skillLevel: 'Beginner',
    timeCommitment: '1 hour/day'
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentStep = location.pathname.includes('/method') ? 2 : 1;

  return (
    <div className="create-flow-wrapper">
      <div className="create-flow-header">
        {currentStep === 2 && (
           <button className="btn-back" onClick={() => navigate('/create/goal')}>
             <ArrowLeft size={16} /> Back
           </button>
        )}
        <div className="step-indicator">
          Step {currentStep} of 2: {currentStep === 1 ? 'Define Goal' : 'Choose Method'}
        </div>
      </div>
      
      <div className="create-flow-content">
        <Routes>
          <Route path="goal" element={<GoalSetup data={setupData} setData={setSetupData} />} />
          <Route path="method" element={<CreateModule data={setupData} />} />
          <Route path="*" element={<Navigate to="goal" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default CreateFlow;
