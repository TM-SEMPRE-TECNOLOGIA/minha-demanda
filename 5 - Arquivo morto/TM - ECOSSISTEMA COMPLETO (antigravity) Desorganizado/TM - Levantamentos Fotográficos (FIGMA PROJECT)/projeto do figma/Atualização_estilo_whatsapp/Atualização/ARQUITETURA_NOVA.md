# ARQUITETURA_NOVA.md

## 1. Stack Recomendada
- **Framework**: Vite + React (TypeScript) - *Foco em performance e DX.*
- **Roteamento**: React Router v7+ - *Suporte a nested routes e data loaders.*
- **State Management**: Zustand - *Store leve e modular para o `levantamentoData`.*
- **Formulários**: React Hook Form + Zod - *Gerenciamento robusto de validações.*
- **Data Fetching**: TanStack Query (React Query) - *Sincronização offline-first facilitada.*
- **Estilização**: Tailwind CSS + ShadCN UI (Radix UI).

---

## 2. Estrutura de Pastas (Modular por Feature)
```text
src/
├── assets/          # Imagens estáticas e ícones globais
├── components/      # Componentes UI compartilhados (ShadCN modificado)
│   ├── base/        # Botões, Inputs, Badges (atômicos)
│   └── layout/      # Shell, Sidebar, Header
├── features/        # Módulos independentes por domínio
│   ├── auth/        # Login, Logout, Profile
│   ├── dashboard/   # Lista de OS, Filtros
│   ├── levantamento/ # Fluxo core (OS -> Ambientes -> Captura -> Review)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   └── settings/    # Temas, Configurações
├── hooks/           # Hooks globais (useTheme, useOnlineStatus)
├── services/        # Clientes de API, LocalStorage wrappers
├── stores/          # Stores globais (Zustand)
├── utils/           # Formatadores, validadores, helpers de imagem
└── routes/          # Definição centralizada de rotas
```

---

## 3. Navegação e Camadas de Responsabilidade

### Camada de Rotas
Substituir o `if/else` no `App.tsx` por roteamento real:
- `/` -> `Login`
- `/home` -> `Home`
- `/os` -> `Dashboard`
- `/os/:id/setup` -> `OS Details`
- `/os/:id/ambientes` -> `Environment Selection`
- `/os/:id/captura/:envId` -> `Ambient Capture`
- `/os/:id/review` -> `Final Review`

### Camada de Estado (Store)
Centralizar o objeto `LevantamentoData` em uma store Zustand (`useLevantamentoStore`).
- **Ações**: `updateEnvironment`, `addServicePhoto`, `setOS`.
- **Persistência**: Auto-save no `IndexedDB` (via persist middleware) para evitar perda de dados por queda de energia/conexão.

### Camada de Serviços
Abstrair o processamento de imagens (redimensionamento, compressão, conversão base64) em um serviço worker dedicado, não bloqueando a UI durante capturas intensas.

---

## 4. Separação de Responsabilidades (SOC)
- **Componentes**: Apenas renderizam a UI e disparam ações da Store/Hooks.
- **Features**: Encapsulam toda a lógica de negócio de um domínio específico.
- **Hooks**: Orquestram efeitos colaterais (acesso à câmera, geolocalização).
- **Services**: Única fonte de verdade para comunicação externa (API/DB).
