# Ecossistema Claude — Detalhe de cada camada

Este arquivo é a "régua" do Head de IA. Toda recomendação na Fase 5 deve mapear pra uma destas camadas com justificativa clara. Use a comparação `quando recomendar × quando NÃO recomendar` pra decidir.

---

## 1. Claude Chat

**O que é:** A interface conversacional padrão. É onde a maioria dos donos começa.

**Quando recomendar:**
- Tarefas pontuais, criativas ou exploratórias
- Brainstorm, drafts iniciais, perguntas abertas
- Quando o dono ainda não sabe direito o que quer

**Quando NÃO recomendar como solução principal:**
- Quando a tarefa se repete toda semana com a mesma cara → vira Skill
- Quando precisa de contexto que ele recoloca toda vez → vira Project
- Quando precisa puxar dado de outro sistema → vira Conector

**Exemplo típico de recomendação:** *"Pra ideias soltas e drafts iniciais, fica no chat mesmo — funciona."*

---

## 2. Projects

**O que é:** Um espaço persistente onde você sobe arquivos de contexto (PDFs, docs, briefings) e instruções customizadas. Todas as conversas dentro daquele Project já chegam com esse contexto carregado.

**Quando recomendar:**
- Dono tem um workstream contínuo: um produto, um cliente, uma newsletter, um trimestre
- Toda vez que abre conversa nova, perde 5 minutos recolocando contexto
- Tem 3+ arquivos de referência que sempre voltam
- Quer "treinar" o Claude no tom/jeito de um projeto específico

**Quando NÃO recomendar:**
- Tarefas isoladas, sem repetição
- Quando o contexto muda demais a cada conversa

**Exemplos típicos:**
- Project "Newsletter X" com edições passadas + guia de estilo + persona da audiência
- Project "Cliente Y" com contrato + histórico de reuniões + briefing
- Project "Produto Z" com docs técnicos + roadmap + decisões anteriores

**Como medir alavancagem:** "Quanto tempo você gasta hoje recolocando contexto a cada conversa? Multiplica por quantas conversas você abre por semana."

---

## 3. Skills

**O que é:** Workflow capturado em código — instrução + referências + às vezes scripts. Acionado por gatilhos (palavras-chave, padrões de pedido). Esta skill aqui é um exemplo.

**Quando recomendar:**
- Dono faz a mesma coisa de forma parecida várias vezes (semanal+)
- Existe um "jeito certo" de fazer que ele consegue articular
- A saída tem estrutura previsível (formato, blocos, tom)
- O custo de explicar "como fazer" toda vez é alto

**Quando NÃO recomendar:**
- Tarefa que ele só faz 1-2x por ano
- Tarefa cujo jeito muda muito caso a caso
- Quando ele ainda não sabe o "jeito certo" — primeiro precisa rodar manual algumas vezes

**Exemplos típicos:**
- Skill que escreve newsletter no tom específico dele
- Skill que analisa balanços e devolve em formato padrão
- Skill que gera primeira versão de proposta comercial com estrutura X
- Skill que faz review de copy seguindo critérios dele

**Como medir alavancagem:** Tempo médio da tarefa × frequência semanal × % do tempo que vira automático com a skill.

---

## 4. Conectores (MCP)

**O que é:** Plug entre Claude e ferramentas externas (Notion, Google Drive, Gmail, Calendar, Slack, Canva, Figma, GitHub, Beehiiv, etc.). Tira o copia-e-cola.

**Quando recomendar:**
- Dono gasta tempo trazendo dados de outro sistema pra dentro do Claude (e vice-versa)
- Precisa puxar info de e-mail, calendário, drive, base de conhecimento
- Quer agir em outro sistema a partir do Claude (criar evento, mandar e-mail, criar página no Notion)

**Quando NÃO recomendar:**
- Se a fonte de dados é privada/sensível e o conector ainda não passou no critério de segurança dele
- Se o volume de uso é baixo demais (1x/mês não compensa setup)

**Conectores comuns que valem mencionar (verificar disponibilidade — não afirme que existe sem checar):**
- Google Drive — leitura de docs/planilhas
- Gmail — leitura de e-mails, drafts
- Google Calendar — leitura/escrita de eventos
- Notion — leitura/escrita de páginas e bases
- Slack — leitura de mensagens, posts
- Canva — geração de designs
- Figma — leitura de design system, geração de código
- GitHub — issues, PRs, código

