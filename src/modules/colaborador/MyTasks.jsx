import { Box, Typography, Tabs, Tab, Badge, Paper } from '@mui/material';
import { useState } from 'react';
import { TaskTable } from '../../components/shared/TaskTable';
import { useApp } from '../../context/AppContext';

export const MyTasks = () => {
  const { data, colaboradorLogado } = useApp();
  const [tab, setTab] = useState(0);

  const minhasTarefas = [];
  data.empresas.forEach((emp) => {
    emp.projetos.forEach((prj) => {
      prj.documentos.forEach((doc) => {
        doc.tarefas.forEach((t) => {
          if (t.responsavel_id === colaboradorLogado.id) {
            minhasTarefas.push({ ...t, empresa: emp.nome_fantasia });
          }
        });
      });
    });
  });

  const aFazer = minhasTarefas.filter((t) => t.status === 'Pendente' || t.status === 'Atrasado');
  const emRevisao = minhasTarefas.filter((t) => t.status.startsWith('Aguardando'));
  const concluidas = minhasTarefas.filter((t) => t.status === 'Concluído');

  const tabData = [
    { label: 'A Fazer', tarefas: aFazer },
    { label: 'Em Revisão', tarefas: emRevisao },
    { label: 'Concluídas', tarefas: concluidas },
  ];

  const currentTarefas = tabData[tab].tarefas;

  return (
    <Box>
      <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#111827', mb: 4 }}>
        Minhas Tarefas
      </Typography>

      <Paper
        variant="outlined"
        sx={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderRadius: '3px' }}
      >
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ borderBottom: '1px solid #E5E7EB' }}>
          {tabData.map((t, idx) => (
            <Tab
              key={idx}
              label={
                <Badge badgeContent={t.tarefas.length} color="primary">
                  {t.label}
                </Badge>
              }
            />
          ))}
        </Tabs>
        <Box sx={{ p: 2 }}>
          {currentTarefas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>
                Você não tem tarefas nesta categoria
              </Typography>
            </Box>
          ) : (
            <TaskTable tarefas={currentTarefas} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};
