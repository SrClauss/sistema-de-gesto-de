import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Pencil, Trash2, Tag } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function CategoriasModule() {
  const { data, setData } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#3B82F6',
  });

  const categorias = data.catalogos.categorias || [];

  const handleOpenDialog = (categoria = null) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao,
        cor: categoria.cor,
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nome: '',
        descricao: '',
        cor: '#3B82F6',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome) {
      toast.error('Preencha o nome da categoria');
      return;
    }

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (editingCategoria) {
        newData.catalogos.categorias = newData.catalogos.categorias.map((cat) =>
          cat.id === editingCategoria.id ? { ...cat, ...formData } : cat
        );
        toast.success('Categoria atualizada com sucesso');
      } else {
        const newCategoria = {
          id: `cat_${Date.now()}`,
          ...formData,
        };
        newData.catalogos.categorias.push(newCategoria);
        toast.success('Categoria cadastrada com sucesso');
      }
      
      return newData;
    });

    setDialogOpen(false);
  };

  const handleDelete = (categoriaId) => {
    const empresasComCategoria = data.empresas.filter(emp => emp.categoria_id === categoriaId);
    if (empresasComCategoria.length > 0) {
      toast.error('Não é possível excluir uma categoria em uso por empresas');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.catalogos.categorias = newData.catalogos.categorias.filter(
        (cat) => cat.id !== categoriaId
      );
      toast.success('Categoria excluída com sucesso');
      return newData;
    });
  };

  const getEmpresasCount = (categoriaId) => {
    return data.empresas.filter(emp => emp.categoria_id === categoriaId).length;
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Tag size={32} weight="duotone" className="text-primary" />
            Cadastro de Categorias
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize empresas por categorias de documentos e condicionantes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="lg">
          <Plus size={20} weight="bold" />
          Nova Categoria
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Empresas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell className="font-medium">{categoria.nome}</TableCell>
                <TableCell>{categoria.descricao}</TableCell>
                <TableCell>
                  <Badge
                    style={{ backgroundColor: categoria.cor, color: '#fff' }}
                    className="font-medium"
                  >
                    {categoria.cor}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getEmpresasCount(categoria.id)} empresas
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(categoria)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(categoria.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categorias.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhuma categoria cadastrada
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
              {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              Defina as informações da categoria
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Licenças Ambientais"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição da categoria"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="cor">Cor</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="cor"
                  type="color"
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
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
