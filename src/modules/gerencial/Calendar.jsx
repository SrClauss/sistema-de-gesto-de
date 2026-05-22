import { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, Button, Avatar } from '@mui/material';
import { ChevronLeft, ChevronRight, ArrowBack, ArrowForward } from '@mui/icons-material';
import { StatusChip } from '../../components/shared/StatusChip';
import { useApp } from '../../context/AppContext';

export const Calendar = () => {
  const { data } = useApp();
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [diaDetalhe, setDiaDetalhe] = useState(null);

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  const tarefasDoMes = [];
  data.empresas.forEach((emp) => {
    emp.projetos.forEach((prj) => {
      prj.documentos.forEach((doc) => {
        doc.tarefas.forEach((t) => {
          const venc = new Date(t.vencimento);
          if (venc.getMonth() === mes && venc.getFullYear() === ano) {
            tarefasDoMes.push({ ...t, empresa: emp.nome_fantasia, empresaObj: emp });
          }
        });
      });
    });
  });

  const getTarefasDia = (dia) => {
    return tarefasDoMes.filter((t) => new Date(t.vencimento).getDate() === dia);
  };

  const navegarParaEmpresa = (emp) => {
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { view: 'carteira', empresa: emp } })
    );
  };

  const handlePrevMonth = () => {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  };

  const handleNextMonth = () => {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  };

  const hoje = new Date();
  const isHoje = (dia) => {
    return dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
  };

  const dias = [];
  for (let i = 0; i < primeiroDia; i++) {
    dias.push(null);
  }
  for (let i = 1; i <= ultimoDia; i++) {
    dias.push(i);
  }

  // ── Tela de detalhe do dia ──────────────────────────────────────────────────
  if (diaDetalhe) {
    const porEmpresa = {};
    diaDetalhe.tarefas.forEach((t) => {
      const key = t.empresaObj.id;
      if (!porEmpresa[key]) porEmpresa[key] = { emp: t.empresaObj, tarefas: [] };
      porEmpresa[key].tarefas.push(t);
    });

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton onClick={() => setDiaDetalhe(null)} sx={{ border: '1px solid #E5E7EB' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
              {diaDetalhe.dia} de {meses[mes]} de {ano}
            </Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
              {diaDetalhe.tarefas.length} tarefa{diaDetalhe.tarefas.length !== 1 ? 's' : ''} com vencimento neste dia
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.values(porEmpresa).map((grupo) => (
            <Paper
              key={grupo.emp.id}
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
                  <Avatar sx={{ bgcolor: '#1565C0', width: 34, height: 34, fontSize: '14px' }}>
                    {grupo.emp.nome_fantasia.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                      {grupo.emp.nome_fantasia}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                      {grupo.emp.segmento} · {grupo.emp.cidade}/{grupo.emp.uf}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navegarParaEmpresa(grupo.emp)}
                  sx={{ textTransform: 'none', borderColor: '#1565C0', color: '#1565C0', whiteSpace: 'nowrap' }}
                >
                  Ver empresa
                </Button>
              </Box>

              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {grupo.tarefas.map((t) => (
                  <Box
                    key={t.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: '6px',
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111827', mb: 0.3 }}>
                        {t.titulo}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                        Resp.: {data.catalogos.colaboradores.find((c) => c.id === t.responsavel_id)?.nome || '—'}
                        {t.valor_estimado > 0 && ` · R$ ${t.valor_estimado.toLocaleString('pt-BR')}`}
                      </Typography>
                    </Box>
                    <StatusChip status={t.status} />
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }
  // ── Fim tela de detalhe ─────────────────────────────────────────────────────

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
          Calendário da Equipe
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
            {meses[mes]} {ano}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderRadius: '3px', p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
          {diasSemana.map((d) => (
            <Box key={d} sx={{ textAlign: 'center', fontWeight: 600, fontSize: '14px', color: '#6B7280', py: 1 }}>
              {d}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {dias.map((dia, idx) => {
            if (!dia) return <Box key={`empty-${idx}`} />;
            const tarefas = getTarefasDia(dia);
            const visibles = tarefas.slice(0, 3);
            return (
              <Paper
                key={dia}
                variant="outlined"
                onClick={() => tarefas.length > 0 && setDiaDetalhe({ dia, tarefas })}
                sx={{
                  minHeight: 90,
                  p: 1,
                  borderColor: isHoje(dia) ? '#1565C0' : '#E5E7EB',
                  borderWidth: isHoje(dia) ? 2 : 1,
                  borderRadius: '3px',
                  cursor: tarefas.length > 0 ? 'pointer' : 'default',
                  transition: 'background-color 0.15s',
                  '&:hover': tarefas.length > 0
                    ? { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' }
                    : {},
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{dia}</Typography>
                  {tarefas.length > 0 && (
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#1565C0' }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {visibles.map((t, tidx) => (
                    <Tooltip key={tidx} title={`${t.empresa} · ${t.titulo} · ${data.catalogos.colaboradores.find(c => c.id === t.responsavel_id)?.nome}`}>
                      <Box>
                        <StatusChip status={t.status} />
                      </Box>
                    </Tooltip>
                  ))}
                  {tarefas.length > 3 && (
                    <Typography sx={{ fontSize: '11px', color: '#1565C0', mt: 0.5, fontWeight: 600 }}>
                      +{tarefas.length - 3} mais
                    </Typography>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};
