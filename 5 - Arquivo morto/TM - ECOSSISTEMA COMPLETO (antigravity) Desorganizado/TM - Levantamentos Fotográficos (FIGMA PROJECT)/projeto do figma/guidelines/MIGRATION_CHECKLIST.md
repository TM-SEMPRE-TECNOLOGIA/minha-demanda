# Checklist de Migração para Sistema de Tema Unificado

## Status da Migração

### ✅ Concluído

- [x] **App.tsx** - Sistema de controle de tema implementado com useEffect
- [x] **LoginScreen.tsx** - Migrado para usar `tmsColors`
- [x] **HomeScreen.tsx** - Migrado para usar `tmsColors`
- [x] **SettingsScreen.tsx** - Migrado para usar `tmsColors` (inclui toggle de tema)
- [x] **DashboardScreen.tsx** - Lista de Ordens de Serviço migrada
- [x] **ScreenHeader.tsx** - Componente helper criado
- [x] **ThemeProvider.tsx** - Helper de cores criado
- [x] **globals.css** - Variáveis CSS TMS adicionadas para light e dark mode
- [x] **OSDetailsScreen.tsx** - Detalhes da Ordem de Serviço
- [x] **EnvironmentSelectionScreen.tsx** - Seleção de ambientes
- [x] **SentSurveysScreen.tsx** - Histórico de levantamentos
- [x] **CaptureScreen.tsx** - Captura de fotos por ambiente
- [x] **ServiceCaptureScreen.tsx** - Captura de fotos de serviços
- [x] **ReviewScreen.tsx** - Revisão final do levantamento
- [x] **SuccessScreen.tsx** - Confirmação de envio

### 🎉 Migração Completa!

Todos os componentes da aplicação foram migrados com sucesso para o sistema de tema unificado. O aplicativo agora suporta completamente os modos claro e escuro em todas as telas.

## Guia Rápido de Substituição

### Passo 1: Importar o helper
```tsx
import { tmsColors } from "./ThemeProvider";
```

### Passo 2: Substituir cores comuns

| Cor Hardcoded | Variável TMS | Uso |
|---------------|--------------|-----|
| `#0a192f` | `tmsColors.navyDeep` | Background principal |
| `#112240` | `tmsColors.navyMedium` | Background secundário/cards sticky |
| `#1a365d` | `tmsColors.navyLight` | Borders, backgrounds terciários |
| `#64ffda` | `tmsColors.neonGreen` | Cor primária, botões, destaques |
| `#00d4ff` | `tmsColors.cyanVibrant` | Cor de acento, info |
| `#e6f1ff` | `tmsColors.textPrimary` | Texto principal |
| `#8892b0` | `tmsColors.textSecondary` | Texto secundário/muted |
| `rgba(17, 34, 64, 0.5)` | `tmsColors.cardBg` | Background de cards |
| `rgba(100, 255, 218, 0.1)` | `tmsColors.borderSubtle` | Bordas sutis |

### Passo 3: Substituir gradientes
```tsx
// Antes:
background: "linear-gradient(180deg, #0a192f 0%, #112240 50%, #0a192f 100%)"

// Depois:
background: tmsColors.gradientBg
```

### Passo 4: Ajustar sombras
```tsx
// Antes:
boxShadow: "0 0 20px rgba(100, 255, 218, 0.5)"

// Depois:
boxShadow: `0 0 20px ${tmsColors.neonGreen}80`
```

## Padrões de Componentes

### Header Padrão
Use o componente `ScreenHeader`:
```tsx
import { ScreenHeader } from "./ScreenHeader";

<ScreenHeader 
  title="Título da Tela"
  subtitle="Descrição opcional"
  onBack={handleBack}
/>
```

### Card Interativo
```tsx
<div
  className="p-6 rounded-xl transition-all duration-200"
  style={{
    backgroundColor: tmsColors.cardBg,
    border: `1px solid ${tmsColors.borderSubtle}`,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = tmsColors.neonGreen;
    e.currentTarget.style.boxShadow = `0 0 20px ${tmsColors.neonGreen}33`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = tmsColors.borderSubtle;
    e.currentTarget.style.boxShadow = "none";
  }}
>
```

### Input com Estados
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

### Botão Primário
```tsx
<Button
  style={{
    backgroundColor: tmsColors.neonGreen,
    color: tmsColors.navyDeep,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = `0 0 20px ${tmsColors.neonGreen}80`;
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
```

## Verificação Final

Após migrar cada componente, verificar:

- [ ] Importou `tmsColors` do ThemeProvider
- [ ] Substituiu todas as cores hardcoded
- [ ] Testou no modo dark
- [ ] Testou no modo light
- [ ] Verificou contraste de texto
- [ ] Verificou estados hover/focus
- [ ] Adicionou transições suaves onde apropriado
- [ ] Verificou sombras e gradientes

## Testando a Migração

1. Abra o aplicativo
2. Navegue para Configurações
3. Alterne entre modo claro e escuro
4. Navegue para o componente migrado
5. Verifique:
   - Todas as cores mudaram apropriadamente
   - Contraste adequado em ambos os modos
   - Transições suaves
   - Estados interativos funcionando
   - Sem cores hardcoded visíveis

## Notas Importantes

- **Não modifique** os componentes UI do ShadCN em `/components/ui/`
- **Mantenha** a estrutura e classes Tailwind existentes
- **Adicione** apenas os imports e substituições de cor
- **Teste** em ambos os temas antes de marcar como concluído
- **Documente** qualquer problema encontrado durante a migração