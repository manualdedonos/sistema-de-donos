# Padrões de Recorrência e Benchmarks — referência de trabalho

Use este catálogo no Passo 4 (desenhar modelos) e no Passo 6 (benchmarks). Regra de ouro: **extraia a lógica do padrão, nunca copie o modelo literalmente.** A pergunta certa é "por que isso retém lá — e essa razão existe aqui?"

## Catálogo de padrões de recorrência

Combine 2-3 padrões por modelo desenhado. Um padrão sozinho raramente sustenta uma assinatura.

| Padrão | Lógica | Quando usar | Exemplo (Brasil quando possível) |
|---|---|---|---|
| **Subscription (reposição)** | Produto de consumo chega antes de acabar; o cliente para de pensar nisso | Consumo previsível e frequente (critérios 1-2 altos): ração, café, lente, suplemento, insumo B2B | Petlove (Assinatura com desconto), cafeterias de specialty coffee com clube mensal |
| **Curadoria / Discovery** | O valor é a ESCOLHA, não o produto — especialista seleciona por você | Categoria com excesso de opção e prazer na descoberta: vinho, livro, beleza, moda | Wine (maior clube de vinhos do mundo), Leiturinha (livros infantis por idade), B4A/Glambox |
| **Membership / Acesso** | Paga pelo direito de usar, não pela posse | Ativo caro/compartilhável com uso frequente: academia, coworking, ferramenta, espaço | Smart Fit (acesso à rede), Wellhub/TotalPass (acesso B2B2C a várias redes) |
| **Flat Rate ("tudo incluso")** | Preço fixo, uso à vontade — vende tranquilidade e simplicidade | Custo marginal por uso baixo E medo de conta-surpresa alto | Streaming; planos de saúde odontológicos; "manutenção ilimitada" em serviços |
| **Razor & Blade** | Base barata (ou de graça) + recorrência no consumível/refil | Produto-âncora com consumível cativo e margem no refil | Nespresso (máquina + cápsula); impressoras; purificadores com refil assinado |
| **Rent Instead of Buy / Ativo como serviço** | Transforma CAPEX do cliente em OPEX mensal | Ativo caro, com manutenção chata, que o cliente quer USAR e não TER | Localiza Meoo e Kovi (carro por assinatura); equipment-as-a-service industrial |
| **Guaranteed Availability / Prevenção** | Paga para NUNCA ficar na mão: prioridade, manutenção, resposta garantida | Downtime custa caro (B2B) ou dá muita dor de cabeça (B2C): equipamento, TI, ar-condicionado, elevador | Contratos de manutenção predial/industrial; planos "peace of mind" de assistência técnica |
| **Solution Provider / Pacote de serviços** | Um fee cobre um RESULTADO contínuo, não horas avulsas | Serviços recorrentes hoje vendidos picados: contabilidade, marketing, jurídico, estética | Contabilidades online (Contabilizei), agências com fee mensal, clínicas com plano de tratamento contínuo |
| **Customer Loyalty pago (clube de benefícios)** | Cliente paga para ter vantagens: frete, desconto, acesso, pontos turbinados | Base grande e frequente onde o clube AUMENTA a frequência (o benefício se paga no incremental) | Amazon Prime, Meli+ (Mercado Livre), Clube iFood — a lógica: o assinante passa a concentrar compras em você |
| **Freemium** | Grátis atrai volume; assinatura destrava o valor completo | Custo marginal do grátis ~zero e upgrade com gatilho natural de uso | Apps e SaaS (Conta Azul, Nubank→Ultravioleta como analogia de tier pago) |
| **Pay per Use com piso** | Mensalidade mínima + variável por uso — recorrência sem risco de overuse | Uso volátil onde flat rate quebraria a margem | Telecom, cloud, logística; híbrido comum em B2B |
| **Comunidade + Conteúdo** | O produto é o ACESSO às pessoas e ao conhecimento vivo | Nicho com identidade forte e aprendizado contínuo | Assinaturas de educação continuada e comunidades de negócio (o próprio Manual de Donos); Empiricus/Suno em research financeiro |
| **Lock-in de valor** | Dados/histórico/integração acumulados tornam a troca custosa | Sempre como CAMADA sobre outro padrão, nunca sozinho | ERPs e CRMs; qualquer assinatura que personaliza com histórico |
| **Experience Selling** | A recorrência é de EXPERIÊNCIA programada (evento, ritual, novidade) | Negócios de encontro: restaurantes (menu do mês), teatros, experiências | Clubes de jantar/degustação mensal; temporadas por assinatura |

## Benchmarks brasileiros por setor (atalho de pesquisa)

Use como ponto de partida; quando o caso pedir, busque dados atuais na web antes de citar números.

- **Varejo/consumo:** Petlove, Wine, Evino, Leiturinha, B4A (Glambox), Amaro/Natura clubes de recompra. Lição comum: reposição + desconto retém pouco sozinho; curadoria e conveniência retêm mais.
- **Alimentação:** clubes de café (Coffee & Joy, Moka), assinaturas de padaria/marmita locais, Clube iFood. Lição: em food, a frequência é altíssima mas a margem é curta — o clube funciona melhor como concentrador de frequência do que como desconto.
- **Academias/bem-estar:** Smart Fit (planos nacionais, escala), Wellhub/TotalPass (B2B2C via RH). Lição: fricção de cancelamento gera ódio; retenção boa vem de hábito + rede.
- **Saúde/beleza:** planos odontológicos, clínicas com mensalidade de acompanhamento, salões com "beleza ilimitada" (cuidado: overuse — ver armadilha 3). Lição: prevenção vende tranquilidade, mas precisa de valor visível mensal.
- **Educação:** Alura, meuSucesso.com, Manual de Donos, MBA/educação continuada por assinatura. Lição: churn estrutural existe (o aluno "termina") — a retenção vem de comunidade + conteúdo vivo + novas jornadas.
- **Serviços B2B:** Contabilizei, agências fee-based, manutenção industrial, RH/benefícios (Caju, Flash como analogia de recorrência B2B). Lição: contrato anual com pagamento mensal muda o churn de mensal para anual — mas exige entrega de resultado documentada.
- **Mobilidade/ativos:** Localiza Meoo, Kovi, Porto Carro Fácil. Lição: assinatura de ativo caro vive de tirar DOR DE CABEÇA (IPVA, seguro, manutenção inclusos), não de preço.
- **Financeiro:** Empiricus, Suno (research), tiers pagos de bancos (Ultravioleta). Lição: informação recorrente retém enquanto o assinante sente que "se paga".

## Growth loops típicos de assinatura

Escolha/adapte um por modelo:

1. **Loop de indicação:** assinante → usa → tem resultado → indica (com incentivo dos dois lados) → novo assinante. Funciona quando o resultado é visível socialmente.
2. **Loop de dados:** assinante → gera histórico → personalização melhora → valor percebido sobe → retenção sobe → LTV sobe → sobra CAC para adquirir mais.
3. **Loop de comunidade:** mais assinantes → comunidade mais viva → mais valor por assinante → menor churn + mais boca a boca.
4. **Loop de concentração (clube de benefícios):** assinante → concentra compras → benefício se paga → renova → concentra mais.

Classifique também o motor dominante: **Product-led** (o uso vende), **Marketing-led** (conteúdo/mídia vende) ou **Sales-led** (gente vende — comum em B2B de ticket alto). O motor define onde o CAC vive e qual métrica de aquisição acompanhar.
