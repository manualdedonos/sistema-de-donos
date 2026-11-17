# Perguntas didáticas: como pedir cada número

Cada pergunta de número tem quatro partes: **o que é** (uma frase de dono), **o que entra**, **o que não entra** e **a saída para "não sei"**. Adapte os exemplos ao negócio dele. Escolhas fechadas vão em `AskUserQuestion`, quando a ferramenta existir; números vão em texto livre, um bloco por mensagem.

Os textos abaixo são modelos. Mantenha o sentido e o tamanho; troque o vocabulário pelo do negócio (padaria fala "fornada", agência fala "contrato", clínica fala "atendimento").

## Entender o negócio (uma rodada, até 4 perguntas)

**1. O que a empresa faz.** "Qual é o tipo do seu negócio?"
Opções: Comércio (loja, mercado, e-commerce) · Serviços (agência, consultoria, clínica, salão, escola) · Alimentação (restaurante, bar, padaria) · Indústria ou produção. O campo livre cobre tecnologia, construção, transporte e outros. Se a resposta for ampla ("serviços"), pergunte em seguida, em uma linha, o que exatamente ele vende e para quem.

**2. Como ele controla os números.** "Hoje, como você acompanha os números do negócio?"
- "Pelo extrato do banco, pela maquininha ou de cabeça" → estágio 1
- "Tenho planilha ou sistema, ou recebo balancete do contador" → estágio 2
- "Tenho DRE todo mês e quero aprofundar" → estágio 3

**3. Regime tributário.** "Qual é o regime de impostos da empresa?" Opções: Simples Nacional · Lucro Presumido · Lucro Real · Não sei (MEI entra no campo livre). Para "não sei": "O contador manda uma guia só por mês, o DAS, ou várias?" Uma só é Simples.

**4. Tamanho.** "Quantas pessoas trabalham no negócio, contando você?" Texto livre. Serve para a receita por funcionário e para escolher a faixa de comparação.

## Bloco A · O que entrou

> Primeiro, as vendas de outubro.
>
> **1. Quanto você vendeu no mês?** É a soma de tudo o que foi vendido em outubro, pelo valor cheio. Vale a data da venda, não a data em que o dinheiro caiu: se vendeu R$ 1.000 em 10 vezes, entra R$ 1.000. Empréstimo e dinheiro que você colocou na empresa não contam.
>
> **2. Quanto pagou de imposto sobre essas vendas?** No Simples, é o valor da guia do DAS referente a outubro. Se não souber, eu estimo.

Estágios 2 e 3, acrescente:

> **3. Teve devolução, cancelamento ou desconto dado depois da venda?** Se a venda que você me passou já está sem isso, é zero.

Onde ele acha o número: relatório do sistema de vendas ou da maquininha, notas emitidas no mês, planilha de pedidos. Extrato do banco só como última opção, com a ressalva da seção "Confusões comuns".

**Saídas para "não sei":**
- Receita: "Sem sistema, some o relatório da maquininha, o Pix recebido e o dinheiro. Se só tiver o extrato, me diga o total de entradas e quanto disso não foi venda." Marque como estimativa.
- Imposto no Simples: use a alíquota efetiva da tabela de `benchmarks.md` (seção 4) pela atividade e pelo faturamento dos últimos 12 meses. Diga: "Pelo seu faturamento, o DAS de uma loja costuma ficar perto de 7% da venda: R$ 4.760. Faz sentido com a guia que você paga?"
- Imposto no Presumido ou Real: estime pela mesma seção e coloque em "Para levar ao contador".
- Só sabe a receita do ano: divida por 12, diga que dividiu e marque.

## Bloco B · O que custou vender

> Agora, o que você gastou para entregar o que vendeu.
>
> **1. [Custo direto, com o nome do negócio dele].** [Explicação da tabela de `modelos-de-dre.md`, seção 4.] Atenção: é o custo do que **saiu**, não do que você **comprou** no mês.
>
> **2. Despesas que só existem porque a venda aconteceu**: taxa da maquininha e de marketplace, comissão de vendedor, frete de entrega, embalagem. Pode me passar o total.

