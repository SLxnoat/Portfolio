import { useState, useEffect } from 'react';
import usePortfolioStore from '../../store/usePortfolioStore';
import { portfolioService } from '../../services/portfolioService';
import { Eye, MousePointerClick, History, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { profile, projects, skills } = usePortfolioStore();
  const [stats, setStats] = useState({ totalViews: 0, interactions: 0, recentLogs: [] });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await portfolioService.getAnalyticsSummary();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary small fw-bold">TOTAL VIEWS</span>
              <Eye size={18} className="text-primary" />
            </div>
            <div className="h2 text-white fw-bold mb-0">{stats.totalViews}</div>
            <div className="text-success small">Page load events</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary small fw-bold">INTERACTIONS</span>
              <MousePointerClick size={18} className="text-secondary" />
            </div>
            <div className="h2 text-white fw-bold mb-0">{stats.interactions}</div>
            <div className="text-secondary small">Total system events</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary small fw-bold">PROJECTS</span>
              <Activity size={18} className="text-info" />
            </div>
            <div className="h2 text-white fw-bold mb-0">{projects.length}</div>
            <div className="text-info small">Active in repository</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary small fw-bold">STATUS</span>
              <div className="bg-success rounded-circle" style={{ width: 10, height: 10 }}></div>
            </div>
            <div className="h2 text-success fw-bold mb-0">ONLINE</div>
            <div className="text-secondary small">v3.5 Stable</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100">
            <h3 className="h5 text-white mb-4 d-flex align-items-center gap-2">
              <History size={18} className="text-primary" />
              Recent System Logs
            </h3>
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Timestamp</th>
                    <th>Event Type</th>
                    <th>Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLogs.map((log, i) => (
                    <tr key={i}>
                      <td className="small text-secondary">{new Date(log.timestamp).toLocaleString()}</td>
                      <td><span className="badge bg-primary bg-opacity-10 text-primary">{log.type}</span></td>
                      <td className="small text-secondary-50">{JSON.stringify(log.metadata)}</td>
                    </tr>
                  ))}
                  {stats.recentLogs.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-secondary">No recent logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 mb-4">
            <h3 className="h5 text-white mb-4">Operator Profile</h3>
            <div className="d-flex align-items-center gap-3">
              <img 
                src={profile?.photo} 
                className="rounded-circle border border-primary p-1" 
                style={{ width: 64, height: 64, objectFit: 'cover' }}
                alt="Profile"
              />
              <div>
                <div className="text-white fw-bold">{profile?.name}</div>
                <div className="text-secondary small">{profile?.role}</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="h5 text-white mb-3">Quick Actions</h3>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-primary btn-sm text-start py-2">Sync with MongoDB</button>
              <button className="btn btn-outline-secondary btn-sm text-start py-2">Export Data (JSON)</button>
              <button className="btn btn-outline-danger btn-sm text-start py-2">Clear Analytics Cache</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
