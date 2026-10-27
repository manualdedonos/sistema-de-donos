<!-- Síntese própria do Manual de Donos para a skill Diretor Financeiro. Não reproduz texto de terceiros. -->

# Decisões de investimento, dívida e orçamento

Toda decisão financeira responde a três perguntas: quanto vale, em quanto tempo, e se vale a pena comparado com a alternativa. Esta referência reúne a matemática financeira que o Diretor Financeiro usa para avaliar investimentos, comparar formas de financiar, montar orçamento e modelar cenários numa PME.

---

## 1. Valor do dinheiro no tempo

R$ 100 mil hoje valem mais que R$ 100 mil daqui a um ano, por três motivos: inflação corrói o poder de compra, o dinheiro poderia estar rendendo, e o futuro tem risco.

**Regra de ouro:** nunca some nem subtraia valores de datas diferentes sem antes trazê-los para a mesma data.

### Diagrama de fluxo de caixa
Uma linha do tempo (dias, meses, anos), com entradas para cima (positivas) e saídas para baixo (negativas). Desenhar antes de calcular evita metade dos erros.

### Fórmulas básicas
- Juros do período: J = VP × i
- Valor futuro, um período: VF = VP × (1 + i)
- **Juros simples** (juros só sobre o principal): VF = VP × (1 + n × i). Usado em operações curtas.
- **Juros compostos** (juros sobre juros): VF = VP × (1 + i)^n
- Valor presente: VP = VF ÷ (1 + i)^n
- Taxa implícita: i = (VF ÷ VP)^(1/n) − 1
- **Crescimento composto anual (CAGR)** = (valor final ÷ valor inicial)^(1/anos) − 1

**Exemplo próprio:** faturamento foi de R$ 1,2 milhão para R$ 2,1 milhões em 4 anos. CAGR = (2,1 ÷ 1,2)^(1/4) − 1 ≈ 15% ao ano. Útil para projetar e para não se enganar com "crescemos 75%" (que foi em 4 anos, não em 1).

**Conversão de taxas compostas:** taxa anual = (1 + taxa mensal)^12 − 1. Taxa mensal = (1 + taxa anual)^(1/12) − 1. 2% ao mês não é 24% ao ano; é cerca de 26,8%.

**Efeito dos juros sobre juros:** em prazos longos, a maior parte do saldo final vem de juros sobre juros, não do principal. Isso vale para aplicação e, principalmente, para dívida rolada.

### Taxa nominal x taxa real
Taxa real = (1 + taxa nominal) ÷ (1 + inflação) − 1

Exemplo: o negócio rendeu 12% no ano com inflação de 5%. Retorno real = 1,12 ÷ 1,05 − 1 ≈ 6,7%. Sempre que comparar retornos de anos diferentes, ou reajustar preço e salário, pense em termos reais.

---

## 2. ROI e TMA

**ROI** = (ganho líquido do investimento) ÷ valor investido
Ganho líquido = valores recebidos − custos ligados ao investimento − valor investido.

Exemplo: investimento de R$ 80 mil numa máquina que, em dois anos, gerou R$ 130 mil de margem adicional, com R$ 10 mil de manutenção. ROI = (130 − 10 − 80) ÷ 80 = 50% em dois anos.

ROI sozinho engana. Sempre pergunte: em quanto tempo? Já descontada a inflação? Comparado com o quê?

**TMA (taxa mínima de atratividade):** o retorno mínimo que justifica o risco. É a régua de comparação.
- Para o dono pessoa física: o que o dinheiro renderia numa aplicação de risco equivalente. Tirar R$ 500 mil de uma aplicação conservadora para investir na empresa só faz sentido se a empresa render bem mais, porque o risco é maior.
- Para a empresa: o custo do capital (próprio e de terceiros, ponderado), ajustado ao risco do projeto. Um projeto que rende 15% ao ano não deve ser aprovado se o custo de capital da empresa é 18%.

---

## 3. VPL, TIR e payback

