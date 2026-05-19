import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Button,
  List,
  ListItem,
} from '@mui/material';
import { ExpandMore, Warning } from '@mui/icons-material';
import { StatusChip } from '../../components/shared/StatusChip';
import { TaskTable } from '../../components/shared/TaskTable';
import { useApp } from '../../context/AppContext';

export const CompanyDetail = ({ empresa, onBack }) => {
  const { resolverPrereq, data } = useApp();

  const getColaborador = (colabId) => {
    return data.catalogos.colaboradores.find((c) => c.id === colabId);
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={onBack}>
          Carteira
        </Link>
        <Typography color="text.primary">{empresa.nome_fantasia}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 700, mb: 1 }}>{empresa.nome_fantasia}</Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
          {empresa.razao_social} · {empresa.cidade}/{empresa.uf} · {empresa.segmento}
        </Typography>
      </Box>

      {empresa.projetos.map((projeto) => (
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
                    {!doc.prereq_ok && <Warning sx={{ color: '#DC2626' }} />}
                    <Typography sx={{ fontWeight: 600, flex: 1 }}>{doc.tipo}</Typography>
                    <StatusChip status={doc.status} />
                    <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                      Vence: {new Date(doc.vencimento).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Chip
                      label={colab?.nome || 'Sem responsável'}
                      size="small"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,.1)' },
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {!doc.prereq_ok && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>Documento Bloqueado</Typography>
                      <Typography sx={{ mb: 2 }}>{doc.motivo_bloqueio}</Typography>
                      {doc.pendencias_anteriores.length > 0 && (
                        <>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>Pendências:</Typography>
                          <List dense>
                            {doc.pendencias_anteriores.map((pend) => (
                              <ListItem key={pend.id} sx={{ py: 0 }}>
                                [{pend.severidade.toUpperCase()}] {pend.descricao}
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => resolverPrereq(doc.id)}
                        sx={{
                          mt: 2,
                          backgroundColor: '#D97706',
                          '&:hover': { backgroundColor: '#B45309' },
                        }}
                      >
                        Resolver manualmente
                      </Button>
                    </Alert>
                  )}
                  <TaskTable tarefas={doc.tarefas} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
