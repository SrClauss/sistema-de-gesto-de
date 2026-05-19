import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Pencil, Trash2, Building2 } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function EmpresasModule() {
  const { data, setData } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    cidade: '',
    uf: '',
    segmento: '',
    responsavel_principal_id: '',
    categoria_id: '',
  });

  const categorias = data.catalogos.categorias || [];
  const colaboradores = data.catalogos.colaboradores || [];
  const empresas = data.empresas || [];

  const handleOpenDialog = (empresa = null) => {
    if (empresa) {
      setEditingEmpresa(empresa);
      setFormData({
        razao_social: empresa.razao_social,
        nome_fantasia: empresa.nome_fantasia,
        cnpj: empresa.cnpj,
        cidade: empresa.cidade,
        uf: empresa.uf,
        segmento: empresa.segmento,
        responsavel_principal_id: empresa.responsavel_principal_id,
        categoria_id: empresa.categoria_id || '',
      });
    } else {
      setEditingEmpresa(null);
      setFormData({
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        cidade: '',
        uf: '',
        segmento: '',
        responsavel_principal_id: '',
        categoria_id: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.razao_social || !formData.cnpj || !formData.categoria_id) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (editingEmpresa) {
        newData.empresas = newData.empresas.map((emp) =>
          emp.id === editingEmpresa.id ? { ...emp, ...formData } : emp
        );
        toast.success('Empresa atualizada com sucesso');
      } else {
        const newEmpresa = {
          id: `emp_${Date.now()}`,
          ...formData,
          projetos: [],
        };
        newData.empresas.push(newEmpresa);
        toast.success('Empresa cadastrada com sucesso');
      }
      
      return newData;
    });

    setDialogOpen(false);
  };

  const handleDelete = (empresaId) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;

    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.empresas = newData.empresas.filter((emp) => emp.id !== empresaId);
      toast.success('Empresa excluída com sucesso');
      return newData;
    });
  };

  const getCategoriaById = (id) => {
    return categorias.find((cat) => cat.id === id);
  };

  const getColaboradorById = (id) => {
    return colaboradores.find((col) => col.id === id);
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Building2 size={32} weight="duotone" className="text-primary" />
            Cadastro de Empresas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as empresas clientes e suas informações
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="lg">
          <Plus size={20} weight="bold" />
          Nova Empresa
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Razão Social</TableHead>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Cidade/UF</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((empresa) => {
              const categoria = getCategoriaById(empresa.categoria_id);
              const responsavel = getColaboradorById(empresa.responsavel_principal_id);
              
              return (
                <TableRow key={empresa.id}>
                  <TableCell className="font-medium">{empresa.razao_social}</TableCell>
                  <TableCell>{empresa.nome_fantasia}</TableCell>
                  <TableCell className="font-mono text-sm">{empresa.cnpj}</TableCell>
                  <TableCell>
                    {categoria && (
                      <Badge
                        style={{ backgroundColor: categoria.cor, color: '#fff' }}
                        className="font-medium"
                      >
                        {categoria.nome}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{empresa.cidade}/{empresa.uf}</TableCell>
                  <TableCell>{responsavel?.nome || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(empresa)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(empresa.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {empresas.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhuma empresa cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da empresa
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="razao_social">Razão Social *</Label>
              <Input
                id="razao_social"
                value={formData.razao_social}
                onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                placeholder="Empresa LTDA"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
              <Input
                id="nome_fantasia"
                value={formData.nome_fantasia}
                onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
                placeholder="Nome comercial"
              />
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div>
              <Label htmlFor="categoria_id">Categoria *</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
              >
                <SelectTrigger id="categoria_id">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="São Paulo"
              />
            </div>

            <div>
              <Label htmlFor="uf">UF</Label>
              <Input
                id="uf"
                value={formData.uf}
                onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                placeholder="SP"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="segmento">Segmento</Label>
              <Input
                id="segmento"
                value={formData.segmento}
                onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                placeholder="Indústria, Comércio, etc"
              />
            </div>

            <div>
              <Label htmlFor="responsavel_principal_id">Responsável Principal</Label>
              <Select
                value={formData.responsavel_principal_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, responsavel_principal_id: value })
                }
              >
                <SelectTrigger id="responsavel_principal_id">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {colaboradores.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.nome}
                    </SelectItem>
                  ))}
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
