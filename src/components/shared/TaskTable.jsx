import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { PlayArrow, Check, Person } from '@mui/icons-material';
import { StatusChip } from './StatusChip';
import { AssignDialog } from './AssignDialog';
import { useApp } from '../../context/AppContext';

export const TaskTable = ({ tarefas, mostrarAcoes = true }) => {
  const { executarTarefa, validarTarefa, atribuirResponsavelTarefa, data } = useApp();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const getColaborador = (colabId) => {
    return data.catalogos.colaboradores.find((c) => c.id === colabId);
  };

  const handleOpenAssign = (tarefa) => {
    setSelectedTask(tarefa);
    setAssignDialogOpen(true);
  };

  const handleConfirmAssign = (colabId) => {
    if (selectedTask) {
      atribuirResponsavelTarefa(selectedTask.id, colabId);
    }
    setAssignDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Tarefa</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vencimento</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Responsável</TableCell>
              {mostrarAcoes && <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tarefas.map((tarefa) => {
              const colab = getColaborador(tarefa.responsavel_id);
              return (
                <TableRow key={tarefa.id} hover>
                  <TableCell>
                    <Box>
                      <Box sx={{ fontWeight: 500, mb: 0.5 }}>{tarefa.titulo}</Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {tarefa.externo && (
                          <Chip
                            label="Prestador externo"
                            size="small"
                            sx={{
                              fontSize: '10px',
                              height: '18px',
                              backgroundColor: '#DBEAFE',
                              color: '#1E40AF',
                            }}
                          />
                        )}
                        {tarefa.cliente_executa && (
                          <Chip
                            label="Executado pelo cliente"
                            size="small"
                            sx={{
                              fontSize: '10px',
                              height: '18px',
                              backgroundColor: '#FEF3C7',
                              color: '#92400E',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(tarefa.vencimento).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <StatusChip status={tarefa.status} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 22, height: 22, fontSize: '12px' }}>
                        {colab?.nome?.charAt(0)}
                      </Avatar>
                      <span>{colab?.nome}</span>
                    </Box>
                  </TableCell>
                  {mostrarAcoes && (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {(tarefa.status === 'Pendente' || tarefa.status === 'Atrasado') && (
                          <Tooltip title="Executar">
                            <IconButton
                              size="small"
                              onClick={() => executarTarefa(tarefa.id)}
                              sx={{ color: '#2563EB' }}
                            >
                              <PlayArrow fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {tarefa.status === 'Aguardando Validação' && (
                          <Tooltip title="Validar">
                            <IconButton
                              size="small"
                              onClick={() => validarTarefa(tarefa.id)}
                              sx={{ color: '#059669' }}
                            >
                              <Check fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Reatribuir">
                          <IconButton size="small" onClick={() => handleOpenAssign(tarefa)}>
                            <Person fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedTask && (
        <AssignDialog
          open={assignDialogOpen}
          onClose={() => setAssignDialogOpen(false)}
          currentColabId={selectedTask.responsavel_id}
          onConfirmar={handleConfirmAssign}
        />
      )}
    </>
  );
};
