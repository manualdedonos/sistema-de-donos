<!-- Síntese própria do Manual de Donos para a skill Diretor Financeiro. Não reproduz texto de terceiros. -->

# Valuation e gestão de valor

"Quanto vale minha empresa?" é a pergunta que todo dono faz e quase nenhum sabe responder. A resposta curta: vale o caixa que ela vai gerar no futuro, trazido a valor de hoje por uma taxa que reflete o risco. Todo o resto (múltiplos, EBITDA, rodada) é atalho ou negociação em cima dessa ideia. Esta referência organiza os conceitos de geração de valor, custo de capital e métodos de valuation para uso com PMEs brasileiras.

---

## 1. Lucro, caixa e valor são coisas diferentes

- **Receita:** quanto vendeu.
- **Lucro:** receita menos custos e despesas, por competência.
- **Caixa:** o que efetivamente entrou menos o que saiu.
- **Valor:** o caixa livre futuro, ajustado por risco e tempo.

Empresa pode crescer receita, ter lucro e quebrar, se a necessidade de caixa para crescer for maior que a capacidade de captar. Empresa pode ter prejuízo contábil por anos e valer muito, se o mercado acredita no caixa futuro (e se ela tiver dinheiro para atravessar até lá).

---

## 2. A função financeira em uma PME

Mesmo pequena, a empresa tem cinco frentes financeiras, que podem estar numa pessoa só:
- **Tesouraria:** contas a pagar e a receber, bancos, crédito, caixa diário.
- **Contabilidade e fiscal:** apuração de resultado e tributos (normalmente com escritório contábil).
- **Planejamento financeiro (FP&A):** orçamento, acompanhamento, projeções.
- **Controladoria:** custos, margens, indicadores, controles internos.
- **Relação com investidores:** só quando há sócios investidores ou board. Reporte periódico, governança.

O papel do diretor financeiro moderno vai além da técnica: é entender o negócio e decidir onde o dinheiro é alocado e como ele é captado. Três grupos de decisão: **investir** (onde aplicar), **financiar** (de onde vem o dinheiro) e **risco x retorno** (quanto risco vale a pena).

---

## 3. Fluxo de caixa livre (FCL)

É o dinheiro que sobra depois de pagar a operação e os investimentos necessários para mantê-la e fazê-la crescer. "Livre" porque está disponível para remunerar quem financiou a empresa: credores e sócios.

**Fórmula (para a empresa):**
```
EBIT (lucro operacional)
(−) Tributos sobre o EBIT (como se a empresa não tivesse dívida)
= NOPAT (lucro operacional após tributos)
(+) Depreciação e amortização
(−) Investimento em capital de giro operacional (variação)
(−) Capex (investimento em imobilizado e intangível operacionais)
= Fluxo de caixa livre para a empresa
```

**Tributo sobre o EBIT no Brasil:** em Lucro Real, use a alíquota efetiva de IRPJ e CSLL que o contador confirmar. Em Lucro Presumido e Simples Nacional, o tributo não incide sobre o lucro, mas sobre a receita: trate-o como dedução da receita na projeção e não aplique alíquota sobre o EBIT. Ao avaliar uma PME do Simples, considere também o que acontece se ela crescer e mudar de regime, porque a carga pode mudar bastante.

**Capital de giro operacional** = (caixa operacional mínimo + recebíveis + estoques + adiantamentos) − (fornecedores + salários e tributos a pagar + outras contas operacionais). Não entram aplicações financeiras nem empréstimos.

**Capex** = variação dos ativos operacionais de longo prazo, ou, de forma equivalente, ativos fixos do fim − ativos fixos do início + depreciação do período.

**Exemplo próprio:** EBIT de R$ 1 milhão, tributo efetivo sobre lucro hipotético de 30% (confirmar com o contador), NOPAT R$ 700 mil. Depreciação R$ 150 mil. Capital de giro subiu R$ 400 mil porque a empresa cresceu vendendo a prazo. Capex de R$ 500 mil. FCL = 700 + 150 − 400 − 500 = **−R$ 50 mil**. Lucro bonito, caixa livre negativo: o crescimento está consumindo tudo e mais um pouco.

**FCL para o sócio:** FCL da empresa − juros após o efeito tributário − amortização de dívida + nova dívida. É o que efetivamente pode ser distribuído.

