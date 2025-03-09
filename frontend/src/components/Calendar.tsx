import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuthStore } from '../store/authStore';

interface CalendarProps {
  events: Array<{
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    extendedProps?: {
      student?: string;
      instrument?: string;
      location?: string;
      status?: string;
    };
  }>;
  onEventClick?: (info: any) => void;
  onDateSelect?: (info: any) => void;
  isAdmin?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onEventClick,
  onDateSelect,
  isAdmin = false,
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={isAdmin}
        selectable={isAdmin}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        eventClick={onEventClick}
        select={onDateSelect}
        height="auto"
        slotMinTime="09:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps?.status?.toLowerCase();
          return [
            'cursor-pointer',
            status === 'confirmed' ? 'bg-green-500' :
            status === 'pending' ? 'bg-yellow-500' :
            status === 'cancelled' ? 'bg-red-500' :
            'bg-indigo-500'
          ];
        }}
      />
    </div>
  );
};

export default Calendar;