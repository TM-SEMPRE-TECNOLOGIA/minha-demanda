Design System: TM – Sempre Tecnologia
Inspirado em: Aplicações Móveis Modernas
1. Introdução
O Design System TM é um conjunto abrangente de diretrizes, componentes e padrões de design que garante consistência visual, usabilidade e experiência do usuário em toda a aplicação TM. Este documento serve como referência única para designers, desenvolvedores                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          e stakeholders envolvidos no projeto.
2. Paleta de Cores
A paleta de cores do TM foi desenvolvida com foco em alto contraste, legibilidade em ambientes externos e redução de fadiga visual. O sistema suporta dois modos: Dark Mode (padrão) e Light Mode.
2.1 Modo Escuro (Dark Mode - Padrão)
O modo escuro é o padrão da aplicação, otimizado para uso em campo com iluminação variável.

Nome da Cor	Código Hex	Uso Principal	Variável CSS
Navy Deep	#0A1628	Background principal de todas as telas	--TM-navy-deep
Navy Medium	#112240	Background secundário, cards e containers	--TM-navy-medium
Navy Light	#1A365D	Bordas, divisores e elementos terciários	--TM-navy-light
Neon Green	#64FFDA	Títulos, destaques principais e elementos de ação	--TM-neon-green
Cyan Vibrant	#00D4FF	Acentos, informações e indicadores de status	--TM-cyan-vibrant
Text Primary	#E6F1FF	Texto principal e corpo de conteúdo	--TM-text-primary
Text Secondary	#8892B0	Texto secundário e muted	--TM-text-secondary
Text Emphasis	#64FFDA	Texto em destaque e ênfase	--TM-text-emphasis
2.2 Modo Claro (Light Mode)
O modo claro oferece uma alternativa para ambientes com iluminação controlada ou preferência do usuário.

Nome da Cor	Código Hex	Uso Principal	Variável CSS
Navy Deep	#F8F9FA	Background principal (invertido)	--TM-navy-deep
Navy Medium	#FFFFFF	Background secundário e cards	--TM-navy-medium
Navy Light	#E9ECEF	Bordas e elementos sutis	--TM-navy-light
Neon Green	#00A86B	Títulos e destaques (ajustado para contraste)	--TM-neon-green
Cyan Vibrant	#0088CC	Acentos e informações	--TM-cyan-vibrant
Text Primary	#212529	Texto principal	--TM-text-primary
Text Secondary	#6C757D	Texto secundário	--TM-text-secondary
Text Emphasis	#00A86B	Texto em destaque	--TM-text-emphasis
2.3 Cores de Status
As cores de status indicam o progresso e o estado de uma Ordem de Serviço ou tarefa.

