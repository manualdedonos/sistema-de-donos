---
name: storyteller-carrossel
description: "Storyteller de carrossel de Instagram no formato tweet: a partir de um tema (e, se houver, hook escolhido, referência e observações), pergunta se o post terá CTA, escreve o carrossel completo de 10 a 14 slides com storytelling que puxa o slide seguinte, escreve a legenda e grava o post na Máquina de Carrosséis do usuário, onde ele revisa, coloca imagem e baixa. Use SEMPRE que o usuário disser \"escreve o carrossel\", \"faz o post sobre\", \"transforma isso num carrossel\", \"quero um post com esse artigo\", \"tem briefing novo\", ou quando um tema/hook for escolhido em buscar-temas ou criar-hooks. Para revisar um post já gravado, use maquina-de-carrosseis.\n"
metadata:
  version: "1.0.0"
---

# /storyteller-carrossel — cada slide é um motivo para ver o próximo

Você escreve como o dono do perfil falando com o público dele: frases curtas, uma ideia por slide, cada slide terminando com um motivo para passar o dedo. Formato: carrossel no estilo tweet (cabeçalho com foto, nome e @; texto; imagem só onde faz sentido), 10 a 14 slides, 1080×1350.

Leia antes, nesta ordem:
1. `${CLAUDE_PLUGIN_ROOT}/skills/storyteller-carrossel/references/storytelling-carrossel.md` — o esqueleto, as regras por slide, as pontes, os limites de texto.
2. `${CLAUDE_PLUGIN_ROOT}/skills/storyteller-carrossel/references/exemplo-completo.md` — um post real, do insumo ao JSON gravado. É o formato-alvo.
3. `${CLAUDE_PLUGIN_ROOT}/skills/maquina-de-carrosseis/references/artefato.md` — como achar a máquina do usuário e gravar o post.

## 1. Insumos

- **Perfil**: leia `settings/profile` da máquina (nome, público, dores, tom). Sem máquina, rode `configurar-maquina` antes (sem ela o post não tem onde aparecer).
- **Tema e ângulo**: do usuário, de `buscar-temas` ou de um briefing (`briefings` com `status: "novo"`; leia anexos PDF conforme a referência do artefato).
- **Hook**: se veio de `criar-hooks`, use como slide 1. Se não veio, crie 2 opções rápidas no padrão daquela skill e escolha a mais tensa (registre a escolha em uma linha ao entregar).
- **Referência e observações**: artigo, link, texto, pontos a destacar, pontos de atenção. Leia tudo antes de escrever. Fatos, números e nomes vêm da referência ou de conhecimento público verificável; em dúvida, "[confirmar]".

## 2. Uma pergunta antes de escrever: como o post termina (uma vez por post)

Se o fechamento ainda não foi definido nesta conversa, pergunte com AskUserQuestion, numa mensagem só, em linguagem simples:
- **Como o post termina?** Opções: (a) só com a lição, sem pedir nada / (b) pedindo comentário, salvar ou compartilhar / (c) com uma oferta: a pessoa comenta uma palavra e recebe algo (ou link na bio, ou chama no direct).
- Se for (c): **qual palavra ou ação** e **o que a pessoa recebe** (concreto).
Se o usuário já disse ("sem CTA", "igual ao último", "comenta GUIA"), não pergunte: use. "Igual ao último": leia o último post gravado e repita o padrão. Num lote de vários posts, pergunte uma vez para o lote.

## 3. Escreva o carrossel

Siga o esqueleto da referência: slide 1 hook → slides 2–3 cena e tensão → mecanismo → viradas e provas → contraste → lição (penúltimo ou antepenúltimo) → aplicação para quem lê → fechamento (CTA ou lição final). 10 a 14 slides.

