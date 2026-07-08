# Detalhes da Geração do Relatório Word

Este documento descreve o fluxo exato de funcionamento do script de automação, dividido entre a coleta de dados e a geração do arquivo `.docx`.

## Visão Geral
O processo é dividido em duas grandes fases:
1.  **Coleta de Dados (`auto.py`)**: Escaneia pastas, ordena arquivos e monta a lista de conteúdo.

2.  **Geração do Documento (`word_utils.py`)**: Manipula o arquivo Word, insere textos e imagens formatados.

---

## Fase 1: Coleta e Organização (`auto.py`)

Nesta etapa, o script define "o que" entrará no relatório.

### 1. Seleção e Ordenação de Pastas
*   O script percorre a pasta raiz selecionada pelo usuário.
*   **Regra de Ordem:**
    *   Na raiz, segue estritamente a lista definida em `ORDEM_PASTAS`:
        1.  `- Área externa`
        2.  `- Área interna`
        3.  `- Segundo piso`
    *   Subpastas ou pastas fora dessa lista são ordenadas **alfabeticamente**.

### 2. Criação da Lista de Conteúdo
Para cada pasta processada, os itens são adicionados à lista `conteudo` na seguinte ordem:

1.  **Título da Pasta:**
    *   Adiciona o nome da pasta.
    *   Adiciona prefixos (`»`, `»»`) dependendo da profundidade da subpasta.
2.  **Imagens:**
    *   Busca arquivos com extensões `.png`, `.jpg`, `.jpeg`.
    *   **Ordenação:** As imagens são ordenadas pela **data de criação** (da mais antiga para a mais nova).
3.  **Quebra de Página:**
    *   Adiciona um marcador de quebra de página ao final de cada pasta.

### 3. Pré-visualização e Edição (`interface.py`)
*   Uma interface gráfica exibe a lista final para o usuário.
*   **Funcionalidades:**
    *   **Paginação:** Exibe 100 itens por página para melhor performance.
    *   **Reordenação:** Botões para mover itens para cima ou para baixo.
    *   **Exclusão:** Permite remover itens indesejados.
    *   **Edição:**
        *   Renomear tópicos/títulos.
        *   Converter "Quebra de Página" em "Parágrafo" (e vice-versa).
*   Apenas após a confirmação ("Confirmar e Gerar Relatório"), a lista é enviada para a próxima fase.

---

## Fase 2: Geração do Word (`word_utils.py`)

Nesta etapa, o arquivo `.docx` modelo é modificado. A função principal é `inserir_conteudo`.

### 1. Preparação e Otimização de Layout
*   Abre o arquivo modelo selecionado.
*   **Ponto de Inserção:** Localiza o parágrafo contendo a tag `{{start_here}}` e guarda seu índice.
*   **Algoritmo Greedy (Layout Inteligente):**
    *   Analisa a lista de conteúdo antes da inserção.
    *   Identifica imagens **Verticais** (Altura > Largura).
    *   Agrupa imagens verticais consecutivas em tabelas para economizar espaço:
        *   Tenta formar grupos de **3 imagens** (se couberem na largura).
        *   Se não, tenta formar grupos de **2 imagens**.
        *   Se sobrar, mantém como imagem individual.
    *   Imagens horizontais ou que não se agrupam permanecem como itens individuais.

### 2. Inversão da Lista
*   A lista de conteúdo é **invertida** (`reversed`).
*   **Motivo:** O script insere novos elementos sempre na mesma posição (o índice encontrado). Inserindo de trás para frente, a ordem visual final no documento fica correta (o primeiro item da lista acaba ficando no topo).

### 3. Loop de Inserção
O script processa a lista item a item e aplica as regras de formatação:

#### A. Títulos (Texto)
*   Remove os caracteres `»`.
*   **Estilização:**
    *   **Pastas Especiais** (`- Detalhes`, `- Vista ampla`): Fonte Arial 11, Negrito, Alinhamento Justificado.
    *   **Nível 0 (Raiz):** Aplica estilo `Heading 1`. > - ÁREA EXTERNA
    *   **Nível 1:** Aplica estilo `Heading 2`. > - AMBIENTE
    *   **Nível 2:** Aplica estilo `Heading 3`. > - SERVIÇO
    *   **Outros:** Fonte Arial 12, Negrito. > 

#### B. Imagens
*   Abre a imagem original.
*   **Redimensionamento:**
    *   **Altura Fixa:** 10 cm.
    *   **Largura:** Calculada proporcionalmente para manter o aspecto original.
*   Insere a imagem centralizada.
*   *Tratamento de Erro:* Se a imagem falhar, insere um texto de erro no lugar.

#### C. Tabelas de Imagens (Agrupadas)
*   Cria uma tabela sem bordas visíveis.
*   Distribui as imagens nas colunas (3 ou 2).
*   Mantém a altura fixa de 10 cm para uniformidade.

#### D. Quebra de Página
*   Insere um comando de quebra de página (`WD_BREAK.PAGE`).

#### E. Parágrafos
*   Insere um parágrafo vazio (ou com texto, se especificado) para espaçamento ou anotações manuais.

### 4. Finalização
*   Salva o arquivo com o nome padrão na pasta de saída escolhida.

---

## Pontos de Ajuste Fino

Para modificar comportamentos específicos, edite os seguintes arquivos e linhas:

| O que mudar | Arquivo | Onde procurar |
| :--- | :--- | :--- |
| **Ordem das fotos** | `auto.py` | Linha ~99 (`key=os.path.getctime`) |
| **Tamanho das fotos** | `word_utils.py` | Linha ~65 (`altura_desejada_cm = 10`) |
| **Fontes e Estilos** | `word_utils.py` | Linhas ~43-53 (função `aplicar_estilo` e condicionais) |
| **Ordem das Pastas** | `auto.py` | Linha ~14 (lista `ORDEM_PASTAS`) |
]