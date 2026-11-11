/* ============================================================
   SESI LEGO Team — script principal
   ------------------------------------------------------------
   1. Menu de navegação (celular)
   2. Animações de entrada (reveal ao entrar na tela)
   3. Destaque do link da seção ativa (scroll-spy)
   4. Lightbox da galeria
   5. Barra de progresso de leitura (fallback)
   6. Contadores da faixa de números
   7. View Transitions no lightbox
   8. Maquete do protótipo (apontamentos das partes)
   9. Visualizador do programa (zoom e arraste)

   Tudo aqui é melhoria, não dependência: se este arquivo falhar,
   a página continua legível (o CSS só esconde os elementos
   .reveal quando a classe "js" existe no <html>).
   ============================================================ */
"use strict";

/* Marca que o JS está ativo. Sem JS, nada fica escondido. */
document.documentElement.classList.add("js");

var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Navegadores modernos fazem a barra de progresso direto no CSS
   (animation-timeline: scroll()). Detectamos o suporte para não
   duplicar o trabalho — a barra avança sozinha ou pelo fallback
   abaixo, nunca pelos dois. */
var temScrollTimeline = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()"));

/* ------------------------------------------------------------
   1. Menu de navegação (celular)
   ------------------------------------------------------------ */
var botaoMenu = document.getElementById("navToggle");
var menu = document.getElementById("navMenu");
var topbar = document.querySelector(".topbar");

function definirMenu(aberto) {
  if (!botaoMenu || !menu) return;
  menu.classList.toggle("aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu de navegação" : "Abrir menu de navegação");
  /* abrir o menu nunca pode acontecer com a topbar recolhida */
  if (aberto && topbar) topbar.classList.remove("recolhida");
}

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", function () {
    definirMenu(!menu.classList.contains("aberto"));
  });

  /* Ao escolher um item do menu, ele fecha sozinho. */
  menu.addEventListener("click", function (evento) {
    if (evento.target.closest("a")) definirMenu(false);
  });

  /* Tocar fora do painel também fecha (o menu é um dropdown,
     não um modal: não trava a rolagem do fundo). */
  document.addEventListener("click", function (evento) {
    if (!menu.classList.contains("aberto")) return;
    if (menu.contains(evento.target) || botaoMenu.contains(evento.target)) return;
    definirMenu(false);
  });

  /* Ao voltar para o layout desktop, o estado "aberto" não faz
     sentido — evita reabrir o menu ao reduzir a janela de novo. */
  var redimensionouMenu = false;
  window.addEventListener("resize", function () {
    if (redimensionouMenu) return;
    redimensionouMenu = true;
    requestAnimationFrame(function () {
      redimensionouMenu = false;
      if (window.innerWidth > 920 && menu.classList.contains("aberto")) definirMenu(false);
    });
  });

  /* Esc também fecha (útil quando o foco está no botão). */
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && menu.classList.contains("aberto")) {
      definirMenu(false);
      botaoMenu.focus();
    }
  });
}

/* ------------------------------------------------------------
   2. Animações de entrada (reveal ao entrar na tela)
   Cada elemento .reveal aparece uma única vez, com um fade curto
   de opacidade, quando entra na viewport. O disparo é feito pelo
   IntersectionObserver — nada roda a cada frame de rolagem, e é
   isso que mantém a navegação fluida mesmo em celulares fracos.
   Com movimento reduzido (ou sem suporte a observer), tudo
   aparece direto, sem esconder nada.
   ------------------------------------------------------------ */
var alvosReveal = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

/* Cascata curta nas grades: cada item recebe um atraso de 65ms
   (limitado a 7 posições) para a colmeia se montar de leve, em
   vez de tudo surgir de uma vez. O atraso é uma variável CSS —
   não mexe no HTML e desaparece quando o reveal termina. */
var gruposReveal = document.querySelectorAll(
  ".numeros-grid, .membros, .bento, .favo-valores, .galeria, " +
  ".solucao-elementos, .especialistas, .cotejo, .iteracoes"
);
Array.prototype.forEach.call(gruposReveal, function (grupo) {
  Array.prototype.forEach.call(grupo.children, function (filho, indice) {
    if (!filho.classList.contains("reveal")) return;
    filho.style.setProperty("--rv-delay", Math.min(indice, 7) * 65 + "ms");
  });
});

