
import React, { useState } from 'react';
import { Product, Project } from '../types';
import { Plus, Pencil, Trash2, X, ArrowRightLeft } from 'lucide-react';

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
    if (confirm('Excluir este produto?')) setProducts(products.filter(p => p.id !== id));
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
    if (editingProduct) setProducts(products.map(p => p.id === editingProduct.id ? data : p));
    else setProducts([...products, data]);
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
        <h3 className="text-xl font-bold text-slate-800">Estoque de Produtos</h3>
        <div className="flex gap-2">
          <button onClick={() => setIsApplyModalOpen(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all">
            <ArrowRightLeft size={18} /> Aplicar ao Projeto
          </button>
          <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-pink-200">
            <Plus size={20} /> Novo Produto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Estoque</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors border-b last:border-0">
                <td className="px-6 py-4 text-slate-400 font-medium">#{p.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.description}</div>
                </td>
                <td className="px-6 py-4 text-emerald-600 font-bold">R$ {p.price.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {p.stock} un.
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="name" placeholder="Nome" required defaultValue={editingProduct?.name || ''} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500/20" />
              <textarea name="description" placeholder="Descrição" defaultValue={editingProduct?.description || ''} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500/20" />
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" step="0.01" placeholder="Preço" required defaultValue={editingProduct?.price || ''} className="w-full px-4 py-2 border rounded-lg" />
                <input name="stock" type="number" placeholder="Estoque inicial" required defaultValue={editingProduct?.stock || ''} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-pink-600 text-white rounded-lg">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply to Project Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Aplicar Produto ao Projeto</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Projeto Destino</label>
                <select name="projectId" required className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Selecione...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.description}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Produto</label>
                <select name="productId" required className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Selecione...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Disponível: {p.stock})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Quantidade</label>
                <input name="quantity" type="number" min="1" required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsApplyModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded-lg">Fechar</button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 text-white rounded-lg">Baixar Estoque</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
