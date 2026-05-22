import { Box, Typography, Paper, Chip, Tooltip, Button, Avatar } from '@mui/material';
import { Block, Schedule, Business, ArrowForward } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

export const AlertasCriticos = () => {
  const { data } = useApp();

  const alertasPorEmpresa = [];

  data.empresas.forEach((emp) => {
    const docsBlock = [];
    const tarefasAtrasadas = [];

    emp.projetos.forEach((prj) => {
      prj.documentos.forEach((doc) => {
        if (!doc.prereq_ok) {
          docsBlock.push({
            tipo: doc.tipo,
            orgao: doc.orgao,
            motivo: doc.motivo_bloqueio,
            pendencias: doc.pendencias_anteriores || [],
          });
        }
        doc.tarefas.forEach((t) => {
          if (t.status === 'Atrasado') {
            tarefasAtrasadas.push({
              titulo: t.titulo,
              vencimento: t.vencimento,
              responsavel:
                data.catalogos.colaboradores.find((c) => c.id === t.responsavel_id)?.nome || '-',
            });
          }
        });
      });
    });

    if (docsBlock.length > 0 || tarefasAtrasadas.length > 0) {
      alertasPorEmpresa.push({
        emp,
        docsBlock,
        tarefasAtrasadas,
        total: docsBlock.length + tarefasAtrasadas.length,
      });
    }
  });

  alertasPorEmpresa.sort((a, b) => b.total - a.total);

  const maxTotal =
    alertasPorEmpresa.length > 0 ? Math.max(...alertasPorEmpresa.map((a) => a.total)) : 1;
  const totalDocsBlocked = alertasPorEmpresa.reduce((s, a) => s + a.docsBlock.length, 0);
  const totalAtrasadas = alertasPorEmpresa.reduce((s, a) => s + a.tarefasAtrasadas.length, 0);
  const grandTotal = totalDocsBlocked + totalAtrasadas;
  const blockedPct = grandTotal > 0 ? Math.round((totalDocsBlocked / grandTotal) * 100) : 0;
  const atrasadaPct = grandTotal > 0 ? 100 - blockedPct : 0;

  const navegarParaEmpresa = (emp) => {
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { view: 'carteira', empresa: emp } })
    );
  };

  const formatDate = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#111827', mb: 0.5 }}>
          Alertas Críticos
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
          Documentos bloqueados e tarefas atrasadas em todo o portfólio
        </Typography>
      </Box>

      {/* Cartões de resumo */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ flex: 1, p: 3, borderColor: '#FECACA', backgroundColor: '#FEF2F2', borderRadius: '8px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Block sx={{ color: '#DC2626', fontSize: 34 }} />
            <Box>
              <Typography sx={{ fontSize: '38px', fontWeight: 800, color: '#DC2626', lineHeight: 1 }}>
                {totalDocsBlocked}
              </Typography>
              <Typography
                sx={{ fontSize: '11px', color: '#991B1B', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600 }}
              >
                Docs Bloqueados
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{ flex: 1, p: 3, borderColor: '#FDE68A', backgroundColor: '#FFFBEB', borderRadius: '8px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Schedule sx={{ color: '#D97706', fontSize: 34 }} />
            <Box>
              <Typography sx={{ fontSize: '38px', fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
                {totalAtrasadas}
              </Typography>
              <Typography
                sx={{ fontSize: '11px', color: '#92400E', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600 }}
              >
                Tarefas Atrasadas
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{ flex: 1, p: 3, borderColor: '#E9D5FF', backgroundColor: '#FAF5FF', borderRadius: '8px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Business sx={{ color: '#7C3AED', fontSize: 34 }} />
            <Box>
              <Typography sx={{ fontSize: '38px', fontWeight: 800, color: '#7C3AED', lineHeight: 1 }}>
                {alertasPorEmpresa.length}
              </Typography>
              <Typography
                sx={{ fontSize: '11px', color: '#5B21B6', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600 }}
              >
                Empresas Afetadas
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Gráficos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3, mb: 4 }}>
        {/* Barras horizontais por empresa */}
        <Paper variant="outlined" sx={{ p: 3, borderColor: '#E5E7EB', borderRadius: '8px' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#374151', mb: 3 }}>
            Ranking de Alertas por Empresa
          </Typography>
          {alertasPorEmpresa.length === 0 ? (
            <Typography sx={{ color: '#9CA3AF', fontStyle: 'italic' }}>
              Nenhum alerta no momento.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {alertasPorEmpresa.map((a) => {
                const pctBlocked = (a.docsBlock.length / maxTotal) * 100;
                const pctAtrasada = (a.tarefasAtrasadas.length / maxTotal) * 100;
                return (
                  <Box key={a.emp.id}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1565C0',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={() => navegarParaEmpresa(a.emp)}
                        >
                          {a.emp.nome_fantasia}
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>
                          · {a.emp.segmento} · {a.emp.cidade}/{a.emp.uf}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                        {a.total} alerta{a.total !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        height: '14px',
                        gap: '2px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#F3F4F6',
                      }}
                    >
                      {a.docsBlock.length > 0 && (
                        <Tooltip title={`${a.docsBlock.length} doc(s) bloqueado(s)`}>
                          <Box
                            sx={{ width: `${pctBlocked}%`, backgroundColor: '#DC2626', minWidth: '4px' }}
                          />
                        </Tooltip>
                      )}
                      {a.tarefasAtrasadas.length > 0 && (
                        <Tooltip title={`${a.tarefasAtrasadas.length} tarefa(s) atrasada(s)`}>
                          <Box
                            sx={{ width: `${pctAtrasada}%`, backgroundColor: '#F59E0B', minWidth: '4px' }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                );
              })}
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#DC2626', borderRadius: '2px' }} />
                  <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>Docs Bloqueados</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#F59E0B', borderRadius: '2px' }} />
                  <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>Tarefas Atrasadas</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Anel donut — distribuição por tipo */}
        <Paper variant="outlined" sx={{ p: 3, borderColor: '#E5E7EB', borderRadius: '8px' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#374151', mb: 3 }}>
            Distribuição por Tipo
          </Typography>
          {grandTotal === 0 ? (
            <Typography sx={{ color: '#9CA3AF', fontStyle: 'italic' }}>Nenhum alerta</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 130,
                    height: 130,
                    borderRadius: '50%',
                    background: `conic-gradient(#DC2626 0% ${blockedPct}%, #F59E0B ${blockedPct}% 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: '22px', fontWeight: 800, color: '#111827', lineHeight: 1 }}
                    >
                      {grandTotal}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: '#9CA3AF' }}>total</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#DC2626' }} />
                      <Typography sx={{ fontSize: '13px', color: '#374151' }}>Docs Bloqueados</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{blockedPct}%</Typography>
                  </Box>
                  <Box sx={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                    <Box
                      sx={{ width: `${blockedPct}%`, height: '100%', backgroundColor: '#DC2626', borderRadius: '3px' }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                      <Typography sx={{ fontSize: '13px', color: '#374151' }}>Tarefas Atrasadas</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{atrasadaPct}%</Typography>
                  </Box>
                  <Box sx={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                    <Box
                      sx={{ width: `${atrasadaPct}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '3px' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Lista detalhada por empresa */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {alertasPorEmpresa.map((a) => (
          <Paper
            key={a.emp.id}
            variant="outlined"
            sx={{ borderColor: '#E5E7EB', borderRadius: '8px', overflow: 'hidden' }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1565C0', width: 36, height: 36, fontSize: '14px' }}>
                  {a.emp.nome_fantasia.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                    {a.emp.nome_fantasia}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                    {a.emp.razao_social} · {a.emp.segmento} · {a.emp.cidade}/{a.emp.uf}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navegarParaEmpresa(a.emp)}
                sx={{ textTransform: 'none', borderColor: '#1565C0', color: '#1565C0', whiteSpace: 'nowrap' }}
              >
                Ver empresa
              </Button>
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {a.docsBlock.map((doc, i) => (
                <Box
                  key={i}
                  sx={{ p: 1.5, borderRadius: '6px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: doc.motivo ? 0.5 : 0 }}>
                    <Block sx={{ fontSize: 14, color: '#DC2626' }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#991B1B' }}>
                      DOC BLOQUEADO — {doc.tipo}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>· {doc.orgao}</Typography>
                  </Box>
                  {doc.motivo && (
                    <Typography
                      sx={{ fontSize: '12px', color: '#DC2626', mb: doc.pendencias.length > 0 ? 0.5 : 0 }}
                    >
                      {doc.motivo}
                    </Typography>
                  )}
                  {doc.pendencias.map((p, j) => (
                    <Chip
                      key={j}
                      label={p.descricao}
                      size="small"
                      sx={{
                        mr: 0.5,
                        mt: 0.5,
                        fontSize: '11px',
                        backgroundColor: p.severidade === 'alta' ? '#FEE2E2' : '#FFFBEB',
                        color: p.severidade === 'alta' ? '#991B1B' : '#92400E',
                        border: `1px solid ${p.severidade === 'alta' ? '#FECACA' : '#FDE68A'}`,
                      }}
                    />
                  ))}
                </Box>
              ))}

              {a.tarefasAtrasadas.map((t, i) => (
                <Box
                  key={i}
                  sx={{ p: 1.5, borderRadius: '6px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Schedule sx={{ fontSize: 14, color: '#D97706' }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>
                      TAREFA ATRASADA — {t.titulo}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '12px', color: '#B45309' }}>
                    Vencimento: {formatDate(t.vencimento)} · Responsável: {t.responsavel}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}

        {alertasPorEmpresa.length === 0 && (
          <Paper
            variant="outlined"
            sx={{ p: 6, textAlign: 'center', borderColor: '#E5E7EB', borderRadius: '8px' }}
          >
            <Typography sx={{ fontSize: '16px', color: '#9CA3AF', fontStyle: 'italic' }}>
              Nenhum alerta crítico encontrado no portfólio.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
