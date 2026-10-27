---
name: motion-video
description: "Só funciona no Claude Code no computador (não roda no chat do app). Cria vídeos animados de motion design feitos em código para o seu negócio: anúncio animado, vinheta, abertura, vídeo do produto ou do app, com textos, efeitos sonoros e música. Também cria um estilo novo a partir de um vídeo de referência e entrega o projeto em camadas para você editar no CapCut, Premiere ou DaVinci. Use só quando o dono pedir animação ou motion design de forma explícita: \"vídeo em motion\", \"anúncio animado\", \"vinheta animada com o meu logo\", \"vídeo animado do meu produto\", \"motion graphics\", \"quero um vídeo como esse\", \"cria um estilo a partir dessa referência\", \"manda em camadas pro CapCut\" ou pedir para ajustar um vídeo em motion já feito. Não use para vídeo curto de rede social que não peça animação (use Vídeos Virais) nem para copy de venda (use Diretor Comercial)."
compatibility: "Só Claude Code no computador (macOS, Linux ou Windows com Git Bash), com terminal e acesso a arquivos. Precisa de Node.js, FFmpeg e Python 3; o setup instala numpy/scipy numa .venv e o Puppeteer com Chromium. Partes só para Mac: recorte de fundo e rotoscopia (cutout.swift, roto.swift), disco .dmg com hdiutil, vigia de RAM, projetos do CapCut para Mac e transcrição com mlx_whisper (Mac com Apple Silicon). Não roda no chat do app."
---

# motion-video

## Antes de tudo: confira onde você está
Esta skill precisa de terminal, de acesso a arquivos e de instalar programas no computador (Node.js, FFmpeg, Python). Se você estiver no chat do app do Claude (web, desktop ou celular), sem terminal e sem a pasta do projeto aberta, **não comece**: diga ao usuário, em uma ou duas frases, que vídeo em motion só funciona no Claude Code no computador, que ele pode instalar o Claude Code no computador e fazer o mesmo pedido por lá, e pare. Não tente simular o vídeo, gerar código para ele rodar sozinho nem prometer um arquivo de vídeo.

**Se o pedido for um vídeo curto para rede social e o dono não pediu animação ou motion design, não use esta skill: sugira Vídeos Virais.**

**Partes só para Mac** (no Linux e no Windows o resto funciona igual; avise antes de usar e ofereça a alternativa):
- Recorte de fundo e rotoscopia (`tools/cutout.swift`, `tools/roto.swift`): usam o Vision do macOS. Fora do Mac, peça o PNG já recortado.
- Disco `.dmg` HFS+ com `hdiutil` para footage em exFAT: fora do Mac, extraia os quadros num disco interno com espaço.
- Vigia de RAM do render em lotes (`vm_stat`, `memory_pressure`): fora do Mac, o render roda sem vigiar a RAM; acompanhe a memória à mão.
- Ferramentas do CapCut (`tools/capcut_*.py`): feitas para o CapCut do Mac (pastas em `~/Movies`). Em outro sistema, trate como "outros editores" (seção 4).
- Render em lotes (`tools/render_chunks.sh`): o próprio `setup.sh` avisa que, fora do Mac, ele pode ficar indisponível. Se falhar no Linux ou no Windows, use `DIRECT=1` só para vídeo curto e avise o usuário.
- Transcrição com `mlx_whisper`: só em Mac com Apple Silicon e não é instalada pelo `setup.sh`. Em outra máquina, peça a permissão do usuário para usar outro transcritor com marcação de tempo por palavra, ou peça a transcrição com tempos.

Estúdio na pasta `motion-studio/`, dentro da pasta aberta no Claude Code (onde fica `.claude/`). Todos os comandos rodam de dentro de `motion-studio/`.

**Instalado pelo Sistema de Donos:** o estúdio vem junto desta skill, na pasta `motion-studio/` ao lado deste SKILL.md. Se ainda não existir `motion-studio/` na pasta aberta no Claude Code, copie essa pasta para lá antes de qualquer outro passo (a pasta de plugins é só de leitura; os projetos são gravados na cópia).

