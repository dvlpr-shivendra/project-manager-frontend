export function formatRelative(date: string) {
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;

  return d.toLocaleDateString();
}

export function formatExact(date: string) {
  return new Date(date).toLocaleString();
}