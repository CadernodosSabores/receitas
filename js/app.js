/* Caderno à mesa — site estático, sem bibliotecas externas nem servidor. */
(() => {
  'use strict';
  const recipes = Array.isArray(window.RECEITAS) ? window.RECEITAS : [];
  const get = id => document.getElementById(id);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const read = (key, fallback) => {try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; }};
  const persist = (key, value) => {try {localStorage.setItem(key, JSON.stringify(value));}catch{}};
  let favorites = read('amesa_favoritos', []);
  let shopping = read('amesa_compras', []);
  const fmt = number => Number.isInteger(number) ? String(number) : number.toLocaleString('pt-BR',{maximumFractionDigits:1});
  const typeNames = {quente:'Quente · air fryer',frio:'Frio · pronto para servir',bebida:'Bebida'};
  const typeNameFor = r => r.category==='cafe-da-manha' ? (typeNames[r.type] || 'Receita') : (r.type==='quente' ? 'Prato quente' : r.type==='frio' ? 'Prato frio' : 'Bebida');
  const categoryNames = {'cafe-da-manha':'Café da manhã','almoco':'Almoço','lanches':'Lanches','jantar':'Jantar'};
  // Contadores da página inicial e do cabeçalho de café da manhã.
  const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
  setText('total-receitas',String(recipes.length));
  const categoryCount = category => recipes.filter(r=>r.category===category).length;
  setText('total-cafe',String(categoryCount('cafe-da-manha')));
  setText('cafe-count',categoryCount('cafe-da-manha')+' receitas');
  document.querySelectorAll('[data-count-category]').forEach(el=>{
    const count=categoryCount(el.dataset.countCategory);
    el.textContent=count ? count+' '+(count===1?'receita':'receitas') : 'Em breve';
  });
  document.querySelectorAll('[data-count-type]').forEach(el=>{
    const count=recipes.filter(r=>r.category==='cafe-da-manha' && r.type===el.dataset.countType).length;
    el.textContent=count+' '+({quente:'quentes',frio:'frias',bebida:'bebidas'}[el.dataset.countType]||'receitas');
  });
  const hrefFor = r => r.nova ? 'arquivos/'+encodeURIComponent(r.category)+'/receita.html?id='+encodeURIComponent(r.id) : 'arquivos/'+encodeURIComponent(r.category)+'/receitas/'+encodeURIComponent(r.id)+'/index.html';
  const heartIcon = pressed => `<svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="${pressed ? 'currentColor':'none'}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20.8 4.7a5.7 5.7 0 0 0-8.1 0l-.7.7-.7-.7a5.7 5.7 0 0 0-8.1 8.1 5.7 5.7 0 0 0 0 8.1L12 21l8.8-8.2a5.7 5.7 0 0 0 0-8.1Z"/></svg>`;
  function toggleFavorite(id){favorites = favorites.includes(id) ? favorites.filter(v=>v!==id):[...favorites,id];persist('amesa_favoritos',favorites);document.querySelectorAll(`[data-fav="${CSS.escape(id)}"]`).forEach(b=>{const state=favorites.includes(id);b.setAttribute('aria-pressed',state);b.innerHTML=heartIcon(state)+(b.id==='detail-fav'?' '+(state?'Favoritada':'Favoritar'):'');b.setAttribute('aria-label', state?'Remover dos favoritos':'Salvar nos favoritos');});window.dispatchEvent(new Event('favorites-updated'));}
  function recipeCard(r){const fav=favorites.includes(r.id);return `<article class="recipe-card"><div class="recipe-photo"><a href="${hrefFor(r)}" aria-label="Ver receita ${safe(r.title)}"><img src="${safe(r.image)}" alt="Foto ilustrativa de ${safe(r.title)}" loading="lazy"></a><span class="recipe-type">${typeNameFor(r)}</span><button class="heart" type="button" aria-label="${fav?'Remover dos favoritos':'Salvar nos favoritos'}" aria-pressed="${fav}" data-fav="${safe(r.id)}">${heartIcon(fav)}</button></div><div class="recipe-body"><h3><a href="${hrefFor(r)}">${safe(r.title)}</a></h3><p>${safe(r.description)}</p><div class="recipe-metrics"><span><strong>≈ ${r.kcal} kcal</strong> / porção</span><span>${safe(r.morning)}</span></div><a class="card-cta" href="${hrefFor(r)}"><span>Ver receita completa</span><span aria-hidden="true">↗</span></a></div></article>`;}
  const listingEl=get('recipe-list');
  if(listingEl){
    const section=document.body.dataset.category || 'cafe-da-manha';
    const source=recipes.filter(r=>r.category===section);
    if(source.length && get('dynamic-listing')){get('dynamic-listing').hidden=false;const intro=get('coming-soon');if(intro)intro.hidden=true;}
    let type='todos',query='',favsOnly=false;
    const counter=get('listing-count');
    const tabs=[...document.querySelectorAll('[data-filter]')];
    const faveBtn=get('faves-filter');
    const render=()=>{
      let shown=source.filter(r => (type==='todos'||r.type===type) && (!favsOnly||favorites.includes(r.id)) && (`${r.title} ${r.description} ${r.ingredients.map(x=>x.name).join(' ')}`).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query));
      listingEl.innerHTML=shown.length ? shown.map(recipeCard).join('') : `<div class="empty-search" style="grid-column:1/-1"><strong>Nenhuma receita encontrada.</strong><p>Tente outra palavra ou outro filtro.</p><button class="btn btn-outline" type="button" id="clear-search">Limpar filtros</button></div>`;
      if(counter) counter.textContent=`${shown.length} ${shown.length===1?'receita encontrada':'receitas encontradas'}`;
      const clear=get('clear-search');if(clear)clear.addEventListener('click',()=>{type='todos';query='';favsOnly=false;const s=get('recipe-search');if(s)s.value='';tabs.forEach(t=>t.classList.toggle('active',t.dataset.filter==='todos'));if(faveBtn){faveBtn.classList.remove('active');faveBtn.setAttribute('aria-pressed','false')}render()});
    };
    tabs.forEach(tab=>tab.addEventListener('click',()=>{type=tab.dataset.filter;tabs.forEach(t=>{t.classList.toggle('active',t===tab);t.setAttribute('aria-pressed',String(t===tab));});render();}));
    const input=get('recipe-search');if(input)input.addEventListener('input',e=>{query=e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();render()});
    if(faveBtn)faveBtn.addEventListener('click',()=>{favsOnly=!favsOnly;faveBtn.classList.toggle('active',favsOnly);faveBtn.setAttribute('aria-pressed',String(favsOnly));render()});
    window.addEventListener('favorites-updated',()=>{if(favsOnly)render()});
    render();
  }
  const detail=get('recipe-detail');
  if(detail){
    const params=new URLSearchParams(location.search);const recipe=recipes.find(r=>r.id===(document.body.dataset.recipeId || params.get('id')));
    if(!recipe){detail.innerHTML='<div class="container" style="padding:110px 20px"><h1>Receita não encontrada.</h1><p>Volte para a coleção e escolha outra receita.</p><a class="btn btn-primary" href="arquivos/cafe-da-manha/index.html">Ver café da manhã</a></div>';}
    else{
      document.title=recipe.title+' | à mesa.';
      let portions=Number(recipe.servings) || 4;
      const fav=favorites.includes(recipe.id);
      detail.innerHTML=`<section class="recipe-head"><div class="container"><div class="breadcrumbs"><a href="index.html">Início</a><span>›</span><a href="arquivos/${safe(recipe.category)}/index.html">${safe(categoryNames[recipe.category] || recipe.category)}</a><span>›</span><span>${safe(recipe.title)}</span></div><div class="recipe-layout-top"><figure class="recipe-cover" style="margin:0"><img src="${safe(recipe.image)}" alt="Foto ilustrativa: ${safe(recipe.title)}"></figure><div class="recipe-intro"><span class="eyebrow">${safe(typeNameFor(recipe))}</span><h1>${safe(recipe.title)}</h1><p>${safe(recipe.description)}</p><div class="recipe-numbers"><div class="number"><strong>≈ ${recipe.kcal}</strong><span>kcal / porção</span></div><div class="number"><strong id="portion-label">${Number(recipe.servings) || 4}</strong><span>Porções</span></div><div class="number"><strong>${recipe.type==='quente'?'Air fryer':recipe.type==='frio'?'Geladeira':'Bebida'}</strong><span>Para servir</span></div></div><div class="recipe-btns"><button class="btn btn-primary" type="button" id="add-shopping">＋ Lista de compras</button><button class="btn btn-outline" type="button" id="print-recipe">Imprimir receita</button><button class="btn btn-cream" type="button" id="detail-fav" data-fav="${safe(recipe.id)}" aria-pressed="${fav}">${heartIcon(fav)} Favoritar</button></div><p class="tiny muted" style="margin-top:14px">Fotos ilustrativas. Calorias estimadas por porção, sem acompanhamentos.</p></div></div></div></section><section class="container"><div class="prep-grid"><aside class="panel"><div class="panel-topline"><div><span class="eyebrow">Separe tudo</span><h2>Ingredientes</h2></div><div class="stepper" aria-label="Ajustar porções"><button id="minus-portions" type="button" aria-label="Diminuir porções">−</button><span id="stepper-count">${Number(recipe.servings) || 4} porções</span><button id="plus-portions" type="button" aria-label="Aumentar porções">+</button></div></div><ul class="ingredients-list" id="ingredient-list"></ul><p class="ingredients-note">Marque os ingredientes conforme separá-los. As quantidades se ajustam ao número de porções, mas o valor de kcal é sempre por porção.</p></aside><div class="method"><span class="eyebrow">${recipe.category==='cafe-da-manha'?'Na véspera':'Passo a passo'}</span><h2>Modo de preparo</h2><p class="method-intro">${recipe.category==='cafe-da-manha'?'Prepare e armazene com antecedência para simplificar sua manhã.':'Acompanhe as etapas do preparo. Quando for possível, antecipe alguns ingredientes.'}</p><ol class="instructions">${recipe.steps.map((step,i)=>`<li><span class="step-number">${String(i+1).padStart(2,'0')}</span><p>${safe(step)}</p></li>`).join('')}</ol><div class="serving-note"><span class="eyebrow">${recipe.category==='cafe-da-manha'?'Ao acordar':'Na hora de servir'}</span><h3>Pronto para servir</h3><p><strong>${safe(recipe.morning)}.</strong> ${safe(recipe.serve)}</p></div><div class="storage-row"><div class="storage-box"><span>Geladeira</span><strong>${safe(recipe.fridge.replace('*',''))}</strong></div><div class="storage-box"><span>Congelador</span><strong>${safe(recipe.freezer)}</strong></div></div><p class="nutrition-disclaimer">Conservação: mantenha os alimentos perecíveis refrigerados a até 4 °C. Para sobras cozidas, reaqueça até 74 °C no centro; o tempo real pode ser maior que o indicado. As kcal variam conforme ingredientes e marcas. ${recipe.id==='bagel-de-salmao-defumado'?'Mantenha o salmão e o pão separados até servir.':''}</p></div></div></section><section class="section related-section secondary-recipes"><div class="container"><div class="section-title-row"><div><span class="eyebrow">Continue explorando</span><h2>Outras ideias para você</h2></div><a class="link-arrow" href="arquivos/${safe(recipe.category)}/index.html">Todas as receitas ↗</a></div><div class="recipe-grid">${recipes.filter(r=>r.id!==recipe.id && r.category===recipe.category).slice(recipe.kcal % 11,recipe.kcal % 11+3).concat(recipes.filter(r=>r.id!==recipe.id && r.category===recipe.category)).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i).slice(0,3).map(recipeCard).join('')}</div></div></section>`;
      const ingredientsList=get('ingredient-list');
      const renderAmounts=()=>{get('portion-label').textContent=portions;get('stepper-count').textContent=portions+' '+(portions===1?'porção':'porções');ingredientsList.innerHTML=recipe.ingredients.map((it,i)=>`<li class="ingredient"><input type="checkbox" id="ingredient-${i}"><label for="ingredient-${i}">${safe(it.name)}</label><span class="qty">${fmt(it.amount*portions/(Number(recipe.servings)||4))} ${safe(it.unit)}</span></li>`).join('')};
      renderAmounts();
      get('minus-portions').addEventListener('click',()=>{portions=Math.max(1,portions-1);renderAmounts()});
      get('plus-portions').addEventListener('click',()=>{portions=Math.min(16,portions+1);renderAmounts()});
      get('add-shopping').addEventListener('click',()=>{const old=shopping.find(s=>s.id===recipe.id);if(old)old.portions=portions;else shopping.push({id:recipe.id,portions});persist('amesa_compras',shopping);updateBasket();openBasket()});
      get('print-recipe').addEventListener('click',()=>window.print());
    }
  }
  document.addEventListener('click',e=>{const fav=e.target.closest('[data-fav]');if(fav){e.preventDefault();toggleFavorite(fav.dataset.fav)}});
  // Carrinho local de ingredientes; receitas podem ser selecionadas em diferentes quantidades.
  function updateBasket(){const n=get('basket-count');if(n){n.textContent=shopping.length;n.hidden=shopping.length===0;}const modal=get('shopping-overlay');if(modal?.classList.contains('open'))renderBasket();}
  function renderBasket(){const body=get('shopping-body');if(!body)return;
    if(shopping.length===0){body.innerHTML='<div class="shopping-empty"><div class="big-emoji">🧺</div><h3>Sua lista começa aqui</h3><p>Abra uma receita e toque em <strong>Lista de compras</strong> para reunir todos os ingredientes.</p></div>';return}
    const ingredientMap=new Map();
    shopping.forEach(s=>{const r=recipes.find(x=>x.id===s.id);if(!r)return;r.ingredients.forEach(item=>{const key=item.name.toLocaleLowerCase('pt-BR')+'|'+item.unit;const current=ingredientMap.get(key)??{name:item.name,amount:0,unit:item.unit};current.amount+=item.amount*s.portions/(Number(r.servings)||4);ingredientMap.set(key,current);});});
    const arr=[...ingredientMap.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
    body.innerHTML=`<p class="small muted">Receitas selecionadas</p>${shopping.map(s=>{const r=recipes.find(x=>x.id===s.id);return r?`<div class="shopping-recipe"><span>${safe(r.title)} <small class="muted">(${s.portions} porções)</small></span><button type="button" data-remove-shopping="${safe(r.id)}">Remover</button></div>`:''}).join('')}<hr style="border:0;border-top:1px solid var(--border);margin:20px 0"><strong>${arr.length} ingredientes na lista</strong><ul class="shop-list">${arr.map((it,i)=>`<li><label><input type="checkbox"><span>${safe(it.name)}</span></label><strong>${fmt(it.amount)} ${safe(it.unit)}</strong></li>`).join('')}</ul><p class="small muted">Quantidades somadas automaticamente. Os itens marcados ficam riscados apenas durante esta visita.</p>`;
    body.querySelectorAll('[data-remove-shopping]').forEach(b=>b.addEventListener('click',()=>{shopping=shopping.filter(x=>x.id!==b.dataset.removeShopping);persist('amesa_compras',shopping);updateBasket()}));
  }
  function openBasket(){const el=get('shopping-overlay');if(!el)return;el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');renderBasket();get('close-shopping')?.focus();}
  function closeBasket(){const el=get('shopping-overlay');if(!el)return;el.classList.remove('open');el.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
  document.querySelectorAll('[data-open-shopping]').forEach(b=>b.addEventListener('click',openBasket));
  get('close-shopping')?.addEventListener('click',closeBasket);
  get('shopping-overlay')?.addEventListener('click',e=>{if(e.target.id==='shopping-overlay')closeBasket()});
  get('copy-shopping')?.addEventListener('click',async()=>{
    const map=new Map();shopping.forEach(s=>{const r=recipes.find(x=>x.id===s.id);if(!r)return;r.ingredients.forEach(it=>{const key=it.name.toLowerCase()+'|'+it.unit;const a=map.get(key)||{...it,amount:0};a.amount+=it.amount*s.portions/(Number(r.servings)||4);map.set(key,a)})});
    const str='LISTA DE COMPRAS — À MESA\n'+[...map.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).map(it=>`• ${it.name}: ${fmt(it.amount)} ${it.unit}`).join('\n');
    try{await navigator.clipboard.writeText(str);get('copy-shopping').textContent='✓ Lista copiada';setTimeout(()=>{const btn=get('copy-shopping');if(btn)btn.textContent='Copiar lista'},1800);}catch{window.prompt('Copie a lista abaixo:',str)}
  });
  get('menu-toggle')?.addEventListener('click',()=>{const el=get('mobile-nav');const show=el.classList.toggle('open');get('menu-toggle').setAttribute('aria-expanded',String(show));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeBasket();get('mobile-nav')?.classList.remove('open')}});
  updateBasket();
})();

/* ======================================================================
   ÁREA LIVRE — FUNCIONALIDADES FUTURAS (BUSCA, BOTÕES, FILTROS)
   O código principal acima já funciona. Use este espaço para novas ideias.
   ====================================================================== */
