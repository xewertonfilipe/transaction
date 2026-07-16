# Bytebank Transaction MFE

Microfrontend responsavel pela criacao de novas transacoes no shell do Bytebank.

## Visao geral

- Package: `@bytebank/transaction`
- Porta local (webpack): `9006`
- Porta container (docker): `8085`
- Artefato servido: `bytebank-transaction.js`

## Pre-requisitos

1. Node.js 18+
2. npm 9+
3. Docker Desktop (opcional, para execucao via container)

## Instalacao

```bash
npm install
```

## Configuracao da API (Vercel)

Defina `VITE_API_BASE_URL` para apontar para a API correta em cada ambiente.

- Desenvolvimento: `http://localhost:3000`
- Preview/Producao: URL publica da API na Vercel

Exemplo (`.env.local`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

Para detalhes de CORS, endpoints e checklist de validacao, consulte [docs/frontend-integration.md](docs/frontend-integration.md).

## Executando em desenvolvimento (npm)

1. Inicie o servidor de desenvolvimento:

```bash
npm start
```

2. O MFE sera servido em `http://localhost:9006/bytebank-transaction.js`.

3. Para rodar isolado (sem orchestrator), use:

```bash
npm run start:standalone
```

## Executando em desenvolvimento (Docker)

1. Suba o container:

```bash
npm run start:docker
```

2. O MFE sera servido em `http://localhost:8085/bytebank-transaction.js`.

Para parar os containers:

```bash
npm run stop:docker
```

## Integracao com o orchestrator

- Modo local do orchestrator (`isLocal`): consome `http://localhost:9006/bytebank-transaction.js`

## Responsividade

- Layout do formulario ajustado para telas pequenas, tablets e desktop.
- Breakpoints validados: 320px, 768px e 1024px.
- Ajustes principais: card com espacamento responsivo, campos com largura fluida e botao sem largura fixa rigida.

## Scripts uteis

- `npm start`: sobe webpack dev server na porta 9006
- `npm run start:standalone`: executa standalone
- `npm run start:docker`: sobe container Docker com build
- `npm run stop:docker`: derruba containers do Docker Compose
- `npm run build`: build de producao
- `npm test`: executa testes
- `npm run coverage`: executa testes com cobertura
- `npm run lint`: lint
- `npm run type-check`: verificacao de tipos
- `npm run format`: formatacao com Prettier

## Testes

```bash
npm test
```

Para cobertura:

```bash
npm run coverage
```

## Troubleshooting

1. Se a porta `9006` estiver ocupada, finalize o processo em conflito e rode `npm start` novamente.
2. Se o formulario nao aparecer no shell, confira o import map e o status do orchestrator.
3. Se a criacao de transacao falhar, valide disponibilidade da API e payload enviado na aba Network.
