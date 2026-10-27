// Tudo o que o empresário lê no guia mora aqui. A tela (app.js) só desenha;
// mudar um texto, um passo ou uma skill é mexer só neste arquivo.

export const MARKETPLACE = "manualdedonos/sistema-de-donos";
export const URL_CLAUDE = "https://claude.ai";
export const FRASE_TESTE = "testar o kit do dono";

// Nomes dos menus como aparecem no Claude, por idioma da interface dele.
// Conferidos em print do app em português: personalizacao, adicionarMarketplace,
// sincronizarAuto e sincronizar. Os demais ainda precisam de print para confirmar.
export const MENUS = {
  pt: {
    rotulo: "Português",
    personalizacao: "Personalização",
    plugins: "Plugins",
    adicionar: "Adicionar",
    adicionarMarketplace: "Adicionar marketplace",
    sincronizarAuto: "Sincronizar automaticamente",
    sincronizar: "Sincronizar",
    configuracoes: "Configurações",
    capacidades: "Capacidades",
  },
  en: {
    rotulo: "English",
    personalizacao: "Customize",
    plugins: "Plugins",
    adicionar: "Add",
    adicionarMarketplace: "Add marketplace",
    sincronizarAuto: "Sync automatically",
    sincronizar: "Sync",
    configuracoes: "Settings",
    capacidades: "Capabilities",
  },
};

// Plugins só existem nos planos pagos; no Free a jornada para no primeiro passo.
export const PLANOS = [
  { id: "free", nome: "Free", aceitaPlugins: false },
  { id: "pro", nome: "Pro", aceitaPlugins: true },
  { id: "max", nome: "Max", aceitaPlugins: true },
  { id: "team", nome: "Team", aceitaPlugins: true },
  { id: "enterprise", nome: "Enterprise", aceitaPlugins: true },
];

// Cada passo é uma lista de ações, uma por linha, na ordem em que o empresário clica.
// `texto` recebe os nomes dos menus no idioma do Claude dele; `imagem` é um print real
// do Claude marcado em laranja (os números da imagem batem com a ordem das ações).
export const PASSOS = [
  {
    id: "plano",
    titulo: "Qual é o seu plano?",
    tempo: "10 s",
    intro: "O Kit do Dono roda nos planos pagos do Claude. Marque o seu para seguir.",
  },
  {
    id: "execucao",
    titulo: "Ligue a execução de código",
    tempo: "30 s",
    intro: "As skills precisam desta opção ligada para funcionar.",
    acoes: [
      { texto: (m) => `No Claude, abra **${m.configuracoes}**.` },
      { texto: (m) => `Entre em **${m.capacidades}**.` },
      { texto: () => "Ligue a opção de **execução de código e criação de arquivos**." },
    ],
    dicaPorPlano: {
      team: "No plano Team ela já vem ligada. Se estiver desligada, fale com quem administra a conta da empresa.",
      enterprise: "No Enterprise, quem liga é o administrador da conta. Se não estiver ligada, peça para ele.",
    },
  },
  {
    id: "catalogo",
    titulo: "Adicione o catálogo",
    tempo: "1 min",
    intro: "É aqui que o seu Claude passa a enxergar as skills do Manual de Donos.",
    acoes: [
      {
        texto: (m) => `No menu da esquerda do Claude, clique em **${m.personalizacao}**.`,
        imagem: { arquivo: "/kit-de-dono/img/menu-personalizacao.png", alt: "Menu lateral do Claude com Personalização marcado em laranja" },
      },
      { texto: (m) => `Abra a aba **${m.plugins}**.` },
      { texto: (m) => `Clique em **${m.adicionar}** e escolha **${m.adicionarMarketplace}**.` },
      { texto: () => "Copie o endereço abaixo e cole no campo **URL** (marcado com 1 na imagem).", copiar: MARKETPLACE },
      {
        texto: (m) => `Confira se **${m.sincronizarAuto}** está ligado, em azul (2), e clique em **${m.sincronizar}** (3).`,
        imagem: { arquivo: "/kit-de-dono/img/janela-marketplace.png", alt: "Janela Adicionar marketplace com o campo URL, o botão Sincronizar automaticamente e o botão Sincronizar marcados" },
      },
    ],
    aviso: (m) => `Com “${m.sincronizarAuto}” ligado, o Claude mantém o Kit atualizado quando o Manual de Donos publicar novidades.`,
  },
  {
    id: "instalar",
    titulo: "Instale o Kit do Dono",
    tempo: "15 s",
    acoes: [
      { texto: (m) => `Ainda em **${m.personalizacao} › ${m.plugins}**, procure **Kit do Dono** na lista.` },
      { texto: (m) => `Clique em **${m.adicionar}** ao lado dele.` },
    ],
  },
  {
    id: "testar",
    titulo: "Teste num chat novo",
    tempo: "20 s",
    acoes: [
      { texto: () => "Abra um **chat novo** no Claude." },
      { texto: () => "Copie a frase abaixo, cole no chat e envie.", copiar: FRASE_TESTE },
      { texto: () => "O Claude deve responder que o **Kit do Dono está instalado** e listar as skills." },
    ],
  },
];

// As skills vêm do catálogo único do repositório (catalogo.json → scripts/gerar.py).
export { SKILLS, AREAS } from "./catalogo.js";

export const PROBLEMAS = [
  {
    sintoma: "Apareceu “Repositório inacessível”",
    solucao: () =>
      "Confira se colou exatamente manualdedonos/sistema-de-donos, sem espaço no começo ou no fim. Use o botão Copiar deste guia. Não é preciso instalar o Claude GitHub App.",
  },
  {
    sintoma: (m) => `Não aparece a opção ${m.plugins}`,
    solucao: (m) => `${m.plugins} só existem nos planos pagos. Confira o seu plano em ${m.configuracoes}.`,
  },
  {
    sintoma: "Enviei a frase de teste e o Claude não reconheceu",
    solucao: (m) =>
      `Abra um chat novo: um chat que já estava aberto não enxerga o que você acabou de instalar. Depois confira em ${m.personalizacao} › ${m.plugins} se o Kit do Dono aparece como instalado e ativado, e se a execução de código está ligada em ${m.configuracoes} › ${m.capacidades}.`,
  },
  {
    sintoma: "Instalei pela aba de código do app desktop",
    solucao: (m) =>
      `A aba de código (onde aparece “Este computador”) é outro lugar e não atualiza sozinha. Para o dia a dia, instale pelo ${m.personalizacao} › ${m.plugins} do chat.`,
  },
];