### VPL (valor presente líquido)
VPL = soma de [fluxo do período t ÷ (1 + TMA)^t] para t = 0 até n
(o fluxo do período 0 é normalmente o investimento, negativo)

- VPL > 0: o projeto cria valor acima da TMA. Aprovar (se houver capital e não houver opção melhor).
- VPL = 0: rende exatamente a TMA.
- VPL < 0: destrói valor. Rejeitar.

**Exemplo próprio:** abrir uma segunda unidade custa R$ 400 mil hoje e deve gerar R$ 120 mil, R$ 150 mil, R$ 170 mil e R$ 180 mil nos anos 1 a 4. Com TMA de 18% ao ano:
- Ano 1: 120 ÷ 1,18 ≈ 101,7
- Ano 2: 150 ÷ 1,3924 ≈ 107,7
- Ano 3: 170 ÷ 1,6430 ≈ 103,5
- Ano 4: 180 ÷ 1,9388 ≈ 92,8
- Soma ≈ 405,7. VPL ≈ +R$ 5,7 mil. Projeto marginal: aprovado por pouco, e qualquer premissa um pouco pior o inverte. Hora de testar sensibilidade.

**Fluxo irregular:** desconte parcela por parcela. **Fluxo constante:** use a fórmula de anuidade ou a função de valor presente da planilha.

### Perpetuidade
- Fluxo constante para sempre: VP = fluxo ÷ i
- Fluxo crescendo a g para sempre (g < i): VP = fluxo do próximo período ÷ (i − g)

Exemplo: imóvel alugado que rende R$ 60 mil líquidos por ano, com TMA de 10%: vale R$ 600 mil. Se o aluguel cresce 3% ao ano: 60 ÷ (0,10 − 0,03) ≈ R$ 857 mil. A mesma fórmula serve para avaliar uma ação pelo dividendo esperado crescendo a taxa constante, e para o valor terminal de um valuation.

### TIR (taxa interna de retorno)
É a taxa que zera o VPL. Para um investimento, é a rentabilidade do projeto. Para um financiamento, é o custo efetivo da dívida.
- TIR > TMA: aprovar. TIR < TMA: rejeitar.
- A curva VPL x taxa de desconto cai à medida que a taxa sobe; a TIR é onde ela cruza o zero.

**Uso esperto da TIR: achar o juro escondido.** O fornecedor oferece R$ 100 mil à vista ou 10 parcelas de R$ 11 mil (primeira no ato). A TIR desse fluxo é o juro embutido no parcelamento. Compare com o seu custo de capital ou com o rendimento do seu caixa.

**Dívida x capital próprio:** se a TIR do fluxo de um empréstimo (o custo efetivo dele) é menor que o retorno exigido pelo sócio, financiar com dívida é mais barato que usar capital próprio, desde que o risco de não pagar seja administrável.

### Payback descontado
Tempo até a soma dos fluxos descontados igualar o investimento. Se o fluxo é distribuído ao longo do ano, interpole dentro do ano em que o acumulado vira positivo.

Payback mede risco e liquidez: payback longo = mais tempo exposto, mais risco.

### Qual métrica usar
- Precisa recuperar o caixa rápido (empresa apertada, mercado instável): dê peso ao **payback**.
- Busca maximizar riqueza: **VPL** é o critério principal.
- Comparar retorno com custo de capital ou com outras oportunidades: **TIR**.
- Projetos mutuamente excludentes podem ter rankings diferentes em cada métrica. Um pode ter payback mais curto e VPL menor. Decida pelo objetivo da empresa e explicite a escolha.
- Em franquias e negócios vendidos a investidores, TIR e payback costumam ser informados. Peça sempre o fluxo de caixa que gerou esses números e refaça com premissas mais conservadoras.

---

## 4. Valor esperado, risco e cenários

Toda projeção é uma aposta. Para incorporar incerteza:
- **Fluxo esperado** = soma de (cenário × probabilidade).
- **Risco** pode ser medido pela dispersão dos resultados (desvio padrão): quanto mais espalhado, mais arriscado.

