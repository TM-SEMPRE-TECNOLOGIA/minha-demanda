
# Organizador de Fotos - WhatsApp

Este ferramenta automatiza a organização de fotos exportadas de conversas do WhatsApp, movendo-as para pastas baseadas nos ambientes e serviços descritos no chat.

## Como Usar

1.  **Requisitos**: Certifique-se de ter o Python instalado.
2.  **Iniciar**: Dê dois cliques no arquivo `iniciar_organizacao.bat`.
3.  **Na Interface**:
    *   Clique em **"Selecionar Pasta"**.
    *   Escolha a pasta onde você descompactou o backup do WhatsApp (onde estão as fotos `IMG-*-WA*.jpg` e o arquivo `Conversa do WhatsApp.txt`).
    *   Clique em **"INICIAR ORGANIZAÇÃO"**.
4.  **Acompanhe**: O log mostrará quais ambientes foram detectados e quais fotos foram movidas.

## 📚 Documentação Completa

Para detalhes técnicos, arquitetura e regras de negócio, consulte a pasta [`Docs/`](Docs/docs_index.md).

- **[Visão Geral](Docs/vision_success.md):** Por que este projeto existe.
- **[Manual de Uso (Runbook)](Docs/runbook.md):** Guia detalhado de operação.
- **[Regras de Organização](Docs/organization_rules.md):** Como as pastas são nomeadas.
- **[Arquitetura](Docs/high_level_architecture.md):** Como o código funciona por trás dos panos.
