# Os 15 casos de uso do Mapa da Operação Eficiente

Esta é a base do diagnóstico. São os 15 lugares onde IA devolve caixa e tempo numa pequena ou média empresa brasileira, organizados em 5 frentes de 3 casos. Cada caso traz: o que é, o sinal de que é para este negócio, como fica com IA, a camada do Claude recomendada, a conta do ganho (fórmula, não número mágico), a nota-base de esforço e impacto (que você ajusta com as respostas do dono) e, quando existe, o Manual de IA do Manual de Donos que ensina a montar aquilo passo a passo (biblioteca: acesso.manualdedonos.com/t/manual-de-ai; cite o número quando o dono for membro).

Regra de leitura: a nota-base é um ponto de partida, não um veredito. O mesmo caso pode ser impacto 3 numa clínica com 40% de falta de pacientes e impacto 1 num escritório que atende 5 clientes por mês. Ajuste sempre pelas respostas, e diga ao dono por que ajustou.

Escala: esforço 1 = uma tarde, só com o chat ou um Project; 2 = uma semana, com conector ou skill; 3 = um mês, com automação ou integração. Impacto 1 = conveniência; 2 = horas por semana devolvidas ao time; 3 = dinheiro direto no caixa (atraso recuperado, venda que deixava de acontecer, contratação evitada) ou mais de 3 horas por semana do dono devolvidas.

## As regras de conta (valem para todos os casos)

- **Custo-hora de uma pessoa** = salário bruto × 1,27 (empresa no Simples Nacional) ou × 1,55 (Lucro Presumido ou Real) ÷ 176 horas/mês. Os multiplicadores cobrem FGTS, 13º, férias com 1/3 e, fora do Simples, INSS patronal, RAT e Sistema S (levantamento ValorFinal, 2026: valorfinal.com.br/estudos/quanto-custa-um-funcionario-clt). Benefícios (vale-transporte, refeição, plano) entram por cima, se o dono informar. Se o dono já tem o custo total do cargo, use o dele.
- **Custo-hora do dono**: pergunte quanto ele considera que vale a hora dele; se não souber, use a retirada mensal ÷ 176 e escreva "a confirmar".
- **Percentuais de melhora são premissas, nunca fatos.** Cada caso traz uma faixa de referência (ordem de grandeza observada em operações parecidas); use sempre o **piso** da faixa, escreva "premissa:" antes do número e proponha medir em 30 dias. Se o dono tiver o histórico dele (quanto já recuperou, quanto a falta caiu quando lembraram), o número dele substitui a faixa.
- **Horas economizadas**: premissa de 30% a 50% do tempo da tarefa na primeira versão (a IA faz o rascunho, a pessoa revisa); use 30%. Automação completa só depois da rotina provar que acerta.
- **Dados de mercado** (Sebrae, Nu Empresas/Bridge Research, ValorFinal) servem para contextualizar, com a fonte ao lado; nunca entram na conta do dono no lugar do número dele.

---

## Frente 1 — CAIXA

### Caso 1 · Fechamento e leitura semanal do caixa

**O que é.** Toda semana, o extrato bancário, a planilha de recebíveis e a lista de pagamentos viram um relatório de uma página: quanto entrou, quanto saiu, quem não pagou, o que vence nos próximos 15 dias e o que mudou em relação à semana anterior.

**Sinal de que é para este negócio.** O dono só descobre que o mês fechou apertado quando o mês acabou; o fluxo de caixa é uma planilha que alguém atualiza "quando dá"; a contabilidade entrega o resultado 20 dias depois do fechamento.

**Como fica com IA.** O dono (ou o financeiro) sobe o extrato em CSV/OFX e a planilha num Project do Claude que já conhece as categorias da empresa e o formato do relatório. Pede: "fecha a semana". Recebe o relatório padronizado, com alertas. Com um conector de planilha (Google Drive/Sheets), nem o upload precisa.

**Camada.** Project (instruções + categorias + modelo do relatório) → evolui para Skill quando o formato estabiliza → conector Drive/Sheets para tirar o upload manual.

**A conta do ganho.** Horas do fechamento manual por semana × 30% a 50% (premissa; use 30%) × custo-hora de quem faz × 4,3 semanas. Mais o ganho que não cabe em fórmula: decidir com dado de 7 dias atrás em vez de 30. Contexto: no estudo "Tempo é dinheiro" (Nu Empresas/Bridge Research, jul/2026, 1.200 donos), controle de entradas e saídas e gestão do fluxo de caixa aparecem entre as tarefas que mais consomem tempo para 41% e 37% dos pequenos negócios.

**Nota-base.** Esforço 1 · Impacto 3.

