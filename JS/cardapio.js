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
        <img src="${item.img}" alt="${item.nome}" />
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
            <img src="${item.img}" alt="${item.nome}" style="width:100%;border-radius:8px;">
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
              <img src="${item.img}" alt="${item.nome}" style="width:100%;border-radius:8px;">
              <figcaption style="font-size:0.85rem;color:#388e3c;">${item.nome}</figcaption>
            </figure>
            <span style="font-weight:bold; color:#388e3c;">${item.preco}</span>
          </li>`
      )
      .join("");
  }
}
