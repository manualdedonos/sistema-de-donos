# Receitas de construção — uma por caso do Mapa

Os casos seguem a numeração de casos-de-uso.md (15 casos em 5 frentes). Cada receita diz: a camada mínima que resolve, o que confirmar antes (o sistema atual já faz?), os insumos a pedir ao dono (nada além do necessário), o que você constrói de fato (com a estrutura), o teste de aceitação com dado real, a rotina de uso e as armadilhas. Quando há mais de um fluxo, há mais de um pedido padrão. Siga a receita do caso do briefing. Se o pedido do dono não bate com nenhum caso, use a receita mais próxima e a seção "Receita genérica" no fim.

Convenção dos nomes de camada: **Chat+Prompt** (um prompt-modelo salvo), **Project** (projeto no Claude com instruções e arquivos de conhecimento), **Skill** (pasta com SKILL.md que o dono instala), **Conector** (ligação com ferramenta externa), **Cowork** (agente em pasta local, no app do computador), **Automação** (n8n/Make/API, roda sem pessoa).

---

## Caso 1 · Fechamento e leitura semanal do caixa

**Antes de construir, confirme:** o ERP ou o banco já concilia e gera relatório? Se sim, a IA entra na leitura, nos alertas e no texto para os sócios, não na conciliação.

**Camada mínima.** Project "Caixa semanal". Evolui para Skill quando o relatório estabilizar (3 rodadas iguais). Conector Google Drive/Sheets tira o upload.

**Insumos.** Um extrato bancário recente (CSV ou OFX; o dono exporta no internet banking) ou a planilha de movimentações; a lista de categorias que a empresa usa (se não tem, você propõe 12 a 15 e ele ajusta); o que ele quer ver no relatório (proponha: entradas, saídas, saldo, inadimplência, vencimentos de 15 dias, variação contra a semana anterior, 3 alertas).

**O que você constrói.**
1. Instruções do Project (use `assets/template-instrucoes-project.md`): papel ("você é o analista financeiro da [empresa]"), as categorias com regras de classificação ("Pix recebido de pessoa física = venda balcão"), o formato fixo do relatório, o que é alerta (ex.: saída fora do padrão acima de R$ X; cliente recorrente que não pagou).
2. O modelo do relatório, de uma página, em markdown.
3. O pedido padrão: "Fecha a semana de [data] a [data] com os arquivos anexos."
4. Se o dono usar Google Sheets e o conector estiver disponível, a instrução de ler direto a aba X.

**Teste de aceitação.** Rodar com o extrato real da última semana. Aprovado se: 90% dos lançamentos classificados certo na primeira passada (o dono confere a tabela), o relatório cabe em uma tela e os 3 alertas fazem sentido para ele.

**Rotina.** Segunda, 9h, quem: financeiro ou o dono. 15 minutos. O relatório vai para o grupo dos sócios.

**Armadilhas.** Extrato com descrição truncada confunde a classificação: peça ao dono para corrigir as 5 primeiras regras e grave no Project. Dados bancários são sensíveis: oriente a não subir o extrato com dados de terceiros além do necessário e a usar a conta do Claude da empresa, não pessoal.

## Caso 2 · Cobrança e recuperação de inadimplentes

**Antes de construir, confirme:** o sistema de cobrança ou o banco já manda lembrete automático? Se manda, a IA entra na negociação e nas mensagens das faixas mais longas; se não manda, na régua inteira.

**Camada mínima.** Chat+Prompt no primeiro dia; Project "Cobrança" na primeira semana.

**Insumos.** A lista de inadimplentes (planilha: nome, valor, vencimento, contato, histórico se houver); 2 ou 3 mensagens de cobrança que a empresa já mandou e que funcionaram; a política de negociação (parcela? desconto? até quanto?); o tom da casa (formal, próximo, direto).

**O que você constrói.**
1. A régua: 4 faixas (3, 10, 30 e 60+ dias), cada uma com objetivo, tom e canal. A de 3 dias é lembrete amigável que assume esquecimento; a de 60+ é firme, com prazo e consequência real, sem ameaça vazia.
2. As 4 mensagens-modelo com campos [NOME], [VALOR], [VENCIMENTO], [LINK/PIX], no tom da casa, uma versão WhatsApp (curta) e uma e-mail.
3. As instruções do Project: receber a planilha, classificar por faixa, gerar as mensagens de cada cliente e um ranking (valor × faixa recente primeiro), com a regra "quem já respondeu negociando sai da régua".
4. O pedido padrão: "Cobra a semana com a planilha anexa."

