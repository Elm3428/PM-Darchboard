
import React, { useState } from 'react';
import { Service, Project, Client, Collaborator } from '../types';
import { Plus, Pencil, Trash2, X, Wrench, Briefcase } from 'lucide-react';

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
    if (confirm('Deseja excluir este registro de serviço?')) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
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
    
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? data : s));
    } else {
      setServices(prev => [...prev, data]);
    }
    
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Atividades & Diárias</h3>
        <button 
          onClick={() => { setEditingService(null); setIsModalOpen(true); }} 
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-100 uppercase text-xs tracking-widest"
        >
          <Plus size={18} /> Lançar Atividade
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-5">Projeto / Tomador</th>
                <th className="px-6 py-5">Executor</th>
                <th className="px-6 py-5 text-center">Data Exec.</th>
                <th className="px-6 py-5">Custo Diária</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.length > 0 ? services.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {projects.find(p => p.id === s.projectId)?.description || 'Projeto Não Identificado'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      {clients.find(c => c.id === s.clientId)?.name || 'Cliente Removido'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 font-semibold">
                      {collaborators.find(c => c.id === s.collaboratorId)?.name || 'Profissional Desligado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {new Date(s.date).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-cyan-600">R$ {s.dailyValue.toLocaleString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditingService(s); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Wrench size={40} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400 font-bold">Nenhum serviço lançado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-[70] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">{editingService ? 'Ajustar Lançamento' : 'Novo Lançamento de Diária'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Projeto Alvo</label>
                  <select name="projectId" required defaultValue={editingService?.projectId} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none bg-white text-sm font-semibold transition-all">
                    <option value="">Selecione...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.description}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Cliente Pagador</label>
                  <select name="clientId" required defaultValue={editingService?.clientId} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none bg-white text-sm font-semibold transition-all">
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Profissional / Executor</label>
                  <select name="collaboratorId" required defaultValue={editingService?.collaboratorId} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none bg-white text-sm font-semibold transition-all">
                    <option value="">Selecione...</option>
                    {collaborators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Data de Execução</label>
                  <input name="date" type="date" required defaultValue={editingService?.date} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none text-sm font-semibold transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Custo da Diária (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                  <input name="dailyValue" type="number" step="0.01" required defaultValue={editingService?.dailyValue} className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none text-sm font-black text-cyan-600 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Descartar</button>
                <button type="submit" className="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-cyan-100 transition-all">Efetivar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
