# WHATSAPP_SYSTEM.md

## 1. Design Tokens (WhatsApp Metaphor)

### Paleta de Cores (Dark Mode - Primary)
- **Background Principal**: `#111b21`
- **Background Chat (Wallpaper)**: `#0b141a`
- **Header / AppBar**: `#202c33`
- **Bolha do Sistema (Receiver)**: `#202c33`
- **Bolha do Usuário (Sender)**: `#005c4b`
- **Cor Primária (Verde)**: `#00a884`
- **Texto Primário**: `#e9edef`
- **Texto Secundário / Muted**: `#8696a0`
- **Destaque de Seleção**: `#2a3942`

### Tipografia
- **Font Family**: Segue o padrão do sistema (San Francisco no iOS, Roboto no Android).
- **Tamanhos**:
  - Títulos de Conversa: `16px` (Semibold)
  - Conteúdo da Mensagem: `14.2px`
  - Metadados (Hora/Status): `11px`

### Espaçamento
- **Paddings de Mensagem**: `8px` top/bottom, `12px` left/right.
- **Margens entre Bolhas**: `2px` (mesmo autor), `8px` (troca de autor).

---

## 2. Componentes de Interface (Metáforas)

### Chat List Item (Equivalente ao OS Card)
- Exibe: Avatar (ícone de prédio/agência), Nome (Número da OS), Subtítulo (Local / Última atualização), Status de leitura (Visto azul = Concluído).

### Chat Bubble (Equivalente aos Campos de Captura)
- **Sistema pergunta**: "Qual o nome do gerente?"
- **Usuário responde**: (Input de texto que vira bolha verde).

### Input Bar (Barra de Ação)
- Campo de texto circular.
- Ícone de **Câmera** (Para fotos de ambiente/serviço).
- Ícone de **Microfone** (Poderia ser usado para observações por voz no futuro).
- Botão "Enviar" para validar o passo.

### Header (Top Bar)
- Foto de perfil (Agência).
- Título da conversa (Número da OS).
- Subtítulo ("Online" ou "Digitando..." quando navegando).
