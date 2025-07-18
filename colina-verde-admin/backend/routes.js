const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const multer = require('multer');
const path = require('path');
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
router.put('/porcoes/nome/:nome', upload.single('media'), async (req, res) => {
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
router.delete('/porcoes/nome/:nome', async (req, res) => {
  const nome = req.params.nome;
  const result = await pool.query("DELETE FROM porcoes WHERE nome_porcao = $1", [nome]);
  if (result.rowCount > 0) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ success: false, message: 'Porção não encontrada.' });
  }
});

// Atualiza drink pelo nome
router.put('/drinks/nome/:nome', upload.single('media'), async (req, res) => {
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
router.delete('/drinks/nome/:nome', async (req, res) => {
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

router.get('/buffet', async (req, res) => {
  const result = await pool.query("SELECT * FROM buffet");
  res.json(result.rows);
});

// Cria buffet com preço, descrição e imagem/video
router.post('/buffet', upload.single('media'), async (req, res) => {
  const { preco_por_kg, descricao } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query("INSERT INTO buffet (preco_por_kg, descricao, url_imagem) VALUES ($1, $2, $3)", [preco_por_kg, descricao, url_media]);
  res.sendStatus(201);
});

// Atualiza buffet com upload de imagem/video
router.put('/buffet/:id', upload.single('media'), async (req, res) => {
  const { preco_por_kg } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : req.body.url_imagem;
  await pool.query("UPDATE buffet SET preco_por_kg = $1, url_imagem = $2 WHERE id_buffet = $3", [preco_por_kg, url_media, req.params.id]);
  res.sendStatus(200);
});

router.get('/porcoes', async (req, res) => {
  const result = await pool.query("SELECT * FROM porcoes");
  res.json(result.rows);
});

// Adiciona porção com upload de imagem/video
router.post('/porcoes', upload.single('media'), async (req, res) => {
  let { nome_porcao, descricao, preco_inteira, preco_meia } = req.body;
  preco_inteira = preco_inteira === '' || preco_inteira === undefined ? null : preco_inteira;
  preco_meia = preco_meia === '' || preco_meia === undefined ? null : preco_meia;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query("INSERT INTO porcoes (nome_porcao, descricao, preco_inteira, preco_meia, url_imagem) VALUES ($1, $2, $3, $4, $5)", [nome_porcao, descricao, preco_inteira, preco_meia, url_media]);
  res.sendStatus(201);
});

router.put('/porcoes/:id', async (req, res) => {
  const { nome_porcao, descricao, preco_inteira, preco_meia, url_imagem } = req.body;
  await pool.query("UPDATE porcoes SET nome_porcao=$1, descricao=$2, preco_inteira=$3, preco_meia=$4, url_imagem=$5 WHERE id_porcao = $6", [nome_porcao, descricao, preco_inteira, preco_meia, url_imagem, req.params.id]);
  res.sendStatus(200);
});

router.delete('/porcoes/:id', async (req, res) => {
  await pool.query("DELETE FROM porcoes WHERE id_porcao = $1", [req.params.id]);
  res.sendStatus(204);
});

router.get('/drinks', async (req, res) => {
  const result = await pool.query("SELECT * FROM drinks");
  res.json(result.rows);
});

// Adiciona drink com upload de imagem/video
router.post('/drinks', upload.single('media'), async (req, res) => {
  const { nome_drink, descricao, preco, tamanho } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query("INSERT INTO drinks (nome_drink, descricao, preco, tamanho, url_imagem) VALUES ($1, $2, $3, $4, $5)", [nome_drink, descricao, preco, tamanho, url_media]);
  res.sendStatus(201);
});

router.put('/drinks/:id', async (req, res) => {
  const { nome_drink, descricao, preco, tamanho, url_imagem } = req.body;
  await pool.query("UPDATE drinks SET nome_drink=$1, descricao=$2, preco=$3, tamanho=$4, url_imagem=$5 WHERE id_drink = $6", [nome_drink, descricao, preco, tamanho, url_imagem, req.params.id]);
  res.sendStatus(200);
});

router.delete('/drinks/:id', async (req, res) => {
  await pool.query("DELETE FROM drinks WHERE id_drink = $1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;