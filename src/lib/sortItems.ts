export function sortByCreatedAt<T extends { createdAt: string | Date }>(
  items: T[], 
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    if (order === 'asc') {
      return dateA - dateB; // Oldest first
    } else {
      return dateB - dateA; // Newest first (default)
    }
  });
}