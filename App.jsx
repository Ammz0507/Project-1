import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    experience: '', 
    targetRole: '' 
  });
  const [aiData, setAiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAiAction = async () => {
    if (!formData.experience || !formData.targetRole) return alert("Fill target role and experience first!");
    setIsLoading(true);
    setAiData(null);
    try {
      const res = await axios.post('http://localhost:5000/api/roast-and-fix', {
        text: formData.experience,
        targetRole: formData.targetRole
      });
      setAiData(res.data);
    } catch (error) {
      alert('Error fetching AI response');
    }
    setIsLoading(false);
  };

  const applyGodTierFix = () => {
    setFormData({ ...formData, experience: aiData.godTierFix });
    setAiData(null);
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/api/save', formData);
      alert('Resume saved to DB!');
    } catch (error) {
      alert('Error saving data');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-neutral-900 font-sans text-white">
      <div className="w-5/12 p-8 overflow-y-auto border-r border-neutral-700 print:hidden shadow-lg z-10 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-black text-rose-500 tracking-tight">RoastMyResume.ai</h1>
          <p className="text-neutral-400 mt-2 text-sm">Stop writing trash resumes. Let our brutal AI fix it using the FAANG XYZ formula.</p>
        </div>
        
        <div className="space-y-4">
          <input 
            name="name" 
            value={formData.name}
            onChange={handleChange} 
            placeholder="Full Name" 
            className="w-full p-4 bg-neutral-800 border-none rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-white placeholder-neutral-500 font-medium" 
          />
          <input 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            placeholder="Email Address" 
            className="w-full p-4 bg-neutral-800 border-none rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-white placeholder-neutral-500 font-medium" 
          />
          
          <input 
            name="targetRole" 
            value={formData.targetRole}
            onChange={handleChange} 
            placeholder="Dream Job (e.g., Senior Product Manager)" 
            className="w-full p-4 bg-neutral-800 border-none rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-white placeholder-neutral-500 font-medium" 
          />

          <textarea 
            name="experience" 
            value={formData.experience}
            onChange={handleChange} 
            placeholder="Write what you did (e.g., 'I built a login page')..." 
            className="w-full p-4 bg-neutral-800 border-none rounded-xl h-32 focus:ring-2 focus:ring-rose-500 outline-none text-white placeholder-neutral-500 font-medium resize-none"
          ></textarea>
          
          <button 
            onClick={handleAiAction} 
            disabled={isLoading}
            className="bg-rose-600 hover:bg-rose-500 text-white font-black p-4 rounded-xl w-full transition shadow-lg shadow-rose-600/20"
          >
            {isLoading ? 'Recruiter is reading...' : 'Roast & Fix My Experience'}
          </button>
          
          {aiData && (
            <div className="space-y-4 mt-4 animate-fade-in">
              <div className="p-5 bg-red-950/50 border border-red-900 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <h4 className="text-red-400 font-black mb-2 uppercase text-xs tracking-widest">Recruiter's Roast</h4>
                <p className="text-sm text-red-200">{aiData.roast}</p>
              </div>

              <div className="p-5 bg-emerald-950/50 border border-emerald-900 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <h4 className="text-emerald-400 font-black mb-2 uppercase text-xs tracking-widest">FAANG God-Tier Fix</h4>
                <p className="text-sm text-emerald-100 mb-4">{aiData.godTierFix}</p>
                <button 
                  onClick={applyGodTierFix} 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition text-sm"
                >
                  Inject into Resume
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-neutral-800 mt-4">
            <button onClick={handleSave} className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold p-3 rounded-xl w-1/2 transition">Save to DB</button>
            <button onClick={handlePrint} className="bg-white hover:bg-neutral-200 text-black font-bold p-3 rounded-xl w-1/2 transition">Export PDF</button>
          </div>
        </div>
      </div>

      <div className="w-7/12 p-8 bg-neutral-950 print:w-full print:p-0 print:bg-white flex justify-center items-center overflow-y-auto">
        <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] p-16 shadow-2xl print:shadow-none print:min-h-0 text-black">
          <h2 className="text-5xl font-black mb-2 text-neutral-900 uppercase tracking-tighter">
            {formData.name || 'YOUR NAME'}
          </h2>
          <p className="text-lg text-neutral-600 mb-10 font-medium tracking-wide">
            {formData.email || 'email@example.com'} • {formData.targetRole || 'Your Target Role'}
          </p>
          
          <div>
            <h3 className="text-lg font-black mb-4 text-neutral-900 uppercase tracking-widest border-b-2 border-neutral-900 pb-2">
              Professional Experience
            </h3>
            <div className="flex items-start">
              <span className="text-neutral-900 mr-3 mt-1 text-xl">•</span>
              <p className="text-neutral-800 leading-relaxed text-lg whitespace-pre-wrap">
                {formData.experience || 'Your God-Tier experience bullet points will appear here. The AI will inject industry-standard metrics automatically.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}