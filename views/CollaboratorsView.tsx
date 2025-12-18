
import React, { useState } from 'react';
import { Collaborator } from '../types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Props {
  collaborators: Collaborator[];
  setCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
}

export default function CollaboratorsView({ collaborators, setCollaborators }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColab, setEditingColab] = useState<Collaborator | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este colaborador?')) {
      setCollaborators(collaborators.filter(c => c.id !== id));
    }
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
      setCollaborators(collaborators.map(c => c.id === editingColab.id ? data : c));
    } else {
      setCollaborators([...collaborators, data]);
    }

    setIsModalOpen(false);
    setEditingColab(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Equipe de Colaboradores</h3>
        <button onClick={() => { setEditingColab(null); setIsModalOpen(true); }} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-amber-200">
          <Plus size={20} /> Novo Colaborador
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold">Cargo</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collaborators.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">#{c.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.position}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{c.email}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => { setEditingColab(c); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md transition-all"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingColab ? 'Editar Colaborador' : 'Novo Colaborador'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome</label>
                <input name="name" required defaultValue={editingColab?.name || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cargo</label>
                <input name="position" required defaultValue={editingColab?.position || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input name="email" type="email" required defaultValue={editingColab?.email || ''} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-100">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
