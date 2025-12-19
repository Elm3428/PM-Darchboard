
import React, { useState } from 'react';
import { Collaborator } from '../types';
import { Plus, Pencil, Trash2, X, Search, UserSquare2, AlertTriangle } from 'lucide-react';

interface Props {
  collaborators: Collaborator[];
  setCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
}

export default function CollaboratorsView({ collaborators, setCollaborators }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingColab, setEditingColab] = useState<Collaborator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = collaborators.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Collaborator = {
      id: editingColab ? editingColab.id : Date.now(),
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      email: formData.get('email') as string,
    };

    if (editingColab) {
      setCollaborators(prev => prev.map(c => c.id === editingColab.id ? data : c));
    } else {
      setCollaborators(prev => [...prev, data]);
    }

    setIsModalOpen(false);
    setEditingColab(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou cargo..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingColab(null); setIsModalOpen(true); }} 
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-100 uppercase text-xs tracking-widest"
        >
          <Plus size={20} /> Novo Membro
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-5">Colaborador</th>
                <th className="px-6 py-5">Cargo / Função</th>
                <th className="px-6 py-5">E-mail</th>
                <th className="px-6 py-5 text-right">Gerenciar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-bold uppercase tracking-tight">
                      {c.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{c.email}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => { setEditingColab(c); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><Pencil size={18} /></button>
                      <button type="button" onClick={() => setDeleteConfirmId(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    <UserSquare2 size={40} className="mx-auto mb-2 opacity-20" />
                    <p className="font-bold">Nenhum profissional listado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmação de Exclusão */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-[110] text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Desvincular Membro?</h3>
            <p className="text-sm text-slate-500 mb-6">O colaborador será removido permanentemente da sua equipe e histórico.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase">Voltar</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase">Remover</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-[70] overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 font-black tracking-tight">
              <h3>{editingColab ? 'Ficha Profissional' : 'Novo Colaborador'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome Completo</label>
                <input name="name" required defaultValue={editingColab?.name || ''} className="w-full px-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 font-semibold" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Função</label>
                <input name="position" required defaultValue={editingColab?.position || ''} className="w-full px-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 font-semibold" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">E-mail</label>
                <input name="email" type="email" required defaultValue={editingColab?.email || ''} className="w-full px-4 py-3 border border-slate-200 rounded-2xl outline-none transition-all font-semibold" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase">Sair</button>
                <button type="submit" className="flex-1 py-3.5 bg-amber-600 text-white rounded-2xl font-bold text-xs uppercase shadow-lg shadow-amber-100">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
