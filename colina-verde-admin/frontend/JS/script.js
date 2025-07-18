function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const hash = btoa(pass); // Simples simulação de hash (não seguro para produção)

    if (user === "admin" && hash === btoa("admin123")) {
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
            <label>Preço por Kg:</label>
            <input type="number" placeholder="R$">
            <label>Imagem (URL):</label>
            <input type="text">
            <button>Atualizar Buffet</button>
        `;
    } else if (tab === "porcoes") {
        content = `
            <h2>Porções</h2>
            <input type="text" placeholder="Nome da porção">
            <textarea placeholder="Descrição"></textarea>
            <input type="number" placeholder="Preço inteira">
            <input type="number" placeholder="Preço meia">
            <input type="text" placeholder="URL da imagem">
            <button>Adicionar/Atualizar Porção</button>
            <button>Deletar Porção</button>
        `;
    } else if (tab === "drinks") {
        content = `
            <h2>Drinks</h2>
            <input type="text" placeholder="Nome do drink">
            <textarea placeholder="Descrição"></textarea>
            <input type="number" placeholder="Preço">
            <input type="text" placeholder="Tamanho">
            <input type="text" placeholder="URL da imagem">
            <button>Adicionar/Atualizar Drink</button>
            <button>Deletar Drink</button>
        `;
    }

    document.getElementById("tabContent").innerHTML = content;
}
