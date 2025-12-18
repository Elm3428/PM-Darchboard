
import React, { useState } from 'react';
import { Project, Service, ProjectPayment, Client } from '../types';
import { 
  Receipt, 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Check, 
  Calendar,
  X
} from 'lucide-react';

interface Props {
  projects: Project[];
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  payments: ProjectPayment[];
  setPayments: React.Dispatch<React.SetStateAction<ProjectPayment[]>>;
  clients: Client[];
}

export default function BillingView({ projects, services, setServices, payments, setPayments, clients }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectServices = services.filter(s => s.projectId === selectedProjectId);
  const projectPayments = payments.filter(p => p.projectId === selectedProjectId);

  const totalReceived = projectPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCost = projectServices.reduce((sum, s) => sum + s.dailyValue, 0);
  const projectValue = selectedProject?.value || 0;
  const balance = projectValue - totalReceived;
  const margin = projectValue - totalCost;

  const handlePayService = (serviceId: number) => {
    setServices(services.map(s => s.id === serviceId ? { ...s, isPaid: true } : s));
  };

  const handleAddPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    
    const formData = new FormData(e.currentTarget);
    const newPayment: ProjectPayment = {
      id: Date.now(),
      projectId: selectedProjectId,
      date: formData.get('date') as string,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
    };

    setPayments([...payments, newPayment]);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Faturamento & Cobrança</h3>
          <p className="text-slate-500 text-sm">Gerencie recebimentos e pagamentos de diárias por projeto.</p>
        </div>
        <select 
          className="px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-orange-500/20"
          onChange={(e) => setSelectedProjectId(Number(e.target.value) || null)}
          value={selectedProjectId || ''}
        >
          <option value="">Selecione um Projeto para Faturar...</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.description} (ID: {p.id})</option>)}
        </select>
      </div>

      {!selectedProjectId ? (
        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl h-64 flex flex-col items-center justify-center text-slate-400">
          <Receipt size={48} className="mb-4 opacity-20 text-orange-400" />
          <p className="font-medium">Selecione um projeto para ver a saúde financeira.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label="Valor do Projeto" value={projectValue} icon={<Wallet />} color="text-slate-600" />
            <SummaryCard label="Total Recebido" value={totalReceived} icon={<ArrowDownLeft />} color="text-emerald-600" />
            <SummaryCard label="Saldo Pendente" value={balance} icon={<CreditCard />} color="text-orange-600" />
            <SummaryCard label="Margem Projetada" value={margin} icon={<ArrowUpRight />} color="text-blue-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment History */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <Receipt size={18} className="text-orange-500" />
                    Histórico de Recebimentos
                  </h4>
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1"
                  >
                    <Plus size={14} /> Registrar Pagamento
                  </button>
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b">
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {projectPayments.length > 0 ? projectPayments.map(p => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 text-slate-500">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{p.description}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">R$ {p.amount.toLocaleString('pt-BR')}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">Nenhum pagamento registrado ainda.</td></tr>
                    )}
                  </tbody>
                  {projectPayments.length > 0 && (
                    <tfoot className="bg-slate-50">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-right font-bold text-slate-500">Total Pago pelo Cliente:</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-700 text-lg">R$ {totalReceived.toLocaleString('pt-BR')}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* Service Payments Control */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
              <div className="p-4 border-b bg-slate-50">
                <h4 className="font-bold text-slate-700">Pagamento de Diárias</h4>
                <p className="text-[10px] text-slate-400">Custos que saem do saldo do projeto</p>
              </div>
              <div className="p-4 space-y-3">
                {projectServices.length > 0 ? projectServices.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50">
                    <div>
                      <p className="text-xs font-bold text-slate-700">Diária de {new Date(s.date).toLocaleDateString('pt-BR')}</p>
                      <p className="text-[10px] text-slate-400">R$ {s.dailyValue.toLocaleString('pt-BR')}</p>
                    </div>
                    {s.isPaid ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded-full">
                        <Check size={12} /> PAGA
                      </span>
                    ) : (
                      <button 
                        onClick={() => handlePayService(s.id)}
                        className="text-[10px] bg-slate-800 hover:bg-black text-white px-2 py-1 rounded-full font-bold transition-all"
                      >
                        Pagar
                      </button>
                    )}
                  </div>
                )) : (
                  <p className="text-center text-sm text-slate-400 py-4">Sem diárias registradas.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Registrar Recebimento</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <input 
                  disabled 
                  value={clients.find(c => c.id === selectedProject?.clientId)?.name || 'N/A'} 
                  className="w-full px-4 py-2 bg-slate-100 border rounded-lg text-slate-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data do Recebimento</label>
                <input name="date" type="date" required className="w-full px-4 py-2 border rounded-lg" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor Recebido (R$)</label>
                <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full px-4 py-2 border rounded-lg text-lg font-bold text-emerald-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <input name="description" placeholder="Ex: Pagamento parcial, Adiantamento..." className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200">Confirmar Recebimento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 bg-slate-50 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</p>
        <p className={`text-lg font-bold ${color}`}>R$ {value.toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
}
