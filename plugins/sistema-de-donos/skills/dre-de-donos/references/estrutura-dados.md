# Os dados do painel: JSON, montagem, publicação e atualização

O painel é um único arquivo HTML (`assets/template-dre.html`) que lê um bloco de dados em JSON e calcula todo o resto no navegador. Você monta o JSON; o script `scripts/montar_dre.py` valida, mostra a conta para conferência e gera o arquivo final. **Não edite HTML, CSS ou JavaScript do template.**

Antes de escrever o seu JSON, abra o exemplo do estágio do dono em `assets/exemplos/`.

## 1. O JSON

```json
{
  "negocio": "Ateliê Marê",
  "subtitulo": "Loja de moda feminina · 3 pessoas · Simples Nacional · Recife/PE",
  "segmento": "varejo-moda",
  "segmentoNome": "lojas de moda",
  "estagio": 1,
  "regime": "simples",
  "mesAtual": "2026-10",
  "rotulos": { "custo_direto": "CMV (custo das peças vendidas)" },
  "ajudas": { "custo_direto": "Quanto você pagou ao fornecedor pelas peças que saíram da loja no mês..." },
  "meses": {
    "2026-10": {
      "valores": {
        "receita_bruta": 68000, "impostos_vendas": 4200, "custo_direto": 34000, "despesas_variaveis": 2400,
        "pessoal": 10100, "ocupacao": 8700, "marketing": 1200, "outras_fixas": 2100
      },
      "estimados": { "custo_direto": "50% da receita bruta, porque você marca o preço em 2 vezes o custo." },
      "extras": { "funcionarios": 3, "clientes_novos": 85, "num_vendas": 410, "caixa_final": null }
    }
  },
  "benchmarks": {
    "margem_bruta": { "min": 45, "max": 55, "fonte": "lojas de moda de pequeno porte" }
  },
  "leitura": "…",
  "achados": [ { "tom": "atencao", "titulo": "…", "texto": "…" } ],
  "acoes": [ { "titulo": "…", "oque": "…", "porque": "…", "ganho": "…", "ganhoMensal": 1400, "esforco": "baixo", "prazo": "15 dias", "metrica": "…", "passo": "…" } ],
  "depois": [ { "titulo": "…", "porque": "…" } ],
  "premissas": [ "…" ],
  "contador": [ "…" ],
  "limites": "…"
}
```

### Campos

| Campo | Obrigatório | O que é |
|---|---|---|
| `negocio` | sim | Nome do negócio. Vira o título do painel. |
| `subtitulo` | recomendado | "o que faz · tamanho · regime · cidade/UF". |
| `segmento` | não | Identificador curto, para você. |
| `segmentoNome` | recomendado | No plural e em minúsculas, para caber em frases: "lojas de moda", "padarias", "agências e serviços B2B". |
| `estagio` | sim | 1, 2 ou 3. Define as linhas (`modelos-de-dre.md`). |
| `regime` | sim | `simples`, `presumido`, `real`, `mei` ou `nao_sei`. |
| `mesAtual` | sim | Mês em foco, `AAAA-MM`. É o último mês fechado e o mês da análise. |
| `rotulos` | recomendado | Troca o nome de uma linha. Use sempre para `custo_direto`. |
| `ajudas` | recomendado | Troca o texto do "?" de uma linha. Use para `custo_direto` e para o que for específico do negócio. As demais linhas já têm explicação padrão. |
| `meses` | sim | Um objeto por mês, com chave `AAAA-MM`. |
| `meses.*.valores` | sim | Só números de entrada, positivos, em reais inteiros. `null` para o que não foi informado. Nunca envie subtotais. |
| `meses.*.estimados` | quando houver | `{ "id_da_linha": "a conta em uma frase" }`. A linha aparece marcada como estimativa e a conta aparece no "?" e na lista de premissas. Se o dono editar o número, a marca some. |
| `meses.*.extras` | recomendado | `funcionarios`, `clientes_novos`, `num_vendas`, `caixa_final`. `null` para o que faltar. |
| `meses.*.leitura` | não | Leitura escrita para um mês que não é o `mesAtual`. |
| `benchmarks` | recomendado | Faixas do segmento. Em % da receita líquida: `margem_bruta`, `margem_contribuicao`, `margem_ebitda`, `margem_liquida`, `custo_direto`, `folha`, `ocupacao`, `marketing`. Em % da receita bruta: `impostos`. Em reais: `receita_por_pessoa`, `cac`. Cada uma com `min`, `max` e `fonte`. |
| `leitura` | recomendado | A frase do CFO para o `mesAtual`. |
| `achados` | recomendado | Três itens. `tom`: `critico`, `atencao` ou `bom`. |
| `acoes` | recomendado | De 3 a 5, em ordem de `ganhoMensal`. |
| `depois`, `premissas`, `contador`, `limites` | quando houver | Ver `analise-cfo.md`. |

