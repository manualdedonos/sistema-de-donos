# Método dos 9 Blocos do Vendedor Automático

Fonte: Manual de IA #15 do Manual de Donos, "Monte o seu primeiro Vendedor Automático no WhatsApp", e os truques de humanização do Manual de Negócios #15, "Como vender mais com IA e WhatsApp".

Um bom vendedor humano tem preparo por trás: sabe quem é, conhece o produto de cor, segue um roteiro e sabe a hora de chamar o chefe para fechar. O vendedor automático precisa das mesmas peças, escritas no prompt. São 9 blocos em 3 movimentos:

| Movimento | Blocos |
|---|---|
| **Quem ele é** | 1. Identidade · 2. Contexto de negócio · 3. Objetivo da conversa |
| **Como ele conversa** | 4. Fluxo e roteiro (SPIN) · 5. Crivo de qualificação (BANT) · 7. Humanização e tom |
| **O que ele nunca faz** | 6. Base de conhecimento · 8. Limites e escalonamento · 9. Formato de saída |

A divisão em movimentos é a do manual; a ordem de escrita no prompt é sempre a numérica, de 1 a 9. Os blocos 4 e 5 são o coração: é neles que a venda acontece ou escorre pelo ralo.

---

## Bloco 1 — Identidade

Nome, papel e personalidade. O agente se apresenta ("Você é [Nome], [cargo] da [Empresa]"), tem um tom definido (mais formal ou mais descontraído) e sabe o que é: um vendedor consultivo, longe do robô de respostas prontas e do vendedor chato que fica empurrando.

O que precisa ter: nome, cargo, empresa, tom, personalidade em 2 ou 3 traços, e a frase de quem ele é e de quem ele não é.

## Bloco 2 — Contexto de negócio

O bloco que muda 100% de empresa para empresa. Cobre: o que a empresa vende, para quem (o cliente ideal), preço médio ou faixa, os principais diferenciais e as objeções mais comuns do mercado. Vem do site e das respostas do dono.

## Bloco 3 — Objetivo da conversa

Um objetivo de sucesso, não vários. O agente persegue uma meta só e todo o resto é meio. "Agendar uma conversa de diagnóstico" e "fechar a venda direto no WhatsApp" são dois prompts diferentes; o negócio escolhe um antes de escrever.

Agente com muitas funções (qualificar, vender, dar suporte, cobrar) se perde e começa a inventar. Se o dono quer várias funções, são vários agentes.

## Bloco 4 — Fluxo e roteiro

A sequência de etapas: abertura, descoberta com as perguntas do SPIN, qualificação, apresentação, tratamento de objeção e próximo passo. Cada etapa tem um **critério de saída**: o que precisa ter acontecido para avançar.

### SPIN (modelo de Neil Rackham)

Quem vende bem pergunta primeiro, entende o que a pessoa precisa e só então oferece. São 4 tipos de pergunta, sempre nesta ordem. No WhatsApp, cada uma vira 1 ou 2 mensagens curtas, para não parecer interrogatório.

| Etapa | O que descobre | Exemplo adaptado ao chat |
|---|---|---|
| **S — Situação** | Os fatos do cenário atual do cliente | "Hoje vocês já usam algum sistema para [processo]?" |
| **P — Problema** | A dor, a insatisfação, a dificuldade | "E isso tem dado alguma dor de cabeça, tipo [problema comum do nicho]?" |
| **I — Implicação** | O custo de não resolver | "Isso te faz perder [tempo/dinheiro/cliente] com que frequência, mais ou menos?" |
| **N — Necessidade** | O cliente diz com as palavras dele o valor da solução | "Se isso se resolvesse, quanto tempo ou dinheiro liberaria para você?" |

Exemplo da diferença: o cliente manda "Oi, vocês têm horário essa semana?". O robô comum responde "nosso horário é de segunda a sexta, das 9h às 18h" e para. O vendedor automático responde "Consigo sim! Hoje vocês já usam algum sistema pra isso?" e já começa a descobrir a necessidade.

