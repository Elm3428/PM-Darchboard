
import React, { useState } from 'react';
import { Service, Project, Client, Collaborator } from '../types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Props {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  projects: Project[];
  clients: Client[];
  collaborators: Collaborator[];
}

export default function ServicesView({ services, setServices, projects, clients, collaborators }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('Excluir este serviço?')) setServices(services.filter(s => s.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Service = {
      id: editingService ? editingService.id : Date.now(),
      projectId: Number(formData.get('projectId')),
      clientId: Number(formData.get('clientId')),
      collaboratorId: Number(formData.get('collaboratorId')),
      date: formData.get('date') as string,
      dailyValue: Number(formData.get('dailyValue')),
      isPaid: editingService ? editingService.isPaid : false,
    };
    if (editingService) setServices(services.map(s => s.id === editingService.id ? data : s));
    else setServices([...services, data]);
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Serviços Executados</h3>
        <button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-200">
          <Plus size={20} /> Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Projeto / Cliente</th>
              <th className="px-6 py-4">Colaborador</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Diária</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 border-b last:border-0">
                <td className="px-6 py-4 text-slate-400">#{s.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold">{projects.find(p => p.id === s.projectId)?.description}</div>
                  <div className="text-xs text-slate-500">{clients.find(c => c.id === s.clientId)?.name}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{collaborators.find(c => c.id === s.collaboratorId)?.name}</td>
                <td className="px-6 py-4 text-sm">{new Date(s.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">R$ {s.dailyValue.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setEditingService(s); setIsModalOpen(true); }} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-6">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Projeto</label>
                  <select name="projectId" required defaultValue={editingService?.projectId} className="w-full px-3 py-2 border rounded-lg">
                    {projects.map(p => <option key={p.id} value={p.id}>{p.description}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Cliente</label>
                  <select name="clientId" required defaultValue={editingService?.clientId} className="w-full px-3 py-2 border rounded-lg">
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Colaborador</label>
                  <select name="collaboratorId" required defaultValue={editingService?.collaboratorId} className="w-full px-3 py-2 border rounded-lg">
                    {collaborators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Data</label>
                  <input name="date" type="date" required defaultValue={editingService?.date} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Valor da Diária (R$)</label>
                <input name="dailyValue" type="number" step="0.01" required defaultValue={editingService?.dailyValue} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
