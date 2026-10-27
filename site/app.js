// Tela do guia: desenha o estado e repassa cliques para a jornada.
// Nenhuma regra mora aqui; se for preciso perguntar "isso pode?", a resposta está em jornada.js.

import { PASSOS, PLANOS, SKILLS, AREAS, PROBLEMAS, MENUS, URL_CLAUDE, MARKETPLACE } from "./conteudo.js";
import {
  estadoInicial,
  escolherPlano,
  escolherIdioma,
  concluirPasso,
  desfazerPasso,
  passoLiberado,
  planoAceitaPlugins,
  progresso,
  estadoValido,
} from "./jornada.js";
import { carregarProgresso, salvarProgresso, apagarProgresso } from "./armazenamento.js";

const salvo = carregarProgresso();
let estado = estadoValido(salvo) ? salvo : estadoInicial();

const raiz = document.getElementById("passos-area");
const trilha = document.getElementById("indice-passos");
const contador = document.getElementById("contador");
const opcoesIdioma = document.getElementById("idioma-opcoes");
const ajuda = document.getElementById("ajuda-area");
// Quantos passos estavam feitos no último desenho: só o ✱ recém-preenchido ganha o carimbo.
let feitosAntes = progresso(estado).feitos;

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// Textos do conteúdo podem ser fixos ou depender dos nomes de menu do idioma escolhido.
function texto(valor, menus) {
  return typeof valor === "function" ? valor(menus) : valor;
}

function situacaoDoPasso(passoId) {
  if (estado.concluidos.includes(passoId)) return "feito";
  return passoLiberado(estado, passoId) ? "atual" : "bloqueado";
}

const asterisco = '<svg aria-hidden="true"><use href="#asterisco"/></svg>';

function blocoCopiar(conteudo, { endereco = false } = {}) {
  return `
    <div class="copiar${endereco ? " copiar-endereco" : ""}">
      <code>${escapar(conteudo)}</code>
      <button type="button" class="botao botao-copiar" data-copiar="${escapar(conteudo)}">Copiar</button>
    </div>`;
}

