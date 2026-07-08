# Ecossistema MAFFENG – Plano Integrado

---

## 1. Identificação Geral

O projeto MAFFENG – Automação Técnica é liderado por Thiago, por meio da marca TM – Sempre Tecnologia, e tem como objetivo estruturar um ecossistema integrado de aplicações técnicas, administrativas e gerenciais voltadas à automação de levantamentos de campo, geração de relatórios técnicos e gestão de contratos de manutenção e engenharia.

O ecossistema foi concebido com arquitetura modular, permitindo que cada aplicação opere de forma independente, porém integrada por meio de um núcleo central de dados e autenticação. O back-end é baseado em Supabase, utilizado como banco de dados relacional, camada de autenticação e APIs. O front-end é desenvolvido em TypeScript e React, enquanto Python é utilizado para serviços de automação, processamento de dados e geração de relatórios técnicos.

Essa abordagem garante escalabilidade, padronização de dados, segurança e flexibilidade para evolução do produto e comercialização modular.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 2. Arquitetura do Ecossistema

O ecossistema TM que será aplicado a empresa MAFFENG–é estruturado em módulos independentes, porém totalmente integrados, cada um projetado para atender um perfil específico de usuário e uma função operacional clara dentro do fluxo geral do sistema.

A arquitetura modular permite evolução contínua, escalabilidade e implantação progressiva dos componentes, sem comprometer o funcionamento do núcleo do ecossistema.

### Visão Geral dos Módulos

| Módulo | Tipo | Usuário Principal | Função Base |
|--------|------|------------------|-------------|
| TM Levantamentos | Mobile / PWA | Técnico de campo | Captura estruturada de dados, medições e registros fotográficos em campo |
| TM Gerenciador de O.S. | Web | Gerente / Elaborador / Administrador de Contrato | Gestão central do ciclo de vida das ordens de serviço |
| TM Auto Relatórios | Serviço / Back-end | Elaboradores | Geração automática de relatórios técnicos padronizados (.docx) |
| TM Painel do Diretor | Web | Diretoria | Consolidação de indicadores, métricas e visão estratégica |

Cada módulo é desenvolvido como uma aplicação lógica independente, comunicando-se por meio de APIs e compartilhando um núcleo comum de dados, autenticação e permissões.

---

### Princípios Arquiteturais

A arquitetura do ecossistema é orientada pelos seguintes princípios:

- Modularidade: cada aplicação pode ser implantada, mantida e evoluída separadamente.
- Centralização de dados: o Supabase vai atuar como núcleo unificado de dados e autenticação. (no entanto até a validação de cada aplicativo, será utilizado o banco de dados do próprio REPLIT)
- Separação de responsabilidades: cada módulo executa apenas funções claramente definidas.
- Integração desacoplada: comunicação via APIs e eventos, evitando dependências rígidas.
- Escalabilidade progressiva: possibilidade de expansão técnica e funcional conforme crescimento do produto.

---

### Integração entre Módulos

A integração entre os módulos ocorre de forma controlada e rastreável:

- O TM Levantamentos gera pacotes estruturados de dados e mídia.
- O TM Gerenciador de O.S. atua como orquestrador central, validando dados, controlando estados e acionando serviços.
- O TM Auto Relatórios processa dados validados e devolve documentos técnicos prontos.
- O TM Painel do Diretor consome dados consolidados diretamente do banco, sem interferir no fluxo operacional.

Essa separação garante robustez operacional e reduz o acoplamento entre áreas estratégicas e operacionais.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 3. Fluxo de Dados Geral

O fluxo de dados do ecossistema TM aplicado à MAFFENG é estruturado de forma sequencial e controlada, garantindo rastreabilidade das informações, padronização dos dados técnicos e integridade operacional entre os módulos.

O processo é iniciado no campo, com a coleta de informações pelo técnico, e segue até a consolidação estratégica e administrativa, passando por validações intermediárias.

### Visão Geral do Fluxo

Levantamentos → Gerenciador de O.S. → Auto Relatórios → Gerenciador de O.S. → Painel do Diretor

---

### Descrição do Fluxo

**1. Levantamentos de Campo**

O técnico de campo utiliza o módulo TM Levantamentos para realizar a coleta estruturada de dados, medições e registros fotográficos. Os dados são organizados em pacotes contendo mídia, informações técnicas e metadados.

**2. Recebimento e Validação**

Os pacotes gerados são enviados ao TM Gerenciador de O.S., que realiza a validação estrutural e técnica das informações, associa os dados à respectiva ordem de serviço e registra logs de processamento.

