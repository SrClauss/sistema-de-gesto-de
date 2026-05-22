import { Paper, Box, Typography, Chip, Grid, Avatar, Button, Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, Block, Schedule, Business, ArrowForward } from '@mui/icons-material';
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

  // ── Dados de alertas ────────────────────────────────────────────────────────
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
      alertasPorEmpresa.push({ emp, docsBlock, tarefasAtrasadas, total: docsBlock.length + tarefasAtrasadas.length });
    }
  });
  alertasPorEmpresa.sort((a, b) => b.total - a.total);

  const maxTotal = alertasPorEmpresa.length > 0 ? Math.max(...alertasPorEmpresa.map((a) => a.total)) : 1;
  const totalDocsBlocked = alertasPorEmpresa.reduce((s, a) => s + a.docsBlock.length, 0);
  const totalAtrasadas = alertasPorEmpresa.reduce((s, a) => s + a.tarefasAtrasadas.length, 0);
  const grandTotal = totalDocsBlocked + totalAtrasadas;
  const blockedPct = grandTotal > 0 ? Math.round((totalDocsBlocked / grandTotal) * 100) : 0;
  const atrasadaPct = grandTotal > 0 ? 100 - blockedPct : 0;

  const navegarParaEmpresa = (emp) =>
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'carteira', empresa: emp } }));

  const formatDate = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');

  return (
    <Box>
      {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#111827', mb: 0.5 }}>
          Visão Executiva
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
          Acompanhamento em tempo real do portfólio regulatório
        </Typography>
      </Box>

      {/* ── KPIs ──────────────────────────────────────────────────────────── */}
      <Paper
        variant="outlined"
        sx={{ mb: 4, borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderRadius: '3px', display: 'flex' }}
      >
        {[
          { label: 'EMPRESAS ATIVAS', value: kpis.empresas, color: '#2563EB', trend: '+2' },
          { label: 'TAREFAS PENDENTES', value: kpis.pendentes, color: '#D97706', trend: '-3' },
          { label: 'TAREFAS ATRASADAS', value: kpis.atrasadas, color: '#DC2626', trend: '+1' },
          { label: 'CONCLUÍDAS (MÊS)', value: kpis.concluidas, color: '#059669', trend: '+12' },
        ].map((kpi, idx, arr) => (
          <Box
            key={kpi.label}
            sx={{ flex: 1, p: 4, borderRight: idx < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}
          >
            <Typography
              sx={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.4px', color: '#9CA3AF', fontWeight: 500, mb: 1 }}
            >
              {kpi.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '42px', fontWeight: 800, color: kpi.color }}>{kpi.value}</Typography>
              <Chip
                icon={kpi.trend.startsWith('+') && kpi.label !== 'TAREFAS ATRASADAS' ? <TrendingUp fontSize="inherit" /> : <TrendingDown fontSize="inherit" />}
                label={kpi.trend}
                size="small"
                sx={{
                  fontSize: '13px', height: '22px', fontWeight: 600,
                  backgroundColor: kpi.trend.startsWith('+') && kpi.label !== 'TAREFAS ATRASADAS' ? '#D1FAE5' : '#FEE2E2',
                  color: kpi.trend.startsWith('+') && kpi.label !== 'TAREFAS ATRASADAS' ? '#065F46' : '#991B1B',
                }}
              />
            </Box>
          </Box>
        ))}
      </Paper>

      {/* ── Gráfico de evolução + Donut ───────────────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper
            variant="outlined"
            sx={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderRadius: '3px', p: 3 }}
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
                        '&:hover': { backgroundColor: '#2563EB' },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
              {chartData.map((item, idx) => (
                <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderRadius: '3px', p: 3, height: '100%' }}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#374151', mb: 3 }}>
              Distribuição de Alertas
            </Typography>
            {grandTotal === 0 ? (
              <Typography sx={{ color: '#9CA3AF', fontStyle: 'italic', fontSize: '14px' }}>
                Nenhum alerta no portfólio
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 130, height: 130, borderRadius: '50%',
                      background: `conic-gradient(#DC2626 0% ${blockedPct}%, #F59E0B ${blockedPct}% 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 80, height: 80, borderRadius: '50%', backgroundColor: 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '22px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                        {grandTotal}
                      </Typography>
                      <Typography sx={{ fontSize: '10px', color: '#9CA3AF' }}>total</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { label: 'Docs Bloqueados', pct: blockedPct, color: '#DC2626' },
                    { label: 'Tarefas Atrasadas', pct: atrasadaPct, color: '#F59E0B' },
                  ].map((row) => (
                    <Box key={row.label}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: row.color }} />
                          <Typography sx={{ fontSize: '13px', color: '#374151' }}>{row.label}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{row.pct}%</Typography>
                      </Box>
                      <Box sx={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: `${row.pct}%`, height: '100%', backgroundColor: row.color, borderRadius: '3px' }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ── Seção Alertas Críticos ────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#111827', mb: 0.5 }}>
          Alertas Críticos
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
          Documentos bloqueados e tarefas atrasadas em todo o portfólio
        </Typography>
      </Box>

      {/* Cartões de resumo */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {[
          { icon: <Block sx={{ color: '#DC2626', fontSize: 34 }} />, value: totalDocsBlocked, label: 'Docs Bloqueados', numColor: '#DC2626', txtColor: '#991B1B', border: '#FECACA', bg: '#FEF2F2' },
          { icon: <Schedule sx={{ color: '#D97706', fontSize: 34 }} />, value: totalAtrasadas, label: 'Tarefas Atrasadas', numColor: '#D97706', txtColor: '#92400E', border: '#FDE68A', bg: '#FFFBEB' },
          { icon: <Business sx={{ color: '#7C3AED', fontSize: 34 }} />, value: alertasPorEmpresa.length, label: 'Empresas Afetadas', numColor: '#7C3AED', txtColor: '#5B21B6', border: '#E9D5FF', bg: '#FAF5FF' },
        ].map((card) => (
          <Paper
            key={card.label}
            variant="outlined"
            sx={{ flex: 1, p: 3, borderColor: card.border, backgroundColor: card.bg, borderRadius: '8px' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {card.icon}
              <Box>
                <Typography sx={{ fontSize: '38px', fontWeight: 800, color: card.numColor, lineHeight: 1 }}>
                  {card.value}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: card.txtColor, textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600 }}>
                  {card.label}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Ranking de alertas por empresa */}
      <Paper variant="outlined" sx={{ p: 3, borderColor: '#E5E7EB', borderRadius: '8px', mb: 4 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#374151', mb: 3 }}>
          Ranking de Alertas por Empresa
        </Typography>
        {alertasPorEmpresa.length === 0 ? (
          <Typography sx={{ color: '#9CA3AF', fontStyle: 'italic' }}>Nenhum alerta no momento.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {alertasPorEmpresa.map((a) => {
              const pctBlocked = (a.docsBlock.length / maxTotal) * 100;
              const pctAtrasada = (a.tarefasAtrasadas.length / maxTotal) * 100;
              return (
                <Box key={a.emp.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{ fontSize: '14px', fontWeight: 600, color: '#1565C0', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
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
                  <Box sx={{ display: 'flex', height: '14px', gap: '2px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                    {a.docsBlock.length > 0 && (
                      <Tooltip title={`${a.docsBlock.length} doc(s) bloqueado(s)`}>
                        <Box sx={{ width: `${pctBlocked}%`, backgroundColor: '#DC2626', minWidth: '4px' }} />
                      </Tooltip>
                    )}
                    {a.tarefasAtrasadas.length > 0 && (
                      <Tooltip title={`${a.tarefasAtrasadas.length} tarefa(s) atrasada(s)`}>
                        <Box sx={{ width: `${pctAtrasada}%`, backgroundColor: '#F59E0B', minWidth: '4px' }} />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              );
            })}
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              {[{ color: '#DC2626', label: 'Docs Bloqueados' }, { color: '#F59E0B', label: 'Tarefas Atrasadas' }].map((leg) => (
                <Box key={leg.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: leg.color, borderRadius: '2px' }} />
                  <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>{leg.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

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
                p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB',
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
                    <Typography sx={{ fontSize: '12px', color: '#DC2626', mb: doc.pendencias.length > 0 ? 0.5 : 0 }}>
                      {doc.motivo}
                    </Typography>
                  )}
                  {doc.pendencias.map((p, j) => (
                    <Chip
                      key={j}
                      label={p.descricao}
                      size="small"
                      sx={{
                        mr: 0.5, mt: 0.5, fontSize: '11px',
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
