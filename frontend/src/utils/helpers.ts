export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const time = new Date();
  time.setHours(parseInt(hours), parseInt(minutes));
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const generateMockCSV = (events: any[]) => {
  const headers = ['Event ID', 'Title', 'Date', 'Location', 'Attendees', 'Max Attendees'];
  const csvContent = [
    headers.join(','),
    ...events.map(event => 
      [event.id, event.title, event.date, event.location, event.currentAttendees, event.maxAttendees].join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'events-export.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const generateMockJSON = (events: any[]) => {
  const jsonContent = JSON.stringify(events, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'events-export.json';
  a.click();
  window.URL.revokeObjectURL(url);
};