Identificadores de linha válidos em `valores`, `estimados`, `rotulos` e `ajudas`:

`receita_bruta`, `impostos_vendas`, `devolucoes`, `custo_direto`, `despesas_variaveis`, `comissoes`, `taxas_pagamento`, `fretes`, `outras_variaveis`, `pessoal`, `pro_labore`, `ocupacao`, `marketing`, `tecnologia`, `administrativas`, `outras_fixas`, `depreciacao`, `receitas_financeiras`, `despesas_financeiras`, `ir_csll`.

### Regras de texto

- Português do Brasil com acentuação completa. Sem emoji e sem travessão.
- Nos textos, só `<b>`, `<i>` e `<br>` são aceitos. O resto aparece como texto.
- Valores em reais dentro de frases no padrão brasileiro: "R$ 1.044", "R$ 5,3 mil", "13,6%".
- Os números citados nos textos precisam bater com o painel. Use a conferência do script para escrever.

## 2. Montar

```bash
python3 scripts/montar_dre.py dados.json --so-validar      # etapa 5: só confere e mostra a conta
python3 scripts/montar_dre.py dados.json --saida <pasta>   # etapa 7: gera o painel
```

O caminho do script depende do ambiente: em plugin, `${CLAUDE_PLUGIN_ROOT}/skills/dre-de-donos/scripts/montar_dre.py`; em skill avulsa, a pasta `scripts/` ao lado deste arquivo.

O script:

- recusa JSON com **ERRO** (linha desconhecida, valor que não é número, mês inválido, benchmark sem mínimo e máximo);
- lista **AVISOS** (linha do estágio sem número, estimativa sem explicação, imposto zerado, texto com travessão, ações fora de ordem). Leia todos. Aviso não impede a geração, mas cada um pede uma decisão sua;
- imprime a **conferência**: a conta fechada de cada mês, igual à do painel. É a fonte dos números que você cita ao dono e nos textos;
- carimba `geradoEm` com data e hora (não preencha à mão);
- gera dois arquivos com o mesmo painel:
  - `dre-de-donos-<negocio>-<mes>.html`: documento completo;
  - `dre-de-donos-<negocio>-<mes>.pagina.html`: só o conteúdo, para a ferramenta `Artifact`.

Sem execução de código: copie `assets/template-dre.html`, troque **somente** o conteúdo da tag `<script type="application/json" id="dados">` pelo seu JSON (escreva `<\/` no lugar de `</` dentro dos textos), inclua `"geradoEm"` com data e hora em formato ISO e confira a conta à mão pelas fórmulas de `modelos-de-dre.md`.

## 3. Publicar

O objetivo é o dono abrir o painel, editar e encontrar as edições salvas na próxima visita. Use a primeira opção disponível.

**A. Ferramenta `Artifact`** (Claude no computador, Cowork):