Regras duras (a referência detalha):
- **Slide 1**: até 8 linhas, `layout: 2`, `images: [null, null]`, `imageBrief` dizendo o que mostrar à esquerda e à direita e onde buscar.
- **Demais slides**: `layout: 0` por padrão (só texto), até 12 linhas. Quando uma imagem ajudaria de verdade (cena, objeto, pessoa pública, gráfico), mantenha `layout: 0` mas preencha `imageBrief` com a sugestão; o usuário liga a imagem no seletor se quiser. Nesses slides, mantenha o texto em até 8 linhas para a imagem caber se ele ligar.
- Uma linha tem cerca de 40 caracteres. Parágrafos separados por linha em branco; 2 a 4 parágrafos por slide.
- **No máximo uma expressão em negrito** por slide (`**assim**`), a que carrega a ideia.
- Última linha de cada slide é a **ponte** para o próximo (pergunta, "mas", "o problema é que", "e é aí que", reticência de sentido, nunca de pontuação).
- Sem emoji, sem hashtag no slide, sem "neste post", sem "deslize para o lado" fora do slide 1.
- Fechamento conforme a resposta do passo 2. (a) Sem CTA: antepenúltimo = aplicação; penúltimo = lição (negrito); último = a frase que o leitor leva (releitura do hook com a resposta). (b) Engajamento: penúltimo = lição; último = pergunta provocativa ou pedido de salvar/compartilhar com motivo. (c) Oferta: penúltimo = lição (e o que o post não cobriu); último = o que a pessoa recebe + "Comenta **'PALAVRA'** que eu te mando" na voz do dono, palavra-chave como único negrito.

## 4. Legenda

Texto puro: a legenda vai para o Instagram, que não entende asteriscos; nada de `**`. Primeira linha = o hook (até 125 caracteres). Depois a história corrida em parágrafos curtos, com um detalhe que não coube nos slides. A lição numa linha isolada. CTA literal (se houver). 3 a 5 hashtags do nicho. 600 a 1.500 caracteres.

## 5. Autochecagem (antes de gravar)

- Algum slide sem ponte? Algum com mais de 4 parágrafos? Slide 1 com mais de 8 linhas? Corrija.
- Algum número, nome ou fato que não está na referência nem é público e certo? Remova ou marque "[confirmar]".
- Lido em voz alta, soa como o dono falando com o público dele, no tom do perfil?
- 10 a 14 slides. Se passou de 14, funda slides; se ficou abaixo de 10, falta prova ou aplicação, não encha linguiça.
- O CTA é o que o usuário pediu, com a palavra-chave e a entrega exatas.
- Se o slide 1 cita um número de slides, confira que bate com o total; se não bate, troque por "em alguns slides".
- Legenda sem asteriscos; `imageBrief` de todo slide com imagem no formato "o que mostrar · onde achar".

## 6. Grave na máquina

Monte o JSON do post no esquema da referência do artefato (`title`, `status: "texto"`, `createdAt`, `updatedAt`, `caption`, `notes: ""`, `slides`), salve num arquivo local e grave com `ArtifactData` `set` em `posts/<kebab-do-titulo>-<AAAAMMDD-HHMM>` (use `file_path`). Nunca reutilize o id de um post existente. Se veio de um briefing, atualize o briefing para `status: "usado"` com `postId`.

Se a máquina não puder ser gravada (sem `Artifact`/`ArtifactData` nesta conversa), entregue o carrossel no chat, um bloco por slide numerado, e a legenda, e diga em uma frase como ter a página (Claude no computador).

## 7. Entrega no chat (curta)

Não cole o carrossel inteiro no chat quando ele foi gravado na máquina. Entregue:
1. "O post **[título]** está na sua Máquina, com N slides e a legenda."
2. O mapa em uma linha por slide (número + 5 a 8 palavras do que o slide faz), para o usuário ver a estrutura sem abrir.
3. Duas ou três escolhas editoriais que você fez e que ele pode querer mudar (o que cortou, o número que destacou, o fecho).
4. O próximo passo, sempre o mesmo: "Abre a Máquina, revisa o texto direto nos slides e clica em **Aprovar texto**. Depois sobe as duas imagens do slide 1 (sugestões já estão no campo Imagem), aprova e baixa o ZIP. Se quiser mudar algo, escreve em 'Observações para o Claude' e me diz 'revisa o post'."
