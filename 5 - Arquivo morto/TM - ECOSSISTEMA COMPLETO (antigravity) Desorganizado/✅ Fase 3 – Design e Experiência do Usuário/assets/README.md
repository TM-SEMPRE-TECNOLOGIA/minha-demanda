# Assets - MAFFENG TM Gerenciador

Esta pasta contém todos os recursos visuais estáticos utilizados no projeto.

## Estrutura

```
assets/
├── icons/          # Ícones SVG personalizados
└── images/         # Imagens, mockups e screenshots
```

## 📁 Icons

Armazene aqui ícones personalizados em formato SVG.

**Convenções de nomenclatura:**
- Use kebab-case: `icon-name.svg`
- Seja descritivo: `user-avatar.svg`, `check-circle.svg`
- Prefixe por categoria se necessário: `nav-dashboard.svg`

**Exemplo de uso:**
```html
<img src="../assets/icons/user-avatar.svg" alt="Avatar do usuário">
```

## 🖼️ Images

Armazene aqui imagens, mockups, screenshots e outros recursos visuais.

**Subpastas sugeridas:**
- `mockups/` - Mockups de telas
- `screenshots/` - Screenshots de funcionalidades
- `logos/` - Variações do logo
- `backgrounds/` - Imagens de fundo

**Formatos recomendados:**
- **PNG** - Para imagens com transparência
- **JPG** - Para fotos e imagens sem transparência
- **SVG** - Para gráficos vetoriais
- **WebP** - Para otimização de performance (quando possível)

**Otimização:**
- Comprima imagens antes de adicionar ao projeto
- Use dimensões apropriadas (não maior que o necessário)
- Considere usar lazy loading para imagens grandes

## 🎨 Ícones do Projeto

O projeto utiliza **Phosphor Icons** via CDN:
```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<i class="ph ph-user"></i>
```

Ícones personalizados devem ser adicionados à pasta `icons/` apenas quando não disponíveis no Phosphor Icons.

## 📝 Notas

- Mantenha os arquivos organizados e nomeados de forma consistente
- Documente qualquer asset complexo ou específico
- Evite duplicação de recursos
- Considere versionamento para assets críticos

---

**Última atualização:** Novembro 2025
