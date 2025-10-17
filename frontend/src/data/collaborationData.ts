/**
 * Dados de Colaboração - NSR
 * Sistema multi-usuário para gestão colaborativa entre sócios
 */

import { User } from '@/context/AdminContext';

// ============= USERS =============
export const collaborators: User[] = [
  {
    id: '2',
    name: 'Luca',
    email: 'admin@nsr.com',
    role: 'admin',
    avatar: 'L',
    title: 'Sócio Fundador',
    color: '#D4AF37', // Gold
  },
  {
    id: '3',
    name: 'Sócio NSR',
    email: 'socio@nsr.com',
    role: 'admin',
    avatar: 'S',
    title: 'Sócio',
    color: '#CD7F32', // Bronze
  },
];

// ============= DOCUMENTS =============
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'doc' | 'other';
  size: number; // bytes
  uploadedBy: string; // User ID
  uploadedAt: string; // ISO date
  folder: string;
  tags: string[];
  url?: string; // Para arquivos reais
  owner: 'both' | string; // 'both' ou user ID
}

export const documents: Document[] = [
  {
    id: 'd1',
    name: 'Contrato Social NSR.pdf',
    type: 'pdf',
    size: 2400000,
    uploadedBy: '2',
    uploadedAt: '2024-10-01T10:30:00',
    folder: 'Jurídico',
    tags: ['contrato', 'essencial'],
    owner: 'both',
  },
  {
    id: 'd2',
    name: 'Logo NSR - Vetores.ai',
    type: 'other',
    size: 1200000,
    uploadedBy: '2',
    uploadedAt: '2024-10-05T14:20:00',
    folder: 'Design',
    tags: ['identidade visual', 'logo'],
    owner: 'both',
  },
  {
    id: 'd3',
    name: 'Planilha Financeira Out-2024.xlsx',
    type: 'spreadsheet',
    size: 450000,
    uploadedBy: '3',
    uploadedAt: '2024-10-10T09:15:00',
    folder: 'Financeiro',
    tags: ['financeiro', 'outubro'],
    owner: '3',
  },
  {
    id: 'd4',
    name: 'Fotos Lookbook FW25.zip',
    type: 'other',
    size: 85000000,
    uploadedBy: '2',
    uploadedAt: '2024-10-12T16:45:00',
    folder: 'Marketing',
    tags: ['lookbook', 'fotografia'],
    owner: '2',
  },
  {
    id: 'd5',
    name: 'Fornecedores Tecido.doc',
    type: 'doc',
    size: 150000,
    uploadedBy: '3',
    uploadedAt: '2024-10-15T11:00:00',
    folder: 'Produção',
    tags: ['fornecedores', 'tecido'],
    owner: 'both',
  },
];

// ============= TASKS =============
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // User ID
  createdBy: string; // User ID
  createdAt: string;
  dueDate?: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
}

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'Finalizar design da coleção FW25',
    description: 'Criar mockups finais das 5 peças principais para aprovação',
    assignedTo: '2',
    createdBy: '3',
    createdAt: '2024-10-01T09:00:00',
    dueDate: '2024-10-20T23:59:59',
    status: 'doing',
    priority: 'high',
    category: 'Design',
    tags: ['coleção', 'urgente'],
  },
  {
    id: 't2',
    title: 'Negociar com facção para produção',
    description: 'Fechar valores e prazos para produção de 50 unidades',
    assignedTo: '3',
    createdBy: '2',
    createdAt: '2024-10-03T10:30:00',
    dueDate: '2024-10-18T23:59:59',
    status: 'todo',
    priority: 'high',
    category: 'Produção',
    tags: ['fornecedores', 'negociação'],
  },
  {
    id: 't3',
    title: 'Criar posts para Instagram',
    description: 'Desenvolver 10 posts para feed com identidade visual NSR',
    assignedTo: '2',
    createdBy: '2',
    createdAt: '2024-10-05T14:00:00',
    dueDate: '2024-10-25T23:59:59',
    status: 'todo',
    priority: 'medium',
    category: 'Marketing',
    tags: ['social media', 'instagram'],
  },
  {
    id: 't4',
    title: 'Atualizar planilha de custos',
    description: 'Revisar custos de produção com novos valores da facção',
    assignedTo: '3',
    createdBy: '3',
    createdAt: '2024-10-08T11:15:00',
    status: 'done',
    priority: 'medium',
    category: 'Financeiro',
    tags: ['custos', 'planilha'],
  },
  {
    id: 't5',
    title: 'Organizar shooting do lookbook',
    description: 'Agendar fotógrafo, modelo e local para sessão de fotos',
    assignedTo: '2',
    createdBy: '3',
    createdAt: '2024-10-10T16:20:00',
    dueDate: '2024-10-30T23:59:59',
    status: 'doing',
    priority: 'high',
    category: 'Marketing',
    tags: ['fotografia', 'lookbook'],
  },
  {
    id: 't6',
    title: 'Revisar contrato com loja parceira',
    description: 'Analisar termos de consignação e comissão',
    assignedTo: '3',
    createdBy: '2',
    createdAt: '2024-10-12T09:45:00',
    dueDate: '2024-10-22T23:59:59',
    status: 'todo',
    priority: 'low',
    category: 'Jurídico',
    tags: ['contrato', 'parceria'],
  },
];