Exemplos por tipo de negócio para a pergunta 1:
- Comércio: "Quanto você pagou ao fornecedor pelas mercadorias que saíram da loja em outubro? Se você comprou R$ 50 mil e metade ainda está na prateleira, o custo é a metade que saiu."
- Alimentação: "Quanto custaram os insumos e as bebidas que viraram prato e saíram em outubro?"
- Serviço: "Quanto custa o time que executa o serviço para o cliente? Salário com encargos de quem atende ou entrega, mais terceirizados e freelancers. Quem vende e quem administra fica para a próxima pergunta."
- Indústria: "Quanto custou produzir o que foi vendido: matéria-prima, embalagem, a mão de obra da produção e a conta de energia da fábrica?"
- Tecnologia: "Quanto custa manter o produto no ar para os clientes: servidores, licenças embutidas e o time de suporte?"

No estágio 3, peça as variáveis abertas: comissões, taxas de cartão e marketplace, fretes, outras.

**Saídas para "não sei":**
- Custo direto, comércio: pergunte o markup ("você multiplica o custo por quanto para chegar no preço?"). Custo = receita ÷ markup. Sem markup, use o centro da faixa do segmento.
- Custo direto com estoque conhecido: estoque do início + compras − estoque do fim.
- Custo direto, serviço: liste com ele as pessoas da entrega e some salário × multiplicador de encargos (`benchmarks.md`, seção 3).
- Taxa de cartão: pergunte quanto da venda passa no cartão e use a taxa da seção 5 de `benchmarks.md`. Sem a divisão, assuma 60% no cartão e diga.
- Em todos os casos: mostre a conta, pergunte "faz sentido?" e registre em `estimados` com a conta em uma frase.

## Bloco C · O que custa manter a porta aberta

> Agora as despesas que você paga vendendo muito ou pouco.
>
> **1. Pessoal.** O custo total da equipe, não só o salário: encargos, férias, 13º, vale-transporte, vale-refeição, plano de saúde. Não repita quem já entrou no custo da entrega. Se tiver só a soma dos salários, me passe que eu calculo os encargos.
>
> **2. A sua retirada.** Quanto você tira por mês para viver do negócio? [Estágio 1: entra junto com pessoal. Estágios 2 e 3: linha própria, pró-labore.]
>
> **3. Aluguel e estrutura**: aluguel, condomínio, IPTU, energia, água, internet, limpeza.
>
> **4. Marketing e vendas**: anúncios, agência, brindes, eventos, ferramentas de venda.
>
> **5. O resto**: contador, sistemas, telefone, seguros, tarifas e o que mais sair todo mês.

Estágios 2 e 3: separe o item 5 em administrativas (contador, advogado, sistemas, telefone, seguros) e outras. Estágio 3: tecnologia em linha própria.

**Sobre a retirada** (explique sempre, é a confusão mais cara):
"Se você trabalha na empresa, o seu trabalho é um custo, como o de qualquer funcionário. Quando a retirada fica fora da conta, o lucro parece maior do que é. Lucro de verdade é o que sobra depois de você se pagar."
- "Tiro o que sobra": pergunte a média dos últimos três meses e use.
- "Não tiro nada": deixe zero e leve o ponto para os achados. Um negócio que só dá lucro porque o dono trabalha de graça não dá lucro.
- "Pago contas pessoais pela empresa": peça uma estimativa do total e some na retirada.

**Saídas para "não sei":**
- Só os salários: salário bruto × multiplicador de encargos do regime, mais benefícios. Diga a conta.
- Energia, água e internet: peça a última conta de cada. Sem isso, deixe dentro do aluguel e diga.
- "O resto": peça os três maiores itens. Se passar de 5% da receita, vale abrir depois.

## Bloco D · Banco, desgaste e imposto sobre o lucro (estágios 2 e 3)

> Faltam três números. São os que mais ficam de fora, e mudam o lucro.
>
> **1. Juros e tarifas.** Quanto a empresa pagou em outubro de juros de empréstimo, antecipação de recebíveis, cheque especial e tarifas de banco? Só os juros: a parte da parcela que devolve o dinheiro emprestado não é despesa.
>
> **2. Desgaste de equipamentos.** A empresa tem máquinas, veículos, computadores ou uma reforma que custaram caro? Me diga quanto custaram e há quanto tempo, que eu calculo quanto disso pesa em cada mês.
>
> **3. Imposto sobre o lucro.** [Simples: "No Simples ele já está dentro do DAS, então fica zero." Presumido ou Real: "Quanto foi de IRPJ e CSLL? Costuma ser pago por trimestre: me passe o do trimestre que eu divido por três."]

