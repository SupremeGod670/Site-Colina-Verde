const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("./db");
const multer = require("multer");
const path = require("path");

// Configuração do multer para salvar arquivos em /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});
const upload = multer({ storage });
const router = express.Router();

// Middleware de autenticação
function checkAuth(req, res, next) {
  if (req.session.user) return next();
  return res.status(401).json({ success: false, message: "Não autorizado" });
}

// LOGIN
router.post("/login", async (req, res) => {
  const { username, senha } = req.body;
  const user = await pool.query(
    "SELECT * FROM administradores WHERE nome_usuario = $1",
    [username]
  );
  if (user.rows.length > 0) {
    const valid = await bcrypt.compare(senha, user.rows[0].senha_hash);
    if (valid) {
      req.session.user = {
        id: user.rows[0].id_admin,
        username: user.rows[0].nome_usuario,
      };
      return res.json({ success: true });
    }
  }
  return res.status(401).json({ success: false });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// PUT: Atualizar buffet pela data
router.put(
  "/buffet/data/:data_buffet",
  upload.array("media"),
  async (req, res) => {
    const { preco_por_kg, descricao, horario_buffet } = req.body;
    const data_buffet = req.params.data_buffet;

    const result = await pool.query(
      "UPDATE buffet SET preco_por_kg = $1, descricao = $2, horario_buffet = $3 WHERE data_buffet = $4",
      [preco_por_kg, descricao, horario_buffet, data_buffet]
    );

    if (result.rowCount > 0) {
      res.sendStatus(200);
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: "Buffet não encontrado para esta data.",
        });
    }
  }
);

// DELETE: Deletar buffet pela data
router.delete("/buffet/data/:data_buffet", async (req, res) => {
  const data_buffet = req.params.data_buffet;

  const result = await pool.query("DELETE FROM buffet WHERE data_buffet = $1", [
    data_buffet,
  ]);

  if (result.rowCount > 0) {
    res.sendStatus(204);
  } else {
    res
      .status(404)
      .json({
        success: false,
        message: "Buffet não encontrado para esta data.",
      });
  }
});

// Atualiza porção pelo nome
router.put("/porcoes/nome/:nome", upload.single("media"), async (req, res) => {
  const { descricao, preco_inteira, preco_meia } = req.body;
  let url_media = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.url_imagem;
  const nome = req.params.nome;
  const result = await pool.query(
    "UPDATE porcoes SET descricao=$1, preco_inteira=$2, preco_meia=$3, url_imagem=$4 WHERE nome_porcao=$5",
    [descricao, preco_inteira, preco_meia, url_media, nome]
  );
  if (result.rowCount > 0) {
    res.sendStatus(200);
  } else {
    res.status(404).json({ success: false, message: "Porção não encontrada." });
  }
});

// Deleta porção pelo nome
router.delete("/porcoes/nome/:nome", async (req, res) => {
  const nome = req.params.nome;
  const result = await pool.query(
    "DELETE FROM porcoes WHERE nome_porcao = $1",
    [nome]
  );
  if (result.rowCount > 0) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ success: false, message: "Porção não encontrada." });
  }
});

// Atualiza drink pelo nome
router.put("/drinks/nome/:nome", upload.single("media"), async (req, res) => {
  const { descricao, preco, tamanho } = req.body;
  let url_media = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.url_imagem;
  const nome = req.params.nome;
  const result = await pool.query(
    "UPDATE drinks SET descricao=$1, preco=$2, tamanho=$3, url_imagem=$4 WHERE nome_drink=$5",
    [descricao, preco, tamanho, url_media, nome]
  );
  if (result.rowCount > 0) {
    res.sendStatus(200);
  } else {
    res.status(404).json({ success: false, message: "Drink não encontrado." });
  }
});

// Deleta drink pelo nome
router.delete("/drinks/nome/:nome", async (req, res) => {
  const nome = req.params.nome;
  const result = await pool.query("DELETE FROM drinks WHERE nome_drink = $1", [
    nome,
  ]);
  if (result.rowCount > 0) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ success: false, message: "Drink não encontrado." });
  }
});

