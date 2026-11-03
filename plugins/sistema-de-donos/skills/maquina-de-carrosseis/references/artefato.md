# O artefato "Máquina de Carrosséis": como publicar, achar e escrever nele

O artefato é uma página publicada com a ferramenta `Artifact`, com banco de dados próprio (capability `db`), upload de imagens (`assets`) e download de arquivos (`downloads`). Cada usuário tem a SUA máquina (a sua página, o seu banco). Nunca aponte um usuário para a máquina de outro.

## Pré-requisito: as ferramentas

- `Artifact` — publicar a página, subir imagens como asset, ler a página, listar artefatos.
- `ArtifactData` — ler e escrever documentos do banco (ações `get`, `list`, `query`, `set`, `update`, `delete`, `batch`). Se aparecer só como ferramenta diferida, carregue com `ToolSearch` (`select:ArtifactData`) antes de usar.
- Se a ferramenta `Artifact` NÃO existir nesta conversa (por exemplo, no app de celular ou numa conta sem artefatos publicáveis): não publique. Entregue o carrossel como texto no chat (um bloco por slide, numerado) e diga ao usuário, em uma frase, que para ter a página com prévia e download ele abre o Claude no computador (Cowork) e repete o pedido.

## Publicar a máquina pela primeira vez (só na skill configurar-maquina)

0. Carregue a skill `artifact-capabilities` (ferramenta `Skill`) antes de publicar: a ferramenta `Artifact` exige isso para aceitar o campo `capabilities`.
1. Copie o template `${CLAUDE_PLUGIN_ROOT}/skills/configurar-maquina/assets/maquina-de-carrosseis.html` para o diretório de trabalho (por exemplo `maquina-de-carrosseis.html`), sem alterar o conteúdo.
2. Publique com `Artifact`:
   - `file_path`: o arquivo copiado
   - `icon`: `"image"`
   - `description`: `"Carrosséis de Instagram no formato tweet: texto editável slide a slide, imagem, prévia e download em ZIP."`
   - `capabilities`: `{"db": {}, "assets": {}, "downloads": true}` (obrigatório; sem isso a página não salva nem baixa nada)
3. Guarde a URL devolvida. Ela é a identidade da máquina desse usuário.

## Achar a máquina do usuário (todas as outras skills)

Nesta ordem, parando na primeira que funcionar:
1. A URL está na conversa ou no Projeto (doc `maquina-de-carrosseis/maquina.md`, quando houver Projeto).
2. Memória do usuário, se disponível (procure "Máquina de Carrosséis").
3. `Artifact` com `action: "list"`: procure o título **"Máquina de Carrosséis"**. Se houver mais de um, use o mais recente e confirme com o usuário em uma linha.
4. Se a lista de artefatos não trouxe nenhuma "Máquina de Carrosséis", assuma primeiro uso e rode `configurar-maquina` (não peça link). Só peça o link se o usuário disser que já tem a página e ela não apareceu.

Depois de achar, grave a URL onde der (Projeto e/ou memória) para não perguntar de novo.

## Esquema do banco

Coleções e documentos (IDs em kebab-case, só letras, números e hífen):

`settings/profile`
```json
{"name":"Nome Sobrenome","handle":"@perfil","avatar":"/_blob/<id do asset>","avatarAsset":"<id>","verified":false,
 "negocio":"o que vende, pra quem","publico":"quem segue e as dores dele","tom":"como fala","updatedAt":"ISO"}
```
A página usa `name`, `handle`, `avatar`, `verified`. Os campos de negócio são para as skills (temas, hooks, storytelling).