**Teste de aceitação.** Rodar com a lista real. Aprovado se as mensagens saem no tom certo sem edição em 8 de 10 casos e o ranking começa pelos atrasos recentes de maior valor.

**Rotina.** Terça, 10h, quem: financeiro. Envia pelo WhatsApp Business (ou pela ferramenta de disparo). Registra na planilha quem respondeu.

**Armadilhas.** Nunca gerar mensagem com ameaça que a empresa não vai cumprir nem com linguagem que exponha o cliente (Código de Defesa do Consumidor). Dados pessoais: só nome e valor no prompt; não colar CPF.

## Caso 3 · Dashboard financeiro com DRE, ofensores de custo e variações

**Antes de construir, confirme:** o ERP ou a contabilidade já entregam DRE gerencial mensal com comparação? Se sim, a IA entra na leitura dos ofensores e nos comentários; o painel pode ler a exportação deles.

**Camada mínima.** Chat (artefato a partir da planilha, dia 1) → Project "Financeiro" quando a estrutura da DRE estabilizar → conector Google Sheets para atualizar sem upload.

**Insumos.** A planilha de resultado dos últimos 6 a 12 meses (ou a exportação do ERP) com receitas, deduções, custos e despesas por mês; o plano de contas (ou as categorias que a empresa usa); a meta ou o orçamento, se houver; as linhas de negócio ou unidades, se houver.

**O que você constrói.**
1. A estrutura da DRE gerencial da casa (receita bruta → deduções → receita líquida → custos → margem bruta → despesas por grupo → resultado), com o mapeamento de cada categoria da planilha para a linha da DRE.
2. O dashboard como artefato HTML: DRE mês a mês, gráfico de resultado, os 5 maiores ofensores de custo (variação absoluta e percentual contra o mês anterior e contra a média de 3 meses), margem por linha de negócio, e um bloco de comentários automáticos ("frete subiu 18% em setembro").
3. As instruções do Project para regenerar o painel com a planilha nova e manter o mesmo formato.
4. O pedido padrão: "Atualiza o painel financeiro com a planilha anexa."

**Teste de aceitação.** A planilha real. Aprovado se o resultado do último mês bate com o que o contador ou o dono conhece (diferença explicada), e pelo menos um ofensor apontado é novidade para o dono.

**Rotina.** Dia 5 de cada mês (ou quando o fechamento chegar), financeiro ou dono, 20 minutos. O painel vai para a reunião de sócios.

**Armadilhas.** Plano de contas bagunçado produz DRE bagunçada: feche o mapeamento das categorias antes do primeiro painel. Regime de caixa × competência: pergunte qual a planilha usa e escreva no painel. Se houver uma skill de finanças do Kit disponível na conversa, ela ajuda na leitura; o Manual de IA #18 ensina o passo a passo do artefato.

## Caso 4 · Primeiro atendimento e triagem no WhatsApp

**Camada mínima.** Nível 1: Project "Atendimento" usado pelo atendente (uma tarde). Nível 2: Automação com agente ligado ao WhatsApp (só com volume acima de ~30 conversas novas/dia e depois do nível 1 rodar 2 semanas).

**Insumos.** As 20 perguntas mais frequentes com as respostas certas (peça o histórico do WhatsApp dos últimos 30 dias ou as respostas prontas que já usam); horário, preços, prazos e políticas; o que qualifica um cliente (3 perguntas); para quem encaminhar cada tipo.

**O que você constrói (nível 1).**
1. A base de conhecimento: perguntas e respostas organizadas por tema, em um arquivo que vai para o conhecimento do Project.
2. Instruções do Project: tom da casa, o que nunca prometer, as 3 perguntas de qualificação, o critério de passar para humano, o formato de registro (nome, interesse, prazo, próximo passo).
3. O pedido padrão do atendente: colar a mensagem do cliente e receber a resposta pronta + a classificação.

**O que você constrói (nível 2).** Se a conversa tiver disponível uma skill do Kit do Dono que monte o prompt de agente de vendas, use-a para o prompt do agente; senão, escreva o prompt do agente com o template de instruções de Project (papel, base, qualificação, passagem para humano); indique a plataforma de automação que a empresa já usa ou uma de mercado (n8n ou Make com API oficial do WhatsApp Business ou provedores como Z-API/Zapi/Evolution). Deixe claro que esta etapa envolve custo mensal da plataforma e configuração técnica, e que o agente só responde o que está na base; o resto vai para humano.

**Teste de aceitação.** 20 mensagens reais dos últimos dias. Aprovado se 16 saem corretas sem edição e as 4 restantes são corretamente passadas para humano.

