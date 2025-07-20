// Função de logout
function logout() {
    localStorage.removeItem('colina_admin_logado');
    document.getElementById("adminContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
}

// Adiciona listener ao botão de logout
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('logoutBtn');
    if (btn) {
        btn.onclick = logout;
    }
});
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
        localStorage.setItem('colina_admin_logado', 'true');
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("adminContainer").style.display = "block";
        showTab('buffet');
    } else {
        localStorage.removeItem('colina_admin_logado');
        document.getElementById("loginMessage").innerText = "Usuário ou senha incorretos.";
    }
// Verifica login ao carregar página
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('colina_admin_logado') === 'true') {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("adminContainer").style.display = "block";
        showTab('buffet');
    } else {
        document.getElementById("loginContainer").style.display = "block";
        document.getElementById("adminContainer").style.display = "none";
    }
});
}

function showTab(tab) {
    let content = "";

    if (tab === "buffet") {
        content = `
            <h2>Buffet</h2>
            <form id="buffetForm" enctype="multipart/form-data" style="margin-top:20px;display:flex;flex-direction:column;gap:0;">
                <label for="data_buffet" style="font-weight:600;margin-bottom:4px;">Data do Buffet:</label>
                <input type="date" name="data_buffet" id="data_buffet" required class="input-date" style="margin-bottom:12px;">
                <!-- O campo de horário será inserido dinamicamente -->
                <label for="preco_por_kg" style="font-weight:600;margin-bottom:4px;">Preço por Kg:</label>
                <input type="number" name="preco_por_kg" id="preco_por_kg" placeholder="R$" step="0.01" min="0" required style="margin-bottom:12px;">
                <label for="descricao" style="font-weight:600;margin-bottom:4px;">Descrição:</label>
                <textarea name="descricao" id="descricao" placeholder="Descrição do buffet" rows="2" style="margin-bottom:12px;"></textarea>
                <label for="media" style="font-weight:600;margin-bottom:4px;">Imagem/Video:</label>
                <input type="file" name="media" id="media" accept="image/*,video/*" style="margin-bottom:12px;">
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
        // Adiciona campo de horário para sábado
        setTimeout(() => {
            const dateInput = document.getElementById("data_buffet");
            if (dateInput && !dateInput._listenerAdded) {
                dateInput.addEventListener("input", function() {
                    const val = this.value;
                    if (val) {
                        const d = new Date(val + "T00:00:00");
                        const day = d.getDay();
                        let horarioSelect = document.getElementById("horario_buffet");
                        if (day === 6) { // Sábado
                if (!horarioSelect) {
                    // Cria label estilizada
                    const label = document.createElement("label");
                    label.htmlFor = "horario_buffet";
                    label.innerText = "Horário do Buffet:";
                    label.style.fontWeight = "600";
                    label.style.marginBottom = "4px";
                    // Cria select estilizado
                    horarioSelect = document.createElement("select");
                    horarioSelect.id = "horario_buffet";
                    horarioSelect.name = "horario_buffet";
                    horarioSelect.required = true;
                    horarioSelect.className = "input-date";
                    horarioSelect.style.marginBottom = "12px";
                    horarioSelect.innerHTML = `<option value="">Selecione o horário</option><option value="11-14">11h às 14h</option><option value="16-23">16h às 23h</option>`;
                    // Insere label e select logo após o campo de data
                    const form = this.form;
                    form.insertBefore(label, this.nextSibling);
                    form.insertBefore(horarioSelect, label.nextSibling);
                }
                        } else {
                            if (horarioSelect) {
                                horarioSelect.remove();
                            }
                        }
                        // Bloqueia segunda e terça
                        if (day === 1 || day === 2) {
                            this.value = "";
                            this.setCustomValidity("Buffet não pode ser marcado para segunda ou terça-feira.");
                            this.reportValidity();
                        } else {
                            this.setCustomValidity("");
                        }
                    }
                });
                dateInput._listenerAdded = true;
            }
        }, 0);

        // Função para verificar duplicidade de data/hora
        async function verificarDataBuffet(data, horario) {
            const res = await fetch('http://localhost:3000/api/buffet');
            const buffets = await res.json();
            // Sábado: pode ter dois horários
            const d = new Date(data + "T00:00:00");
            const day = d.getDay();
            if (day === 6) {
                const count = buffets.filter(b => b.data_buffet === data && b.horario_buffet === horario).length;
                return count >= 1;
            } else {
                const count = buffets.filter(b => b.data_buffet === data).length;
                return count >= 1;
            }
        }

        document.getElementById("criarBuffet").onclick = async function() {
            const form = document.getElementById("buffetForm");
            const formData = new FormData(form);
            const data = formData.get("data_buffet");
            let horario = null;
            const d = new Date(data + "T00:00:00");
            if (d.getDay() === 6) {
                horario = formData.get("horario_buffet");
                if (!horario || (horario !== "11-14" && horario !== "16-23")) {
                    document.getElementById("buffetMsg").innerText = "Selecione o horário do buffet para sábado.";
                    return;
                }
                formData.set("horario_buffet", horario); // garante valor correto
            } else {
                formData.delete("horario_buffet");
            }
            const duplicado = await verificarDataBuffet(data, horario);
            if (duplicado) {
                document.getElementById("buffetMsg").innerText = d.getDay() === 6 ? "Já existe buffet para este sábado e horário!" : "Já existe buffet para este dia!";
                return;
            }
            const res = await fetch('http://localhost:3000/api/buffet', {
                method: 'POST',
                body: formData
            });
            let msg = "Buffet criado!";
            if (!res.ok) {
                try {
                    const data = await res.json();
                    msg = data.message || data.error || "Erro ao criar.";
                } catch {
                    msg = "Erro ao criar.";
                }
            }
            document.getElementById("buffetMsg").innerText = msg;
            // Limpa campos do formulário buffet se criado com sucesso
            if (res.ok) {
                const form = document.getElementById("buffetForm");
                form.reset();
                // Remove campo de horário se existir
                const horarioLabel = document.querySelector("label[for='horario_buffet']");
                const horarioSelect = document.getElementById("horario_buffet");
                if (horarioLabel) horarioLabel.remove();
                if (horarioSelect) horarioSelect.remove();
            }
        };
        document.getElementById("atualizarBuffet").onclick = async function() {
            const form = document.getElementById("buffetForm");
            const formData = new FormData(form);
            const data = formData.get("data_buffet");
            let horario = null;
            const d = new Date(data + "T00:00:00");
            if (d.getDay() === 6) {
                horario = formData.get("horario_buffet");
                if (!horario || (horario !== "11-14" && horario !== "16-23")) {
                    document.getElementById("buffetMsg").innerText = "Selecione o horário do buffet para sábado.";
                    return;
                }
                formData.set("horario_buffet", horario);
            } else {
                formData.delete("horario_buffet");
            }
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
            let msg = res.ok ? "Porção criada!" : "Erro ao criar.";
            if (!res.ok) {
                try {
                    const data = await res.json();
                    msg = data.message || data.error || "Erro ao criar.";
                } catch {
                    msg = "Erro ao criar.";
                }
            }
            document.getElementById("porcaoMsg").innerText = msg;
            // Limpa campos do formulário porção se criado com sucesso
            if (res.ok) {
                document.getElementById("porcaoForm").reset();
            }
        };
        document.getElementById("atualizarPorcao").onclick = async function() {
            const nome = prompt("Nome da porção para atualizar:");
            if (!nome) return;
            const form = document.getElementById("porcaoForm");
            const formData = new FormData(form);
            // Corrige campos numéricos vazios para null
            ["preco_inteira", "preco_meia"].forEach(campo => {
                const val = formData.get(campo);
                if (val === "" || val === null) {
                    formData.delete(campo);
                }
            });
            const res = await fetch(`http://localhost:3000/api/porcoes/nome/${encodeURIComponent(nome)}`, {
                method: 'PUT',
                body: formData
            });
            let msg = res.ok ? "Porção atualizada!" : "Erro ao atualizar.";
            if (!res.ok) {
                try {
                    const data = await res.json();
                    msg = data.message || data.error || "Erro ao atualizar.";
                } catch {
                    msg = "Erro ao atualizar.";
                }
            }
            document.getElementById("porcaoMsg").innerText = msg;
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
            // Limpa campos do formulário drink se criado com sucesso
            if (res.ok) {
                document.getElementById("drinkForm").reset();
            }
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