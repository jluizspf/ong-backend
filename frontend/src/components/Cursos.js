import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    Nome: '',
    Qtd_Vagas: '',
    Per_Duracao: '',
    Local: '',
    Prof_Responsavel: '',
    Horario: '',
    Colaborador_Resp: ''
  });

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cursos`);
      setCursos(response.data.data || []);
    } catch (err) {
      setError('Erro ao carregar cursos');
      console.error('Erro ao buscar cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCurso) {
        await axios.put(`${apiUrl}/api/cursos/${editingCurso.ID_Curso}`, formData);
      } else {
        await axios.post(`${apiUrl}/api/cursos`, formData);
      }
      
      setShowForm(false);
      setEditingCurso(null);
      setFormData({
        Nome: '',
        Qtd_Vagas: '',
        Per_Duracao: '',
        Local: '',
        Prof_Responsavel: '',
        Horario: '',
        Colaborador_Resp: ''
      });
      fetchCursos();
    } catch (err) {
      setError('Erro ao salvar curso');
      console.error('Erro ao salvar curso:', err);
    }
  };

  const handleEdit = (curso) => {
    setEditingCurso(curso);
    setFormData({
      Nome: curso.Nome || '',
      Qtd_Vagas: curso.Qtd_Vagas || '',
      Per_Duracao: curso.Per_Duracao || '',
      Local: curso.Local || '',
      Prof_Responsavel: curso.Prof_Responsavel || '',
      Horario: curso.Horario || '',
      Colaborador_Resp: curso.Colaborador_Resp || ''
    });
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este curso?')) {
      try {
        await axios.delete(`${apiUrl}/api/cursos/${id}`);
        fetchCursos();
      } catch (err) {
        setError('Erro ao deletar curso');
        console.error('Erro ao deletar curso:', err);
      }
    }
  };

  const handleVerificar = async (id) => {
    try {
      // Para simplificar, vamos usar o colaborador ID 1
      await axios.post(`${apiUrl}/api/cursos/${id}/verificar`, { colaboradorId: 1 });
      fetchCursos();
    } catch (err) {
      setError('Erro ao verificar curso');
      console.error('Erro ao verificar curso:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando cursos...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📚 Gerenciar Cursos</h2>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowForm(true);
                setEditingCurso(null);
                setFormData({
                  Nome: '',
                  Qtd_Vagas: '',
                  Per_Duracao: '',
                  Local: '',
                  Prof_Responsavel: '',
                  Horario: '',
                  Colaborador_Resp: ''
                });
              }}
            >
              ➕ Novo Curso
            </button>
            <button className="btn btn-secondary" onClick={fetchCursos}>
              🔄 Atualizar
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button className="btn btn-primary" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        {showForm && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3>{editingCurso ? '✏️ Editar Curso' : '➕ Novo Curso'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nome do Curso *</label>
                  <input
                    type="text"
                    name="Nome"
                    value={formData.Nome}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quantidade de Vagas *</label>
                  <input
                    type="number"
                    name="Qtd_Vagas"
                    value={formData.Qtd_Vagas}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Período de Duração</label>
                  <input
                    type="text"
                    name="Per_Duracao"
                    value={formData.Per_Duracao}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ex: 3 meses, 6 meses"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Local</label>
                  <input
                    type="text"
                    name="Local"
                    value={formData.Local}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professor Responsável</label>
                  <input
                    type="text"
                    name="Prof_Responsavel"
                    value={formData.Prof_Responsavel}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Horário</label>
                  <input
                    type="text"
                    name="Horario"
                    value={formData.Horario}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ex: Segunda e Quarta 19:00-21:00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Colaborador Responsável</label>
                  <input
                    type="text"
                    name="Colaborador_Resp"
                    value={formData.Colaborador_Resp}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingCurso ? '💾 Atualizar' : '➕ Criar'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCurso(null);
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Vagas</th>
                <th>Inscritos</th>
                <th>Duração</th>
                <th>Local</th>
                <th>Horário</th>
                <th>Verificado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cursos.map(curso => (
                <tr key={curso.ID_Curso}>
                  <td>{curso.Nome}</td>
                  <td>{curso.Qtd_Vagas}</td>
                  <td>
                    <span style={{ color: curso.Alunos_Inscritos >= curso.Qtd_Vagas ? '#f44336' : '#4CAF50' }}>
                      {curso.Alunos_Inscritos || 0}
                    </span>
                  </td>
                  <td>{curso.Per_Duracao || '-'}</td>
                  <td>{curso.Local || '-'}</td>
                  <td>{curso.Horario || '-'}</td>
                  <td>
                    <span className={`badge ${curso.Verificado ? 'badge-success' : 'badge-warning'}`}>
                      {curso.Verificado ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleEdit(curso)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        ✏️
                      </button>
                      {!curso.Verificado && (
                        <button 
                          className="btn btn-success"
                          onClick={() => handleVerificar(curso.ID_Curso)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          ✅
                        </button>
                      )}
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(curso.ID_Curso)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cursos.length === 0 && (
          <div className="text-center" style={{ padding: '2rem', color: '#666' }}>
            <p>Nenhum curso cadastrado ainda.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              ➕ Cadastrar Primeiro Curso
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cursos;
