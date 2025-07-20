// Função para expandir imagem em modal
function expandImage(src, alt) {
  let modal = document.getElementById('img-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'img-modal';
    modal.setAttribute('tabindex', '0');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `<img src="${src}" alt="${alt}" style="max-width:90vw;max-height:80vh;border-radius:16px;box-shadow:0 4px 24px #0008;" /><button id="close-modal" aria-label="Fechar imagem" style="position:absolute;top:32px;right:32px;font-size:2rem;background:#fff;border:none;border-radius:50%;padding:8px;cursor:pointer;">&times;</button>`;
    document.body.appendChild(modal);
    document.getElementById('close-modal').onclick = () => {
      modal.remove();
    };
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    modal.focus();
  }
}

// Remova os arrays e funções fixas de itens (buffetItens, porcoes, drinks, createCardapio) 
// e mantenha apenas a função fetchCardapio para buscar do banco

async function fetchCardapio() {
  // Buffet
  const buffetRes = await fetch('http://localhost:3000/api/buffet');
  const buffetItens = await buffetRes.json();
  const buffetCarousel = document.querySelector("#buffet .carousel");
  if (buffetCarousel && Array.isArray(buffetItens)) {
    buffetCarousel.innerHTML = buffetItens.map(item => `
      <figure>
        <img src="${item.url_imagem ? item.url_imagem : ''}" alt="${item.descricao || 'Buffet'}" style="width:100%;height:200px;object-fit:cover;border-radius:12px 12px 0 0;cursor:pointer;" onclick="expandImage('${item.url_imagem}','${item.descricao}')" tabindex="0" aria-label="Expandir imagem de ${item.descricao}">
        <figcaption>${item.descricao || ''}</figcaption>
      </figure>
    `).join("");
  }

  // Porções
  const porcoesRes = await fetch('http://localhost:3000/api/porcoes');
  const porcoes = await porcoesRes.json();
  const porcoesContainer = document.getElementById("porcoes-items");
  if (porcoesContainer && Array.isArray(porcoes)) {
    porcoesContainer.innerHTML = porcoes.map(item => {
      let preco = item.preco_meia ? `R$ ${item.preco_inteira} / R$ ${item.preco_meia}` : `R$ ${item.preco_inteira}`;
      return `<li class="menu-item">
        <figure style="width:80px; margin:0 10px 0 0; display:inline-block; vertical-align:middle;">
          <img src="${item.url_imagem ? item.url_imagem : ''}" alt="${item.nome_porcao}" style="width:100%;border-radius:8px;cursor:pointer;" onclick="expandImage('${item.url_imagem}','${item.nome_porcao}')" tabindex="0" aria-label="Expandir imagem de ${item.nome_porcao}">
          <figcaption style="font-size:0.85rem;color:#388e3c;">${item.nome_porcao}</figcaption>
        </figure>
        <span style="font-weight:bold; color:#388e3c;">${preco}</span>
      </li>`;
    }).join("");
  }

  // Drinks
  const drinksRes = await fetch('http://localhost:3000/api/drinks');
  const drinks = await drinksRes.json();
  const drinksContainer = document.getElementById("drinks-items");
  if (drinksContainer && Array.isArray(drinks)) {
    drinksContainer.innerHTML = drinks.map(item => `
      <li class="menu-item">
        <figure style="width:80px; margin:0 10px 0 0; display:inline-block; vertical-align:middle;">
          <img src="${item.url_imagem ? item.url_imagem : ''}" alt="${item.nome_drink}" style="width:100%;border-radius:8px;cursor:pointer;" onclick="expandImage('${item.url_imagem}','${item.nome_drink}')" tabindex="0" aria-label="Expandir imagem de ${item.nome_drink}">
          <figcaption style="font-size:0.85rem;color:#388e3c;">${item.nome_drink}</figcaption>
        </figure>
        <span style="font-weight:bold; color:#388e3c;">R$ ${item.preco}</span>
      </li>
    `).join("");
  }
}

// Chame a função ao carregar a página do cardápio
window.createCardapio = fetchCardapio;
