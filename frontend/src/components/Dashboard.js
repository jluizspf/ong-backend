import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    alunos: 0,
    cursos: 0,
    professores: 0,
    colaboradores: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const apiUrl = "https://cidemoradia.duckdns.org";
  const fetchStats = async () => {
    try {
      setLoading(true);
      const [alunosRes, cursosRes, professoresRes, colaboradoresRes] = await Promise.all([
        axios.get(`${apiUrl}/api/alunos`),
        axios.get(`${apiUrl}/api/cursos`),
        axios.get(`${apiUrl}/api/professores`),
        axios.get(`${apiUrl}/api/colaboradores`)
      ]);

      setStats({
        alunos: alunosRes.data.count || 0,
        cursos: cursosRes.data.count || 0,
        professores: professoresRes.data.count || 0,
        colaboradores: colaboradoresRes.data.count || 0
      });
    } catch (err) {
      setError('Erro ao carregar estatísticas');
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando estatísticas...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <h3>Erro</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchStats}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Alunos',
      value: stats.alunos,
      icon: '👨‍🎓',
      color: '#4CAF50',
      description: 'Total de alunos cadastrados'
    },
    {
      title: 'Cursos',
      value: stats.cursos,
      icon: '📚',
      color: '#2196F3',
      description: 'Total de cursos disponíveis'
    },
    {
      title: 'Professores',
      value: stats.professores,
      icon: '👨‍🏫',
      color: '#FF9800',
      description: 'Total de professores ativos'
    },
    {
      title: 'Colaboradores',
      value: stats.colaboradores,
      icon: '👥',
      color: '#9C27B0',
      description: 'Total de colaboradores'
    }
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Dashboard - Visão Geral</h2>
          <button className="btn btn-primary" onClick={fetchStats}>
            🔄 Atualizar
          </button>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          {statCards.map((stat, index) => (
            <div 
              key={index}
              className="card"
              style={{ 
                borderLeft: `4px solid ${stat.color}`,
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
              }}
            >
              <div className="d-flex justify-between align-center">
                <div>
                  <h3 style={{ color: stat.color, marginBottom: '0.5rem' }}>
                    {stat.icon} {stat.title}
                  </h3>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                    {stat.value}
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">🚀 Sistema de Gestão da ONG</h3>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Bem-vindo ao sistema completo de gestão educacional da ONG. 
          Aqui você pode gerenciar todos os aspectos da organização.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: '#4CAF50', marginBottom: '0.5rem' }}>👨‍🎓 Alunos</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Cadastre e gerencie informações dos alunos, incluindo escolaridade e renda familiar.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: '#2196F3', marginBottom: '0.5rem' }}>📚 Cursos</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Crie e gerencie cursos, controle vagas e horários disponíveis.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: '#FF9800', marginBottom: '0.5rem' }}>👨‍🏫 Professores</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Gerencie o corpo docente e suas atribuições aos cursos.
            </p>
          </div>
          
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: '#9C27B0', marginBottom: '0.5rem' }}>👥 Colaboradores</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Administre a equipe de colaboradores e suas responsabilidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