**Sobe o impacto se:** o dono faz o fechamento ele mesmo; a empresa tem mais de 50 lançamentos por semana; já houve surpresa de caixa nos últimos 6 meses. **Cai se:** há um financeiro com ERP que já entrega isso no dia. **Pergunte antes:** o ERP ou o banco já tem conciliação automática ou relatório pronto que ninguém liga? Se tem, a IA entra na leitura e nos alertas, não na conciliação.

### Caso 2 · Cobrança e recuperação de inadimplentes

**O que é.** Uma régua de cobrança: mensagens diferentes para 3, 10, 30 e 60 dias de atraso, no tom da casa, personalizadas com nome, valor e opção de regularizar, prontas para o WhatsApp ou e-mail. E uma lista semanal de quem cobrar primeiro, por valor e probabilidade de recuperar.

**Sinal de que é para este negócio.** Valor em atraso acima de 3% do faturamento **mensal** ou acima de R$ 10 mil; cobrança feita "quando alguém lembra"; o dono tem vergonha de cobrar cliente conhecido e por isso não cobra.

**Como fica com IA.** A lista de inadimplentes (planilha exportada do sistema de cobrança ou do banco) entra no Claude com a régua já definida. Saem as mensagens de cada cliente, na faixa certa de atraso, e um ranking de prioridade. Quem envia continua sendo uma pessoa (ou a ferramenta de disparo que a empresa já usa), o que mantém o controle do tom.

**Camada.** Chat com um prompt-modelo (dia 1) → Project com a régua e exemplos de mensagens aprovadas → Skill "cobrar a semana".

**A conta do ganho.** Valor em atraso por faixa × percentual recuperado a mais com cobrança consistente. Faixa de referência (premissa, use o piso): uma régua que passa de "cobramos às vezes" para "cobramos toda semana" recupera 20% a 40% do atraso com menos de 30 dias, 10% a 20% do atraso entre 30 e 90 dias e 0% a 5% do atraso acima de 90 dias. Peça os valores por faixa ao dono e, se ele tiver histórico de recuperação, use o dele. Escreva a conta assim: "premissa: 20% de R$ 70 mil recentes = R$ 14 mil; a medir em 30 dias".

**Nota-base.** Esforço 1 · Impacto 3 (se inadimplência existe). Impacto 1 se o negócio recebe à vista ou por cartão. **Pergunte antes:** o sistema de cobrança ou o banco já manda lembrete automático? Se manda e não funciona, o problema é a mensagem e a negociação (aí a IA entra); se não manda, a IA entra na régua inteira.

### Caso 3 · Dashboard financeiro com DRE, ofensores de custo e variações

**O que é.** A planilha de resultado (ou a exportação do ERP) vira um painel interativo com a DRE (a conta de lucro: receita, deduções, custos, despesas, resultado) mês a mês, os 5 maiores ofensores de custo, as maiores variações contra o mês anterior e contra o orçamento, e a margem por linha de negócio. O dono abre e vê onde o dinheiro está indo, sem esperar o contador.

**Sinal de que é para este negócio.** O resultado chega 20 dias depois do mês e em PDF que ninguém lê; o dono não sabe dizer qual custo mais cresceu nos últimos 6 meses; a reunião de sócios discute resultado em planilha de 40 abas; a margem por produto ou unidade é "mais ou menos".

**Como fica com IA.** O Claude lê a planilha (ou a exportação) e constrói o dashboard como um artefato (uma página interativa que ele gera e você abre no navegador), com filtros por mês e por centro de custo, comentários automáticos ("despesa com frete subiu 18% em setembro: 3 fornecedores novos") e a lista de ofensores. Atualizar é subir a planilha nova e pedir "atualiza o painel". Com conector Google Sheets, nem isso.

**Camada.** Chat (artefato a partir da planilha, dia 1) → Project "Financeiro" com a estrutura da DRE e o modelo do painel → conector Sheets.

**A conta do ganho.** Horas do dono ou do financeiro compilando o resultado por mês × 30% (premissa) × custo-hora, mais o ofensor de custo descoberto (peça ao dono o maior custo que subiu sem ele perceber nos últimos 12 meses; é a ordem de grandeza do que o painel pega). É o caso 1 olhando para trás e para a margem, enquanto o caso 1 olha o caixa da semana.

**Nota-base.** Esforço 1 · Impacto 3 (2 se o ERP já entrega DRE gerencial com variações). **Pergunte antes:** o ERP ou a contabilidade já entregam DRE gerencial mensal com comparação? Se sim, a IA entra na leitura dos ofensores e nos comentários, não na montagem.

**Manual de IA de referência.** #18 "Como construir um dashboard financeiro em minutos" (framework de Artefatos do Claude).

### Variante setorial · Conciliação de recebimentos (varejo, delivery, e-commerce)