## Bloco 5 — Crivo de qualificação

O filtro que separa o cliente que vale o tempo do vendedor de quem só está olhando.

### BANT (modelo criado na IBM)

| Critério | Pergunta que qualifica | Peso padrão |
|---|---|---|
| **B — Orçamento** | O cliente tem capacidade de investir na sua faixa de preço? | Alto |
| **A — Autoridade** | Você está falando com quem decide ou com quem influencia? | Médio |
| **N — Necessidade** | A dor que apareceu no SPIN é real e específica? | Alto |
| **T — Momento** | Existe prazo ou urgência real para resolver? | Médio |

**Classificação no fim:**
- **Quente** — 3 ou 4 critérios fortes: vai direto para o vendedor humano fechar.
- **Morno** — 2 critérios: entra numa régua de acompanhamento (uma sequência de mensagens de follow-up com data marcada).
- **Frio** — 0 ou 1: segue sendo bem tratado, com conteúdo, sem forçar.

O peso de cada critério se adapta ao segmento. O agente descobre o BANT dentro da conversa do SPIN, sem perguntar "qual é o seu orçamento?" logo de cara.

## Bloco 6 — Base de conhecimento

Perguntas frequentes, objeções e como responder, política de preço e condições: tudo que o agente pode citar sem inventar. Contexto de negócio diz quem a empresa é; base de conhecimento diz como agir na prática.

A regra mais importante do prompt inteiro mora aqui: **se a informação não está na base, o agente não responde de cabeça; anota a dúvida e passa para uma pessoa.**

## Bloco 7 — Humanização e tom

Quando o cliente percebe que fala com robô, a confiança cai e a venda escorre. Truques que o prompt precisa trazer:

- tempo de resposta variável (não responder sempre no mesmo segundo);
- o "digitando..." e o ritmo ajustado ao tamanho da mensagem (isso é configurado na automação; o prompt diz para escrever mensagens curtas, que permitem esse ritmo);
- expressões humanas, no jeito de falar da marca;
- nunca despejar um parágrafo enorme: quebrar em mensagens curtas;
- **uma pergunta por vez**, nunca emendar três na mesma mensagem;
- nada de mensagem de acompanhamento em horário estranho (madrugada, cedo demais).

## Bloco 8 — Limites e escalonamento

Duas listas separadas.

**O que o agente nunca faz**, por exemplo: inventar preço fora da tabela, prometer prazo não confirmado, dar desconto que não está na política, falar mal de concorrente, continuar vendendo depois que o cliente pediu uma pessoa.

**Quando chama uma pessoa**, por exemplo: o cliente pede; o cliente foi classificado como quente; uma objeção foi tratada 2 vezes sem resolver; qualquer reclamação; pergunta que não está na base de conhecimento. Se o cliente quer falar por telefone, o agente facilita, não bloqueia.

## Bloco 9 — Formato de saída

Por trás da conversa, invisível para o cliente, o agente devolve um dado organizado (entre as marcas `<registro>` e `</registro>`, para a automação separar da mensagem) para o sistema gravar no banco de dados ou na ficha do cliente: nome, resumo da dor, respostas do crivo, classificação e próxima ação sugerida.

---

## Princípios que valem para qualquer agente

- Pessoas, processo e tecnologia, nessa ordem: o agente só repete o processo comercial que existe.
- A IA é para vender mais, não para tirar o vendedor. Ela faz o primeiro contato rápido e a qualificação; o humano fecha.
- Velocidade é a maior alavanca: o Manual de IA #15 cita que quem responde em até 5 minutos tem 21 vezes mais chance de qualificar o contato do que quem responde em 30.
- Comece pequeno: uma versão que já roda vale mais que a perfeita que nunca sai. Refine com conversas reais.
