# Audio-to-Descrição — Pipeline de Voz para Relatórios TM

## Plan de Implementação: Botão de Áudio + Transcrição + Reescrita "- Prezados"

> **Goal:** Adicionar no TM Relatórios um botão "Enviar Áudio" que captura fala do técnico em campo, transcreve, permite tratamento manual do resumo, e reescreve automaticamente no padrão `- Prezados, ...` para inserção direta no relatório.
>
> **Author:** Thiago Nascimento (TM Sempre Tecnologia)
> **Data:** 2026-06-30
> **Status:** 💡 Planejamento

---

## Fluxo Completo (do áudio ao .docx)

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Técnico em  │───→│   TM Relatórios  │───→│  Transcrição     │───→│  Reescrita IA   │
│  campo grava │    │   App (Web/Mobile)│    │  (Whisper/STT)  │    │  → "- Prezados" │
│  áudio       │    │   Botão Áudio    │    │  + Resumo Manual │    │                 │
└──────────────┘    └──────────────────┘    └──────────────────┘    └─────────────────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────┐
                                                          │  Inserir no     │
                                                          │  Relatório .docx│
                                                          │  (ou guardar)   │
                                                          └─────────────────┘
```

### Etapas Detalhadas

#### Etapa 1: Captura de Áudio (Frontend)
- Botão "🎤 Enviar Áudio" na interface do TM Relatórios
- Grava ou faz upload de arquivo de áudio (.mp3, .wav, .ogg, .m4a)
- Associa o áudio ao **serviço** atual (ambiente + serviço que está sendo editado)
- Envia para o backend

#### Etapa 2: Transcrição + Tratamento Manual
- Backend recebe áudio e transcreve (Whisper local ou API)
- Retorna **transcrição bruta** para o usuário revisar/editr
- **Tratamento manual:** o usuário vê o texto transcrito, ajusta nomes, medidas, detalhes técnicos
- Gera **resumo de saída** (texto limpo, curado pelo usuário)

#### Etapa 3: Reescrita para "- Prezados..."
- Texto tratado pelo usuário → LLM (IA) reescreve no padrão:
  ```
  "- Prezados, constatamos que [problema encontrado].
   É necessária [ação corretiva]. (item xx.x do contrato)"
  ```
- O usuário pode revisar e aprovar a reescrita
- Versão final salva como descrição do serviço

#### Etapa 4: Inserção no Relatório
- Texto reescrito pode ser:
  - **Inserido diretamente** no .docx como descrição do serviço
  - **Salvo em arquivo .txt** para uso posterior com a skill `relatorio-descricoes-placeholder`
  - **Armazenado** no banco de dados do serviço (versão produção)

---

## Arquitetura

### Frontend (TM Relatórios — Next.js / React)

```tsx
// components/AudioRecorder.tsx
interface AudioRecorderProps {
  servicoAtual: string;   // ex: "11.1 - Pintura acrílica"
  ambiente: string;       // ex: "Sala sem uso"
  onDescricaoPronta: (texto: string) => void;  // callback quando descrição estiver pronta
}

// Fluxo de tela:
// 1. Botão "🎤 Gravar / Upload Áudio"
// 2. Player de preview + indicador de progresso (upload/transcrição)
// 3. Editor de transcrição (textarea editável para tratamento manual)
// 4. Botão "✏️ Reescrever para Padrão" → chama LLM
// 5. Preview da reescrita + botão "✅ Inserir como Descrição"
```

### Backend (FastAPI — TM Relatórios)

```python
# Novos endpoints

@router.post("/api/audio/transcrever")
async def transcrever_audio(file: UploadFile):
    """Recebe áudio, transcreve via Whisper, retorna texto bruto."""
    audio_path = salvar_temporario(file)
    texto = whisper.transcribe(audio_path)
    return {"transcricao": texto, "id": session_id}

@router.post("/api/audio/reescrever")
async def reescrever_descricao(texto_tratado: str, servico: str):
    """Recebe texto tratado + nome do serviço → reescreve no padrão - Prezados."""
    prompt = f"""Reescreva o texto abaixo no padrão de descrição de relatório preventivo:
    - Comece com "- Prezados, constatamos que..."
    - Use linguagem técnica de engenharia predial
    - Inclua o serviço "{servico}" como contexto
    - Termine com número de item contratual se aplicável
    
    Texto original: {texto_tratado}"""
    
    descricao = llm_client.generate(prompt)
    return {"descricao": descricao}

@router.post("/api/audio/salvar")
async def salvar_descricao(servico_id: str, descricao: str, relatorio_id: str):
    """Salva descrição no relatório (em banco ou arquivo .txt)."""
    ...