**Rotina.** Contínua. Revisão da base toda sexta: o que o agente errou ou não soube vira resposta nova.

**Armadilhas.** Base desatualizada é o primeiro motivo de falha. Dado de cliente: não copiar conversas com dados pessoais para fora do necessário.

## Caso 5 · Proposta, orçamento e follow-up em minutos

**Antes de construir, confirme:** o ERP ou CRM já gera orçamento com um botão? Se sim, a IA entra no texto da proposta (entendimento, solução, próximos passos) e no follow-up; o cálculo fica no sistema.

**Camada mínima.** Project "Propostas". Skill quando houver mais de um vendedor usando.

**Insumos.** O modelo atual de proposta (Word/PDF); 3 propostas que fecharam; a tabela de preços e as regras de desconto e prazo; o que o cliente costuma perguntar antes de fechar.

**O que você constrói.**
1. Instruções do Project com a estrutura fixa da proposta (entendimento do problema, solução, escopo, investimento, prazo, próximos passos), as regras comerciais e o tom.
2. A sequência de follow-up: 3 mensagens (D+2, D+5, D+10), cada uma com um motivo real para escrever (não "só passando para saber").
3. O pedido padrão: colar o briefing ou a transcrição da reunião e pedir "proposta + follow-ups".
4. Se o dono quiser arquivo pronto: a proposta em .docx gerada pelo Claude (quando o ambiente permitir) a partir do modelo.

**Teste de aceitação.** Uma proposta real que ainda não foi enviada. Aprovado se o vendedor mandaria com até 10 minutos de ajuste.

**Rotina.** A cada reunião comercial, no mesmo dia. Dono define: "proposta sai em 24h".

**Armadilhas.** Preço calculado errado por regra ambígua: coloque a tabela em formato de regra ("acima de 100 unidades, 8% de desconto") e teste os extremos.

## Caso 6 · Briefing automático de cliente antes da reunião

**Antes de construir, confirme:** o CRM já tem ficha do cliente com histórico? Se tem, o briefing de entrega lê a exportação dela; o de venda é pesquisa na internet, que o CRM não faz.

**Camada mínima.** Project "Briefing de reunião" + pesquisa na internet (venda); conectores CRM/Drive/Gmail (entrega), ou a ficha exportada e colada.

**Insumos.** A proposta de valor da empresa em 10 linhas e 3 casos atendidos (para o briefing de venda cruzar); o modelo de briefing que o dono quer (proponha: quem é, o que faz, tamanho e momento, pessoa do outro lado, dor provável, como ajudamos, 3 perguntas de abertura, 1 risco); para entrega, a ficha de um cliente real da carteira.

**O que você constrói.**
1. Instruções do Project com os dois modelos (venda e entrega), a regra de citar a fonte de cada informação pesquisada e a regra de marcar "a confirmar" o que não achou.
2. Os dois pedidos padrão: "Briefing de venda: [empresa], [pessoa], reunião [data]" e "Briefing de entrega: [cliente], com a ficha anexa".
3. A lista do que o vendedor confere antes de usar (nome da pessoa, cargo, notícia recente).

**Teste de aceitação.** Uma reunião real desta semana. Aprovado se o vendedor usaria o briefing sem mais de 5 minutos de ajuste e nenhum dado está errado ao conferir.

**Rotina.** Na véspera de cada reunião, vendedor ou gestor de conta, 10 minutos.

**Armadilhas.** Pesquisa na internet erra e mistura empresas homônimas: a instrução pede o site e a cidade como âncora. Dado de cliente da carteira: só na conta da empresa, só o necessário.

## Caso 7 · Documentos, notas e contratos

**Camada mínima.** Chat (arrastar o PDF) para começar; Project "Documentos" com o checklist por tipo; Cowork quando for pasta com dezenas de arquivos por mês.

**Insumos.** 2 exemplos de cada tipo de documento que chega (nota de fornecedor, contrato, boleto); o que a empresa confere em cada um (nota: fornecedor, valor, pedido correspondente, vencimento, impostos destacados; contrato: prazo, multa, renovação, reajuste, foro); a planilha onde os dados vão.

**O que você constrói.**
1. Um checklist de conferência por tipo de documento, nas instruções do Project.
2. O formato de saída: tabela com as colunas da planilha da empresa, pronta para colar.
3. O pedido padrão: "Confere estas notas contra o pedido anexo e monta a tabela" / "Resume este contrato em 10 linhas com prazo, multa e renovação, e aponta o que eu deveria negociar".
4. Para volume: o roteiro do Cowork (aponte a pasta do mês, peça a planilha consolidada e a lista de divergências).

