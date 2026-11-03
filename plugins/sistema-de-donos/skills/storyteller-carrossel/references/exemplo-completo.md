# Exemplo completo: do insumo ao post gravado

## Insumo recebido

- **Perfil**: Gabriel Bechi, @gabrielbechi, selo sim. Negócio: plataforma de educação de negócios para donos de PME. Público: donos de pequenas empresas que trabalham demais e querem crescer sem virar refém da operação. Tom: direto e informal.
- **Referência**: artigo "Services: The New Software" (Sequoia Capital, Julien Bek, 5 de março de 2026) + um texto do próprio usuário com a leitura dele da tese.
- **Observações do usuário**: destacar que serviços turbinados por IA vendem resultado, não mão de obra; dar o manual prático para aplicar; usar o exemplo de Recrutamento & Seleção.
- **CTA (perguntado antes de escrever)**: oferta. Palavra-chave "Sequoia"; a pessoa recebe o link para entrar no Manual de Donos e acessar as aulas de IA.

## Escolhas editoriais (o que foi dito ao usuário na entrega)

- Hook do tipo "se você" + contra-senso com número (US$ 1 trilhão). Cortou-se "e não, eu não to exagerando" para caber em 8 linhas.
- Puxou-se do artigo dois fatos que o texto do usuário não tinha: QuickBooks US$ 10 mil × contador US$ 120 mil, e o vocabulário copiloto × autopiloto.
- "SaaS" virou "software" para o público não-tech.
- Slide 1 com duas imagens; demais slides só texto, com sugestão de imagem em 6 deles no campo Imagem (o usuário liga se quiser).
- Um negrito por slide; última linha de cada slide é a ponte; legenda em texto puro, com a lição numa linha isolada e 5 hashtags.

## Mapa entregue no chat

1. Hook: "se você vende serviço…" + tese do US$ 1 trilhão
2. O contra-senso e a frase do artigo
3. O caminho padrão das startups e o limite
4. O trabalho continua na mão do cliente
5. QuickBooks × contador
6. Exemplo de R&S: metade do problema
7. A empresa que assume o processo inteiro
8. US$ 1 em software → US$ 6 em serviços
9. Serviço cresce com a equipe; IA muda a conta
10. A cereja: corrida contra o modelo
11. Copiloto × autopiloto
12. O manual: pra quem já empreende e pra quem procura ideia
13. Lição: assumir o trabalho que o cliente já paga
14. CTA "Sequoia"

## O JSON gravado em `posts/sequoia-servicos`

