import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from '@mui/material';
import { useApp } from '../../context/AppContext';

export const AssignDialog = ({ open, onClose, currentColabId, onConfirmar }) => {
  const { data } = useApp();
  const colaboradores = data.catalogos.colaboradores;
  const currentColab = colaboradores.find((c) => c.id === currentColabId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reatribuir Responsável</DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Responsável atual: {currentColab?.nome}
        </Typography>
        <List>
          {colaboradores.map((colab) => (
            <ListItemButton
              key={colab.id}
              onClick={() => onConfirmar(colab.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#2563EB' }}>{colab.nome.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={colab.nome}
                secondary={colab.papel.charAt(0).toUpperCase() + colab.papel.slice(1)}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