```
config.json        preferências da pessoa (editor de vídeo, fonte dos sons) — ler SEMPRE no início
engine/            engine.core.js (helpers) · engine.runtime.js (montagem/export) · player.html · sfx.py
styles/<estilo>/   style.js (tokens: cores, fontes, fundo, transição, sons) · STYLE.md (gramática visual)
projects/<nome>/   project.js · scenes.js · audio.json · out/ (video.mp4, final.mp4, sheet.jpg, board.png)
templates/project/ ponto de partida de projeto novo
tools/             render.sh · render_chunks.sh · render.mjs · check.py · camcheck.cjs · music.py · ref.sh · env.sh …
```

## 0. Primeira vez (e sempre que `config.json` tiver campos `null`)
Leia `config.json`. Para cada campo vazio, pergunte UMA vez e grave a resposta:
1. **Editor de vídeo** (`editor.software`): "Em qual programa você edita seus vídeos?" (CapCut, Premiere, DaVinci Resolve, Final Cut, After Effects, nenhum…).
   - Se a pessoa usa um editor e quer receber projetos em camadas, **peça permissão para estudar o formato dos projetos dela**: ela cria no programa um projeto simples (1 vídeo + 1 áudio importados), salva e fecha; você lê a pasta/arquivo do projeto, entende a estrutura e guarda um molde em `tools/<editor>/` (`editor.molde`, `editor.estudado: true`).
   - Descubra também **em que pasta a mídia precisa estar para o programa conseguir ler** (`editor.pasta_midia`). Ex.: o CapCut do Mac roda em sandbox e só lê dentro de `~/Movies`; mídia num SSD externo aparece como "Arquivo não acessível". Teste com um arquivo antes de entregar o primeiro projeto.
   - Nunca altere projetos existentes da pessoa; faça backup de qualquer índice/arquivo do programa antes de registrar um projeto novo.
2. **Efeitos sonoros** (`sfx.fonte`): "Prefere que eu gere os efeitos sonoros ou você tem uma biblioteca de sons que eu possa usar?"
   - `sintetizado`: geradores do `engine/sfx.py` (seção 5).
   - `biblioteca`: peça o caminho, liste os arquivos, copie/converta os escolhidos para `sfx/<pasta>/<nome>.wav` e use `["sample", frame, ganho, pan, {file:"<pasta>/<nome>"}]`. Grave o caminho em `sfx.biblioteca`.
3. **Instalação:** se faltar `node_modules` ou o Python com numpy/scipy, peça permissão ao usuário e rode `bash tools/setup.sh`. Ele confere Node.js, FFmpeg e Python 3 e, se faltar algum, mostra o comando de instalação e para; nesse caso, explique o que falta e espere o usuário instalar.

## 1. REGRAS DE MOVIMENTO — valem para TODO estilo e formato
Ficam acima do estilo: o STYLE.md muda a aparência, nunca estas regras.
1. **Nada fica congelado.** Nenhum elemento fica 100% parado esperando o próximo evento: câmera sempre viva (seção 1b), e todo elemento que chegou continua em deriva, um movimento lento e contínuo (parâmetro `drift` em `words`, `- prog(...,E.lin)*N` na posição, leve rotação nos cards, +3–7% de escala em pílulas/ícones).
2. **Chegada com cauda longa**, durando até perto do próximo evento: `E.out5` / `E.smooth` / `E.push`. `inOutQ`/`inOutC` travam no fim — só em movimentos curtos e decididos.
3. **Crescimento orgânico, nunca "pop".** Objeto não surge com escala uniforme quicando: cresce de um keyframe minúsculo, **um eixo de cada vez** (linha → lados → altura; botão → pílula → card), ancorado em quem o gera, com blur pela velocidade; o conteúdo entra só depois de a forma assentar. Use `squash()` para esticar/achatar pela velocidade.
4. **A saída continua o momentum** da deriva (mesma direção, acelerando com `E.inC` + blur). Nunca sumir parado.
5. **Eventos se sobrepõem:** a próxima animação começa 4–12 frames antes da anterior terminar.
6. **Movimento rápido tem motion blur** (`smear` com a velocidade).
7. **Transições nascem de um elemento em cena** (x/y no `TR`). Nada de fade genérico, salvo se o estilo pedir.
8. **Molas macias** em cards (`spring({k:80,c:14})`); molas firmes (`k:200,c:15`) só em detalhes pequenos.
9. **Loop:** fundo periódico em N frames → o último frame emenda no primeiro.
10. **Verificar com dados:** `check.py` sem nenhum "DEAD HOLD — corrigir" ("DRIFT LENTO" intencional é ok) e `camcheck.cjs` "suave ✓".

