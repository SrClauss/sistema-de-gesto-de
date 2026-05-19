import { Paper, Box, Typography, Chip, Grid } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

export const Dashboard = () => {
  const { kpis, data } = useApp();

  const chartData = [
    { label: 'Jan', value: 42 },
    { label: 'Fev', value: 38 },
    { label: 'Mar', value: 45 },
    { label: 'Abr', value: 51 },
    { label: 'Mai', value: 48 },
    { label: 'Atual', value: kpis.pendentes + kpis.aguardando },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  const alertasEmpresa = [];
  data.empresas.forEach((emp) => {
    const docsBlock = [];
    const tarefasAtrasadas = [];

    emp.projetos.forEach((prj) => {
      prj.documentos.forEach((doc) => {
        if (!doc.prereq_ok) {
          docsBlock.push({ emp: emp.nome_fantasia, doc: doc.tipo, motivo: doc.motivo_bloqueio });
        }
        doc.tarefas.forEach((t) => {
          if (t.status === 'Atrasado') {
            tarefasAtrasadas.push({ emp: emp.nome_fantasia, tarefa: t.titulo, venc: t.vencimento });
          }
        });
      });
    });

    if (docsBlock.length > 0) {
      alertasEmpresa.push({
        tipo: 'doc-bloqueado',
        empresa: emp.nome_fantasia,
        count: docsBlock.length,
        detalhes: docsBlock,
      });
    }

    if (tarefasAtrasadas.length > 0) {
      alertasEmpresa.push({
        tipo: 'tarefa-atrasada',
        empresa: emp.nome_fantasia,
        count: tarefasAtrasadas.length,
        detalhes: tarefasAtrasadas,
      });
    }
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#111827', mb: 0.5 }}>
          Visão Executiva
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
          Acompanhamento em tempo real do portfólio regulatório
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          mb: 4,
          borderColor: '#E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,.06)',
          borderRadius: '3px',
          display: 'flex',
        }}
      >
        {[
          { label: 'EMPRESAS ATIVAS', value: kpis.empresas, color: '#2563EB', trend: '+2' },
          { label: 'TAREFAS PENDENTES', value: kpis.pendentes, color: '#D97706', trend: '-3' },
          { label: 'TAREFAS ATRASADAS', value: kpis.atrasadas, color: '#DC2626', trend: '+1' },
          { label: 'CONCLUÍDAS (MÊS)', value: kpis.concluidas, color: '#059669', trend: '+12' },
        ].map((kpi, idx, arr) => (
          <Box
            key={kpi.label}
            sx={{
              flex: 1,
              p: 4,
              borderRight: idx < arr.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1.4px',
                color: '#9CA3AF',
                fontWeight: 500,
                mb: 1,
              }}
            >
              {kpi.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '42px', fontWeight: 800, color: kpi.color }}>
                {kpi.value}
              </Typography>
              <Chip
                icon={kpi.trend.startsWith('+') && kpi.label !== 'TAREFAS ATRASADAS' ? <TrendingUp fontSize="inherit" /> : <TrendingDown fontSize="inherit" />}
                label={kpi.trend}
                size="small"
                sx={{
                  fontSize: '13px',
                  height: '22px',
                  fontWeight: 600,
                  backgroundColor: kpi.trend.startsWith('+') && kpi.label !== 'TAREFAS ATRASADAS' ? '#D1FAE5' : '#FEE2E2',
                  color: kpi.trend.startsWith('+') && kpi.label !== 'TAREFAS ATRASADAS' ? '#065F46' : '#991B1B',
                }}
              />
            </Box>
          </Box>
        ))}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            variant="outlined"
            sx={{
              borderColor: '#E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,.06)',
              borderRadius: '3px',
              p: 3,
            }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#374151', mb: 3 }}>
              Evolução de Tarefas (6 meses)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'end', gap: 1.5, height: '180px' }}>
              {chartData.map((item, idx) => {
                const pct = (item.value / maxValue) * 100;
                const heightPx = Math.round((pct / 100) * 180);
                const isAtual = item.label === 'Atual';
                return (
                  <Box key={idx} sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'end' }}>
                    <Box
                      sx={{
                        height: `${heightPx}px`,
                        backgroundColor: isAtual ? '#2563EB' : '#BFDBFE',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: '#2563EB',
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
              {chartData.map((item, idx) => (
                <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{
              borderColor: '#E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,.06)',
              borderRadius: '3px',
              p: 3,
            }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#374151', mb: 3 }}>
              Alertas Críticos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {alertasEmpresa.length === 0 && (
                <Typography sx={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>
                  Nenhum alerta no momento
                </Typography>
              )}
              {alertasEmpresa.map((alerta, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderRadius: '6px',
                    backgroundColor: alerta.tipo === 'doc-bloqueado' ? '#FEF2F2' : '#FFFBEB',
                    border: `1px solid ${alerta.tipo === 'doc-bloqueado' ? '#FECACA' : '#FDE68A'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: alerta.tipo === 'doc-bloqueado' ? '#991B1B' : '#92400E',
                      }}
                    >
                      {alerta.empresa}
                    </Typography>
                    <Chip
                      label={alerta.count}
                      size="small"
                      sx={{
                        height: '18px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: alerta.tipo === 'doc-bloqueado' ? '#DC2626' : '#D97706',
                        color: 'white',
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: alerta.tipo === 'doc-bloqueado' ? '#991B1B' : '#92400E',
                    }}
                  >
                    {alerta.tipo === 'doc-bloqueado'
                      ? `${alerta.count} documento(s) bloqueado(s)`
                      : `${alerta.count} tarefa(s) atrasada(s)`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
