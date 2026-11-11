# DESIGN DNA — SESI LEGO Team (site oficial FLL)

Guia de identidade visual do site. Use este arquivo como referência
para manter a coerência em qualquer edição futura.

Cada campo segue o formato **escolha + porquê + condição de refutação**.

---

## Identidade

- **Projeto:** Site oficial da SESI LEGO Team, equipe de robótica da Escola SESI Wilma Catão Araújo (Picos-PI) que compete na FIRST LEGO League 2026 (temporada BIOGLOW).
- **Brand Personality:** trabalhadora como colmeia / jovem e vibrante / científica de campo / engenheira de protótipo / orgulho do semiárido piauiense.
- **Audience:** juízes de FLL, comunidade escolar SESI, famílias, outras equipes de robótica. Valorizam autenticidade, processo documentado e trabalho em equipe; desconfiam de "enfeite sem substância".
- **Industry:** educação + robótica competitiva. Convenções do setor: sites de equipes FLL costumam ser páginas genéricas com foto de robô e listas de prêmios — o que este site quebra ao contar o processo real (protótipos, PID, visitas a apiário).
- **Positioning:** a equipe que trabalha como uma colmeia: função para cada integrante, decisões compartilhadas, e um projeto que nasceu do chão do semiárido (abelhas de Picos, a Capital do Mel).
- **Visual Keywords:** favo de mel (hexágono), preto e amarelo, Stud LEGO, caderno de engenharia, campo do semiárido, precisão de PID.
- **Referências:** banners oficiais da equipe (amarelo predominante, seções IDENTIFICAÇÃO/DESIGN/CRIAÇÃO/ITERAÇÃO/COMUNICAÇÃO), robô preto-amarelo, documentação do processo. Fatos de Picos: Capital do Mel.
- **Material de marca existente:** identidade preto + amarelo declarada no PDF ("Cores do projeto: preto e amarelo — identidade da equipe e referência às abelhas e à apicultura de Picos"). O logotipo circular com abelha existe apenas dentro das fotos dos banners (fundo escuro, sem versão isolada utilizável) — **PENDENTE: arquivo oficial do logo em alta resolução/fundo transparente**. Enquanto não houver arquivo, o site usa o wordmark tipográfico + marca hexagonal geométrica de abelha.
- **Elemento proprietário:** o favo hexagonal combinado com studs LEGO (círculos) como textura de assinatura; a dupla "abelha do semiárido + engenharia LEGO" não existe em nenhuma outra equipe.

## Typography

- **Heading font:** Archivo Black para display; Archivo 700 para H2/H3. Por quê: Archivo Black tem pegada de cartaz industrial que lembra caixas de LEGO e dá energia jovem sem virar cartoon; cobertura latin completa para PT-BR. Refutação: se testes de leitura em mobile mostrarem que o peso cansa em títulos longos, cair para Archivo 900.
- **Body font:** Archivo 400/500, 1rem/1.65. Por quê: uma família só mantém o site leve (menos downloads) e o contraste vem do peso, não de trocar de fonte. Refutação: se o corpo ficar denso demais em seções longas, trocar por uma humanista (ex. Work Sans).
- **Supporting font:** JetBrains Mono 400/700 para dados técnicos: portas de motores, variáveis do PID (Kp, Ki, Kd), números de missão, temperaturas (34-35 °C), 74,6 mL/dia. Por quê: o mono sinaliza "engenharia/código" e separa o dado do discurso. Uso só em dados e labels técnicos.
- **Type scale:** Display `clamp(2.6rem, 6vw + 1rem, 5rem)` lh 1.02; H2 `clamp(1.9rem, 3.2vw + 0.6rem, 2.8rem)` lh 1.1; H3 `1.35rem` lh 1.25; corpo `1rem` lh 1.65 máx 68ch; mono/dados `0.85rem`.
- **Letter spacing:** display -0.01em; corpo 0; labels mono uppercase 0.14em.
- **Hierarquia:** peso (900/700/400) + cor (amarelo só em destaque pontual) decidem hierarquia antes de tamanho.
- **PT-BR:** confirmado nas duas famílias (latin cobre acentos, ç, ão, õ). Fontes auto-hospedadas em `assets/fonts/`.