**Teste de aceitação.** 5 notas reais do último mês. Aprovado se os valores extraídos batem com a conferência manual em 5 de 5 e a divergência plantada (coloque uma nota com valor errado de propósito) é apontada.

**Rotina.** Diária ou semanal, quem: administrativo. Contador recebe a planilha consolidada no dia 1.

**Armadilhas.** PDF escaneado de baixa qualidade erra número: peça o XML da nota (NF-e) quando houver, é mais confiável. O Claude não emite nota nem decide tributo.

## Caso 8 · Reuniões viram ata, decisão e tarefa

**Camada mínima.** Project "Reuniões". Conectores de calendário e de tarefas quando o dono já usa Notion, Asana ou Google Tasks.

**Insumos.** A transcrição de uma reunião recente (Meet, Zoom e Teams geram; ou gravação pelo celular transcrita); a lista do time com cargos; os projetos em andamento; o formato de ata que preferem (proponha: decisões, tarefas com responsável e prazo, pendências, próximos passos).

**O que você constrói.**
1. Instruções do Project com o time, os projetos, o formato fixo da ata e a regra "toda tarefa tem um nome e uma data; se não tem, aparece como pendência".
2. O modelo da mensagem de cobrança individual (uma por responsável).
3. O pedido padrão: colar a transcrição e pedir "ata + tarefas + cobranças".
4. O pedido de segunda: "O que ficou aberto das últimas 2 reuniões?" (as atas anteriores ficam no conhecimento do Project).

**Teste de aceitação.** Uma reunião real desta semana. Aprovado se as decisões batem com o que os participantes lembram e cada tarefa tem dono e prazo.

**Rotina.** Logo após cada reunião, 5 minutos, quem conduziu.

**Armadilhas.** Transcrição com nomes trocados: inclua o nome e a função de cada participante no pedido.

## Caso 9 · E-mail e caixa de entrada: triagem e resposta na sua voz

**Antes de construir, confirme:** filtros e respostas automáticas já configurados? Se sim, a IA entra no rascunho na voz da pessoa; se não, na triagem também.

**Camada mínima.** Project "Caixa de entrada" (voz + regras) → conector Gmail ou Outlook (quando disponível) → Skill "triagem da manhã".

**Insumos.** 10 e-mails que a pessoa escreveu e aprovou (é a voz); as 4 pilhas de triagem da casa (proponha: responder hoje, delegar para X, só ler, descartar); as 8 a 10 respostas-padrão para o que repete (segunda via, prazo, orçamento, agenda); a lista de remetentes que sempre têm prioridade (clientes-chave, banco, contador).

**O que você constrói.**
1. O guia de voz da pessoa em 1 página (traços, extensão típica, abertura e fechamento, o que ela nunca escreve), extraído dos 10 e-mails.
2. Instruções do Project: regras de triagem, prioridade por remetente, respostas-padrão, regra "nunca envie; sempre rascunho para revisão", regra de dado sensível (não copiar anexos com dado de terceiros).
3. Dois pedidos padrão: "Triagem da manhã" (com o conector, ou colando os assuntos) e "Responde este e-mail: [texto]".
4. O follow-up: "Quem não me respondeu há mais de 3 dias?".

**Teste de aceitação.** Os 20 e-mails de ontem. Aprovado se a triagem bate com a da pessoa em 16 de 20 e 8 de 10 rascunhos saem no tom dela sem edição.

**Rotina.** Todo dia, 8h30, a pessoa dona da caixa, 20 minutos.

**Armadilhas.** Sem os 10 e-mails aprovados, a voz sai genérica. Conector lê a caixa inteira: use a conta da empresa e revise permissões. O Manual de IA #14 ensina a montar a IA que escreve como você.

## Caso 10 · Processos e treinamento (POP a partir de um áudio)

**Camada mínima.** Project "Processos". Cowork para gerar vários de uma vez. Um segundo Project "Manual do time", com os POPs no conhecimento, para o funcionário novo tirar dúvida.

**Insumos.** Um áudio ou vídeo de 5 a 10 minutos do funcionário explicando como faz um processo (transcrito pelo celular ou pelo Claude quando o ambiente aceitar áudio); a lista dos processos que travam sem uma pessoa específica (se o dono não sabe quais, use a skill de processos-chave do Kit, se estiver disponível na conversa; senão, pergunte "o que trava quando você viaja?"); o organograma.

