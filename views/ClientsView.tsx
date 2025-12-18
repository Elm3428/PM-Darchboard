
import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export default function ClientsView({ clients, setClients }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este cliente?')) {
      setClients(clients.filter(c => c.id !== id));
    }
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
      setClients(clients.map(c => c.id === editingClient.id ? clientData : c));
    } else {
      setClients([...clients, clientData]);
    }

    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Gerenciamento de Clientes</h3>
        <button 
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-teal-200"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold">Empresa</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Telefone</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.length > 0 ? clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">#{client.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{client.company}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{client.phone}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => { setEditingClient(client); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md transition-all">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Nenhum cliente cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input name="name" required defaultValue={editingClient?.name || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Empresa</label>
                <input name="company" required defaultValue={editingClient?.company || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input name="email" type="email" required defaultValue={editingClient?.email || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telefone</label>
                  <input name="phone" required defaultValue={editingClient?.phone || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