**Destinos possíveis do FCL:** pagar juros e principal, distribuir lucros, recomprar participação, aplicar, adquirir outras empresas.

---

## 4. EBITDA: útil, mas não é caixa

EBITDA = lucro antes de juros, tributos sobre o lucro, depreciação e amortização. Muito usado porque facilita comparar empresas com estruturas de dívida, regimes tributários e políticas de depreciação diferentes.

**Limitações que o dono precisa saber:**
- Não é auditado e é fácil de "ajustar".
- Ignora a necessidade de capital de giro.
- Ignora o reinvestimento necessário (máquina que precisa ser trocada).
- É conta de resultado, não de caixa.

**Quando EBITDA se parece com FCL:** em empresa madura, com pouco investimento novo e capital de giro estável, o FCL fica próximo do EBITDA menos tributos. Em empresa em crescimento, capital-intensiva ou com ciclo de caixa longo, a distância é grande. Nunca aceite "vale X vezes o EBITDA" sem olhar quanto do EBITDA vira caixa.

**EBITDA ajustado na PME:** normalize para refletir a operação recorrente. Some despesas pessoais do dono pagas pela empresa; ajuste pró-labore para o valor de mercado de um gestor contratado (para mais ou para menos); tire receitas e despesas não recorrentes; ajuste aluguel pago a parte relacionada para valor de mercado.

---

## 5. Risco, retorno e custo de capital

### Risco e retorno
Quanto maior o risco, maior o retorno exigido. Uma startup tem que prometer retorno muito maior que uma distribuidora madura para atrair o mesmo investidor.

Parte do risco se elimina diversificando (risco específico); parte não se elimina (risco de mercado, da economia). Em empresas listadas, o **beta** mede quanto a ação oscila em relação ao mercado: beta 1 acompanha, 1,5 oscila 50% mais, 0,5 oscila metade. Beta de ação pouco negociada tende a sair artificialmente baixo, o que não quer dizer risco baixo.

### Custo do capital próprio (Ke)
Modelo mais usado (CAPM):
Ke = taxa livre de risco + beta × prêmio de risco de mercado

**Adaptação para Brasil**, quando se parte de referências americanas: taxa livre de risco americana + risco-país + beta × prêmio de mercado, em dólar; depois converte para reais pelo diferencial de inflação de longo prazo: (1 + Ke em US$) × (1 + inflação Brasil) ÷ (1 + inflação EUA) − 1. Alternativamente, parte-se diretamente de títulos públicos brasileiros longos.

**Na PME fechada,** o CAPM é só um ponto de partida. Acrescenta-se prêmio por tamanho e por iliquidez (não dá para vender a participação amanhã), e por dependência do dono. Na prática, investidores em PME brasileira exigem retornos bem acima do de grandes empresas listadas. Diga isso ao dono com clareza e não invente um número exato: monte faixas e justifique.

**Beta para empresa fechada:** pegue betas de empresas comparáveis listadas, retire o efeito da dívida delas e reaplique a dívida da sua:
- Beta desalavancado = beta alavancado ÷ [1 + (1 − t) × D/E]
- Beta realavancado = beta desalavancado × [1 + (1 − t) × D/E da empresa avaliada]

### Custo da dívida (Kd)
Kd efetivo = Kd nominal × (1 − alíquota de tributos sobre o lucro)
O benefício fiscal dos juros só existe quando os juros são dedutíveis na apuração, o que acontece no Lucro Real. Em Simples e Presumido, normalmente não há esse benefício: use o Kd cheio (confirme com o contador).

Fontes para estimar o Kd: custo médio das dívidas atuais (fácil, mas olha para o passado), ou taxa que a empresa conseguiria hoje para captar nova dívida (melhor para o futuro).

### WACC (custo médio ponderado de capital)
WACC = Ke × E/(D+E) + Kd × (1 − t) × D/(D+E)
- D = dívida líquida (dívida − caixa excedente)
- E = valor do capital próprio (de mercado, se listada; na fechada, use estrutura-alvo ou de empresas comparáveis)

É a taxa de desconto dos fluxos de caixa livres da empresa e a régua de retorno mínimo para qualquer projeto.

---

## 6. Estrutura de capital: quanto de dívida?

Capital próprio é mais caro que dívida, porque o sócio é o último a receber (se a empresa quebrar, credores recebem primeiro). Então por que não financiar tudo com dívida?

