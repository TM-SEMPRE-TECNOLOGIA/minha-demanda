# Relatório de Análise de Produto/UX — AutoRelatório V1_Dev

**Analista:** Especialista em Produto/UX para ferramentas de engenharia/construção civil  
**Data:** 28/06/2026  
**Versão analisada:** V1_Dev (em produção, funcionando)  
**Contexto:** V5 tentou "profissionalizar" com 9 engines, registry pattern, 3-step wizard, preview panel — mas quebrou features essenciais.

---

## Sumário Executivo

O V1_Dev é a ferramenta **certa para o problema certo**. Ela resolve um gargalo operacional real (gerar relatórios fotográficos de vistoria) com a **mínima complexidade possível**. O V5 tentou adicionar arquitetura de software "profissional" que o usuário final **não pediu e não precisa**.

**Principal achado:** O V1_Dev já está a 80% do caminho da experiência ideal de "gerenciador de arquivos". Os 20% restantes são polimentos de UX (não arquiteturais).

---

## 1. Fluxo de Usuário do V1_Dev — Mapeamento de Cliques

### Mapa de jornada atual (passo a passo contado)

| # | Ação do usuário | Tipo de interação | Cliques |
|---|----------------|-------------------|---------|
| 1 | Iniciar `run.py` (duplo clique ou terminal) | Sistema | 1 |
| 2 | Browser abre em `localhost:3000` | Automático | 0 |
| 3 | Clicar "Configurar Origem" abre seletor de pasta nativo do Windows | Clique + clique no diálogo nativo | 2 |
| 4 | Caminho aparece no input (read-only) | Automático | 0 |
| 5 | Clicar "Iniciar Varredura" → varre as pastas | Clique | 1 |
| 6 | Preview grid exibe estrutura com thumbnails | Automático | 0 |
| 7 | Opcional: Abrir step "Modelo DOCX" → selecionar template | Clique + clique no dropdown | 2 |
| 8 | Opcional: Abrir step "Parâmetros" → selecionar descrição | Clique + clique no dropdown | 2 |
| 9 | Clicar "Gerar Relatório" | Clique | 1 |
| 10 | Clicar "Baixar Relatório" (ou "Abrir Saída") | Clique | 1 |

**Total mínimo de cliques para gerar um relatório:** **7-11 cliques**  
**Total de telas visitadas:** 1 (single-page)  
**Tempo estimado para primeira execução:** ~30 segundos (após setup inicial)

### O que poderia ser simplificado (mesmo no V1_Dev):

1. **Input Read-Only + Botão "Configurar Origem" é redundante.** O input não pode ser editado e tem um ícone de pasta ao lado — e abaixo tem o mesmo botão. Isso confunde: o usuário tenta clicar no input (não funciona, é read-only) e precisa achar o botão abaixo.
2. **3 steps expansíveis vs. wizard sequencial.** O accordion de 4 steps (Diretório, Modelo, Parâmetros, Visualização) não força uma ordem — o usuário pode pular. Mas as labels "PRÓXIMA ETAPA" sugerem fluxo linear. Há dissonância cognitiva.
3. **Tipo de relatório (Tradicional vs Organizado SP) enterrado no Step 1.** É uma decisão **crítica** que define o JSON de saída inteiro. Deveria ser mais proeminente.

---

## 2. O Que o V5 Tem Que Realmente Agrega Valor (e V1_Dev Não Tem)

Após analisar o V1_Dev profundamente, estas são as features que valeriam a pena **incorporar de volta**:

| Feature V5 | Valor real | Risco |
|------------|-----------|-------|
| **Upload de template .docx pela UI** (drag-and-drop) | ALTO — hoje o usuário precisa copiar manualmente o .docx na pasta `templates/`. Elimina atrito. | Baixo |
| **Drag-and-drop de imagens no preview** para reordenar antes de gerar | MÉDIO-ALTO — hoje a ordem é a do filesystem. Se o fotógrafo tirou fora de ordem, não tem como corrigir sem renomear arquivos. | Médio (complexidade UI) |
| **Abrir pasta de saída automaticamente após geração** | MÉDIO — hoje o usuário precisa clicar "Abrir Saída". Poderia abrir automático. | Baixo |
| **Feedback visual de progresso durante geração** (barra de progresso real vs. spinner) | MÉDIO — o ConsoleWatcher mostra logs, mas não há indicador de % ou "imagem 15 de 47". | Baixo |
| **Arrumei um atalho de teclado (Ctrl+Enter para gerar)** | BAIXO-MÉDIO — produtividade para power users. | Muito baixo |