**Exemplo próprio:** um evento pode dar lucro de R$ −50 mil (20%), R$ 40 mil (50%) ou R$ 120 mil (30%). Esperado = −10 + 20 + 36 = R$ 46 mil. Mas há 20% de chance de perder R$ 50 mil. A empresa aguenta essa perda? Se não, o valor esperado positivo não basta.

**Diversificação:** dois projetos que oscilam em sentidos opostos reduzem o risco da carteira, mesmo que cada um seja arriscado sozinho. Para a PME, isso aparece em mix de clientes, de canais e de linhas de receita.

---

## 5. Dívida em projetos: quando alongar, quando encurtar

Financiar parte de um projeto com dívida muda VPL, TIR e payback do ponto de vista do sócio. As regras dependem de comparar a taxa do empréstimo com duas referências: a TIR do projeto sem dívida e a TMA.

- **Juro abaixo da TMA e abaixo da TIR do projeto (dívida barata):** quanto mais carência e mais prazo, melhor para o sócio em VPL, TIR e payback. Alongue.
- **Juro acima da TIR do projeto (dívida cara):** quanto menos carência e menos prazo, melhor. Pague rápido ou nem tome.
- **Situações intermediárias** (juro entre a TIR do projeto e a TMA): o que é bom para o VPL pode ser ruim para a TIR. Decida pelo que você quer maximizar e explicite.
- **Projeto com TIR abaixo da TMA:** não há estrutura de dívida que salve. O problema é o projeto.

**Regra de bolso para PME:** dívida barata e longa (linhas de fomento, financiamento de máquina com carência) costuma valer a pena para projeto bom. Dívida cara e curta (cheque especial, rotativo, antecipação recorrente) só para emergência.

### Financiamento por projeto (estrutura separada)
Em projetos grandes e de vida definida (energia, infraestrutura, um empreendimento imobiliário), é comum criar uma empresa só para o projeto (SPE), financiada principalmente por dívida que será paga pelo próprio fluxo do projeto, com garantias limitadas ao projeto. Vantagens: alavancagem alta, risco isolado da empresa principal. Exige projeção de caixa muito rigorosa e contratos bem amarrados. Para PME, aparece em incorporação imobiliária e em sociedades para um empreendimento específico. Envolver advogado e contador na estrutura.

---

## 6. Ponto de equilíbrio

- **Contábil:** receita de equilíbrio = custos e despesas fixos ÷ margem de contribuição %. Lucro zero.
- **Financeiro:** tira do fixo o que não sai do caixa (depreciação) e soma o que sai do caixa e não está na DRE (amortização de dívida). Caixa zero.
- **Econômico:** soma ao fixo a remuneração mínima do capital do sócio (TMA × capital investido). Lucro igual ao custo de oportunidade.

**Exemplo próprio:** fixo de R$ 90 mil por mês, margem de contribuição de 30%. Equilíbrio contábil = R$ 300 mil por mês. Se há R$ 15 mil de parcela de empréstimo e R$ 5 mil de depreciação: financeiro = (90 − 5 + 15) ÷ 0,30 ≈ R$ 333 mil. Se o sócio tem R$ 1 milhão investido e exige 1,5% ao mês: econômico = (90 + 15) ÷ 0,30 = R$ 350 mil.

**Margem de segurança** = (receita atual − receita de equilíbrio) ÷ receita atual.

---

## 7. Orçamento (budget)

O orçamento traduz a estratégia em números: quanto vender, quanto gastar, quanto investir, quanto caixa vai sobrar ou faltar. Ele serve para prever, coordenar áreas, conseguir comprometimento e depois acompanhar.

### Três orçamentos que conversam
1. **Operacional:** receitas e despesas do dia a dia, normalmente para 12 meses.
2. **De capital (investimentos):** máquinas, reformas, sistemas, desenvolvimento de produto, em horizonte de 3 a 5 anos ou mais. Esses gastos viram ativo e entram na DRE aos poucos pela depreciação.
3. **De caixa:** junta os dois anteriores com prazos de recebimento e pagamento e mostra se vai faltar dinheiro, e quando. É o mais importante para a PME.

