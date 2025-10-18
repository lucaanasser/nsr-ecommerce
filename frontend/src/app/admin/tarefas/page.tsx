'use client';

import { useState } from 'react';
import { Plus, User, Calendar, Flag, Tag as TagIcon, Clock } from 'lucide-react';
import { tasks, Task, getUserById, getTaskStats } from '@/data/collaborationData';
import { useAdmin } from '@/context/AdminContext';
import Button from '@/components/ui/Button';

/**
 * Página de Gestão de Tarefas
 * Kanban board colaborativo para divisão de responsabilidades entre sócios
 */
export default function TarefasPage() {
  const { user } = useAdmin();
  const [allTasks, setAllTasks] = useState<Task[]>(tasks);
  const [filterAssignee, setFilterAssignee] = useState<string>('todos');

  // Filtrar tarefas
  const filteredTasks = allTasks.filter((task) => {
    if (filterAssignee === 'todos') return true;
    if (filterAssignee === 'me') return task.assignedTo === user?.id;
    return task.assignedTo === filterAssignee;
  });

  // Agrupar por status
  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const doingTasks = filteredTasks.filter((t) => t.status === 'doing');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  // Stats
  const stats = user ? getTaskStats(user.id) : { total: 0, todo: 0, doing: 0, done: 0 };

  // Obter cor da prioridade
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
    }
  };

  // Componente de Card de Tarefa
  const TaskCard = ({ task }: { task: Task }) => {
    const assignee = getUserById(task.assignedTo);
    const creator = getUserById(task.createdBy);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
    const daysUntilDue = task.dueDate 
      ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <div className="bg-dark-card border border-dark-border rounded-sm p-4 hover:border-primary-gold/50 transition-all cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-primary-white group-hover:text-primary-gold transition-colors flex-1">
            {task.title}
          </h3>
          <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-primary-white/60 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-dark-bg text-primary-white/50 text-xs rounded-sm"
              >
                <TagIcon size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-border">
          {/* Assignee */}
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-dark-bg"
              style={{ backgroundColor: assignee?.color || '#888' }}
            >
              {assignee?.avatar}
            </div>
            <span className="text-xs text-primary-white/60">{assignee?.name}</span>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-400' : daysUntilDue && daysUntilDue <= 3 ? 'text-yellow-400' : 'text-primary-white/60'
            }`}>
              <Calendar size={12} />
              {daysUntilDue !== null && daysUntilDue >= 0 
                ? `${daysUntilDue}d`
                : isOverdue 
                ? 'Atrasada'
                : new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
              }
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente de Coluna do Kanban
  const KanbanColumn = ({ 
    title, 
    status, 
    tasks, 
    color 
  }: { 
    title: string; 
    status: Task['status']; 
    tasks: Task[]; 
    color: string;
  }) => {
    return (
      <div className="flex-1 min-w-[300px]">
        <div className="bg-dark-card rounded-sm border border-dark-border overflow-hidden">
          {/* Column Header */}
          <div className="p-4 border-b border-dark-border" style={{ backgroundColor: `${color}15` }}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary-white">{title}</h2>
              <span 
                className="text-xs font-bold px-2 py-1 rounded-sm"
                style={{ backgroundColor: color, color: '#0A0A0A' }}
              >
                {tasks.length}
              </span>
            </div>
          </div>

          {/* Tasks */}
          <div className="p-4 space-y-3 min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-primary-white/40">Nenhuma tarefa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-white">Tarefas</h1>
          <p className="text-sm text-primary-white/60 mt-1">
            Kanban board colaborativo para organização do trabalho
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2 px-4 py-2">
          <Plus size={20} />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Flag size={16} className="text-primary-white/60" />
            <p className="text-sm text-primary-white/60">Minhas Tarefas</p>
          </div>
          <p className="text-2xl font-bold text-primary-white">{stats.total}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-400" />
            <p className="text-sm text-primary-white/60">A Fazer</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.todo}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-yellow-400" />
            <p className="text-sm text-primary-white/60">Em Andamento</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.doing}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-sm border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-green-400" />
            <p className="text-sm text-primary-white/60">Concluídas</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.done}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-dark-card rounded-sm border border-dark-border p-4">
        <div className="flex items-center gap-4">
          <User size={20} className="text-primary-gold" />
          <div className="flex-1">
            <label className="text-sm text-primary-white/60 mb-2 block">Filtrar por responsável</label>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="w-full md:w-auto bg-dark-bg border border-dark-border rounded-sm px-3 py-2 text-primary-white focus:outline-none focus:border-primary-gold"
            >
              <option value="todos">Todas as tarefas</option>
              <option value="me">Minhas tarefas</option>
              <option value="2">Luca</option>
              <option value="3">Sócio NSR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <KanbanColumn
          title="📋 A Fazer"
          status="todo"
          tasks={todoTasks}
          color="#3B82F6"
        />
        <KanbanColumn
          title="⚡ Em Andamento"
          status="doing"
          tasks={doingTasks}
          color="#F59E0B"
        />
        <KanbanColumn
          title="✅ Concluídas"
          status="done"
          tasks={doneTasks}
          color="#10B981"
        />
      </div>
    </div>
  );
}
