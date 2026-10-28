# RespondeAí

Gera respostas para avaliações do Google com IA (Claude). MVP no modo "copiar e colar": o dono cola a avaliação e recebe 3 opções de resposta.

## O que tem

- `/`: landing page com planos e lista de espera
- `/gerar`: gerador de respostas (grátis, com limite por IP)
- `POST /api/gerar`: chama a IA e devolve `{ replies: string[] }`
- `POST /api/lista-espera`: salva e-mail no Postgres
- `/entrar` e `/painel`: login com Google e cadastro de negócios (tom, contato para reclamações e orientações para a IA)
- `/painel/negocios/[id]`: gerador que aplica as configurações salvas do negócio
- Tabelas criadas automaticamente quando o servidor inicia (`src/instrumentation.ts`): as do Better Auth e as do app

## Rodar localmente

```bash
cp .env.example .env.local   # preencha ANTHROPIC_API_KEY e DATABASE_URL
npm install
npm run dev
```

Abra http://localhost:3000.

## Deploy no Coolify

1. Crie um banco **PostgreSQL** no Coolify e copie a URL de conexão interna.
2. Crie uma aplicação a partir deste repositório com build pack **Dockerfile**, porta **3000**.
3. Configure as variáveis de ambiente de `.env.example`.
4. Aponte o domínio (ex.: via Cloudflare) e faça o deploy.

## Login com Google

No Google Cloud Console, crie um cliente OAuth do tipo "Aplicativo da Web" com o URI de redirecionamento
`https://SEU_DOMINIO/api/auth/callback/google` e preencha `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.

## Custo de IA

O modelo padrão é `claude-opus-5-5` com esforço baixo. Para reduzir custo, defina `ANTHROPIC_MODEL=claude-haiku-5-5`.

## Próximos passos

- Integração com a Google Business Profile API (acesso já solicitado)
- Cobrança recorrente (Asaas/Stripe)
- Alertas no WhatsApp para avaliações negativas