Quando o negócio recebe por 4 ou 5 meios (Pix, cartão, marketplace, boleto, dinheiro), a conciliação consome horas e esconde taxa errada e venda não repassada. O Claude lê os relatórios dos adquirentes e o extrato e aponta o que não bate. Esforço 2 · Impacto 2 a 3.

---

## Frente 2 — CLIENTE

### Caso 4 · Primeiro atendimento e triagem no WhatsApp

**O que é.** As perguntas que chegam todo dia (preço, horário, prazo, "tem em estoque?", "como funciona?") respondidas na hora, com o cliente qualificado (o que quer, para quando, orçamento) e encaminhado para a pessoa certa, ou com o agendamento feito.

**Sinal de que é para este negócio.** Mais de 30 conversas novas por dia no WhatsApp; cliente espera mais de 15 minutos por resposta; vendedor gasta a manhã respondendo a mesma pergunta; venda perdida fora do horário comercial.

**Como fica com IA.** Há três níveis, e a pergunta que decide é: **a resposta que o cliente quer muda todo dia?** Nível 1 (uma tarde): um Project "Atendimento" com a base de perguntas e respostas fixas da empresa (horário, política, como funciona, preços de tabela), que o atendente usa para responder em segundos, no tom da casa. Nível 1,5 (uma semana): quando a resposta depende de dado do dia (estoque, prazo de entrega, agenda), o Project recebe toda manhã a exportação do sistema (planilha de estoque ou agenda do dia) e responde com base nela; o atendente continua enviando. Nível 2 (duas a quatro semanas): um agente ligado ao WhatsApp da empresa por uma plataforma de automação (API oficial do WhatsApp Business ou provedores como Z-API e Evolution, via n8n ou Make), respondendo sozinho as perguntas simples e passando o resto para humano. O Nível 2 só compensa acima de ~30 conversas novas por dia e depois de o nível 1 rodar duas semanas.

**Camada.** Project (níveis 1 e 1,5) → API + automação (nível 2). Se a conversa tiver disponível uma skill do Kit que monte o prompt de agente de vendas, use-a no nível 2; se não, siga a receita do construtor.

**A conta do ganho.** Conversas por dia × 3 a 5 minutos por conversa (premissa, use 3) × 30% de tempo poupado (premissa) × custo-hora do atendente × 22 dias, mais vendas recuperadas fora do horário (só com o número do dono). Contexto: o estudo Nu Empresas/Bridge (2026) coloca atendimento e relacionamento com clientes entre as tarefas que mais consomem tempo para 39% dos pequenos negócios.

**Nota-base.** Esforço 2 · Impacto 3. Esforço 1 se ficar no nível 1 ou 1,5.

**Manual de IA de referência.** #15 "Monte o seu primeiro Vendedor Automático no WhatsApp" (nível 2).

### Caso 5 · Proposta, orçamento e follow-up em minutos

**O que é.** Um orçamento ou proposta comercial pronto em 10 minutos a partir do briefing do cliente, no modelo da empresa, com preço calculado pela tabela da casa, e a sequência de follow-up (3 mensagens em 10 dias) escrita no mesmo ato.

**Sinal de que é para este negócio.** Proposta leva mais de um dia para sair; o vendedor "esquece" de fazer follow-up; cada vendedor escreve de um jeito; taxa de fechamento cai por demora na resposta.

**Como fica com IA.** Project "Propostas" com o modelo da proposta, a tabela de preços, 3 propostas vencedoras como exemplo e as regras de desconto. O vendedor cola o briefing (ou o áudio transcrito da reunião) e recebe a proposta e os follow-ups. Se a empresa usa CRM com conector disponível, o Claude lê o histórico do cliente antes de escrever.

**Camada.** Project → Skill "proposta" quando o formato estabiliza → conector com CRM.

**A conta do ganho.** Horas por proposta × 30% a 50% poupados (premissa, use 30%) × propostas por mês × custo-hora do vendedor, mais o efeito em fechamento de responder no mesmo dia (peça ao dono a taxa de fechamento atual e não invente a melhora; proponha medir em 30 dias). **Pergunte antes:** o ERP ou CRM já gera orçamento com um botão? Se gera, a IA entra no texto da proposta e no follow-up, não no cálculo.

**Nota-base.** Esforço 1 · Impacto 2 (3 se ticket médio alto e venda consultiva).

### Caso 6 · Briefing automático de cliente antes da reunião

**O que é.** Quinze minutos antes de qualquer reunião, uma página sobre o cliente. Para reunião de **venda**: quem é a empresa, o que faz, tamanho, notícias recentes, quem é a pessoa do outro lado, o que ela provavelmente precisa e como a sua empresa ajuda, com 3 perguntas para abrir a conversa. Para reunião de **entrega** (cliente da carteira): histórico de compras, últimos atendimentos, pendências, o que foi prometido e não entregue, oportunidade de recompra.