1. Se existir a skill `artifact-capabilities`, carregue-a antes: a ferramenta exige isso para aceitar `capabilities`.
2. Publique com:
   - `file_path`: o arquivo `.pagina.html`
   - `title`: `DRE de Donos · <nome do negócio>`
   - `icon`: `"chart"`
   - `description`: `"DRE de <mês/ano> com indicadores, dashboard do CFO e plano de ação. Números editáveis."`
   - `capabilities`: `{"db": {"rules": [{"path": "dre", "read": "view", "write": "admin"}]}, "downloads": true}`
3. Guarde o endereço devolvido.

**B. Ferramentas de artefato que pedem documento completo** (nomes como `publish_files` e `declare_capabilities`): publique o arquivo `.html` completo como `index.html`, com o mesmo título, e em seguida declare as mesmas capabilities da opção A.

**C. Sem ferramenta de artefato**: entregue o arquivo `.html` ao dono. Ele abre em qualquer navegador, funciona sem internet (menos as fontes) e guarda as edições no próprio navegador. Diga isso em uma frase.

A regra do banco deixa o dono (e quem ele puser como editor) gravar as edições; quem só visualiza pode simular, mas as mudanças ficam no navegador dele. Se a ferramenta recusar o campo `rules`, publique com `{"db": {}, "downloads": true}`.

Dentro do Claude, a página não consegue imprimir nem baixar arquivo por conta própria: "Baixar planilha" usa a capability `downloads` e o botão "Imprimir" só aparece quando o arquivo é aberto direto no navegador.

Sem as capabilities o painel funciona igual, mas as edições só ficam no navegador em que foram feitas. O topo do painel sempre diz onde está salvando.

Depois de publicar, registre onde der (Projeto ou memória, se houver): o endereço do painel, o nome do negócio, o estágio e o mês em foco.

## 4. Como o painel guarda as edições do dono

- Os números que você gerou ficam dentro do arquivo. As edições do dono ficam por cima, em um documento do banco da página chamado **`dre/edicoes`**, ou no navegador quando não há banco.
- Formato: `{ "salvoEm": "ISO", "meses": { "2026-10": { "valores": {…}, "extras": {…}, "estimados": {…}, "editadoEm": "ISO" } } }`. Só entram os meses que o dono editou ou criou pelo botão "+ mês".
- Regra de precedência: edição feita **depois** do `geradoEm` vale; edição anterior é descartada. Por isso, quando você publica uma versão nova, os números novos assumem e as edições antigas deixam de valer.
- Depois de uma edição, o painel troca a leitura escrita por uma leitura automática e avisa, no dashboard, que o diagnóstico e o plano são os originais.

## 5. Atualizar um painel que já existe

Quando o dono pedir outro mês, o ano, uma correção ou "refaz a análise":

1. **Ache o painel**: endereço na conversa, no Projeto ou na memória; senão, liste os artefatos e procure "DRE de Donos". Se não achar, pergunte em uma linha antes de criar outro.
2. **Recupere os números atuais**, nesta ordem:
   - o texto que o dono colou pelo botão "Copiar para o Claude" (traz todos os meses, com `editado: true` nos que ele mexeu);
   - o documento `dre/edicoes` do banco do artefato (ferramenta `ArtifactData`, ação `get`, ou a ferramenta equivalente de leitura do banco);
   - o seu JSON anterior, se ainda estiver na pasta de trabalho.
3. **Junte**: parta do JSON anterior, aplique por cima os meses que o dono editou e acrescente os meses novos. Mês criado por ele no painel entra como mês normal.
4. **Refaça a análise** para o `mesAtual` (o mais recente) e rode o script.
5. **Publique no mesmo artefato** (atualização, não um artefato novo).
6. Diga ao dono o que mudou, em duas linhas.

Com dois meses ou mais, o painel mostra sozinho a coluna do mês anterior, a variação, o botão "Acumulado" e a seção de evolução. Limite prático: 24 meses.
