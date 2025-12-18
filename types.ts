
export type Status = 'Concluído' | 'Em Progresso' | 'Pendente';

export interface Project {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  clientId: number;
  status: Status;
  value: number;
}

export interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface Collaborator {
  id: number;
  name: string;
  position: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Service {
  id: number;
  projectId: number;
  clientId: number;
  collaboratorId: number;
  date: string;
  dailyValue: number;
  isPaid: boolean;
}

export interface ProductApplication {
  id: number;
  projectId: number;
  productId: number;
  quantity: number;
  date: string;
}

export interface ProjectPayment {
  id: number;
  projectId: number;
  date: string;
  amount: number;
  description: string;
}
