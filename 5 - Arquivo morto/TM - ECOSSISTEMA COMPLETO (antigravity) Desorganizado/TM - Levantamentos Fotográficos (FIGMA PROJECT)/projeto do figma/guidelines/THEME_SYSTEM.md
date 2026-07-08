# Sistema de Tema Unificado TMS

## Visão Geral

O sistema de tema unificado permite que o aplicativo TMS Levantamentos alterne entre modo claro e escuro de forma consistente em todos os componentes.

## Como Funciona

### 1. Variáveis CSS

Todas as cores do TMS estão definidas como variáveis CSS em `/styles/globals.css`:

#### Modo Claro (`:root`)
- Background principal: `--tms-navy-deep: #f8f9fa`
- Background cards: `--tms-navy-medium: #ffffff`
- Cores de destaque ajustadas para contraste adequado

#### Modo Escuro (`.dark`)
- Background principal: `--tms-navy-deep: #0a192f`
- Background cards: `--tms-navy-medium: #112240`
- Cores neon vibrantes: `--tms-neon-green: #64ffda`

### 2. Controle de Tema

O tema é controlado no `App.tsx`:
- Estado: `theme: "dark" | "light"`
- useEffect aplica/remove a classe `.dark` no `<html>`
- Default: dark mode

### 3. Helper de Cores

Use o helper `tmsColors` de `/components/ThemeProvider.tsx`:

```tsx
import { tmsColors } from "./ThemeProvider";

// Uso:
style={{ 
  backgroundColor: tmsColors.navyDeep,
  color: tmsColors.textPrimary,
  borderColor: tmsColors.borderSubtle 
}}
```

## Referência Rápida de Cores

### Backgrounds
- `tmsColors.navyDeep` - Background principal
- `tmsColors.navyMedium` - Background secundário/headers
- `tmsColors.navyLight` - Background terciário/subtle
- `tmsColors.cardBg` - Background de cards
- `tmsColors.inputBg` - Background de inputs

### Textos
- `tmsColors.textPrimary` - Texto principal
- `tmsColors.textSecondary` - Texto secundário/muted
- `tmsColors.textEmphasis` - Texto em destaque

### Cores de Ação
- `tmsColors.neonGreen` - Cor primária/destaque
- `tmsColors.cyanVibrant` - Cor de acento/info

### Bordas e Estados
- `tmsColors.borderSubtle` - Bordas sutis
- `tmsColors.cardBorder` - Bordas de cards
- `tmsColors.inputBorder` - Bordas de inputs
- `tmsColors.statusPending` - Status pendente
- `tmsColors.statusProgress` - Status em progresso
- `tmsColors.statusComplete` - Status concluído
- `tmsColors.warning` - Avisos
- `tmsColors.error` - Erros

### Gradientes
- `tmsColors.gradientBg` - Gradiente de background padrão
- `tmsColors.gradientLogin` - Gradiente da tela de login

## Padrão de Migração

### Antes (Hardcoded):
```tsx
<div 
  style={{
    backgroundColor: "#112240",
    color: "#e6f1ff",
    border: "1px solid rgba(100, 255, 218, 0.1)"
  }}
>
```

### Depois (Com tema):
```tsx
import { tmsColors } from "./ThemeProvider";

<div 
  style={{
    backgroundColor: tmsColors.navyMedium,
    color: tmsColors.textPrimary,
    border: `1px solid ${tmsColors.borderSubtle}`
  }}
>
```

## Componentes Atualizados

✅ App.tsx - Gerenciamento de tema  
✅ LoginScreen.tsx - Tela de login  
✅ HomeScreen.tsx - Tela inicial  
✅ SettingsScreen.tsx - Configurações  
✅ ScreenHeader.tsx - Header reutilizável  

## Componentes Pendentes

⏳ DashboardScreen.tsx  
⏳ SentSurveysScreen.tsx  
⏳ OSDetailsScreen.tsx  
⏳ EnvironmentSelectionScreen.tsx  
⏳ CaptureScreen.tsx  
⏳ ServiceCaptureScreen.tsx  
⏳ ReviewScreen.tsx  
⏳ SuccessScreen.tsx  

## Transições Suaves

Para transições suaves entre temas, adicione:

```tsx
style={{
  transition: "all 0.3s ease",
  backgroundColor: tmsColors.navyDeep,
  // ...outras props
}}
```

## Exemplos de Uso

### Card Interativo
```tsx
<div
  className="p-6 rounded-xl"
  style={{
    backgroundColor: tmsColors.cardBg,
    border: `1px solid ${tmsColors.borderSubtle}`,
  }}
>
  <h3 style={{ color: tmsColors.textPrimary }}>Título</h3>
  <p style={{ color: tmsColors.textSecondary }}>Descrição</p>
</div>
```

### Botão Primário
```tsx
<Button
  style={{
    backgroundColor: tmsColors.neonGreen,
    color: tmsColors.navyDeep,
  }}
>
  Ação Principal
</Button>
```

### Input com Foco
```tsx
<Input
  style={{
    backgroundColor: tmsColors.inputBg,
    borderColor: tmsColors.inputBorder,
    color: tmsColors.textPrimary,
  }}
  onFocus={(e) => {
    e.target.style.borderColor = tmsColors.neonGreen;
    e.target.style.boxShadow = `0 0 0 3px ${tmsColors.neonGreen}1a`;
  }}
  onBlur={(e) => {
    e.target.style.borderColor = tmsColors.inputBorder;
    e.target.style.boxShadow = "none";
  }}
/>
```

## Boas Práticas

1. **Sempre use `tmsColors`**: Nunca hardcode cores TMS
2. **Teste ambos os temas**: Verifique contraste e legibilidade
3. **Transições consistentes**: Use `transition: "all 0.3s ease"`
4. **Sombras adaptativas**: Use opacidade com hex (ex: `33` para 20%)
5. **Focus states**: Sempre adicione feedback visual de foco

## Debug

Para testar o tema:
1. Vá para Configurações
2. Toggle o switch "Modo Escuro/Claro"
3. Navegue entre telas para verificar consistência

## Notas Técnicas

- O tema persiste na sessão via estado React
- A classe `.dark` é aplicada no `<html>` via `document.documentElement`
- Variáveis CSS são reativas - mudanças são instantâneas
- Suporte a transições CSS nativas para performance