if (reduzirMovimento || !("IntersectionObserver" in window)) {
  alvosReveal.forEach(function (el) { el.classList.add("visivel"); });
} else {
  var observadorReveal = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visivel");
        observadorReveal.unobserve(entrada.target); /* revela só uma vez */
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  alvosReveal.forEach(function (el) { observadorReveal.observe(el); });

  /* Rede de segurança: quando a rolagem para (scrollend) ou quando
     se pula direto por uma âncora, varre o que ainda não apareceu e
     revela tudo que já esteja em tela ou acima dela. Custa uma
     única leitura agrupada, só quando o scroll termina — e garante
     que nenhum conteúdo fique escondido se o observer perder algum
     elemento numa rolagem muito rápida. */
  function varreduraDeSeguranca() {
    if (reduzirMovimento) return;
    var altura = window.innerHeight;
    /* Lê tudo primeiro, escreve depois: alternar leitura de
       layout com escrita de classe forçaria um reflow por
       elemento (layout thrash). */
    var aRevelar = [];
    alvosReveal = alvosReveal.filter(function (el) {
      if (el.classList.contains("visivel")) return false;
      if (el.getBoundingClientRect().top < altura) {
        aRevelar.push(el);
        return false;
      }
      return true;
    });
    aRevelar.forEach(function (el) { el.classList.add("visivel"); });
  }
  window.addEventListener("scrollend", varreduraDeSeguranca);
  window.addEventListener("hashchange", varreduraDeSeguranca);
}

/* ------------------------------------------------------------
   3. Destaque do link da seção ativa (scroll-spy)
   Marca com aria-current o link da seção que está na tela,
   para o usuário saber onde está no site.
   ------------------------------------------------------------ */
var linksNav = Array.prototype.slice.call(document.querySelectorAll(".nav-menu a"));
var secoesNav = linksNav
  .map(function (link) { return document.getElementById((link.getAttribute("href") || "").slice(1)); })
  .filter(Boolean);

