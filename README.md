# Sistema de Donos

Skills do Manual de Donos para o empresário usar no Claude (app, claude.ai, Cowork e Claude Code).

## Instalar no app do Claude (planos pagos)

1. Abra o Claude e vá em **Customize › Plugins**.
2. Clique em **Add › Add marketplace › Add from a repository**.
3. Cole `manualdedonos/sistema-de-donos`.
4. Em **Plugins**, clique em **Add** no **Sistema de Donos**.
5. Teste: escreva "testar o sistema de donos".

## Instalar no Claude Code

```
claude plugin marketplace add manualdedonos/sistema-de-donos
claude plugin install sistema-de-donos@sistema-de-donos
```

## Publicar versão nova

Altere `version` em `plugins/sistema-de-donos/.claude-plugin/plugin.json` a cada release. Sem mudar a versão, quem já instalou não recebe a mudança.
