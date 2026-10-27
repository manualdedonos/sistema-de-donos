# Score, Churn e Armadilhas — referência de trabalho

## Os 12 critérios da Nota de Potencial de Assinatura

Avalie cada critério no contexto do negócio. A nota final (0-10) não é média aritmética cega: os critérios 1, 4 e 9 são **eliminatórios na prática** — se os três forem fracos, a nota final não passa de 3, não importa o resto. Os critérios 8, 10 e 12 afetam mais a *viabilidade econômica* do que o *desejo do cliente*.

| # | Critério | Pergunta | Puxa a nota PARA CIMA quando... | Puxa PARA BAIXO quando... |
|---|---|---|---|---|
| 1 | **Frequência natural de necessidade** | O cliente precisa disso repetidamente? | Necessidade semanal/mensal intrínseca (comer, treinar, repor, manter) | Compra esporádica ou única (reforma, festa de casamento, móvel) |
| 2 | **Previsibilidade da necessidade** | Dá para prever quando ele precisa de novo? | Ciclo regular e conhecido (ração acaba em 30 dias, lente em 30 dias) | Necessidade errática, disparada por eventos imprevisíveis |
| 3 | **Dor de recompra** | Comprar de novo custa tempo, atenção, deslocamento? | Recompra é chata, esquecível, envolve pesquisa ou logística | Recomprar é trivial e até prazeroso (o cliente GOSTA de escolher) |
| 4 | **Valor contínuo** | Existe valor entregue ENTRE uma compra e outra? | Acesso, monitoramento, prevenção, conteúdo, comunidade, garantia rodando o mês todo | O valor só existe no momento do consumo e nada acontece no intervalo |
| 5 | **Conveniência** | A assinatura tira uma tarefa da cabeça do cliente? | Automatiza decisão/logística que o cliente hoje carrega | Não remove esforço nenhum — só muda a forma de pagar |
| 6 | **Exclusividade possível** | Há benefícios que podem ser só de assinante? | Acesso antecipado, agenda prioritária, itens/turmas exclusivas, preço de sócio | Tudo que a assinatura daria já é (ou precisa ser) dado a todos |
| 7 | **Personalização** | Conhecer o cliente ao longo do tempo melhora a entrega? | Histórico gera curadoria/ajuste melhor a cada ciclo (dados viram serviço) | A entrega é idêntica no mês 1 e no mês 24 |
| 8 | **Margem** | A margem banca benefícios sem destruir rentabilidade? | Margem bruta alta (>50%) ou custo marginal baixo por assinante | Margem apertada — qualquer desconto/benefício come o lucro |
| 9 | **Retenção estrutural** | Existe razão ESTRUTURAL para continuar pagando? | Hábito, dados acumulados, custo de troca, integração à rotina, contrato de uso | O cliente pode sair a qualquer momento sem perder nada |
| 10 | **Variabilidade de custo** | Heavy users podem descontrolar o custo? | Custo por assinante é estável e previsível | Uso ilimitado com custo marginal alto (buffet, serviço intensivo em hora) |
| 11 | **Frequência de uso percebida** | O cliente USA com frequência suficiente para sentir valor? | Toca o serviço toda semana; o valor é visível no extrato mental | Usa 1x por trimestre e todo mês vê a cobrança sem ver o benefício |
| 12 | **Ganho operacional para a empresa** | Recorrência ajuda a prever demanda/estoque/capacidade? | Previsibilidade destrava compra melhor, escala de equipe, menos desperdício | A operação não muda nada com previsibilidade |

**Atenção à diferença entre 1 e 11:** o cliente pode PRECISAR todo mês (critério 1 alto) mas não PERCEBER o uso (critério 11 baixo) — caso clássico de seguros e manutenção preventiva. Isso não mata a assinatura, mas exige mecanismo de valor visível (relatório mensal, check-up, benefício de uso corrente) para o cliente não cancelar "porque nunca usa".

## Os 7 tipos de churn — e o antídoto de cada um

