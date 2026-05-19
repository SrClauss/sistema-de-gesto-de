# Sistema de Gestão de Serviços Recorrentes

Protótipo completo de um sistema de gerenciamento de portfólio regulatório para empresas clientes, permitindo gestão de tarefas, documentos, licenças e acompanhamento de conformidade por múltiplos stakeholders.

**Experience Qualities**: 
1. **Profissional** — Interface corporativa com hierarquia visual clara e dados densos apresentados de forma organizada e escaneável
2. **Eficiente** — Acesso rápido a informações críticas através de KPIs, alertas visuais e navegação contextual por módulos
3. **Controlado** — Fluxos de aprovação estruturados com rastreabilidade de responsabilidades e estados bem definidos

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views) - Sistema multi-módulo com três perfis de acesso distintos (gerencial, colaborador, empresa), fluxos de atribuição em massa, gestão de dependências entre documentos, calendário de equipe e dashboard executivo com KPIs computados.

## Essential Features

**Alternância de Módulos**
- Functionality: Permite que usuários troquem entre visões Gerencial, Colaborador e Empresa
- Purpose: Diferentes stakeholders necessitam perspectivas distintas sobre os mesmos dados
- Trigger: Seletor no AppBar
- Progression: Usuário seleciona módulo → interface reconfigura navegação → conteúdo e ações mudam contextualmente
- Success criteria: Drawer lateral atualiza menu, conteúdo principal mostra apenas informações relevantes ao perfil

**Dashboard Executivo (Gerencial)**
- Functionality: Exibe KPIs agregados (empresas ativas, tarefas pendentes/atrasadas/concluídas), gráfico de barras comparativo e lista de alertas críticos
- Purpose: Visão panorâmica da operação para tomada de decisão gerencial
- Trigger: Navegação para Dashboard no módulo gerencial
- Progression: Sistema computa métricas em tempo real → renderiza KPIs com tendências → gráfico mostra distribuição temporal → alertas destacam bloqueios e atrasos
- Success criteria: Gerente identifica gargalos em menos de 10 segundos, alertas clicáveis levam ao detalhe da empresa

**Carteira de Empresas (Gerencial)**
- Functionality: Listagem paginada de empresas com busca, status de alertas e ação de reatribuição
- Purpose: Gestão centralizada do portfólio de clientes
- Trigger: Navegação para Carteira
- Progression: Usuário visualiza tabela → busca por nome/segmento → identifica empresa com alertas → acessa detalhe ou reatribui responsável
- Success criteria: Busca filtra instantaneamente, paginação funciona corretamente, reatribuição atualiza interface

**Detalhe de Empresa com Acordeões**
- Functionality: Visualização estruturada por projeto → documento → tarefas, com indicadores de bloqueio e botão para resolver pendências
- Purpose: Navegação hierárquica no portfólio regulatório de uma empresa
- Trigger: Clique em empresa na carteira
- Progression: Usuário expande projeto → expande documento → visualiza tarefas → identifica bloqueio por pré-requisito → resolve manualmente → documento desbloqueado
- Success criteria: Acordeões expandem suavemente, alertas de bloqueio visíveis, resolução de pré-requisito limpa pendências imediatamente

**Calendário de Equipe**
- Functionality: Visualização mensal de todas as tarefas distribuídas por data de vencimento
- Purpose: Planejamento de carga de trabalho e identificação de conflitos de prazo
- Trigger: Navegação para Calendário
- Progression: Usuário navega entre meses → visualiza tarefas agrupadas por dia → hover revela detalhes → identifica dias sobrecarregados
- Success criteria: Navegação mês/ano fluida, até 3 chips visíveis por dia, tooltip mostra empresa/título/responsável

**Atribuição em Massa**
- Functionality: Reatribuir múltiplas tarefas de um tipo específico para novo responsável com filtros de período
- Purpose: Redistribuição eficiente de carga de trabalho
- Trigger: Botão "Atribuição em Massa" na carteira
- Progression: Usuário abre dialog → seleciona tipo de tarefa → define escopo (período/futuro/tudo) → escolhe novo responsável → confirma → sistema atualiza tarefas
- Success criteria: Filtros funcionam corretamente, atribuição em massa atualiza todas as tarefas correspondentes

**Minhas Tarefas (Colaborador)**
- Functionality: Visualização filtrada de tarefas atribuídas ao colaborador logado, organizadas em abas por status
- Purpose: Foco individual na lista de trabalho própria
- Trigger: Navegação para Minhas Tarefas
- Progression: Colaborador acessa módulo → visualiza abas (A Fazer / Em Revisão / Concluídas) → executa tarefa → status muda para "Aguardando Validação" → gerente valida → status muda para "Concluído"
- Success criteria: Apenas tarefas do colaborador aparecem, badges mostram contagem, botões de ação funcionam

**Portal da Empresa (Módulo Empresa)**
- Functionality: Visualização read-only do portfólio regulatório da própria empresa
- Purpose: Transparência para o cliente sobre status de licenças e tarefas
- Trigger: Acesso com perfil de empresa
- Progression: Cliente visualiza projetos → expande documentos → vê tarefas sem poder modificá-las
- Success criteria: Mesmo layout do detalhe gerencial mas sem botões de ação

## Edge Case Handling

- **Empresa sem responsável** — Sistema atribui primeiro colaborador staff como fallback e exibe alerta sutil
- **Documento com pré-requisitos bloqueados** — Accordion exibe ícone de aviso e Alert detalhando motivo; tarefas permanecem visíveis mas com contexto de bloqueio
- **Tarefas atrasadas** — Status muda automaticamente para "Atrasado" se vencimento < hoje e status não for Concluído
- **Busca sem resultados** — Exibe estado vazio com ícone e mensagem "Nenhuma empresa encontrada"
- **Calendário sem tarefas no mês** — Células vazias permanecem clicáveis mas sem conteúdo
- **Colaborador sem tarefas** — Exibe estado vazio amigável com ícone e mensagem "Você não tem tarefas"