// Negrito nos nomes de menu: o conteúdo marca com **assim**, depois de escapado.
function comNegrito(conteudo) {
  return escapar(conteudo).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function figuraDoPrint(imagem, idioma) {
  const legenda = idioma === "pt" ? "Tela real do Claude" : "Tela real do Claude (em português)";
  return `
    <figure class="print">
      <a href="${imagem.arquivo}" target="_blank" rel="noopener" title="Abrir a imagem em tamanho grande">
        <img src="${imagem.arquivo}" alt="${escapar(imagem.alt)}" loading="lazy">
      </a>
      <figcaption>${legenda}</figcaption>
    </figure>`;
}

function listaDeAcoes(acoes, menus, idioma) {
  const itens = acoes.map(
    (a) => `
      <li class="acao">
        <p>${comNegrito(texto(a.texto, menus))}</p>
        ${a.copiar ? blocoCopiar(a.copiar, { endereco: a.copiar === MARKETPLACE }) : ""}
        ${a.imagem ? figuraDoPrint(a.imagem, idioma) : ""}
      </li>`
  ).join("");
  return `<ol class="acoes-lista">${itens}</ol>`;
}

function corpoDoPlano() {
  const opcoes = PLANOS.map(
    (p) => `<button type="button" class="opcao ${estado.plano === p.id ? "opcao-escolhida" : ""}" data-plano="${p.id}" aria-pressed="${estado.plano === p.id}">${escapar(p.nome)}</button>`
  ).join("");
  const bloqueio =
    estado.plano && !planoAceitaPlugins(estado.plano)
      ? `<p class="alerta"><strong>No plano Free não há plugins.</strong> O Sistema de Donos precisa de um plano pago: Pro, Max, Team ou Enterprise.</p>`
      : "";
  return `<div class="opcoes">${opcoes}</div>${bloqueio}`;
}

function corpoDoPasso(passo, menus) {
  if (passo.id === "plano") return `<p class="intro">${escapar(passo.intro)}</p>${corpoDoPlano()}`;
  const dica = passo.dicaPorPlano?.[estado.plano];
  const abreClaude = ["execucao", "catalogo", "testar"].includes(passo.id);
  return `
    ${passo.intro ? `<p class="intro">${escapar(passo.intro)}</p>` : ""}
    ${dica ? `<p class="nota">${escapar(dica)}</p>` : ""}
    ${abreClaude ? `<p><a class="botao botao-secundario" href="${URL_CLAUDE}" target="_blank" rel="noopener">Abrir o Claude numa nova aba ↗</a></p>` : ""}
    ${listaDeAcoes(passo.acoes, menus, estado.idioma)}
    ${passo.aviso ? `<p class="nota">${escapar(texto(passo.aviso, menus))}</p>` : ""}
    <div class="acoes">
      <button type="button" class="botao botao-principal" data-concluir="${passo.id}">Feito, próximo passo →</button>
    </div>`;
}

function cartaoDoPasso(passo, numero, menus) {
  const situacao = situacaoDoPasso(passo.id);
  const rotuloDesfazer = passo.id === "plano" ? "Trocar de plano" : "Refazer este passo";
  const corpo = {
    atual: `<div class="passo-corpo">${corpoDoPasso(passo, menus)}</div>`,
    feito: `<button type="button" class="link" data-desfazer="${passo.id}">${rotuloDesfazer}</button>`,
    bloqueado: "",
  }[situacao];
  return `
    <li class="passo passo-${situacao}" id="passo-${passo.id}">
      <div class="passo-cabecalho">
        <span class="passo-numero">${situacao === "feito" ? "✓" : String(numero).padStart(2, "0")}</span>
        <h3>${escapar(passo.titulo)}</h3>
        <span class="passo-tempo">${escapar(passo.tempo)}</span>
      </div>
      ${corpo}
    </li>`;
}

function telaConcluida() {
  return `
    <section class="pronto" id="pronto">
      <p class="sobretitulo">Instalação concluída</p>
      <h2>Pronto. O Sistema de Donos está no seu Claude.</h2>
      <p>Agora é só conversar normalmente. Escolha uma skill abaixo, copie o exemplo e cole num chat novo.</p>
      <a class="botao botao-escuro" href="#skills">Ver as skills ↓</a>
    </section>`;
}

function desenharAjuda(menus) {
  const itens = PROBLEMAS.map(
    (p) => `<details><summary>${escapar(texto(p.sintoma, menus))}</summary><p>${escapar(texto(p.solucao, menus))}</p></details>`
  ).join("");
  ajuda.innerHTML = `<h2>Travou em algum passo?</h2><div class="ajuda-lista">${itens}</div>
    <p class="recomecar"><button type="button" class="link" data-recomecar>Recomeçar o guia</button></p>`;
}

// --- curva de progresso -------------------------------------------------------
// Montada uma vez; a cada passo só muda o quanto da linha salmão está desenhado, então a
// linha "corre" até o próximo ponto em vez de a curva ser refeita.
// Curva estreita à esquerda: os nomes ficam todos à direita dos pontos, sem cruzar a linha.
const CURVA = "M 40 24 C 120 110, 120 230, 70 320 S 20 520, 90 616";
let curva = null;

function montarCurva() {
  trilha.innerHTML = `
    <div class="trilha-compacta"></div>
    <svg class="curva" viewBox="0 0 300 640" aria-hidden="true">
      <path class="curva-base" d="${CURVA}"/>
      <path class="curva-luz" d="${CURVA}"/>
      <g class="curva-pontos"></g>
    </svg>`;
  const svg = trilha.querySelector(".curva");
  const luz = svg.querySelector(".curva-luz");
  const comprimento = luz.getTotalLength();
  const pontos = PASSOS.map((p, i) => {
    const { x, y } = luz.getPointAtLength((comprimento * i) / (PASSOS.length - 1));
    return `
      <g class="ponto" data-passo="${p.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
        <circle class="ponto-halo" r="22"/>
        <circle class="ponto-miolo" r="9"/>
        <text class="ponto-num" x="${(130 - x).toFixed(1)}" y="-4">${String(i + 1).padStart(2, "0")}</text>
        <text class="ponto-nome" x="${(130 - x).toFixed(1)}" y="16">${escapar(p.titulo)}</text>
      </g>`;
  }).join("");
  svg.querySelector(".curva-pontos").innerHTML = pontos;
  luz.style.strokeDasharray = `${comprimento}`;
  curva = { svg, luz, comprimento, compacta: trilha.querySelector(".trilha-compacta") };
}

function desenharProgresso() {
  const { feitos, total, completo } = progresso(estado);
  contador.textContent = completo ? "Instalação concluída" : `Passo ${feitos + 1} de ${total}`;
  if (!curva) montarCurva();
  const fracao = Math.min(feitos, total - 1) / (total - 1);
  curva.luz.style.strokeDashoffset = `${curva.comprimento * (1 - fracao)}`;
  curva.svg.querySelectorAll(".ponto").forEach((g) => g.setAttribute("class", `ponto ponto-${situacaoDoPasso(g.dataset.passo)}`));

  // Versão compacta (celular e tablet): número grande e um ✱ por passo.
  const atual = PASSOS.find((p) => situacaoDoPasso(p.id) === "atual");
  const marcas = PASSOS.map((p, i) => {
    const situacao = situacaoDoPasso(p.id);
    const recem = situacao === "feito" && i === feitos - 1 && feitos > feitosAntes ? " indice-recem" : "";
    return `<li class="indice-marca indice-${situacao}${recem}" title="${escapar(p.titulo)}">${asterisco}<span class="sr">${escapar(p.titulo)}</span></li>`;
  }).join("");
  curva.compacta.innerHTML = `
    <p class="indice-numero"><strong>${String(completo ? total : feitos + 1).padStart(2, "0")}</strong><span>/${String(total).padStart(2, "0")}</span></p>
    <p class="indice-nome">${escapar(completo ? "Tudo pronto" : atual.titulo)}</p>
    <ol class="indice-marcas">${marcas}</ol>`;
  feitosAntes = feitos;

  opcoesIdioma.innerHTML = Object.entries(MENUS)
    .map(([id, m]) => `<button type="button" class="opcao opcao-clara ${estado.idioma === id ? "opcao-escolhida" : ""}" data-idioma="${id}" aria-pressed="${estado.idioma === id}">${escapar(m.rotulo)}</button>`)
    .join("");
}

// Vitrine e fita: só dependem do catálogo de skills, então são desenhadas uma vez.
// A vitrine agrupa por área: com dezenas de skills, uma grade única vira parede de cartões.
function desenharVitrine() {
  // O total sai do próprio catálogo: skill nova atualiza o número sozinha.
  document.getElementById("total-skills").textContent = String(SKILLS.length).padStart(2, "0");
  document.getElementById("vitrine-skills").innerHTML = AREAS.map((area) => {
    const daArea = SKILLS.filter((s) => s.area === area);
    if (!daArea.length) return "";
    const cartoes = daArea.map(
      (s) => `
        <li class="skill">
          <span class="skill-icone">${asterisco}</span>
          <h4>${escapar(s.nome)}</h4>
          ${s.onde ? `<span class="skill-onde">Funciona no ${escapar(s.onde)}</span>` : ""}
          <p>${escapar(s.paraQue)}</p>
          ${blocoCopiar(s.exemplo)}
        </li>`
    ).join("");
    return `
      <li class="vitrine-area">
        <h3><span>${escapar(area)}</span><small>${daArea.length} ${daArea.length === 1 ? "skill" : "skills"}</small></h3>
        <ul class="vitrine-cartoes">${cartoes}</ul>
      </li>`;
  }).join("");
  const pilulas = SKILLS.map((s) => `<span class="pilula">${asterisco}${escapar(s.nome)}</span>`).join("");
  // Duas cópias: a fita anda meia trilha; com o catálogo atual isso já passa de 2560px.
  document.getElementById("fita-trilho").innerHTML = pilulas.repeat(2);
}

function desenhar() {
  const menus = MENUS[estado.idioma];
  const { completo } = progresso(estado);
  desenharProgresso();
  raiz.innerHTML = `
    <ol class="passos">${PASSOS.map((p, i) => cartaoDoPasso(p, i + 1, menus)).join("")}</ol>
    ${completo ? telaConcluida() : ""}`;
  desenharAjuda(menus);
}

function atualizar(novoEstado, { rolar = true } = {}) {
  estado = novoEstado;
  salvarProgresso(estado);
  desenhar();
  if (rolar) document.querySelector(".pronto, .passo-atual")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function copiar(botao) {
  try {
    await navigator.clipboard.writeText(botao.dataset.copiar);
    botao.textContent = "Copiado ✓";
  } catch (erro) {
    // Sem permissão de área de transferência (ex.: página aberta como arquivo): pede cópia manual.
    console.warn("Sistema de Donos: não foi possível copiar automaticamente.", erro);
    botao.textContent = "Selecione e copie";
  }
  setTimeout(() => (botao.textContent = "Copiar"), 2000);
}

document.addEventListener("click", (evento) => {
  const alvo = evento.target.closest("button");
  if (!alvo) return;
  const d = alvo.dataset;
  if (d.copiar !== undefined) return copiar(alvo);
  if (d.idioma) return atualizar(escolherIdioma(estado, d.idioma), { rolar: false });
  if (d.plano) return atualizar(escolherPlano(estado, d.plano));
  if (d.concluir) return atualizar(concluirPasso(estado, d.concluir));
  if (d.desfazer) return atualizar(desfazerPasso(estado, d.desfazer));
  if (d.recomecar !== undefined) {
    apagarProgresso();
    return atualizar(estadoInicial());
  }
});

desenharVitrine();
desenhar();
