# Estilo: motion-apple

Motion "Apple widgets" + paleta própria (papel, preto e laranja). Treinado de 5 refs (pasta ESTILO APPLE): texto selecionado→pílula→card "Recharge"→pasta com cartões; "Introducing → Widgets" com grade de widgets; chat roxo→card de ingresso→"more"; landing com letras "S im pl e" se separando.

## Identidade (IDV manda nas cores)
- **Base papel `#F5F3EE`** quase chapada + vinheta suave cinza-quente (como o fundo cinza das refs). Escuro `#0A0A0A` só em 1–2 cenas de contraste.
- **Cards/widgets `#141414`** (raio grande, ~22% do lado) ou papel elevado com sombra macia. Cantos SEMPRE arredondados.
- **Laranja `#FF4D00`**: 1 elemento por cena (palavra, preenchimento da barra, ponto). Azul caneta `#2340C8`: seleção de texto/handles e o toast.
- **Blob que vaza do card:** quando um card é herói, um blob da cor dele (laranja/azul) cresce atrás com blur 140px e some com ele.
- **Tipografia:** Inter Tight 600 (headline 70–96px, tracking −3%), 800 só no "momento palavra gigante"; JetBrains Mono 700 em números/rótulos.

## Surgimento dos objetos (REGRA PRINCIPAL — aprendida das refs)
Nada surge com POP (escala uniforme com quique). Todo objeto CRESCE a partir de um keyframe minúsculo:
- **Um eixo de cada vez:** linha que cresce para os lados → depois desce/sobe até a altura final (ou o inverso). Botão redondo → estica para cima (pílula) → alarga (card).
- **Ancorado** numa borda ou no objeto que o gera (ex.: a timeline nasce do pé do ícone).
- **Cauda longa, overshoot mínimo:** helper `g(t,t0,dur)` = mola z≈.82. Blur proporcional à velocidade enquanto cresce.
- **Conteúdo só depois que a forma assenta** (fade curto); trilhas/barras internas também nascem de um tracinho.
- **Recolher é o inverso:** altura primeiro, depois largura, de volta para quem o gerou.
- Vidro: `glass()` da engine (liquid glass) — sempre com cor/blob se mexendo atrás para a refração aparecer.
- Plano único: sem cortes nem transições genéricas; um objeto se transforma no próximo. 120fps, tempo em segundos.

## Gramática
1. **Um objeto só, que se transforma.** O elemento da cena vira o da próxima: ponto → botão → pílula → card → objeto (pasta/celular). Morph por raio+tamanho com mola macia (`k:80,c:14`), sem corte.
2. **Mão-cursor** (pointer) entra de fora, clica (escala 0.9 + anel), arrasta. Cada clique dispara a transformação.
3. **UI viva:** números contam (mono), barras preenchem mudando de cor (laranja→verde de "pronto"), texto digita com caret.
4. **Texto cinético:** "Introducing"→palavra; selecionar texto com handles azuis; letras que se afastam (S im pl e) e voltam; palavra repetida gigante.
5. **Grade de widgets** voando em órbita lenta ao redor da headline (parallax 3 camadas), saindo para as bordas.
6. **Saída:** inclinação + queda/zoom do objeto com blur (continua o drift), ou o objeto encolhe até o ponto laranja → logo.
7. **Abre e fecha com o ponto laranja**.

## Durações (60fps)
Beat 40–70f · morph 18–26f · card com demo 90–140f · total 10–15s. Ritmo rápido, sem pausas.

## Sons
pop em cada morph, click no toque da mão, tick nos contadores, whoosh curto nas saídas, chime no "pronto".

## Referência 6 — Base44 (refs/ref-base44-pastel.mp4) · variante PASTEL (styles/motion-apple-pastel)
Fundo off-white/cinza quente chapado; cor só nos elementos, em tons pastel. Repertório de cenas:
- **Logo que se monta**: ponto → nome, faíscas minúsculas orbitando.
- **Anéis concêntricos 3D** extrudados (túnel em degradê), câmera inclina; texto nasce no centro.
- **Orbe em degradê desfocado** (a "IA") → balão gigante "Hey" → chat: prompt digitando, imagens arrastadas para dentro, enviar.
- **Rede de quadrados coloridos** com linhas até uma pílula central ("Connecting…").
- **Cards de UI em perspectiva 3D** inclinando; **lista de código** rolando ("Writing…") com miniaturas.
- **Grade de bolinhas** coloridas pulsando + pílula de status ("Building app").
- **Rolo de palavras** vertical (palavra central nítida, vizinhas esmaecidas) → logo final no branco.
Mesmas regras: crescimento por eixo, câmera em onda, plano contínuo, 120fps.

## Sons — família "Apple UI" (ref.: áudio TikTok plazfxx, analisado por espectro)
Nada de whoosh/pop/chime de desenho animado. Usar (engine/sfx.py):
- `swell` {attack≈.3–.5} → ar + sub que CRESCE até o evento (pico cai no frame dado). Em toda transformação/chegada grande.
- `haptic` {f 70–120} → batida sub macia (vibração do iPhone) quando algo assenta.
- `glass` / rajada `glasstaps` {to, step} → toques, digitação, itens entrando.
- `ping` {f 2350} + `air` → SÓ nos momentos de "pronto/confirmado" (2–3 por vídeo).
Ajustar só o som: editar SFX e rodar `tools/render.sh <p> audio` (relê o SFX do scenes.js via tools/sfxjson.cjs).