```json
{
  "title": "Serviços são o novo software (Sequoia)",
  "status": "texto",
  "createdAt": "2026-10-30T17:20:00Z",
  "updatedAt": "2026-10-30T17:20:00Z",
  "notes": "",
  "caption": "Se você vende serviço, tem algo acontecendo nos bastidores que vai mudar o seu negócio pra sempre. E pode ser bom ou ruim pra você.

A Sequoia, um dos melhores fundos do mundo, publicou uma tese: a próxima empresa de US$ 1 trilhão vai vender serviços. O artigo se chama \"Services: The New Software\" e o ponto central é simples: empresas de serviço turbinadas com IA vão entregar mais e melhor, vendendo e cobrando por resultado, não por mão de obra nem por acesso a ferramenta.

No carrossel eu disseco o manual dessa tese pra você aplicar no seu negócio: por que o software sozinho bate no teto, o exemplo do contador que vale 12x o software, a conta de US$ 1 em software pra US$ 6 em serviços, copiloto x autopiloto e por onde começar.

A lição: assumir um trabalho que o cliente já paga pra resolver e usar IA pra entregar cada vez melhor.

Essa tese é só um dos 25 Manuais de IA que já estão dentro do Manual de Donos. Toda semana, uma aula de 30 minutos dissecando, passo a passo, como aplicar IA pra resolver um problema real de negócio.

Comenta \"Sequoia\" que te mando o link pra entrar e ter acesso hoje mesmo a todas as aulas.

#empreendedorismo #inteligenciaartificial #pequenasempresas #gestao #manualdedonos",
  "slides": [
    {
      "text": "Se você vende serviço, tem algo acontecendo nos bastidores que vai mudar o seu negócio. Pra melhor ou pra pior.

A Sequoia, um dos maiores fundos do mundo, publicou uma tese: **a próxima empresa de US$ 1 trilhão vai vender serviços.**

Sim, serviços. Vou dissecar essa tese pra você aplicar no seu negócio:",
      "layout": 2,
      "images": [
        null,
        null
      ],
      "imageBrief": "Esq: título do artigo da Sequoia \"Services: The New Software\" · onde achar: print da página do artigo | Dir: dono de pequena empresa de serviços trabalhando no escritório · onde achar: busca 'small business owner office' no Unsplash ou foto sua"
    },
    {
      "text": "Isso vai contra tudo que a gente aprendeu sobre serviço: não escala, bate no teto, depende de contratar gente, é complexo.

Mesmo assim, em 5 de março de 2026, a Sequoia escreveu:

**\"A próxima empresa de 1 trilhão vai ser uma empresa de software disfarçada de empresa de serviços.\"**

O nome do artigo: Services: The New Software. Serviços são o novo software.",
      "layout": 0,
      "images": [],
      "imageBrief": ""
    },
    {
      "text": "Nos últimos anos, o caminho das startups era o mesmo: ser tech, criar uma plataforma, cobrar assinatura.

A empresa compra o software, coloca o time pra usar e tenta produzir mais com as mesmas pessoas.

Só que tem um limite aí.",
      "layout": 0,
      "images": [],
      "imageBrief": "Tela de dashboard cheia de gráficos num escritório vazio · onde achar: busca 'dashboard screen office night' no Unsplash"
    },
    {
      "text": "Mesmo com uma ferramenta excelente, **o trabalho continua na mão do cliente.**

É ele que precisa usar no dia a dia, fazer o time usar e garantir o resultado.

Não é à toa que os dois maiores desafios de qualquer software são exatamente esses: ativação e renovação.

A Sequoia resume com uma conta:",
      "layout": 0,
      "images": [],
      "imageBrief": ""
    },
    {
      "text": "Uma empresa paga US$ 10 mil por ano no QuickBooks, o software de contabilidade.

E US$ 120 mil no contador que fecha os livros.

A próxima empresa lendária não vai vender o software. **Vai fechar os livros.**",
      "layout": 0,
      "images": [],
      "imageBrief": "Tela de software de contabilidade com planilhas e gráficos · onde achar: busca 'accounting software dashboard' no Unsplash ou print de um sistema"
    },
    {
      "text": "Pensa num software de Recrutamento & Seleção.

A IA analisa centenas de currículos em minutos. Beleza.

Mas alguém ainda precisa configurar, falar com candidato, confirmar interesse, marcar entrevista, fazer proposta.

**Vender a ferramenta é vender metade do problema.**",
      "layout": 0,
      "images": [],
      "imageBrief": ""
    },
    {
      "text": "Agora imagina uma empresa que assume esse processo inteiro.

Ela não vende acesso a uma plataforma. Vende **candidato qualificado, pronto pra conversar.** Ou com proposta assinada.

Quanto você pagaria a mais por isso?",
      "layout": 0,
      "images": [],
      "imageBrief": "Aperto de mão numa entrevista de emprego · onde achar: busca 'job interview handshake' no Pexels"
    },
    {
      "text": "O tamanho do mercado explica o interesse da Sequoia:

**Para cada US$ 1 gasto em software, as empresas gastam US$ 6 em serviços.**

Olha pro que a sua empresa já paga: contador, advogado, agência, consultoria, terceirizados.

Esse dinheiro já existe. O que muda é quem entrega.",
      "layout": 0,
      "images": [],
      "imageBrief": ""
    },
    {
      "text": "O problema clássico do serviço: ele cresce junto com a equipe. Pra atender o dobro de clientes, quase o dobro de gente.

Com IA executando a parte repetitiva, a conta muda: o cliente recebe o serviço completo, e você entrega mais rápido, com mais qualidade, pra mais gente.

**As pessoas ficam com as decisões que exigem experiência.**

E tem mais uma coisa:",
      "layout": 0,
      "images": [],
      "imageBrief": ""
    },
    {
      "text": "A cereja do bolo, que você está vendo acontecer em tempo real em vários segmentos:

Se você vende só uma ferramenta, **o próximo modelo de IA pode fazer a mesma coisa.** Você corre contra o modelo.

Se você domina a operação inteira, cada avanço da IA deixa a sua entrega mais rápida, mais barata e mais difícil de copiar.

A Sequoia dá nome aos dois caminhos:",
      "layout": 0,
      "images": [],
      "imageBrief": ""
    },
    {
      "text": "Copiloto vende a ferramenta. O profissional segue fazendo o trabalho.

**Autopiloto vende o trabalho feito.** O cliente compra o resultado direto.

E o orçamento de trabalho é muito maior que o de ferramenta.

O manual, então:",
      "layout": 0,
      "images": [],
      "imageBrief": "Cockpit de avião com o painel do piloto automático ligado · onde achar: busca 'airplane cockpit autopilot' no Unsplash"
    },
    {
      "text": "Se você já empreende: olha pra sua operação e acha onde a IA entra pra atender mais e melhor. Começa pelo repetitivo, onde o time gasta tempo operacional: reports, dashboards, briefings, mensagens, setup.

Se você procura uma ideia pra empreender com IA: olha pro que as empresas **já terceirizam.** Processo repetitivo, caro e com resultado fácil de medir.

A oportunidade está exatamente aí:",
      "layout": 0,
      "images": [],
      "imageBrief": ""
    },
    {
      "text": "**Assumir um trabalho que o cliente já paga pra resolver e usar IA pra entregar cada vez melhor.**

Não vender só o serviço. Vender a garantia do resultado.

Esse é o resumo da tese. E tem muito mais onde ela veio.",
      "layout": 0,
      "images": [],
      "imageBrief": "Dono de negócio assinando um contrato, caneta e papel em primeiro plano · onde achar: busca 'signing contract small business' no Pexels"
    },
    {
      "text": "Essa tese é só um dos 25 Manuais de IA que já estão dentro do Manual de Donos.

Toda semana, uma aula de 30 minutos mostrando, passo a passo, como aplicar IA num problema real de negócio.

Comenta **\"Sequoia\"** que eu te mando o link pra ter acesso hoje a todas as aulas.",
      "layout": 0,
      "images": [],
      "imageBrief": "Lista das aulas de IA dentro da plataforma do Manual de Donos · onde achar: print da sua área de membros"
    }
  ]
}
```
