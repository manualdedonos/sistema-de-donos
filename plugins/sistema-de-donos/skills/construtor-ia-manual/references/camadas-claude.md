# As camadas do Claude — o que é, quando usar e como colocar de pé com o dono

Use esta referência para decidir a camada e para guiar o dono na parte que só ele pode fazer na conta dele. Regra de ouro: **a camada mais barata que resolve o exemplo real**. Subir de camada só quando o volume, a repetição ou a integração justificar.

**Sobre nomes de menu.** Eles mudam com versões e idioma da interface. Abaixo, cada passo é descrito **pela função** (o que a tela faz) e, entre parênteses, o rótulo que aparecia no claude.ai em português em outubro de 2026. Dê o passo pela função, cite o rótulo como referência ("hoje aparece como…") e, se o dono não encontrar, peça um print e descreva onde costuma ficar. **Nunca afirme um nome de botão como certeza.**

| Camada | O que é, em uma frase para o dono | Quando usar | Quando NÃO usar |
|---|---|---|---|
| **Chat + Prompt** | Um pedido bem escrito, salvo em algum lugar, que ele cola toda vez | Tarefa pontual ou primeira semana de qualquer caso | Quando a mesma tarefa volta toda semana com os mesmos arquivos (vira Project) |
| **Project** | Uma sala do Claude que já conhece a empresa: instruções fixas + arquivos de referência | Rotina que volta com o mesmo contexto (caixa, cobrança, propostas, reuniões, marca) | Tarefa única; ou quando precisa rodar sem pessoa |
| **Skill** | Uma rotina que o Claude aprende uma vez (pasta com SKILL.md) e aciona pelo assunto, em qualquer conversa | Mesma tarefa, mesmo formato, por mais de uma pessoa ou em várias conversas; depois de 3 rodadas iguais no Project | Antes de o formato estabilizar |
| **Conector (MCP)** | Um cabo entre o Claude e a ferramenta onde o dado mora (Drive, Sheets, Gmail, Calendar, Notion, Canva…) | Quando o copia-e-cola de arquivo é o gargalo | Quando a ferramenta não tem conector confiável; checar antes |
| **Cowork** | O Claude no computador, trabalhando em pastas e arquivos locais, em tarefas longas | Lotes: 40 notas, 60 currículos, 12 POPs | Tarefa de uma peça só |
| **Automação (API/n8n/Make)** | A rotina rodando sozinha, sem pessoa conferindo | Volume alto e regra já estável (atendimento 24h, régua de disparo) | Antes de rodar 2 semanas com pessoa no circuito; dado sensível sem revisão |

## Antes de qualquer camada: arquivos

Pergunte uma vez, no começo: "Você consegue baixar arquivos nesta conversa (aparece um botão de download quando eu gero um documento)?". Se sim, você gera `.zip`, `.xlsx` e `.docx` quando a receita pedir. Se não, entregue tudo em bloco copiável e explique como salvar como arquivo de texto. Não repita a pergunta a cada etapa.

## Como colocar cada camada de pé (o que o dono faz na conta dele)

### Project
1. Na lista de projetos do Claude (menu lateral; em out/2026, "Projetos"), crie um projeto novo com o nome combinado (ex.: "Caixa semanal — [empresa]").
2. Abra a área de **instruções do projeto** (o texto fixo que vale para todas as conversas dali; em out/2026 aparecia como "Definir instruções do projeto") e cole o texto que você escreveu.
3. Abra a área de **arquivos de referência do projeto** (em out/2026, "Conhecimento do projeto") e suba os arquivos (categorias, modelo de relatório, exemplos aprovados). Um passo por arquivo quando houver mais de dois.
4. Abra uma conversa dentro do projeto e rode o pedido padrão com o arquivo real. Peça para ele colar a saída aqui.
Espere o "feito" do dono em cada passo. Se ele descrever uma tela diferente, adapte.

