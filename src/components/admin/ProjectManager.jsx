import { useState } from 'react';
import usePortfolioStore from '../../store/usePortfolioStore';
import { Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

const ProjectManager = () => {
  const { projects, addProject, updateProject, deleteProject } = usePortfolioStore();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', tech: '', description: '', results: '', order: 0 });

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', tech: '', description: '', results: '', order: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateProject({ ...formData, id: editingId });
    } else {
      await addProject(formData);
    }
    resetForm();
  };

  return (
    <div className="project-manager">
      <div className="row g-4">
        {/* Form Column */}
        <div className="col-lg-4">
          <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
            <h3 className="h5 text-white mb-4">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-secondary small">Project Title</label>
                <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="form-label text-secondary small">Technologies (comma separated)</label>
                <input type="text" className="form-control" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} required />
              </div>
              <div>
                <label className="form-label text-secondary small">Description</label>
                <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
              </div>
              <div>
                <label className="form-label text-secondary small">Key Results</label>
                <input type="text" className="form-control" value={formData.results} onChange={e => setFormData({...formData, results: e.target.value})} />
              </div>
              <div className="d-flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary flex-grow-1 text-dark fw-bold">
                  {editingId ? 'Update' : 'Add Project'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn btn-outline-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {projects.map((project) => (
              <div key={project.id} className="glass-card p-3 d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="h6 text-white mb-1">{project.title}</h4>
                  <div className="text-secondary small">{project.tech}</div>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => handleEdit(project)} className="btn btn-sm btn-outline-primary border-0 p-2 rounded-circle">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteProject(project.id)} className="btn btn-sm btn-outline-danger border-0 p-2 rounded-circle">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;