**Nenhuma dessas features justifica a arquitetura de 9 engines + registry pattern do V5.** Todas podem ser implementadas incrementalmente no V1_Dev.

---

## 3. O Que o V5 Tem Que Só Atrapalha (Complexidade Sem Retorno)

Baseado na descrição do contexto e no contraste com o V1_Dev:

### ❌ 9 "Engines" Isoladas
Cada engine sendo um módulo independente com ciclo de vida próprio. O V1_Dev tem **2 modos** (tradicional e SP) que compartilham 80% do código (`generator.py` e `generator_sp.py` compartilham `server.py`, `word_utils.py`, templates). Isso é o **suficiente**.

### ❌ Registry Pattern / Factory Pattern
Abstrações para "registrar engines dinamicamente" que o usuário nunca vê. O V1_Dev simplesmente faz `if tipo == "sp": import generator_sp`. Sem IOC, sem DI, sem Service Locator. Funciona perfeitamente.

### ❌ 3-Step Wizard Complexo
O V1_Dev tem um accordion de 4 steps que já entrega o mesmo resultado. Se o V5 tem um wizard modal com "Anterior/Próximo" que força o usuário a seguir uma ordem linear, isso **piora** a UX — o usuário quer poder pular entre configurações livremente.

### ❌ Preview Panel como aba separada
No V1_Dev, o preview fica do lado direito **na mesma tela** que o wizard. Isso é superior: o usuário vê as mudanças em tempo real sem trocar de aba.

### ❌ Gerenciamento de Estado Global (Redux/Zustand)
Para uma ferramenta com ~6 variáveis de estado (`pastaRaiz`, `modelo`, `conteudo`, `logs`, `loading`, `docGerado`), usar um state manager pesado é overengineering. O V1_Dev usa `useState` puro e funciona perfeitamente.

---

## 4. Como Tornar a Experiência "Simples Como um Gerenciador de Arquivos"

O usuário pediu: *"quero abrir uma pasta, ver minhas fotos, e gerar um relatório. Simples como arrastar arquivos no Explorer."*

### Princípios de Design:

1. **A pasta é o centro.** Não há "configuração" — você abre a pasta de fotos e a ferramenta entende a estrutura.
2. **Zero configuração inicial.** Tipo de relatório deve ser inferido automaticamente (se há nomes com "3,10 x 2,95" → modo SP, senão → tradicional).
3. **Template padrão inteligente.** Último template usado ou template mais recente na pasta.
4. **Preview = o relatório.** O que você vê no grid é exatamente o que será gerado. Se está bom, clique "Gerar". Se não, arraste pastas/arquivos para reordenar.
5. **Feedback instantâneo.** Cada ação (escanear, gerar, baixar) leva <2s. Se demorar mais, mostrar progresso real.

### Redesign de fluxo proposto:

```
FLUXO ATUAL (V1_Dev):                          FLUXO PROPOSTO (V5 Simplificado):

1. Abrir app (run.py)                           1. Abrir app
2. Clicar "Configurar Origem"                   2. Arrastar pasta para a janela
3. Navegar no seletor de pastas                    OU clicar "Abrir Pasta"
4. Clicar "Iniciar Varredura"                   3. Preview aparece automaticamente
5. (esperar scan)                               4. (conferir, reordenar arrastando)
6. Abrir step "Modelo DOCX"                     5. Clicar "Gerar Relatório"
7. Selecionar template                          6. Relatório salvo + pasta abre
8. Abrir step "Parâmetros"
9. Selecionar descrição
10. Clicar "Gerar Relatório"
11. Clicar "Baixar Relatório"

11 passos → 5 passos (redução de 55%)
7-11 cliques → 2-3 cliques
```

---

## 5. Sugestão de Wireframes — "V5 Simplificado"