**A favor da dívida:** juros podem ser dedutíveis (no Lucro Real); o credor tem retorno fixo e não divide o lucro extraordinário; o credor não vota.
**Contra a dívida:** aumenta o risco do sócio (o risco do negócio fica concentrado em menos capital próprio); aumenta o custo do capital próprio; encarece nova dívida; em crise, o sócio cobre os juros; risco de falência.

**Custo de dificuldade financeira:** empresa muito alavancada perde antes de quebrar. Fornecedores encurtam prazo e pedem garantia, clientes desconfiam e somem, bancos cortam crédito, sócios não aportam. Esse custo invisível é o que limita a dívida.

**Ponto ótimo:** quando o benefício marginal de mais dívida (economia fiscal, menor WACC) se iguala ao custo marginal (risco de dificuldade). Para PME brasileira, com crédito caro e volátil, o ponto ótimo costuma ser bem mais conservador que em empresa grande.

---

## 7. Gestão de valor: ROIC, lucro econômico e valor de mercado

### ROIC
ROIC = NOPAT ÷ capital operacional investido
Capital operacional investido = capital de giro operacional + ativos fixos e intangíveis operacionais.

**A regra que resume finanças corporativas:** a empresa cria valor quando o ROIC é maior que o WACC. Se o ROIC é menor, cada real a mais investido destrói valor, mesmo que a DRE mostre lucro.

**Exemplo próprio:** o dono pegou R$ 500 mil a 15% ao ano para abrir uma filial que gera R$ 60 mil de lucro operacional após tributos por ano. ROIC = 12%. Está pagando 15% para ganhar 12%: destrói R$ 15 mil de valor por ano, apesar de a filial "dar lucro".

**Alavancas do ROIC:** margem operacional (preço, custo, mix) e giro do capital (estoque, prazo de recebimento, prazo de fornecedor, ativos ociosos, fazer ou comprar, terceirizar).

### Lucro econômico (EVA)
Lucro econômico = NOPAT − WACC × capital operacional investido
= (ROIC − WACC) × capital investido

Mostra, em reais, quanto a empresa ganhou acima do que os financiadores exigiam. Quatro formas de aumentar:
1. Investir onde o ROIC é maior que o WACC.
2. Melhorar o retorno do capital já investido.
3. Tirar capital de onde o retorno está abaixo do WACC (vender, fechar, enxugar).
4. Ajustar a mistura dívida/capital próprio para reduzir o WACC sem aumentar demais o risco.

**Uso na PME:** ótimo para decidir se abre filial, se mantém linha de produto, se compra a máquina ou terceiriza, e para alinhar bônus de gestor com criação de valor (e não só com faturamento).

### Valor de mercado adicionado
Valor da empresa − capital investido = valor presente dos lucros econômicos futuros.
**Lição:** crescimento só cria valor se vier com ROIC acima do WACC. Crescer com retorno abaixo do custo de capital acelera a destruição de valor.

---

## 8. Métodos de valuation

Use mais de um e triangule. Cada tipo de empresa favorece um método. Empresa em crescimento acelerado com prejuízo não se avalia bem por múltiplo de lucro.

### Valor contábil x valor intrínseco x valor de mercado
- **Valor contábil (patrimonial):** PL do balanço. Piso de referência para empresas de ativos pesados, quase irrelevante para empresas de serviço e tecnologia.
- **Valor da empresa (EV):** valor do negócio inteiro, para todos os financiadores.
- **Valor do capital próprio (equity):** EV − dívida líquida. É o que fica com os sócios.

### 8.1 Fluxo de caixa descontado (DCF)
EV = soma dos FCL projetados descontados pelo WACC + valor terminal descontado

**Passo a passo:**
1. Entenda o negócio a fundo: modelo de receita, drivers, sazonalidade, concorrência, macroeconomia (juros, inflação, PIB, câmbio).
2. Projete a DRE: receita por driver (histórico + plano + mercado), custos variáveis como % da receita, fixos com reajustes e degraus, depreciação.
3. Projete o balanço operacional: prazos médios de estoque, recebimento e pagamento; investimentos em ativos.
4. Calcule o FCL ano a ano.
5. Calcule o WACC.
6. Calcule o valor terminal: FCL do último ano × (1 + g) ÷ (WACC − g), sendo g o crescimento perpétuo (conservador, próximo ou abaixo do crescimento nominal da economia).
7. Desconte tudo para hoje e some.
8. Subtraia a dívida líquida para chegar ao valor do equity. Ajuste por ativos não operacionais (imóvel que não é usado, aplicações) e passivos ocultos (contingências trabalhistas e tributárias).

