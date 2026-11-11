/* ============================================================
   SESI LEGO Team — script principal
   ------------------------------------------------------------
   1. Menu de navegação (celular)
   2. Animações de entrada (reveal ao rolar)
   3. Destaque do link da seção ativa (scroll-spy)
   4. Lightbox da galeria
   5. Barra de progresso de leitura (fallback)
   6. Contadores da faixa de números
   7. View Transitions no lightbox
   8. Maquete do protótipo (apontamentos das partes)

   Tudo aqui é melhoria, não dependência: se este arquivo falhar,
   a página continua legível (o CSS só esconde os elementos
   .reveal quando a classe "js" existe no <html>).
   ============================================================ */
"use strict";

/* Marca que o JS está ativo. Sem JS, nada fica escondido. */
document.documentElement.classList.add("js");

var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Navegadores modernos fazem reveal e barra de progresso direto no
   CSS (animation-timeline). Detectamos o suporte para não duplicar
   o trabalho — um sistema ou outro, nunca os dois. */
var temViewTimeline = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()"));
var temScrollTimeline = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()"));

/* ------------------------------------------------------------
   1. Menu de navegação (celular)
   ------------------------------------------------------------ */
var botaoMenu = document.getElementById("navToggle");
var menu = document.getElementById("navMenu");

function definirMenu(aberto) {
  if (!botaoMenu || !menu) return;
  menu.classList.toggle("aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu de navegação" : "Abrir menu de navegação");
}

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", function () {
    definirMenu(!menu.classList.contains("aberto"));
  });

  /* Ao escolher um item do menu, ele fecha sozinho. */
  menu.addEventListener("click", function (evento) {
    if (evento.target.closest("a")) definirMenu(false);
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
   2. Animações de entrada (reveal ao rolar)
   Cada elemento .reveal aparece uma única vez, quando seu topo
   entra na tela (com uma folga de 8% na parte de baixo). A
   checagem acontece junto com a rolagem, no mesmo
   requestAnimationFrame do scroll-spy — assim nenhum elemento
   é "pulado" mesmo em rolagens muito rápidas.
   Com movimento reduzido, tudo aparece direto.
   ------------------------------------------------------------ */
var alvosReveal = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

function revelarAoRolar() {
  if (reduzirMovimento) return;
  var linhaDeCorte = window.innerHeight * 0.92;
  alvosReveal = alvosReveal.filter(function (el) {
    if (el.getBoundingClientRect().top < linhaDeCorte) {
      el.classList.add("visivel");
      return false; /* já revelado: sai da lista */
    }
    return true;
  });
}

if (reduzirMovimento) {
  alvosReveal.forEach(function (el) { el.classList.add("visivel"); });
} else if (!temViewTimeline) {
  /* O CSS (animation-timeline: view()) cuida do reveal quando há
     suporte; o JavaScript só entra como fallback. */
  revelarAoRolar(); /* o que já começou visível na carga */
  window.addEventListener("resize", revelarAoRolar);
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

function aoRolar() {
  marcarSecaoAtiva();
  /* Com suporte a animation-timeline no CSS, o reveal não passa
     pelo JavaScript — a animação roda por conta própria. */
  if (!temViewTimeline) revelarAoRolar();
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
  var duracao = 1100;
  var inicio = null;

  function passo(agora) {
    if (inicio === null) inicio = agora;
    var t = Math.min((agora - inicio) / duracao, 1);
    var suave = 1 - Math.pow(1 - t, 3); /* easeOutCubic */
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
      painelMq.innerHTML =
        '<p class="maquete-painel-num">Parte da maquete</p>' +
        "<h4>" + (forte ? forte.textContent : parte) + "</h4>" +
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