```

### Transcrição (STT)

| Opção | Prós | Contras | Recomendação |
|-------|------|---------|-------------|
| **Whisper local** (faster-whisper) | Gratuito, offline, privacidade | Mais lento, precisa GPU boa | ✅ Para versão desktop |
| **OpenAI Whisper API** | Rápido, qualidade alta | Custo por minuto | Para versão produção |
| **Groq Whisper** | Rápido, free tier generoso | Depende de internet | Alternativa produção |

### Reescrita (LLM)

| Opção | Prós | Contras | Recomendação |
|-------|------|---------|-------------|
| **DeepSeek (atual)** | Já configurado, sem custo extra | Streaming instável | ✅ Para testes |
| **OpenRouter** | Múltiplos modelos, fallback | Custo por uso | Para produção |

---

## Estrutura de Arquivos (no TM Relatórios)

```
TM_Relatorios/
├── backend/
│   ├── server.py                      # API principal (endpoints existentes)
│   ├── audio_routes.py                # NOVO: endpoints de áudio
│   ├── transcriber.py                 # NOVO: módulo de transcrição (Whisper)
│   ├── descricao_rewriter.py          # NOVO: reescrita para "- Prezados..."
│   ├── generator.py
│   ├── word_utils.py
│   └── requirements.txt
├── frontend/
│   ├── components/
│   │   ├── AudioRecorder.tsx          # NOVO: botão + gravação
│   │   ├── TranscriptionEditor.tsx    # NOVO: editor de transcrição
│   │   └── DescriptionPreview.tsx     # NOVO: preview da reescrita
│   ├── pages/
│   └── app/
└── templates/
```

---

## Tasks de Implementação

### Task 1: Backend — Endpoint de Transcrição (Whisper)
- **Arquivos:** `backend/transcriber.py`, `backend/audio_routes.py`
- **Dependência:** `pip install faster-whisper` ou `openai-whisper`
- **Endpoint:** `POST /api/audio/transcrever`
- **Validação:** receber arquivo .mp3/.wav/.ogg, salvar temp, transcrever, retornar texto
- **Teste:** enviar áudio de teste → conferir transcrição

### Task 2: Backend — Endpoint de Reescrita (LLM)
- **Arquivos:** `backend/descricao_rewriter.py`
- **Integração:** usar LLM configurado no Hermes (DeepSeek atual) ou chamada direta a API
- **Endpoint:** `POST /api/audio/reescrever`
- **Prompt:** template que converte texto livre → "- Prezados, constatamos que..."
- **Teste:** enviar texto de vistoria → conferir se saída está no padrão

### Task 3: Frontend — Componente AudioRecorder
- **Arquivo:** `frontend/components/AudioRecorder.tsx`
- **Funcionalidades:**
  - Botão "🎤 Gravar" com indicador de tempo
  - Upload de arquivo de áudio existente
  - Barra de progresso (upload → transcrição → reescrita)
- **Estados:** idle, recording, uploading, transcribing, editing, rewriting, done

### Task 4: Frontend — Componente TranscriptionEditor
- **Arquivo:** `frontend/components/TranscriptionEditor.tsx`
- **Funcionalidades:**
  - Textarea com transcrição bruta (editável)
  - Botão "✏️ Tratar Manualmente" (habilita edição)
  - Botão "▶️ Reescrever para Padrão" → chama LLM
  - Preview lado a lado: original vs reescrito

### Task 5: Frontend — Integração com o Fluxo do Relatório
- **Callback:** quando descrição estiver pronta, inseri-la no bloco de descrição do serviço
- **Opção A:** inserir direto no editor de conteúdo do relatório
- **Opção B:** salvar em arquivo .txt separado (ex: `descricoes-{data}.txt`)
- **Opção C:** ambos

### Task 6: Pipeline — Integração com substituir_descricoes.py
- Conectar a saída do reescritor à skill `relatorio-descricoes-placeholder`
- Fluxo completo: áudio → transcrição → reescrita → .txt → substituir no .docx

---

## Experiência do Usuário (UX)

### Tela de Edição de Serviço (estado atual + áudio)

```
┌─────────────────────────────────────────────────────┐
│  Serviço: 11.1 - Pintura acrílica                    │
│  Ambiente: Sala sem uso                              │
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ Descrição (opcional):                            ││
│  │                                                 ││
│  │ [Área de texto ou placeholder]                   ││
│  │                                                 ││
│  │ [ 🎤 Enviar Áudio ]  [ 📝 Digitar Manual ]      ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  [ ✅ Inserir no Relatório ]                         │
└─────────────────────────────────────────────────────┘
```

### Fluxo ao Clicar em "🎤 Enviar Áudio"

```
1. Modal de áudio aparece
   ┌──────────────────────────────────────┐
   │  🎤 Gravar Áudio ou 📂 Upload Arquivo│
   │                                      │
   │  [ ● Gravando... 0:23 ] [⏹ Parar]   │
   │                                      │
   │  ▶ Preview: [========]               │
   │                                      │
   │  [ ✅ Transcrição concluída ]         │
   └──────────────────────────────────────┘

