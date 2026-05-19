import { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { StatusChip } from '../../components/shared/StatusChip';
import { useApp } from '../../context/AppContext';

export const Calendar = () => {
  const { data } = useApp();
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());

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
            tarefasDoMes.push({ ...t, empresa: emp.nome_fantasia });
          }
        });
      });
    });
  });

  const getTarefasDia = (dia) => {
    return tarefasDoMes.filter((t) => new Date(t.vencimento).getDate() === dia);
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
                sx={{
                  minHeight: 90,
                  p: 1,
                  borderColor: isHoje(dia) ? '#1565C0' : '#E5E7EB',
                  borderWidth: isHoje(dia) ? 2 : 1,
                  borderRadius: '3px',
                }}
              >
                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>{dia}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {visibles.map((t, tidx) => (
                    <Tooltip key={tidx} title={`${t.empresa} · ${t.titulo} · ${data.catalogos.colaboradores.find(c => c.id === t.responsavel_id)?.nome}`}>
                      <Box>
                        <StatusChip status={t.status} />
                      </Box>
                    </Tooltip>
                  ))}
                  {tarefas.length > 3 && (
                    <Typography sx={{ fontSize: '11px', color: '#9CA3AF', mt: 0.5 }}>
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
