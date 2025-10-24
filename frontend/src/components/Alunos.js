import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAluno, setEditingAluno] = useState(null);

<<<<<<< HEAD
  const apiUrl = "https://cidemoradia.duckdns.org";
=======
  const apiUrl = "http://34.171.166.185:3000";
>>>>>>> 05609e25537869a9dd8209d85c877337eaeb0696
  const [formData, setFormData] = useState({
    Nome: '',
    CPF: '',
    Data_Nascimento: '',
    Email: '',
    Telefone: '',
    Endereco: '',
    Renda_Familiar: '',
    Conheceu_Como: '',
    Colaborador_Resp: ''
  });

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/alunos`);
      setAlunos(response.data.data || []);
    } catch (err) {
      setError('Erro ao carregar alunos');
      console.error('Erro ao buscar alunos:', err);
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
      if (editingAluno) {
        await axios.put(`${apiUrl}/api/alunos/${editingAluno.ID_Aluno}`, formData);
      } else {
        await axios.post(`${apiUrl}/api/alunos`, formData);
      }
      
      setShowForm(false);
      setEditingAluno(null);
      setFormData({
        Nome: '',
        CPF: '',
        Data_Nascimento: '',
        Email: '',
        Telefone: '',
        Endereco: '',
        Renda_Familiar: '',
        Conheceu_Como: '',
        Colaborador_Resp: ''
      });
      fetchAlunos();
    } catch (err) {
      setError('Erro ao salvar aluno');
      console.error('Erro ao salvar aluno:', err);
    }
  };

  const handleEdit = (aluno) => {
    setEditingAluno(aluno);
    setFormData({
      Nome: aluno.Nome || '',
      CPF: aluno.CPF || '',
      Data_Nascimento: aluno.Data_Nascimento || '',
      Email: aluno.Email || '',
      Telefone: aluno.Telefone || '',
      Endereco: aluno.Endereco || '',
      Renda_Familiar: aluno.Renda_Familiar || '',
      Conheceu_Como: aluno.Conheceu_Como || '',
      Colaborador_Resp: aluno.Colaborador_Resp || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este aluno?')) {
      try {
        await axios.delete(`${apiUrl}/api/alunos/${id}`);
        fetchAlunos();
      } catch (err) {
        setError('Erro ao deletar aluno');
        console.error('Erro ao deletar aluno:', err);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando alunos...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">👨‍🎓 Gerenciar Alunos</h2>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowForm(true);
                setEditingAluno(null);
                setFormData({
                  Nome: '',
                  CPF: '',
                  Data_Nascimento: '',
                  Email: '',
                  Telefone: '',
                  Endereco: '',
                  Renda_Familiar: '',
                  Conheceu_Como: '',
                  Colaborador_Resp: ''
                });
              }}
            >
              ➕ Novo Aluno
            </button>
            <button className="btn btn-secondary" onClick={fetchAlunos}>
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
            <h3>{editingAluno ? '✏️ Editar Aluno' : '➕ Novo Aluno'}</h3>
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
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="form-input"
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

                <div className="form-group">
                  <label className="form-label">Renda Familiar</label>
                  <input
                    type="number"
                    step="0.01"
                    name="Renda_Familiar"
                    value={formData.Renda_Familiar}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Como Conheceu</label>
                  <input
                    type="text"
                    name="Conheceu_Como"
                    value={formData.Conheceu_Como}
                    onChange={handleInputChange}
                    className="form-input"
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
                  {editingAluno ? '💾 Atualizar' : '➕ Criar'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAluno(null);
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
                <th>Telefone</th>
                <th>Renda Familiar</th>
                <th>Verificado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map(aluno => (
                <tr key={aluno.ID_Aluno}>
                  <td>{aluno.Nome}</td>
                  <td>{aluno.CPF}</td>
                  <td>{aluno.Email || '-'}</td>
                  <td>{aluno.Telefone || '-'}</td>
                  <td>{formatCurrency(aluno.Renda_Familiar)}</td>
                  <td>
                    <span className={`badge ${aluno.Verificado ? 'badge-success' : 'badge-warning'}`}>
                      {aluno.Verificado ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleEdit(aluno)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(aluno.ID_Aluno)}
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

        {alunos.length === 0 && (
          <div className="text-center" style={{ padding: '2rem', color: '#666' }}>
            <p>Nenhum aluno cadastrado ainda.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              ➕ Cadastrar Primeiro Aluno
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Alunos;