**Sinal de que é para este negócio.** Vendedor entra na reunião sem saber o que a empresa do cliente faz; gestor de conta descobre na reunião que havia uma reclamação aberta; o dono prepara reunião importante sozinho, de madrugada; venda consultiva com ticket alto.

**Como fica com IA.** Venda: o Claude pesquisa na internet (site, LinkedIn, notícias, reclamações públicas) a partir do nome da empresa e da pessoa e monta o briefing no modelo da casa, cruzando com o que a sua empresa vende (um Project "Reuniões de venda" guarda a sua proposta de valor e os casos que você já atendeu). Entrega: com conectores (CRM, Drive, e-mail) o Claude lê o histórico do cliente e monta o briefing interno; sem conector, o gestor exporta a ficha do cliente e cola.

**Camada.** Chat com pesquisa web + Project (venda) → conectores CRM/Drive/Gmail (entrega) → Skill "briefing" quando o formato estabilizar.

**A conta do ganho.** Reuniões por semana × 30 a 45 minutos de preparação que deixam de ser manuais (premissa de 30% poupado na primeira versão; o resto é qualidade), × custo-hora de quem prepara. O ganho principal não cabe em hora: reunião preparada fecha mais e retém mais (peça ao dono a taxa de fechamento e meça em 30 dias). 

**Nota-base.** Esforço 1 · Impacto 2 (3 se venda consultiva com ticket alto ou carteira com churn).

**Limite honesto.** Pesquisa na internet erra e desatualiza: o briefing é ponto de partida, e o vendedor confere o que vai usar. Dado de cliente da carteira é dado pessoal: só o necessário, na conta da empresa.

**Manual de IA de referência.** #8 "Como ter um agente 24h por dia com o Claude no seu navegador" (pesquisa) e #16 "Seu radar com IA para não perder nada do seu mercado".

### Variante setorial · Confirmação de agenda e redução de falta (clínicas, salões, escolas, oficinas, serviços agendados)

Confirmação e lembrete personalizados 48h e 2h antes, com reagendamento fácil, e lista de espera para encaixe. Faixa de referência (premissa, use o piso): confirmação ativa com lembrete derruba a taxa de falta em 25% a 40% do valor atual (de 22% para algo entre 13% e 16%); conte metade das vagas recuperadas como atendimento novo. Esforço 1 (manual assistido) a 2 (automatizado) · Impacto 3 quando a taxa de falta passa de 15%. **Pergunte antes:** o sistema de agenda já tem confirmação automática (muitos têm, às vezes paga ou desligada)? Se tem, a IA entra na mensagem personalizada, no reagendamento e na lista de espera. Receita no construtor: "Variante · Confirmação de agenda".

---

## Frente 3 — ROTINA (a burocracia)

### Caso 7 · Documentos, notas e contratos: ler, conferir e extrair

**O que é.** O Claude lê o que chega (notas fiscais de fornecedor, contratos, propostas de terceiros, boletos, documentos de cliente) e faz o trabalho chato: confere nota contra pedido, extrai os dados para a planilha, resume o contrato em 10 linhas apontando prazo, multa e renovação automática, monta o checklist de obrigações do mês.

**Sinal de que é para este negócio.** Alguém digita dados de nota em planilha; contratos assinados sem leitura; multa de renovação automática já aconteceu; obrigação fiscal já venceu por esquecimento.

**Como fica com IA.** No chat, arrastando o PDF (dia 1). No Cowork, apontando a pasta de notas do mês e pedindo a planilha consolidada (quando o volume é de dezenas por mês). Um Project "Documentos" guarda o que conferir em cada tipo de documento.

**Camada.** Chat → Cowork (pasta local) → Skill por tipo de documento.

**A conta do ganho.** Documentos por mês × minutos de digitação/conferência × custo-hora, mais o que deixa de ser perdido em multa e nota errada. Obrigações fiscais e emissão de notas lideram a lista de tarefas que mais tomam tempo (43% e 40%, Nu Empresas/Bridge 2026).

**Nota-base.** Esforço 1 · Impacto 2.

**Limite honesto.** O Claude não emite nota, não assina e não substitui o contador. Ele prepara, confere e aponta. A decisão fiscal continua com o contador.

### Caso 8 · Reuniões viram ata, decisão e tarefa

**O que é.** Toda reunião gera, em 2 minutos, uma ata com decisões, responsáveis e prazos, e uma mensagem de cobrança para cada responsável. Na semana seguinte, a IA lista o que ficou aberto.

