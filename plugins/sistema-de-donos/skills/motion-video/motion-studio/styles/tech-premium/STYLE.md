# Estilo: tech-premium

Anúncio de produto premium, no estilo de um ad conceito da Apple. Treinado a partir da referência `simo.design` (anúncio conceito do Spotify).

## Identidade
- **Fundos:** alternam entre escuro `#0A0A0A` (blobs laranja e azul) e claro `#F5F3EE` (blobs suaves). O fundo nunca para.
- **Texto:**
  - No escuro: branco, com a palavra-chave em laranja `#FF4D00`.
  - No claro: preto, com a palavra-chave em laranja.
- **Azul caneta** `#2340C8`: só como contraste pontual (ícones, sintaxe, sublinhado à mão `penLine`).
- **Tipografia:** Inter Tight 500/600 (display) e JetBrains Mono (dados e código). Tamanhos médios (70–90px nas headlines). Quem impressiona é o movimento, não a fonte.
- **Grão:** 6%, em overlay.

## Gramática
1. **Ritmo headline → demo.** Cada ideia aparece como uma frase curta (3 a 5 palavras, uma em laranja) e logo depois como um card de UI que prova a frase.
2. **Cards de UI em 3D** (`persp`): inclinados (ry de ±0.12 a 0.3), com sombra longa e flutuando (`Math.sin(f/50)*.025`). Entram com `spring({k:80,c:14})` de baixo para cima.
3. **Câmera faz push-in até um detalhe** (um botão), e esse detalhe vira o gancho da próxima cena.
4. **Clímax de micro-interação:** o botão vira ponto, depois check, e depois aparece um toast de confirmação.
5. **Transições em círculo** que nascem do elemento em foco (`TR` com x/y do elemento) e têm uma borda laranja.
6. **Abre e fecha com a marca** (`logo`), usando o mesmo gesto. O fim é mais calmo e tem crédito pequeno.

## Duração típica por cena (60fps)
Headline: 30–50f · card + demo: 90–150f · transição: 26–28f · abertura e fechamento: 100–120f.

## Sons (style.sfx)
O swoosh nas transições é automático. Use `pop` nas entradas, `whoosh` nos movimentos, `typing` em digitação, `click` + `boom` no clique principal (de preferência no drop da música) e `chime` no check.
