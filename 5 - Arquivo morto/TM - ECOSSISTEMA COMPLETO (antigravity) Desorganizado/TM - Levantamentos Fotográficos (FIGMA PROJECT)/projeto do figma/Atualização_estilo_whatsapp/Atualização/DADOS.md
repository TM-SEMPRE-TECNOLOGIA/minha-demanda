# DADOS.md

## 1. Modelos de Dados (Entities)

### WorkOrder (Ordem de Serviço)
Representa a demanda designada ao técnico.
- `id`: string (UUID)
- `number`: string (Ex: OS-2025-001)
- `location`: string (Local físico)
- `agency`: string (Código da agência)
- `manager`: string (Nome do gerente responsável)
- `status`: enum ("Pendente", "Em Andamento", "Concluído")
- `progress`: number (0-100)

### LevantamentoData (Pacote de Coleta)
O "Payload" final gerado pelo app.
- `localName`: string (Confirmado pelo técnico)
- `agencyCode`: string
- `managerName`: string
- `technicianId`: string (Matrícula)
- `selectedEnvironments`: string[]
- `customEnvironments`: string[]
- `environmentData`: Map<string, EnvironmentCollection>

### EnvironmentCollection (Dados por Ambiente)
- `widePhotos`: string[] (URLs/Base64 de fotos macro)
- `services`: ServiceData[]
- `completed`: boolean

### ServiceData (Registro de Serviço)
- `name`: string (Ex: "Pintura", "Troca de Lâmpada")
- `photos`: Array<{ photo: string, observations: string, measurements: string }>
- `detailPhotos`: string[] (URLs de fotos macro/detalhe)
- `completed`: boolean

---

## 2. Relacionamentos
- **1 OS** possui **0 ou 1 LevantamentoData** associado.
- **1 LevantamentoData** possui **N Ambientes**.
- **1 Ambiente** possui **N Serviços**.
- **1 Serviço** possui **N Fotos de Detalhe** e **N Fotos de Registro**.

---

## 3. Estrutura de API (Sugerida)
O app deve consumir os seguintes endpoints:

- `GET /work-orders`: Lista as OS vinculadas ao técnico.
- `GET /work-orders/:id`: Detalha uma OS específica (para reconciliação offline).
- `POST /levantamentos`: Envia o pacote final.
- `PATCH /levantamentos/:id`: Salva progresso parcial (Draft).

---

## 4. Estratégia de Cache (LocalFirst)
- O estado de `levantamentoData` deve ser espelhado no `LocalStorage` ou `IndexedDB` a cada alteração (`onUpdateData`).
- Limpeza do cache local deve ocorrer apenas após o `SuccessScreen` confirmar o recebimento pelo servidor.