### 1b. Câmera em onda
Zooms são ondas/curvas em S: cada aproximação ~0,5–1s para ir e outro tanto para voltar, amplitude moderada (1,3–1,45×; mais só em mergulhos/aberturas), um movimento emenda no outro sem parar. **Nunca punch-in/snap de 0,2–0,3s com pico agudo.**
- Defina alvos `const CAM = [[t, escala, focoX, focoY, rot], ...]` e use `const cam = camPath(CAM, {sigma:.28})` + `applyCamPath(ctx, cam, t, {cx, cy})` (+ `camBlurPath(ctx, cam, t)` opcional).
- Cenas simples sem alvos: `cam(ctx, f, a, b, 1, 1.05–1.12)` (zoom contínuo lento).
- Antes de renderizar: `node tools/camcheck.cjs projects/<p>/scenes.js` → zoom ≲ 3 e foco ≲ 1500 px/s².

## 2. REGRAS DE DESIGN — valem para todo estilo
1. **Cantos sempre arredondados.** Nada de retângulo/placa/moldura com canto reto (raio generoso; `lineJoin`/`lineCap` round). Objeto herói em cor sólida da marca, não branco com gradiente.
2. **Composição central:** herói no alto + texto centralizado embaixo em 3 níveis (linha pequena · palavra GRANDE · linha pequena) + elementos de apoio orbitando nas bordas. Evite texto empilhado à esquerda com imagem à direita.
3. **Todo elemento decorativo tem sentido.** Prefira elementos reais da marca (logo, produto, interface) a formas soltas sem função.
4. **Uma palavra-chave em destaque por frase** (cor de acento), salvo se o estilo pedir o contrário.

## 3. Fluxo (barato em tokens)
1. **Briefing numa mensagem só.** Faltou algo essencial? Pergunte tudo de uma vez: formato, duração, estilo (`ls styles/`), marca, textos/cenas, narração, música (arquivo + trecho), referência.
2. **Storyboard em texto** (tabela: cena, tempo, headline, demonstração, transição) → espere aprovar.
3. **Projeto:** `cp -r templates/project projects/<nome>`, edite `project.js`, escreva `scenes.js` com a API (seção 5). Leia **só** o `STYLE.md` do estilo escolhido; não leia o `engine.core.js` inteiro.
4. **Storyboard em IMAGEM — obrigatório:** `BOARD=[[frame,'título','nota'],...]` no scenes.js → `bash tools/render.sh <nome> board` → abra `out/board.png`, confira, envie e **PARE**. Aprovar o texto NÃO autoriza o render; só renderize depois de aprovarem o board.
5. **Preview barato** quando precisar conferir timing: `bash tools/render.sh <nome> preview` → `out/preview.jpg` (1 quadro a cada 30, 1/3 da resolução).
6. **Render final — SEMPRE em lotes:** `bash tools/render.sh <nome>` (chama `tools/render_chunks.sh`: lotes de 120 quadros → MP4 por lote → apaga PNGs; vigia disco e RAM; mata Chromes órfãos; retoma sozinho os lotes que faltam). Rode em background. Se pausar por falta de espaço/RAM, libere e rode o mesmo comando de novo. `DIRECT=1` só para vídeo curto com máquina folgada.
7. **Relatório:** confira o texto do `check.py`; abra `out/sheet.jpg` só se o relatório ou o usuário indicarem problema.
8. **Ajustes de som** sem re-render: `bash tools/render.sh <nome> audio` (segundos; funciona também com narração/TIMEMAP).
9. **Entregar:** `out/final.mp4`, na pasta do projeto (`motion-studio/projects/<nome>/out/`). Diga ao usuário o caminho completo do arquivo. Se a pessoa usa editor e pediu camadas → seção 4. Depois de entregar, pare e espere os ajustes.

**Música:** `$PY tools/music.py <mp3>` (BPM + drops em texto) → `audio.json`: `music.align: {musicTime: <drop>, frame: <momento-chave>}`. Avise sobre direitos autorais quando a música for de artista conhecido.
**Narração:** `audio.json` → `clips:[{path, frame}]` + `voiceDuck: 0..1` (música abaixa sob a voz). Transcreva com marcação de tempo por palavra (mlx_whisper, só Mac com Apple Silicon; veja "Partes só para Mac") e case as cenas com a fala usando `TIMEMAP=[[frameReal, frameDesenho], ...]` no scenes.js. Se a voz gerada difere do roteiro, adapte os textos da tela à voz.

