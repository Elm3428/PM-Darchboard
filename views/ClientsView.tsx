
import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Pencil, Trash2, X, Search, UserCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export default function ClientsView({ clients, setClients }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setClients(prev => prev.filter(c => c.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const clientData: Client = {
      id: editingClient ? editingClient.id : Date.now(),
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? clientData : c));
    } else {
      setClients(prev => [...prev, clientData]);
    }

    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou empresa..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-100 uppercase text-xs tracking-widest"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-200 font-black">
                <th className="px-6 py-5">Identificação</th>
                <th className="px-6 py-5">Empresa / Negócio</th>
                <th className="px-6 py-5">Contato</th>
                <th className="px-6 py-5 text-right">Gerenciamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length > 0 ? filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{client.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">#{client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-semibold">{client.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{client.email}</p>
                    <p className="text-xs text-slate-400">{client.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        type="button"
                        onClick={() => { setEditingClient(client); setIsModalOpen(true); }} 
                        className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDeleteConfirmId(client.id)} 
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    <UserCircle2 size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold">Nenhum cliente cadastrado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Exclusão */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-[110] text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Remover Cliente?</h3>
            <p className="text-sm text-slate-500 mb-6">Esta operação é irreversível e excluirá permanentemente o cliente da sua lista.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase">Sair</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase">Excluir Agora</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-[70] overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 font-black tracking-tight">
              <h3>{editingClient ? 'Atualizar Dados' : 'Novo Cliente'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Responsável</label>
                <input name="name" required defaultValue={editingClient?.name || ''} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-semibold" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</label>
                <input name="company" required defaultValue={editingClient?.company || ''} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-semibold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                  <input name="email" type="email" required defaultValue={editingClient?.email || ''} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none transition-all font-semibold" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefone</label>
                  <input name="phone" required defaultValue={editingClient?.phone || ''} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none transition-all font-semibold" />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
