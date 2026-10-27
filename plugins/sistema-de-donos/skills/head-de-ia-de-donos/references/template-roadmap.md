# Template do Roadmap de IA (entregável final em .docx)

Use esta estrutura ao gerar o .docx na Fase 5. Lembre que esse documento é o que o dono vai **voltar a consultar nas próximas semanas** — trate como plano executivo, não como ata da conversa.

Se houver uma skill de Word disponível, use-a para a mecânica do arquivo (cabeçalhos, tabelas, formatação). Se não, gere com Python (python-docx) se houver execução de código. Se não houver, entregue o roadmap no chat, em Markdown, com esta mesma estrutura.

---

## Estrutura do documento

### Capa / Cabeçalho

- Título: **Roadmap de IA — [Nome do dono ou descritivo]**
- Subtítulo: *Diagnóstico e plano de adoção de IA no ecossistema Claude*
- Linha de assinatura: *Manual de Donos — De quem fez, pra quem faz.*
- Data
- 1 linha de contexto: *"Plano construído a partir de entrevista de diagnóstico em [data]. Foco: [foco principal — ex: liberar tempo no operacional / acelerar produção de conteúdo / etc.]"*

### 1. Sumário Executivo (meia página)

3 parágrafos curtos:

1. **Quem você é hoje** — papel, contexto, momento. 2-3 frases.
2. **Onde tá apertando** — gargalos principais identificados. 2-3 frases.
3. **A tese deste plano** — em uma frase, qual é a aposta. Ex: *"A maior alavancagem está em transformar a rotina de produção de conteúdo em sistema, liberando 6-8h/semana pra trabalho estratégico."*

### 2. Diagnóstico

Subseções:

**2.1. Rotina semanal mapeada** — onde o tempo vai hoje. Pode ser lista ou tabela simples (categoria | % estimado do tempo | obs).

**2.2. Gargalos identificados** — 3-5 gargalos reais, cada um com 1-2 frases. Não generalize ("muito e-mail") — seja específico ("respostas a leads quentes via WhatsApp consomem 1h/dia porque cada uma exige customização").

**2.3. Repetições mapeadas** — tarefas que se repetem semanalmente ou mais. Lista numerada.

**2.4. Ferramentas e fluência atual** — onde ele mora (ferramentas) e em que nível ele tá com Claude (só chat / usa projects / mexeu com code).

### 3. A primeira ação (destaque)

**Esta é a seção mais importante do documento.** Caixa de destaque ou subseção destacada.

- **Tarefa/rotina alvo:** [específico]
- **Solução proposta:** [camada(s) do ecossistema + descrição]
- **Por que essa primeiro:** justificativa em 2-3 frases (alavancagem vs esforço)
- **Tempo estimado pra ficar de pé:** [Xh ou X dias]
- **Ganho esperado:** [Xh/semana liberadas ou X problema destravado]
- **Métrica de sucesso (dia zero):** *"deu certo se [X] virar [Y] em [prazo]"*
- **Primeiro passo prático:** o que ele faz literalmente na segunda-feira (não "criar um project" — sim "abrir Claude, criar Project chamado X, subir os 3 docs Y, Z, W")

### 4. Mapa completo de oportunidades

Tabela com 5-10 linhas. Colunas:

| # | Tarefa / rotina | Camada recomendada | Ganho esperado | Esforço | Prioridade |
|---|---|---|---|---|---|
| 1 | [...] | Skill + Conector Gmail | -3h/sem | Médio | Alta |
| 2 | [...] | Project | -1h/sem | Baixo | Alta |
| ... |

Após a tabela, **um parágrafo curto pra cada item** (2-4 frases) explicando o que é, por que ajuda, e qual a próxima ação concreta pra implementar.

Organize a tabela em **fases**:

- **Fase 1 (próximas 2 semanas):** primeiro item + 1-2 outros de esforço baixo
- **Fase 2 (próximo mês):** itens de esforço médio
- **Fase 3 (quando tiver fluência):** itens mais complexos ou automações via API

### 5. O que NÃO automatizar (e por quê)

1-2 coisas que ele mencionou mas que não compensa atacar agora. Razões específicas:

- *"Decisões de contratação — alta variabilidade caso a caso, baixo volume, ganho de eficiência marginal vs risco de erro."*
- *"Reuniões com sócio — densidade de contexto e nuance política torna IA mais atrapalho que ajuda."*

Honestidade aqui é parte do valor do diagnóstico.

### 6. Cronograma sugerido

Plano de 30/60/90 dias em formato de cronograma simples:

**Primeiros 14 dias**
- [ ] Item 1 (a "primeira ação")
- [ ] Item X de esforço baixo
- [ ] Marco: [resultado mensurável esperado]

**Dias 15-45**
- [ ] Item Y
- [ ] Item Z
- [ ] Marco: [resultado]

**Dias 46-90**
- [ ] Itens da fase 3
- [ ] Avaliação dos resultados das fases 1 e 2
- [ ] Marco: [resultado]

### 7. Notas finais

- Linha de "como medir sucesso" — métrica simples (horas liberadas/semana, número de tarefas que viraram sistema, etc.)
- Linha sobre próximo checkpoint — *"Vale revisitar este roadmap em [4-6 semanas] pra ajustar com o aprendido."* (Sugira o check-in trimestral: abrir uma conversa nova colando este roadmap e dizer "rodei o plano, eis o que aconteceu, atualiza o diagnóstico.")
- Linha de glossário se ele é iniciante (o que é Project, Skill, Conector — só se relevante)

---

## Tom e formato do .docx

- Cabeçalhos hierárquicos limpos (H1, H2, H3)
- Tabelas onde fizer sentido (mapa de oportunidades, cronograma)
- Listas numeradas / com bullets onde fizer sentido
- Negrito moderado — só em chamadas importantes
- Sem floreios, sem ícones excessivos, sem emojis (a não ser que o dono use emoji o tempo todo)
- Linguagem do mesmo nível da conversa (não enformaliza pra parecer consultoria de PowerPoint)
- 4-8 páginas é a faixa boa. Menos parece superficial, mais ninguém lê.

---

## Nome do arquivo

`roadmap-ia-[primeiro-nome-ou-data].docx`

Ex: `roadmap-ia-joana.docx` ou `roadmap-ia-2026-06-08.docx`.

Gere o arquivo e entregue para o usuário baixar. No chat do Claude, salve na pasta de saída da sessão; no Claude Code, salve na pasta atual do projeto. Se não for possível gerar arquivo, entregue o conteúdo completo no chat, em Markdown.