**Sinal de que é para este negócio.** Reunião que termina sem dono para as tarefas; a mesma decisão discutida 3 vezes; o dono é a única memória da empresa.

**Como fica com IA.** Gravação ou transcrição da reunião (o Google Meet, Zoom e Teams transcrevem; o celular grava) entra num Project "Reuniões" que conhece o time, os projetos em andamento e o formato da ata. Sai a ata, as tarefas e as mensagens. Com conector de calendário e de tarefas (Notion, Asana, Google Tasks), a tarefa já é criada.

**Camada.** Project → conectores (Calendar, Notion/Asana).

**A conta do ganho.** Reuniões por semana × 30 minutos de ata e cobrança evitados, mais decisões que deixam de se perder. É o caso de maior ganho de gestão por real investido, porque não precisa de nada além do chat para começar.

**Nota-base.** Esforço 1 · Impacto 2.

### Caso 9 · E-mail e caixa de entrada: triagem e resposta na sua voz

**O que é.** A caixa de entrada (do dono ou do administrativo) triada toda manhã em 4 pilhas (responder hoje, delegar, só ler, lixo), com o rascunho de resposta já escrito para a primeira pilha, no jeito de escrever da pessoa, e o follow-up de quem não respondeu. Fornecedor, cliente, contador, banco: cada um com o tom certo.

**Sinal de que é para este negócio.** Mais de 40 e-mails por dia; e-mail de cliente sem resposta por 2 dias; o dono responde e-mail no domingo; o administrativo gasta a manhã "limpando a caixa"; o mesmo pedido de fornecedor respondido de jeitos diferentes por pessoas diferentes.

**Como fica com IA.** Com o conector de e-mail (Gmail ou Outlook), o Claude lê a caixa, classifica e escreve os rascunhos; a pessoa revisa e envia (nada sai sozinho). Sem conector, cola-se o e-mail e pede-se a resposta. Um Project "Caixa de entrada" guarda as regras de triagem, os 10 e-mails que a pessoa escreveu e aprovou (é daí que sai a voz dela) e as respostas-padrão para o que repete (segunda via de boleto, prazo de entrega, pedido de orçamento).

**Camada.** Project (voz + regras) → conector Gmail/Outlook → Skill "triagem da manhã".

**A conta do ganho.** E-mails por dia × 2 a 4 minutos (premissa, use 2) × 30% poupado (premissa) × custo-hora × 22 dias; mais a venda ou o cliente que não se perde por resposta atrasada (só com o número do dono).

**Nota-base.** Esforço 1 · Impacto 2 (3 se é o dono quem responde e passa de 1 hora por dia nisso). **Pergunte antes:** o e-mail já tem filtros e respostas automáticas configurados? Se tem, a IA entra no rascunho na voz da pessoa, não na triagem.

**Limite honesto.** E-mail com dado de cliente e de funcionário passa pelo conector na conta da empresa; nada é enviado sem uma pessoa ler.

**Manual de IA de referência.** #14 "Tenha uma IA que escreve exatamente como você" e #12 "Como usar o Claude para Pequenas Empresas" (conectores/MCP).

---

## Frente 4 — TIME

### Caso 10 · Processos e treinamento (o POP a partir de um áudio)

**O que é.** O funcionário que sabe fazer grava um áudio ou vídeo de 5 minutos explicando como faz. O Claude transforma em POP (procedimento operacional padrão: o passo a passo escrito, com o que fazer quando dá errado), em checklist e em um roteiro de treinamento para o próximo contratado. A empresa para de depender da cabeça de uma pessoa.

**Sinal de que é para este negócio.** Quando alguém sai, a empresa perde o conhecimento junto; novo funcionário leva 2 meses para render; só o dono sabe resolver determinada situação; o mesmo erro se repete com pessoas diferentes.

**Como fica com IA.** Project "Processos" com o modelo de POP da casa e o organograma. Cada processo vira um documento em 15 minutos. Dica: comece pelos processos que travam quando o dono viaja. Se a conversa tiver disponível a skill de processos-chave do Kit, ela ajuda a decidir quais documentar primeiro.

**Camada.** Project → Cowork para gerar os documentos em lote → Project "Manual do time" que responde dúvida do funcionário novo (o treinamento vira conversa).

**A conta do ganho.** Semanas de adaptação do novo contratado reduzidas (premissa: 25% a 40% menos tempo até render; use 25%) × custo mensal total do cargo (regra de custo-hora acima), mais o risco que sai do dono (horas por semana em que só ele resolve × custo-hora dele).

**Nota-base.** Esforço 1 · Impacto 2 (3 se há rotatividade alta ou dependência de uma pessoa-chave).

**Manual de IA de referência.** #13 "Uma IA pra montar e melhorar seus Processos Chaves".

