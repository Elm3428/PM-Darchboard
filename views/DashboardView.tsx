
import React from 'react';
import { Project, Service, Client, Collaborator } from '../types';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  TrendingUp 
} from 'lucide-react';

interface Props {
  projects: Project[];
  services: Service[];
  clients: Client[];
  collaborators: Collaborator[];
}

export default function DashboardView({ projects, services, clients, collaborators }: Props) {
  const totalProjectValue = projects.reduce((sum, p) => sum + p.value, 0);
  const totalDailyCosts = services.reduce((sum, s) => sum + s.dailyValue, 0);
  
  const statusCount = {
    'Concluído': projects.filter(p => p.status === 'Concluído').length,
    'Em Progresso': projects.filter(p => p.status === 'Em Progresso').length,
    'Pendente': projects.filter(p => p.status === 'Pendente').length,
  };

  const servicesByClient = clients.map(client => ({
    name: client.name,
    count: services.filter(s => s.clientId === client.id).length
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const costsByCollaborator = collaborators.map(colab => ({
    name: colab.name,
    total: services.filter(s => s.collaboratorId === colab.id).reduce((sum, s) => sum + s.dailyValue, 0)
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total em Projetos" 
          value={`R$ ${totalProjectValue.toLocaleString('pt-BR')}`} 
          icon={<DollarSign className="text-emerald-500" />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          title="Total de Projetos" 
          value={projects.length.toString()} 
          icon={<Briefcase className="text-blue-500" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Custos Operacionais" 
          value={`R$ ${totalDailyCosts.toLocaleString('pt-BR')}`} 
          icon={<TrendingUp className="text-orange-500" />} 
          color="bg-orange-50" 
        />
        <StatCard 
          title="Total de Clientes" 
          value={clients.length.toString()} 
          icon={<Users className="text-indigo-500" />} 
          color="bg-indigo-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" />
            Status dos Projetos
          </h3>
          <div className="space-y-4">
            <StatusRow label="Concluído" count={statusCount['Concluído']} total={projects.length} color="bg-emerald-500" />
            <StatusRow label="Em Progresso" count={statusCount['Em Progresso']} total={projects.length} color="bg-blue-500" />
            <StatusRow label="Pendente" count={statusCount['Pendente']} total={projects.length} color="bg-slate-300" />
          </div>
        </div>

        {/* Services by Client */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <CheckCircle size={20} className="text-slate-400" />
            Serviços por Cliente
          </h3>
          <div className="space-y-4">
            {servicesByClient.length > 0 ? servicesByClient.map(item => (
              <div key={item.name} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-600 font-medium">{item.name}</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {item.count} serviços
                </span>
              </div>
            )) : <p className="text-slate-400 text-center py-4">Nenhum serviço registrado.</p>}
          </div>
        </div>
      </div>

      {/* Faturamento por Colaborador */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Custos de Diárias por Colaborador</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-slate-100">
                <th className="pb-3 font-medium">Colaborador</th>
                <th className="pb-3 font-medium text-right">Total Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {costsByCollaborator.map(item => (
                <tr key={item.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-medium text-slate-700">{item.name}</td>
                  <td className="py-4 text-right font-bold text-slate-900">
                    R$ {item.total.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  );
}

function StatusRow({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-400 font-medium">{count} / {total}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