`posts/<id>` — id = kebab do título + data e hora (`precificacao-servico-20261030-1420`), para um "faz de novo" nunca apagar o post anterior.
```json
{"title":"Título curto do post","status":"texto","createdAt":"ISO","updatedAt":"ISO",
 "caption":"legenda completa","notes":"",
 "slides":[
   {"text":"Texto do slide. **negrito** entre asteriscos. Linha em branco separa parágrafos.","layout":2,"images":[null,null],"imageBrief":"Esq: … Dir: …"},
   {"text":"…","layout":0,"images":[],"imageBrief":"(opcional) sugestão de imagem"}
 ]}
```
- `status`: `texto` (em revisão pelo usuário) → `imagens` (texto aprovado, colocando imagens) → `pronto`.
- `layout`: `0` só texto, `1` uma imagem larga, `2` duas lado a lado. `images` tem o mesmo tamanho de `layout`, com `null` nos slots vazios; uma imagem é `{"asset":"<id>","url":"/_blob/<id>","by":"upload"|"ia","focus":0.5}` (`focus` 0–1 é o enquadramento vertical do recorte; 0.5 = centro).
- `imageBrief`: formato fixo `"<o que mostrar> · onde achar: <busca 'termo' no Unsplash ou Pexels | print de X | foto sua | foto pública de Fulano>"`. No slide 1 (duas imagens): `"Esq: … · onde achar: … | Dir: … · onde achar: …"`. Sempre preencha no slide 1; nos outros, preencha quando sugerir imagem (o usuário decide se usa). Nunca escreva "(IA)" sem dizer onde achar: a página não gera imagem.
- `notes`: o usuário escreve ajustes ali. Leia SEMPRE antes de revisar um post.
- `iaRequest`: o botão "Gerar com IA" do slide grava `{"status":"pedido","at":"ISO","brief":"…"}`. É o pedido do usuário para o Claude gerar a imagem daquele slide (todos os slots vazios dele). Depois de colocar a imagem, grave `iaRequest: {"status":"feita","at":"ISO"}`; se não conseguir gerar, `{"status":"falhou","motivo":"…"}` e explique no chat.

`briefings/<id>`
```json
{"title":"tema","link":"","text":"referência colada","notes":"o que destacar","attachments":[{"asset":"<id>","url":"/_blob/<id>","name":"arquivo.pdf","type":"application/pdf"}],"status":"novo","createdAt":"ISO","updatedAt":"ISO"}
```
Quando usar um briefing num post, marque `status: "usado"` e `postId`.

## Regras de escrita no banco

- Para CRIAR um documento: `ArtifactData` `set` sem `if_version`.
- Para ALTERAR um documento existente: leia antes (`get`), e passe o `version` lido como `if_version`. Se der conflito, releia e refaça. A página salva sozinha enquanto o usuário digita: antes de regravar um post, peça em uma linha que ele não mexa no post por um minuto, faça o `get` imediatamente antes do `set` e grave uma vez só.
- Um post inteiro cabe num único `set`. Para documentos grandes, escreva o JSON num arquivo local e passe `file_path` em vez de `data`.
- Anexo PDF de um briefing: leia com `Artifact` `action: "read"`, `url` da máquina e `path` = id do asset.

## Subir a foto de perfil (configurar-maquina)

1. Se a foto veio no chat, redimensione para 600×600 (recorte central) em JPEG; se não houver ferramenta de imagem, suba como veio (até 20 MB).
2. `Artifact` com `url` da máquina, `file_path` da foto e `asset: true`. O resultado traz `/_blob/<id>`.
3. Grave em `settings/profile`: `avatar` = essa URL e `avatarAsset` = o id.
Alternativa que sempre funciona: o usuário clica no nome dele no topo da página e escolhe a foto ali.

## Gerar imagens pedidas pela página ("gera as imagens")

1. Ache o post (o usuário costuma dizer o título; senão, liste `posts` e pegue os que têm algum slide com `iaRequest.status == "pedido"`).
2. Para cada slide pedido e cada slot vazio: gere a imagem a partir de `imageBrief` (se vazio, deduza do texto do slide) com o conector de imagem disponível nesta conversa (Higgsfield `generate_image`, Canva `generate-image`, ou outro). Proporção: slide com 2 imagens → 1:1; com 1 imagem → 2:1 ou 16:9. Prompt em inglês, fotográfico/editorial, sem texto na imagem, sem logos, sem rosto de pessoa real.
3. Baixe o arquivo gerado para o diretório de trabalho (curl/wget da URL devolvida), suba como asset com `Artifact` (`url` da máquina, `file_path`, `asset: true`) e grave no slot: `{"asset":"<id>","url":"/_blob/<id>","by":"ia"}`. Marque `iaRequest.status = "feita"`. Uma gravação por post (`get` → `set` com `if_version`), e avise o usuário para não editar o post nesse minuto.
4. Sem conector de imagem na conversa: não invente; grave `iaRequest.status = "falhou"` com motivo "sem gerador de imagem" e diga em uma frase: "Nesta conta não tenho gerador de imagem conectado. Sugestão para esse slide: [o que buscar e onde]. É só subir no quadrado da imagem."
5. Nunca gere rosto de pessoa real identificável nem arte protegida; para esses, oriente o upload.

## O que a página faz sozinha (não refaça no chat)

Prévia 1080×1350 de cada slide, edição do texto, reordenar/adicionar/remover slides, upload de imagem nos slots, aprovação por etapa, download do ZIP (PNGs numerados + legenda.txt) e briefings. O trabalho do Claude é escrever bem e gravar no banco.