## Color

- **Primary:** Amarelo mel `#FFC400` — cor da equipe, referência à abelha e ao mel de Picos. Botões primários, destaques, bordas de evidência.
- **Secondary:** Preto quente `#171310` (fundo geral do site) — corpo do robô e da colmeia.
- **Accent:** Âmbar profundo `#F0A500` — usado APENAS em hover/gradiente sutil do amarelo; não cria segundo acento semântico.
- **Background:** `#171310` (tema único escuro, travado); superfícies `#221C15` e `#2A2219`.
- **Text:** `#F4EFE4` (off-white quente, contraste 13:1 sobre o fundo); muted `#B9AE99`.
- **Borders:** `rgba(244,239,228,0.14)`; hex-amarelo de evidência `#FFC400`.
- **Semantic:** success `#8DB600`, warning `#FFC400`, error `#E5484D` — AA verificado para texto sobre fundo escuro.
- **Por quê esta paleta:** nasce da identidade declarada da equipe (preto + amarelo = abelha de Picos); não segue paleta de segmento automática (foge do azul tech e do bege premium). O tema escuro único homenageia o corpo preto do robô e faz o amarelo estourar como mel. Refutação: se juízes relatarem dificuldade de leitura em telas claras de projetor, migrar para tema claro off-white com os mesmos amarelo/preto invertidos.

## Iconography

- **Família:** nenhuma biblioteca de ícones no site atual — os poucos glifos são SVG próprios (marca hexagonal da equipe). Se precisar de ícones futuros: Phosphor, stroke 1.5-2, escala 20/24/32.
- **Regras:** ícone só quando acelera leitura (sensores do robô, materiais do protótipo, redes sociais). Substitutos preferidos: número do dado em mono, foto real, hexágono de cor.
- **Banidos:** estrela, escudo, coração, lâmpada, foguete, sparkles, engrenagem decorativa, ícone-genérico-por-card.
- **Marca própria:** hexágono de favo + traços de abelha como glyph de seção (não é ícone de biblioteca, é a assinatura geométrica da marca).

## Imagery

- **Direção:** documental — registro real do processo (robô sobre piso de concreto, mãos segurando o robô, materiais do protótipo).
- **Assuntos:** robô (4 fotos), banners oficiais da equipe, protótipo em evolução (2 fotos). Sem stock, sem render inventado.
- **Tratamento:** arquivos otimizados em WebP q82, sem filtro global (fotos já coerentes entre si); frames em hexágono (assinatura) ou retângulo com borda fina.
- **Proporções:** hero 4:5 (foto do robô na mão), banners 4:3 nativo, galeria em colunas com ratios naturais.
- **Alt text:** descritivo, citando o que aparece (robô, hub SPIKE, rodas, materiais).
- **Evitar:** fotos genéricas de "crianças felizes em laboratório", ilustrações de abelhas de banco, qualquer imagem que não exista na pasta da equipe.

## Layout

- **Grid:** container fluido `max-width: 1160px`, breakpoints 480/768/1024.
- **Spacing rhythm:** seção `clamp(72px, 10vw, 120px)` de bloco; espaçamento interno 8/16/24/40/64.
- **Ritmo de seções (cada uma com família própria, sem repetição):**
  1. Hero — split assimétrico (tipo à esquerda, foto do robô em frame hexagonal à direita), fundo com padrão de favo sutil + faixa de números da temporada.
  2. Sobre a equipe — texto editorial + ficha da equipe; grid de membros em hexágonos.
  3. Projeto de Pesquisa — narrativa em linha do tempo vertical (problema → pesquisa → campo → especialistas → estratégias → solução → protótipo) com banner oficial ancorado no fim.
  4. Design do Robô — seção técnica: ficha em grid bento (specs em mono) + estratégia de missões + timeline de 5 versões + programação PID com o programa real (SVG) em visualizador rolável.
  5. Core Values — favo: células hexagonais com exemplo real dentro de cada.
  6. Galeria — colunas de fotos com lightbox.
  7. Agradecimentos + Contato — duas colunas; footer.