| Tipo | Sintoma | Mitigação principal |
|---|---|---|
| **Por preço** | "Está caro" — geralmente significa "não vale o que custa" | Reancorar valor antes de mexer no preço; caminho para um plano menor em vez de cancelamento seco |
| **Por baixo uso** | Cliente não usa e cancela na fatura | Onboarding ativo nos primeiros 30 dias (ativação é a métrica-mãe); lembretes de uso; resgate proativo de inativos ANTES da renovação |
| **Por valor não percebido** | Usa, mas não conecta o uso ao pagamento | Tornar o valor visível: resumo mensal ("você economizou R$ X", "recebeu Y itens", "usou Z vezes") |
| **Involuntário** | Cartão expirado, limite, falha de cobrança | Dunning: retentativas automáticas, aviso pré-vencimento, múltiplos meios de pagamento, Pix recorrente. Costuma ser uma fatia grande do churn total em B2C (a faixa de 20-40% é ordem de grandeza, não dado de mercado; confirme com os dados do negócio) — é o churn mais barato de resolver |
| **Por experiência ruim** | Atraso, erro, atendimento ruim | SLA claro; recuperação generosa no primeiro erro (o assinante perdoa 1 falha bem resolvida, não 2) |
| **Por mudança de necessidade** | A vida do cliente mudou (mudou de cidade, filho cresceu, projeto acabou) | Pausa de assinatura (em vez de cancelamento), planos flexíveis, troca de produto dentro do clube |
| **Por alternativa competitiva** | Concorrente ofereceu mais/mais barato | Aprofundar lock-in de valor (dados, histórico, personalização, comunidade) — não lock-in contratual, que gera ressentimento |

Regra de leitura: **churn dos meses 1-3 é problema de venda/onboarding** (vendeu para a pessoa errada ou não ativou). **Churn do mês 6+ é problema de valor contínuo.** Trate diferente.

## As 9 armadilhas de assinatura

Para cada modelo desenhado, verifique quais destas se aplicam. Aponte só as relevantes.

1. **Assinatura-forçada** — o cliente preferiria comprar avulso; a recorrência serve à empresa, não a ele. *Teste: se a compra avulsa sumisse, o cliente agradeceria ou reclamaria?* Mitigação: voltar ao objeto da recorrência — o que ele quer de novo e de novo?
2. **Promessa maior que a entrega** — a promessa na venda é maior que o valor sentido no mês 2. Mitigação: prometer o piso, entregar o teto; primeiro ciclo caprichado (o mês 1 define a percepção dos próximos 12).
3. **Uso acima do plano** — clientes que usam muito destroem a margem no "ilimitado". Mitigação: regra de uso justo escrita, limite por plano e cobrança por uso acima do teto. Modele o P90 de uso, não a média.
4. **Uso abaixo do plano** — cliente usa pouco, sente desperdício, cancela. Mitigação: planos dimensionados ao uso real, créditos que passam parcialmente para o mês seguinte, troca fácil para um plano menor (melhor um assinante menor que um ex-assinante).
5. **Fadiga de assinatura** — a cobrança compete com dezenas de outras no cartão. Mitigação: valor visível todo mês (ver churn por valor não percebido); anual com desconto para sair da guerra mensal do extrato.
6. **Benefício artificial** — a empresa PIORA o produto normal para empurrar a assinatura. Destrói confiança na base inteira. Mitigação: assinatura precisa ADICIONAR valor, nunca sequestrar valor que já existia.
7. **Desconto disfarçado** — a única vantagem é preço menor. Isso é tabela de preço com fidelização, não assinatura; atrai caçador de desconto (o pior assinante) e comprime margem. Mitigação: desconto pode existir, mas como UM dos benefícios, nunca o único.
8. **Complexidade operacional** — personalização/logística/atendimento da assinatura comem a margem que ela deveria criar. Mitigação: começar com a versão operacionalmente mais burra que ainda entrega o valor central; sofisticar só depois de reter.
9. **Churn estrutural** — a necessidade acaba naturalmente rápido (curso com fim, produto de fase da vida — enxoval de bebê, preparação para uma prova). Mitigação: ou aceitar LTV curto e precificar por isso, ou desenhar a "próxima jornada" dentro do mesmo clube (o cliente muda de estágio, não de fornecedor).
