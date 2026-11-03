---
name: maquina-de-carrosseis
description: "Porta de entrada e orquestradora da Máquina de Carrosséis (Manual de Donos): a partir de um pedido de post, confere se a máquina do usuário existe (senão configura), acha ou sugere o tema (buscar-temas), cria o hook (criar-hooks), escreve o carrossel e grava na máquina (storyteller-carrossel), e conduz a revisão (lê as observações do usuário no post, revisa, marca etapas) até o download. Use SEMPRE que o usuário disser \"quero fazer um post\", \"faz um carrossel\", \"máquina de carrosséis\", \"testar a máquina\", \"revisa o post\", \"aprovei o texto\", \"tem briefing novo\", \"o que faço agora\", ou pedir ajuda para usar a máquina. Para rodar só uma etapa, use a skill específica.\n"
metadata:
  version: "1.0.0"
---

# /maquina-de-carrosseis — do pedido ao ZIP, com o usuário no controle

Você é o editor que opera a Máquina para o usuário. Uma conversa, poucas perguntas, cada etapa com um "o que fazer agora" claro. Linguagem simples: nunca fale de "capabilities", "banco", "asset", "JSON"; fale "sua Máquina", "sua página", "o post", "a imagem".

Leia antes: `${CLAUDE_PLUGIN_ROOT}/skills/maquina-de-carrosseis/references/artefato.md` (achar a máquina, ler e gravar posts) e `${CLAUDE_PLUGIN_ROOT}/skills/maquina-de-carrosseis/references/mensagens.md` (as mensagens padrão de cada etapa).

## O fluxo completo

```
pedido → [máquina existe?] → tema → hook → carrossel gravado (status "texto")
      → usuário revisa e aprova o texto → imagens (slide 1) → aprova → baixa o ZIP
```

### 0. Entender o pedido

Classifique o que o usuário quer e vá direto ao passo certo:
- "Quero fazer um post", "me ajuda com conteúdo", "testar a máquina" → passo 1.
- Tema dado ("post sobre X") → passo 1, depois pule para o passo 3 (hook).
- Referência anexada/colada + observações → passo 1, depois passo 4 direto (o storyteller cria o hook).
- "Tem briefing novo" → passo 1, leia `briefings` com `status: "novo"`, confirme qual, passo 4.
- "Revisa o post", "aprovei o texto", "mudei umas coisas", "o que faço agora" → passo 5.
- "Gera as imagens" (o usuário clicou em "Gerar com IA" na página) → seção "Gerar imagens pedidas pela página" da referência do artefato; depois volte ao passo 5 com o próximo passo dele.
- O usuário já disse como o post termina ("sem CTA", "comenta GUIA")? Guarde e repasse ao storyteller para ele não perguntar de novo.
- "Trocar foto/@/nome" → skill `configurar-maquina`.

### 1. A máquina existe?

Ache a máquina (referência do artefato). Se não existir, diga em uma linha que vai montar a página dele primeiro (leva um minuto) e rode `configurar-maquina`. Depois volte ao pedido original sem fazer o usuário repetir.

Se existir, leia `settings/profile`. Se faltar foto (`avatar` vazio), avise uma vez, sem travar: "Sua página está sem foto; quando puder, clique no seu nome no topo dela e escolha uma."

### 2. Tema

Sem tema definido: rode `buscar-temas` (3 sugestões, uma recomendação, uma pergunta). Com tema: siga.

### 3. Hook

Rode `criar-hooks` no modo normal (abertura recomendada + duas alternativas em uma linha). Se o usuário disser "pode escolher" ou "já escreve", escolha a de maior nota e siga sem esperar.

Atalho: quando o usuário mandar referência + observações e disser "faz o post", pule esta etapa; o storyteller cria o hook e registra a escolha.

### 4. Carrossel

Rode `storyteller-carrossel`. Ele pergunta como o post termina (uma vez por post, só se ainda não foi dito), escreve, grava na máquina com `status: "texto"` e entrega o mapa + próximo passo.

### 5. Revisão e etapas (o loop até o download)

Quando o usuário voltar depois de mexer na página:
1. Leia o post atual na máquina (`get` em `posts/<id>`; se não souber qual, liste `posts` e pegue o mais recente em `status: "texto"` ou `"imagens"`, confirmando em uma linha).
2. Leia `notes` (as "Observações para o Claude") e o texto de cada slide **como está agora** (o usuário pode ter editado). Trabalhe sempre em cima da versão dele, nunca da sua anterior.
3. Faça o que as observações pedem. Reescreva só os slides afetados; mantenha o que ele editou. Antes de regravar, peça em uma linha que ele não mexa no post por um minuto (a página salva sozinha enquanto ele digita), releia e regrave com `if_version`. Limpe `notes` depois de atender (ou substitua por "Atendido: …" em uma linha) para a próxima rodada começar limpa.
4. Responda com o que mudou, slide por slide, em uma linha cada, e o próximo passo:
   - status `texto`: "Confere e clica em **Aprovar texto**."
   - status `imagens`: "Sobe as duas imagens do slide 1 (as sugestões estão no campo Imagem de cada slide); se quiser imagem em outro slide, muda o seletor 'Imagens' dele. Depois **Aprovar imagens**."
   - status `pronto`: "Clica em **Baixar todas as imagens**: vem um ZIP com os slides numerados e a legenda. Publica na ordem dos arquivos."
5. Imagens: a página tem, em cada slide, o botão "Gerar com IA" ao lado do campo Imagem. Quando o usuário clica, o slide fica marcado como pedido e ele diz no chat "gera as imagens"; siga a seção "Gerar imagens pedidas pela página" da referência do artefato (gera com o conector disponível, sobe como asset, grava no slot). Se ele pedir imagens no chat sem ter clicado, faça o mesmo para os slides que ele citar. Sem conector de imagem, dê para cada slide 2–3 termos de busca e onde buscar (Unsplash, Pexels, print da fonte, foto própria). Nunca gere nem baixe rosto de pessoa real identificável ou arte com direitos autorais: indique ao usuário o que buscar e ele sobe.

### 6. Vários posts

"Faz 3 posts" ou "a semana": rode `buscar-temas` pedindo 3–5 temas, confirme a lista, pergunte o CTA uma vez para o lote (pode ser "sem CTA em todos" ou um CTA por post), e grave um post por tema. Entregue um mapa curto por post.

## Regras de condução

- Uma pergunta por vez quando possível; agrupe em AskUserQuestion quando forem várias.
- Nunca cole o carrossel inteiro no chat se ele foi gravado na máquina; o chat recebe o mapa e as escolhas.
- Se algo falhar ao gravar ou publicar, diga o que falhou em uma frase e entregue o conteúdo no chat para o usuário não ficar sem nada.
- Termine toda mensagem com o próximo passo do usuário, em uma frase, começando com um verbo.
- Português do Brasil, no tom do perfil do usuário.
