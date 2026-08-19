# Plano — Hub de Contratos MAFFENG no GitHub Pages

> Card: "Fazer um Hub - Para cada - Contrato" (de46866b)
> Autor: TM Design · Data: 08/08/2026
> Status: PLANO — aguardando aprovação do Thiago para o Workspace TM implementar

---

## 1. Objetivo

Subir o **Hub de Contratos** (protótipo aprovado `hub-contratos-v2-maffeng.html`,
modelo 2 — alerta em painel lateral) no **GitHub Pages**, para a equipe acessar
pela internet e selecionar cada contrato com clareza, com a área de alerta
legível (sem sobrepor os itens).

## 2. O que já está pronto (entregue pelo TM Design)

| Entregável | Arquivo | Status |
|---|---|---|
| Protótipo v1 (faixa fixa) | hub-contratos-v1-faixa-fixa.html | ✅ vinculado ao card |
| Protótipo v2 (painel lateral) | hub-contratos-v2-painel-lateral.html | ✅ vinculado ao card |
| Protótipo v3 (badges inline) | hub-contratos-v3-badges-inline.html | ✅ vinculado ao card |
| **Modelo 2 aprovado (completo)** | **hub-contratos-v2-maffeng.html** (589 KB) | ✅ vinculado ao card (id aaeb0c86) |
| Dados reais dos 9 contratos | dados-contratos.json (0908, 1507, 1565, 2056, 2057, 2626, 2627, 3575, 6122) | ✅ em disco |
| Downloads (Previsão Orçamentária / Modelo RAT / Memorial) | 10 arquivos .xlsx | ✅ 10/10 confirmados em disco |

Recursos já embutidos no protótipo:
- Login com 3 papéis (Dev / Inspetor / Admin) — demonstrativo
- Hub com os 9 contratos na tela principal, com contagens e indicadores de alerta
- Sub-header horizontal (CONTRATO | LOTE | EMPRESA | BDI) + faixa "Pintura do contrato"
- Alerta em **painel lateral dedicado** — não sobrepõe os itens (modelo 2 aprovado)
- Busca, categorização por unidade, aba Agências
- Footer TM + tema claro/escuro + vermelho reservado para urgência

## 3. Decisão de repositório

**Opção A (recomendada):** criar repositório dedicado
`TM-SEMPRE-TECNOLOGIA/hub-contratos-maffeng` (público).
URL final: `https://TM-SEMPRE-TECNOLOGIA.github.io/hub-contratos-maffeng/`

**Opção B:** subir em `docs/` do repo `maffeng` existente.
URL final: `https://TM-SEMPRE-TECNOLOGIA.github.io/maffeng/`
(menos recomendado: mistura com outros conteúdos do repo)

> Recomendação TM Design: **Opção A** — repo isolado, histórico limpo,
> Pages apontando para a raiz, fácil de atualizar e de compartilhar o link.

## 4. Estrutura proposta do repositório

```
hub-contratos-maffeng/
├── index.html            ← hub-contratos-v2-maffeng.html (renomeado para index)
├── dados-contratos.json  ← fonte de dados (mantida para evolução)
├── downloads/            ← 10 arquivos .xlsx (links relativos)
│   ├── 0908_SP_Modelo_RAT.xlsx
│   ├── 1507_CUIABA_Previsao_Orcamentaria.xlsx
│   ├── 1565_SJRP_Modelo_RAT.xlsx
│   ├── 2056_DIVINOPOLIS_Previsao_Orcamentaria.xlsx
│   ├── 2057_VARGINHA_Previsao_Orcamentaria.xlsx
│   ├── 2626_SALINAS_Previsao_Orcamentaria.xlsx
│   ├── 2627_VALADARES_Previsao_Orcamentaria.xlsx
│   ├── 3575_TANGARA_Previsao_Orcamentaria.xlsx
│   ├── 6122_MS_Previsao_Orcamentaria.xlsx
│   └── MEMORIAL_DE_CALCULO_TODOS_CONTRATOS.xlsx
└── README.md
```

## 5. Ajustes obrigatórios antes do deploy (implementação = Workspace TM)

1. **Referências locais → relativas:** o protótipo contém **10 caminhos
   `C:/Users/thiag/...`** (botões "Baixar"). No GitHub Pages esses caminhos
   NÃO funcionam. Substituir por `./downloads/<arquivo>.xlsx` e subir os
   arquivos na pasta `downloads/` do repo.
2. **Fontes:** manter via CDN Google Fonts (já funciona no Pages).
3. **Link do footer:** manter `https://thiagonascimentobarbosapro.com` (já ok).
4. **Favicons/logos:** conferir se há referências a arquivos locais de imagem;
   se houver, colocar na raiz do repo.
5. **PWA (opcional):** adicionar manifest + ícones para instalar como app.
6. **Testar mobile-first** após o deploy (hub é usado em campo, no celular).

## 6. Fluxo de publicação (uma vez, ~10 min)

```bash
# 1. Criar o repo na org (gh autenticado)
gh repo create TM-SEMPRE-TECNOLOGIA/hub-contratos-maffeng --public \
  --description "Hub de Contratos MAFFENG — preventivas 2026 (GitHub Pages)" \
  --source . --push

# 2. Copiar os arquivos
cp hub-contratos-v2-maffeng.html index.html
mkdir downloads && cp <10 xlsx> downloads/

# 3. Ajustar as 10 referências C:/Users/... → ./downloads/...
# 4. Commit + push
git add -A && git commit -m "Hub de contratos MAFFENG — v1 (modelo 2 aprovado)" && git push

# 5. Habilitar GitHub Pages
gh api repos/TM-SEMPRE-TECNOLOGIA/hub-contratos-maffeng/pages \
  -X POST -f "source[branch]=main" -f "source[path]=/"

# 6. Validar
curl -sI https://TM-SEMPRE-TECNOLOGIA.github.io/hub-contratos-maffeng/ | head -5
```

## 7. Pós-publicação

- Compartilhar o link público com a equipe (funciona em qualquer dispositivo).
- Atualizações futuras: substituir `index.html` e dar `git push` — o Pages
  publica automaticamente (deploy ~1 min).
- Os downloads .xlsx ficam versionados junto — nenhum contrato fica sem download.

## 8. Responsabilidades

| Papel | O que faz |
|---|---|
| TM Design (este card) | Protótipos, identidade visual, plano ✅ |
| Workspace TM (próximo card) | Implementa: repo, ajuste de caminhos, deploy Pages |
| Thiago | Aprova o modelo e o link final |

---
*Plano baseado no pedido: "Esse hub, a gente vai subir ele lá no GitHub Pages."*
