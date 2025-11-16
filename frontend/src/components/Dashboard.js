// Conteúdo para: frontend/src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
// Importa o componente 'Pie' (pizza) e as dependências do Chart.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registra os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // --- Estados para o Status da API (você já deve ter algo parecido) ---
  const [apiStatus, setApiStatus] = useState(false);
  const [dbStatus, setDbStatus] = useState(false);

  // --- Novos Estados para o Gráfico ---
  const [chartData, setChartData] = useState(null); // Guarda os dados formatados para o gráfico
  const [error, setError] = useState(''); // Guarda mensagens de erro do gráfico

  // Define as datas padrão para o filtro
  const [dataInicio, setDataInicio] = useState('2025-01-01');
  const [dataFim, setDataFim] = useState('2025-12-31');

  // Função para verificar a saúde da API (você já deve ter esta função)
  const checkApiHealth = async () => {
    try {
      const response = await fetch('/health'); // Chama a rota /health do server.js
      const data = await response.json();
      if (data.status === 'ok') {
        setApiStatus(true);
        setDbStatus(data.database === 'connected');
      } else {
        setApiStatus(false);
        setDbStatus(false);
      }
    } catch (error) {
      console.error("Erro ao verificar saúde da API:", error);
      setApiStatus(false);
      setDbStatus(false);
    }
  };

  // Função para buscar os dados das estatísticas do gráfico
  const fetchChartData = async () => {
    try {
      // Chama a nova rota da API que criámos
      const response = await fetch(`/api/cursos/stats/matriculas-por-curso?data_inicio=${dataInicio}&data_fim=${dataFim}`);
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // Formata os dados recebidos da API para o formato que o Chart.js espera
        const labels = result.data.map(item => item.nome_curso);
        const data = result.data.map(item => item.quantidade_matriculas);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Matrículas',
              data: data,
              backgroundColor: [ // Cores para as fatias da pizza
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
              ],
              borderColor: 'rgba(255, 255, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
        setError('');
      } else {
        setChartData(null); // Limpa o gráfico se não houver dados
        setError('Nenhum dado encontrado para este período.');
      }
    } catch (err) {
      setError('Erro ao buscar dados do gráfico.');
      console.error(err);
    }
  };

  // useEffect para buscar os dados quando o componente carregar
  useEffect(() => {
    checkApiHealth(); // Verifica a saúde da API
    fetchChartData(); // Busca os dados do gráfico
  }, [dataInicio, dataFim]); // Dependências: refaz a busca se as datas mudarem

  return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>

        {/* Indicador de Status */}
        <div className="status-indicator">
          <span>API: {apiStatus ? '🟢 Online' : '🔴 Offline'}</span>
          <span> | </span>
          <span>DB: {dbStatus ? '🟢 Conectado' : '🔴 Desconectado'}</span>
        </div>

        <p>Sistema completo para gerenciar alunos, cursos, professores e colaboradores.</p>

        <hr style={{ margin: '20px 0' }} />

        {/* --- Secção do Gráfico --- */}
        <div className="grafico-container" style={{ maxWidth: '450px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Matrículas por Curso</h3>

          {/* Inputs de Data */}
          <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px' }}>De: </label>
              <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px' }}>Até: </label>
              <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          {/* O Gráfico em Pizza */}
          {chartData ? (
              <Pie data={chartData} />
          ) : (
              <p style={{ textAlign: 'center', color: '#777' }}>
                {error || 'Carregando gráfico...'}
              </p>
          )}
        </div>
      </div>
  );
};

export default Dashboard;