## Design Direction

Corporativo, denso e orientado a dados. Interface deve transmitir confiabilidade, hierarquia clara e eficiência operacional. Elementos visuais apoiam escaneabilidade rápida de informações críticas através de cor, tipografia e agrupamento espacial consistente.

## Color Selection

Paleta corporativa baseada em azuis sólidos com acentos de status semafóricos.

- **Primary Color**: `#1565C0` (Azul corporativo) — transmite confiança, profissionalismo e estabilidade institucional. Usado em AppBar, botões primários e elementos de navegação.
- **Secondary Colors**: 
  - `#F57C00` (Laranja âmbar) — energia controlada para ações secundárias
  - `#E5E7EB` (Cinza claro) — bordas e divisores suaves
  - `#F3F4F6` (Cinza muito claro) — fundos de seções alternadas
- **Accent Colors (Status semafórico)**:
  - `#2563EB` (Azul brilhante) — KPI de empresas ativas, dados positivos
  - `#D97706` (Âmbar escuro) — KPI de pendentes, estado de atenção
  - `#DC2626` (Vermelho alerta) — KPI de atrasadas, criticidade alta
  - `#059669` (Verde êxito) — KPI de concluídas, sucesso operacional
- **Foreground/Background Pairings**:
  - Primary (`#1565C0`): White text (`#FFFFFF`) - Ratio 8.2:1 ✓
  - Background (`#FFFFFF`): Foreground text (`#111827`) - Ratio 17.8:1 ✓
  - Error Alert (`#FEF2F2`): Error text (`#991B1B`) - Ratio 11.3:1 ✓
  - Warning Alert (`#FFFBEB`): Warning text (`#92400E`) - Ratio 10.8:1 ✓

## Font Selection

Tipografia limpa e funcional que prioriza legibilidade em tabelas densas e hierarquia clara em títulos. Inter (Google Fonts) oferece proporções equilibradas e excelente rendering em interfaces de dados.

- **Typographic Hierarchy**:
  - H1 (Títulos de página): Inter Bold 700 / 28px / tight letter-spacing / `#111827`
  - H2 (Subtítulos de seção): Inter SemiBold 600 / 18px / normal / `#374151`
  - Body (Conteúdo geral): Inter Regular 400 / 14px / normal / `#1F2937`
  - Caption (Labels e metadados): Inter Medium 500 / 10px / wide letter-spacing (1.4px) / `#9CA3AF` uppercase
  - Numeric (KPIs grandes): Inter ExtraBold 800 / 42px / tight / cores temáticas

## Animations

Animações devem ser sutis e funcionais, reforçando feedback de interação sem atrasar o fluxo de trabalho. Expansão de acordeões com ease-out (200ms), transições de status com fade suave (150ms), hover em cards e botões com scale mínimo (1.02) e mudança de cor instantânea.

## Component Selection

- **Components**: 
  - MUI `AppBar` + `Drawer` para shell principal (drawer persistente 220px)
  - MUI `Paper` com `variant="outlined"` para todos os cards e containers
  - MUI `Accordion` para estrutura hierárquica de projetos/documentos
  - MUI `Chip` para status, badges e tags (variantes filled/outlined por contexto)
  - MUI `Table` com `size="small"` para listagens densas de tarefas
  - MUI `Dialog` para fluxos de atribuição e confirmação
  - MUI `Tabs` para segmentação de tarefas por status
  - MUI `Select` para filtros e escolha de módulo/colaborador
  - MUI `Avatar` (22px) para identificação visual de colaboradores
  - MUI `Alert` para comunicação de bloqueios e avisos contextuais
  - MUI `Breadcrumbs` para navegação hierárquica
- **Customizations**: 
  - Barra de KPIs customizada com separadores verticais e layout em 4 colunas
  - Gráfico de barras implementado com Box e altura em pixels fixos (não %)
  - Células de calendário customizadas com Paper e grid 7 colunas
  - `StatusChip` wrapper que mapeia status para cor/variante corretas
  - `TaskTable` component que encapsula lógica de ações por status
- **States**: 
  - Botões: hover escurece 10%, active escurece 20%, disabled opacity 50%
  - Chips clicáveis: hover adiciona shadow, cursor pointer
  - Linhas de tabela: hover com background `#F9FAFB`
  - Acordeões: ícone rotate 180deg quando expandido
- **Icon Selection**: 
  - MUI `TrendingUp`/`TrendingDown` para tendências em KPIs
  - MUI `PlayArrow` para executar tarefa
  - MUI `Check` para validar tarefa
  - MUI `Person` para reatribuir
  - MUI `Warning` para documentos bloqueados
  - MUI `ChevronLeft`/`ChevronRight` para navegação de calendário
  - MUI `Business` para empresas
  - MUI `CalendarMonth` para calendário
  - MUI `Assignment` para tarefas
- **Spacing**: 
  - Container padding: 24px (Tailwind `p-6`)
  - Card internal padding: 20px
  - Section gap: 32px (Tailwind `gap-8`)
  - Table cell padding: 12px horizontal, 8px vertical
  - KPI columns: 32px padding, 1px divider
- **Mobile**: 
  - Drawer colapsa em hamburger menu abaixo de 960px
  - Tabelas mantêm scroll horizontal em mobile
  - KPIs empilham verticalmente (1 coluna) abaixo de 768px
  - Calendário reduz para 1 coluna com lista de dias abaixo de 640px
  - Diálogos ocupam 95% da largura em mobile