**O que você constrói.**
1. O modelo de POP da casa: objetivo, quem faz, quando, passo a passo numerado, o que fazer quando dá errado, o que é "pronto", ferramentas usadas.
2. Instruções do Project para transformar transcrição em POP, checklist de execução e roteiro de treinamento de 30 minutos.
3. O primeiro POP, feito ao vivo com a transcrição real.
4. Instruções do Project "Manual do time": responder só com base nos POPs, dizer quando não sabe e indicar com quem falar.

**Teste de aceitação.** Uma pessoa que não faz o processo lê o POP e executa. Aprovado se consegue sem perguntar mais de 2 vezes.

**Rotina.** Um processo por semana até cobrir os críticos (em geral 8 a 15). Revisão trimestral.

**Armadilhas.** Documentar processo ruim só o torna oficial: antes de escrever, pergunte ao dono se é assim que deveria ser feito.

## Caso 11 · Contratação e RH de primeira linha

**Camada mínima.** Project "Gente". Cowork para triar pasta de currículos.

**Insumos.** A descrição real do que o cargo faz no dia a dia (não a vaga antiga); os critérios que eliminam e os que diferenciam; os valores da casa; as políticas internas escritas (ou as respostas que o dono mais dá).

**O que você constrói.**
1. Descrição de vaga honesta (o que a pessoa vai fazer, como é o dia, o que é sucesso em 90 dias, faixa de remuneração se o dono permitir).
2. Matriz de triagem: critérios com peso e a instrução de pontuar cada currículo com justificativa em uma linha.
3. Roteiro de entrevista de 40 minutos com perguntas comportamentais ligadas aos critérios.
4. Plano de 30 dias de integração, com o que a pessoa deve saber fazer ao fim de cada semana.
5. Instruções para dúvidas de RH: responder com base nas políticas da casa e **sempre** encerrar com "confirme com o contador/advogado o que envolve a lei" quando o tema for férias, rescisão, hora extra, escala ou benefício legal.

**Teste de aceitação.** 10 currículos reais. Aprovado se o ranking do Claude coincide com o do dono em 8 de 10 e as justificativas são verificáveis no currículo.

**Rotina.** Por vaga aberta. Dúvidas de RH: contínuo.

**Armadilhas.** Triagem não pode usar idade, gênero, origem, foto ou qualquer dado que configure discriminação; instrua explicitamente a ignorar e a avaliar só o que está ligado ao cargo. Decisão trabalhista é do profissional habilitado.

## Caso 12 · Mapa do trabalho invisível do time

**Antes de construir, confirme:** o time sabe por que vai registrar? Sem a explicação ("tirar tarefa chata da mesa, não medir gente") o registro vem falso e o mapa sai errado.

**Camada mínima.** Project "Mapa do time" → Cowork para consolidar registros de muita gente.

**Insumos.** O organograma com nome e função; a lista dos processos-chave (se houver); a planilha de registro (proponha: pessoa, dia, bloco de 30 min, tarefa, para quem, categoria: valor / retrabalho / incêndio / repetitivo / não deveria existir) ou os áudios de fim de dia transcritos; 5 dias de registro.

**O que você constrói.**
1. A planilha de registro pronta (ou o roteiro do áudio de 2 minutos no fim do dia: "o que fiz, quanto tempo, o que travou").
2. A mensagem para o time explicando o objetivo e o prazo de 5 dias.
3. Instruções do Project: como classificar cada tarefa nas 5 categorias, como consolidar por pessoa e por área, o formato do mapa (10 tarefas que mais consomem horas, horas por categoria, recomendação por tarefa: automatizar / delegar / simplificar / cortar, com o caso do Mapa correspondente).
4. O pedido padrão: "Consolida a semana com os registros anexos."

**Teste de aceitação.** Os registros reais da semana. Aprovado se o dono reconhece o mapa ("é isso mesmo") e pelo menos 2 das 10 tarefas eram invisíveis para ele; nenhuma linha identifica pessoa em linguagem de avaliação.

**Rotina.** Uma semana por trimestre. Resultado alimenta o Top 3 do Mapa da Operação Eficiente.

**Armadilhas.** Registro vira vigilância: o mapa é por tarefa e por área, não ranking de gente; nunca critério de demissão. Cinco dias bastam; mais que isso o time para de registrar. O Manual de IA #14 (segunda parte) tem o método.

## Caso 13 · Comunicação da casa sem agência

**Camada mínima.** Project "Marca". Skill por formato quando o volume justificar. Conector Canva para a arte, quando disponível.

**Insumos.** 10 textos aprovados (posts, e-mails, descrições) que soam como a marca; 3 que o dono odiou e por quê; quem é o cliente; o que a marca nunca diz; o calendário do mês (ou a skill de calendário comercial do Kit, se estiver disponível).

