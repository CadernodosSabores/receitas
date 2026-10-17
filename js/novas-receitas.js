/* ===========================================================================
   ÁREA LIVRE PARA NOVAS RECEITAS — EDITE SOMENTE ESTE ARQUIVO

   As novas receitas aparecem automaticamente nas páginas de cada categoria.
   Só precisa: (1) salvar a foto na pasta indicada; (2) adicionar um objeto
   dentro da lista window.RECEITAS_NOVAS, removendo o comentário do exemplo.

   CATEGORIAS: "cafe-da-manha", "almoco", "lanches", "jantar"
   TIPOS: "quente", "frio", "bebida"
   kcal = calorias POR PORÇÃO; servings = rendimento base.
   Medidas: ingredient.amount é um número; unit pode ser "g" ou "mL".

   EXEMPLO (TIRE OS COMENTÁRIOS /* ... * / E AJUSTE OS CAMPOS):

   {
     id: "risoto-de-cogumelos",
     title: "Risoto de cogumelos",
     description: "Risoto cremoso, feito em casa.",
     category: "almoco",
     type: "quente",
     kcal: 420,
     yield: "1 prato",
     servings: 4,
     morning: "Reaquecer até ficar bem quente",
     fridge: "Até 2 dias",
     freezer: "Não recomendado",
     image: "arquivos/almoco/fotos/risoto.webp",
     ingredients: [
       {name: "Arroz arbóreo", amount: 320, unit: "g"},
       {name: "Cogumelos", amount: 400, unit: "g"},
       {name: "Água ou caldo", amount: 850, unit: "mL"}
     ],
     steps: [
       "Refogue os cogumelos.",
       "Cozinhe o arroz adicionando o caldo aos poucos.",
       "Misture e sirva."
     ],
     serve: "Aqueça na hora e sirva imediatamente."
   },

   IMPORTANTE: cada receita deve ter um id diferente, sem espaços nem acentos.
   =========================================================================== */

window.RECEITAS_NOVAS = [
  // ---------------------- CAFÉ DA MANHÃ ----------------------
  // Cole aqui suas novas receitas com category: "cafe-da-manha".

  // -------------------------- ALMOÇO -------------------------
  // Cole aqui suas novas receitas com category: "almoco".

  // ------------------------- LANCHES -------------------------
  // Cole aqui suas novas receitas com category: "lanches".

  // -------------------------- JANTAR -------------------------
  // Cole aqui suas novas receitas com category: "jantar".
];

// Inclui automaticamente as novas receitas no catálogo, sem criar novo HTML.
// Não altere este bloco: ele ativa as páginas automáticas das novas receitas.
const receitasCadastradas = Array.isArray(window.RECEITAS) ? window.RECEITAS : [];
const receitasNovas = Array.isArray(window.RECEITAS_NOVAS) ? window.RECEITAS_NOVAS : [];
window.RECEITAS = receitasCadastradas.concat(receitasNovas.map(r => ({...r, nova: true})));

/* ============ ÁREA LIVRE — AJUSTES FUTUROS NO CADASTRO ============ */
