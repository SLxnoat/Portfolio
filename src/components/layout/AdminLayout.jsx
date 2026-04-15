import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, Cpu, GraduationCap, Mail, ArrowLeft, Settings } from 'lucide-react';

const AdminLayout = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Profile Editor', path: '/admin/profile', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Skills', path: '/admin/skills', icon: Cpu },
    { name: 'Experience', path: '/admin/experience', icon: GraduationCap },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="admin-layout-container d-flex min-vh-100 bg-darker overflow-hidden">
      {/* Sidebar */}
      <aside className="admin-sidebar glass border-end border-secondary border-opacity-10 d-flex flex-column" style={{ width: '280px' }}>
        <div className="p-4 border-bottom border-secondary border-opacity-10 mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="bg-primary rounded-circle" style={{ width: 10, height: 10 }}></div>
            <h2 className="text-white h5 mb-0 fw-bold">OS.PRIME / ADMIN</h2>
          </div>
          <span className="text-secondary small">System Operator Mode</span>
        </div>

        <nav className="flex-grow-1 px-3">
          <div className="d-flex flex-column gap-2">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => 
                  `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                    isActive ? 'bg-primary bg-opacity-10 text-primary fw-bold' : 'text-secondary hover-bg-white-5'
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-top border-secondary border-opacity-10">
          <NavLink to="/" className="d-flex align-items-center gap-3 text-secondary text-decoration-none hover-text-primary small">
            <ArrowLeft size={16} />
            Back to Public Site
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-auto position-relative">
        <header className="p-4 sticky-top glass border-bottom border-secondary border-opacity-10 z-10">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="h5 text-white mb-0">System Control Panel</h3>
            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary small">v3.5.0-REACT</span>
              <Settings size={18} className="text-secondary cursor-pointer" />
            </div>
          </div>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
