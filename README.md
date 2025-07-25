
# 🌿 Colina Verde - Site Oficial

Este é o repositório do site oficial da **Colina Verde**, um espaço gastronômico que oferece buffet, porções, drinks e um ambiente aconchegante para todos os momentos. O site apresenta o cardápio, imagens do local, informações de contato e um sistema administrativo para gerenciamento interno.

---

## 📌 Funcionalidades

- Página inicial com destaques do local e carrossel de imagens
- Cardápio com abas separadas por categorias (Buffet, Porções, Drinks)
- Sistema de autenticação e painel administrativo
- Upload de imagens e cadastro de novos itens no cardápio
- Backend com Node.js e Express
- Integração com banco de dados via módulo `db.js`

---

## 🖥️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Gerenciador de Pacotes**: npm
- **Outros**: dotenv, multer (para uploads), estrutura modular

---

## 🛠️ Estrutura do Projeto

```
/SITE-COLINA-VERDE/
├── backend/
│   ├── uploads/            # Upload de arquivos (ex: imagens)
│   ├── db.js               # Conexão com o banco de dados
│   ├── routes.js           # Rotas da aplicação
│   └── server.js           # Servidor Express
├── frontend/
│   ├── CSS/
│   │   └── style.css
│   ├── JS/
│   │   └── script.js
│   └── Layout/
│       ├── index.html
│       └── register.html
├── CSS/
│   ├── cardapio.css
│   ├── index.css
│   └── style.css
├── JS/
│   ├── cardapio.js
│   └── index.js
├── Layout/
│   └── cardapio.html
├── Img/                    # Imagens usadas no site
├── .env                    # Variáveis de ambiente
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Como Rodar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Gabriel-GDS-dev/Site-Colina-Verde.git
   cd SITE-COLINA-VERDE
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com as variáveis necessárias (ex: porta, string de conexão do banco etc.).

4. Inicie o servidor:
   ```bash
   node backend/server.js
   ```

5. Acesse no navegador:  
   `http://localhost:PORT` (substitua `PORT` pela porta definida no `.env`)

---

## 🔒 Acesso Administrativo

- Acesse via página de login (`/frontend/Layout/login.html`)
- Cadastro e login protegidos (sugestão: criptografia, autenticação JWT)

---

## 📷 Referência Visual

Design baseado no Instagram oficial:  
[instagram.com/colinaverde_](https://www.instagram.com/colinaverde_/)

---

## 📄 Licença

Este projeto é de uso interno do estabelecimento **Colina Verde**. Todos os direitos reservados.

---

## 👨‍💻 Desenvolvido por

Gabriel Goulart de Souza  
[GitHub](https://github.com/Gabriel-GDS-dev)
