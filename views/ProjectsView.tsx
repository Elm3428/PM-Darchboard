
import React, { useState } from 'react';
import { Project, Client, Status } from '../types';
import { Plus, Pencil, Trash2, Search, X, AlertTriangle } from 'lucide-react';

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  clients: Client[];
}

export default function ProjectsView({ projects, setProjects, clients }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredProjects = projects.filter(p => {
    const clientName = clients.find(c => c.id === p.clientId)?.name || '';
    const matchesSearch = p.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const projectData: Project = {
      id: editingProject ? editingProject.id : Date.now(),
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      clientId: Number(formData.get('clientId')),
      status: formData.get('status') as Status,
      value: Number(formData.get('value')) || 0,
    };

    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? projectData : p));
    } else {
      setProjects(prev => [...prev, projectData]);
    }

    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou cliente..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 transition-all shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="Concluído">Concluído</option>
            <option value="Em Progresso">Em Progresso</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>
        <button 
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Novo Projeto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-200 font-black">
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Descrição</th>
                <th className="px-6 py-5">Cliente</th>
                <th className="px-6 py-5">Prazos</th>
                <th className="px-6 py-5">Valor</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">#{project.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{project.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 font-medium">
                      {clients.find(c => c.id === project.clientId)?.name || 'Cliente Removido'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-slate-500 font-medium">
                    <div>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</div>
                    <div>Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                    R$ {project.value.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      project.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      project.status === 'Em Progresso' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(project.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Search size={40} className="mx-auto mb-4 text-slate-200" />
                    <p className="font-bold text-slate-400">Nenhum projeto encontrado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Exclusão Customizado */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-[110] animate-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Confirmar Exclusão?</h3>
            <p className="text-sm text-slate-500 mb-6">Esta ação é permanente e removerá todos os dados deste projeto da base de dados.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-red-100"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-[70] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 font-black tracking-tight">
              <h3>{editingProject ? 'Configurar Projeto' : 'Registrar Novo Projeto'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição</label>
                <input name="description" required defaultValue={editingProject?.description || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Início</label>
                  <input name="startDate" type="date" required defaultValue={editingProject?.startDate || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Fim</label>
                  <input name="endDate" type="date" required defaultValue={editingProject?.endDate || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Cliente</label>
                  <select name="clientId" required defaultValue={editingProject?.clientId || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white outline-none">
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                  <select name="status" required defaultValue={editingProject?.status || 'Pendente'} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white outline-none">
                    <option value="Pendente">Pendente</option>
                    <option value="Em Progresso">Em Progresso</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor (R$)</label>
                <input name="value" type="number" step="0.01" required defaultValue={editingProject?.value || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none font-bold text-indigo-600" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
