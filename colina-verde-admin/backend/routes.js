const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'colina_verde_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token não fornecido.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Token inválido.' });
    req.user = user;
    next();
  });
}

// Configuração do multer para salvar arquivos em /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });
const router = express.Router();

// Atualiza porção pelo nome
router.put('/porcoes/nome/:nome', authenticateToken, upload.single('media'), async (req, res) => {
  const { descricao, preco_inteira, preco_meia } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : req.body.url_imagem;
  const nome = req.params.nome;
  const result = await pool.query("UPDATE porcoes SET descricao=$1, preco_inteira=$2, preco_meia=$3, url_imagem=$4 WHERE nome_porcao=$5", [descricao, preco_inteira, preco_meia, url_media, nome]);
  if (result.rowCount > 0) {
    res.sendStatus(200);
  } else {
    res.status(404).json({ success: false, message: 'Porção não encontrada.' });
  }
});

// Deleta porção pelo nome
router.delete('/porcoes/nome/:nome', authenticateToken, async (req, res) => {
  const nome = req.params.nome;
  const result = await pool.query("DELETE FROM porcoes WHERE nome_porcao = $1", [nome]);
  if (result.rowCount > 0) {
    res.sendStatus(204);
    if (valid) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
      return res.json({ success: true, token });
    }
  } else {
    res.status(404).json({ success: false, message: 'Porção não encontrada.' });
  }
});

// Atualiza drink pelo nome
router.put('/drinks/nome/:nome', authenticateToken, upload.single('media'), async (req, res) => {
  const { descricao, preco, tamanho } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : req.body.url_imagem;
  const nome = req.params.nome;
  const result = await pool.query("UPDATE drinks SET descricao=$1, preco=$2, tamanho=$3, url_imagem=$4 WHERE nome_drink=$5", [descricao, preco, tamanho, url_media, nome]);
  if (result.rowCount > 0) {
    res.sendStatus(200);
  } else {
    res.status(404).json({ success: false, message: 'Drink não encontrado.' });
  }
});

// Deleta drink pelo nome
router.delete('/drinks/nome/:nome', authenticateToken, async (req, res) => {
  const nome = req.params.nome;
  const result = await pool.query("DELETE FROM drinks WHERE nome_drink = $1", [nome]);
  if (result.rowCount > 0) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ success: false, message: 'Drink não encontrado.' });
  }
});

// Cadastro de administrador
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({ success: false, message: 'Preencha todos os campos.' });
    }
    // Verifica se já existe usuário ou email
    const exists = await pool.query("SELECT * FROM administradores WHERE nome_usuario = $1 OR email = $2", [username, email]);
    if (exists.rows.length > 0) {
      return res.json({ success: false, message: 'Usuário ou email já cadastrado.' });
    }
    // Gera hash da senha
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO administradores (nome_usuario, email, senha_hash) VALUES ($1, $2, $3)",
      [username, email, hash]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao cadastrar administrador:', err);
    res.json({ success: false, message: 'Erro ao cadastrar: ' + err.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, senha } = req.body;
  const user = await pool.query("SELECT * FROM administradores WHERE nome_usuario = $1", [username]);
  if (user.rows.length > 0) {
    const valid = await bcrypt.compare(senha, user.rows[0].senha_hash);
    return valid ? res.json({ success: true }) : res.status(401).json({ success: false });
  }
  return res.status(401).json({ success: false });
});

router.get('/buffet', authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM buffet");
  res.json(result.rows);
});

// Cria buffet com preço, descrição e imagem/video
router.post('/buffet', authenticateToken, upload.single('media'), async (req, res) => {
  const { preco_por_kg, descricao } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  let data_buffet = req.body.data_buffet;
  // Garante formato YYYY-MM-DD ou null
  if (!data_buffet || !/^\d{4}-\d{2}-\d{2}$/.test(data_buffet)) {
    return res.status(400).json({ success: false, message: 'Data do buffet inválida ou não informada.' });
  }
      let { horario_buffet } = req.body;
      const d = new Date(data_buffet + "T00:00:00");
      let horarioToSave = null;
      if (d.getDay() === 6) {
        if (!horario_buffet || (horario_buffet !== "11-14" && horario_buffet !== "16-23")) {
          return res.status(400).json({ success: false, message: 'Horário obrigatório para sábado.' });
        }
        horarioToSave = horario_buffet === "11-14" ? "11:00:00" : "16:00:00";
      } else {
        horarioToSave = null;
      }
      // Verifica duplicidade
      let count = 0;
      if (d.getDay() === 6) {
        // Sábado: impede mesmo horário duas vezes, permite dois horários distintos
        const { rows } = await pool.query("SELECT COUNT(*) FROM buffet WHERE data_buffet = $1 AND horario_buffet = $2", [data_buffet, horarioToSave]);
        count = parseInt(rows[0].count, 10);
        if (count > 0) {
          return res.status(400).json({ success: false, message: 'Já existe buffet para este sábado e horário!' });
        }
      } else {
        // Outros dias: impede qualquer duplicidade de data
        const { rows } = await pool.query("SELECT COUNT(*) FROM buffet WHERE data_buffet = $1", [data_buffet]);
        count = parseInt(rows[0].count, 10);
        if (count > 0) {
          return res.status(400).json({ success: false, message: 'Já existe buffet para este dia!' });
        }
      }
      await pool.query("INSERT INTO buffet (preco_por_kg, descricao, url_imagem, data_buffet, horario_buffet) VALUES ($1, $2, $3, $4, $5)", [preco_por_kg, descricao, url_media, data_buffet, horarioToSave]);
  res.sendStatus(201);
});

