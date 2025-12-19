
import React, { useState } from 'react';
import { Product, Project } from '../types';
import { Plus, Pencil, Trash2, X, ArrowRightLeft, PackageSearch } from 'lucide-react';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  projects: Project[];
  onApplyProduct: (projectId: number, productId: number, quantity: number) => void;
}

export default function ProductsView({ products, setProducts, projects, onApplyProduct }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('Deseja remover este item do estoque?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
    };
    
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p));
    } else {
      setProducts(prev => [...prev, data]);
    }
    
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onApplyProduct(
      Number(formData.get('projectId')),
      Number(formData.get('productId')),
      Number(formData.get('quantity'))
    );
    setIsApplyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Controle de Materiais</h3>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsApplyModalOpen(true)} 
            className="bg-slate-800 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <ArrowRightLeft size={16} /> Alocação
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} 
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-pink-100 flex items-center gap-2"
          >
            <Plus size={18} /> Novo Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-5">Identificador</th>
                <th className="px-6 py-5">Item / Detalhes</th>
                <th className="px-6 py-5">Preço Unit.</th>
                <th className="px-6 py-5">Disponibilidade</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length > 0 ? products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-slate-400 font-bold text-xs">#{p.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium line-clamp-1">{p.description}</div>
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-bold text-sm">R$ {p.price.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${p.stock < 5 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'}`}>
                      {p.stock} em estoque
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <PackageSearch size={40} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400 font-bold">Estoque vazio</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-[70] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">{editingProduct ? 'Editar Produto' : 'Cadastrar Material'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome do Item</label>
                <input name="name" required defaultValue={editingProduct?.name || ''} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição Breve</label>
                <textarea name="description" rows={2} defaultValue={editingProduct?.description || ''} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none text-sm font-semibold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Preço de Venda</label>
                  <input name="price" type="number" step="0.01" required defaultValue={editingProduct?.price || ''} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none text-sm font-bold text-emerald-600" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Qtd. em Estoque</label>
                  <input name="stock" type="number" required defaultValue={editingProduct?.stock || ''} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none text-sm font-semibold" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest">Fechar</button>
                <button type="submit" className="flex-1 py-3.5 bg-pink-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-pink-100">Gravar Dados</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply to Project Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsApplyModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-[70] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-800 text-white">
              <h3 className="text-lg font-black uppercase tracking-widest">Alocar Material</h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-white/50 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Projeto Destino</label>
                <select name="projectId" required className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-500/10 outline-none bg-white font-semibold text-sm">
                  <option value="">Selecione o Projeto...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.description}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Item do Estoque</label>
                <select name="productId" required className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-500/10 outline-none bg-white font-semibold text-sm">
                  <option value="">Selecione o Material...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Disponível: {p.stock})</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Quantidade a baixar</label>
                <input name="quantity" type="number" min="1" required className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-500/10 outline-none font-bold" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsApplyModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Confirmar Baixa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