function marcarSecaoAtiva() {
  if (!secoesNav.length) return;

  /* Linha de referência no meio da tela: a seção ativa é a última
     cujo topo já passou por ela. Assim, ao chegar numa seção pela
     âncora do menu (que deixa o topo ~78px abaixo do cabeçalho),
     ela já é marcada como ativa. */
  var referencia = window.scrollY + window.innerHeight * 0.4;
  var atual = secoesNav[0];
  secoesNav.forEach(function (secao) {
    if (secao.offsetTop <= referencia) atual = secao;
  });

  /* No fim da página, garante a última seção. */
  var noFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (noFim) atual = secoesNav[secoesNav.length - 1];

  linksNav.forEach(function (link) {
    if (link.getAttribute("href") === "#" + atual.id) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* ------------------------------------------------------------
   4. Topbar: estado ao rolar e auto-hide
   Ao sair do topo, a barra ganha corpo. Ao descer depois do
   hero, ela recolhe para liberar leitura no celular; volta ao
   subir, ao abrir o menu ou quando recebe foco pelo teclado.
   Só alterna classes — o movimento fica no CSS.
   ------------------------------------------------------------ */
var ultimaRolagemY = window.scrollY;
var ancoraEmCurso = false;

function atualizarTopbar() {
  if (!topbar) return;
  var y = window.scrollY;
  var descendo = y > ultimaRolagemY;
  var subindo = y < ultimaRolagemY;
  var menuAberto = !!(menu && menu.classList.contains("aberto"));

  topbar.classList.toggle("rolada", y > 24);

  if (reduzirMovimento || menuAberto || ancoraEmCurso) {
    topbar.classList.remove("recolhida");
  } else if (y > 420 && descendo) {
    topbar.classList.add("recolhida");
  } else if (subindo || y <= 420) {
    topbar.classList.remove("recolhida");
  }

  ultimaRolagemY = y;
}

if (topbar) {
  topbar.addEventListener("focusin", function () {
    topbar.classList.remove("recolhida");
  });

  /* Navegar por âncora é uma ação do usuário: a topbar acompanha
     a rolagem até o destino, em vez de sumir no meio do caminho. */
  document.addEventListener("click", function (evento) {
    var link = evento.target.closest ? evento.target.closest('a[href^="#"]') : null;
    if (!link) return;
    ancoraEmCurso = true;
    topbar.classList.remove("recolhida");
  });
}

function aoRolar() {
  marcarSecaoAtiva();
  atualizarTopbar();
  atualizarProgresso();
}

var rolagemAgendada = false;
window.addEventListener(
  "scroll",
  function () {
    if (rolagemAgendada) return;
    rolagemAgendada = true;
    requestAnimationFrame(function () {
      aoRolar();
      rolagemAgendada = false;
    });
  },
  { passive: true }
);
/* Fim da rolagem com inércia e navegação por âncora (#hash). */
window.addEventListener("scrollend", aoRolar);
window.addEventListener("scrollend", function () { ancoraEmCurso = false; });
window.addEventListener("hashchange", aoRolar);
window.addEventListener("resize", aoRolar);
aoRolar();

/* ------------------------------------------------------------
   5. Barra de progresso de leitura (fallback do CSS)
   Quando o navegador não tem animation-timeline: scroll(),
   esta função move a barra manualmente, no mesmo rAF da
   rolagem. Com suporte no CSS, ela não faz nada.
   ------------------------------------------------------------ */
var barraProgresso = document.querySelector(".progresso-leitura");

function atualizarProgresso() {
  if (temScrollTimeline || !barraProgresso) return;
  var maximo = document.documentElement.scrollHeight - window.innerHeight;
  var fracao = maximo > 0 ? window.scrollY / maximo : 0;
  barraProgresso.style.transform = "scaleX(" + Math.min(Math.max(fracao, 0), 1) + ")";
}

/* Caso a página abra já rolada (restauração do navegador). */
atualizarProgresso();

/* ------------------------------------------------------------
   6. Contadores da faixa de números
   Os valores finais já estão no HTML (bom para sem JS / leitores
   de tela); a animação só percorre de 0 até o valor quando o
   número entra na tela, uma única vez.
   ------------------------------------------------------------ */
var alvosContador = Array.prototype.slice.call(document.querySelectorAll("[data-contador]"));

function animarContador(el) {
  var fim = parseInt(el.getAttribute("data-contador"), 10);
  if (!isFinite(fim) || fim <= 0) return;
  var duracao = 1500;
  var inicio = null;

  function passo(agora) {
    if (inicio === null) inicio = agora;
    var t = Math.min((agora - inicio) / duracao, 1);
    var suave = 1 - Math.pow(1 - t, 4); /* easeOutQuart */
    el.textContent = Math.round(fim * suave);
    if (t < 1) requestAnimationFrame(passo);
    else el.textContent = fim; /* valor exato no fim */
  }
  requestAnimationFrame(passo);
}

if ("IntersectionObserver" in window && alvosContador.length && !reduzirMovimento) {
  var observadorContador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        observadorContador.unobserve(entrada.target); /* anima só uma vez */
        animarContador(entrada.target);
      });
    },
    { threshold: 0.4 }
  );
  alvosContador.forEach(function (el) { observadorContador.observe(el); });
}

/* ------------------------------------------------------------
   7. Lightbox da galeria
   Abre a foto grande num <dialog> modal. Esc e clique no
   fundo escuro fecham (o Esc do dialog é nativo do navegador).
   ------------------------------------------------------------ */
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImg");
var lightboxCap = document.getElementById("lightboxCap");
var botaoFechar = document.getElementById("lightboxFechar");

