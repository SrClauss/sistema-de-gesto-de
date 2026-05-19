import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { StatusChip } from '../../components/shared/StatusChip';
import { TaskTable } from '../../components/shared/TaskTable';
import { useApp } from '../../context/AppContext';

export const CompanyPortal = () => {
  const { data, colaboradorLogado } = useApp();

  const minhaEmpresa = data.empresas.find((e) => e.responsavel_principal_id === colaboradorLogado.id) || data.empresas[0];

  const getColaborador = (colabId) => {
    return data.catalogos.colaboradores.find((c) => c.id === colabId);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#111827', mb: 1 }}>
          {minhaEmpresa.nome_fantasia}
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
          {minhaEmpresa.razao_social} · {minhaEmpresa.cidade}/{minhaEmpresa.uf} · {minhaEmpresa.segmento}
        </Typography>
      </Box>

      {minhaEmpresa.projetos.map((projeto) => (
        <Box key={projeto.id} sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#374151', mb: 2 }}>
            {projeto.nome}
          </Typography>
          {projeto.documentos.map((doc) => {
            const colab = getColaborador(doc.responsavel_id);
            return (
              <Accordion
                key={doc.id}
                sx={{
                  mb: 2,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                  borderRadius: '3px !important',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ fontWeight: 600, flex: 1 }}>{doc.tipo}</Typography>
                    <StatusChip status={doc.status} />
                    <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                      Vence: {new Date(doc.vencimento).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Chip label={colab?.nome || 'Sem responsável'} size="small" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TaskTable tarefas={doc.tarefas} mostrarAcoes={false} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