2. Tela de transcrição + tratamento manual
   ┌──────────────────────────────────────┐
   │  Transcrição Bruta:                   │
   │  ┌──────────────────────────────────┐│
   │  │ "a parede da sala sem uso ela tá ││
   │  │ com umas manchas e sujeira...    ││
   │  │ precisa pintar..."               ││
   │  └──────────────────────────────────┘│
   │  [ ✏️ Editar ]                       │
   │                                      │
   │  [ ▶️ Reescrever para Padrão ]       │
   └──────────────────────────────────────┘

3. Preview da reescrita
   ┌──────────────────────────────────────┐
   │  ✅ Descrição Gerada:                 │
   │                                      │
   │  "- Prezados, constatamos que as     │
   │  paredes da sala sem uso apresentam  │
   │  manchas de sujeira e marcas de uso. │
   │  É necessária a pintura acrílica das │
   │  superfícies para restaurar o        │
   │  acabamento e manter a conservação   │
   │  do ambiente."                       │
   │                                      │
   │  [ ✏️ Ajustar ]  [ ✅ Inserir ]       │
   └──────────────────────────────────────┘
```

---

## Dependências

### Python
```txt
# requirements.txt (adicionar)
faster-whisper>=1.0.0    # Transcrição local
# ou openai-whisper>=20231117  # Alternativa
pydub>=0.25.1            # Manipulação de áudio
```

### Node.js (Frontend)
```json
{
  "dependencies": {
    "react-media-recorder": "^2.0.0",
    "wavesurfer.js": "^7.0.0"
  }
}
```

### LLM (Reescrita)
- Usar o mesmo provedor do Hermes (DeepSeek via API)
- Ou endpoint dedicado no backend com chamada à API do DeepSeek/OpenRouter

---

## Riscos e Abertos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Whisper local lento sem GPU | Experiência frustrante | Fallback para API (Groq/OpenAI) |
| Precisão da reescrita | Descrição fora de contexto | Sempre mostrar preview + edição manual |
| Áudio longo (>5min) | Timeout | Dividir em chunks + progresso |
| Privacidade do áudio | Dados do cliente | Processamento local (desktop) ou criptografia |
| Custo de API de terceiros | Operacional | Whisper local como padrão, API como fallback |

### Por Decidir
- [ ] O tratamento manual é obrigatório ou opcional? (User disse "manual primeiro")
- [ ] O áudio é apagado após transcrição ou arquivado?
- [ ] Qual LLM usar para reescrita? (DeepSeek atual, ou dedicado)
- [ ] Onde fica o botão? (Na tela de edição de serviço, ou como aba separada?)

---

## Roadmap

| Fase | O que | Prioridade |
|------|-------|-----------|
| **1** | Transcrição (Whisper) + endpoint básico | 🔴 Alta |
| **2** | Reescrita LLM + endpoint | 🔴 Alta |
| **3** | Frontend: AudioRecorder + TranscriptionEditor | 🟡 Média |
| **4** | Integração com o fluxo do relatório | 🟡 Média |
| **5** | Fluxo completo: áudio → .docx | 🟢 Baixa |
| **6** | Testes com técnicos reais em campo | 🟢 Baixa |

---

## Resumo para o Fórum (Discord)

Postar em `#ecossistema-skills`:

```
## [Planejamento] TM Relatórios — Audio-to-Descrição

### Ideia
Botão "🎤 Enviar Áudio" no app → técnico grava vistoria em campo
→ Transcrição (Whisper) + Tratamento Manual (revisão do texto)
→ Reescrita IA para padão "- Prezados, constatamos que..."
→ Inserção como descrição do serviço no relatório .docx

### Fluxo
Áudio → Transcrição bruta → Usuário edita/resume → IA reescreve → Descrição pronta

### Framework
TM Relatórios (FastAPI + Next.js) + Whisper + DeepSeek/LLM

### Status
💡 Planejamento — pendente de implementação

### Tags
#TM-Relatorios #Audio #Transcricao #Feature #Planejamento
```

---

**Plan saved. Ready to execute when approved.**
