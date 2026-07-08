# OCEAN_BREEZE_WHATSAPP.md

## Design System Híbrido: Ocean Breeze + WhatsApp Layout

Este documento define a fusão visual entre o **Ocean Breeze Design System** e a **interface de chat do WhatsApp**.

---

## 1. Tokens de Cor (Ocean Breeze aplicado ao Chat)

### Modo Claro
- **Background Principal (Wallpaper)**: `#f0f8ff` (Ocean Breeze background)
- **Header / AppBar**: `#ffffff` (TM-card)
- **Bolha do Sistema (Receiver)**: `#ffffff` com borda `#e5e7eb`
- **Bolha do Usuário (Sender)**: `#22c55e` (TM-primary)
- **Texto na Bolha do Usuário**: `#ffffff` (TM-primary-foreground)
- **Texto na Bolha do Sistema**: `#374151` (TM-foreground)
- **Input Bar Background**: `#ffffff`
- **Input Border**: `#e5e7eb`

### Modo Escuro
- **Background Principal**: `#0f172a` (TM-background dark)
- **Header**: `#1e293b` (TM-card dark)
- **Bolha do Sistema**: `#1e293b` com borda `#4b5563`
- **Bolha do Usuário**: `#34d399` (TM-primary dark)
- **Texto na Bolha do Usuário**: `#0f172a`
- **Texto na Bolha do Sistema**: `#d1d5db`
- **Input Bar**: `#1e293b`

---

## 2. Tipografia (Ocean Breeze)
- **Font Family Principal**: `"DM Sans", sans-serif` (substituindo Inter)
- **Font Mono (Dados Técnicos)**: `"IBM Plex Mono", monospace`
- **Font Serif (Títulos Especiais)**: `"Lora", serif`

### Tamanhos
- **Mensagens de Chat**: `14px` (DM Sans Regular)
- **Timestamp**: `11px` (DM Sans, cor muted)
- **Nome do Contato (Header)**: `16px` (DM Sans Semibold)

---

## 3. Componentes de Chat (Estilizados com Ocean Breeze)

### Chat Bubble (Bolha de Mensagem)
```css
.bubble-receiver {
  background: var(--TM-card);
  color: var(--TM-card-foreground);
  border: 1px solid var(--TM-border);
  border-radius: var(--TM-radius-lg) var(--TM-radius-lg) var(--TM-radius-lg) 4px;
  padding: 10px 14px;
  box-shadow: var(--TM-shadow-sm);
  max-width: 70%;
}

.bubble-sender {
  background: var(--TM-primary);
  color: var(--TM-primary-foreground);
  border-radius: var(--TM-radius-lg) var(--TM-radius-lg) 4px var(--TM-radius-lg);
  padding: 10px 14px;
  box-shadow: var(--TM-shadow-md);
  max-width: 70%;
  align-self: flex-end;
}
```

### Input Bar
```css
.input-bar {
  background: var(--TM-card);
  border-top: 1px solid var(--TM-border);
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.input-field {
  flex: 1;
  background: var(--TM-background);
  border: 1px solid var(--TM-input);
  border-radius: var(--TM-radius-xl);
  padding: 10px 16px;
  font-family: var(--TM-font-sans);
  color: var(--TM-foreground);
}

.input-field:focus {
  outline: none;
  border-color: var(--TM-ring);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}
```

### Header (Top Bar)
```css
.chat-header {
  background: var(--TM-card);
  border-bottom: 1px solid var(--TM-border);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--TM-shadow-sm);
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--TM-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--TM-primary-foreground);
  font-weight: 600;
}
```

---

## 4. Interações e Estados

### Hover States
- **Bolha de Mensagem**: `transform: translateY(-1px)` + `box-shadow: var(--TM-shadow-lg)`
- **Botões de Ação**: Opacidade `0.9`

### Typing Indicator (Digitando...)
```css
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px;
  background: var(--TM-card);
  border-radius: var(--TM-radius-lg);
  width: fit-content;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: var(--TM-muted-foreground);
  border-radius: 50%;
  animation: bounce 1.4s infinite;
}
```

### Status Checks (Lido/Entregue)
- **Single Check**: `color: var(--TM-muted-foreground)`
- **Double Check**: `color: var(--TM-primary)`

---

## 5. Wallpaper Pattern (Opcional)
Aplicar um padrão sutil de ondas oceânicas no background do chat:
```css
.chat-wallpaper {
  background: 
    linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, transparent 50%),
    var(--TM-background);
}
```
