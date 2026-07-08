# TELAS_RECRIADAS.md

---

## TELA: Login
- **Fonte**: `LoginScreen.tsx`
- **Objetivo**: Autenticação.
- **Componentes**: Logo, Input (User/Pass), Button (Acessar), Gradient Background.
- **Layout**: Centralizado, Flex-col.
- **Hierarquia**: Logo (Topo) -> Form (Centro) -> Footer (Informação).
- **Copy**: "Bem-vindo ao TMS", "Entre com suas credenciais".
- **Estados**: Idle, Loading, Error.
- **Regras**: Impedir submissão com campos vazios.

---

## TELA: Home
- **Fonte**: `HomeScreen.tsx`
- **Objetivo**: Navegação principal.
- **Componentes**: Header (Título/Avatar), MenuCards (3 unidades).
- **Layout**: Grid de 1 coluna, espaçamento largo.
- **Hierarquia**: Perfil (Topo) -> Ações (Corpo).
- **Copy**: "Olá, [Nome]", "Iniciar Novo Levantamento", "Histórico".
- **Estados**: Carregando dados do usuário.

---

## TELA: Dashboard
- **Fonte**: `DashboardScreen.tsx`
- **Objetivo**: Seleção de OS Pendentes.
- **Componentes**: SearchBar, OS-Cards (Status, Número, Local).
- **Layout**: Lista vertical (stack).
- **Hierarquia**: Busca (Fixo) -> Lista (Scroll).
- **Copy**: "Ordens de Serviço", "Buscar por número...".
- **Estados**: Empty list, Filtered list.
- **Regras**: Ocultar OS com status "Concluído".

---

## TELA: Detalhes da OS
- **Fonte**: `OSDetailsScreen.tsx`
- **Objetivo**: Configuração do levantamento.
- **Componentes**: SummaryCard (Dados da OS), InputFields (4 obrigatórios).
- **Layout**: Formulário linear.
- **Hierarquia**: Título -> Resumo OS -> Formulário -> Botão Ação.
- **Copy**: "Dados do Levantamento", "Iniciar Levantamento".
- **Regras**: Botão desabilitado se campos estarem vazios.

---

## TELA: Seleção de Ambientes
- **Fonte**: `EnvironmentSelectionScreen.tsx`
- **Objetivo**: Estruturação de checklist.
- **Componentes**: StepIndicator, EnvironmentCards, AddButton.
- **Layout**: Grid customizado / Lista com checkmarks.
- **Hierarquia**: Progresso -> Contadores -> Lista Ambientes -> Finalizar.
- **Copy**: "Seleção de Ambientes", "Passo 2 de 4".
- **Regras**: Só permite finalizar se todos os selecionados estiverem concluídos.

---

## TELA: Captura de Ambiente
- **Fonte**: `CaptureScreen.tsx`
- **Objetivo**: Registro de evidências macro.
- **Componentes**: WidePhotoModule, ServiceList, ValidationBadge.
- **Layout**: Sticky Header -> Scroll Seções -> Fixed Footer.
- **Hierarquia**: Título Ambiente -> Fotos Vista Ampla -> Serviços -> Salvar.
- **Copy**: "Vista Ampla (Opcional)", "Serviços Executados".
- **Regras**: Requer 1 serviço concluído para validar o ambiente.

---

## TELA: Captura de Serviço
- **Fonte**: `ServiceCaptureScreen.tsx`
- **Objetivo**: Registro técnico granular.
- **Componentes**: PhotoGrids (Geral/Detalhe), Textarea (Obs/Medidas).
- **Layout**: Single column scroll.
- **Hierarquia**: Nome Serviço -> Fotos Gerais -> Fotos Detalhes -> Dados Técnicos.
- **Copy**: "Fotos de Detalhe (Obrigatório)", "Medidas encontradas".
- **Regras**: Requer 1 foto de detalhe para salvar.

---

## TELA: Revisão Final
- **Fonte**: `ReviewScreen.tsx`
- **Objetivo**: Auditoria pré-envio.
- **Componentes**: SummaryStats, Accordion/List of Environments.
- **Layout**: Relatório tabular/lista resumida.
- **Hierarquia**: Info OS -> Status Geral -> Checklist Ambientes -> Enviar.
- **Copy**: "Revisão e Finalização", "Confira os dados antes de enviar".
- **Regras**: Bloquear envio se houver avisos de inconsistência.

---

## TELA: Sucesso
- **Fonte**: `SuccessScreen.tsx`
- **Objetivo**: Fechamento do fluxo.
- **Componentes**: SuccessIcon, FeedbackCard, HomeButton.
- **Layout**: Centralizado / Comemorativo.
- **Hierarquia**: Checkmark (Gigante) -> Título -> Resumo Dados -> Botão Home.
- **Copy**: "Levantamento Enviado!", "O pacote de dados foi enviado".