Deles saem o balanço projetado e a DFC projetada.

### Sequência de montagem
1. Defina metas a partir da estratégia (ex.: crescer 20% com margem EBITDA de 15%).
2. Projete volume e preço por produto e canal. Considere histórico, concorrência, substitutos, sensibilidade a preço, recompra, ações comerciais planejadas.
3. Projete custos variáveis como % da receita ou por unidade.
4. Projete despesas fixas por linha, com índices de reajuste (inflação, dissídio, contratos) e o que muda de estrutura.
5. Liste investimentos com cronograma de desembolso.
6. Converta tudo em caixa com prazos médios de recebimento, estoque e pagamento.
7. Teste cenários e sensibilidade.
8. Aprove, comunique metas por área e defina responsáveis.

**Toda meta tem custo:** "ser o mais rápido no atendimento" exige mais gente de suporte; "crescer 10%" pode vir de preço (menos volume, mais margem), de marketing (mais despesa) ou de canal novo (mais custo de venda). O orçamento tem que mostrar esse custo.

### Fixo x variável
Classifique cada gasto pelo comportamento em relação ao volume. Variáveis típicos: matéria-prima, mão de obra direta por produção, embalagem, frete, comissão, tributos sobre venda, taxa de cartão. Fixos típicos: aluguel, salários administrativos, sistemas, depreciação, juros, marketing institucional. Na prática, o fixo sobe em degraus quando o volume cruza certos limites (nova contratação, novo galpão).

### Metodologias
- **Fixo (ano calendário) x contínuo (rolling):** o contínuo é refeito a cada mês ou trimestre, mantendo sempre 12 meses à frente. Melhor para ambiente instável.
- **Estático x flexível:** o flexível ajusta despesas automaticamente ao volume realizado. Bom para separar desvio de volume de desvio de eficiência.
- **Incremental x base zero:** o incremental parte do ano anterior e ajusta. O base zero obriga a justificar cada gasto do zero.
- **De cima para baixo x participativo:** a diretoria impõe metas, ou quem executa participa da definição. O participativo gera mais compromisso, o de cima para baixo é mais rápido. O comum é combinar.

### Orçamento base zero (OBZ)
- Cada gasto é ligado a uma atividade e a um nível de serviço, não ao histórico.
- Corta o gasto que "sempre existiu" sem que ninguém saiba por quê.
- Troca "faça mais com menos" por "gaste o certo no que importa".
- **Etapas:** dar visibilidade aos gastos; definir objetivos; nomear um dono por categoria de gasto (pessoal, tecnologia, viagens, ocupação); alocar metas por categoria; definir iniciativas; acompanhar mensalmente.
- **Contra:** é trabalhoso, caro e pode criar tensão cultural. Para PME, uma versão leve funciona bem: uma vez por ano, revise do zero as 10 maiores linhas de despesa.

### Acompanhamento: orçado x realizado
A diferença é a **variação**. Para cada variação relevante, identifique a causa e a ação:
- Custo de produção acima do orçado porque o volume foi maior: provavelmente nada a fazer (olhe o custo unitário).
- Custo acima porque o insumo subiu: repassar preço, renegociar, compensar em outra linha.
- Receita abaixo por volume: revisar despesas fixas ou reforçar comercial.
- Receita abaixo por preço médio: revisar política de desconto, mix e preço.

**Regra:** sempre separe a variação de receita em efeito volume, efeito preço e efeito mix. Sem isso, a discussão vira opinião.

### Sensibilidade e cenários
Escolha as 3 ou 4 premissas que mais mexem no resultado (volume, preço médio, custo do principal insumo, prazo de recebimento) e veja o efeito de variá-las. Monte pelo menos três cenários (conservador, base, otimista) e um plano de ação pré-definido para o conservador: o que cortar, em que ordem, a partir de que gatilho.