**Robustez:**
- Fontes locais em `fonts/` (`fonts.files` no style.js); o render FALHA se uma fonte cair no fallback. Use só fontes com licença de uso.
- Footage é carregado sob demanda. (Só Mac) Em disco exFAT (unidade de alocação grande: cada JPG pequeno ocupa ~2 MB), extraia os quadros num `.dmg` HFS+: `hdiutil create -size 1500m -fs "HFS+" -volname foot motion-studio/.footage.dmg` → `hdiutil attach … -nobrowse` → extrair lá → `ln -s /Volumes/foot/<pasta> projects/<p>/assets/<pasta>` (re-montar após reiniciar).
- Antes de renders longos: `df -m /` e, no Mac, `memory_pressure`; mantenha 1–2 GB livres.
- Recorte de fundo (PNG sem fundo): `swift tools/cutout.swift <entrada> <saida.png>` (só macOS; em outros sistemas peça o PNG já recortado).
- Print real de site para insert (celular, sem banner de cookie): `node tools/print_pagina.mjs <url> projects/<p>/assets/web/<nome>.png [--full]`.

**Economia:** edite com `Edit` (nunca reescreva o scenes.js inteiro) · agrupe os ajustes numa rodada · peça e use números de frame · nada de screenshots do player (use board/preview/sheet e o texto do check) · Python sempre pelo `$PY` (`source tools/env.sh`).

## 4. Entrega no editor da pessoa (camadas separadas)
Só quando a pessoa pedir para editar no programa dela (ajustar volume, mexer em textos…), usando o que foi estudado na seção 0.
- **Áudio em camadas:** `STEMS=1 $PY engine/sfx.py projects/<p> <fps> <frames>` → `out/stem_1-voz.wav`, `stem_2-musica.wav`, `stem_3-efeitos.wav` (mesma proporção da mixagem; a música já vem com ducking).
- **Mídia:** copie para `editor.pasta_midia` antes de montar o projeto.
- **CapCut (Mac)** — ferramentas prontas, com o programa FECHADO:
  - `python3 tools/capcut_projeto.py "<Nome>" out/video.mp4 <stems...>` → projeto novo na tela inicial (vídeo + cada áudio numa faixa, tudo em 0:00; copia a mídia para dentro do projeto).
  - `python3 tools/capcut_append.py "<Projeto>" v:"Faixa"=arq.mov a:"Voz"=voz.wav` → acrescenta camadas no fim de um projeto existente.
  - `python3 tools/capcut_diff.py <entregue.json> <editado.json>` → o que o editor mudou à mão (use para aprender o gosto dele).
  - `tools/capcut_build.py` + `tools/capcut_kit.py` → projetos inteiros camada por camada a partir de um kit clonado de um projeto real.
  - O molde vem de um projeto da própria pessoa; se o CapCut atualizar e recusar o projeto, re-extraia o molde.
- **Outros editores:** replique a mesma ideia no formato estudado (ex.: Premiere/DaVinci/Final Cut costumam importar XML/FCPXML/EDL; After Effects aceita scripts `.jsx`). Guarde o gerador em `tools/<editor>_projeto.*` e documente aqui.