**Cuidados com o valor terminal:**
- Ele costuma ser a maior parte do valor total, muitas vezes mais da metade. Pequenas mudanças em g ou no WACC mudam muito o resultado.
- Projete até o negócio estabilizar (margens e crescimento constantes). Período curto demais infla o terminal.
- g nunca pode ser igual ou maior que o WACC.

**Sensibilidade obrigatória:** tabela de valor com WACC e g variando. Apresente faixa, não um número.

### 8.2 Múltiplos de mercado (empresas comparáveis)
Valor = indicador da empresa × múltiplo de empresas parecidas.

**Seleção dos comparáveis:** comece amplo (todas do setor), exclua as que não são comparáveis por critério técnico (porte, modelo, geografia, estrutura de custo) e fique com um grupo restrito realmente parecido em crescimento e rentabilidade.

**Múltiplos comuns:**
- Sobre o valor do equity: preço/lucro (P/L), preço/valor patrimonial, preço/fluxo de caixa.
- Sobre o EV: EV/receita, EV/EBITDA, EV/EBITA, EV/EBIT.

**Qual usar:**
- P/L é o mais citado, mas é distorcido pela dívida e por resultados não operacionais. Duas empresas com a mesma operação e dívidas diferentes terão P/L diferentes.
- EV/EBITDA ignora que uma empresa com muita depreciação (frota própria, máquinas) vai precisar reinvestir. Compara mal quem produz com quem terceiriza.
- EV/EBITA (lucro operacional antes da amortização de intangíveis de aquisições, mas depois da depreciação) costuma ser o mais justo entre empresas, porque considera o desgaste dos ativos e não é afetado por aquisições passadas.
- EV/receita só para empresas sem lucro ou em fases iniciais, e com muita cautela.

**Consistência:** numerador e denominador devem se referir aos mesmos ativos. Se tirou o caixa do valor, tire o rendimento financeiro do lucro.

**Ajustes antes de comparar:** itens extraordinários e não recorrentes, remuneração do dono, ativos não operacionais, critérios de estoque diferentes, incentivos fiscais temporários.

**Exemplo próprio:** uma rede de clínicas com EBITDA ajustado de R$ 3 milhões. Transações recentes de redes parecidas saíram entre 5x e 7x EBITDA. Faixa de EV: R$ 15 a 21 milhões. Dívida líquida de R$ 4 milhões. Equity: R$ 11 a 17 milhões. Depois, desconto por tamanho menor, dependência do fundador e concentração em uma cidade. Isso é negociação, não fórmula.

**Múltiplos de bolsa x de transações:** múltiplos de empresas listadas refletem participações minoritárias líquidas; transações de compra de controle embutem prêmio de controle e sinergias. PME fechada costuma valer múltiplos menores que listadas, pela iliquidez e pelo risco.

**Atenção:** a skill não deve inventar múltiplos setoriais. Se o dono pedir "quanto paga o mercado", diga que é preciso pesquisar transações recentes do setor e porte, e trate qualquer número como faixa a ser confirmada.

### 8.3 Valor e preço
Valor é uma estimativa técnica. Preço é o que sai da negociação entre um comprador e um vendedor específicos, e cai em algum lugar dentro da faixa que cada um aceita. O vendedor deve chegar sabendo o seu valor mínimo; o comprador, o seu máximo. Sinergias que só um comprador específico enxerga podem justificar preço acima do valor isolado.

---

## 9. Investidores: fundo de participação e venture capital

### Fundos de participação (private equity) e compra alavancada
Compram participação relevante ou controle em empresas maduras, muitas vezes usando dívida garantida pelos ativos da própria empresa comprada.

**Múltiplo sobre capital investido (MOIC)** = valor recebido na saída ÷ valor investido. Compra por R$ 100 milhões e venda por R$ 200 milhões dá 2x. Se metade da compra foi com dívida, o capital próprio de R$ 50 milhões vira R$ 150 milhões depois de quitar a dívida: 3x para o sócio (os números exatos dependem de quanto da dívida foi paga com o caixa da empresa). Alavancagem multiplica o retorno, e o risco.