---

## 8. Modelagem em planilha: boas práticas

Modelos financeiros ajudam a comparar opções, medir benefício e custo e comunicar a decisão. Mas modelo malfeito dá número errado com aparência de precisão.

### Processo
1. **Planejar:** qual decisão o modelo apoia? Que resposta precisa sair? Quais as opções e as hipóteses? Quais os casos extremos? Quem vai usar e como?
2. **Construir:** decompor o resultado (lucro = receita − variável − fixo, receita = volume × preço por canal) até o nível em que existe dado. Identificar a fonte de cada dado. Não detalhar além do que a decisão precisa.
3. **Usar:** checar, testar sensibilidade, apresentar o resultado.

### Estrutura de abas
Premissas gerais (inflação, câmbio, juros) → premissas específicas (preço, produtividade, prazos) → dados históricos → cálculos → resultados → resumo. Um seletor de cenário no topo.

### O que fazer
- Inputs isolados, em cor diferente, e nunca um número digitado dentro de fórmula.
- Mesma coluna = mesmo período em todas as abas.
- Nomes consistentes.
- Fonte anotada para cada premissa.
- Checagens automáticas (balanço fecha, caixa bate, crescimento não negativo se não deveria).
- Versões numeradas a cada mudança importante. Não apague versões antigas.
- Teste de realidade: a ordem de grandeza faz sentido? As unidades estão certas? O histórico modelado bate com o real? Há saltos estranhos?
- Teste de estresse com valores extremos.

### O que não fazer
- Esperar que funcione de primeira.
- Misturar fontes sem conseguir rastrear.
- Construir uma aba gigante e confusa.
- Ceder à pressão de "deixar o benefício maior".
- Presumir que os dados não vão mudar no meio do caminho.

---

## 9. Usando IA na modelagem (com cuidado)

- IA acelera estrutura de modelo, fórmulas, cenários e revisão de consistência.
- Nunca aceite número gerado pela IA sem rastrear de onde veio. Peça sempre a fórmula, não o resultado.
- Peça para a IA listar premissas ocultas e casos extremos que você esqueceu.
- Valide qualquer cálculo de juros, TIR ou VPL refazendo na planilha.

---

## 10. Erros comuns

1. Somar valores de datas diferentes ("o projeto devolve R$ 500 mil em 5 anos, investimento de R$ 400 mil, lucro de R$ 100 mil").
2. Comparar taxa mensal com anual multiplicando por 12.
3. Ignorar inflação ao comparar retornos ou planejar reajustes.
4. Aprovar projeto pelo ROI sem prazo e sem comparar com a TMA.
5. Usar TMA baixa demais (taxa da poupança) para um projeto arriscado.
6. Acreditar em TIR e payback de franquia ou investimento sem refazer o fluxo.
7. Financiar projeto bom com dívida cara e curta, e projeto ruim com qualquer dívida.
8. Orçamento só de DRE, sem orçamento de caixa.
9. Orçamento feito uma vez e nunca acompanhado.
10. Explicar variação de receita sem separar volume, preço e mix.

---

## Checklist para avaliar um investimento

- [ ] Desenhei o fluxo de caixa (investimento, entradas, saídas, capital de giro adicional, valor residual)?
- [ ] Os fluxos são de caixa (não de lucro) e incrementais (só o que muda por causa do projeto)?
- [ ] Defini a TMA de acordo com o risco do projeto?
- [ ] Calculei VPL, TIR e payback descontado?
- [ ] Rodei cenário conservador e sensibilidade nas 3 premissas mais críticas?
- [ ] A empresa aguenta o pior cenário sem ficar sem caixa?
- [ ] Se há dívida, comparei o custo dela com a TIR do projeto e com a TMA?
- [ ] O projeto cabe no orçamento de caixa dos próximos 12 meses?
- [ ] Consultei o contador sobre o tratamento tributário (depreciação, crédito de tributos, regime)?
- [ ] Tenho critério e data para revisar se o projeto está entregando o prometido?
