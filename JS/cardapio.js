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

function resolveImageUrl(url) {
  if (!url) return '';
  // Se já começa com http ou /uploads, retorna direto
  if (url.startsWith('http') || url.startsWith('/uploads')) {
    return 'http://localhost:3000' + (url.startsWith('http') ? '' : url);
  }
  // Caso venha só o nome do arquivo
  return 'http://localhost:3000/uploads/' + url;
}

async function fetchCardapio() {
  const buffetRes = await fetch('http://localhost:3000/api/buffet');
  const buffetItens = await buffetRes.json();

  const buffetList = document.getElementById("buffet-list");
  if (buffetList && Array.isArray(buffetItens)) {
    buffetList.innerHTML = buffetItens.map(item => `
      <div class="buffet-block" style="margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid #e0e0e0;">
        <h3 style="margin-bottom:6px;color:#388e3c;">
          ${new Date(item.data_buffet).toLocaleDateString('pt-BR')}
        </h3>
        <div class="buffet-carousel" style="position:relative;max-width:600px;margin-bottom:18px;">
          <button class="carousel-btn left" aria-label="Imagem anterior" style="position:absolute;top:50%;left:0;transform:translateY(-50%);background:#fff;border:none;border-radius:50%;box-shadow:0 2px 8px #0002;padding:8px;cursor:pointer;z-index:2;font-size:1.5rem;">&#8249;</button>
          <div class="carousel-track" style="overflow:hidden;width:100%;height:220px;display:flex;align-items:center;">
            ${item.url_imagem.map((url, idx) => `
              <div class="carousel-item" data-index="${idx}" style="min-width:100%;transition:transform 0.5s;">
                ${url.match(/\.(mp4|webm|ogg)$/i)
                  ? `<video src="http://localhost:3000${url}" controls style="width:100%;height:220px;object-fit:cover;border-radius:12px;"></video>`
                  : `<img src="http://localhost:3000${url}" alt="Buffet" style="width:100%;height:220px;object-fit:cover;border-radius:12px;cursor:pointer;" onclick="expandImage('http://localhost:3000${url}','Buffet')" tabindex="0">`
                }
              </div>
            `).join('')}
          </div>
          <button class="carousel-btn right" aria-label="Próxima imagem" style="position:absolute;top:50%;right:0;transform:translateY(-50%);background:#fff;border:none;border-radius:50%;box-shadow:0 2px 8px #0002;padding:8px;cursor:pointer;z-index:2;font-size:1.5rem;">&#8250;</button>
        </div>
        <div style="flex:1;min-width:180px;">
          <div style="font-size:1.05rem;margin-bottom:8px;">${item.descricao || ''}</div>
          <div style="font-weight:bold;color:#388e3c;">
            Buffet por Kg: R$ ${Number(item.preco_por_kg).toFixed(2).replace('.', ',')}
          </div>
          ${item.horario_buffet ? `<div style="color:#555;">Horário: ${item.horario_buffet}</div>` : ''}
        </div>
      </div>
    `).join("");

    // Ativa o carrosel para cada bloco
    document.querySelectorAll('.buffet-carousel').forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const items = carousel.querySelectorAll('.carousel-item');
      let current = 0;

      function updateCarousel() {
        items.forEach((item, idx) => {
          item.style.transform = `translateX(-${current * 100}%)`;
        });
      }

      carousel.querySelector('.carousel-btn.left').onclick = () => {
        current = (current - 1 + items.length) % items.length;
        updateCarousel();
      };
      carousel.querySelector('.carousel-btn.right').onclick = () => {
        current = (current + 1) % items.length;
        updateCarousel();
      };

      updateCarousel();
    });
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
          <img src="${resolveImageUrl(item.url_imagem)}" alt="${item.nome_porcao}" style="width:100%;border-radius:8px;cursor:pointer;" onclick="expandImage('${resolveImageUrl(item.url_imagem)}','${item.nome_porcao}')" tabindex="0" aria-label="Expandir imagem de ${item.nome_porcao}">
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
          <img src="${resolveImageUrl(item.url_imagem)}" alt="${item.nome_drink}" style="width:100%;border-radius:8px;cursor:pointer;" onclick="expandImage('${resolveImageUrl(item.url_imagem)}','${item.nome_drink}')" tabindex="0" aria-label="Expandir imagem de ${item.nome_drink}">
          <figcaption style="font-size:0.85rem;color:#388e3c;">${item.nome_drink}</figcaption>
        </figure>
        <span style="font-weight:bold; color:#388e3c;">R$ ${item.preco}</span>
      </li>
    `).join("");
  }
}

// Chame a função ao carregar a página do cardápio
window.createCardapio = fetchCardapio;
