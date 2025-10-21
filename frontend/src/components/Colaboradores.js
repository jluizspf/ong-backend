import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState(null);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    Nome: '',
    CPF: '',
    Email: '',
    Data_Admissao: '',
    Telefone: '',
    Endereco: ''
  });

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const fetchColaboradores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('${process.env.REACT_APP_API_URL}/api/colaboradores');
      setColaboradores(response.data.data || []);
    } catch (err) {
      setError('Erro ao carregar colaboradores');
      console.error('Erro ao buscar colaboradores:', err);
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
      if (editingColaborador) {
        await axios.put(`${apiUrl}/api/colaboradores/${editingColaborador.ID_Colab}`, formData);
      } else {
        await axios.post('${apiUrl}/api/colaboradores', formData);
      }
      
      setShowForm(false);
      setEditingColaborador(null);
      setFormData({
        Nome: '',
        CPF: '',
        Email: '',
        Data_Admissao: '',
        Telefone: '',
        Endereco: ''
      });
      fetchColaboradores();
    } catch (err) {
      setError('Erro ao salvar colaborador');
      console.error('Erro ao salvar colaborador:', err);
    }
  };

  const handleEdit = (colaborador) => {
    setEditingColaborador(colaborador);
    setFormData({
      Nome: colaborador.Nome || '',
      CPF: colaborador.CPF || '',
      Email: colaborador.Email || '',
      Data_Admissao: colaborador.Data_Admissao || '',
      Telefone: colaborador.Telefone || '',
      Endereco: colaborador.Endereco || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este colaborador?')) {
      try {
        await axios.delete(`${apiUrl}/api/colaboradores/${id}`);
        fetchColaboradores();
      } catch (err) {
        setError('Erro ao deletar colaborador');
        console.error('Erro ao deletar colaborador:', err);
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
        <h2>Carregando colaboradores...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">👥 Gerenciar Colaboradores</h2>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowForm(true);
                setEditingColaborador(null);
                setFormData({
                  Nome: '',
                  CPF: '',
                  Email: '',
                  Data_Admissao: '',
                  Telefone: '',
                  Endereco: ''
                });
              }}
            >
              ➕ Novo Colaborador
            </button>
            <button className="btn btn-secondary" onClick={fetchColaboradores}>
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
            <h3>{editingColaborador ? '✏️ Editar Colaborador' : '➕ Novo Colaborador'}</h3>
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
                  <label className="form-label">Data de Admissão *</label>
                  <input
                    type="date"
                    name="Data_Admissao"
                    value={formData.Data_Admissao}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input
                    type="text"
                    name="Telefone"
                    value={formData.Telefone}
                    onChange={handleInputChange}
                    className="form-input"
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
                  {editingColaborador ? '💾 Atualizar' : '➕ Criar'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingColaborador(null);
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
                <th>Data Admissão</th>
                <th>Telefone</th>
                <th>Cursos Verificados</th>
                <th>Professores Inscritos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.map(colaborador => (
                <tr key={colaborador.ID_Colab}>
                  <td>{colaborador.Nome}</td>
                  <td>{colaborador.CPF}</td>
                  <td>{colaborador.Email}</td>
                  <td>{formatDate(colaborador.Data_Admissao)}</td>
                  <td>{colaborador.Telefone || '-'}</td>
                  <td>
                    <span className="badge badge-info">
                      {colaborador.Cursos_Verificados || 0} curso(s)
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {colaborador.Professores_Inscritos || 0} professor(es)
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleEdit(colaborador)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(colaborador.ID_Colab)}
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

        {colaboradores.length === 0 && (
          <div className="text-center" style={{ padding: '2rem', color: '#666' }}>
            <p>Nenhum colaborador cadastrado ainda.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              ➕ Cadastrar Primeiro Colaborador
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Colaboradores;
