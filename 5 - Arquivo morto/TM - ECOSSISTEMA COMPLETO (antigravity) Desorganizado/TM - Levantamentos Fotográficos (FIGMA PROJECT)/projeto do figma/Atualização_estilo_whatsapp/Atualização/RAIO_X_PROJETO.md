# RAIO_X_PROJETO.md

## Arquitetura Atual
O projeto é um aplicativo web (SPA) construído com **React**, focado em levantamentos fotográficos técnicos. A navegação é gerencial e baseada em estados internos no `App.tsx`, sem o uso de uma biblioteca de roteamento externa (como React Router).

### Stack Usada
- **Frontend Framework**: React (TypeScript)
- **Styling**: Tailwind CSS + ShadCN UI
- **Design System**: TMS Design System (customizado via variáveis CSS)
- **State Management**: React `useState` / `useEffect` (State Lifting no `App.tsx`)
- **Icons**: Lucide React (implícito pelos componentes ShadCN)
- **Fonts**: Exo 2 (Headings), Inter (Body), Roboto Mono (Technical/Technical metrics)

### Padrões Detectados
- **Screen-based Pattern**: Cada funcionalidade principal é encapsulada em um componente de "Screen" (ex: `LoginScreen`, `DashboardScreen`).
- **CSS Variable Theme**: Troca de temas (Light/Dark) baseada em classes no `<html>` e variáveis no `:root`.
- **Prop Drilling**: Como o estado está concentrado no `App.tsx`, dados de levantamento e funções de navegação são passados por múltiplos níveis.
- **Atomic Components**: Uso intensivo de componentes base do ShadCN (`/ui`).

### Dívidas Técnicas
- **Navegação Manual**: O uso de `if/else` ou switch no `App.tsx` para renderizar telas impede o uso de histórico do navegador (botão voltar) e deep linking.
- **State Bloat**: O `App.tsx` acumula lógica de autenticação, navegação, dados de levantamento e gerenciamento de tema.
- **Lack of Services**: A lógica de manipulação de dados está misturada aos componentes, sem uma camada clara de serviços ou hooks de dados dedicados.
- **Hardcoded Types**: Tipos como `Screen` e `WorkOrder` estão definidos diretamente no `App.tsx`.

### Anti-patterns
- **Conditional Rendering for Pages**: Grande bloco condicional no `return` do `App.tsx`.
- **Excessive Prop Drilling**: Telas recebem estados que poderiam estar em um Contexto ou Store global (ex: `levantamentoData`).
- **Direct DOM Manipulation**: Uso de `document.documentElement.classList.add('dark')` dentro de um `useEffect` (comum, mas pode ser abstraído).
