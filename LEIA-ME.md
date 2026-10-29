# Site de Estatística — ODS 18 (Igualdade Étnico-Racial na Educação)

Site estático (HTML/CSS/JS) com a identidade visual do site de Hipérboles e o conteúdo do trabalho de Estatística.

## Como executar
Abra `index.html` no navegador (precisa de internet para carregar Plotly, KaTeX e as fontes via CDN).
Opcional: `python3 -m http.server 8000` nesta pasta e acesse http://localhost:8000.

## Estrutura
- `index.html` — conteúdo, uma seção por fase do trabalho (ver "Mapa do trabalho" no topo do site)
- `css/style.css` — design cherry do site de Hipérboles + componentes novos
- `js/data.js` — todos os dados (transcritos do relatório/pptx; nada estimado). Fonte: IBGE (2023; 2026)
- `js/charts.js` — gráficos Plotly e tabelas; `js/app.js` — navegação, PPDAC, painéis

## Direção de arte (paleta Fallen Angels)
Tons frios e escuros derivados da paleta Fallen Angels: fundo azul-petróleo escuro (a partir do Black Bean), vermelho tijolo `#C0504D` (Lava Red suavizado) para destaque e para "preta ou parda", verde-sálvia `#9DBF8A` (Lemon Lime suavizado) para números e "branca", e azul-acinzentado `#6C8C97` de apoio. Variáveis em `:root` de `css/style.css` e objeto `C` de `js/charts.js`.

## Gráficos
Donut do Censo 2022; linhas (analfabetismo 15+, 60+, ensino médio) com modos taxa / diferença / razão; barras agrupadas (anos de estudo, educação básica); barras empilhadas (jovens 18–24); barras agrupadas (abandono, condição 15–29); série com média ±1 DP; boxplots; barras de diferenças em p.p. Cada um tem "Ver dados do gráfico" e fonte.

## Limitações
- Nomes dos integrantes e tabela de participação: campos reservados para preencher.
- A fatia "demais (1,0%)" do Censo é o complemento até 100%.
- Diferenças e razões são derivadas dos dados publicados; quartis do boxplot pelo método do Plotly.
- Não há histograma nem dispersão: os dados (5 pontos por série) não comportam.
- Associação não implica causalidade.

## Fontes e créditos
Cada gráfico traz a linha "Fonte: gráfico elaborado com auxílio do Claude (Anthropic), com base em IBGE (ano)". A seção Referências lista as fontes em ABNT e traz uma nota de créditos. Nomes dos integrantes preenchidos; as tarefas de cada um ficam "a preencher".


## Modo apresentação (15 min, 6 apresentadores)
- Barra inferior com quem fala, cronômetro da parte e total (verde → amarelo → vermelho). Atalhos: → / ← passam de tela, T cronômetro, R roteiro, P esconde a barra, duplo clique no ▶ zera.
- Aviso "passa a vez" ao trocar de apresentador. Gráficos crescem e números contam ao entrar (desligado com redução de movimento).
- Preencha a data em `index.html` (`id="dataApresentacao"`).
- Divisão (14:30 + 30 s de margem): Pedro dos Santos 2:00 · Pedro Henrique 2:15 · Kauan 2:30 · Juliana 2:30 · Guilherme 2:45 · Daniel 2:30.
- Os tempos são estimativas: ensaiem com o cronômetro.
