import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Users } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function ColaboradoresModule() {
  const { data, setData } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingColab, setEditingColab] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    papel: 'staff',
  });

  const colaboradores = data.catalogos.colaboradores || [];

  const handleOpenDialog = (colab = null) => {
    if (colab) {
      setEditingColab(colab);
      setFormData({
        nome: colab.nome,
        papel: colab.papel,
      });
    } else {
      setEditingColab(null);
      setFormData({
        nome: '',
        papel: 'staff',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome) {
      toast.error('Preencha o nome do colaborador');
      return;
    }

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (editingColab) {
        newData.catalogos.colaboradores = newData.catalogos.colaboradores.map((col) =>
          col.id === editingColab.id ? { ...col, ...formData } : col
        );
        toast.success('Colaborador atualizado com sucesso');
      } else {
        const newColab = {
          id: `col_${Date.now()}`,
          ...formData,
        };
        newData.catalogos.colaboradores.push(newColab);
        toast.success('Colaborador cadastrado com sucesso');
      }
      
      return newData;
    });

    setDialogOpen(false);
  };

  const handleDelete = (colabId) => {
    const empresasComColab = data.empresas.filter(emp => emp.responsavel_principal_id === colabId);
    if (empresasComColab.length > 0) {
      toast.error('Não é possível excluir um colaborador responsável por empresas');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este colaborador?')) return;

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.catalogos.colaboradores = newData.catalogos.colaboradores.filter(
        (col) => col.id !== colabId
      );
      toast.success('Colaborador excluído com sucesso');
      return newData;
    });
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users size={32} weight="duotone" className="text-primary" />
            Cadastro de Colaboradores
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os colaboradores da equipe
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="lg">
          <Plus size={20} weight="bold" />
          Novo Colaborador
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradores.map((colab) => (
              <TableRow key={colab.id}>
                <TableCell className="font-medium">{colab.nome}</TableCell>
                <TableCell>
                  <Badge variant={colab.papel === 'gerente' ? 'default' : 'secondary'}>
                    {colab.papel}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(colab)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(colab.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {colaboradores.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Nenhum colaborador cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingColab ? 'Editar Colaborador' : 'Novo Colaborador'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do colaborador
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div>
              <Label htmlFor="papel">Papel *</Label>
              <Select
                value={formData.papel}
                onValueChange={(value) => setFormData({ ...formData, papel: value })}
              >
                <SelectTrigger id="papel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