// Cadastro de administrador
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({ success: false, message: "Preencha todos os campos." });
    }
    // Verifica se já existe usuário ou email
    const exists = await pool.query(
      "SELECT * FROM administradores WHERE nome_usuario = $1 OR email = $2",
      [username, email]
    );
    if (exists.rows.length > 0) {
      return res.json({
        success: false,
        message: "Usuário ou email já cadastrado.",
      });
    }
    // Gera hash da senha
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO administradores (nome_usuario, email, senha_hash) VALUES ($1, $2, $3)",
      [username, email, hash]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao cadastrar administrador:", err);
    res.json({ success: false, message: "Erro ao cadastrar: " + err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, senha } = req.body;
  const user = await pool.query(
    "SELECT * FROM administradores WHERE nome_usuario = $1",
    [username]
  );
  if (user.rows.length > 0) {
    const valid = await bcrypt.compare(senha, user.rows[0].senha_hash);
    return valid
      ? res.json({ success: true })
      : res.status(401).json({ success: false });
  }
  return res.status(401).json({ success: false });
});

router.get("/buffet", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM buffet ORDER BY data_buffet DESC"
  );
  const buffets = result.rows;

  // Busca imagens para cada buffet
  for (const buffet of buffets) {
    const imgRes = await pool.query(
      "SELECT url_imagem FROM BuffetImagens WHERE id_buffet = $1",
      [buffet.id_buffet]
    );
    buffet.url_imagem = imgRes.rows.map((r) => r.url_imagem);
  }

  res.json(buffets);
});

// Função auxiliar para validar o formato do horário
function validateHorarioFormat(horario_buffet) {
  // Regex para HH-HH (ex: 11-14, 18-23)
  const rangeRegex = /^(\d{2})-(\d{2})$/;
  // Regex para HH:MM (ex: 19:30)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  const rangeMatch = horario_buffet.match(rangeRegex);
  const timeMatch = horario_buffet.match(timeRegex);

  if (rangeMatch) {
    const startHour = parseInt(rangeMatch[1], 10);
    const endHour = parseInt(rangeMatch[2], 10);
    // Basic validation for hours
    if (
      startHour >= 0 &&
      startHour <= 23 &&
      endHour >= 0 &&
      endHour <= 23 &&
      startHour < endHour
    ) {
      return true; // Formato HH-HH válido
    }
  } else if (timeMatch) {
    return true; // Formato HH:MM válido
  }
  return false; // Formato inválido
}

// Cria buffet com preço, descrição e imagem/video
router.post("/buffet", upload.array("media"), async (req, res) => {
  const { preco_por_kg, descricao, data_buffet, horario_buffet } = req.body;

  if (!data_buffet || !/^\d{4}-\d{2}-\d{2}$/.test(data_buffet)) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Data do buffet inválida ou não informada.",
      });
  }

  const d = new Date(data_buffet + "T00:00:00");
  const day = d.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  if (day === 1 || day === 2) {
    // Segunda ou Terça
    return res
      .status(400)
      .json({
        success: false,
        message: "Buffet não pode ser marcado para segunda ou terça-feira.",
      });
  }

  if (!horario_buffet) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Horário do buffet é obrigatório para este dia.",
      });
  }

  // Valida o formato do horário
  if (!validateHorarioFormat(horario_buffet)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Formato de horário inválido. Use HH-HH (ex: 11-14) ou HH:MM (ex: 19:30).",
      });
  }

  // Verifica duplicidade de data e horário (agora comparando a string exata)
  const { rows: existingBuffets } = await pool.query(
    "SELECT COUNT(*) FROM buffet WHERE data_buffet = $1 AND horario_buffet = $2",
    [data_buffet, horario_buffet] // Compara a string exata do horário
  );
  const count = parseInt(existingBuffets[0].count, 10);

  if (count > 0) {
    return res
      .status(400)
      .json({
        success: false,
        message: `Já existe buffet para esta data (${data_buffet}) e horário (${horario_buffet})!`,
      });
  }

  // Insere buffet
  const result = await pool.query(
    `INSERT INTO buffet (preco_por_kg, descricao, data_buffet, horario_buffet)
         VALUES ($1, $2, $3, $4) RETURNING *`,
    [preco_por_kg, descricao, data_buffet, horario_buffet] // Salva a string de horário como está
  );
  const buffet = result.rows[0];

  // Insere imagens
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      await pool.query(
        "INSERT INTO BuffetImagens (id_buffet, url_imagem) VALUES ($1, $2)",
        [buffet.id_buffet, `/uploads/${file.filename}`]
      );
    }
  }

  res.json(buffet);
});

