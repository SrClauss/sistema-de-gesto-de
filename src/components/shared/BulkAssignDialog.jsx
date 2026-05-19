import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useApp } from '../../context/AppContext';

export const BulkAssignDialog = ({ open, onClose }) => {
  const { data, atribuirEmMassa } = useApp();
  const [tipoId, setTipoId] = useState('');
  const [escopo, setEscopo] = useState('all');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [novoColabId, setNovoColabId] = useState('');

  const handleAtribuir = () => {
    if (!novoColabId) return;
    atribuirEmMassa({
      tipoId: tipoId || undefined,
      dataInicio,
      dataFim,
      novoColabId,
      escopo,
    });
    handleClose();
  };

  const handleClose = () => {
    setTipoId('');
    setEscopo('all');
    setDataInicio('');
    setDataFim('');
    setNovoColabId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Atribuição em Massa</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Tarefa (opcional)</InputLabel>
            <Select value={tipoId} onChange={(e) => setTipoId(e.target.value)} label="Tipo de Tarefa (opcional)">
              <MenuItem value="">
                <em>Todos os tipos</em>
              </MenuItem>
              {data.catalogos.tipos_tarefa.map((tipo) => (
                <MenuItem key={tipo.tipo_id} value={tipo.tipo_id}>
                  {tipo.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Escopo</InputLabel>
            <Select value={escopo} onChange={(e) => setEscopo(e.target.value)} label="Escopo">
              <MenuItem value="all">Todas as tarefas</MenuItem>
              <MenuItem value="future">Apenas tarefas futuras</MenuItem>
              <MenuItem value="period">Período específico</MenuItem>
            </Select>
          </FormControl>

          {escopo === 'period' && (
            <>
              <TextField
                label="Data Início"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
              <TextField
                label="Data Fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </>
          )}

          <FormControl fullWidth size="small" required>
            <InputLabel>Novo Responsável *</InputLabel>
            <Select value={novoColabId} onChange={(e) => setNovoColabId(e.target.value)} label="Novo Responsável *">
              {data.catalogos.colaboradores.map((colab) => (
                <MenuItem key={colab.id} value={colab.id}>
                  {colab.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary">
            Esta operação reatribuirá as tarefas correspondentes aos critérios selecionados.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleAtribuir}
          variant="contained"
          disabled={!novoColabId}
          sx={{ backgroundColor: '#1565C0', '&:hover': { backgroundColor: '#0D47A1' } }}
        >
          Atribuir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
