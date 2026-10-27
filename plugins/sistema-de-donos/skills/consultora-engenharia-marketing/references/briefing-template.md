# Briefing da Ferramenta — formato padrão

Este é o contrato entre a Consultora e a Construtora. Preencha todos os campos. O que não for conhecido vira `[CONFIRMAR: ...]`, nunca um número inventado sem marcação.

```
BRIEFING DA FERRAMENTA

1. NEGÓCIO
- Nome:
- O que vende / ticket médio:
- Cliente:
- Objetivo da ferramenta: (cliente novo | recompra | orçamento qualificado)

2. A FERRAMENTA
- Nome:
- Formato: (calculadora | simulador | diagnóstico | quiz | gerador)
- Pergunta-antes-da-compra que ela responde:
- Promessa (título da tela inicial):
- Subtítulo (o que a pessoa recebe no fim):
- Tempo para responder: (ex.: menos de 2 minutos)

3. PERGUNTAS (máx. 7)
Para cada uma:
- P1 · id: (curto, sem espaço) · texto: · ajuda (opcional):
  tipo: opcoes | numero | texto
  se opcoes: lista de opções com rótulo e, se houver pontuação, os pontos
  se numero: mínimo, máximo, unidade

4. LÓGICA DO RESULTADO
- Regra completa: fórmula, tabela de pontuação ou árvore de decisão, passo a passo.
- Faixas/perfis de resultado: nome de cada faixa, intervalo, o que significa.
- Arredondamentos e margens (ex.: +10% de sobra de tinta).
- 2 casos de teste: respostas de exemplo → resultado esperado.

5. TELA DE RESULTADO
- Título do resultado (por faixa, se houver):
- Destaque (número ou rótulo grande):
- Explicação (2 a 3 frases, útil mesmo sem compra):
- Recomendações (2 a 4 itens):
- Ponte para a venda (1 frase + oferta, se houver):
- Aviso honesto:

6. CONTATO
- Pedir antes do resultado completo: sim | não
- Campos: nome, WhatsApp (sempre com consentimento)
- WhatsApp do negócio que recebe o contato: (55 + DDD + número, só dígitos)
- Texto do botão de WhatsApp:
- Primeira linha da mensagem que chega ao dono:

7. IDENTIDADE
- Cor principal (hex) e cor do texto sobre ela:
- Cor de fundo:
- Tom de voz: (ex.: próximo e simples, sem gíria)
- Rodapé: (nome, cidade, @ do Instagram)

8. ONDE VAI RODAR
- Publicação: link do Claude | arquivo .html no site do negócio
- Canais de divulgação: (bio, WhatsApp, QR no balcão, anúncio, vendedor)
- Métrica de sucesso em 4 semanas: (ex.: contatos por semana e % que vira venda)

9. ITENS A CONFIRMAR PELO DONO
- Lista de todos os [CONFIRMAR] acima.
```