### Wireframe 1: Tela Principal (Janela Única)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔷 AutoRelatório v2.0                          [≡] [×]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  📂 ARRASTE UMA PASTA AQUI                          │   │
│   │      ou clique para selecionar                      │   │
│   │                                                      │   │
│   │  [Última: C:\Vistorias\Janeiro2026]                  │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌────────────────────────┐  ┌────────────────────────┐   │
│   │  📁 Área externa       │  │  📁 Área interna       │   │
│   │  🖼️ 12 fotos           │  │  🖼️ 8 fotos            │   │
│   │  📐 Com medidas        │  │  📐 Com medidas        │   │
│   ├────────────────────────┤  ├────────────────────────┤   │
│   │  🖼️🖼️🖼️🖼️              │  │  🖼️🖼️🖼️🖼️              │   │
│   │  🖼️🖼️🖼️🖼️              │  │  🖼️🖼️🖼️🖼️              │   │
│   │  🖼️🖼️🖼️🖼️              │  │  🖼️🖼️🖼️🖼️              │   │
│   └────────────────────────┘  └────────────────────────┘   │
│                                                             │
│   [📄 Modelo: MODELO-1507.docx ▼]                          │
│   [📝 Descrição: Descrição 1 ▼]                            │
│                                                             │
│   [            🚀 GERAR RELATÓRIO            ]  ↓2s        │
│                                                             │
│   Último relatório: RELATÓRIO FOTOGRÁFICO - ... [📂 Abrir] │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- **Drag-and-drop Zone** como entrada principal (substitui o seletor de pasta modal)
- **Mini-grid de pastas** com contagem de fotos (vs. grid plano de thumbnails)
- **Configurações inline** (template + descrição) em uma barra fina, não em steps expansíveis
- **Botão "Gerar" sempre visível** com estimativa de tempo

---

### Wireframe 2: Preview Detalhado (Após Scan)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔷 AutoRelatório v2.0  ←  Voltar para pasta               │
├─────────────────────────────────────────────────────────────┤
│ 📁 Área externa  (12 fotos)        ⏱ Scan: 0.8s           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🏠 Vista ampla                                              │
│ ┌────┬────┬────┐                                            │
│ │🖼️  │🖼️  │🖼️  │   ← Arraste para reordenar               │
│ ├────┼────┼────┤                                            │
│ │🖼️  │🖼️  │    │                                            │
│ └────┴────┴────┘                                            │
│                                                             │
│ 🚪 Sala 1 - Pintura                                        │
│ 📐 3,10 x 2,95 - Desconto 1,89m² = 7,26m²                 │
│ ┌────┬────┬────┐                                            │
│ │🖼️  │🖼️  │    │                                            │
│ └────┴────┴────┘                                            │
│ ✔️ Tabela de pintura gerada automaticamente                 │
│                                                             │
│ 🔍 Detalhes 1                                               │
│ ┌────┬────┐                                                  │
│ │🖼️  │🖼️  │                                                  │
│ └────┴────┘                                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 📄 MODELO-1507.docx  📝 Desc 1  [🚀 GERAR]                 │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- Visualização estruturada **igual ao relatório final** (não um grid genérico)
- Títulos de seção com ícones contextuais
- Informações de medição já visíveis no preview (parsing de nome de arquivo)
- **Drag para reordenar** fotos e seções
- Status de cada seção (✔️ tabela gerada, ⚠️ sem medidas, etc.)

---

### Wireframe 3: Gerando (Feedback de Progresso)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔷 AutoRelatório v2.0                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  🚀 GERANDO RELATÓRIO...                           │   │
│   │                                                     │   │
│   │  ███████████████░░░░░░░░░░  15/47 imagens (32%)    │   │
│   │                                                     │   │
│   │  📸 Inserindo: foto_15.jpg                          │   │
│   │  📐 Calculando tabela de pintura...                 │   │
│   │  📝 Inserindo descrição técnica...                  │   │
│   │                                                     │   │
│   │  ⏱ Tempo estimado: 12 segundos                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- Barra de progresso real (não spinner genérico)
- Contagem "N de M" + percentual
- Última ação sendo executada em texto
- Tempo estimado
- **Não trava a UI** — usuário pode minimizar e continuar trabalhando

---

### Wireframe 4: Relatório Pronto

