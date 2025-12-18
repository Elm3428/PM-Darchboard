
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
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft
} from 'lucide-react';
import { 
  Project, Client, Collaborator, Product, Service, 
  Status, ProductApplication, ProjectPayment 
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
  
  // State initialization with some dummy data for demonstration
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, description: 'Website E-commerce', startDate: '2023-10-01', endDate: '2023-12-01', clientId: 1, status: 'Em Progresso', value: 15000 },
    { id: 2, description: 'Mobile App Delivery', startDate: '2023-11-15', endDate: '2024-02-15', clientId: 2, status: 'Pendente', value: 25000 }
  ]);
  
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'João Silva', company: 'Tech Solutions', email: 'joao@tech.com', phone: '(11) 98888-7777' },
    { id: 2, name: 'Maria Souza', company: 'Green Garden', email: 'maria@garden.com', phone: '(11) 97777-6666' }
  ]);
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 1, name: 'Carlos Tech', position: 'Developer', email: 'carlos@work.com' },
    { id: 2, name: 'Ana Design', position: 'UI Designer', email: 'ana@work.com' }
  ]);
  
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Servidor VPS', description: 'Hospedagem mensal', price: 200, stock: 50 },
    { id: 2, name: 'Certificado SSL', description: 'Segurança web', price: 100, stock: 10 }
  ]);
  
  const [services, setServices] = useState<Service[]>([]);
  const [appliedProducts, setAppliedProducts] = useState<ProductApplication[]>([]);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);

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

    setAppliedProducts([...appliedProducts, newApplication]);
    setProducts(products.map(p => p.id === productId ? { ...p, stock: p.stock - quantity } : p));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView 
          projects={projects} 
          services={services} 
          clients={clients} 
          collaborators={collaborators} 
        />;
      case 'projects':
        return <ProjectsView 
          projects={projects} 
          setProjects={setProjects} 
          clients={clients} 
        />;
      case 'clients':
        return <ClientsView 
          clients={clients} 
          setClients={setClients} 
        />;
      case 'collaborators':
        return <CollaboratorsView 
          collaborators={collaborators} 
          setCollaborators={setCollaborators} 
        />;
      case 'products':
        return <ProductsView 
          products={products} 
          setProducts={setProducts} 
          projects={projects}
          onApplyProduct={handleApplyProduct}
        />;
      case 'services':
        return <ServicesView 
          services={services} 
          setServices={setServices} 
          projects={projects} 
          clients={clients} 
          collaborators={collaborators} 
        />;
      case 'reports':
        return <ReportsView 
          projects={projects} 
          services={services} 
          appliedProducts={appliedProducts} 
          products={products}
          collaborators={collaborators}
          clients={clients}
        />;
      case 'billing':
        return <BillingView 
          projects={projects} 
          services={services} 
          setServices={setServices}
          payments={payments}
          setPayments={setPayments}
          clients={clients}
        />;
      default:
        return <div>Em breve...</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-blue-400" />
            PM Dashboard
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-slate-500 text-xs">admin@pmsys.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Search size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Plus size={18} />
              Ação Rápida
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