**3. Geração Automática de Relatórios**

Após validação, o Gerenciador encaminha os dados ao TM Auto Relatórios, responsável por processar as informações e gerar automaticamente relatórios técnicos padronizados no formato .docx, conforme templates definidos por contrato.

**4. Retorno e Atualização de Status**

O relatório gerado é devolvido ao TM Gerenciador de O.S., que atualiza o status da ordem de serviço, armazena o documento e disponibiliza o resultado para acompanhamento.

**5. Consolidação Estratégica**

O TM Painel do Diretor consome os dados consolidados diretamente do banco, apresentando indicadores, métricas e informações estratégicas, sem interferir no fluxo operacional.

---

### Leitura Direta de Dados

Os módulos de visualização e análise não participam do fluxo transacional. O TM Painel do Diretor realiza apenas leitura direta dos dados consolidados no banco, garantindo isolamento entre operações críticas e análises gerenciais.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 4. Camadas Técnicas

O ecossistema TM aplicado à MAFFENG é estruturado em camadas técnicas bem definidas, com o objetivo de garantir separação de responsabilidades, facilidade de manutenção, escalabilidade e clareza arquitetural.

Cada camada possui funções específicas e utiliza tecnologias adequadas ao seu papel dentro do sistema, permitindo evolução independente e integração controlada entre os componentes.

### Visão Geral das Camadas Técnicas

| Camada | Função | Tecnologias |
|--------|--------|-------------|
| Front-end | Interfaces web e mobile para interação dos usuários | React, React Native, TypeScript, Tailwind, Shadcn |
| Back-end / API | Intermediação entre módulos e regras de negócio | Supabase (PostgREST, Functions) (inicialmente REPLIT) |
| Serviços | Automação, processamento e geração de relatórios | Python (scripts), FastAPI ou Flask |
| Banco de Dados | Núcleo unificado de dados e persistência | Supabase (PostgreSQL) Inicialmente utilizaremos um banco separado por projeto no replit |
| Infraestrutura | Deploy, execução e monitoramento | Replit (fase inicial), Vercel ou Railway (fase futura) |

---

### Descrição das Camadas

**Front-end**

Responsável pela camada de apresentação e interação com os usuários. Implementa interfaces responsivas e padronizadas, atendendo aos diferentes perfis de acesso (técnico, gerente, administrador, diretoria).

**Back-end / API**

Atua como camada intermediária entre o front-end e o banco de dados, concentrando regras de negócio, autenticação, controle de acesso e exposição de endpoints.

**Serviços**

Executa processos assíncronos e automações, como geração de relatórios técnicos, tratamento de dados e integrações específicas entre módulos.

**Banco de Dados**

Centraliza todas as informações do ecossistema, garantindo integridade referencial, consistência dos dados e controle transacional.

**Infraestrutura**

Suporta a execução das aplicações e serviços, permitindo implantação inicial rápida e futura migração para ambientes mais robustos conforme o crescimento do produto.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 5. Módulos Detalhados

### 5.1 TM Levantamentos

O TM Levantamentos é o módulo responsável pela coleta de dados em campo, atuando como ponto inicial do fluxo operacional do ecossistema TM aplicado à MAFFENG.

Porém o que iniciamos na implementação foi o gerenciador de o.s

Trata-se de uma aplicação orientada ao uso por técnicos de campo, projetada para funcionar de forma prática, padronizada e resiliente, inclusive em ambientes com conectividade limitada.

**Características gerais**

- Tipo: Aplicação mobile / PWA, com possibilidade de distribuição futura como aplicativo nativo (APK / lojas).
- Usuário principal: Técnico de campo.
- Finalidade: Captura estruturada de informações técnicas, medições e registros fotográficos vinculados a uma ordem de serviço.

**Funcionamento**

O técnico realiza o levantamento diretamente no aplicativo, seguindo formulários e estruturas previamente definidas. Durante o uso:

- Os dados podem ser coletados offline.
- As fotos e informações técnicas são associadas a metadados padronizados.
- Ao final do levantamento, o sistema gera um pacote estruturado, contendo:
  - Registros fotográficos
  - Dados técnicos
  - Metadados da ordem de serviço

Esse pacote é preparado para envio posterior ao sistema central.

**Envio de dados**

- O envio do pacote ocorre via endpoint seguro (ex.: /api/upload-pacote).
- Após o upload, o pacote fica disponível para validação no TM Gerenciador de O.S.

**Status do módulo**

