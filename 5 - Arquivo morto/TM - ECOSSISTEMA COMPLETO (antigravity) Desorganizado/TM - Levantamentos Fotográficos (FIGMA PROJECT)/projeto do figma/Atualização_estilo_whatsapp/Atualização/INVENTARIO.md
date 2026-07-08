# INVENTARIO.md

| Tela | Rota (Pseudo) | Arquivo | Componentes UI Usados | Fonte | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Login | `login` | `LoginScreen.tsx` | Button, Input, Card | Código | Tela de entrada com animação de gradiente. |
| Home | `home` | `HomeScreen.tsx` | Button, Avatar | Código | Menu principal com 3 ações (Iniciar, Enviados, Config). |
| Dashboard | `dashboard` | `DashboardScreen.tsx` | Input, Progress, Card, Lucide Icons | Código | Lista de OS filtradas (remove concluídas). |
| OS Enviadas | `sentSurveys` | `SentSurveysScreen.tsx` | Badge, Card, Lucide Icons | Código | Histórico de levantamentos concluídos. |
| Configurações | `settings` | `SettingsScreen.tsx` | Switch, Avatar, Button, Label | Código | Toggle de tema (Dark/Light) e foto de perfil. |
| Detalhes da OS| `osDetails` | `OSDetailsScreen.tsx` | Button, Input, Label, Card | Código | Formulário de dados técnicos obrigatórios. |
| Seleção Ambientes| `environments` | `EnvironmentSelectionScreen.tsx` | Button, Dialog, Input, Progress | Código | Checklist de ambientes; **Modal de Novo Ambiente**. |
| Captura Ambiente| `capture` | `CaptureScreen.tsx` | Button, Camera (Custom), Badge | Código | Fluxo de fotos de vista ampla e lista de serviços. |
| Captura Serviço| `serviceCapture` | `ServiceCaptureScreen.tsx` | Button, Textarea, Camera (Custom) | Código | Captura detalhada de fotos, obs e medidas. |
| Revisão | `review` | `ReviewScreen.tsx` | Button, Badge, Card | Código | Resumo quantitativo e qualitativo das fotos. |
| Sucesso | `success` | `SuccessScreen.tsx` | Button, Check (Lucide) | Código | Feedback visual de envio concluído. |

## Modais Mapeados
1.  **AddEnvironmentDialog** (`EnvironmentSelectionScreen.tsx`): Permite ao usuário cadastrar ambientes não listados originalmente.

## Estados Globais (Lifting)
- `currentScreen`: Controla o roteamento manual.
- `selectedOS`: OS selecionada para o levantamento atual.
- `levantamentoData`: Objeto complexo contendo fotos, metadados e serviços por ambiente.
- `theme`: Alternância global entre 'dark' e 'light'.
- `userPhoto`: Foto de perfil do técnico.
