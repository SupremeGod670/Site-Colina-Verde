function createCardapio() {
  // Buffet
  const buffetContainer = document.getElementById("buffet-items");
  if (buffetContainer) {
    buffetContainer.innerHTML = `<div class="menu-item" style="justify-content: center; font-size: 1.15rem;"><span>Buffet livre</span><span style="margin-left: 24px; color: #388e3c; font-weight: bold;">R$ 15,00</span></div>`;
  }

  // Porções
  const porcoes = [
    {
      nome: "Baguette (aipim com bacon)",
      inteira: "R$ 15,00",
      meia: "R$ 7,50",
    },
    {
      nome: "Bolinho de aipim com camarão",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
    },
    {
      nome: "Bolinho de aipim com queijo",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
    },
    { nome: "Bolinho de peixe", inteira: "R$ 23,00", meia: "R$ 10,00" },
    { nome: "Camarão ao bafo", inteira: "R$ 40,00", meia: "R$ 20,00" },
    { nome: "Camarão à milanesa", inteira: "R$ 40,00", meia: "R$ 20,00" },
    {
      nome: "Camarão ensopado (Domingos - Almoço)",
      inteira: "R$ 40,00",
      meia: null,
    },
    { nome: "Casquinha de siri (unidade)", inteira: "R$ 5,00", meia: null },
    { nome: "Cebola à milanesa", inteira: "R$ 14,00", meia: "R$ 7,00" },
    { nome: "Frango à passarinho", inteira: "R$ 16,00", meia: "R$ 8,00" },
    {
      nome: "Frios (salame, queijo, azeitona, pepino)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
    },
    { nome: "Fritas", inteira: "R$ 14,00", meia: "R$ 7,00" },
    {
      nome: "Peixe isca (tilápia, papa-terra, pescada, linguado)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
    },
    {
      nome: "Peixe ensopado (Domingos - Almoço)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
    },
    {
      nome: "Peixe filé (papa-terra, pescada)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
    },
    {
      nome: "Peixe posta (tainha, papa-terra, anchova)",
      inteira: "R$ 20,00",
      meia: "R$ 10,00",
    },
    { nome: "Polentinha", inteira: "R$ 12,00", meia: "R$ 6,00" },
    { nome: "Queijo à milanesa", inteira: "R$ 20,00", meia: "R$ 10,00" },
  ];
  const porcoesContainer = document.getElementById("porcoes-items");
  if (porcoesContainer) {
    porcoesContainer.innerHTML = porcoes
      .map((item) => {
        let preco = item.meia ? `${item.inteira} / ${item.meia}` : item.inteira;
        return `<li class="menu-item"><span>${item.nome}</span><span>${preco}</span></li>`;
      })
      .join("");
  }

  // Drinks
  const drinks = [
    { nome: "Caipirinha", preco: "R$ 15,00" },
    { nome: "Refrigerante", preco: "R$ 6,00" },
  ];
  const drinksContainer = document.getElementById("drinks-items");
  if (drinksContainer) {
    drinksContainer.innerHTML = drinks
      .map(
        (item) =>
          `<li class="menu-item"><span>${item.nome}</span><span>${item.preco}</span></li>`
      )
      .join("");
  }
}
