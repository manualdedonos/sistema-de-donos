---
name: criar-hooks
description: "Cria hooks (ganchos) para o slide 1 de um carrossel de Instagram no formato tweet: a partir de um tema (e do perfil do usuário na Máquina), gera 5 hooks em metodologias diferentes (quebra de expectativa, número específico, história no meio da ação, \"se você…\", erro comum, pergunta de identificação), cada um já no formato de 3 blocos do slide 1, com nota e recomendação. Use SEMPRE que o usuário disser \"cria o hook\", \"me dá ganchos\", \"melhora a primeira frase\", \"o começo tá fraco\", \"opções de abertura para esse post\", ou depois que escolher um tema em buscar-temas. Não escreve o resto do carrossel.\n"
metadata:
  version: "1.0.0"
---

# /criar-hooks — a primeira frase decide se existe segunda

No formato tweet, o slide 1 é um tweet: até 8 linhas de texto em 3 blocos, com duas imagens embaixo. Ele tem um trabalho só: fazer a pessoa parar o dedo e passar para o slide 2. Tudo o que não faz isso sai.

Leia antes: `${CLAUDE_PLUGIN_ROOT}/skills/criar-hooks/references/metodologias-hooks.md` (os 8 tipos de hook, a anatomia do slide 1, os testes e exemplos reais).

## 1. Insumos

- **Tema e ângulo** (do usuário ou de `buscar-temas`). Se vier só um assunto solto, pergunte em uma linha qual é a tese (o que o post afirma) antes de criar.
- **Perfil** da máquina (`settings/profile`: público, dores, tom), conforme `${CLAUDE_PLUGIN_ROOT}/skills/maquina-de-carrosseis/references/artefato.md`. Sem máquina, use o que estiver na conversa e siga; não trave o usuário por isso.
- **Fatos disponíveis**: números, nomes, datas da referência. Hook não inventa número: se não houver, use cena ou contraste, nunca um dado fabricado.

## 2. Gere 5 hooks, cada um de um tipo diferente

Para cada hook, escreva o slide 1 inteiro na anatomia da referência:

- **Bloco 1 (1–3 linhas)**: a frase que quebra a expectativa, a cena ou o número.
- **Bloco 2 (1–3 linhas)**: a virada ou a prova (quem, quanto, quando).
- **Bloco 3 (1–2 linhas)**: o que isso tem a ver com quem lê + a promessa do que vem ("Vou te mostrar como…", "Essa é a história de…", "Explico em 12 slides:").

Limites: até 8 linhas no total (≈ 40 caracteres por linha, cerca de 320 caracteres). Não prometa um número de slides ("explico em 12 slides"): o número só existe depois de escrever. Uma expressão em **negrito** no máximo (a mais forte). Sem emoji, sem hashtag, sem "neste post".

## 3. Avalie e recomende

Passe cada hook pelos 4 testes da referência (específico, tensão, relevante, promessa cumprível) e dê nota de 1 a 5. Fale a língua do usuário: nada de "hook", "in medias res" ou "CTA" na entrega; diga "abertura", "começa pela cena", "fechamento".

- **No fluxo normal** (o usuário pediu um post, não pediu opções): mostre a abertura recomendada por inteiro e as duas melhores alternativas em uma linha cada. Formato:

```
**Abertura recomendada · começa pela cena** — forte (5/5)
[slide 1 completo]
Por que funciona: …

Alternativas: (2) [primeira linha] · (3) [primeira linha]
```

- **Quando o usuário pedir "opções" ou "me dá vários"**: mostre as 5 por inteiro, cada uma como `**Abertura N · [tipo em palavras simples]** — nota`, com "Por que funciona" e "Risco" em uma linha.

Feche com a pergunta: "Fecho com essa e escrevo o carrossel? Ou prefere uma das outras?" As imagens do slide 1 não entram aqui: o storyteller grava a sugestão no campo Imagem da página.

Quando o usuário escolher, entregue o hook escolhido para `storyteller-carrossel` já no formato final do slide 1.

## Regras

- O hook promete só o que o carrossel entrega. Promessa quebrada no slide 1 é o jeito mais rápido de perder seguidor.
- Nada de clickbait vazio ("você não vai acreditar"). A curiosidade vem de especificidade, não de mistério.
- Português do Brasil, no tom do perfil. Se o tom é "direto e informal", escreva como quem fala, não como quem redige.
- Nomes de pessoas reais e marcas só em fatos públicos e verificáveis; em dúvida, "[confirmar]".
