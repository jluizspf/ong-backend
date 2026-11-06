import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';



// Componentes
import Alunos from './components/Alunos';
import Cursos from './components/Cursos';
import Professores from './components/Professores';
import Colaboradores from './components/Colaboradores';
import Dashboard from './components/Dashboard';



// Configuração do axios
axios.defaults.baseURL = 'https://ominous-space-funicular-5jrg5jj7pw4cvwvp-3000.app.github.dev';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/alunos', label: 'Alunos', icon: '👨‍🎓' },
    { path: '/cursos', label: 'Cursos', icon: '📚' },
    { path: '/professores', label: 'Professores', icon: '👨‍🏫' },
    { path: '/colaboradores', label: 'Colaboradores', icon: '👥' }
  ];

  return (
    <nav className="nav">
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.path} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function App() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('unknown');

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`/api/health`);
      setApiStatus('online');
      setDbStatus(response.data.database);
    } catch (error) {
      setApiStatus('offline');
      setDbStatus('unknown');
      console.error('Erro ao verificar saúde da API:', error);
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>🏫 Sistema de Gestão da ONG</h1>
          <p>
            Sistema completo para gerenciar alunos, cursos, professores e colaboradores
            <span style={{ marginLeft: '1rem', fontSize: '0.9rem' }}>
              API: <span style={{ color: apiStatus === 'online' ? '#4CAF50' : '#f44336' }}>
                {apiStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
              </span>
              {apiStatus === 'online' && (
                <span style={{ marginLeft: '0.5rem' }}>
                  | DB: <span style={{ color: dbStatus === 'connected' ? '#4CAF50' : '#f44336' }}>
                    {dbStatus === 'connected' ? '🟢 Conectado' : '🔴 Desconectado'}
                  </span>
                </span>
              )}
            </span>
          </p>
        </header>

        <Navigation />

        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/professores" element={<Professores />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