function abrirLightbox(link) {
  if (!lightbox || typeof lightbox.showModal !== "function") return;

  var mini = link.querySelector("img");
  lightboxImg.src = link.getAttribute("href");
  /* Mantém o texto alternativo descritivo da foto ampliada. */
  lightboxImg.alt = mini ? mini.getAttribute("alt") || "" : "";
  lightboxCap.textContent = link.getAttribute("data-legenda") || "";

  var abrir = function () {
    /* View Transitions API: transição suave de abrir/fechar nos
       navegadores que suportam; nos demais, abre direto. */
    if (document.startViewTransition && !reduzirMovimento) {
      document.startViewTransition(function () { lightbox.showModal(); });
    } else {
      lightbox.showModal();
    }
  };

  /* Espera a foto decodificar antes de abrir: o diálogo surge já
     no tamanho final, sempre centrado — não depende de o
     navegador re-centralizar depois que a imagem carrega. */
  if (typeof lightboxImg.decode === "function") {
    lightboxImg.decode().then(abrir, abrir);
  } else {
    abrir();
  }
}

function fecharLightbox() {
  if (!lightbox) return;
  if (document.startViewTransition && !reduzirMovimento) {
    document.startViewTransition(function () { lightbox.close(); });
  } else {
    lightbox.close();
  }
}

document.querySelectorAll(".lightbox-link").forEach(function (link) {
  link.addEventListener("click", function (evento) {
    evento.preventDefault();
    abrirLightbox(link);
  });
});

if (botaoFechar && lightbox) {
  botaoFechar.addEventListener("click", function () { fecharLightbox(); });

  /* Clique fora da figura (no fundo escuro) também fecha. */
  lightbox.addEventListener("click", function (evento) {
    if (evento.target === lightbox) fecharLightbox();
  });
}

/* ------------------------------------------------------------
   8. Maquete do protótipo (apontamentos)
   Foto plana + marcadores numerados: escolher uma parte (marcador
   ou lista) escurece a foto, acende o recorte daquela parte e o
   painel mostra o papel dela segundo a pesquisa. Sem este script,
   a foto e a lista continuam lá, legíveis.
   ------------------------------------------------------------ */
var palcoMq = document.getElementById("maquetePalco");
var painelMq = document.getElementById("maquetePainel");

if (palcoMq && painelMq) {
  var parteAtiva = null;

  var recortesMq = Array.prototype.slice.call(palcoMq.querySelectorAll(".maquete-recorte"));
  var pinosMq = Array.prototype.slice.call(palcoMq.querySelectorAll(".maquete-pino"));
  var itensMq = Array.prototype.slice.call(document.querySelectorAll(".maquete-parte"));
  var dicaMq = painelMq.querySelector(".maquete-painel-hint");
  var htmlDica = dicaMq ? dicaMq.innerHTML : "";

  function selecionarParte(parte, item) {
    if (parteAtiva === parte) parte = null; /* clicar de novo desliga */

    recortesMq.forEach(function (r) { r.classList.toggle("destaque", !!parte && r.getAttribute("data-parte") === parte); });
    pinosMq.forEach(function (p) {
      var ligado = !!parte && p.getAttribute("data-parte") === parte;
      p.classList.toggle("destaque", ligado);
      p.setAttribute("aria-pressed", ligado ? "true" : "false");
    });
    itensMq.forEach(function (li) { li.classList.toggle("ativa", !!parte && li.getAttribute("data-parte") === parte); });
    if (parte) {
      palcoMq.setAttribute("data-ativa", parte);
      /* conteúdo vem do item da lista (fonte única, visível sem JS) */
      var forte = item.querySelector("strong");
      var texto = item.querySelector(".maquete-parte-texto");
      var num = item.querySelector(".maquete-parte-num");
      painelMq.innerHTML =
        '<div class="maquete-painel-cabeca">' +
          '<span class="maquete-painel-hex" aria-hidden="true">' +
            (num ? num.textContent : "") +
          "</span>" +
          "<h4>" + (forte ? forte.textContent : parte) + "</h4>" +
        "</div>" +
        "<p>" + (texto ? texto.textContent : "") + "</p>";
    } else {
      palcoMq.removeAttribute("data-ativa");
      painelMq.innerHTML = '<p class="maquete-painel-hint">' + htmlDica + "</p>";
    }
    parteAtiva = parte;
  }

  pinosMq.forEach(function (pino) {
    pino.addEventListener("click", function () {
      var parte = pino.getAttribute("data-parte");
      var item = itensMq.filter(function (li) { return li.getAttribute("data-parte") === parte; })[0];
      if (item) selecionarParte(parte, item);
    });
  });
  itensMq.forEach(function (li) {
    var btn = li.querySelector(".maquete-parte-btn");
    if (btn) btn.addEventListener("click", function () {
      selecionarParte(li.getAttribute("data-parte"), li);
      /* no celular o painel fica acima da lista: garante que apareça */
      painelMq.scrollIntoView({ block: "nearest", behavior: reduzirMovimento ? "auto" : "smooth" });
    });
  });
}

