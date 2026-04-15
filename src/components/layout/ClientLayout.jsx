import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import OSAssistant from '../ui/OSAssistant';

const ClientLayout = () => {
  return (
    <div className="client-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <OSAssistant />
      <footer className="section-padding text-center border-top border-secondary opacity-50">
        <p className="small">&copy; {new Date().getFullYear()} Charuka Mayura Bandara | OS.PRIME Systems</p>
      </footer>
    </div>
  );
};

export default ClientLayout;
