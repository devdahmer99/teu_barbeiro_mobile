# Teu Barbeiro Mobile (React Native 0.84.0 + Expo Dev Client)

Base mobile do SaaS Teu Barbeiro com foco em:

- Tema dark-first via design tokens.
- Autenticação mobile por token.
- Navegação por perfil (`client`, `barber`, `owner`).
- Integração inicial com endpoints do Swagger em `http://127.0.0.1:8000/dev/swagger`.

## Stack

- React Native `0.84.0`
- Expo SDK `55.0.0` (preview)
- Expo Dev Client
- React Navigation
- Axios
- TypeScript

## Estrutura

- `src/theme/tokens/` tokens base, Flutter e React Native.
- `src/api/` cliente HTTP e módulos por domínio.
- `src/providers/AuthProvider.tsx` autenticação e persistência de sessão.
- `src/navigation/RootNavigator.tsx` roteamento por papel.
- `src/screens/` telas MVP de login e dashboards.
- `android/` e `ios/` estrutura nativa gerada para build bare React Native.

## Endpoints mapeados

Prefixo: `/api/v1/mobile`

- Auth: `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- Client: `GET /services`, `GET /barbers`, `GET /barbers/available-slots`, `GET /appointments`, `POST /appointments`, `POST /appointments/{id}/cancel`
- Barber: `GET /barber/dashboard`, `GET /barber/appointments`, `POST /barber/appointments/{id}/status`
- Owner: `GET /owner/dashboard`, `GET /owner/appointments`, `POST /owner/appointments/{id}/status`

## Rodando local

1. Instale dependências:

```bash
npm install
```

2. Inicie o Metro:

```bash
npm start
```

`npm start` usa `expo start --dev-client`.

3. Rode no dispositivo/simulador:

```bash
npm run android
# ou
npm run ios
```

Atalhos úteis:

```bash
npm run start:rn   # Metro puro do React Native
npm run prebuild   # Regera/sincroniza nativo via Expo
```

## Observação de compatibilidade

Como o projeto está em React Native `0.84.0`, o setup Expo usa canal preview (`expo@55.0.0-preview.11`) para suportar esse runtime.

Para iOS (macOS), antes de rodar:

```bash
cd ios && bundle install && bundle exec pod install
```

## URL da API local

A URL base está em `src/config/env.ts` e usa:

- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://localhost:8000`

Para dispositivo físico, ajuste `API_BASE_URL` para o IP da máquina na rede local.

## Próximos passos sugeridos

- Criar fluxo de agendamento completo para cliente.
- Implementar atualização de status para barbeiro/owner na UI.
- Adicionar tratamento padronizado de erros de API.
- Incluir testes de integração da camada de autenticação.
