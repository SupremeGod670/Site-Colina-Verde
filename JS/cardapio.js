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
// Buffet
const buffetItens = [
  { nome: "Arroz", img: "../Img/Buffet.png" },
  { nome: "Feijão", img: "../Img/Buffet.png" },
  { nome: "Salada", img: "../Img/Buffet.png" },
  { nome: "Macarrão", img: "../Img/Buffet.png" },
];
const buffetCarousel = document.querySelector("#buffet .carousel");
if (buffetCarousel) {
  buffetCarousel.innerHTML = buffetItens
    .map(
      (item) => `
      <figure>
        <img src="${item.img}" alt="${item.nome}" style="width:100%;height:200px;object-fit:cover;border-radius:12px 12px 0 0;cursor:pointer;" onclick="expandImage('${item.img}','${item.nome}')" tabindex="0" aria-label="Expandir imagem de ${item.nome}">
        <figcaption>${item.nome}</figcaption>
      </figure>
    `
    )
    .join("");
}
function createCardapio() {
  // Porções
  const porcoes = [
    {
      nome: "Baguette (aipim com bacon)",
      inteira: "R$ 15,00",
      meia: "R$ 7,50",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Bolinho de aipim com camarão",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Bolinho de aipim com queijo",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Bolinho de peixe",
      inteira: "R$ 23,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Camarão ao bafo",
      inteira: "R$ 40,00",
      meia: "R$ 20,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Camarão à milanesa",
      inteira: "R$ 40,00",
      meia: "R$ 20,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Camarão ensopado (Domingos - Almoço)",
      inteira: "R$ 40,00",
      meia: null,
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Casquinha de siri (unidade)",
      inteira: "R$ 5,00",
      meia: null,
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Cebola à milanesa",
      inteira: "R$ 14,00",
      meia: "R$ 7,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Frango à passarinho",
      inteira: "R$ 16,00",
      meia: "R$ 8,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Frios (salame, queijo, azeitona, pepino)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Fritas",
      inteira: "R$ 14,00",
      meia: "R$ 7,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Peixe isca (tilápia, papa-terra, pescada, linguado)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Peixe ensopado (Domingos - Almoço)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Peixe filé (papa-terra, pescada)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Peixe posta (tainha, papa-terra, anchova)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Polentinha",
      inteira: "R$ 12,00",
      meia: "R$ 6,00",
      img: "../Img/Petiscos.png",
    },
    {
      nome: "Queijo à milanesa",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
      img: "../Img/Petiscos.png",
    },
  ];
  const porcoesContainer = document.getElementById("porcoes-items");
  if (porcoesContainer) {
    porcoesContainer.innerHTML = porcoes
      .map((item) => {
        let preco = item.meia ? `${item.inteira} / ${item.meia}` : item.inteira;
        return `<li class="menu-item">
          <figure style="width:80px; margin:0 10px 0 0; display:inline-block; vertical-align:middle;">
            <img src="${item.img}" alt="${item.nome}" style="width:100%;border-radius:8px;cursor:pointer;" onclick="expandImage('${item.img}','${item.nome}')" tabindex="0" aria-label="Expandir imagem de ${item.nome}">
            <figcaption style="font-size:0.85rem;color:#388e3c;">${item.nome}</figcaption>
          </figure>
          <span style="font-weight:bold; color:#388e3c;">${preco}</span>
        </li>`;
      })
      .join("");
  }

  // Drinks
  const drinks = [
    { nome: "Caipirinha", preco: "R$ 15,00", img: "../Img/Drinks.png" },
    { nome: "Refrigerante", preco: "R$ 6,00", img: "../Img/Drinks.png" },
  ];
  const drinksContainer = document.getElementById("drinks-items");
  if (drinksContainer) {
    drinksContainer.innerHTML = drinks
      .map(
        (item) =>
          `<li class="menu-item">
            <figure style="width:80px; margin:0 10px 0 0; display:inline-block; vertical-align:middle;">
              <img src="${item.img}" alt="${item.nome}" style="width:100%;border-radius:8px;cursor:pointer;" onclick="expandImage('${item.img}','${item.nome}')" tabindex="0" aria-label="Expandir imagem de ${item.nome}">
              <figcaption style="font-size:0.85rem;color:#388e3c;">${item.nome}</figcaption>
            </figure>
            <span style="font-weight:bold; color:#388e3c;">${item.preco}</span>
          </li>`
      )
      .join("");
  }
}