**O que você constrói.**
1. O guia de voz em 1 página: quem somos, como falamos (5 traços com exemplo), o que nunca dizemos, 10 exemplos aprovados.
2. Instruções do Project: para cada formato (post, e-mail, descrição de produto, resposta a avaliação), estrutura, tamanho e chamada para ação padrão.
3. O pedido padrão: "O post de [dia] sobre [tema], no formato [X]."
4. A rotina de produção: uma manhã por semana, 7 peças, revisão do dono em 20 minutos.

**Teste de aceitação.** 5 peças da semana. Aprovado se o dono publicaria 4 com ajuste de até 2 minutos cada.

**Armadilhas.** Sem exemplos aprovados, a IA escreve genérico. Sem revisão humana, erro de preço ou promessa vai ao ar. Estratégia (o que dizer, para quem, por que) continua sendo decisão de gente.

## Caso 14 · Painel de indicadores e simulação de cenários

**Camada mínima.** Project "Painel" com a planilha de indicadores; conector Google Sheets quando disponível; Skill "painel de segunda" quando o formato estabilizar.

**Insumos.** A planilha onde os números moram (ou as exportações do sistema); a definição de cada indicador (como é calculado) e a meta; as 3 perguntas que o dono faz toda semana olhando os números.

**O que você constrói.**
1. A lista de 6 a 8 indicadores com definição, fonte e meta, nas instruções do Project.
2. O formato da leitura semanal: o que subiu, o que caiu, o que explica, o que fazer (3 ações).
3. O pedido padrão: "Lê a semana com a planilha anexa."
4. Para cenários: uma planilha de simulação com premissas em células visíveis (preço, volume, custo, imposto, folha) e resultado (receita, margem, caixa), gerada pelo Claude quando o ambiente permitir, para o dono mexer nas premissas. Para cenário tributário e para preço e DRE, use as skills do Kit que estiverem disponíveis na conversa; senão, monte a simulação com as premissas do dono.

**Teste de aceitação.** A leitura da semana passada. Aprovado se o dono não encontra erro nos números e pelo menos uma das 3 ações é algo que ele não tinha visto.

**Rotina.** Segunda, 8h, antes da reunião de time. 20 minutos.

**Armadilhas.** Indicador sem definição vira briga de reunião: feche a definição antes de automatizar. Simulação é só tão boa quanto a premissa; mostre as premissas, nunca só o resultado.

---

## Caso 15 · Edição de vídeos com IA

**Antes de construir, confirme:** existe vídeo bruto gravado (a galeria do celular do dono costuma ter 20)? Sem matéria-prima, a primeira rotina é gravar, não editar.

**Camada mínima.** Project "Vídeos" (estilo da casa) + skill de vídeo do Kit, se estiver disponível na conversa; senão, o fluxo do Manual de IA #26 com o Claude e a ferramenta de edição por IA que o dono escolher.

**Insumos.** 3 vídeos brutos (ou a transcrição deles); 2 vídeos de referência que o dono gosta (ritmo, legenda, abertura); as redes e os formatos (Reels 9:16, YouTube 16:9); a chamada final padrão; a identidade (cores, fonte, logo).

**O que você constrói.**
1. O guia de estilo de vídeo em 1 página (abertura de 3 segundos, legenda, cortes, chamada final, o que nunca aparece).
2. Instruções do Project: a partir da transcrição, escolher os 3 a 5 melhores trechos de 30 a 60 segundos (gancho, uma ideia, fecho), escrever título e legenda da rede, e gerar as instruções de corte (minuto inicial e final de cada trecho) para a ferramenta de edição.
3. O pedido padrão: "Cortes do vídeo com a transcrição anexa."
4. Se a skill de vídeo do Kit estiver disponível, o roteiro de uso dela do corte ao arquivo pronto.

**Teste de aceitação.** Um vídeo bruto real. Aprovado se o dono publicaria pelo menos 2 dos cortes sugeridos e a legenda sai no tom da casa.

**Rotina.** Uma manhã por semana: grava 1 vídeo longo, saem 5 cortes. Quem: dono ou marketing. Métrica em 30 dias: vídeos publicados antes × depois.

**Armadilhas.** Corte bom depende de transcrição boa: grave com áudio limpo. A IA edita vídeo simples; produção com direção de arte continua com gente. Direitos de imagem de cliente e funcionário: autorização por escrito antes de publicar.

## Variante · Confirmação de agenda e lista de espera (clínicas, salões, escolas, oficinas, serviços agendados)