- Estado atual: Protótipo concluído. (mas é necessário a definição do layout final) – Estilo app ou estilo whatsapp

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

### 5.2 TM Gerenciador de O.S.

O TM Gerenciador de O.S. é o núcleo central do ecossistema TM aplicado à MAFFENG, responsável por orquestrar todo o ciclo operacional das ordens de serviço, desde o recebimento dos levantamentos até a consolidação dos resultados.

Este módulo é a primeira aplicação em desenvolvimento ativo e servirá como base de integração para todos os demais sistemas do ecossistema.

**Características gerais**

- Tipo: Aplicação web.
- Usuários: Gerentes, elaboradores de relatórios e administradores de contrato.
- Papel estratégico: Orquestrador central do fluxo de dados.

**Principais funções**

- Recebimento automático dos pacotes gerados pelo TM Levantamentos.
- Validação estrutural e técnica dos dados recebidos.
- Associação do levantamento à ordem de serviço correta.
- Controle de status do ciclo da O.S.:
  - Recebida
  - Em validação
  - Enviada para geração de relatório
  - Relatório gerado
  - Concluída
- Disparo de requisições para o TM Auto Relatórios.
- Recebimento de callbacks com os relatórios prontos.
- Armazenamento dos documentos gerados.
- Registro completo de logs de processamento.
- Alimentação automática dos módulos:
  - TM Painel do Diretor

**Funcionalidades operacionais**

- Dashboard de ordens de serviço.
- Filtros por contrato, agência, status, técnico e período.
- Histórico completo por O.S.
- Controle de prazos e SLAs.
- Gestão de usuários e permissões.
- Auditoria de ações.

**Status do módulo**

- Estado atual: Em desenvolvimento ativo.
- Observação: Módulo considerado o core do ecossistema, devendo ser priorizado antes dos demais.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

### 5.3 TM Auto Relatórios

O TM Auto Relatórios é o módulo responsável pela automação completa do processo de geração de relatórios técnicos, atuando como serviço back-end integrado ao TM Gerenciador de O.S.

Este módulo utiliza scripts em Python já existentes, que foram desenvolvidos para interpretar dados estruturados e gerar documentos técnicos padronizados conforme modelos contratuais.

**Características gerais**

- Tipo: Serviço / back-end, com futura interface web para gestão.
- Usuário principal: Elaboradores de relatórios (uso indireto, via sistema).
- Base tecnológica: Scripts Python existentes.

**Principais funções**

- Recebimento dos dados validados enviados pelo TM Gerenciador de O.S.
- Interpretação automática das pastas de levantamento.
- Seleção dinâmica de templates conforme contrato.
- Geração de relatórios técnicos no formato .docx.
- Padronização visual e estrutural dos documentos.
- Retorno automático do relatório ao TM Gerenciador de O.S. via callback.
- Registro de logs de processamento e tempo de execução.

**Funcionamento**

O TM Gerenciador de O.S. envia uma requisição ao serviço de Auto Relatórios contendo os dados validados da ordem de serviço.

O serviço processa as informações, aplica o template correspondente e gera o documento final, que é devolvido ao Gerenciador para armazenamento e disponibilização.

**Status do módulo**

- Estado atual: Inteligência pronta (scripts funcionais).
- Pendências:
  - Integração via API REST.
  - Estruturação de endpoints.
  - Prototipagem da interface web futura.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

### 5.4 TM Painel do Diretor

O TM Painel do Diretor é o módulo destinado à visualização estratégica e gerencial do ecossistema TM aplicado à MAFFENG, fornecendo uma visão consolidada das operações, contratos e desempenho dos serviços executados.

Este módulo tem caráter analítico e não interfere no fluxo operacional, atuando exclusivamente como camada de leitura e inteligência gerencial.

**Características gerais**

- Tipo: Dashboard web (BI).
- Usuário principal: Diretor.
- Finalidade: Consolidação de indicadores estratégicos e operacionais.

**Principais funções**

- Visualização de KPIs operacionais.
- Acompanhamento de SLAs por contrato e agência.
- Monitoramento de produtividade por técnico.
- Análise de volumes de ordens de serviço.
- Indicadores de tempo médio por etapa.
- Exportação de dados (CSV / Excel / PDF).
- Filtros por período, contrato, agência e status.

**Fonte de dados**

- Leitura direta do banco central (Supabase).
- Não participa do fluxo transacional.
- Não altera registros operacionais.

**Status do módulo**

