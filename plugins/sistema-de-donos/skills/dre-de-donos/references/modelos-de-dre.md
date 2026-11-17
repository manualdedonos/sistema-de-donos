# Modelos de DRE: estágio, tipo de negócio e regime

O estágio define **quantas linhas** a DRE tem. O tipo de negócio define **o que entra em cada linha e como ela se chama**. O regime tributário define **como os impostos aparecem**.

## 1. Estágio: escolha pelo controle, não pelo faturamento

| Estágio | Sinais | Formato |
|---|---|---|
| **1 · Começando** | Não tem DRE. Controla pelo extrato, pelo caderno, pela maquininha ou de cabeça. Mistura conta da empresa e conta pessoal. | **DRE simples**: 8 números de entrada, 4 resultados. |
| **2 · Crescendo** | Tem planilha, sistema ou balancete do contador, mesmo atrasado. Já separa custo de despesa em parte. Tem equipe e alguma dívida ou financiamento. | **DRE gerencial**: 14 números de entrada, 5 resultados, com pró-labore, EBITDA, depreciação, juros e IR. |
| **3 · Consolidado** | Tem DRE todo mês, sistema de gestão, áreas com responsáveis. Quer profundidade e comparação mês a mês. | **DRE completa**: 19 números de entrada, 7 resultados, com despesas variáveis abertas, tecnologia, EBIT e resultado financeiro aberto. |

Desempate: se faturamento e controle apontam estágios diferentes, vale o controle. Uma empresa de R$ 20 milhões por ano que nunca fez DRE começa no estágio 2 (nunca no 1 com esse porte: há dívida, depreciação e IR demais para esconder). Um negócio pequeno e bem controlado pode ir para o 2. Na dúvida, o estágio menor: é mais fácil abrir linha depois do que explicar linha vazia.

O painel aceita subir de estágio a qualquer momento: basta mudar `estagio` e preencher as linhas novas.

## 2. Linhas por estágio

Todos os valores entram **positivos**, em reais inteiros do mês. O painel aplica o sinal e calcula os resultados (linhas com `=`). Nunca envie os resultados no JSON.

### Estágio 1 · DRE simples

```
(+) receita_bruta          Receita bruta
(−) impostos_vendas        Impostos sobre as vendas
 =  Receita líquida
(−) custo_direto           Custo direto (o nome muda pelo tipo de negócio)
 =  Lucro bruto
(−) despesas_variaveis     Despesas que variam com a venda (taxa de cartão, comissão, frete)
 =  Margem de contribuição
(−) pessoal                Pessoal (equipe e a retirada do dono)
(−) ocupacao               Aluguel e estrutura
(−) marketing              Marketing e vendas
(−) outras_fixas           Demais despesas (contador, sistemas, banco, outras)
 =  Lucro líquido (resultado do mês)
```

No estágio 1 a retirada do dono entra em `pessoal` e os juros e tarifas entram em `outras_fixas`. Registre em `premissas` quanto da linha `pessoal` é retirada.

### Estágio 2 · DRE gerencial

```
(+) receita_bruta
(−) impostos_vendas
(−) devolucoes             Devoluções e descontos
 =  Receita líquida
(−) custo_direto
 =  Lucro bruto
(−) despesas_variaveis
 =  Margem de contribuição
(−) pessoal                Pessoal (salários, encargos e benefícios), sem os sócios
(−) pro_labore             Pró-labore dos sócios
(−) ocupacao
(−) marketing
(−) administrativas        Contador, advogado, sistemas, telefone, seguros
(−) outras_fixas
 =  EBITDA (lucro da operação)
(−) depreciacao            Depreciação e amortização
(−) despesas_financeiras   Juros e tarifas
(−) ir_csll                IR e CSLL
 =  Lucro líquido
```

### Estágio 3 · DRE completa

Igual ao estágio 2, com estas diferenças:

- `despesas_variaveis` é aberta em `comissoes`, `taxas_pagamento`, `fretes` e `outras_variaveis`. Use as abertas **ou** a agregada, nunca as duas.
- entra `tecnologia` (sistemas, licenças, hospedagem fora do custo direto), separada de `administrativas`;
- aparece o resultado `EBIT` depois da depreciação;
- o financeiro abre em `receitas_financeiras` e `despesas_financeiras`, e aparece o resultado `Lucro antes do IR`.

Linha fora do estágio que tiver valor aparece no painel mesmo assim. Use isso com parcimônia: no estágio 1, só inclua `pro_labore` ou `despesas_financeiras` se o dono trouxer o número e ele for relevante (acima de 3% da receita).

## 3. Fórmulas (as mesmas do painel e do script)

```
Receita líquida         = receita bruta − impostos sobre vendas − devoluções
Lucro bruto             = receita líquida − custo direto
Margem de contribuição  = lucro bruto − despesas variáveis
EBITDA                  = margem de contribuição − despesas fixas
                          (pessoal, pró-labore, aluguel e estrutura, marketing, tecnologia, administrativas, outras)
EBIT                    = EBITDA − depreciação
Lucro antes do IR       = EBIT + receitas financeiras − despesas financeiras
Lucro líquido           = lucro antes do IR − IR e CSLL

Margem bruta, de contribuição, EBITDA e líquida = cada resultado ÷ receita líquida
Peso da folha           = (pessoal + pró-labore) ÷ receita líquida
Ponto de equilíbrio     = (despesas fixas + depreciação + juros líquidos) ÷ margem de contribuição em %
Margem de segurança     = (receita líquida − ponto de equilíbrio) ÷ receita líquida
Receita por funcionário = receita líquida ÷ pessoas na equipe
CAC                     = (marketing + comissões) ÷ clientes novos
Ticket médio            = receita bruta ÷ número de vendas
Fôlego de caixa         = caixa no fim do mês ÷ saída média por dia
```

