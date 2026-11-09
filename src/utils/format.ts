export function formatTime(timestamp: number): string {
  if (!timestamp) {
    return '';
  }
  return new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (isSameDay) {
    return formatTime(timestamp);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) {
    return 'Hôm qua';
  }

  return date.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'});
}

export function formatLastSeen(timestamp: number): string {
  if (!timestamp) {
    return 'Ngoại tuyến';
  }

  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) {
    return 'Vừa truy cập';
  }
  if (minutes < 60) {
    return `Hoạt động ${minutes} phút trước`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hoạt động ${hours} giờ trước`;
  }
  return `Hoạt động ${formatRelativeTime(timestamp)}`;
}

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}
