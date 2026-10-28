# RespondeAí

Gera respostas para avaliações do Google com IA (Claude). MVP no modo "copiar e colar": o dono cola a avaliação e recebe 3 opções de resposta.

## O que tem

- `/`: landing page com planos e lista de espera
- `/gerar`: gerador de respostas (grátis, com limite por IP)
- `POST /api/gerar`: chama a IA e devolve `{ replies: string[] }`
- `POST /api/lista-espera`: salva e-mail no Postgres
- Tabelas criadas automaticamente na primeira requisição (`waitlist`, `generations`)

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
3. Configure as variáveis de ambiente de `.env.example` (`ANTHROPIC_API_KEY`, `DATABASE_URL`, opcionalmente `ANTHROPIC_MODEL` e `FREE_LIMIT_PER_HOUR`).
4. Aponte o domínio (ex.: via Cloudflare) e faça o deploy.

## Custo de IA

O modelo padrão é `claude-opus-5-5` com esforço baixo. Para reduzir custo, defina `ANTHROPIC_MODEL=claude-haiku-5-5`.

## Próximos passos

- Login com Google + integração com a Google Business Profile API (pedir acesso à API já)
- Cobrança recorrente (Asaas/Stripe)
- Alertas no WhatsApp para avaliações negativas
