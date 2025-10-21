import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Professores() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);

  const [formData, setFormData] = useState({
    Nome: '',
    CPF: '',
    Data_Nascimento: '',
    Email: '',
    Formacao: '',
    Endereco: ''
  });

  useEffect(() => {
    fetchProfessores();
  }, []);

  const apiUrl = process.env.REACT_APP_API_URL;
  
  const fetchProfessores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl/api/professores`);
      setProfessores(response.data.data || []);
    } catch (err) {
      setError('Erro ao carregar professores');
      console.error('Erro ao buscar professores:', err);
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
      if (editingProfessor) {
        await axios.put(`${apiUrl}/api/professores/${editingProfessor.ID_Prof}`, formData);
      } else {
        await axios.post(`${apiUrl}/api/professores`, formData);
      }
      
      setShowForm(false);
      setEditingProfessor(null);
      setFormData({
        Nome: '',
        CPF: '',
        Data_Nascimento: '',
        Email: '',
        Formacao: '',
        Endereco: ''
      });
      fetchProfessores();
    } catch (err) {
      setError('Erro ao salvar professor');
      console.error('Erro ao salvar professor:', err);
    }
  };

  const handleEdit = (professor) => {
    setEditingProfessor(professor);
    setFormData({
      Nome: professor.Nome || '',
      CPF: professor.CPF || '',
      Data_Nascimento: professor.Data_Nascimento || '',
      Email: professor.Email || '',
      Formacao: professor.Formacao || '',
      Endereco: professor.Endereco || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este professor?')) {
      try {
        await axios.delete(`${apiUrl}/api/professores/${id}`);
        fetchProfessores();
      } catch (err) {
        setError('Erro ao deletar professor');
        console.error('Erro ao deletar professor:', err);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando professores...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">👨‍🏫 Gerenciar Professores</h2>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowForm(true);
                setEditingProfessor(null);
                setFormData({
                  Nome: '',
                  CPF: '',
                  Data_Nascimento: '',
                  Email: '',
                  Formacao: '',
                  Endereco: ''
                });
              }}
            >
              ➕ Novo Professor
            </button>
            <button className="btn btn-secondary" onClick={fetchProfessores}>
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
            <h3>{editingProfessor ? '✏️ Editar Professor' : '➕ Novo Professor'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nome *</label>
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
                  <label className="form-label">CPF *</label>
                  <input
                    type="text"
                    name="CPF"
                    value={formData.CPF}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    name="Data_Nascimento"
                    value={formData.Data_Nascimento}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Formação</label>
                  <input
                    type="text"
                    name="Formacao"
                    value={formData.Formacao}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ex: Mestrado em Educação"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Endereço</label>
                <textarea
                  name="Endereco"
                  value={formData.Endereco}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingProfessor ? '💾 Atualizar' : '➕ Criar'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProfessor(null);
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
                <th>CPF</th>
                <th>Email</th>
                <th>Formação</th>
                <th>Data Nascimento</th>
                <th>Cursos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professores.map(professor => (
                <tr key={professor.ID_Prof}>
                  <td>{professor.Nome}</td>
                  <td>{professor.CPF}</td>
                  <td>{professor.Email}</td>
                  <td>{professor.Formacao || '-'}</td>
                  <td>{formatDate(professor.Data_Nascimento)}</td>
                  <td>
                    <span className="badge badge-info">
                      {professor.Cursos_Ministrados || 0} curso(s)
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleEdit(professor)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(professor.ID_Prof)}
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

        {professores.length === 0 && (
          <div className="text-center" style={{ padding: '2rem', color: '#666' }}>
            <p>Nenhum professor cadastrado ainda.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              ➕ Cadastrar Primeiro Professor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Professores;