```
┌─────────────────────────────────────────────────────────────┐
│ 🔷 AutoRelatório v2.0                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  ✅ RELATÓRIO GERADO COM SUCESSO                    │   │
│   │                                                     │   │
│   │  📄 RELATÓRIO FOTOGRÁFICO - VIRGOLANDIA -          │   │
│   │      LEVANTAMENTO PREVENTIVO.docx                   │   │
│   │                                                     │   │
│   │  🖼️ 47 imagens inseridas                            │   │
│   │  📐 12 tabelas de pintura                           │   │
│   │  📝 4 descrições técnicas                            │   │
│   │  ⏱ 8 segundos                                       │   │
│   │                                                     │   │
│   │  [📂 Abrir Pasta]  [⬇ Baixar]  [🔄 Novo]          │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   Últimos relatórios:                                       │
│   📄 RELATÓRIO - VIRGOLANDIA - 08/06/2026                  │
│   📄 RELATÓRIO - ITAIPAVA - 05/06/2026                     │
│   📄 RELATÓRIO - RESENDE - 02/06/2026                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- Resumo executivo pós-geração (imagens, tabelas, tempo)
- Ações primárias (Abrir, Baixar) em destaque
- **Histórico de relatórios gerados** na mesma sessão
- Botão "Novo" para reset rápido

---

### Wireframe 5: Modo Power User (Atalhos de Teclado)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔷 AutoRelatório v2.0                      ⌨ Atalhos       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Atalhos disponíveis:                                       │
│                                                             │
│  Ctrl + O     → Abrir pasta                                 │
│  Ctrl + Shift + S → Scan                                    │
│  Ctrl + Enter → Gerar relatório                             │
│  Ctrl + D     → Baixar                                      │
│  Ctrl + R     → Reset                                       │
│                                                             │
│  (Dica: Pressione ? a qualquer momento para ver essa tela)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- Acessível via `?` ou menu de ajuda
- Não polui a tela principal
- Reduz drasticamente o tempo para power users
- Indicadores sutis nos botões (ex: "Gerar [Ctrl+Enter]")

---

## Recomendações Acionáveis — Roadmap

### Imediatas (1-2 dias, sem quebrar nada):
1. ✅ **Auto-detect de tipo de relatório** — se arquivos têm "x" no nome, usar modo SP
2. ✅ **Auto-select do template mais recente** (não precisa forçar clique)
3. ✅ **Trocar input read-only + botão duplicado por um único botão "📂 Selecionar Pasta"**
4. ✅ **Abrir pasta de saída automaticamente** após geração bem-sucedida
5. ✅ **Adicionar tooltip "Ctrl+Enter" nos botões principais**

### Curtas (3-5 dias):
1. 📋 **Drag-and-drop de pasta** na zona principal (vs. seletor modal)
2. 📋 **Barra de progresso real com N/M imagens** (substituir spinner)
3. 📋 **Upload de template .docx pela UI** (drag-and-drop na lista de templates)

### Médias (1-2 semanas):
1. 🖼️ **Reorder de imagens por drag-and-drop no preview**
2. 🖼️ **Histórico de relatórios** na tela de sucesso
3. 🖼️ **Modo escuro** (pedido comum em ferramentas de uso prolongado)

### Despriorizado (NÃO FAZER):
- ❌ **Registry pattern / engine isoladas** — zero valor para o usuário
- ❌ **State management global** — useState resolve
- ❌ **3-step wizard modal** — o accordion lateral é superior
- ❌ **Abas separadas** — tudo na mesma tela é melhor
- ❌ **Preview panel destacado do fluxo** — preview deve ser o fluxo

---

## Conclusão

O V1_Dev é **a base certa**. Ele resolve o problema real com a arquitetura mínima necessária. O erro do V5 foi tentar "profissionalizar" a arquitetura de software (engines, registry, patterns) em vez de profissionalizar a **experiência do usuário**.

**O V5 simplificado = V1_Dev + (~5 features de UI focadas) + (0 mudanças arquiteturais).**

Não reescreva o motor. Apenas polia a cabine do motorista.

---

*Anexo técnico: todos os endpoints e componentes analisados estão documentados no código-fonte em `C:\Users\thiag\Desktop\Minha Demanda\1 - Preventivas 2026\01 - Apoio operacional\AutoRelatorioV1_Dev\`*
