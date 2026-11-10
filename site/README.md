# Site oficial da SESI LEGO Team

Site de página única (HTML + CSS + JS puros, sem dependências para instalar)
da equipe de robótica da **Escola SESI Wilma Catão Araújo**, Picos-PI, para a
**FIRST LEGO League 2026**.

Todo o conteúdo veio dos documentos oficiais da equipe (pasta
`material de apoio/` do projeto): diário de bordo, banners da temporada,
fotos e emblema. Nada foi inventado — o que faltava ficou marcado com `[...]`
e um aviso amarelo "A completar".

## O que tem no site

- **Hero** com foto do robô em moldura hexagonal e entrada animada.
- **Números da temporada** (contadores que animam ao entrar na tela).
- **Equipe**: 5 competidores + comissão técnica e mentoria, com fotos em
  molduras hexagonais amarelas.
- **Projeto de pesquisa**: problema → foco ("seca verde" na Caatinga) →
  pesquisa → trabalho de campo (apiário) → especialistas → solução.
- **Robô**: ficha técnica, estratégia de missões (ordem real executada
  pela equipe), as cinco versões e a programação PID (SVG do programa).
- **Diário de bordo**: os 15 dias de trabalho em linha do tempo, com
  datas, fotos e tags por frente (projeto / robô / desempenho).
- **Core Values** em favo de hexágonos, **galeria** de fotos com
  lightbox e **contato/agradecimentos**.

O emblema oficial da equipe (abelha) é o logo do site: aparece no menu,
no rodapé, no favicon e na imagem de compartilhamento (OG).

## Como ver o site no seu computador

**Jeito mais simples:** dê dois cliques em `index.html` — abre no navegador.

**Jeito recomendado (imita o servidor real):** com o Python instalado, rode
isto numa janela de comando dentro da pasta `site`:

```
python -m http.server 8000
```

E acesse `http://localhost:8000` no navegador.

## Como editar o conteúdo

1. **Textos, seções e fotos** → tudo está em `index.html`. Procure pelos
   comentários `EDITAR:` — eles marcam exatamente onde mexer (e-mail,
   redes sociais, patrocinadores).
2. **Cores, fontes e espaçamentos** → `assets/css/style.css`. As decisões
   de identidade visual estão documentadas em `DESIGN_DNA.md`.
3. **Fotos dos integrantes** → `assets/img/equipe/` (uma WebP por pessoa,
   com o nome do arquivo referenciado no HTML).
4. **Fotos grandes e miniaturas** → `assets/img/` (versão grande, usada
   no clique do lightbox) e `assets/img/galeria/` (versão pequena). Para
   trocar uma foto, substitua o arquivo nas duas pastas mantendo o mesmo
   nome. Os arquivos são WebP (mais leves que JPEG); um conversor online
   qualquer pode gerar WebP.
5. **Números da faixa de contadores** → no HTML, cada número tem um
   atributo `data-contador` com o valor final (o texto dentro é o valor
   de segurança, mostrado sem JavaScript).
6. **Nenhum passo de build é necessário** — salve o arquivo e recarregue
   o navegador.

## Animações e acessibilidade

As animações são "aprimoramentos progressivos": o site funciona
perfeitamente sem JavaScript, sem CSS novo ou em navegadores antigos.

- **Reveal ao rolar**: dirigido pelo scroll quando o navegador suporta
  (`animation-timeline: view()`); senão, um observador em JavaScript
  assume. Nunca os dois ao mesmo tempo.
- **Barra de progresso de leitura** no topo: nativa em navegadores
  modernos, com fallback em JavaScript.
- **Contadores**: animam uma única vez, ao entrar na tela.
- **Lightbox**: usa a View Transitions API quando disponível.
- **`prefers-reduced-motion`**: quem pede menos movimento na configuração
  do sistema recebe tudo estático e visível — sem animação nenhuma.
- **Testado** de 375px a 1920px, com e sem JavaScript, e com movimento
  reduzido ativado.

## Estrutura

```
site/
├── index.html          ← todo o conteúdo (nav, hero, equipe, projeto,
│                          robô, diário, valores, galeria, contato, rodapé)
├── DESIGN_DNA.md       ← guia da identidade visual (cores, tipografia, motion)
├── README.md
└── assets/
    ├── css/style.css   ← todo o estilo (design tokens no topo)
    ├── js/main.js      ← menu mobile, reveals, contadores, lightbox,
    │                      barra de progresso (todos com fallback)
    ├── fonts/          ← Archivo, Archivo Black e JetBrains Mono (woff2)
    └── img/
        ├── emblema.png, favicon.png, og-image.png   ← marca oficial
        ├── equipe/     ← fotos dos 8 integrantes (WebP)
        ├── galeria/    ← miniaturas da galeria (WebP)
        └──             ← fotos grandes, banners HD da temporada,
                           programa PID (SVG)
```

## Como publicar

O site é estático: qualquer hospedagem gratuita serve.

**GitHub Pages (recomendado)**
1. Crie um repositório (ex. `sesi-lego-team`) no github.com.
2. Faça upload do conteúdo desta pasta `site` (index.html na raiz do repo).
3. Em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.
4. O site sai no ar em `https://<usuário>.github.io/sesi-lego-team/`.
5. Depois edite a tag `<link rel="canonical">` no `index.html` com a URL
   final (e os endereços do JSON-LD no `<head>`, se quiser os dados
   estruturados completos).

**Netlify** — acesse app.netlify.com, arraste a pasta `site` para a área de
deploy e pronto; o endereço `*.netlify.app` pode ser trocado por um domínio.

**Vercel** — em vercel.com, "Add New Project" e importe a pasta/repositório.

## A completar (não constavam no material enviado)

- E-mail e redes sociais oficiais da equipe (procure `EDITAR:` no HTML).
- Patrocinadores e apoiadores.
- Confirmar o nome da temporada: os banners indicam **BIOGLOW**, mas o
  material de pesquisa menciona "BioGum". Ajuste em um lugar só, no hero.
- URL canônica após publicar (item 5 do "Como publicar").