### Skill
1. Você gera a pasta da skill (SKILL.md e, se houver, `references/` e `assets/`) e, se arquivos forem possíveis, o `.zip` para download. Senão, entregue o SKILL.md em bloco copiável e explique: salvar como arquivo de texto chamado `SKILL.md` dentro de uma pasta com o nome da skill e compactar a pasta em `.zip`.
2. Na área de **personalização da conta**, procure a seção de **skills (habilidades)** e a opção de **adicionar/fazer upload** (em out/2026: "Personalizar → Habilidades (Skills) → Adicionar → Fazer upload"). Se não encontrar, peça um print.
3. Teste numa conversa nova digitando `/nome-da-skill` ou pedindo pelo assunto. Se ela se apresentar, está instalada.
4. Para o time: cada pessoa instala o mesmo arquivo, ou a empresa distribui pela conta Team.

### Conector
1. Nas **configurações da conta**, procure a seção de **conectores** (em out/2026: "Configurações → Conectores"). Localize o conector oficial (Google Drive, Gmail, Calendar, Notion, Canva…) e conecte, fazendo o login na ferramenta.
2. Para conector fornecido por um serviço externo: a opção de **adicionar conector personalizado**, com nome e URL.
3. Teste de verificação: faça uma pergunta que só a ferramenta responde ("qual o total da aba X da planilha Y?"). Se responder com o dado, os dois estão conversando.
4. Em conversas novas, confira se o conector está ativado no menu de ferramentas da conversa.

### Cowork
1. Abra o app do Claude no computador e entre no modo Cowork.
2. Conecte a pasta onde estão os arquivos (opção de adicionar pasta).
3. Dê o pedido apontando a pasta: "Leia todas as notas em [pasta] e monte a planilha consolidada com as colunas X, Y, Z, e uma lista de divergências."
4. Confira o arquivo gerado contra 3 originais escolhidos ao acaso.

### Automação (n8n, Make ou API)
Só depois de a rotina rodar 2 semanas com pessoa no circuito. Entregue ao dono: o fluxo em passos (gatilho → leitura → Claude → saída → registro), o prompt final já testado, a lista do que o fluxo nunca deve fazer sozinho (enviar cobrança acima de R$ X sem revisão; prometer prazo; responder reclamação formal), e a recomendação de quem monta (o próprio dono se já usa n8n/Make; senão, um parceiro, com o prompt e o fluxo prontos para reduzir o custo da implantação). Diga o custo recorrente da plataforma e da API em ordem de grandeza e peça para confirmar o volume antes.

## Dados, privacidade e bom senso

- Suba para o Claude só o dado que a tarefa precisa. Nome e valor bastam para cobrança; CPF e endereço não.
- Dados de clientes e funcionários são protegidos pela LGPD: use a conta do Claude da empresa (não a pessoal), anonimize quando possível e não cole conversas inteiras com dados de terceiros sem necessidade.
- **Dado sensível por categoria** (LGPD, art. 11, e bom senso):
  - **Saúde** (clínicas, psicólogos, nutrição, academias com ficha, estética): o Project recebe só nome, horário, profissional e um rótulo genérico; nenhuma mensagem ao cliente cita procedimento, diagnóstico, exame ou orientação clínica. Isso é regra escrita nas instruções e item do teste de aceitação.
  - **Menor de idade** (escolas, pediatria, cursos): toda mensagem é dirigida ao responsável; nada de dado do menor além do primeiro nome e horário.
  - **Financeiro de cliente**: nome e valor; sem CPF, sem número de cartão ou conta.
  - **Funcionários**: salário e avaliação só agregados ou com consentimento; triagem de currículo ignora idade, gênero, origem, foto e qualquer dado que não seja ligado ao cargo.
- Toda saída que vai para cliente, para o banco ou para o contador passa por uma pessoa nas primeiras semanas. Automatizar vem depois de confiar.
- Se a tarefa envolve decisão fiscal, trabalhista ou jurídica, a IA prepara e o profissional decide. Diga isso ao dono, sempre, na entrega.
