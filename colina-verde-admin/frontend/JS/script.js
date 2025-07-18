async function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, senha: pass })
    });
    const data = await res.json();
    if (data.success) {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("adminContainer").style.display = "block";
        showTab('buffet');
    } else {
        document.getElementById("loginMessage").innerText = "Usuário ou senha incorretos.";
    }
}

function showTab(tab) {
    let content = "";

    if (tab === "buffet") {
        content = `
            <h2>Buffet</h2>
            <form id="buffetForm" enctype="multipart/form-data">
                <label>Preço por Kg:</label>
                <input type="number" name="preco_por_kg" placeholder="R$">
                <label>Imagem/Video:</label>
                <input type="file" name="media" accept="image/*,video/*">
                <button type="submit">Atualizar Buffet</button>
            </form>
            <p id="buffetMsg"></p>
        `;
    } else if (tab === "porcoes") {
        content = `
            <h2>Porções</h2>
            <form id="porcaoForm" enctype="multipart/form-data">
                <input type="text" name="nome_porcao" placeholder="Nome da porção">
                <textarea name="descricao" placeholder="Descrição"></textarea>
                <input type="number" name="preco_inteira" placeholder="Preço inteira" min="0">
                <input type="number" name="preco_meia" placeholder="Preço meia" min="0">
                <label>Imagem/Video:</label>
                <input type="file" name="media" accept="image/*,video/*">
                <button type="submit">Adicionar/Atualizar Porção</button>
                <button type="button">Deletar Porção</button>
                <small style="color:#888;">Preços inteira e meia são opcionais.</small>
            </form>
            <p id="porcaoMsg"></p>
        `;
    } else if (tab === "drinks") {
        content = `
            <h2>Drinks</h2>
            <form id="drinkForm" enctype="multipart/form-data">
                <input type="text" name="nome_drink" placeholder="Nome do drink">
                <textarea name="descricao" placeholder="Descrição"></textarea>
                <input type="number" name="preco" placeholder="Preço">
                <input type="text" name="tamanho" placeholder="Tamanho">
                <label>Imagem/Video:</label>
                <input type="file" name="media" accept="image/*,video/*">
                <button type="submit">Adicionar/Atualizar Drink</button>
                <button type="button">Deletar Drink</button>
            </form>
            <p id="drinkMsg"></p>
        `;
    }

    document.getElementById("tabContent").innerHTML = content;

    // Adiciona listeners para envio dos formulários
    if (tab === "buffet") {
        document.getElementById("buffetForm").onsubmit = async function(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const res = await fetch('http://localhost:3000/api/buffet/1', {
                method: 'PUT',
                body: formData
            });
            document.getElementById("buffetMsg").innerText = res.ok ? "Buffet atualizado!" : "Erro ao atualizar.";
        };
    }
    if (tab === "porcoes") {
        document.getElementById("porcaoForm").onsubmit = async function(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const res = await fetch('http://localhost:3000/api/porcoes', {
                method: 'POST',
                body: formData
            });
            document.getElementById("porcaoMsg").innerText = res.ok ? "Porção adicionada!" : "Erro ao adicionar.";
        };
    }
    if (tab === "drinks") {
        document.getElementById("drinkForm").onsubmit = async function(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const res = await fetch('http://localhost:3000/api/drinks', {
                method: 'POST',
                body: formData
            });
            document.getElementById("drinkMsg").innerText = res.ok ? "Drink adicionado!" : "Erro ao adicionar.";
        };
    }
}