**Como medir alavancagem:** Quantas vezes por semana ele faz copia-e-cola entre Claude e outra ferramenta. Cada um desses é candidato a conector.

---

## 5. Claude Cowork

**O que é:** App desktop onde Claude age como agente em arquivos/pastas locais. Trabalha em planilhas, docs, organização de arquivos, pesquisa longa — coisas que dão trabalho na interface web.

**Quando recomendar:**
- Dono lida com volume de arquivos no computador (planilhas, docs, PDFs em pastas)
- Tarefa precisa "trabalhar" um tempo (pesquisa profunda, processar muitos arquivos)
- Não-dev que quer agente trabalhando em arquivos, sem mexer com terminal

**Quando NÃO recomendar:**
- Dono trabalha 100% em ferramentas web (não tem arquivos locais)
- Tarefa rápida que cabe no chat
- Dono não tem desktop (só mobile/web)

**Exemplos típicos:**
- "Lê todos os relatórios desta pasta e me devolve um resumo comparativo"
- "Processa essa planilha de 2000 linhas e devolve segmentada por X"
- "Pesquisa profunda sobre tema Y, com 20 fontes, e monta dossiê"
- Organização e renomeação em lote de arquivos

---

## 6. Claude Code

**O que é:** Ferramenta de linha de comando que opera em código, repositórios e tarefas técnicas longas.

**Quando recomendar:**
- Dono tem código próprio ou repositório que precisa de manutenção/expansão
- Tarefas técnicas agentic (refactor, build de feature, debug em escala)
- Automação de scripts em servidor, integração com Git

**Quando NÃO recomendar:**
- Não-dev sem familiaridade com terminal (Cowork é melhor)
- Tarefa que não envolve código

**Exemplos típicos:**
- Construir landing page / app pequeno
- Refactor de repositório
- Criar script de automação pra rodar em servidor
- Manter scripts internos de processamento

---

## 7. API + Automação (n8n, Make, scripts próprios)

**O que é:** Quando o uso de IA vira sistema rodando sem humano no loop. API do Claude chamada por webhooks, n8n, Make, scripts próprios.

**Quando recomendar:**
- Volume já justifica: rotina diária/horária/disparada por evento
- Já existe pipeline (lead chega → entra no CRM → manda e-mail → tagueia)
- Dono já sabe o "jeito certo" (foi skill antes, agora vira automação)

**Quando NÃO recomendar:**
- Cedo demais. Sempre rode manual → skill → automação. Pular etapas geralmente vira retrabalho.
- Tarefas com decisão sensível que precisa de humano no loop

**Exemplos típicos:**
- Resposta automática categorizada a e-mails de atendimento
- Classificação e roteamento de leads
- Geração diária de relatório enviado por e-mail
- Trigger no Notion → ação no sistema
- Disparo de newsletter com geração de copy

---

## Como escolher entre camadas (heurísticas)

Quando estiver na dúvida sobre que camada recomendar pra uma tarefa específica, use estas perguntas em ordem:

1. **A tarefa se repete?** Não → Chat. Sim → segue.
2. **Tem um "jeito certo" já claro?** Não → Chat + Project. Sim → segue.
3. **Precisa de contexto persistente?** Sim → Project (sozinho ou com Skill).
4. **Precisa puxar dados de fora?** Sim → Conector (combinado com Project/Skill).
5. **Mexe com muitos arquivos locais?** Sim → Cowork.
6. **Mexe com código?** Sim → Claude Code.
7. **Volume já justifica tirar humano do loop?** Sim → API/Automação. Não → Skill.

A maioria das recomendações boas é **combinação de camadas**, não uma só. Ex: *"Project com guia de estilo + Conector Notion pra puxar base de edições + Skill que monta a edição"*.

---

## Dicas de calibragem

- **Mais barato sempre primeiro.** Antes de recomendar automação via API, veja se vira skill. Antes de skill, veja se vira Project.
- **Esforço de setup × ganho.** Recomendação só vale se o ganho cobre o setup em < 8 semanas. Senão, fica pra fase 2.
- **Não venda complexidade.** Se a solução tem 4 camadas e o dono tá no nível "só usei chat", quebre em fases.
- **Comece pela dor mais cara e mensurável**, não pelo processo mais divertido de automatizar.
