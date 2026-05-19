import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility, Person } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { BulkAssignDialog } from '../../components/shared/BulkAssignDialog';

export const ProjectList = ({ onSelectEmpresa }) => {
  const { data } = useApp();
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

  const filteredEmpresas = data.empresas.filter((emp) => {
    const termo = busca.toLowerCase();
    return (
      emp.nome_fantasia.toLowerCase().includes(termo) ||
      emp.razao_social.toLowerCase().includes(termo) ||
      emp.segmento.toLowerCase().includes(termo)
    );
  });

  const paginatedEmpresas = filteredEmpresas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getAlertas = (empresa) => {
    let atrasadas = 0;
    let bloqueadas = 0;
    empresa.projetos.forEach((prj) => {
      prj.documentos.forEach((doc) => {
        if (!doc.prereq_ok) bloqueadas++;
        doc.tarefas.forEach((t) => {
          if (t.status === 'Atrasado') atrasadas++;
        });
      });
    });
    return { atrasadas, bloqueadas };
  };

  const getColaborador = (colabId) => {
    return data.catalogos.colaboradores.find((c) => c.id === colabId);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Buscar por nome ou segmento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          size="small"
          sx={{ width: 400 }}
        />
        <Button
          variant="contained"
          onClick={() => setBulkDialogOpen(true)}
          sx={{ backgroundColor: '#1565C0', '&:hover': { backgroundColor: '#0D47A1' } }}
        >
          Atribuição em Massa
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderRadius: '3px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Empresa</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Segmento</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>UF</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Responsável</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Alertas</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmpresas.map((emp) => {
              const alertas = getAlertas(emp);
              const colab = getColaborador(emp.responsavel_principal_id);
              return (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <Box>
                      <Box sx={{ fontWeight: 500 }}>{emp.nome_fantasia}</Box>
                      <Box sx={{ fontSize: '12px', color: '#6B7280' }}>{emp.razao_social}</Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={emp.segmento} variant="outlined" size="small" />
                  </TableCell>
                  <TableCell>{emp.uf}</TableCell>
                  <TableCell>{colab?.nome || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {alertas.atrasadas > 0 && (
                        <Chip
                          label={`${alertas.atrasadas} atrasadas`}
                          size="small"
                          sx={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      )}
                      {alertas.bloqueadas > 0 && (
                        <Chip
                          label={`${alertas.bloqueadas} bloqueadas`}
                          size="small"
                          sx={{
                            backgroundColor: '#FFEDD5',
                            color: '#9A3412',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Ver detalhe">
                        <IconButton size="small" onClick={() => onSelectEmpresa(emp)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reatribuir">
                        <IconButton size="small">
                          <Person fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredEmpresas.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </TableContainer>

      <BulkAssignDialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)} />
    </Box>
  );
};