## 5. API da engine (globais)
- **Constantes:** `W H FPS N` · cores `K` (escuro) `WH` (claro) `O` (acento) `B` (contraste) `CARD` · fontes `DISPLAY` `MONO`
- **Tempo:** `prog(f,a,b,ease)` → 0..1 · `spring(f,start,{k,c})` · easings `E.lin inC outC inOutC inOutQ out5 smooth push cam` · `cb(x1,y1,x2,y2)` · `lerp clamp` · `squash(vf,f,amt,max)` → [sx,sy] pela velocidade de uma curva
- **Cena:** `bg(ctx,f,dark)` · `cam(ctx,f,a,b,s0,s1)` · `camPath(CAM,{sigma})` → `cam(t)` · `applyCamPath(ctx,cam,t,{cx,cy,drift})` · `camBlurPath(ctx,cam,t)` · `layer(ctx,alpha,blur,L=>…)`
- **Texto:** `words(ctx,f,[[txt,cor?],…],{x,y,size,weight,start,stagger,dur,color,exit,drift,am,ls,align})` · `logo(ctx,f,{start,exit,offset,text})` · `smear(ctx,vel,am=>draw(am))` · `penLine(ctx,x,y,w,p)`
- **UI e vidro:** desenhe num canvas `mk(w,h)` (`rr`, `circle`, `font(peso,tam,fam)`) e chame `persp(ctx,canvas,cx,cy,{ry,rz,s,light})` · `glass(ctx,cx,cy,w,h,r,{blur,mag,edge,tint,rim,shadow,alpha})` = liquid glass (refrata o que já está pintado atrás)
- **Assets / editorial:** `project.js` → `assets:['x.png']` (em `projects/<p>/assets/`) · `footage:{nome:N}` (de `tools/footage.sh <p> <nome> <video> <ini> <dur>`) · `IMG('x.png')` · `FOOT(nome,frameLocal,speed)` · `cover(ctx,img,x,y,w,h,{s,ox,oy})` · `footage(ctx,f,img,{a,b,s0,s1,bw,edgeBlur,dim})` · `stackText(…)` · `caption(…)` · `cutout(…)` · `photoCard(…)` · `vignette(ctx,amt,rgb,inner)` · `hash(n)`
- **Objetos reais** (qualquer objeto: ancorado, cortado pela borda, conteúdo troca por corte seco): `phone(ctx,f,{x,y,w,start,from,dist,screen:(g,w,h,f)=>{},exit,exitDir,light})` · `statusBar(g,w,{color})` · `product(ctx,f,img,{…})` · `assemble(ctx,f,items,{t:{in,row,go}})` · `promptPill(ctx,f,txt,{…})` · `bigWord(ctx,f,txt,{…})` · `edgeIn(f,start,from,dist)`
- **Montagem (`scenes.js`):** `SC=[{a,fn}]` · `TR=[{a,b,x,y,type?}]` (`circle` | `fade` | `wipe` | `zoomblur` | `whip`+`dir` | estilo pode usar `none` = plano único) · `SFX=[[nome,frame,ganho,pan,{opts}]]` · `TIMEMAP` (narração) · `BOARD` · `PROJECT.init`
- **Sons (`sfx.py`)** — sintetizados:
  - **Apple UI (padrão premium):** `swell{attack,release}` (ar que cresce e tem o pico no frame) · `haptic{f,dur}` (batida sub macia) · `glass{freq}` (clique de vidro) · `ping{f,dur}` (confirmação, use em 2–3 momentos) · `air{dur}` (brilho)
  - clássicos: `whoosh` `pop` `click` `tick` `chime` `boom` `scribble` `shimmer` · rajadas `typing{to,step}` `clicks{to,step}` · papel: `rustle` `slap` `crinkle`
  - biblioteca: `sample{file,rate,align:"peak"|"start"}` (arquivos em `sfx/<pasta>/<nome>.wav`; o pico cai no frame)
  - transição ganha som automático (`style.sfx.transition`) · som novo = função em `GEN`

## 6. Novo ESTILO a partir de referência ("treinar estilo")
1. `bash tools/ref.sh <video> <dir> 10` — olhe as grades (no máximo 2–3 imagens); para movimento, analise trechos curtos quadro a quadro a 10 fps.
2. **O movimento vem SÓ das referências** (como os objetos nascem, a câmera, o ritmo, as transições). A identidade visual da marca (IDV) dá apenas cores e fontes — nunca reaproveite a gramática de movimento de outro estilo só porque a IDV é a mesma.
3. Extraia: paleta (hex), tipografia, fundo · gramática (encadeamento, transição, câmera) · duração por beat · tipo de easing.
4. `cp -r styles/<mais parecido> styles/<novo>` e edite `style.js` (tokens) e `STYLE.md` (gramática + durações).
5. Componente que não existe → adicione ao `engine.core.js` como função genérica e documente na seção 5.
6. As seções 1 e 2 continuam valendo, sempre.

## 7. Estilos incluídos
- `tech-premium` — produto/UI em 3D, horizontal 60fps · exemplo completo em `projects/exemplo` (15s, 5 cenas, sons sincronizados)
- `motion-apple` — widgets estilo Apple, plano único, crescimento orgânico, câmera em onda (120fps) · paleta própria: preto, papel e laranja
- `motion-apple-pastel` — mesma gramática do motion-apple, com outra paleta: off-white, cinzas, pastéis e destaque verde
Novos estilos: seção 6.