**Perfil de empresa que esses investidores procuram:** pouca dívida, caixa previsível, ativos que servem de garantia, ineficiência operacional a corrigir, portfólio relevante, mercado favorável.

**Disciplinas que eles aplicam e que qualquer PME pode copiar:**
- Tese clara para 3 a 5 anos, com 2 ou 3 alavancas principais (e não só corte de custo).
- Poucas métricas, focadas em caixa e valor, não em lucro contábil.
- Trabalhar o balanço: eliminar capital parado (estoque, ativo ocioso), tratar capital como escasso.
- Dívida usada com critério, para foco e alavancagem, sempre pesando risco.
- Remuneração de executivos ligada à criação de valor, concentrada em quem gera resultado, e não espalhada.
- Distribuir caixa em excesso em vez de deixar parado.
- Vender quando o preço é justo, sem apego.

### Venture capital
Investe em empresas em estágio inicial com potencial de crescimento muito rápido, esperando retorno em 3 a 7 anos via venda ou abertura de capital. Procura tecnologia ou modelo inovador, mercado grande, modelo de negócio estruturado e time forte.

**Mitos a desfazer com o fundador:** nem todo fundo toma tanto risco quanto parece; nem todo fundo traz mentoria valiosa; fundo grande não é necessariamente melhor; venture capital não é a principal fonte de recursos da maioria das empresas; o retorno médio da indústria não é espetacular.

**Estágios:** ideia e pré-semente (fundador, amigos, investidor-anjo), semente, séries A, B, C (venture capital), maturidade (private equity), saída (venda ou abertura de capital).

**Para o fundador:** cada rodada dilui a participação. Entender cap table, valuation pré e pós-dinheiro e cláusulas (preferência de liquidação, antidiluição, direito de veto) é tão importante quanto o número do valuation. Recomende advogado especializado em qualquer rodada.

---

## 10. Preparar a empresa para ser avaliada

1. **Três anos de demonstrações confiáveis**, idealmente com DRE gerencial reconciliada com a contábil.
2. **Separação total PF/PJ.** Despesa pessoal na empresa derruba confiança e valor.
3. **EBITDA ajustado documentado**, com cada ajuste justificado.
4. **Capital de giro sob controle** e com prazos estáveis.
5. **Contingências mapeadas** (trabalhista, tributária, cível). Comprador vai achar; melhor você achar antes.
6. **Contratos formalizados** com clientes, fornecedores, sócios e funcionários-chave.
7. **Dependência do dono reduzida:** processos documentados, segundo nível de gestão.
8. **Receita recorrente e diversificada.** Concentração em poucos clientes reduz múltiplo.
9. **Projeção crível** com premissas explícitas.
10. **Regime tributário e passivos fiscais revisados** com contador e tributarista.

---

## Erros comuns

1. Achar que a empresa vale "o que eu investi nela".
2. Usar faturamento × um múltiplo ouvido numa conversa.
3. Confundir EV com valor do equity e esquecer de descontar a dívida.
4. Usar EBITDA sem ajustes, ou com ajustes "criativos".
5. Taxa de desconto baixa demais para o risco de uma PME.
6. Crescimento perpétuo otimista no valor terminal.
7. Projeção de hockey stick sem explicar o que muda para a receita triplicar.
8. Esquecer o capital de giro e o capex que o crescimento exige.
9. Ignorar contingências e passivos fora do balanço.
10. Tratar valor como preço e não se preparar para a negociação.

---

## Checklist rápido de valuation

- [ ] Tenho DRE, balanço e DFC dos últimos 3 anos, ajustados para a operação recorrente?
- [ ] Calculei EBITDA ajustado e o quanto dele vira caixa livre?
- [ ] Sei o capital de giro e o capex necessários para o plano?
- [ ] Defini taxa de desconto em faixa, com justificativa (risco, tamanho, iliquidez)?
- [ ] Rodei DCF com sensibilidade de WACC e crescimento perpétuo?
- [ ] Rodei múltiplos com comparáveis realmente parecidos, deixando claro que precisam ser confirmados?
- [ ] Converti EV em valor do equity (dívida líquida, ativos não operacionais, contingências)?
- [ ] Calculei ROIC x WACC para saber se o negócio cria valor hoje?
- [ ] Apresentei uma faixa de valor e separei valor de preço?
- [ ] Recomendei contador, tributarista e advogado nos pontos que exigem?
