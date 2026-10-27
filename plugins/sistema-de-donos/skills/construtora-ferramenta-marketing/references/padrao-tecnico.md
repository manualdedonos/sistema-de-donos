# Padrão técnico das ferramentas

## Arquivo

- Uma página HTML única, autocontida: CSS e JavaScript dentro do arquivo, sem bibliotecas externas. Fontes do sistema (Georgia/Arial ou equivalentes); Google Fonts só se a marca exigir e a página for hospedada no site do negócio.
- Imagens: nenhuma é obrigatória. Se o dono mandar logo, embuta como `data:` URI pequena ou use apenas o nome em texto.
- Base: `assets/template-ferramenta.html`. Ele já resolve telas, progresso, voltar, validação, contato com consentimento, resultado, WhatsApp, compartilhar e refazer.

## Como preencher o modelo

1. Troque o `<title>` e as variáveis CSS de `:root` (cores da marca).
2. Preencha `CONFIG`:
   - `perguntas`: cada uma com `id` curto, `texto`, `ajuda` opcional e `tipo`:
     - `"opcoes"`: lista `opcoes` com `rotulo`, `valor` e `pontos` (se for pontuação). Avança ao tocar na opção.
     - `"numero"`: `min`, `max`, `unidade`, `placeholder`. Aceita vírgula decimal.
     - `"texto"`: resposta curta (use pouco).
   - `contato.pedir`: `true` mostra a tela de nome/WhatsApp/consentimento antes do resultado.
   - `whatsapp.numero`: 55 + DDD + número, só dígitos (ex.: `5521999999999`).
   - `aviso`: obrigatório em calculadoras e em temas sensíveis.
3. Reescreva `calcularResultado(r, perguntas)`. `r` é um objeto `{ id: valor }`. Devolva:
   - `titulo`, `destaque` (número ou rótulo grande), `descricao`, `itens` (lista), `ponte` (frase de venda), `resumoWhats` (1 linha com o resultado para a mensagem).
4. Mantenha o motor como está.

## Exemplos de lógica

Calculadora de tinta (referência; rendimento e demãos vêm do briefing):

```js
function calcularResultado(r) {
  const area = (r.largura + r.comprimento) * 2 * r.altura - r.descontos;   // paredes
  const litros = Math.ceil((area * r.demaos / RENDIMENTO_M2_POR_LITRO) * 1.1); // +10% de sobra
  const galoes = Math.ceil(litros / 3.6);
  return {
    titulo: "Você vai precisar de",
    destaque: litros + " litros",
    descricao: `Para ${area.toFixed(1)} m² de parede com ${r.demaos} demãos, já com 10% de sobra.`,
    itens: [`${galoes} galão(ões) de 3,6 L`, "Rolo, bandeja e fita crepe"],
    ponte: "Separamos tudo pra você retirar hoje. Chame no WhatsApp.",
    resumoWhats: `Resultado: ${litros} L (${galoes} galões) para ${area.toFixed(1)} m²`
  };
}
```

Diagnóstico por pontuação (tipo Perfil de Dono):

```js
function calcularResultado(r, perguntas) {
  let pts = 0, max = 0;
  perguntas.forEach(p => {
    const vals = p.opcoes.map(o => o.pontos); max += Math.max(...vals);
    pts += (p.opcoes.find(o => o.valor === r[p.id]) || { pontos: 0 }).pontos;
  });
  const nota = Math.round(pts / max * 100);
  const faixa = nota < 40 ? FAIXAS[0] : nota < 70 ? FAIXAS[1] : FAIXAS[2];
  return { titulo: faixa.nome, destaque: nota + "/100", descricao: faixa.texto,
           itens: faixa.passos, ponte: faixa.ponte, resumoWhats: `Nota ${nota}/100 — ${faixa.nome}` };
}
```

Para diagnóstico com várias dimensões, some por dimensão, mostre a dimensão mais fraca no resultado e use a recomendação dela.

## Captura do contato

- **Padrão (funciona em qualquer lugar):** o resultado mostra o botão de WhatsApp que abre `https://wa.me/<numero_do_dono>?text=<mensagem>` com nome, respostas e resultado. O contato chega ao dono quando o cliente toca no botão; por isso o botão precisa de um motivo claro (receber o orçamento, reservar, ganhar o desconto, falar com especialista).
- **Avançado (só com a página hospedada no site do negócio):** além do WhatsApp, enviar os dados para uma planilha ou CRM por um webhook que o dono já tenha (Google Apps Script, Make, n8n, Zapier). Faça com `fetch(URL, { method: "POST", mode: "no-cors", body: JSON.stringify(dados) })` disparado ao confirmar o contato, sem travar a tela se falhar. Páginas publicadas por plataformas de terceiros (inclusive pelo próprio Claude) podem restringir esse envio; nelas, use só o WhatsApp e teste antes de contar com o webhook.
- Consentimento sempre visível e obrigatório antes de enviar dados (LGPD). Não colete CPF, endereço completo ou dado de saúde detalhado.

## Publicação

- **Link do Claude:** se o ambiente oferecer publicação de página com link, publique e copie o link. É o caminho mais rápido.
- **Site do negócio:** suba o arquivo `.html` na hospedagem do site (ou peça ao responsável pelo site) e use um endereço curto, ex.: `seusite.com.br/calculadora`.
- Nos dois casos, teste no celular antes de divulgar.

## Teste antes de entregar

1. Rode os 2 casos de teste do briefing e confira o resultado.
2. Confira que nenhuma pergunta numérica aceita vazio ou fora do intervalo.
3. Confira que o link do WhatsApp tem o número certo (só dígitos, com 55).
4. Confira contraste: texto do botão legível sobre a cor da marca.
