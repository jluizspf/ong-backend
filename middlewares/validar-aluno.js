// middlewares/validar-aluno.js
module.exports = function validarAluno(req, res, next) {
  const { Nome, CPF } = req.body || {};

  // Verifica presença básica
  if (!Nome || !CPF) {
    return res.status(400).json({
      success: false,
      message: 'Campos obrigatórios ausentes: nome e cpf'
    });
  }

  // Normaliza CPF: remove tudo que não é dígito
  const cpfDigits = String(CPF).replace(/\D/g, '');

  // Verifica comprimento (11 dígitos)
  if (cpfDigits.length !== 11) {
    return res.status(400).json({
      success: false,
      message: 'CPF inválido. Informe 11 dígitos numéricos.'
    });
  }

  // Substitui no body pelo formato normalizado
  req.body.CPF = cpfDigits;
  next();
};