**Camada mínima.** Project "Agenda do dia". Automação só depois de 2 semanas com a recepção no circuito e se o sistema de agenda não oferecer confirmação boa o bastante.

**Antes de construir, confirme:** o sistema de agenda já tem confirmação automática (muitos têm, paga ou desligada)? Se tem, a IA entra onde ele não chega: mensagem personalizada, resposta ao paciente que quer remarcar, lista de espera para encaixe, lista de atenção para a recepção.

**Insumos.** A agenda de um dia exportada **sem** prontuário, procedimento ou diagnóstico (só: nome ou primeiro nome, horário, profissional, se é primeira vez, se é menor de idade); a mensagem de confirmação que a recepção manda hoje; a política de falta e de remarcação; a lista de espera (nome, contato, janela de horário que aceita).

**O que você constrói.**
1. Instruções do Project: tom da casa, a regra de dado sensível (nenhuma mensagem cita procedimento, diagnóstico, exame ou orientação clínica; menor de idade recebe mensagem dirigida ao responsável), as 3 mensagens (confirmação 48h, lembrete 2h, resposta a "preciso remarcar"), a regra de encaixe pela lista de espera.
2. Três pedidos padrão: "Agenda de amanhã" (gera as confirmações e a lista de atenção: quem já faltou antes, primeira vez, menor); "Resposta do paciente: [texto]" (gera a réplica certa: confirmado, remarcar com 2 opções, cancelado → aciona encaixe); "Vaga aberta às [hora] com [profissional]" (gera a oferta de encaixe para os 3 primeiros da lista de espera que aceitam aquele horário).
3. A planilha simples de acompanhamento (data, agendados, confirmados, faltas, encaixes) para medir a taxa de falta.

**Teste de aceitação.** A agenda real de amanhã. Aprovado se 8 de 10 mensagens saem sem edição, nenhuma carrega dado clínico, e a lista de atenção aponta corretamente quem é primeira vez e quem já faltou.

**Rotina.** Todo dia, 16h, recepção: "Agenda de amanhã", 15 minutos. Toda sexta: ler a taxa de falta da semana.

**Armadilhas.** Dado de saúde é dado sensível (LGPD, art. 11): o Project não recebe prontuário nem motivo da consulta. Confirmar sem oferecer remarcação fácil só gera "não vou" sem encaixe: as duas opções de horário na réplica são obrigatórias.

## Variante · Conciliação de recebimentos (quem recebe por 3+ meios)

**Camada mínima.** Project "Conciliação" com upload dos relatórios; Cowork quando são mais de 5 arquivos por semana.

**Insumos.** Os relatórios de uma semana: adquirente de cartão, Pix (extrato), boletos (sistema), marketplace ou convênio, e o relatório de vendas do ERP ou do caixa; a tabela de taxas contratadas por meio (ex.: débito 1,2%, crédito à vista 2,8%).

**O que você constrói.**
1. Instruções do Project: como casar venda com recebimento (data, valor bruto, meio, parcelas), as taxas contratadas, o que é divergência (taxa acima do contrato, venda sem repasse em D+X, repasse sem venda, estorno não registrado).
2. O formato de saída: tabela de conciliado × divergente, total por meio, lista de divergências com valor e ação sugerida ("abrir chamado na adquirente", "conferir cancelamento").
3. O pedido padrão: "Concilia a semana com os arquivos anexos."

**Teste de aceitação.** Uma semana real. Aprovado se os totais por meio batem com o extrato (diferença explicada) e a divergência plantada de propósito é apontada.

**Rotina.** Segunda, 10h, financeiro, 30 minutos. Divergências vão para quem fala com a adquirente.

**Armadilhas.** Relatório de adquirente muda de layout: guarde um exemplo de cada no conhecimento do Project. Parcelado confunde data de venda com data de repasse: a regra precisa estar escrita.

## Variante · Compras e reposição (varejo, indústria, distribuição)

**Camada mínima.** Project "Compras" com a planilha de estoque e vendas; Cowork para histórico grande.

**Insumos.** Exportação de estoque atual e vendas dos últimos 3 a 6 meses por item (do ERP); prazo de entrega por fornecedor; sazonalidade conhecida (datas fortes); as 3 últimas cotações recebidas.

**O que você constrói.** Instruções para calcular giro, cobertura em dias e ponto de pedido por item; alerta de ruptura (cobertura menor que o prazo do fornecedor) e de excesso (cobertura acima de X dias); comparação de cotações normalizada (preço por unidade, frete, prazo, condição). Pedido padrão: "Reposição da semana com o estoque e as vendas anexos."