// Atualiza buffet com upload de imagem/video
router.put("/buffet/:id", upload.array("media"), async (req, res) => {
  const { preco_por_kg, descricao, data_buffet, horario_buffet } = req.body;
  const buffetId = req.params.id;

  if (!data_buffet || !/^\d{4}-\d{2}-\d{2}$/.test(data_buffet)) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Data do buffet inválida ou não informada.",
      });
  }

  const d = new Date(data_buffet + "T00:00:00");
  const day = d.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  if (day === 1 || day === 2) {
    // Segunda ou Terça
    return res
      .status(400)
      .json({
        success: false,
        message: "Buffet não pode ser marcado para segunda ou terça-feira.",
      });
  }

  if (!horario_buffet) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Horário do buffet é obrigatório para este dia.",
      });
  }

  // Valida o formato do horário
  if (!validateHorarioFormat(horario_buffet)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Formato de horário inválido. Use HH-HH (ex: 11-14) ou HH:MM (ex: 19:30).",
      });
  }

  // Verifica duplicidade para atualização (exclui o próprio buffet que está sendo atualizado)
  const { rows: existingBuffets } = await pool.query(
    "SELECT COUNT(*) FROM buffet WHERE data_buffet = $1 AND horario_buffet = $2 AND id_buffet != $3",
    [data_buffet, horario_buffet, buffetId] // Compara a string exata do horário
  );
  const count = parseInt(existingBuffets[0].count, 10);

  if (count > 0) {
    return res
      .status(400)
      .json({
        success: false,
        message: `Já existe outro buffet para esta data (${data_buffet}) e horário (${horario_buffet})!`,
      });
  }

  await pool.query(
    "UPDATE buffet SET preco_por_kg = $1, descricao = $2, data_buffet = $3, horario_buffet = $4 WHERE id_buffet = $5",
    [preco_por_kg, descricao, data_buffet, horario_buffet, buffetId] // Salva a string de horário como está
  );

  // Remove imagens antigas e insere novas se houver upload
  if (req.files && req.files.length > 0) {
    await pool.query("DELETE FROM BuffetImagens WHERE id_buffet = $1", [
      buffetId,
    ]);
    for (const file of req.files) {
      await pool.query(
        "INSERT INTO BuffetImagens (id_buffet, url_imagem) VALUES ($1, $2)",
        [buffetId, `/uploads/${file.filename}`]
      );
    }
  }

  res.sendStatus(200);
});

router.get("/porcoes", async (req, res) => {
  const result = await pool.query("SELECT * FROM porcoes");
  res.json(result.rows);
});

// Adiciona porção com upload de imagem/video
router.post("/porcoes", upload.single("media"), async (req, res) => {
  let { nome_porcao, descricao, preco_inteira, preco_meia } = req.body;
  preco_inteira =
    preco_inteira === "" || preco_inteira === undefined ? null : preco_inteira;
  preco_meia =
    preco_meia === "" || preco_meia === undefined ? null : preco_meia;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query(
    "INSERT INTO porcoes (nome_porcao, descricao, preco_inteira, preco_meia, url_imagem) VALUES ($1, $2, $3, $4, $5)",
    [nome_porcao, descricao, preco_inteira, preco_meia, url_media]
  );
  res.sendStatus(201);
});

router.put("/porcoes/:id", async (req, res) => {
  const { nome_porcao, descricao, preco_inteira, preco_meia, url_imagem } =
    req.body;
  await pool.query(
    "UPDATE porcoes SET nome_porcao=$1, descricao=$2, preco_inteira=$3, preco_meia=$4, url_imagem=$5 WHERE id_porcao = $6",
    [
      nome_porcao,
      descricao,
      preco_inteira,
      preco_meia,
      url_imagem,
      req.params.id,
    ]
  );
  res.sendStatus(200);
});

router.delete("/porcoes/:id", async (req, res) => {
  await pool.query("DELETE FROM porcoes WHERE id_porcao = $1", [req.params.id]);
  res.sendStatus(204);
});

router.get("/drinks", async (req, res) => {
  const result = await pool.query("SELECT * FROM drinks");
  res.json(result.rows);
});

// Adiciona drink com upload de imagem/video
router.post("/drinks", upload.single("media"), async (req, res) => {
  const { nome_drink, descricao, preco, tamanho } = req.body;
  let url_media = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query(
    "INSERT INTO drinks (nome_drink, descricao, preco, tamanho, url_imagem) VALUES ($1, $2, $3, $4, $5)",
    [nome_drink, descricao, preco, tamanho, url_media]
  );
  res.sendStatus(201);
});

router.put("/drinks/:id", async (req, res) => {
  const { nome_drink, descricao, preco, tamanho, url_imagem } = req.body;
  await pool.query(
    "UPDATE drinks SET nome_drink=$1, descricao=$2, preco=$3, tamanho=$4, url_imagem=$5 WHERE id_drink = $6",
    [nome_drink, descricao, preco, tamanho, url_imagem, req.params.id]
  );
  res.sendStatus(200);
});

router.delete("/drinks/:id", async (req, res) => {
  await pool.query("DELETE FROM drinks WHERE id_drink = $1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
