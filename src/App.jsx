import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import usePortfolioStore from './store/usePortfolioStore';

// Layouts
import ClientLayout from './components/layout/ClientLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Home from './components/home/Home';
import AdminDashboard from './components/admin/AdminDashboard';
import ProfileEditor from './components/admin/ProfileEditor';
import ProjectManager from './components/admin/ProjectManager';
import NotFound from './components/ui/NotFound';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Client Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="skills" element={<AdminDashboard />} />
          <Route path="experience" element={<AdminDashboard />} />
          <Route path="messages" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { fetchData, isLoading } = usePortfolioStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-dark text-primary">
        <div className="text-center">
          <h2 className="gradient-text animate-pulse">BOOTING OS.PRIME...</h2>
          <p className="text-secondary small mt-2">Initializing System Core</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