**Teste de aceitação.** Os 20 itens mais vendidos. Aprovado se o comprador concorda com 16 das 20 sugestões e a ruptura conhecida da última semana teria sido apontada.

**Rotina.** Semanal, comprador, 40 minutos. **Armadilhas.** Dado de estoque desatualizado invalida tudo: confirme a data da exportação. A IA sugere; quem fecha pedido é o comprador.

## Variante · Ficha técnica e CMV (restaurantes e alimentação)

**Camada mínima.** Project "Cardápio".

**Insumos.** As receitas dos 10 pratos mais vendidos (ingredientes e quantidades, mesmo aproximadas); a última nota de compra de cada insumo; o preço de venda e a quantidade vendida por prato no último mês.

**O que você constrói.** Instruções para montar ficha técnica (rendimento, custo por porção), CMV por prato e margem de contribuição; a matriz de cardápio (popularidade × margem) com a ação para cada quadrante (manter, subir preço, reposicionar, tirar). Pedido padrão: "Atualiza o CMV com as notas anexas."

**Teste de aceitação.** 5 pratos. Aprovado se o custo por porção bate com a conta do dono em até 10% e ele concorda com pelo menos 3 das ações sugeridas.

**Rotina.** Mensal, dono ou chef, 1 hora. **Armadilhas.** Desperdício e perda não aparecem na receita: inclua um fator de perda por insumo (premissa, ajustável).

## Variante · Entregas e SLA (serviços recorrentes)

**Camada mínima.** Project "Entregas" com a lista de clientes e o que cada um recebe.

**Insumos.** Lista de clientes com escopo contratado e prazos; o que foi entregue no último mês; o modelo de relatório mensal que a empresa manda (ou o que gostaria de mandar).

**O que você constrói.** Checklist de entrega por cliente com prazo; alerta de atraso; relatório mensal de cliente gerado a partir do que foi feito (lista de atividades → texto no tom da casa). Pedidos padrão: "O que vence esta semana?" e "Relatório do mês do cliente X com as atividades anexas."

**Teste de aceitação.** Um cliente real. Aprovado se o relatório sai pronto para enviar com até 5 minutos de ajuste e o checklist pega a entrega atrasada que o dono já sabe que existe.

**Rotina.** Segunda, gestor de contas, 20 minutos; relatório no dia 1. **Armadilhas.** Relatório que só lista tarefas não mostra valor: a instrução pede "o que mudou para o cliente", não "o que fizemos".

## Variante · Catálogo e pós-venda (e-commerce e marketplace)

**Camada mínima.** Project "Loja" (duas frentes nas mesmas instruções ou dois Projects, se o time for diferente).

**Insumos.** Planilha de produtos (nome, atributos, fotos se houver), 5 descrições aprovadas; as 15 perguntas de pós-venda mais comuns com a política de troca e prazo; o rastreio típico.

**O que você constrói.** Instruções para descrição e atributos em lote no padrão da plataforma (título, bullets, descrição, palavras-chave); respostas de pós-venda com tom da casa e regra de quando passar para humano (reclamação formal, pedido extraviado acima de R$ X). Pedidos padrão: "Descrições para os produtos da planilha anexa" e "Resposta para: [mensagem do cliente]".

**Teste de aceitação.** 10 produtos e 10 mensagens reais. Aprovado se 8 de 10 saem sem edição em cada frente.

**Rotina.** Catálogo: por lote de produtos novos. Pós-venda: contínuo, atendente. **Armadilhas.** Prometer prazo que a logística não cumpre: a instrução só usa o prazo da política.

---

## Receita genérica (quando o pedido não cabe nos casos nem nas variantes)

1. **Se veio Briefing de Construção, não pergunte o que ele já responde:** use "Como a tarefa é feita hoje", "Problema nas palavras do dono" e "Insumos" como a descrição da tarefa. Se não veio briefing, peça a tarefa como ela é feita hoje, passo a passo, com um exemplo real de entrada e de saída.
2. Decida a camada pela hierarquia de custo (Chat+Prompt → Project → Skill → Conector → Cowork → Automação) e justifique em uma frase.
3. Construa a versão mais simples que resolve o exemplo real, com instruções no template de Project.
4. Teste com um exemplo real que você ainda não viu. **Critério de aceitação padrão:** o dono usaria 8 de 10 saídas sem editar; nenhuma saída carrega dado sensível desnecessário; nenhuma promete o que a empresa não cumpre.
5. Defina rotina (quem, quando, quanto tempo) e métrica de 30 dias.
6. Diga o limite e o próximo nível, se e quando o volume justificar.
