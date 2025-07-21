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
            <form id="buffetForm" enctype="multipart/form-data" style="margin-top:20px;display:flex;flex-direction:column;gap:0;">
                <label for="data_buffet" style="font-weight:600;margin-bottom:4px;">Data do Buffet:</label>
                <input type="date" name="data_buffet" id="data_buffet" required class="input-date" style="margin-bottom:12px;">
                <!-- O campo de horário será inserido dinamicamente aqui -->
                <div id="horario_buffet_container"></div>
                
                <label for="preco_por_kg" style="font-weight:600;margin-bottom:4px;">Preço por Kg:</label>
                <input type="number" name="preco_por_kg" id="preco_por_kg" placeholder="R$" step="0.01" min="0" required style="margin-bottom:12px;">
                <label for="descricao" style="font-weight:600;margin-bottom:4px;">Descrição:</label>
                <textarea name="descricao" id="descricao" placeholder="Descrição do buffet" rows="2" style="margin-bottom:12px;"></textarea>
                <label for="media" style="font-weight:600;margin-bottom:4px;">Imagens/Vídeos:</label>
                <input type="file" name="media" id="media" accept="image/*,video/*" multiple style="margin-bottom:12px;">
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
        const dateInput = document.getElementById("data_buffet");
        const horarioContainer = document.getElementById("horario_buffet_container");

        // Função para gerar o campo de input de horário com datalist
        function generateHorarioInput(day) {
            let placeholderText = '';
            let datalistOptions = '';
            let isRequired = false;
            let defaultValue = ''; // Para pré-preencher o campo

            horarioContainer.innerHTML = ''; // Limpa elementos anteriores

            if (day === 1 || day === 2) { // Segunda ou Terça
                return; // Nenhum input para esses dias
            } else if (day >= 3 && day <= 5) { // Quarta, Quinta, Sexta
                placeholderText = "Ex: 18-23 ou 19:30";
                datalistOptions = `<option value="18-23">`; // Sugestão
                defaultValue = "18-23"; // Padrão para estes dias
                isRequired = true;
            } else if (day === 6) { // Sábado
                placeholderText = "Ex: 11-14, 18-23 ou 15:00";
                datalistOptions = `
                    <option value="11-14">
                    <option value="18-23">
                `;
                isRequired = true;
            } else if (day === 0) { // Domingo
                placeholderText = "Ex: 11-14 ou 12:00";
                datalistOptions = `<option value="11-14">`; // Sugestão
                defaultValue = "11-14"; // Padrão para Domingo
                isRequired = true;
            }

            if (placeholderText) {
                const label = document.createElement("label");
                label.htmlFor = "horario_buffet";
                label.innerText = "Horário do Buffet:";
                label.style.fontWeight = "600";
                label.style.marginBottom = "4px";

                const input = document.createElement("input");
                input.type = "text";
                input.id = "horario_buffet";
                input.name = "horario_buffet";
                input.placeholder = placeholderText;
                input.className = "input-date";
                input.style.marginBottom = "12px";
                input.setAttribute('list', 'horarioSuggestions'); // Vincula ao datalist
                input.required = isRequired;
                input.value = defaultValue; // Define o valor padrão

                const datalist = document.createElement("datalist");
                datalist.id = "horarioSuggestions";
                datalist.innerHTML = datalistOptions;

                horarioContainer.appendChild(label);
                horarioContainer.appendChild(input);
                horarioContainer.appendChild(datalist);
            }
        }

        // Listener para o campo de data
        dateInput.addEventListener("input", function() {
            const val = this.value;
            if (val) {
                const d = new Date(val + "T00:00:00");
                const day = d.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

                // Bloqueia segunda e terça no frontend e exibe mensagem
                if (day === 1 || day === 2) {
                    this.value = ""; // Limpa a data selecionada
                    horarioContainer.innerHTML = ''; // Remove o campo de horário
                    document.getElementById("buffetMsg").innerText = "Buffet não pode ser marcado para segunda ou terça-feira.";
                    return;
                } else {
                    document.getElementById("buffetMsg").innerText = ""; // Limpa mensagem de erro
                }
                generateHorarioInput(day); // Chama a nova função para gerar o input de horário
            } else {
                horarioContainer.innerHTML = ''; // Limpa o campo de horário se a data for removida
            }
        });

        // Função para verificar duplicidade de data/hora
        async function verificarDataBuffet(data, horario) {
            const res = await fetch('http://localhost:3000/api/buffet');
            const buffets = await res.json();
            
            // O backend espera o formato "HH:MM:SS" para comparação,
            // então precisamos simular a conversão do backend para a verificação de duplicidade no frontend.
            let horarioBackendFormat = null;
            const d = new Date(data + "T00:00:00");
            const day = d.getDay();

            if (horario === "11-14") {
                horarioBackendFormat = "11:00:00";
            } else if (horario === "18-23") {
                horarioBackendFormat = "18:00:00";
            } else {
                // Tenta analisar como HH:MM customizado
                const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:MM
                if (timeRegex.test(horario)) {
                    horarioBackendFormat = `${horario}:00`;
                }
            }

            // Se nenhum formato válido pôde ser derivado, e o horário é obrigatório para o dia,
            // isso significa que a entrada é inválida, então não será uma duplicata de uma entrada válida.
            // O backend irá capturar o formato inválido.
            if (!horarioBackendFormat && horario && (day >= 3 && day <= 6 || day === 0)) { 
                return false; // Não é uma duplicata de uma entrada válida, mas pode ser um formato inválido
            }

            const count = buffets.filter(b => b.data_buffet === data && b.horario_buffet === horarioBackendFormat).length;
            return count >= 1;
        }

        document.getElementById("criarBuffet").onclick = async function() {
            const form = document.getElementById("buffetForm");
            const formData = new FormData(form);
            const data = formData.get("data_buffet");
            const horarioInputElement = document.getElementById("horario_buffet");
            let horario = horarioInputElement ? horarioInputElement.value : null;

            const d = new Date(data + "T00:00:00");
            const day = d.getDay();

            // Validação de horário para todos os dias válidos se o campo estiver vazio
            if ((day >= 3 && day <= 6 || day === 0) && !horario) {
                document.getElementById("buffetMsg").innerText = "Por favor, digite ou selecione o horário do buffet.";
                return;
            }

            formData.set("horario_buffet", horario); // Garante que o valor digitado/sugerido seja enviado (ex: "18-23" ou "19:30")
            
            const duplicado = await verificarDataBuffet(data, horario);
            if (duplicado) {
                document.getElementById("buffetMsg").innerText = `Já existe buffet para esta data (${data}) e horário!`;
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
                form.reset();
                horarioContainer.innerHTML = ''; // Remove o campo de horário dinâmico
            }
        };

        document.getElementById("atualizarBuffet").onclick = async function() {
            const buffetId = prompt("ID do buffet para atualizar:"); // Solicita o ID para atualização
            if (!buffetId) return;

            const form = document.getElementById("buffetForm");
            const formData = new FormData(form);
            const data = formData.get("data_buffet");
            const horarioInputElement = document.getElementById("horario_buffet");
            let horario = horarioInputElement ? horarioInputElement.value : null;

            const d = new Date(data + "T00:00:00");
            const day = d.getDay();

            // Validação de horário para todos os dias válidos se o campo estiver vazio
            if ((day >= 3 && day <= 6 || day === 0) && !horario) {
                document.getElementById("buffetMsg").innerText = "Por favor, digite ou selecione o horário do buffet.";
                return;
            }

            formData.set("horario_buffet", horario); // Garante que o valor digitado/sugerido seja enviado (ex: "18-23" ou "19:30")

            const res = await fetch(`http://localhost:3000/api/buffet/${buffetId}`, {
                method: 'PUT',
                body: formData
            });
            let msg = res.ok ? "Buffet atualizado!" : "Erro ao atualizar.";
            if (!res.ok) {
                try {
                    const data = await res.json();
                    msg = data.message || data.error || "Erro ao atualizar.";
                } catch {
                    msg = "Erro ao atualizar.";
                }
            }
            document.getElementById("buffetMsg").innerText = msg;
        };

        document.getElementById("deletarBuffet").onclick = async function() {
            const buffetId = prompt("ID do buffet para deletar:"); // Solicita o ID para deletar
            if (!buffetId) return;

            const res = await fetch(`http://localhost:3000/api/buffet/${buffetId}`, {
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
