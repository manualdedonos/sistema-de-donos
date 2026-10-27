# Briefing de Construção — o contrato entre o diagnóstico e a obra

O Briefing de Construção é o bloco que fecha o diagnóstico e que a skill **construtor-ia-manual** lê para começar a construir sem perguntar tudo de novo. Gere um briefing por iniciativa do Top 3 (três blocos, o #1 primeiro). Cada briefing precisa funcionar sozinho, colado numa conversa nova: Negócio, Setor, Receita a usar, Fluência, Dado sensível e Métrica sempre completos; só "Insumos" e "Ferramentas em uso" podem vir como "idem #1". Entregue cada um em bloco de código copiável, para o dono poder colar numa conversa nova.

Preencha todos os campos. Onde não houver informação, escreva "a confirmar" em vez de inventar.

```
=== BRIEFING DE CONSTRUÇÃO · INICIATIVA #1 ===
Negócio: [o que faz, para quem, porte (faturamento aproximado e tamanho do time), regime tributário]
Setor: [setor] · Cidade/região: [se informado]
Caso do Mapa: [número e nome do caso, ou "Variante · nome"]
Receita a usar no construtor: [nome exato da receita em receitas-de-construcao.md, ex.: "Caso 2 · Cobrança" ou "Variante · Confirmação de agenda"]
Problema, nas palavras do dono: "[citação curta do que ele disse]"
Como a tarefa é feita hoje: [passo a passo em 2-3 linhas; se houver, a mensagem/modelo que a empresa usa hoje]
O que vai existir no fim: [entregável concreto, ex.: "régua de 4 mensagens por faixa de atraso + lista semanal priorizada"]
Camada recomendada: [Chat+Prompt / Project / Skill / Conector X / Cowork / Automação] — começar por: [a mais barata que resolve] · próximo degrau: [camada seguinte] quando [gatilho de volume]
O que o sistema atual já faz (e a IA não refaz): [ex.: "o Clinicorp já manda lembrete padrão; a IA entra na mensagem personalizada e no reagendamento"]
Quem usa e quando: [pessoa/cargo] · [frequência, ex.: "toda segunda, 9h"]
Pedidos padrão previstos: [um por fluxo, ex.: "fecha a semana" / "cobra a semana"]
Insumos que o dono precisa ter na mão: [lista objetiva: planilha X exportada do sistema Y, 3 exemplos de mensagens já enviadas, tabela de preços, guia de voz...]
Dado real para o teste: [qual arquivo/amostra, de quando, com que colunas, ex.: "lista de parcelas em atraso de outubro, exportada do Sheets, com nome, valor, vencimento"]
Critério de aceitação: [ex.: "8 de 10 mensagens saem sem edição; nenhuma cita procedimento"]
Dado sensível envolvido: [nenhum / financeiro de cliente / saúde / menor de idade / dados de funcionário] — cuidado: [uma linha]
Ferramentas em uso que entram: [WhatsApp Business, planilha Google, ERP Z, CRM W...]
Fluência com o Claude: [só chat / já usa Project / já instalou skill / usa Cowork]
Métrica de sucesso em 30 dias: "deu certo se [X] virar [Y] até [data]"
Ganho estimado (conservador): [fórmula com os números do dono e a premissa escrita, ex.: "12h/sem × 30% (premissa) × R$ 44/h × 4,3 = ~R$ 680/mês em tempo do financeiro; + premissa: 20% dos R$ 70 mil em atraso recente = ~R$ 14 mil, a medir em 30 dias"]
Riscos e limites: [o que a IA não faz aqui; quem decide o que; dependência de terceiro]
Primeiro passo (hoje, 15 minutos): [a ação concreta]
=== FIM DO BRIEFING ===
```

Depois dos três briefings, feche com a chamada de execução:

> Quer construir a #1 agora? Digite **"construir a iniciativa #1"** (ou cole o briefing numa conversa nova) e a skill **construtor-ia-manual** assume daqui: ela monta o Project, o prompt, a skill ou a planilha com você, testa com um dado real e deixa rodando.