### Caso 11 · Contratação e RH de primeira linha

**O que é.** Descrição de vaga escrita a partir do que o cargo realmente faz; triagem dos currículos recebidos contra os critérios da vaga, com justificativa; roteiro de entrevista; plano de integração dos primeiros 30 dias; e respostas de primeira linha para dúvidas recorrentes do time (férias, banco de horas, benefício), com o aviso de confirmar com o contador ou o advogado o que envolve a lei.

**Sinal de que é para este negócio.** Mais de 50 currículos por vaga e ninguém lê todos; contratação errada nos últimos 12 meses; o dono responde pessoalmente dúvida de RH; a empresa está reorganizando turnos e escalas por conta de mudança trabalhista.

**Como fica com IA.** Project "Gente" com as descrições de cargo, os valores da casa e as políticas internas. Para triagem, os currículos entram em lote (Cowork lê a pasta inteira) e sai uma tabela com nota e motivo. Para dúvidas trabalhistas e de escala, use as skills de gente e de legislação trabalhista do Kit que estiverem disponíveis na conversa; se nenhuma estiver, o aviso de confirmar com contador ou advogado é obrigatório.

**Camada.** Project → Cowork (lotes de currículo).

**A conta do ganho.** Horas de triagem × custo-hora do gestor, mais o custo de uma contratação errada (em geral, 3 a 6 meses de custo total do cargo entre adaptação, saída e nova busca; use como ordem de grandeza e peça o dado do dono).

**Nota-base.** Esforço 1 · Impacto 2.

**Limite honesto.** Nada aqui substitui o contador ou o advogado trabalhista na decisão final. A IA prepara o terreno e economiza a hora cara do profissional, não a dispensa.

**Manual de IA de referência.** #5 "Como ter um headhunter e contratar gente boa com um agente de AI".

### Caso 12 · Mapa do trabalho invisível do time

**O que é.** Cada pessoa do time registra, por 5 dias, o que fez em blocos de 30 minutos (um áudio no fim do dia resolve). O Claude consolida e mostra, por pessoa e por área, onde o tempo vai de verdade: o que é trabalho que gera valor, o que é retrabalho, o que é "apagar incêndio", o que é tarefa repetitiva que cabe na IA, o que deveria nem existir. Sai um mapa com as 10 tarefas que mais consomem horas na empresa e a recomendação para cada uma: automatizar, delegar, simplificar ou cortar.

**Sinal de que é para este negócio.** O dono "sente" que o time está sobrecarregado mas não sabe com o quê; pedido de contratação chega sem número; a mesma pessoa é gargalo em três processos; ninguém sabe quanto custa uma rotina que todo mundo faz.

**Como fica com IA.** Project "Mapa do time" com o organograma, os processos-chave e a planilha de registro (ou os áudios transcritos). Pedido: "consolida a semana". Sai o mapa, a lista das 10 tarefas e a recomendação. É o diagnóstico que alimenta os outros 14 casos: ele diz qual deles vale mais nesta empresa.

**Camada.** Project (dia 1) → Cowork para consolidar os registros de muita gente → repetir a cada trimestre.

**A conta do ganho.** Horas por semana nas tarefas marcadas como "automatizar" ou "cortar" × custo-hora. Normalmente a conta mais surpreendente do mapa, porque é a primeira vez que o dono vê o número inteiro. Use o resultado para recalibrar o Top 3.

**Nota-base.** Esforço 1 · Impacto 3 (a hora que ele devolve é a soma de todas as outras). Impacto 2 em time de menos de 5 pessoas, onde o dono já sabe de cabeça.

**Limite honesto.** Registro de tempo vira vigilância se for apresentado errado. Diga ao time o objetivo (tirar tarefa chata da mesa, não medir gente), use por 5 dias e pare. Nunca use o mapa como critério de demissão.

**Manual de IA de referência.** #14 "Tenha uma IA que escreve exatamente como você" (segunda parte: como mapear o trabalho invisível da equipe).

---

## Frente 5 — DONO (o que fica na mão dele, e a IA multiplica)

### Caso 13 · Comunicação da casa sem agência

**O que é.** Posts, e-mails para a base, descrições de produto, roteiro de vídeo e resposta a avaliação, todos no tom da marca, produzidos pelo próprio time em uma manhã por semana, em vez de uma agência que cobra fixo mensal e entrega genérico.

**Sinal de que é para este negócio.** Agência ou freelancer custa um fixo mensal e o dono reescreve tudo; a empresa não publica por falta de tempo; cada pessoa escreve de um jeito.

