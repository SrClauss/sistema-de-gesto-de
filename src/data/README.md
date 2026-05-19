# Estrutura de Dados - Sistema de Gestão de Serviços Recorrentes

Esta pasta contém todos os dados mockados do sistema, organizados em arquivos separados para facilitar a manutenção e adição de novos dados.

## Arquivos

### `colaboradores.js`
Lista de colaboradores do sistema.

**Estrutura:**
```js
{
  id: string,           // Identificador único (ex: 'col_nome')
  nome: string,         // Nome completo do colaborador
  papel: string         // 'gerente' ou 'staff'
}
```

**Como adicionar:**
```js
export const colaboradores = [
  { id: 'col_claudio', nome: 'Cláudio', papel: 'gerente' },
  // Adicione novos colaboradores aqui:
  { id: 'col_maria', nome: 'Maria Santos', papel: 'staff' },
];
```

---

### `status.js`
Lista de status disponíveis para tarefas.

**Status disponíveis:**
- `Pendente` - Tarefa ainda não iniciada
- `Concluído` - Tarefa finalizada
- `Aguardando Validação` - Tarefa executada, aguardando aprovação
- `Aguardando Auditoria` - Tarefa em processo de auditoria
- `Atrasado` - Tarefa com vencimento ultrapassado
- `Não Aplicável` - Tarefa cancelada ou não necessária

---

### `tipos-tarefa.js`
Catálogo de tipos de tarefas disponíveis.

**Estrutura:**
```js
{
  tipo_id: string,      // Identificador único (snake_case)
  nome: string          // Nome descritivo da tarefa
}
```

**Como adicionar:**
```js
export const tiposTarefa = [
  { tipo_id: 'checklist_interno', nome: 'Checklist interno periódico' },
  // Adicione novos tipos aqui:
  { tipo_id: 'treinamento_anual', nome: 'Treinamento anual obrigatório' },
];
```

---

### `empresas.js`
Lista completa de empresas clientes com seus projetos, documentos e tarefas.

**Estrutura completa:**
```js
{
  // EMPRESA
  id: string,                        // ID único (ex: 'emp_01')
  razao_social: string,              // Razão social da empresa
  nome_fantasia: string,             // Nome fantasia
  cnpj: string,                      // CNPJ formatado
  cidade: string,                    // Cidade
  uf: string,                        // Estado (sigla)
  segmento: string,                  // Setor de atuação
  responsavel_principal_id: string,  // ID do colaborador responsável
  
  projetos: [{
    // PROJETO
    id: string,                      // ID único (ex: 'prj_01')
    nome: string,                    // Nome do projeto
    status: string,                  // 'Ativo', 'Em Renovação', etc.
    
    documentos: [{
      // DOCUMENTO
      id: string,                    // ID único (ex: 'doc_01')
      tipo: string,                  // Tipo do documento/licença
      orgao: string,                 // Órgão emissor
      vencimento: string,            // Data (formato: 'YYYY-MM-DD')
      status: string,                // Status do documento
      responsavel_id: string,        // ID do colaborador responsável
      prereq_ok: boolean,            // Se pré-requisitos estão OK
      motivo_bloqueio: string,       // Descrição do bloqueio (se houver)
      
      pendencias_anteriores: [{
        // PENDÊNCIA
        id: string,                  // ID único (ex: 'pend_01')
        severidade: string,          // 'alta', 'media', 'baixa'
        descricao: string            // Descrição da pendência
      }],
      
      tarefas: [{
        // TAREFA
        id: string,                  // ID único (ex: 'tsk_01')
        tipo_id: string,             // Referência ao tipo de tarefa
        titulo: string,              // Título descritivo da tarefa
        externo: boolean,            // Se é executada por terceiro
        cliente_executa: boolean,    // Se é executada pelo cliente
        status: string,              // Status (ver status.js)
        responsavel_id: string,      // ID do colaborador responsável
        vencimento: string,          // Data (formato: 'YYYY-MM-DD')
        valor_estimado: number       // Valor em reais (0 = sem custo)
      }]
    }]
  }]
}
```

**Exemplo de como adicionar uma nova empresa:**
```js
export const empresas = [
  // ... empresas existentes ...
  {
    id: 'emp_04',
    razao_social: 'Nova Empresa LTDA',
    nome_fantasia: 'Nova Empresa',
    cnpj: '44.555.666/0001-04',
    cidade: 'Belo Horizonte',
    uf: 'MG',
    segmento: 'Indústria',
    responsavel_principal_id: 'col_roberto',
    projetos: [
      {
        id: 'prj_04',
        nome: 'Licenças 2026',
        status: 'Ativo',
        documentos: [
          {
            id: 'doc_05',
            tipo: 'Alvará Sanitário',
            orgao: 'Vigilância Sanitária MG',
            vencimento: '2026-12-31',
            status: 'Ativo',
            responsavel_id: 'col_roberto',
            prereq_ok: true,
            motivo_bloqueio: '',
            pendencias_anteriores: [],
            tarefas: [
              {
                id: 'tsk_10',
                tipo_id: 'checklist_interno',
                titulo: 'Checklist mensal sanitário',
                externo: false,
                cliente_executa: false,
                status: 'Pendente',
                responsavel_id: 'col_roberto',
                vencimento: '2026-06-30',
                valor_estimado: 0,
              }
            ],
          }
        ],
      }
    ],
  }
];
```

---

### `mock.js`
Arquivo principal que importa e combina todos os dados em uma única estrutura.

**Não edite este arquivo diretamente!** Edite os arquivos específicos acima.

---

## Dicas de Uso

1. **IDs únicos**: Sempre use IDs únicos seguindo o padrão:
   - Colaboradores: `col_nome`
   - Empresas: `emp_XX`
   - Projetos: `prj_XX`
   - Documentos: `doc_XX`
   - Tarefas: `tsk_XX`
   - Pendências: `pend_XX`

2. **Datas**: Use sempre formato ISO `YYYY-MM-DD` (ex: '2026-12-31')

3. **Relacionamentos**: 
   - `responsavel_principal_id` deve referenciar um `colaborador.id` existente
   - `tipo_id` deve referenciar um `tipos_tarefa.tipo_id` existente
   - `status` de tarefas deve usar valores de `status.js`

4. **Valores monetários**: Use números sem formatação (ex: 1500 para R$ 1.500,00)

5. **Segmentos comuns**: Alimentos, Logística, Construção Civil, Indústria, Comércio, Serviços, etc.
