
import React, { useState } from 'react';
import { Project, Service, ProductApplication, Product, Collaborator, Client } from '../types';
import { Filter, Calendar, TrendingDown, Package, ClipboardList } from 'lucide-react';

interface Props {
  projects: Project[];
  services: Service[];
  appliedProducts: ProductApplication[];
  products: Product[];
  collaborators: Collaborator[];
  clients: Client[];
}

export default function ReportsView({ projects, services, appliedProducts, products, collaborators, clients }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const projectServices = services.filter(s => s.projectId === selectedProjectId);
  const projectProducts = appliedProducts.filter(p => p.projectId === selectedProjectId);
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const totalServices = projectServices.reduce((sum, s) => sum + s.dailyValue, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Relatórios de Movimentação</h3>
          <p className="text-slate-500 text-sm">Selecione um projeto para ver o detalhamento de recursos e custos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-slate-400" />
          <select 
            className="px-4 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500/20"
            onChange={(e) => setSelectedProjectId(Number(e.target.value) || null)}
          >
            <option value="">Selecione um Projeto...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.description}</option>)}
          </select>
        </div>
      </div>

      {!selectedProjectId ? (
        <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-3xl h-64 flex flex-col items-center justify-center text-slate-400">
          <ClipboardList size={48} className="mb-4 opacity-20" />
          <p className="font-medium">Nenhum projeto selecionado.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Project Header */}
          <div className="bg-emerald-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">Projeto #{selectedProject?.id}</span>
                <h2 className="text-3xl font-bold">{selectedProject?.description}</h2>
                <p className="opacity-80">Cliente: {clients.find(c => c.id === selectedProject?.clientId)?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Valor Total do Projeto</p>
                <h4 className="text-3xl font-black">R$ {selectedProject?.value.toLocaleString('pt-BR')}</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
              <ReportMeta label="Status" value={selectedProject?.status || ''} />
              <ReportMeta label="Início" value={new Date(selectedProject?.startDate || '').toLocaleDateString('pt-BR')} />
              <ReportMeta label="Entrega" value={new Date(selectedProject?.endDate || '').toLocaleDateString('pt-BR')} />
              <ReportMeta label="Investimento em Serviços" value={`R$ ${totalServices.toLocaleString('pt-BR')}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Services Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b flex items-center gap-2">
                <Calendar size={18} className="text-emerald-500" />
                <h4 className="font-bold text-slate-700">Serviços Prestados</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b">
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Colaborador</th>
                      <th className="px-4 py-3 font-right text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {projectServices.length > 0 ? projectServices.map(s => (
                      <tr key={s.id}>
                        <td className="px-4 py-3 text-slate-500">{new Date(s.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 font-medium">{collaborators.find(c => c.id === s.collaboratorId)?.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">R$ {s.dailyValue.toLocaleString('pt-BR')}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400">Nenhum serviço vinculado.</td></tr>
                    )}
                  </tbody>
                  {projectServices.length > 0 && (
                    <tfoot className="bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-right text-slate-500">Subtotal Diárias</td>
                        <td className="px-4 py-3 text-right text-emerald-600">R$ {totalServices.toLocaleString('pt-BR')}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b flex items-center gap-2">
                <Package size={18} className="text-pink-500" />
                <h4 className="font-bold text-slate-700">Produtos Alocados</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b">
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Produto</th>
                      <th className="px-4 py-3 text-right">Qtd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {projectProducts.length > 0 ? projectProducts.map(p => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 text-slate-500">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 font-medium">{products.find(prod => prod.id === p.productId)?.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">{p.quantity}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400">Nenhum produto alocado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportMeta({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider mb-1">{label}</p>
      <p className="font-semibold text-sm truncate">{value}</p>
    </div>
  );
}
