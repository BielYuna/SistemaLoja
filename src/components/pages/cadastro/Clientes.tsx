import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999', cpf: '123.456.789-00', endereco: 'Rua A, 123' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 88888-8888', cpf: '987.654.321-00', endereco: 'Rua B, 456' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(11) 77777-7777', cpf: '456.789.123-00', endereco: 'Rua C, 789' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: ''
  });

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCliente) {
      setClientes(prev => prev.map(cliente => 
        cliente.id === editingCliente.id 
          ? { ...cliente, ...formData }
          : cliente
      ));
      toast.success('Cliente atualizado com sucesso!');
    } else {
      const novoCliente: Cliente = {
        id: Date.now(),
        ...formData
      };
      setClientes(prev => [...prev, novoCliente]);
      toast.success('Cliente cadastrado com sucesso!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', email: '', telefone: '', cpf: '', endereco: '' });
    setEditingCliente(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
      endereco: cliente.endereco
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== id));
    toast.success('Cliente removido com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingCliente ? 'Edite as informações do cliente' : 'Preencha os dados do novo cliente'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingCliente ? 'Atualizar' : 'Cadastrar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Todos os clientes cadastrados</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cliente)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;