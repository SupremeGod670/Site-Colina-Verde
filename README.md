
# 🌿 Colina Verde - Site Oficial

Este é o repositório do site oficial da **Colina Verde**, um espaço gastronômico que oferece buffet, porções, drinks e um ambiente aconchegante para todos os momentos. O site apresenta o cardápio, imagens do local, informações de contato e administração interna para gerenciamento do conteúdo.

---

## 📌 Funcionalidades

- Página inicial com destaques do local e carrossel de imagens
- Cardápio dividido em abas: Buffet, Porções e Drinks
- Sistema administrativo com login seguro
- Painel de gerenciamento para editar itens do cardápio
- Integração com banco de dados PostgreSQL

---

## 🖥️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python (Flask ou FastAPI)
- **Banco de Dados**: PostgreSQL
- **Design**: Figma (protótipo baseado no Instagram oficial)
- **Outros**: Bootstrap, Swiper.js (para carrossel), bcrypt (hash de senhas)

---

## 🛠️ Estrutura do Projeto

```
/colina-verde/
├── index.html              # Página inicial
├── menu.html               # Cardápio com abas
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   └── scripts.js
├── static/
│   ├── css/
│   └── js/
├── backend/
│   ├── app.py              # API principal
│   └── database.py
├── sql/
│   └── schema.sql          # Script de criação do banco PostgreSQL
└── README.md
```

---

## 🚀 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/colina-verde.git
   cd colina-verde
   ```

2. Instale as dependências (exemplo para Flask):
   ```bash
   pip install -r requirements.txt
   ```

3. Configure o banco de dados PostgreSQL e execute o script `schema.sql`.

4. Inicie o servidor:
   ```bash
   python backend/app.py
   ```

5. Acesse em `http://localhost:5000`

---

## 🔒 Acesso Administrativo

- Para acessar o painel administrativo:
  - URL: `/admin/login.html`
  - É necessário cadastro prévio no banco de dados.

---

## 📷 Referência Visual

Baseado nas cores, fotos e estilo do Instagram oficial:  
[instagram.com/colinaverde_](https://www.instagram.com/colinaverde_/)

---

## 📄 Licença

Este projeto é de uso interno do estabelecimento **Colina Verde**. Todos os direitos reservados.

---

## 👨‍💻 Desenvolvido por

Gabriel Goulart de Souza  
[GitHub](https://github.com/Gabriel-GDS-dev)
