'use client';

import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarEvents, CalendarEvent, getUserById, getUpcomingEvents } from '@/data/collaborationData';
import { useAdmin } from '@/context/AdminContext';

/**
 * Página de Calendário
 * Visualização de eventos, reuniões, prazos e lembretes
 */
export default function CalendarioPage() {
  const { user } = useAdmin();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const upcoming = getUpcomingEvents();

  // Navegar mês
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Obter dias do mês
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth();

  // Obter eventos do dia
  const getEventsForDay = (date: Date) => {
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Obter ícone do tipo
  const getTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return '🤝';
      case 'deadline':
        return '⏰';
      case 'event':
        return '📅';
      case 'reminder':
        return '🔔';
    }
  };

  const getTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'Reunião';
      case 'deadline':
        return 'Prazo';
      case 'event':
        return 'Evento';
      case 'reminder':
        return 'Lembrete';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-white">Calendário</h1>
          <p className="text-sm text-primary-white/60 mt-1">
            Eventos, reuniões e prazos da empresa
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-gold text-dark-bg rounded-sm font-medium hover:bg-primary-bronze transition-colors">
          <Plus size={20} />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card rounded-sm border border-dark-border overflow-hidden">
            {/* Header do Calendário */}
            <div className="p-4 border-b border-dark-border flex items-center justify-between bg-dark-bg">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-dark-card rounded-sm transition-colors text-primary-white/60 hover:text-primary-gold"
              >
                <ChevronLeft size={20} />
              </button>
              
              <h2 className="text-lg font-bold text-primary-white">
                {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-dark-card rounded-sm transition-colors text-primary-white/60 hover:text-primary-gold"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dias da Semana */}
            <div className="grid grid-cols-7 border-b border-dark-border bg-dark-bg">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-semibold text-primary-white/60 border-r border-dark-border last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid de Dias */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const isToday = day && 
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth() &&
                  day.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border-r border-b border-dark-border last:border-r-0 ${
                      !day ? 'bg-dark-bg/50' : 'hover:bg-dark-bg/30 transition-colors'
                    } ${isToday ? 'bg-primary-gold/10' : ''}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-semibold mb-1 ${
                          isToday ? 'text-primary-gold' : 'text-primary-white'
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <button
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className="w-full text-left p-1 rounded-sm text-xs truncate transition-all hover:scale-105"
                              style={{ backgroundColor: `${event.color}20`, color: event.color }}
                            >
                              {getTypeIcon(event.type)} {event.title}
                            </button>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-primary-white/40 pl-1">
                              +{dayEvents.length - 2} mais
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Próximos Eventos */}
        <div className="space-y-4">
          <div className="bg-dark-card rounded-sm border border-dark-border p-4">
            <h3 className="text-lg font-semibold text-primary-white mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((event) => {
                const startDate = new Date(event.startDate);
                const participants = event.participants.map(getUserById).filter(Boolean);
                
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left p-3 bg-dark-bg rounded-sm border border-dark-border hover:border-primary-gold/50 transition-all group"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">{getTypeIcon(event.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-primary-white group-hover:text-primary-gold transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-primary-white/40 mt-0.5">
                          {getTypeLabel(event.type)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-primary-white/60">
                      <CalendarIcon size={12} />
                      {startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      {event.type === 'meeting' && (
                        <>
                          <Clock size={12} className="ml-2" />
                          {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </>
                      )}
                    </div>

                    {participants.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {participants.map((p) => p && (
                          <div
                            key={p.id}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-dark-bg"
                            style={{ backgroundColor: p.color }}
                            title={p.name}
                          >
                            {p.avatar}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Evento */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-dark-card rounded-sm border border-dark-border max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-white">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-primary-white/60 hover:text-primary-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(selectedEvent.type)}</span>
                <span className="text-sm text-primary-white/60">{getTypeLabel(selectedEvent.type)}</span>
              </div>

              {selectedEvent.description && (
                <p className="text-sm text-primary-white/80">{selectedEvent.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-primary-white/80">
                <CalendarIcon size={16} className="text-primary-gold" />
                {new Date(selectedEvent.startDate).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>

              {selectedEvent.type === 'meeting' && (
                <div className="flex items-center gap-2 text-sm text-primary-white/80">
                  <Clock size={16} className="text-primary-gold" />
                  {new Date(selectedEvent.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(selectedEvent.endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm text-primary-white/80">
                  <MapPin size={16} className="text-primary-gold" />
                  {selectedEvent.location}
                </div>
              )}

              {selectedEvent.participants.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-primary-white/60 mb-2">
                    <Users size={16} />
                    Participantes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.participants.map((participantId) => {
                      const participant = getUserById(participantId);
                      return participant && (
                        <div
                          key={participant.id}
                          className="flex items-center gap-2 px-3 py-1 bg-dark-bg rounded-sm"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-dark-bg"
                            style={{ backgroundColor: participant.color }}
                          >
                            {participant.avatar}
                          </div>
                          <span className="text-sm text-primary-white">{participant.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