Status	Código Hex	Uso	Variável CSS
Pendente	#00D4FF (dark) / #0088CC (light)	Tarefas aguardando início	--TM-status-pending
Em Progresso	#64FFDA (dark) / #00A86B (light)	Tarefas em execução	--TM-status-progress
Concluído	#64FFDA (dark) / #00A86B (light)	Tarefas finalizadas	--TM-status-complete
Aviso	#FFA500 (dark) / #FF8800 (light)	Alertas e avisos	--TM-warning
Erro	#FF6B6B (dark) / #DC3545 (light)	Erros e estados críticos	--TM-error
2.4 Cores de Componentes
Elemento	Dark Mode	Light Mode	Variável CSS
Borda Sutil	rgba(100, 255, 218, 0.1)	rgba(0, 0, 0, 0.1)	--TM-border-subtle
Background de Card	rgba(17, 34, 64, 0.5)	rgba(255, 255, 255, 0.9)	--TM-card-bg
Borda de Card	rgba(100, 255, 218, 0.1)	rgba(0, 168, 107, 0.2)	--TM-card-border
Background de Input	#0A1628	#FFFFFF	--TM-input-bg
Borda de Input	#1A365D	#CED4DA	--TM-input-border
2.5 Gradientes
Gradiente	Definição	Uso	Variável CSS
Background Padrão	linear-gradient(180deg, #0A1628 0%, #112240 50%, #0A1628 100%)	Backgrounds de telas principais	--TM-gradient-bg
Login	linear-gradient(180deg, #0A1628 0%, #112240 50%, #1A365D 100%)	Tela de login e autenticação	--TM-gradient-login
3. Tipografia
A tipografia do TM utiliza três famílias de fontes para criar hierarquia visual clara e legibilidade otimizada.
3.1 Famílias de Fontes
Família	Uso	Pesos Disponíveis	Variável CSS
Exo 2	Títulos e headings	400, 600, 700	--font-heading
Inter	Corpo de texto e UI	400, 500, 600	--font-body
Roboto Mono	Código e dados técnicos	400, 500	--font-mono
3.2 Escala de Tipografia
A escala de tipografia segue uma progressão consistente para criar hierarquia visual clara.

Elemento	Tamanho	Peso	Line Height	Letter Spacing	Uso
H1 (Título Principal)	32px	700	1.3	-0.02em	Títulos de página e seções principais
H2 (Subtitle)	24px	600	1.4	-0.01em	Subtítulos e seções secundárias
H3 (Section Title)	18px	600	1.4	-0.01em	Títulos de cards e subsections
H4 (Label)	16px	600	1.5	0	Labels de formulários e cards
Body (Padrão)	16px	400	1.6	0	Corpo de texto principal
Body Small	14px	400	1.6	0	Texto secundário e descrições
Caption	12px	400	1.4	0	Captions e metadados
Code	14px	400	1.5	0.02em	Código e dados técnicos
3.3 Utilidades de Tipografia
Classes CSS disponíveis para aplicar estilos tipográficos:

.font-heading     /* Aplica Exo 2 */

.font-body        /* Aplica Inter */

.font-mono        /* Aplica Roboto Mono */

.TM-code         /* Estilo para código: Roboto Mono, peso 400, letter-spacing 0.02em */

.TM-title        /* Estilo para título: Exo 2, peso 700, letter-spacing -0.02em */

.TM-subtitle     /* Estilo para subtitle: Exo 2, peso 600, letter-spacing -0.01em */
4. Componentes
4.1 Botões
Os botões do TM seguem uma hierarquia clara com três níveis de importância.
Botão Primário
Usado para ações principais e críticas (ex: Confirmar, Salvar, Enviar).

Especificações:

-	Background: #64FFDA (dark) / #00A86B (light)
-	Texto: #0A1628 (dark) / #FFFFFF (light)
-	Hover: #00D4FF (dark) / #008855 (light)
-	Padding: 12px 24px
-	Border Radius: 8px
-	Fonte: Inter, 600, 14px
-	Label: SEMPRE em UPPERCASE
-	Ícone: À esquerda do texto (opcional)
Botão Secundário
Usado para ações auxiliares e menos críticas (ex: Cancelar, Voltar).

Especificações:

-	Border: 2px #64FFDA (dark) / #00A86B (light)
-	Texto: #64FFDA (dark) / #00A86B (light)
-	Background: Transparente
-	Padding: 12px 24px
-	Border Radius: 8px
-	Fonte: Inter, 600, 14px
-	Label: SEMPRE em UPPERCASE
Botão Terciário
Usado para ações contextuais e menos importantes (ex: Links, Mais opções).

Especificações:

-	Background: Transparente
-	Texto: #00D4FF (dark) / #0088CC (light)
-	Padding: 8px 12px
-	Border Radius: 4px
-	Fonte: Inter, 500, 14px
-	Sem ícone obrigatório
4.2 Cards
Os cards são containers reutilizáveis para agrupar informações relacionadas.

Especificações:

-	Background: --TM-card-bg
-	Border: 1px --TM-card-border
-	Padding: 16px
-	Border Radius: 8px
-	Sombra: 0 2px 8px rgba(0, 0, 0, 0.15) (dark)
-	Título: H3 em --TM-text-primary
-	Descrição: Body em --TM-text-secondary
4.3 Inputs e Campos de Formulário
Input de Texto
Especificações:

-	Background: --TM-input-bg
-	Border: 1px --TM-input-border
-	Padding: 12px 16px
-	Border Radius: 8px
-	Fonte: Inter, 400, 14px
-	Focus: Border #64FFDA, Box Shadow 0 0 0 3px rgba(100, 255, 218, 0.1)
-	Error: Border #FF6B6B
-	Label: Sempre visível, nunca apenas placeholder
Checkbox
Especificações:

-	Tamanho: 18x18px
-	Border: 2px --TM-input-border
-	Checked Background: #64FFDA
-	Border Radius: 4px
-	Ícone Check: #0A1628
Radio Button
Especificações:

-	Tamanho: 18x18px
-	Border: 2px --TM-input-border
-	Selected Background: #64FFDA
-	Border Radius: 50%
-	Inner Dot: #0A1628, 8x8px
4.4 Indicadores de Status
Os indicadores de status fornecem feedback visual sobre o estado de uma tarefa ou elemento.

Status	Cor	Ícone	Uso
Pendente	#00D4FF	⏳	Aguardando ação
Em Progresso	#64FFDA	⚙️	Em execução
Concluído	#64FFDA	✓	Finalizado
Erro	#FF6B6B	✕	Falha ou problema
Aviso	#FFA500	⚠️	Atenção necessária
5. Padrões de Layout
5.1 Espaçamento
O TM utiliza uma escala de espaçamento baseada em 8px para garantir consistência.

Escala	Valor	Uso
xs	4px	Espaçamento mínimo entre elementos
sm	8px	Espaçamento padrão entre componentes
md	16px	Espaçamento entre seções
lg	24px	Espaçamento entre grupos de seções
xl	32px	Espaçamento entre áreas principais
2xl	48px	Espaçamento máximo entre blocos
5.2 Grid e Flexbox
Recomendações:

-	Priorizar Flexbox para layouts lineares e responsivos
-	Usar CSS Grid para layouts complexos e multi-coluna
-	Evitar position: absolute - usar Flexbox/Grid em seu lugar
-	Layouts devem ser responsivos e adaptar-se a diferentes tamanhos de tela
5.3 Breakpoints
Breakpoint	Largura	Uso
Mobile	320px - 640px	Smartphones
Tablet	641px - 1024px	Tablets
Desktop	1025px+	Computadores
5.4 Padrões de Página
Padrão Linear (Fluxo Principal)
O fluxo principal segue uma progressão linear de etapas claras e definidas (ex: Início → Meio → Fim).

Estrutura:

1.	Header com título e ações
2.	Conteúdo principal (cards, formulários, listas)
3.	Footer com botões de ação (Próximo, Voltar, Enviar)
Padrão de Card Grid
Usado para exibir múltiplos cards em grid (ex: Listas de Itens, Galerias).

Especificações:

-	Grid: 1 coluna (mobile), 2 colunas (tablet), 3+ colunas (desktop)
-	Gap: 16px entre cards
-	Card Width: 100% do container
-	Altura: Auto ou consistente conforme conteúdo
Padrão de Formulário
Usado para coleta de dados (ex: Login, Cadastros, Entradas).

Especificações:

-	Campos em coluna única (mobile/tablet) ou 2 colunas (desktop)
-	Label acima do input
-	Espaçamento entre campos: 16px
-	Validação em tempo real com feedback visual
-	Botão submit no final do formulário
6. Ícones
O TM utiliza ícones da biblioteca Lucide para consistência visual.
6.1 Tamanhos de Ícone
Tamanho	Dimensão	Uso
xs	16px	Ícones inline em texto
sm	20px	Ícones em botões pequenos
md	24px	Ícones padrão em buttons e cards
lg	32px	Ícones em headers e destaque
xl	48px	Ícones em banners e seções principais
6.2 Ícones Principais
Ícone	Nome Lucide	Uso
📋	ClipboardList	Listas de tarefas, itens
📸	Camera	Captura de imagem
✓	Check	Conclusão, sucesso
✕	X	Cancelar, fechar, erro
←	ChevronLeft	Voltar, navegação anterior
→	ChevronRight	Próximo, navegação seguinte
⚙️	Settings	Configurações
📊	BarChart3	Dashboard, estatísticas
🏠	Home	Página inicial
🔐	Lock	Segurança, login
7. Acessibilidade
7.1 Contraste de Cores
Todas as combinações de cores devem atender ao mínimo de 4.5:1 de contraste (WCAG AA).

Combinações Validadas:

-	Navy Deep (#0A1628) + Neon Green (#64FFDA): 15.8:1 ✓
-	Navy Deep (#0A1628) + Cyan Vibrant (#00D4FF): 12.4:1 ✓
-	Navy Deep (#0A1628) + Text Primary (#E6F1FF): 14.2:1 ✓
-	Navy Medium (#112240) + Neon Green (#64FFDA): 14.1:1 ✓
7.2 Focus States
Todos os elementos interativos devem ter um estado de foco visível:

:focus {

  outline: 2px solid #64FFDA;

  outline-offset: 2px;

}
7.3 Texto Alternativo
-	Todos os ícones devem ter aria-label descritivo
-	Imagens devem ter alt text significativo
-	Botões devem ter texto visível ou aria-label
7.4 Estrutura Semântica
-	Usar tags HTML semânticas (<button>, <input>, <label>, etc.)
-	Manter ordem lógica de tab
-	Usar <fieldset> e <legend> para grupos de formulário
8. Animações e Transições
8.1 Duração Padrão
Tipo	Duração	Easing
Rápida	150ms	ease-in-out
Padrão	300ms	ease-in-out
Lenta	500ms	ease-in-out
8.2 Transições Recomendadas
/* Transição de cor */

transition: background-color 300ms ease-in-out, color 300ms ease-in-out;

/* Transição de tema */

transition: all 300ms ease-in-out;

/* Transição de hover */

transition: transform 150ms ease-in-out, box-shadow 150ms ease-in-out;
8.3 Restrições
-	Evitar animações em modo de redução de movimento (prefers-reduced-motion)
-	Não usar animações em elementos críticos de navegação
-	Manter animações suaves e não distratoras
9. Responsividade
9.1 Princípios Mobile-First
O design deve começar com mobile (320px) e escalar para telas maiores.

Estratégia:

1.	Layout simples em mobile (1 coluna)
2.	Expandir para 2 colunas em tablet
3.	Expandir para 3+ colunas em desktop
9.2 Elementos Responsivos
Elemento	Mobile	Tablet	Desktop
Padding	12px	16px	24px
Font Size	14px	16px	16px
Grid Columns	1	2	3+
Card Width	100%	48%	30%
10. Temas e Modos
10.1 Alternância de Tema
O aplicativo suporta alternância entre Dark Mode e Light Mode via Menu de Configurações.

Implementação:

-	Estado React: theme: "dark" | "light"
-	Classe HTML: .dark aplicada no <html>
-	Variáveis CSS reativas: Mudam automaticamente com a classe
10.2 Persistência de Tema
O tema selecionado persiste na sessão do usuário e pode ser armazenado em localStorage para persistência entre sessões.
11. Boas Práticas
11.1 Para Designers
-	Sempre usar a paleta TM definida
-	Testar contraste em ambos os modos (dark/light)
-	Usar grid de 8px para alinhamento
-	Manter consistência com componentes existentes
-	Documentar novos componentes ou padrões
11.2 Para Desenvolvedores
-	Usar variáveis CSS (--TM-*) em vez de hardcoding cores
-	Aplicar transições suaves (transition: all 300ms ease-in-out)
-	Testar responsividade em múltiplos breakpoints
-	Implementar focus states para acessibilidade
-	Validar contraste de cores antes de merge
11.3 Para Product Managers
-	Revisar designs contra este Design System
-	Garantir que novos recursos seguem os padrões
-	Comunicar mudanças de design para toda a equipe
-	Manter este documento atualizado
12. Referência Rápida de Variáveis CSS
/* Backgrounds */

--TM-navy-deep: #0A1628

--TM-navy-medium: #112240

--TM-navy-light: #1A365D

/* Cores Primárias */

--TM-neon-green: #64FFDA

--TM-cyan-vibrant: #00D4FF

/* Textos */

--TM-text-primary: #E6F1FF

--TM-text-secondary: #8892B0

--TM-text-emphasis: #64FFDA

/* Status */

--TM-status-pending: #00D4FF

--TM-status-progress: #64FFDA

--TM-status-complete: #64FFDA

--TM-warning: #FFA500

--TM-error: #FF6B6B

/* Componentes */

--TM-border-subtle: rgba(100, 255, 218, 0.1)

--TM-card-bg: rgba(17, 34, 64, 0.5)

--TM-card-border: rgba(100, 255, 218, 0.1)

--TM-input-bg: #0A1628

--TM-input-border: #1A365D

/* Tipografia */

--font-heading: "Exo 2", sans-serif

--font-body: "Inter", sans-serif

--font-mono: "Roboto Mono", monospace

/* Gradientes */

--TM-gradient-bg: linear-gradient(180deg, #0A1628 0%, #112240 50%, #0A1628 100%)

--TM-gradient-login: linear-gradient(180deg, #0A1628 0%, #112240 50%, #1A365D 100%)
13. Versão e Histórico
Versão	Data	Alterações
1.0	Nov 2025	Documento inicial com paleta, tipografia, componentes e padrões

________________________________________

Documento Preparado por: Thiago Nascimento Barbosa
Última Atualização: 11 de Novembro de 2025
Status: Ativo e em uso

