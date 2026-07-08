Ecossistema MAFFENG – Plano Integrado
1 Identificação Geral
O projeto MAFFENG – Automação Técnica é liderado por Thiago / TM – Sempre Tecnologia e tem por objetivo central estruturar um ecossistema integrado de aplicativos técnicos, administrativos e gerenciais voltados à automação de relatórios, levantamentos e gestão de contratos[1]. A arquitetura utiliza Supabase como banco e back‑end principal, com TypeScript e React no front‑end e Python para serviços e relatórios[2].
2 Arquitetura do Ecossistema
O ecossistema é organizado em módulos independentes interligados. Cada módulo atende um perfil de usuário e uma função específica:
Módulo	Tipo	Usuário Principal	Função Base
TM – Zap Levantamentos	Mobile	Técnico de campo	Captura e envio de dados de campo[3]

TM – Controle de O.S	Web	Gerente / Admin Contrato	Gestão central do ciclo das ordens de serviço[4]

TM – Studio de Relatórios	Web	Elaboradores	Motor de geração automática de relatórios .docx[5]

TM – Visão do Gestor	Web	Diretoria	Consolidação de métricas e BI[6]

TM Ajustes Administrativos	Web	Administrativo / Financeiro	Dashboard financeiro, frota e gestão patrimonial[7]

3 Fluxo de Dados Geral
O fluxo de informações percorre as seguintes etapas: 

Levantamentos → Gerenciador → Auto Relatórios → Gerenciador → Painel/Ajustes[8]. 
O módulo de Painel do Diretor ele apenas recebe métricas de todas as outras aplicações. 
Tm Administrativo e Financeiro, eles são para gestão de patrimônio, e gestão financeira, estão desconectados dos outros módulos, vão ter banco de dados diferente. Mas vão enviar informações de métricas para o painel do diretor 
5 Módulos Detalhados
5.1 TMS Levantamentos Fotográficos
●	Tipo: Mobile nativo. Será distribuído como aplicativo instalável (APK/lojas)[16].
●	Usuário: técnico de campo. Opera offline, permitindo coleta de dados e fotos, gerando um pacote ZIP com fotos, JSON e metadados[17].
●	Upload: via HTTPS (/api/upload-pacote)[18].
●	Status: prototipado (Figma completo; visual pronto)[19].
5.2 TMS Gerenciador de O.S.
●	Tipo: Web App[20].
●	Usuários: gerentes e administradores de contrato[21].
●	Funções: Insere as O.S através de planilha, recebe pacotes de levantamentos, valida e encaminha ao Auto Relatórios, registra logs e atualiza status, alimenta o Painel do diretor.[22].
●	Status: em concepção; todos os outros módulos dependem desse.[23].
5.3 TMS Auto Relatórios
●	Tipo: Web App[24].
●	Base: scripts Python [25].
●	Funções: geração automática de relatórios .docx usando templates padronizados por contrato e envio de callbacks ao Gerenciador de O.S [26].
●	Status: inteligência pronta; falta a integração REST e a prototipagem da interface[26].
5.4 TMS Painel do Diretor
●	Tipo: Web dashboard (BI)[27].
●	Funções: visualiza KPIs, SLAs e indicadores; exporta dados e lê diretamente do Supabase (em tempo real)[28].
●	Status: ainda conceitual; aguarda dados validados pelo Gerenciador[29].
5.5 TMS Ajustes Administrativos
●	Tipo: Web App[30].
●	Funções: controle financeiro, gestão de frota, patrimônio e RH.[31].
●	Status: conceitual;[32].
7 Autenticação e Segurança
O ecossistema implementa autenticação centralizada baseada em tokens JWT e controle de acesso por perfil (técnico, gerente, administrador de contrato, elaborador de relatórios, diretor e financeiro)
8 Banco e Estrutura de Dados
O banco principal é o Supabase, com tabelas específicas para ordens de serviço, pacotes, relatórios, métricas, financeiro, frota e usuários
10 Objetivo Final e Posicionamento
O objetivo final é formar um ecossistema modular e monetizável, no qual cada aplicação possa operar de forma independente mas esteja totalmente integrada via Supabase e autenticação centralizada[47]. Isso viabiliza a comercialização separada ou em conjunto, posicionando a marca MAFFENG como proposta de valor em automação técnica, ao mesmo tempo em que serve de vitrine para a TM – Sempre Tecnologia[47]. De acordo com o comentário do autor, o plano também prepara o caminho para transição da empresa para pessoa jurídica, ajustando o posicionamento de projetos e marcas relacionadas.[47]
________________________________________
[1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11] [12] [13] [14] [15] [16] [17] [18] [19] [20] [21] [22] [23] [24] [25] [26] [27] [28] [29] [30] [31] [32] [33] [34] [35] [36] [37] [38] [39] [40] [41] [42] [43] [44] [45] [46] [47] 
https://www.notion.so/29e1b09b94c7806780c4ee74782b4e35
