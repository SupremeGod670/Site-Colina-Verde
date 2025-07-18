const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));