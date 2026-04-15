import { useState, useEffect } from 'react';
import usePortfolioStore from '../../store/usePortfolioStore';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const ProfileEditor = () => {
  const { profile, updateProfile } = usePortfolioStore();
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    if (profile) setFormData({ ...profile });
  }, [profile]);

  if (!formData) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Syncing system data...' });
    try {
      await updateProfile(formData);
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    }
  };

  return (
    <div className="profile-editor max-w-4xl">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 text-white mb-0">Profile Configuration</h2>
        {status.message && (
          <div className={`d-flex align-items-center gap-2 small px-3 py-1 rounded-pill ${
            status.type === 'success' ? 'bg-success bg-opacity-10 text-success' : 
            status.type === 'error' ? 'bg-danger bg-opacity-10 text-danger' : 
            'bg-primary bg-opacity-10 text-primary'
          }`}>
            {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {status.message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-4">
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label text-secondary small fw-bold">Display Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-secondary small fw-bold">Primary Role</label>
            <input 
              type="text" 
              name="role" 
              value={formData.role || ''} 
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-12">
            <label className="form-label text-secondary small fw-bold">Hero Tagline</label>
            <input 
              type="text" 
              name="tagline" 
              value={formData.tagline || ''} 
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label text-secondary small fw-bold">Profile Photo URL</label>
            <input 
              type="text" 
              name="photo" 
              value={formData.photo || ''} 
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <div className="form-check form-switch mb-2">
              <input 
                className="form-check-input" 
                type="checkbox" 
                name="openToWork"
                checked={formData.openToWork || false}
                onChange={handleChange}
                id="openToWorkSwitch"
              />
              <label className="form-check-label text-white small" htmlFor="openToWorkSwitch">Open to Work</label>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label text-secondary small fw-bold">Professional Summary</label>
            <textarea 
              name="summary" 
              rows="6" 
              value={formData.summary || ''} 
              onChange={handleChange}
              className="form-control"
            ></textarea>
          </div>

          <div className="col-12 mt-4 pt-4 border-top border-secondary border-opacity-10 text-end">
            <button type="submit" className="btn btn-primary px-4 d-inline-flex align-items-center gap-2 fw-bold text-dark">
              <Save size={18} />
              Commit Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
