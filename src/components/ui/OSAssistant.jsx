import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ChevronRight } from 'lucide-react';
import usePortfolioStore from '../../store/usePortfolioStore';

const OSAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { type: 'system', text: 'PRIME_AGENT v1.0 BOOT SEQUENCE...' },
    { type: 'system', text: 'SYSTEM_READY. WELCOME, OPERATOR.' }
  ]);
  const scrollRef = useRef(null);
  const { profile } = usePortfolioStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    const newLogs = [...logs, { type: 'user', text: `${profile?.ui_terminal_prompt || 'user@portfolio:'} ${input}` }];

    // Simple Command Logic
    let response = 'Command not recognized. Type "help" for assistance.';
    if (cmd === 'help') response = 'Available commands: help, clear, about, projects, contact, status';
    else if (cmd === 'about') response = profile?.summary.split('\n')[0] || 'AI/ML Engineer platform.';
    else if (cmd === 'status') response = 'System: Online | Kernel: v3.5-React | Latency: 12ms';
    else if (cmd === 'clear') {
      setLogs([]);
      setInput('');
      return;
    }

    setLogs([...newLogs, { type: 'system', text: response }]);
    setInput('');
  };

  return (
    <div className="os-assistant-wrapper">
      {/* Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="assistant-trigger position-fixed shadow-lg"
          style={{ bottom: '2rem', right: '2rem', border: 'none' }}
        >
          <TerminalIcon size={24} />
        </motion.button>
      )}

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isMaximized ? '80vw' : '400px',
              height: isMaximized ? '80vh' : '450px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="assistant-terminal position-fixed bg-darker border border-secondary border-opacity-20 d-flex flex-column shadow-2xl z-50 overflow-hidden"
            style={{ 
              bottom: isMaximized ? '10vh' : '2rem', 
              right: isMaximized ? '10vw' : '2rem', 
              borderRadius: '12px',
              maxWidth: '95vw'
            }}
          >
            {/* Header */}
            <div className="terminal-header d-flex justify-content-between align-items-center px-3 py-2 bg-white bg-opacity-5 border-bottom border-secondary border-opacity-10">
              <div className="d-flex align-items-center gap-2">
                <TerminalIcon size={14} className="text-primary" />
                <span className="small fw-bold text-primary tracking-widest">OS.PRIME / TERMINAL</span>
              </div>
              <div className="d-flex gap-2">
                <button onClick={() => setIsMaximized(!isMaximized)} className="btn btn-link p-0 text-secondary hover-text-white">
                  {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="btn btn-link p-0 text-secondary hover-text-danger">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div 
              ref={scrollRef}
              className="terminal-body flex-grow-1 p-3 overflow-auto font-monospace"
              style={{ fontSize: '0.85rem', color: '#e2e8f0', background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.03) 0%, transparent 100%)' }}
            >
              {logs.map((log, i) => (
                <div key={i} className={`mb-2 ${log.type === 'user' ? 'text-secondary-terminal' : 'text-prime'}`}>
                  {log.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleCommand} className="terminal-input-line d-flex align-items-center px-3 py-2 bg-white bg-opacity-5 border-top border-secondary border-opacity-10">
              <ChevronRight size={16} className="text-primary" />
              <input 
                type="text" 
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command (help)..."
                className="bg-transparent border-0 text-white w-100 outline-none ps-2 small font-monospace"
                style={{ outline: 'none' }}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OSAssistant;