## 4. Tipo de negócio: nome do custo direto e o que entra

Preencha `rotulos.custo_direto` com o nome da tabela e `ajudas.custo_direto` com uma explicação no vocabulário do negócio dele (uma a três frases, com exemplo).

| Tipo de negócio | Nome da linha | O que entra no custo direto | O que NÃO entra (vai para despesa) |
|---|---|---|---|
| Comércio (loja, mercado, farmácia, pet, material de construção) | CMV (custo da mercadoria vendida) | Custo de compra do que saiu no mês, com frete de compra | Compras que ficaram no estoque; vendedores (pessoal); taxa de cartão (variável) |
| E-commerce | CMV (custo da mercadoria vendida) | Custo do que foi vendido e embalagem do produto | Comissão de marketplace, gateway e frete de envio (variáveis); anúncios (marketing) |
| Alimentação (restaurante, bar, padaria, lanchonete) | CMV (insumos e bebidas) | Insumos, bebidas e embalagens de delivery que saíram | Cozinha e salão (pessoal); taxa do aplicativo (variável); gás e energia (estrutura) |
| Indústria | CPV (custo do produto vendido) | Matéria-prima, embalagem, mão de obra da produção com encargos, energia e manutenção da fábrica | Produção que ficou no estoque; administrativo e comercial (pessoal); frete de entrega (variável) |
| Serviços (agência, consultoria, contabilidade, TI, limpeza) | CSP (custo de entregar o serviço) | Salários e encargos de quem executa, terceirizados, freelancers, insumos e ferramentas da entrega | Administrativo e comercial (pessoal); sócios (pró-labore) |
| Saúde e beleza (clínica, consultório, salão, estética) | CSP (custo do atendimento) | Repasse a profissionais parceiros, materiais, laboratório | Recepção e administrativo (pessoal); aluguel de sala (estrutura) |
| Educação e academia | CSP (custo das aulas) | Professores e instrutores, material didático | Secretaria e comercial (pessoal); aluguel (estrutura) |
| Tecnologia e SaaS | Custo de servir (infra, suporte, licenças) | Hospedagem, licenças de terceiros embutidas, suporte e implantação | Desenvolvimento, vendas e administrativo (pessoal); anúncios (marketing) |
| Construção e reformas | Custo de obra | Materiais, empreiteiros e mão de obra das obras faturadas no mês | Engenharia e escritório (pessoal); equipamento próprio (depreciação) |
| Transporte e logística | Custo da operação | Combustível, motoristas com encargos, pedágio, manutenção, agregados | Administrativo (pessoal); depreciação dos veículos |

Regra para a mão de obra: quem **executa a entrega** entra no custo direto; quem **vende, administra ou lidera** entra em pessoal. No estágio 1, se o dono não consegue separar, coloque toda a equipe em `pessoal`, deixe no custo direto só material e terceiros, e registre a escolha em `premissas`.

O comissionado de salão ou clínica (profissional parceiro que recebe percentual) é custo direto. Comissão de vendedor é despesa variável.

## 5. Regime tributário: onde os impostos aparecem

| Regime | `impostos_vendas` | `ir_csll` | Cuidados |
|---|---|---|---|
| **MEI** | A guia fixa do mês (pouco mais de R$ 80) | Não tem: deixe `0` | Limite de R$ 81 mil por ano. Se a receita do mês passa de R$ 6.750 com frequência, avise que vale conversar com o contador. |
| **Simples Nacional** | A guia do DAS do mês, inteira | Deixe `0`: já está no DAS | No estágio 2 ou 3, diga em `ajudas.ir_csll` que o imposto sobre o lucro está dentro do DAS. A contribuição patronal também está no DAS (menos no Anexo IV). |
| **Lucro Presumido** | ISS ou ICMS, mais PIS e Cofins (3,65% no cumulativo) | IRPJ e CSLL do trimestre ÷ 3 | A base do IR é presumida (8% da receita no comércio e na indústria, 32% nos serviços), não o lucro real. Com margem real menor que a presumida, o imposto pesa: vira achado. |
| **Lucro Real** | ICMS, ISS, PIS e Cofins, já líquidos dos créditos | IRPJ e CSLL apurados (cerca de 34% do lucro antes do IR) | Depreciação e juros reduzem o imposto. Peça o valor apurado ao contador; sem ele, estime e marque. |

Se o dono não sabe o regime: "O contador manda uma guia só por mês, chamada DAS, ou várias guias?" Uma só é Simples. Receita abaixo de R$ 400 mil por mês sem outra informação: assuma Simples e marque em `premissas`.

Alíquotas para estimar estão em `benchmarks.md`, seção 4.

## 6. Competência: a regra que mais confunde

A DRE registra o que aconteceu no mês, não o que passou pelo banco.

- **Venda** entra no mês em que foi feita, inteira, mesmo parcelada ou a prazo.
- **Custo da mercadoria** entra quando a mercadoria é vendida, não quando é comprada.
- **Despesa** entra no mês a que se refere: o aluguel de outubro é de outubro, mesmo pago em novembro.
- **Não entram na DRE**: empréstimo recebido, dinheiro que o sócio colocou, parcela principal de empréstimo (só os juros), compra de máquina ou reforma (entra aos poucos, como depreciação), distribuição de lucro, compra de estoque que não foi vendido.

Se o dono só tem os números do banco (regime de caixa), monte assim mesmo, diga em uma frase que é uma DRE "pelo que passou no banco" e registre em `premissas`. É melhor uma DRE de caixa do que nenhuma. Três ajustes mínimos, se ele souber: tirar empréstimo e aporte da receita, tirar compra de máquina e parcela principal das despesas, e trocar compras do mês por custo do que foi vendido.