- **Alinhamento:** esquerda como regra; centralização só nas células do favo.
- **Estruturas proibidas:** hero centralizado com 2 CTAs + 3 cards iguais em sequência; zigzag infinito imagem/texto; tudo em card do mesmo tamanho.
- **Mobile:** cada família colapsa para fluxo vertical único preservando hierarquia (título → evidência → texto).

## Shape Language

- **Border radius:** hexágonos via `clip-path` (assinatura) + raio 14px em cards/fotos; botões pill (999px). Regra documentada: interativos pill, superfícies 14px, assinatura hex.
- **Borders:** 1px `rgba(244,239,228,0.14)`; borda amarela 2px só na evidência em destaque.
- **Shadows:** quase nenhuma; quando existir, tintada de âmbar sobre escuro (`rgba(255,196,0,0.08)`), nunca preto puro.
- **Textura de assinatura:** studs LEGO (círculos) e favos em SVG de fundo, opacidade < 0.05.

## Motion

- **Personalidade (1 frase):** "Movimento de colmeia: discreto, coordenado e útil — cada elemento entra no seu momento, sem alarde."
- **Durações:** micro 100ms; transição 220ms; momento grande 480ms.
- **Easing único:** `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Entrance:** reveal por IntersectionObserver (uma única vez), translateY 16px + fade — implementado em `assets/js/main.js`.
- **Hover:** botões translateY -1px + brilho do amarelo; fotos: borda amarela aparece; nav: sublinha animada.
- **Scroll:** só reveal; sem pin/scrub/parallax (conteúdo é leitura).
- **Microinterações:** indicador de seção ativa na nav (feedback), lightbox com fechar por Esc/clique.
- **prefers-reduced-motion:** tudo colapsa para estático; o JS revela tudo imediatamente.

## Components

- **Buttons:** primário amarelo `#FFC400` texto preto (AA 9.6:1), pill; secundário outline off-white. Um rótulo por intenção na página toda.
- **Cards:** usados só em membros, specs do robô e células do favo — nunca para listas de texto corrido.
- **Navigation:** fixa no topo, 64px, colapsa em menu mobile com botão hamburguer acessível (`aria-expanded`); âncoras com scroll suave (respeitando reduced-motion) e `scroll-margin-top`.
- **Badges:** chip mono para dados técnicos (porta, sensor, missão).
- **Formulários:** sem formulário (contato via e-mail/link institucional marcado como "A completar").
- **Estados:** lightbox com fechar por Esc/clique; foco visível global 2px amarelo.

## Anti-AI Rules do projeto

- **Padrões a evitar:** hero centralizado genérico; 3 cards iguais; estrela/escudo/lâmpada; Inter/Poppins/Roboto; gradiente roxo IA; scroll cues; labels de seção numerados.
- **Regras específicas:** nenhum fato inventado (tudo sai do DOCX/PDF/banners/programa); nomes ausentes viram marcador `[...]` com aviso "A completar" documentado; imagens só as reais da pasta; amarelo é o único acento; tema escuro único sem inversões de seção.
- **Teste "remove the logo":** sem o nome, o site ainda pertence a esta equipe — favos + studs, robô preto-amarelo real, projeto de sombreamento de colmeias no semiárido, nomes reais de Picos (Jonildo, Darcet, Embrapa) e o PID com Kp/Ki/Kd documentado. Nenhuma outra equipe teria essa combinação.