**Como fica com IA.** Project "Marca" com o guia de voz (3 páginas: quem somos, como falamos, o que nunca dizemos), 10 exemplos de textos aprovados e o calendário do mês. O time pede "o post de quinta sobre X" e recebe no tom certo. Se a conversa tiver disponíveis as skills do Kit de calendário comercial e de vídeo, elas entram no planejamento e na produção.

**Camada.** Project → Skill por formato (post, e-mail, descrição) → Canva/Design por conector para a arte.

**A conta do ganho.** Fixo mensal da agência que deixa de ser pago ou horas do time que caem pela metade, menos o tempo de revisão (que continua existindo). Aviso honesto: a IA não cria a estratégia nem substitui alguém que entenda de marca; ela produz com consistência o que foi decidido.

**Nota-base.** Esforço 1 · Impacto 2.

**Manual de IA de referência.** #14 "Tenha uma IA que escreve exatamente como você" e #10 "Como montar o seu calendário de vendas com IA".

### Caso 14 · Painel de indicadores e simulação de cenários

**O que é.** Toda segunda, os 6 a 8 números que importam do negócio inteiro (venda, conversão, ticket médio, falta, produtividade, inadimplência) lidos de uma planilha e devolvidos como leitura: o que subiu, o que caiu, o que explica, o que fazer. E, quando o dono precisa decidir, a simulação: e se o imposto subir 2 pontos? E se eu trocar dois CLT por um PJ? E se eu subir o preço 8% e perder 5% dos clientes? (O caso 3 é a DRE e os custos; este é o negócio inteiro e o futuro.)

**Sinal de que é para este negócio.** O dono decide "no feeling"; os números moram em 4 planilhas que não conversam; mudança de lei ou de custo pegou a empresa de surpresa; reunião de resultado é discussão sem dado.

**Como fica com IA.** Planilha de indicadores (ou a exportação do sistema) num Project "Painel" com a definição de cada indicador e a meta. Pedido semanal: "lê a semana". Para cenários, o Claude monta a simulação em planilha com as premissas visíveis para o dono mexer. Se a conversa tiver disponíveis as skills do Kit de finanças (DRE, caixa, precificação) e de reforma tributária, elas fazem o cenário fiscal e de preço.

**Camada.** Project + conector Drive/Sheets → Skill "painel de segunda".

**A conta do ganho.** Não é hora: é decisão. Meça pelo número de decisões tomadas com dado em 30 dias e pelas surpresas evitadas. Para o dono que faz isso sozinho hoje, some as horas (em geral, 2 a 4 por semana compilando números).

**Nota-base.** Esforço 2 · Impacto 3 (esforço 1 se os números já moram numa planilha só).

**Manual de IA de referência.** #3 "Como ter uma analista de dados 24h por dia" e #17 "Como transformar o Claude no cérebro da sua operação".

### Caso 15 · Edição de vídeos com IA

**O que é.** O vídeo que o dono ou o time grava no celular (depoimento, bastidor, explicação de produto, aula) vira vídeo pronto para postar: cortado, com legenda, com os melhores trechos selecionados, no formato de cada rede, e em versões (um vídeo de 10 minutos vira 5 cortes de 40 segundos). Sem editor, sem agência, sem esperar 4 dias.

**Sinal de que é para este negócio.** O dono grava e o vídeo fica na galeria porque "precisa editar"; a edição custa R$ 150 a R$ 400 por vídeo ou um editor fixo; a empresa publica 1 vídeo por mês quando poderia publicar 1 por dia; vídeo é o canal que mais traz cliente e é o que menos sai.