/* ------------------------------------------------------------
   9. Visualizador do programa (zoom e arraste)
   O programa em Word Blocks é uma imagem muito larga. Aqui,
   100% significa "ajustada à largura do quadro" (visão geral
   do programa inteiro). Os botões + e − dobram e dividem o
   zoom; a pinça com dois dedos e o Ctrl + roda do mouse
   ajustam continuamente; arrastar com o mouse percorre os
   blocos. O zoom troca a largura real da imagem — e não um
   transform: scale — para o SVG se redesenhar nítido em
   qualquer nível. Sem este script, o visualizador segue como
   imagem completa com rolagem; só a barra some (CSS cuida).
   ------------------------------------------------------------ */
var palcoCode = document.getElementById("codeViewer");
var imgCode = palcoCode ? palcoCode.querySelector("img") : null;
var btnZoomMenos = document.getElementById("codeZoomMenos");
var btnZoomMais = document.getElementById("codeZoomMais");
var btnZoomNivel = document.getElementById("codeZoomNivel");

if (palcoCode && imgCode && btnZoomMenos && btnZoomMais && btnZoomNivel) {
  var ZOOM_MIN_CODE = 1;   /* 100%: ajustada à largura do quadro */
  var ZOOM_MAX_CODE = 16;  /* 1600%: blocos legíveis até no celular */
  var zoomCode = 1;

  /* Aplica o nível de zoom mantendo a âncora — cursor ou centro
     do gesto — sobre o mesmo ponto do programa. */
  function aplicarZoomCode(novo, ancoraX, ancoraY) {
    novo = Math.min(ZOOM_MAX_CODE, Math.max(ZOOM_MIN_CODE, novo));
    if (novo === zoomCode) return;

    var rectAntigo = imgCode.getBoundingClientRect();
    /* ponto do conteúdo sob a âncora, como fração da imagem */
    var fracaoX = (palcoCode.scrollLeft + ancoraX) / rectAntigo.width;
    var fracaoY = (palcoCode.scrollTop + ancoraY) / rectAntigo.height;

    zoomCode = novo;
    imgCode.style.width = Math.round(palcoCode.clientWidth * zoomCode) + "px";
    btnZoomNivel.textContent = Math.round(zoomCode * 100) + "%";

    /* devolve a âncora ao mesmo ponto do conteúdo */
    var rectNovo = imgCode.getBoundingClientRect();
    palcoCode.scrollLeft = fracaoX * rectNovo.width - ancoraX;
    palcoCode.scrollTop = fracaoY * rectNovo.height - ancoraY;
  }

  /* botões: zoom centrado no meio do quadro */
  function zoomBotaoCode(fator) {
    aplicarZoomCode(zoomCode * fator, palcoCode.clientWidth / 2, palcoCode.clientHeight / 2);
  }
  btnZoomMais.addEventListener("click", function () { zoomBotaoCode(2); });
  btnZoomMenos.addEventListener("click", function () { zoomBotaoCode(0.5); });
  /* clicar na porcentagem reajusta o programa ao quadro */
  btnZoomNivel.addEventListener("click", function () { zoomBotaoCode(1 / zoomCode); });

  /* Ctrl + roda do mouse (e pinça do trackpad): zoom no cursor */
  palcoCode.addEventListener("wheel", function (evento) {
    if (!evento.ctrlKey) return;
    evento.preventDefault();
    var rect = palcoCode.getBoundingClientRect();
    var fator = evento.deltaY < 0 ? 1.25 : 0.8;
    aplicarZoomCode(zoomCode * fator, evento.clientX - rect.left, evento.clientY - rect.top);
  }, { passive: false });

  /* arraste com o mouse: percorre o programa segurando o botão */
  var arrasteCode = null;
  palcoCode.addEventListener("pointerdown", function (evento) {
    if (evento.pointerType !== "mouse" || evento.button !== 0) return;
    arrasteCode = {
      x: evento.clientX, y: evento.clientY,
      esq: palcoCode.scrollLeft, topo: palcoCode.scrollTop
    };
    palcoCode.classList.add("arrastando");
    try { palcoCode.setPointerCapture(evento.pointerId); } catch (e) { /* sem captura, segue valendo */ }
  });
  palcoCode.addEventListener("pointermove", function (evento) {
    if (!arrasteCode) return;
    palcoCode.scrollLeft = arrasteCode.esq - (evento.clientX - arrasteCode.x);
    palcoCode.scrollTop = arrasteCode.topo - (evento.clientY - arrasteCode.y);
  });
  function soltarArrasteCode() {
    if (!arrasteCode) return;
    arrasteCode = null;
    palcoCode.classList.remove("arrastando");
  }
  palcoCode.addEventListener("pointerup", soltarArrasteCode);
  palcoCode.addEventListener("pointercancel", soltarArrasteCode);
  palcoCode.addEventListener("lostpointercapture", soltarArrasteCode);

  /* pinça com dois dedos: zoom contínuo ancorado no meio do gesto */
  var pincaCode = null;
  palcoCode.addEventListener("touchstart", function (evento) {
    if (evento.touches.length !== 2) return;
    var t1 = evento.touches[0], t2 = evento.touches[1];
    var rect = palcoCode.getBoundingClientRect();
    pincaCode = {
      dist: Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2)) || 1,
      zoom: zoomCode,
      x: (t1.clientX + t2.clientX) / 2 - rect.left,
      y: (t1.clientY + t2.clientY) / 2 - rect.top
    };
    evento.preventDefault(); /* a pinça aqui é do programa, não da página */
  }, { passive: false });
  palcoCode.addEventListener("touchmove", function (evento) {
    if (!pincaCode || evento.touches.length !== 2) return;
    evento.preventDefault();
    var t1 = evento.touches[0], t2 = evento.touches[1];
    var dist = Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2)) || 1;
    aplicarZoomCode(pincaCode.zoom * (dist / pincaCode.dist), pincaCode.x, pincaCode.y);
  }, { passive: false });
  function fimPincaCode() { pincaCode = null; }
  palcoCode.addEventListener("touchend", fimPincaCode);
  palcoCode.addEventListener("touchcancel", fimPincaCode);

  /* rotação / redimensionamento: mantém o nível e a posição
     relativa dentro do programa */
  var redimCodeAgendado = false;
  window.addEventListener("resize", function () {
    if (redimCodeAgendado) return;
    redimCodeAgendado = true;
    requestAnimationFrame(function () {
      redimCodeAgendado = false;
      var maxAntigoX = palcoCode.scrollWidth - palcoCode.clientWidth;
      var maxAntigoY = palcoCode.scrollHeight - palcoCode.clientHeight;
      var fx = maxAntigoX > 0 ? palcoCode.scrollLeft / maxAntigoX : 0;
      var fy = maxAntigoY > 0 ? palcoCode.scrollTop / maxAntigoY : 0;
      imgCode.style.width = Math.round(palcoCode.clientWidth * zoomCode) + "px";
      palcoCode.scrollLeft = fx * (palcoCode.scrollWidth - palcoCode.clientWidth);
      palcoCode.scrollTop = fy * (palcoCode.scrollHeight - palcoCode.clientHeight);
    });
  });

  /* estado inicial: programa ajustado à largura do quadro (100%).
     Com os controles ativos, o aria-label descreve os gestos de zoom. */
  palcoCode.setAttribute("aria-label",
    "Programa do robô em Word Blocks. Amplie com os botões ou com dois dedos e arraste para percorrer os blocos.");
  imgCode.style.width = palcoCode.clientWidth + "px";
}