// Atualiza buffet com upload de imagem/video
router.put('/buffet/:id', authenticateToken, upload.single('media'), async (req, res) => {
  const { preco_por_kg, descricao } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : req.body.url_imagem;
  let data_buffet = req.body.data_buffet;
  if (!data_buffet || !/^\d{4}-\d{2}-\d{2}$/.test(data_buffet)) {
    return res.status(400).json({ success: false, message: 'Data do buffet inválida ou não informada.' });
  }
      let { horario_buffet } = req.body;
      const d = new Date(data_buffet + "T00:00:00");
      if (d.getDay() === 6) {
        if (!horario_buffet || (horario_buffet !== "11-14" && horario_buffet !== "16-23")) {
          return res.status(400).json({ success: false, message: 'Horário obrigatório para sábado.' });
        }
        horario_buffet = horario_buffet === "11-14" ? "11:00:00" : "16:00:00";
      } else {
        horario_buffet = null;
      }
      await pool.query("UPDATE buffet SET preco_por_kg = $1, descricao = $2, url_imagem = $3, data_buffet = $4, horario_buffet = $5 WHERE id_buffet = $6", [preco_por_kg, descricao, url_media, data_buffet, horario_buffet, req.params.id]);
  res.sendStatus(200);
});

router.get('/porcoes', authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM porcoes");
  res.json(result.rows);
});

// Adiciona porção com upload de imagem/video
router.post('/porcoes', authenticateToken, upload.single('media'), async (req, res) => {
  let { nome_porcao, descricao, preco_inteira, preco_meia } = req.body;
  preco_inteira = preco_inteira === '' || preco_inteira === undefined ? null : preco_inteira;
  preco_meia = preco_meia === '' || preco_meia === undefined ? null : preco_meia;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query("INSERT INTO porcoes (nome_porcao, descricao, preco_inteira, preco_meia, url_imagem) VALUES ($1, $2, $3, $4, $5)", [nome_porcao, descricao, preco_inteira, preco_meia, url_media]);
  res.sendStatus(201);
});

router.put('/porcoes/:id', authenticateToken, async (req, res) => {
  const { nome_porcao, descricao, preco_inteira, preco_meia, url_imagem } = req.body;
  await pool.query("UPDATE porcoes SET nome_porcao=$1, descricao=$2, preco_inteira=$3, preco_meia=$4, url_imagem=$5 WHERE id_porcao = $6", [nome_porcao, descricao, preco_inteira, preco_meia, url_imagem, req.params.id]);
  res.sendStatus(200);
});

router.delete('/porcoes/:id', authenticateToken, async (req, res) => {
  await pool.query("DELETE FROM porcoes WHERE id_porcao = $1", [req.params.id]);
  res.sendStatus(204);
});

router.get('/drinks', authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM drinks");
  res.json(result.rows);
});

// Adiciona drink com upload de imagem/video
router.post('/drinks', authenticateToken, upload.single('media'), async (req, res) => {
  const { nome_drink, descricao, preco, tamanho } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query("INSERT INTO drinks (nome_drink, descricao, preco, tamanho, url_imagem) VALUES ($1, $2, $3, $4, $5)", [nome_drink, descricao, preco, tamanho, url_media]);
  res.sendStatus(201);
});

router.put('/drinks/:id', authenticateToken, async (req, res) => {
  const { nome_drink, descricao, preco, tamanho, url_imagem } = req.body;
  await pool.query("UPDATE drinks SET nome_drink=$1, descricao=$2, preco=$3, tamanho=$4, url_imagem=$5 WHERE id_drink = $6", [nome_drink, descricao, preco, tamanho, url_imagem, req.params.id]);
  res.sendStatus(200);
});

router.delete('/drinks/:id', authenticateToken, async (req, res) => {
  await pool.query("DELETE FROM drinks WHERE id_drink = $1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;