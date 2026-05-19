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

export function DocumentosModule() {
  const { data, adicionarDocumentoModelo, editarDocumentoModelo, excluirDocumentoModelo } = useContext(AppContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busca, setBusca] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    orgao_emissor: '',
    validade_meses: 12,
    renovacao_antecedencia_dias: 30,
    obrigatorio: true,
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      orgao_emissor: '',
      validade_meses: 12,
      renovacao_antecedencia_dias: 30,
      obrigatorio: true,
    });
    setEditando(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      editarDocumentoModelo(editando.id, formData);
    } else {
      adicionarDocumentoModelo(formData);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (doc) => {
    setEditando(doc);
    setFormData({
      nome: doc.nome,
      descricao: doc.descricao || '',
      orgao_emissor: doc.orgao_emissor,
      validade_meses: doc.validade_meses,
      renovacao_antecedencia_dias: doc.renovacao_antecedencia_dias,
      obrigatorio: doc.obrigatorio,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este documento modelo?')) {
      excluirDocumentoModelo(id);
    }
  };

  const documentosFiltrados = (data.catalogos.documentos_modelo || []).filter(doc =>
    doc.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (doc.descricao && doc.descricao.toLowerCase().includes(busca.toLowerCase())) ||
    doc.orgao_emissor.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Documentos Modelo</h2>
          <p className="text-sm text-[#6B7280] mt-1">Gerencie os tipos de documentos do sistema</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editando ? 'Editar Documento' : 'Novo Documento'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome do Documento *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Alvará Sanitário"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição detalhada do documento"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="orgao">Órgão Emissor *</Label>
                  <Input
                    id="orgao"
                    value={formData.orgao_emissor}
                    onChange={(e) => setFormData({ ...formData, orgao_emissor: e.target.value })}
                    placeholder="Ex: Vigilância Sanitária"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="validade">Validade (meses) *</Label>
                    <Input
                      id="validade"
                      type="number"
                      min="1"
                      value={formData.validade_meses}
                      onChange={(e) => setFormData({ ...formData, validade_meses: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="antecedencia">Antecedência Renovação (dias) *</Label>
                    <Input
                      id="antecedencia"
                      type="number"
                      min="1"
                      value={formData.renovacao_antecedencia_dias}
                      onChange={(e) => setFormData({ ...formData, renovacao_antecedencia_dias: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="obrigatorio">Obrigatoriedade</Label>
                  <Select
                    value={formData.obrigatorio ? 'sim' : 'nao'}
                    onValueChange={(value) => setFormData({ ...formData, obrigatorio: value === 'sim' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Obrigatório</SelectItem>
                      <SelectItem value="nao">Opcional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editando ? 'Salvar Alterações' : 'Criar Documento'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar documentos..."
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
              <TableHead>Órgão Emissor</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Renovação</TableHead>
              <TableHead>Obrigatoriedade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {busca ? 'Nenhum documento encontrado' : 'Nenhum documento cadastrado'}
                </TableCell>
              </TableRow>
            ) : (
              documentosFiltrados.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{doc.nome}</div>
                      {doc.descricao && (
                        <div className="text-xs text-muted-foreground mt-1">{doc.descricao}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{doc.orgao_emissor}</TableCell>
                  <TableCell>{doc.validade_meses} meses</TableCell>
                  <TableCell>{doc.renovacao_antecedencia_dias} dias</TableCell>
                  <TableCell>
                    <Badge variant={doc.obrigatorio ? 'default' : 'secondary'}>
                      {doc.obrigatorio ? 'Obrigatório' : 'Opcional'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
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