- Estado atual: Conceitual.
- Observação: Aguardando validação e maturidade dos dados oriundos do TM Gerenciador de O.S.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 6. Fluxo Operacional e Dependências

O ciclo operacional do ecossistema TM aplicado à MAFFENG é organizado em etapas bem definidas, estabelecendo responsabilidades, entradas e saídas para cada fase do processo.

### Estrutura do ciclo

| Etapa | Entrada | Saída | Responsável |
|--------|----------|--------|--------------|
| Levantamento | Dados e fotos em campo | Pacote estruturado | Técnico de campo |
| Validação | Pacote de levantamento | Dados validados | Gerente / Administrador |
| Geração de relatório | Dados validados | Documento técnico (.docx) | TM Auto Relatórios |
| Consolidação | Dados processados | Indicadores e métricas | TM Painel do Diretor |

### Dependências entre módulos

- O TM Gerenciador de O.S. depende do TM Levantamentos para iniciar o fluxo. (não é regra) porque implementaremos primeiramente o gerenciador
- O TM Auto Relatórios depende da validação realizada no Gerenciador.
- O TM Painel do Diretor depende da maturidade e integridade dos dados consolidados.
- Nenhum módulo analítico interfere no fluxo transacional.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 7. Autenticação e Segurança

O ecossistema TM aplicado à MAFFENG implementa autenticação centralizada baseada em tokens JWT, com controle de acesso por perfil de usuário.

**Perfis previstos**

- Técnico de campo
- Gerente
- Administrador de contrato
- Elaborador de relatórios
- Diretor

**Principais diretrizes de segurança**

- Autenticação via Supabase Auth.
- Controle de permissões por role.
- Tokens de sessão com tempo de expiração.
- Armazenamento de mídias no Supabase Storage.
- URLs temporárias para acesso a arquivos sensíveis.
- Registro de eventos críticos na tabela de logs.
- Auditoria de ações administrativas.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 8. Banco e Estrutura de Dados

O banco de dados principal do ecossistema TM aplicado à MAFFENG é baseado no Supabase (PostgreSQL), atuando como núcleo unificado de armazenamento, integridade e auditoria das informações.

**Estrutura geral prevista**

- Tabela usuarios
- Tabela ordens_servico
- Tabela pacotes_levantamento
- Tabela relatorios
- Tabela contratos
- Tabela agencias
- Tabela logs
- Tabela metricas

**Principais diretrizes**

- Relacionamentos normalizados entre entidades.
- Controle de integridade referencial.
- Versionamento de registros sensíveis.
- Registro de alterações (auditoria).
- Separação lógica por módulo quando necessário.
- Indexação para consultas analíticas.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 9. Próximas Etapas

A ordem recomendada de execução para consolidação do ecossistema TM aplicado à MAFFENG é a seguinte:

1. Formalização do plano
   Consolidação deste documento como base conceitual, técnica e estratégica do projeto.

2. Protótipo completo do TM Gerenciador de O.S.
   Desenvolvimento e validação do módulo central de integração do ecossistema.

3. Integração com o TM Auto Relatórios
   Conexão dos scripts Python ao Gerenciador via API REST e execução de testes funcionais do fluxo.

4. Desenvolvimento do TM Painel do Diretor
   Implementação do módulo de BI para consolidação de métricas e indicadores estratégicos.

5. Validação geral do ecossistema
   Testes integrados entre todos os módulos ativos.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

---

## 10. Objetivo Final e Posicionamento

O objetivo final do ecossistema TM aplicado à MAFFENG é consolidar uma plataforma modular, escalável e monetizável, na qual cada aplicação possa operar de forma independente, porém totalmente integrada por meio de um núcleo central de dados e autenticação.

Essa arquitetura permite:

- Comercialização individual de cada módulo, conforme necessidade do cliente.
- Oferta do ecossistema completo como solução integrada.
- Flexibilidade para adaptação a diferentes contratos e modelos operacionais.
- Evolução contínua sem impacto nos módulos já implantados.

O projeto posiciona a MAFFENG como referência em automação técnica de processos operacionais, ao mesmo tempo em que fortalece a marca TM – Sempre Tecnologia como desenvolvedora de soluções digitais especializadas para engenharia, manutenção e gestão técnica.

Além disso, o planejamento do ecossistema estabelece bases sólidas para a transição da operação para pessoa jurídica, organizando produtos, marcas e ativos digitais de forma estruturada, facilitando futuras parcerias comerciais, contratos corporativos e expansão de mercado.

**08/01/2026 - TM-Sempre Tecnologia - Avaliado e Aprovado.**

