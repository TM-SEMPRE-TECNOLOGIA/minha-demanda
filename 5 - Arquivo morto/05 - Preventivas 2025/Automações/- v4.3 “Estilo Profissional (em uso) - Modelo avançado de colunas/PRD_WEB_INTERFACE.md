# Product Requirements Document (PRD) - Automação de Relatórios Web v1.0

## 1. Introdução
Este documento descreve os requisitos para a migração da ferramenta de automação de relatórios fotográficos (atualmente um script Python Desktop) para uma **Plataforma Web SaaS**. O objetivo é oferecer a mesma agilidade e precisão na geração de documentos Word, mas com uma interface moderna, acessível via navegador e com recursos colaborativos.

## 2. Visão do Produto
Transformar o processo local de geração de relatórios em uma experiência de nuvem fluida. O usuário deve ser capaz de fazer upload de sua estrutura de pastas (ou conectar um drive), organizar visualmente o layout das fotos em um "Canvas Interativo" e exportar o relatório final formatado com um clique.

### Diferenciais
*   **Acessibilidade:** Não requer instalação de Python ou dependências locais.
*   **Interface Premium:** Design moderno, focado em usabilidade e estética (Dark Mode, Glassmorphism).
*   **Colaboração:** Múltiplos usuários podem editar a organização das fotos antes da geração.

## 3. Personas
*   **O Engenheiro/Arquiteto de Campo:** Tira centenas de fotos em vistorias, precisa organizar isso em um relatório formal rapidamente. Não quer lidar com formatação manual no Word.
*   **O Gestor de Projetos:** Revisa o relatório gerado pela equipe de campo antes de enviar ao cliente.

## 4. Requisitos Funcionais

### 4.1. Gestão de Projetos e Upload
*   **RF01 - Upload de Estrutura de Pastas:** O sistema deve permitir o upload de uma pasta raiz contendo subpastas e imagens, preservando a hierarquia (WebkitDirectory support).
*   **RF02 - Gestão de Modelos (.docx):** O usuário deve poder fazer upload de seus próprios templates Word (com a tag `{{start_here}}`). O sistema também deve oferecer modelos padrão.

### 4.2. O "Canvas" de Edição (Core Feature)
*   **RF03 - Visualização em Grid:** As fotos devem ser apresentadas em um grid interativo, separado por seções (baseadas nas pastas).
*   **RF04 - Drag & Drop Inteligente:**
    *   Reordenar fotos dentro de uma seção.
    *   Mover fotos entre seções.
    *   **Agrupamento Visual:** O usuário pode arrastar uma foto sobre a outra para criar um "Grupo" (simulando a tabela de 2 ou 3 colunas do algoritmo Greedy).
*   **RF05 - Edição de Metadados:**
    *   Renomear títulos de seções.
    *   Adicionar legendas individuais às fotos (novo recurso).
    *   Converter itens em "Parágrafo de Texto" ou "Quebra de Página".

### 4.3. Motor de Geração (Backend)
*   **RF06 - Processamento de Imagem:** Redimensionamento inteligente mantendo a lógica de altura fixa (10cm) ou ajuste automático ao layout escolhido.
*   **RF07 - Geração de Arquivo:** O backend (Python/FastAPI) deve utilizar a lógica existente (`word_utils.py`) para compilar o documento final.
*   **RF08 - Preview em Tempo Real:** (Desejável) Uma visualização aproximada de como ficará a página do Word.

## 5. Requisitos Não Funcionais (RNF)
*   **RNF01 - Performance:** O upload de 500+ imagens deve ser otimizado (upload em chunks ou processamento local via WebAssembly antes do envio).
*   **RNF02 - Segurança:** Os arquivos enviados devem ser processados em ambiente isolado e descartados após um período de retenção (ex: 24h), a menos que o usuário opte por salvar o projeto.
*   **RNF03 - UX/UI:** Interface responsiva, mas otimizada para Desktop (onde a edição pesada ocorre). Estilo visual "Profissional & Tech" (Cores sóbrias, acentos em azul/verde neon, sombras suaves).

## 6. Arquitetura Proposta

### Frontend (SPA)
*   **Framework:** React.js ou Next.js.
*   **Estado:** Zustand ou Redux para gerenciar a lista complexa de itens.
*   **Drag & Drop:** `dnd-kit` ou `react-beautiful-dnd`.
*   **Estilo:** TailwindCSS.

### Backend (API)
*   **Linguagem:** Python (Reaproveitamento total do core `word_utils.py`).
*   **Framework:** FastAPI (pela velocidade e tipagem).
*   **Processamento:** Celery + Redis para filas de geração de relatórios pesados.

### Fluxo de Dados
1.  **Client:** Upload de Imagens -> S3/MinIO (Storage Temporário).
2.  **Client:** Envia JSON com a estrutura final (ordem, grupos, textos).
3.  **Server:** Worker baixa imagens, aplica `word_utils.py` no template, gera `.docx`.
4.  **Client:** Recebe link de download.

## 7. Esboço de Interface (Wireframe Mental)

*   **Sidebar Esquerda:** Árvore de diretórios (navegação rápida entre "Área Externa", "Área Interna").
*   **Área Central (Canvas):**
    *   Cabeçalho da Seção (Editável).
    *   Grid de Cards (Fotos).
    *   Cada Card tem: Thumbnail, Botão de Excluir, Botão de Girar.
    *   Dropzones visíveis para "Criar Tabela de 2 Colunas" ou "Criar Tabela de 3 Colunas".
*   **Sidebar Direita (Propriedades):**
    *   Configurações do Relatório (Selecionar Template, Definir Título).
    *   Botão Flutuante "GERAR RELATÓRIO" (CTA Principal).

---
**Status do Documento:** Rascunho Inicial (v1.0)
**Autor:** Antigravity AI
**Baseado em:** Automação v4.3 (Desktop)
