import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  Avatar,
  Box,
  Typography,
  FormControl,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Business,
  CalendarMonth,
  Assignment,
  Settings,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const DRAWER_WIDTH = 220;

export const Shell = ({ children }) => {
  const { modulo, setModulo, colaboradorLogado, setColaboradorLogado, data } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItems = () => {
    if (modulo === 'gerencial') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
        { id: 'carteira', label: 'Carteira', icon: <Business /> },
        { id: 'calendario', label: 'Calendário', icon: <CalendarMonth /> },
        { id: 'cadastros', label: 'Cadastros', icon: <Settings /> },
      ];
    } else if (modulo === 'colaborador') {
      return [{ id: 'minhas-tarefas', label: 'Minhas Tarefas', icon: <Assignment /> }];
    } else if (modulo === 'empresa') {
      return [{ id: 'portal', label: 'Minha Empresa', icon: <Business /> }];
    }
    return [];
  };

  const drawer = (
    <Box>
      <Box sx={{ height: 64 }} />
      <List>
        {getMenuItems().map((item) => (
          <ListItemButton
            key={item.id}
            selected={currentPage === item.id}
            onClick={() => {
              setCurrentPage(item.id);
              window.dispatchEvent(new CustomEvent('navigate', { detail: item.id }));
            }}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#E3F2FD',
                borderRight: '3px solid #1565C0',
                '&:hover': {
                  backgroundColor: '#BBDEFB',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: currentPage === item.id ? '#1565C0' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1565C0' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Gestão de Serviços Recorrentes
          </Typography>
          <FormControl size="small" sx={{ minWidth: 140, mr: 2 }}>
            <Select
              value={modulo}
              onChange={(e) => {
                const novoModulo = e.target.value;
                setModulo(novoModulo);
                
                const paginasPorModulo = {
                  gerencial: 'dashboard',
                  colaborador: 'minhas-tarefas',
                  empresa: 'portal',
                };
                
                const novaPagina = paginasPorModulo[novoModulo];
                setCurrentPage(novaPagina);
                window.dispatchEvent(new CustomEvent('navigate', { detail: novaPagina }));
              }}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value="gerencial">Gerencial</MenuItem>
              <MenuItem value="colaborador">Colaborador</MenuItem>
              <MenuItem value="empresa">Empresa</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160, mr: 2 }}>
            <Select
              value={colaboradorLogado.id}
              onChange={(e) => {
                const colab = data.catalogos.colaboradores.find((c) => c.id === e.target.value);
                setColaboradorLogado(colab);
              }}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              {data.catalogos.colaboradores.map((colab) => (
                <MenuItem key={colab.id} value={colab.id}>
                  {colab.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Avatar sx={{ bgcolor: '#0D47A1' }}>{colaboradorLogado.nome.charAt(0)}</Avatar>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
