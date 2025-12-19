
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  UserSquare2, 
  Package, 
  Wrench, 
  FileBarChart, 
  Receipt,
  Plus,
  Search,
  ChevronDown
} from 'lucide-react';
import { 
  Project, Client, Collaborator, Product, Service, 
  ProductApplication, ProjectPayment 
} from './types';

// Components
import DashboardView from './views/DashboardView';
import ProjectsView from './views/ProjectsView';
import ClientsView from './views/ClientsView';
import CollaboratorsView from './views/CollaboratorsView';
import ProductsView from './views/ProductsView';
import ServicesView from './views/ServicesView';
import ReportsView from './views/ReportsView';
import BillingView from './views/BillingView';

const TABS = [
  { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={20} className="text-blue-500" /> },
  { id: 'projects', label: 'Projetos', icon: <FolderKanban size={20} className="text-indigo-500" /> },
  { id: 'clients', label: 'Clientes', icon: <Users size={20} className="text-teal-500" /> },
  { id: 'collaborators', label: 'Colaboradores', icon: <UserSquare2 size={20} className="text-amber-500" /> },
  { id: 'products', label: 'Produtos', icon: <Package size={20} className="text-pink-500" /> },
  { id: 'services', label: 'Serviços', icon: <Wrench size={20} className="text-cyan-500" /> },
  { id: 'reports', label: 'Relatórios', icon: <FileBarChart size={20} className="text-emerald-500" /> },
  { id: 'billing', label: 'Faturamento', icon: <Receipt size={20} className="text-orange-500" /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickAction, setShowQuickAction] = useState(false);
  
  // State initialization with persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pm_projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('pm_clients');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const saved = localStorage.getItem('pm_collaborators');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pm_products');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('pm_services');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedProducts, setAppliedProducts] = useState<ProductApplication[]>(() => {
    const saved = localStorage.getItem('pm_applied_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState<ProjectPayment[]>(() => {
    const saved = localStorage.getItem('pm_payments');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence effects
  useEffect(() => { localStorage.setItem('pm_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('pm_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('pm_collaborators', JSON.stringify(collaborators)); }, [collaborators]);
  useEffect(() => { localStorage.setItem('pm_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('pm_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('pm_applied_products', JSON.stringify(appliedProducts)); }, [appliedProducts]);
  useEffect(() => { localStorage.setItem('pm_payments', JSON.stringify(payments)); }, [payments]);

  const handleApplyProduct = (projectId: number, productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < quantity) {
      alert('Estoque insuficiente!');
      return;
    }

    const newApplication: ProductApplication = {
      id: Date.now(),
      projectId,
      productId,
      quantity,
      date: new Date().toISOString().split('T')[0]
    };

    setAppliedProducts(prev => [...prev, newApplication]);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock - quantity } : p));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView projects={projects} services={services} clients={clients} collaborators={collaborators} />;
      case 'projects':
        return <ProjectsView projects={projects} setProjects={setProjects} clients={clients} />;
      case 'clients':
        return <ClientsView clients={clients} setClients={setClients} />;
      case 'collaborators':
        return <CollaboratorsView collaborators={collaborators} setCollaborators={setCollaborators} />;
      case 'products':
        return <ProductsView products={products} setProducts={setProducts} projects={projects} onApplyProduct={handleApplyProduct} />;
      case 'services':
        return <ServicesView services={services} setServices={setServices} projects={projects} clients={clients} collaborators={collaborators} />;
      case 'reports':
        return <ReportsView projects={projects} services={services} appliedProducts={appliedProducts} products={products} collaborators={collaborators} clients={clients} />;
      case 'billing':
        return <BillingView projects={projects} services={services} setServices={setServices} payments={payments} setPayments={setPayments} clients={clients} />;
      default:
        return <div>Em breve...</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span>PM Pro</span>
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 font-semibold' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-white' : ''}>{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-inner">
              AD
            </div>
            <div className="text-xs overflow-hidden">
              <p className="font-bold text-slate-100 truncate">Administrador</p>
              <p className="text-slate-500 truncate">Painel de Gestão</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowQuickAction(!showQuickAction)}
                className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
              >
                <Plus size={16} />
                Novo Registro
                <ChevronDown size={14} className={`transition-transform duration-300 ${showQuickAction ? 'rotate-180' : ''}`} />
              </button>

              {showQuickAction && (
                <>
                  <div className="fixed inset-0" onClick={() => setShowQuickAction(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in zoom-in slide-in-from-top-2 duration-200 z-50">
                    <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Atalhos Rápidos</p>
                    <button onClick={() => { setActiveTab('projects'); setShowQuickAction(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 rounded-xl flex items-center gap-3 text-slate-700 font-bold group transition-all">
                      <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><FolderKanban size={14} /></div> Projeto
                    </button>
                    <button onClick={() => { setActiveTab('clients'); setShowQuickAction(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-teal-50 rounded-xl flex items-center gap-3 text-slate-700 font-bold group transition-all">
                      <div className="p-1.5 bg-teal-100 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors"><Users size={14} /></div> Cliente
                    </button>
                    <button onClick={() => { setActiveTab('services'); setShowQuickAction(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-cyan-50 rounded-xl flex items-center gap-3 text-slate-700 font-bold group transition-all">
                      <div className="p-1.5 bg-cyan-100 rounded-lg text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors"><Wrench size={14} /></div> Serviço
                    </button>
                    <div className="my-2 border-t border-slate-100"></div>
                    <button onClick={() => { setActiveTab('billing'); setShowQuickAction(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 rounded-xl flex items-center gap-3 text-slate-700 font-bold group transition-all">
                      <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors"><Receipt size={14} /></div> Cobrança
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