**Como fica com IA.** O Claude roteiriza, escolhe os cortes a partir da transcrição e monta o vídeo com as ferramentas de edição por IA (o fluxo do Manual de IA #26, com o Claude e as ferramentas de vídeo); com a skill de vídeo do Kit disponível na conversa, o processo vai do roteiro ao arquivo pronto. Um Project "Vídeos" guarda o estilo da casa (legenda, cores, abertura, chamada final).

**Camada.** Project + skill de vídeo do Kit (quando disponível) → ferramenta de edição por IA.

**A conta do ganho.** Vídeos por mês × custo por edição (ou horas do time × custo-hora) que deixam de ser pagos, mais o volume de publicação que sobe (meça em 30 dias: vídeos publicados antes × depois). Aviso honesto: a IA edita bem o vídeo simples (depoimento, explicação, bastidor); produção com direção de arte continua sendo trabalho de gente.

**Nota-base.** Esforço 1 · Impacto 2 (3 se vídeo é o principal canal de aquisição e a edição é o gargalo).

**Manual de IA de referência.** #26 "Como editar vídeos com IA, em minutos, sem editor e sem agência" e #24 (criação de vídeo com IA).

---

## Variantes setoriais (use quando o setor pedir)

Uma variante **soma** à lista como 16ª linha quando é a dor principal do negócio, ou **substitui** o caso menos relevante quando a lista já está cheia. Mais de uma variante pode entrar se o setor pedir (uma distribuidora pode ter Conciliação e Compras). Toda variante tem receita própria no construtor, com o nome indicado.

| Setor | Variante | O que é | Esforço · Impacto | Receita no construtor |
|---|---|---|---|---|
| Qualquer negócio que recebe por 3+ meios (varejo, delivery, e-commerce, distribuição, clínicas com convênio) | Conciliação de recebimentos | Lê relatórios de adquirente, marketplace, convênio e extrato; aponta o que não bate, taxa errada e repasse faltando | 2 · 2-3 | "Variante · Conciliação de recebimentos" |
| Varejo, indústria, distribuição | Compras e reposição | Previsão de reposição por giro e sazonalidade; comparação de cotações de fornecedor; alerta de ruptura | 2 · 3 | "Variante · Compras e reposição" |
| Restaurantes e alimentação | Ficha técnica e CMV | Ficha técnica dos pratos, CMV (custo da mercadoria vendida) por item, cardápio engenheirado por margem | 1 · 3 | "Variante · Ficha técnica e CMV" |
| Serviços recorrentes (contabilidade, agência, manutenção) | Entregas e SLA | Checklist de entrega por cliente e relatório mensal de cliente gerado em minutos (o controle de prazo e obrigação fica no Caso 7) | 1 · 2 | "Variante · Entregas e SLA" |
| Clínicas, estética, educação, oficinas, serviços agendados | Confirmação de agenda e lista de espera | Ver variante do Caso 6 | 1-2 · 3 | "Variante · Confirmação de agenda" |
| E-commerce e marketplace | Catálogo e pós-venda | Descrições e atributos de produto em lote; respostas a "onde está meu pedido" e troca | 1 · 2 | "Variante · Catálogo e pós-venda" |
| Construção e projetos | Medição e aditivo | Leitura de medições, controle de aditivos de contrato, relatório de obra | 2 · 2 | Receita genérica |

---

## Como pontuar (o método)

1. Para cada um dos 15 casos (e das variantes que o setor pedir), parta da nota-base.
2. Ajuste o **impacto** pelas respostas. Impacto 3 só para dinheiro direto no caixa ou para tarefa que consome mais de 3 h/semana **brutas** do dono (o limiar olha a tarefa inteira; a premissa de 30% entra só na conta em reais). Peso, do maior para o menor: dinheiro direto no caixa > hora do dono > hora do time > conveniência.
3. Ajuste o **esforço** pela fluência do dono com o Claude e pelas ferramentas em uso: quem já usa Project e tem os dados em planilha começa um nível abaixo; quem nunca saiu do chat começa um nível acima no que exigir conector ou automação.
4. **Antes de pontuar, cheque o que o sistema atual já faz.** Se o ERP, o CRM, o banco ou a agenda já resolvem com um botão (conciliação, orçamento, lembrete, DRE), o caso cai um nível de impacto e a IA entra só na parte que o sistema não faz. Recomendar IA para o que a ferramenta já faz é o erro mais caro do consultor.
5. Classifique em quatro quadrantes: **Faça agora** (impacto 3, esforço 1), **Vale o projeto** (impacto 3, esforço 2-3), **Ganho rápido** (impacto 2, esforço 1), **Depois** (o resto).
6. **O #1 sai de "Faça agora"** (se houver). **Os #2 e #3 saem pelo valor em reais da conta aberta**, olhando "Faça agora", "Vale o projeto" e "Ganho rápido" juntos: um "Vale o projeto" com dinheiro no caixa passa na frente de um "Ganho rápido" de conveniência. Desempate, nesta ordem: R$/mês direto no caixa; horas do dono × custo-hora dele; horas do time × custo-hora. Explique a ordem com os dados do dono, não com a nota-base.
7. Todo caso de "Faça agora", "Vale o projeto" ou "Ganho rápido" com conta em reais que não entrou no Top 3 vai para uma seção curta **"Fila seguinte"** (uma linha cada, com o valor), entre o Top 3 e o "Para depois". Se não sobrar nenhum, a seção não existe. O dono precisa saber que existem e que não foram esquecidos.
8. Diga explicitamente 1 ou 2 casos que ficam **para depois** neste negócio e por quê (volume baixo, dado que não existe, dependência de terceiro, decisão que deve continuar humana). Isso é o que diferencia diagnóstico de lista.
9. Quando o dono for membro do Manual de Donos, cite o Manual de IA de referência do caso ("o #18 ensina a montar esse painel em minutos"); a biblioteca fica em acesso.manualdedonos.com/t/manual-de-ai.
