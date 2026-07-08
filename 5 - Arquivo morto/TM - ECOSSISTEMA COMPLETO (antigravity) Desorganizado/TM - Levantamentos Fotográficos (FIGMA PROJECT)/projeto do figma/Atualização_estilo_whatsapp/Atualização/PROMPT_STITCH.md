# PROMPT_STITCH.md

Abaixo está o prompt estruturado para ser usado no **Stitch** ou ferramentas similares de geração de UI, consolidando toda a inteligência extraída do projeto TMS.

---

## Prompt para Reprodução de Alta Fidelidade (TM - Levantamentos Fotográficos)

**CONTEXTO:**
Você é um Engenheiro Frontend Sênior especializado em React, Tailwind CSS e ShadCN UI. Sua tarefa é construir um aplicativo de levantamentos fotográficos técnicos chamado "TM - Levantamentos Fotográficos". O app deve ser Mobile-First, focado em performance e UX técnica.

**STACK TÉCNICA:**

- Framework: Vite + React (TypeScript)
- Estilização: Tailwind CSS (Configuração Dark Mode default)
- Estado: Zustand (para persistência de dados de levantamento)
- Roteamento: React Router (Nested Routes)
- Ícones: Lucide React

**DESIGN SYSTEM >** 

**ESTRUTURA DE TELAS E REGRAS:**

1. **Login:** Estética premium com gradiente animado.
2. **Dashboard:** Lista de Ordens de Serviço (OS) com busca e barra de progresso.
3. **OS Details:** Formulário com validação Zod (Local, Agência, Gerente, Matrícula).
4. **Environment Selection:** Checklist de ambientes (Sala de Autoatendimento, Recepção, etc) + Botão "Adicionar Ambiente Customizado".
5. **Capture Screen:** Módulo de fotos macro (Vista Ampla) + Lista de Serviços.
6. **Service Capture:** Grid 2x2 de fotos, campo de Texto para Observações e Medidas. Regra: Requer 1 foto de detalhe para validar.
7. **Review & Success:** Resumo quantitativo de fotos por ambiente e animação de checkmark no envio.

**DIRETRIZES DE UI:**

- Use um "Sticky Header" com o nome da tela e um indicador de progresso (Ex: Passo 2 de 4).
- Botões de ação principal devem ser fixos no rodapé (Fixed Footer).
- Feedback visual imediato: bordas brilham em Neon Green quando um campo ou ambiente é validado.
- Contraste mínimo de 4.5:1 exigido.

**OBJETIVO DO CÓDIGO:**
Gere componentes modulares e reutilizáveis. Separe a lógica de estado (Zustand) da UI. Garanta que o layout seja responsivo para dispositivos Android/iOS mas centralizado em telas de desktop.
