import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from '@phosphor-icons/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const periodicidadeOptions = [
  { value: 'diaria', label: 'Diária' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'bimestral', label: 'Bimestral' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
];

const tipoOptions = [
  { value: 'controle', label: 'Controle' },
  { value: 'treinamento', label: 'Treinamento' },
  { value: 'operacional', label: 'Operacional' },
  { value: 'auditoria', label: 'Auditoria' },
];

export function CondicionantesModule() {
  const { data, adicionarCondicionanteModelo, editarCondicionanteModelo, excluirCondicionanteModelo } = useContext(AppContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busca, setBusca] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    periodicidade: 'mensal',
    prazo_dias: 30,
    tipo: 'controle',
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      periodicidade: 'mensal',
      prazo_dias: 30,
      tipo: 'controle',
    });
    setEditando(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      editarCondicionanteModelo(editando.id, formData);
    } else {
      adicionarCondicionanteModelo(formData);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (cond) => {
    setEditando(cond);
    setFormData({
      nome: cond.nome,
      descricao: cond.descricao || '',
      periodicidade: cond.periodicidade,
      prazo_dias: cond.prazo_dias,
      tipo: cond.tipo,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta condicionante modelo?')) {
      excluirCondicionanteModelo(id);
    }
  };

  const condicionantesFiltrados = (data.catalogos.condicionantes_modelo || []).filter(cond =>
    cond.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (cond.descricao && cond.descricao.toLowerCase().includes(busca.toLowerCase())) ||
    cond.tipo.toLowerCase().includes(busca.toLowerCase())
  );

  const getTipoBadgeVariant = (tipo) => {
    const variants = {
      controle: 'default',
      treinamento: 'secondary',
      operacional: 'outline',
      auditoria: 'destructive',
    };
    return variants[tipo] || 'default';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Condicionantes Modelo</h2>
          <p className="text-sm text-[#6B7280] mt-1">Gerencie as condicionantes e requisitos do sistema</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Nova Condicionante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editando ? 'Editar Condicionante' : 'Nova Condicionante'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome da Condicionante *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Mapa de Vencidos"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição detalhada da condicionante"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="periodicidade">Periodicidade *</Label>
                    <Select
                      value={formData.periodicidade}
                      onValueChange={(value) => setFormData({ ...formData, periodicidade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {periodicidadeOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="prazo">Prazo (dias) *</Label>
                    <Input
                      id="prazo"
                      type="number"
                      min="1"
                      value={formData.prazo_dias}
                      onChange={(e) => setFormData({ ...formData, prazo_dias: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editando ? 'Salvar Alterações' : 'Criar Condicionante'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar condicionantes..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Periodicidade</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {condicionantesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {busca ? 'Nenhuma condicionante encontrada' : 'Nenhuma condicionante cadastrada'}
                </TableCell>
              </TableRow>
            ) : (
              condicionantesFiltrados.map((cond) => (
                <TableRow key={cond.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{cond.nome}</div>
                      {cond.descricao && (
                        <div className="text-xs text-muted-foreground mt-1">{cond.descricao}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {periodicidadeOptions.find(p => p.value === cond.periodicidade)?.label || cond.periodicidade}
                  </TableCell>
                  <TableCell>{cond.prazo_dias} dias</TableCell>
                  <TableCell>
                    <Badge variant={getTipoBadgeVariant(cond.tipo)}>
                      {tipoOptions.find(t => t.value === cond.tipo)?.label || cond.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(cond)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cond.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
