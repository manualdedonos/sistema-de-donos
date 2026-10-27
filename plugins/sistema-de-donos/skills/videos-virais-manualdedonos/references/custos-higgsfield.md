# Custo de referência por vídeo no Higgsfield

**Levantado em out/2026, no vídeo de validação do Manual de Donos. Preços e modelos mudam: confirme o custo na ferramenta antes de cada geração** (consulta de custo do conector, ex.: `get_cost: true`, se disponível). Use esta tabela só para dar ao dono uma ordem de grandeza na hora do brief.

Vídeo de 8s, 9:16:

| Etapa | Modelo (nome na época) | Créditos (aprox.) |
|---|---|---|
| Imagem base (2 variantes) | GPT Image 2.5 Sunburst, high, 2k | ~5,5 |
| Character sheet (1x por protagonista, reutilizável) | GPT Image 2.5 Sunburst | ~2,75 |
| Voz (2 variantes) | Seed Audio 1.0 | ~1,8 |
| Vídeo 8s 720p | Seedance 2.5 | ~56 |
| Vídeo 8s 1080p | Seedance 2.5 | ~96 |
| Vídeo 8s draft 480p | Seedance 2.5 | ~24 |

Na época, um vídeo completo em 720p saiu por ~65 créditos; 10s custa proporcionalmente mais. O próximo vídeo do mesmo protagonista custou só voz + vídeo (~57 créditos em 720p), porque imagem base e character sheet são reaproveitados.

Ordem de iteração, do mais barato para o mais caro: trocar a fala (voz + vídeo) · testar em draft 480p · gerar a final em 1080p.

Se o modelo citado não existir mais no conector, use o equivalente atual que o conector oferecer, diga ao dono que o modelo mudou e mostre o custo novo antes de gerar.
