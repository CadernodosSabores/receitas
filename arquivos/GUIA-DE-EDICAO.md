# GUIA DE EDIÇÃO — SITE À MESA

## O que aparece na raiz do repositório

```text
index.html                           ← ÚNICA página HTML da raiz, entrada do site
css/
  estilo.css                         ← estilos e layout geral
  personalizar.css                   ← ESPAÇO LIVRE para mudanças de aparência
js/
  receitas.js                        ← as 14 receitas originais
  novas-receitas.js                  ← ESPAÇO LIVRE para novos cadastros
  app.js                             ← busca, favoritos, porções e compras
arquivos/
  GUIA-DE-EDICAO.md                  ← este guia
  compartilhados/favicon.svg
  cafe-da-manha/
    index.html                       ← catálogo da categoria
    receita.html                     ← página automática para receitas NOVAS
    cafe-da-manha-14-receitas.pdf
    fotos/                            ← fotos originais e novas
    receitas/<nome>/index.html       ← 14 fichas originais individuais
  almoco/
    index.html
    receita.html
    fotos/
    receitas/
  lanches/                            ← igual a almoco/
  jantar/                             ← igual a almoco/
```

## Adicionar uma receita: só 2 passos

1. Coloque uma imagem em `arquivos/<categoria>/fotos/` (ex.: `arquivos/almoco/fotos/risoto.webp`).
2. Abra `js/novas-receitas.js` e copie o exemplo comentado para dentro de `window.RECEITAS_NOVAS = [ ... ];`.
   Troque os campos, selecione `category` como `cafe-da-manha`, `almoco`, `lanches` ou `jantar` e confira o caminho da foto.

**Feito.** A nova receita aparece automaticamente em sua categoria e abre em uma página detalhada, com fotos, ingredientes, kcal, modo de preparo, favoritos e lista de compras. Não é necessário criar outra página HTML para cada receita.

### Campos obrigatórios da receita
- `id`: nome único, minúsculo, sem espaço nem acento (ex.: `risoto-de-cogumelos`).
- `title`, `description`, `category`, `type` (`quente`, `frio` ou `bebida`).
- `kcal`: calorias estimadas POR PORÇÃO.
- `servings`: para quantas porções correspondem as quantidades informadas.
- `yield`, `morning`, `fridge`, `freezer`, `serve`: informações exibidas na página.
- `image`: endereço relativo à raiz; exemplo `arquivos/jantar/fotos/sopa.jpg`.
- `ingredients`: lista como `{name:"Tomate",amount:300,unit:"g"}`.
- `steps`: etapas entre aspas, separadas por vírgulas.

## Editar o site e deixar espaço livre

Todos os arquivos HTML têm uma marcação `ÁREA LIVRE — FUTURAS EDIÇÕES DESTA PÁGINA`, logo antes do final do conteúdo.
A folha de estilos `css/personalizar.css` é reservada para suas alterações.
No arquivo `js/novas-receitas.js` há espaço claramente separado para as 4 categorias.
O arquivo `js/app.js` também tem uma área livre para novas funcionalidades.

Não apague os atributos `id` já existentes em HTML; eles são usados pelo código.

## Como colocar no GitHub Pages

**Não envie o ZIP fechado.** Extraia e envie o conteúdo da pasta `Site_Receitas_Estrutura_Para_GitHub` para a raiz do repositório `amandacscampos/Receitas`.
Em GitHub > Settings > Pages, escolha `Deploy from a branch`, `main`, `/(root)`.
O site deve ficar em `https://amandacscampos.github.io/Receitas/` quando publicado.

Também funciona em um repositório diferente. Todas as referências são relativas à raiz do próprio site, sem usar um domínio fixo.

## Observações

Fotos ilustrativas geradas digitalmente. As kcal são estimativas, não dados laboratoriais. Para receitas de alimentos perecíveis, siga boas práticas de refrigeração e reaquecimento.
Favoritos e compras ficam salvos no navegador usado, não na conta GitHub.
