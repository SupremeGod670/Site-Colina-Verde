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
                <button type="button" id="criarBuffet">Criar Buffet</button>
                <button type="button" id="atualizarBuffet">Atualizar Buffet</button>
                <button type="button" id="deletarBuffet">Deletar Buffet</button>
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
                <button type="button" id="criarPorcao">Criar Porção</button>
                <button type="button" id="atualizarPorcao">Atualizar Porção</button>
                <button type="button" id="deletarPorcao">Deletar Porção</button>
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
                <button type="button" id="criarDrink">Criar Drink</button>
                <button type="button" id="atualizarDrink">Atualizar Drink</button>
                <button type="button" id="deletarDrink">Deletar Drink</button>
            </form>
            <p id="drinkMsg"></p>
        `;
    }

    document.getElementById("tabContent").innerHTML = content;

    // Adiciona listeners para os botões de ação
    if (tab === "buffet") {
        document.getElementById("criarBuffet").onclick = async function() {
            const form = document.getElementById("buffetForm");
            const formData = new FormData(form);
            const res = await fetch('http://localhost:3000/api/buffet', {
                method: 'POST',
                body: formData
            });
            document.getElementById("buffetMsg").innerText = res.ok ? "Buffet criado!" : "Erro ao criar.";
        };
        document.getElementById("atualizarBuffet").onclick = async function() {
            const form = document.getElementById("buffetForm");
            const formData = new FormData(form);
            // ID fixo 1, ajuste conforme necessário
            const res = await fetch('http://localhost:3000/api/buffet/1', {
                method: 'PUT',
                body: formData
            });
            document.getElementById("buffetMsg").innerText = res.ok ? "Buffet atualizado!" : "Erro ao atualizar.";
        };
        document.getElementById("deletarBuffet").onclick = async function() {
            // ID fixo 1, ajuste conforme necessário
            const res = await fetch('http://localhost:3000/api/buffet/1', {
                method: 'DELETE'
            });
            document.getElementById("buffetMsg").innerText = res.ok ? "Buffet deletado!" : "Erro ao deletar.";
        };
    }
    if (tab === "porcoes") {
        document.getElementById("criarPorcao").onclick = async function() {
            const form = document.getElementById("porcaoForm");
            const formData = new FormData(form);
            const res = await fetch('http://localhost:3000/api/porcoes', {
                method: 'POST',
                body: formData
            });
            document.getElementById("porcaoMsg").innerText = res.ok ? "Porção criada!" : "Erro ao criar.";
        };
        document.getElementById("atualizarPorcao").onclick = async function() {
            const nome = prompt("Nome da porção para atualizar:");
            if (!nome) return;
            const form = document.getElementById("porcaoForm");
            const formData = new FormData(form);
            const res = await fetch(`http://localhost:3000/api/porcoes/nome/${encodeURIComponent(nome)}`, {
                method: 'PUT',
                body: formData
            });
            document.getElementById("porcaoMsg").innerText = res.ok ? "Porção atualizada!" : "Erro ao atualizar.";
        };
        document.getElementById("deletarPorcao").onclick = async function() {
            const nome = prompt("Nome da porção para deletar:");
            if (!nome) return;
            const res = await fetch(`http://localhost:3000/api/porcoes/nome/${encodeURIComponent(nome)}`, {
                method: 'DELETE'
            });
            document.getElementById("porcaoMsg").innerText = res.ok ? "Porção deletada!" : "Erro ao deletar.";
        };
    }
    if (tab === "drinks") {
        document.getElementById("criarDrink").onclick = async function() {
            const form = document.getElementById("drinkForm");
            const formData = new FormData(form);
            const res = await fetch('http://localhost:3000/api/drinks', {
                method: 'POST',
                body: formData
            });
            document.getElementById("drinkMsg").innerText = res.ok ? "Drink criado!" : "Erro ao criar.";
        };
        document.getElementById("atualizarDrink").onclick = async function() {
            const nome = prompt("Nome do drink para atualizar:");
            if (!nome) return;
            const form = document.getElementById("drinkForm");
            const formData = new FormData(form);
            const res = await fetch(`http://localhost:3000/api/drinks/nome/${encodeURIComponent(nome)}`, {
                method: 'PUT',
                body: formData
            });
            document.getElementById("drinkMsg").innerText = res.ok ? "Drink atualizado!" : "Erro ao atualizar.";
        };
        document.getElementById("deletarDrink").onclick = async function() {
            const nome = prompt("Nome do drink para deletar:");
            if (!nome) return;
            const res = await fetch(`http://localhost:3000/api/drinks/nome/${encodeURIComponent(nome)}`, {
                method: 'DELETE'
            });
            document.getElementById("drinkMsg").innerText = res.ok ? "Drink deletado!" : "Erro ao deletar.";
        };
    }
}
