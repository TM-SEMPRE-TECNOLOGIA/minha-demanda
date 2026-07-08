# Plano de Recriação do Aplicativo TMS

Este plano resume a análise técnica e o mapeamento completo do ecossistema TMS Levantamentos para sua recriação do zero em uma nova stack (Vite + React + Zustand).

## Resumo da Análise (Etapas 1-10)

Foram gerados 10 documentos técnicos que servem como a nova **Fonte de Verdade**:

1.  **[RAIO_X_PROJETO.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/RAIO_X_PROJETO.md)**: Diagnóstico da stack atual (React/ShadCN) e identificação de dívidas técnicas (prop drilling, navegação manual).
2.  **[INVENTARIO.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/INVENTARIO.md)**: Mapeamento de todas as 11 telas e modais reais.
3.  **[MAPEAMENTO_FUNCIONAL.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/MAPEAMENTO_FUNCIONAL.md)**: Regras de negócio, ações e validações por tela.
4.  **[FIGMA_SYSTEM.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/FIGMA_SYSTEM.md)**: Extração de tokens de design, espaçamentos e paleta Neon.
5.  **[ARQUITETURA_NOVA.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/ARQUITETURA_NOVA.md)**: Proposta de estrutura modular offline-first.
6.  **[DESIGN_SYSTEM_FINAL.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/DESIGN_SYSTEM_FINAL.md)**: Guia canônico de componentes e interações.
7.  **[TELAS_RECRIADAS.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/TELAS_RECRIADAS.md)**: Especificação detalhada para o rebuild visual.
8.  **[FLUXOS.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/FLUXOS.md)**: Jornadas do usuário e casos de borda.
9.  **[DADOS.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/DADOS.md)**: Modelagem de dados e contratos de API.
10. **[BACKLOG.md](file:///C:/Users/thiag/.gemini/antigravity/brain/b2160f33-e1a1-428c-9d4a-8fb4e889d630/BACKLOG.md)**: Roteiro de execução priorizado.

## Próximos Passos (Fase de Execução)

A fase de recriação seguirá a ordem do **BACKLOG.md**, começando pela base de design e store global, garantindo que cada tela seja entregue com 100% de paridade funcional com a versão atual, porém com código mais limpo e escalável.

## Notas para Revisão
> [!IMPORTANT]
> A nova arquitetura sugere o uso de **Zustand** para o estado do levantamento, eliminando o problema de *prop drilling* detectado no Raio-X.