Estágio 3: pergunte também as receitas financeiras (rendimento de aplicação).

**Saídas para "não sei":**
- Juros: peça o valor da parcela e o saldo da dívida. Juros do mês ≈ saldo × taxa mensal do contrato. Sem a taxa, estime metade da parcela para dívida recente e um quarto para dívida perto do fim, e marque.
- Depreciação: valor pago ÷ vida útil em meses (`benchmarks.md`, seção 6).
- IR e CSLL: fórmulas da seção 4 de `benchmarks.md`. Sempre vai para "Para levar ao contador".

## Bloco E · Dados de apoio (opcionais, uma mensagem)

> Três números rápidos que não entram na DRE, mas destravam indicadores. Se não tiver algum, pule.
>
> **1. Quantos clientes novos** compraram pela primeira vez em outubro? Com isso eu calculo o CAC, quanto custa trazer cada cliente.
> **2. Quantas vendas** foram no mês (pedidos, notas ou atendimentos)? Dá o ticket médio.
> **3. Quanto havia em caixa** no último dia do mês, somando banco e aplicações? Mostra quantos dias a empresa aguenta.

Não insista. O que faltar aparece no painel como "informar" e ele preenche depois.

## Confusões comuns e como desfazer (uma ou duas frases)

| O dono diz | O que está acontecendo | Como explicar |
|---|---|---|
| "Entrou R$ 80 mil no banco" | Confunde recebimento com venda | "A DRE olha o que você vendeu no mês, não o que caiu na conta. Parte desses R$ 80 mil pode ser venda de setembro, e parte da venda de outubro só entra em novembro." |
| "Minha folha é R$ 12 mil" (só salários) | Esquece encargos e benefícios | "Esse é o salário. Com encargos, férias e 13º, cada R$ 1 de salário custa cerca de R$ 1,35 no Simples. Vou usar R$ 16,2 mil. Faz sentido?" |
| "Comprei R$ 40 mil de mercadoria" | Confunde compra com custo | "Compra vira custo quando a mercadoria é vendida. O que ficou no estoque ainda é patrimônio seu." |
| "Sobrou R$ 15 mil, tirei tudo" | Retirada tratada como lucro | "Esses R$ 15 mil pagam o seu trabalho e o lucro juntos. Se alguém fizesse a sua função, quanto custaria? Esse é o pró-labore; o resto é lucro." |
| "Paguei R$ 5 mil de empréstimo" | Parcela inteira como despesa | "Na parcela, uma parte devolve o que você pegou e outra parte é juro. Só o juro é despesa." |
| "Peguei R$ 50 mil no banco" lançado como entrada | Empréstimo como receita | "Empréstimo não é venda: é dinheiro que você vai devolver. Fica fora da DRE." |
| "Comprei uma máquina de R$ 60 mil" | Investimento como despesa do mês | "A máquina vai servir por anos, então o custo entra aos poucos: R$ 60 mil em 10 anos são R$ 500 por mês." |
| "Tive lucro e não tenho dinheiro" | Lucro e caixa são coisas diferentes | "O lucro existe, mas pode estar parado no estoque, na mão de cliente que paga a prazo ou ter ido para parcela de dívida. A DRE mostra o lucro; o caminho do dinheiro é o fluxo de caixa." |
| "O contador já tira os impostos" | Receita informada líquida | "Então me passe o valor cheio das notas e o DAS separado, para a gente ver quanto o imposto pesa." |

## Números que pedem pergunta antes de seguir

Mostre a conta e pergunte. Não corrija sozinho.

- Custo direto maior que a receita líquida.
- Margem bruta fora da faixa do segmento em mais de 15 pontos, para cima ou para baixo.
- Imposto sobre vendas zerado (fora de MEI) ou acima de 25% da receita.
- Pessoal zerado em negócio com funcionários, ou folha acima de 60% da receita.
- Retirada zerada com o dono trabalhando no negócio.
- Lucro líquido acima de 35% da receita: quase sempre falta um custo ou a retirada.
- Prejuízo acima de 30% da receita: quase sempre entrou investimento, compra de estoque ou parcela de empréstimo como despesa.
- Receita do mês muito diferente da média que ele citou: pergunte se foi um mês atípico e registre.
- No arquivo: linha "outras despesas" acima de 10% da receita, linha com sinal trocado, mês sem depreciação em empresa com máquinas.
