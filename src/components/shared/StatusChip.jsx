import { Chip } from '@mui/material';

export const StatusChip = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'Pendente':
        return { color: 'default', variant: 'outlined' };
      case 'Concluído':
        return { color: 'success', variant: 'filled' };
      case 'Aguardando Validação':
        return { color: 'warning', variant: 'filled' };
      case 'Aguardando Auditoria':
        return { color: 'info', variant: 'filled' };
      case 'Atrasado':
        return { color: 'error', variant: 'filled' };
      case 'Não Aplicável':
        return { color: 'default', variant: 'filled' };
      case 'Ativo':
        return { color: 'success', variant: 'outlined' };
      case 'Em Renovação':
        return { color: 'warning', variant: 'outlined' };
      default:
        return { color: 'default', variant: 'outlined' };
    }
  };

  const config = getConfig();

  return (
    <Chip
      label={status}
      color={config.color}
      variant={config.variant}
      size="small"
      sx={{ fontWeight: 500, fontSize: '12px' }}
    />
  );
};