// ============= CALENDAR EVENTS =============
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  type: 'meeting' | 'deadline' | 'event' | 'reminder';
  participants: string[]; // User IDs
  createdBy: string;
  location?: string;
  color?: string;
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Reunião com Facção',
    description: 'Discutir prazos e custos de produção das 50 primeiras unidades',
    startDate: '2024-10-18T14:00:00',
    endDate: '2024-10-18T15:30:00',
    type: 'meeting',
    participants: ['2', '3'],
    createdBy: '3',
    location: 'Bom Retiro - SP',
    color: '#D4AF37',
  },
  {
    id: 'e2',
    title: 'Prazo: Finalizar Design FW25',
    description: 'Última data para aprovar designs da coleção',
    startDate: '2024-10-20T23:59:59',
    endDate: '2024-10-20T23:59:59',
    type: 'deadline',
    participants: ['2'],
    createdBy: '3',
    color: '#EF4444',
  },
  {
    id: 'e3',
    title: 'Shooting Lookbook',
    description: 'Sessão de fotos com fotógrafo contratado',
    startDate: '2024-10-25T10:00:00',
    endDate: '2024-10-25T16:00:00',
    type: 'event',
    participants: ['2'],
    createdBy: '2',
    location: 'Estúdio Foto SP',
    color: '#CD7F32',
  },
  {
    id: 'e4',
    title: 'Reunião Semanal - Alinhamento',
    description: 'Reunião de status entre sócios',
    startDate: '2024-10-21T18:00:00',
    endDate: '2024-10-21T19:00:00',
    type: 'meeting',
    participants: ['2', '3'],
    createdBy: '2',
    location: 'Online - Google Meet',
    color: '#D4AF37',
  },
  {
    id: 'e5',
    title: 'Lembrete: Renovar domínio site',
    description: 'Vencimento do domínio nsr.com.br',
    startDate: '2024-10-30T00:00:00',
    endDate: '2024-10-30T23:59:59',
    type: 'reminder',
    participants: ['3'],
    createdBy: '3',
    color: '#F59E0B',
  },
];

// ============= SPREADSHEETS =============
export interface SpreadsheetCell {
  row: number;
  col: number;
  value: string | number;
  formula?: string;
}

export interface Spreadsheet {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  lastEditedBy: string;
  lastEditedAt: string;
  rows: number;
  cols: number;
  cells: SpreadsheetCell[];
  owner: 'both' | string;
}

export const spreadsheets: Spreadsheet[] = [
  {
    id: 's1',
    name: 'Controle de Estoque',
    description: 'Planilha de controle de produtos em estoque',
    createdBy: '3',
    createdAt: '2024-10-01T10:00:00',
    lastEditedBy: '2',
    lastEditedAt: '2024-10-15T14:30:00',
    rows: 20,
    cols: 6,
    cells: [
      // Headers
      { row: 0, col: 0, value: 'Produto' },
      { row: 0, col: 1, value: 'SKU' },
      { row: 0, col: 2, value: 'Quantidade' },
      { row: 0, col: 3, value: 'Custo Unit.' },
      { row: 0, col: 4, value: 'Preço Venda' },
      { row: 0, col: 5, value: 'Total' },
      // Data
      { row: 1, col: 0, value: 'Oversized Tee' },
      { row: 1, col: 1, value: 'TEE-001' },
      { row: 1, col: 2, value: 15 },
      { row: 1, col: 3, value: 55.50 },
      { row: 1, col: 4, value: 189.90 },
      { row: 1, col: 5, value: 2848.50, formula: '=C1*E1' },
    ],
    owner: 'both',
  },
  {
    id: 's2',
    name: 'Fluxo de Caixa Outubro',
    description: 'Controle de entradas e saídas do mês',
    createdBy: '3',
    createdAt: '2024-10-01T09:00:00',
    lastEditedBy: '3',
    lastEditedAt: '2024-10-16T10:20:00',
    rows: 30,
    cols: 5,
    cells: [
      { row: 0, col: 0, value: 'Data' },
      { row: 0, col: 1, value: 'Descrição' },
      { row: 0, col: 2, value: 'Entrada' },
      { row: 0, col: 3, value: 'Saída' },
      { row: 0, col: 4, value: 'Saldo' },
    ],
    owner: '3',
  },
];

// ============= UTILITY FUNCTIONS =============

export const getUserById = (id: string): User | undefined => {
  return collaborators.find((user) => user.id === id);
};

export const getDocumentsByOwner = (userId: string): Document[] => {
  return documents.filter((doc) => doc.owner === userId || doc.owner === 'both');
};

export const getTasksByUser = (userId: string): Task[] => {
  return tasks.filter((task) => task.assignedTo === userId);
};

export const getEventsByUser = (userId: string): CalendarEvent[] => {
  return calendarEvents.filter((event) => event.participants.includes(userId));
};

export const getTasksByStatus = (status: Task['status']): Task[] => {
  return tasks.filter((task) => task.status === status);
};

export const getUpcomingEvents = (): CalendarEvent[] => {
  const now = new Date();
  return calendarEvents
    .filter((event) => new Date(event.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
};

export const getTaskStats = (userId: string) => {
  const userTasks = getTasksByUser(userId);
  return {
    total: userTasks.length,
    todo: userTasks.filter((t) => t.status === 'todo').length,
    doing: userTasks.filter((t) => t.status === 'doing').length,
    done: userTasks.filter((t) => t.status === 'done').length,
  };
};
